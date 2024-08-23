import {
  Box,
  CardMedia,
  DialogContent,
  Divider,
  IconButton,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import {
  TemplateDataIF,
  LicensingTypes,
  AccessLevel,
  CommonLicenseDataIF,
  UsageDetailIF,
} from 'src/interface'
import { useEffect, useState } from 'react'
import { getCommonLicenseData, getSyncData } from 'src/utils/utils'
import CloseDarkIcon from 'src/assets/images/close_dark.png'
import OpenBrowserDarkIcon from 'src/assets/images/open_browser_dark.png'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { getBuyerPlatform, getMusicFromSpotify } from 'src/api'
import axios from 'axios'
import PrimaryButton from '../buttons/primary-button'
import { API_URL, IPFS_METADATA_API_URL, licensingTypeList } from 'src/config'
import DotDarkIcon from 'src/assets/images/dot_dark.svg'
import useUtils from 'src/hooks/useUtils'
import StrokeDarkIcon from 'src/assets/images/stroke_dark.svg'
import MediaDetails from './mediaDetails'
import DownloadDarkIcon from 'src/assets/images/download_dark.png'
import { useNavigate } from 'react-router-dom'
import OfferDescription from './offerDescription'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { StyledSelectFC } from '../styledInput'
import fileDownload from 'js-file-download'

const LicenseDetails = ({
  commonLicenseData,
  accessLevel,
  licensingType,
}: {
  commonLicenseData: CommonLicenseDataIF
  accessLevel: AccessLevel
  licensingType: LicensingTypes
}) => {
  const theme = useTheme()
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent={'space-between'}
      py={2}
      px={3}
    >
      <Box display={'flex'} alignItems={'center'} gap={2}>
        <CardMedia
          component={'img'}
          image={commonLicenseData.imagePath}
          sx={{
            width: 80,
            height: 80,
            borderRadius: 2,
          }}
        />

        <Box display={'flex'} flexDirection={'column'}>
          <Typography
            sx={{
              color: theme.palette.success.light,
              borderRadius: '56px',
              backgroundColor: theme.palette.grey[600],
              p: '2px 8px',
              fontSize: '12px',
              fontFamily: 'var(--font-medium)',
              lineHeight: '16px',
              width: 'fit-content',
            }}
          >
            {licensingTypeList[licensingType].label}
          </Typography>

          <Typography
            fontSize={'16px'}
            fontFamily={'var(--font-bold)'}
            color={theme.palette.containerSecondary.contrastText}
          >
            {commonLicenseData.licenseName}
          </Typography>

          <Box display={'flex'} alignItems={'center'} gap={0.5}>
            {commonLicenseData.artists.map(
              (artist: { name: string }, index: number) => {
                return (
                  <Typography
                    sx={{
                      lineHeight: '16px',
                      fontSize: '12px',
                      color: theme.palette.text.secondary,
                      whiteSpace: 'nowrap',
                    }}
                    component={'span'}
                    key={index}
                  >
                    {`${artist.name} ${
                      commonLicenseData.artists?.length == index + 1 ? '' : ', '
                    }`}
                  </Typography>
                )
              },
            )}

            <CardMedia
              component={'img'}
              image={DotDarkIcon}
              sx={{ width: 2, height: 2 }}
            />
            <Typography
              component={'span'}
              fontSize={12}
              color={theme.palette.text.secondary}
              whiteSpace={'nowrap'}
              textOverflow={'ellipsis'}
              overflow={'hidden'}
              maxWidth={120}
            >
              {commonLicenseData.albumName}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box display={'flex'} flexDirection={'column'} gap={0.5}>
        <Typography variant="subtitle1" color={theme.palette.text.secondary}>
          License Type
        </Typography>
        <Typography
          align="right"
          sx={{
            fontFamily: 'var(--font-bold)',
            fontSize: '16px',
            color: theme.palette.containerSecondary.contrastText,
          }}
        >
          {accessLevel === AccessLevel.Exclusive ? 'Exclusive' : 'Nonexclusive'}
        </Typography>
      </Box>
    </Box>
  )
}

const StyledDiv = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: 10,
  border: `1px solid ${theme.palette.grey[600]}`,
  padding: 16,
}))

const extentions = ['MP3', 'MP4', 'AVI']

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: 0,
    backgroundColor: theme.palette.secondary.main,
    border: 'none',
    borderRadius: 12,
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    backgroundColor: theme.palette.secondary.main,
    maxWidth: 500,
    borderRadius: 12,
  },
}))

interface Props {
  isSeller: boolean
  purchasedLicense: any
  open: boolean
  setOpen: (open: boolean) => void
}

export default function PurchasedLicenseDetailsDlg({
  isSeller,
  open,
  setOpen,
  purchasedLicense,
}: Props) {
  const theme = useTheme()
  const navigate = useNavigate()
  const { etherToUsd } = useUtils()
  const [typeOfMusic, setTypeOfMusic] = useState<string>(extentions[0])
  const [loading, setLoading] = useState<boolean>(true)
  const [syncData, setSyncData] = useState<TemplateDataIF>()
  const [usageDetails, setUsageDetails] = useState<UsageDetailIF>()
  const [commonLicenseData, setCommonLicenseData] =
    useState<CommonLicenseDataIF>()
  const [buyerProfile, setBuyerProfile] = useState({
    name: '',
    email: '',
    companyInfo: null,
  })

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        setCommonLicenseData(getCommonLicenseData(purchasedLicense))
        setSyncData(
          getSyncData(
            purchasedLicense.licensingType,
            purchasedLicense.listedLicense.signingData,
          ),
        )
        if (purchasedLicense.licensingType > LicensingTypes.Creator) {
          const metaRes = await axios.get(
            `${IPFS_METADATA_API_URL}/${purchasedLicense.purchasedTokenURI}`,
          )
          setUsageDetails({
            projectType: metaRes.data.metadata.properties.projectType,
            releaseDate: metaRes.data.metadata.properties.releaseDate,
            contentTitle: metaRes.data.metadata.properties.contentTitle,
            contentDescription:
              metaRes.data.metadata.properties.contentDescription,
            productionDescription:
              metaRes.data.metadata.properties.productionDescription,
            previewFiles: metaRes.data.metadata.properties.previewFiles,
            intendedPlatforms:
              metaRes.data.metadata.properties.intendedPlatforms,
            licenseUsage: metaRes.data.metadata.properties.licenseUsage,
          })
        }
        const { success, data, msg } = await getBuyerPlatform(
          purchasedLicense.buyerAddress,
        )
        if (success) {
          setBuyerProfile({
            name: data.name,
            companyInfo: data.companyInfo,
            email: data.email,
          })
        } else {
          toast.error(msg)
        }
      } catch (e) {
        toast.error(e.message)
        setOpen(false)
      }
      setLoading(false)
    }
    init()
  }, [setOpen, purchasedLicense])

  const typeOfMusicHandler = (event) => {
    setTypeOfMusic(event.target.value)
  }

  const downloadHandler = async () => {
    const toastDownloading = toast.loading('Downloading License...')
    try {
      const downloadRes = await getMusicFromSpotify(purchasedLicense.trackId)
      if (downloadRes.status === 200 && downloadRes.data.success) {
        try {
          const res = await axios.get(`${API_URL}${downloadRes.data.data}`, {
            responseType: 'blob',
          })

          await fileDownload(res.data, `${purchasedLicense.licenseName}.mp3`)
          toast.success('Successfully Downloaded', {
            id: toastDownloading,
          })
        } catch (e) {
          console.log('Failed to download the music', e)
          toast.error('Failed to download the track', {
            id: toastDownloading,
          })
        }
      } else {
        toast.error('Something went wrong', {
          id: toastDownloading,
        })
      }
    } catch (e) {
      console.log('getMusicFromSpotify Error', e)
      toast.error('Failed to get the music from Spotify', {
        id: toastDownloading,
      })
      return
    }
  }

  return (
    <BootstrapDialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogContent sx={{ position: 'relative' }}>
        <Box bgcolor={theme.palette.containerPrimary.main}>
          <Box display={'flex'} flexDirection={'column'} gap={1}>
            <Box
              display={'flex'}
              alignItems={'center'}
              justifyContent={'space-between'}
              pt={3}
              px={3}
            >
              <Typography
                sx={{
                  fontFamily: 'var(--font-semi-bold)',
                  fontSize: 21,
                  color: theme.palette.text.primary,
                }}
              >
                License details
              </Typography>

              <IconButton onClick={handleClose}>
                <CardMedia image={CloseDarkIcon} component={'img'} />
              </IconButton>
            </Box>
            {!loading && (
              <LicenseDetails
                commonLicenseData={commonLicenseData}
                accessLevel={purchasedLicense.accessLevel}
                licensingType={purchasedLicense.licensingType}
              />
            )}

            <Divider />
          </Box>
          <Box
            sx={{
              maxHeight: 468,
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            <Box
              display={'flex'}
              flexDirection={'column'}
              gap={1}
              px={3}
              pb={4}
              position={'relative'}
            >
              <OfferDescription
                licensingType={purchasedLicense.licensingType}
              />
              <Typography
                sx={{
                  fontFamily: 'var(--font-semi-bold)',
                  fontSize: 16,
                  color: theme.palette.text.primary,
                }}
              >
                Sale Details
              </Typography>
              <StyledDiv>
                <Typography fontSize={14} color={theme.palette.text.secondary}>
                  Purchase Price
                </Typography>

                <Typography fontSize={14} fontFamily={'var(--font-semi-bold)'}>
                  ${etherToUsd(purchasedLicense.price).toLocaleString()}
                </Typography>
              </StyledDiv>
              <StyledDiv>
                <Typography fontSize={14} color={theme.palette.text.secondary}>
                  Purchase Type
                </Typography>

                <Typography fontSize={14} fontFamily={'var(--font-semi-bold)'}>
                  {`${!loading && usageDetails.projectType} Project`}
                </Typography>
              </StyledDiv>
              <StyledDiv>
                <Typography fontSize={14} color={theme.palette.text.secondary}>
                  Purchase Time
                </Typography>

                <Typography fontSize={14} fontFamily={'var(--font-semi-bold)'}>
                  {dayjs(purchasedLicense.createdAt).format(
                    'M/D/YYYY h a [EST]',
                  )}
                </Typography>
              </StyledDiv>
              {!loading && (
                <>
                  <StyledDiv>
                    <Box display={'flex'} alignItems={'center'} gap={0.5}>
                      <Typography
                        fontSize={14}
                        color={theme.palette.text.secondary}
                      >
                        Exclusive Until
                      </Typography>
                      <CardMedia
                        component={'img'}
                        image={StrokeDarkIcon}
                        sx={{ width: 12, objectFit: 'cover' }}
                      />
                    </Box>

                    <Typography
                      fontSize={14}
                      fontFamily={'var(--font-semi-bold)'}
                    >
                      {dayjs(syncData.exclusiveEndTime).format(
                        'M/D/YYYY h a [EST]',
                      )}
                    </Typography>
                  </StyledDiv>
                  <StyledDiv>
                    <Box display={'flex'} alignItems={'center'} gap={0.5}>
                      <Typography
                        fontSize={14}
                        color={theme.palette.text.secondary}
                      >
                        Governing Law
                      </Typography>
                      <CardMedia
                        component={'img'}
                        image={StrokeDarkIcon}
                        sx={{ width: 12, objectFit: 'cover' }}
                      />
                    </Box>

                    <Typography
                      fontSize={14}
                      fontFamily={'var(--font-semi-bold)'}
                    >
                      {`${syncData.country}, ${syncData.state}`}
                    </Typography>
                  </StyledDiv>
                </>
              )}

              {buyerProfile.companyInfo && (
                <Box
                  display={'flex'}
                  justifyContent={'space-between'}
                  borderRadius={2.5}
                  border={`1px solid ${theme.palette.grey[600]}`}
                  p={2}
                >
                  <Typography
                    fontSize={14}
                    color={theme.palette.text.secondary}
                  >
                    Buyer’s Company
                  </Typography>
                  <Typography
                    fontSize={14}
                    fontFamily={'var(--font-semi-bold)'}
                    color={theme.palette.success.light}
                  >
                    {buyerProfile.companyInfo.companyName}
                  </Typography>
                </Box>
              )}

              <StyledDiv>
                <Typography fontSize={14} color={theme.palette.text.secondary}>
                  Buyer Profile
                </Typography>

                <Box display={'flex'} flexDirection={'column'}>
                  <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'flex-end'}
                    gap={0.5}
                    sx={{
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      navigate(
                        `/info-pub-profile/${purchasedLicense.buyerAddr}/${purchasedLicense.sellerId}`,
                      )
                    }
                  >
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-semi-bold)',
                        fontSize: 14,
                        color: theme.palette.success.light,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {buyerProfile.name}
                    </Typography>

                    <CardMedia
                      component={'img'}
                      image={OpenBrowserDarkIcon}
                      sx={{
                        width: 16,
                        height: 16,
                      }}
                    />
                  </Box>
                  <CopyToClipboard text={buyerProfile.email}>
                    <Box
                      display={'flex'}
                      alignItems={'center'}
                      gap={0.5}
                      sx={{
                        cursor: 'pointer',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-semi-bold)',
                          fontSize: 14,
                          color: theme.palette.success.light,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Copy Mailing Address
                      </Typography>
                      <CardMedia
                        component={'img'}
                        image={OpenBrowserDarkIcon}
                        sx={{
                          width: 16,
                          height: 16,
                        }}
                      />
                    </Box>
                  </CopyToClipboard>
                </Box>
              </StyledDiv>

              <StyledDiv>
                <Typography fontSize={14} color={theme.palette.text.secondary}>
                  Seller Profiles
                </Typography>

                <Box display={'flex'} flexDirection={'column'} gap={1}>
                  {purchasedLicense.artists.map(
                    (artist: { name: string; id: string }, index: number) => {
                      return (
                        <Box
                          display={'flex'}
                          alignItems={'center'}
                          gap={0.5}
                          key={index}
                          sx={{ cursor: 'pointer' }}
                          onClick={() => navigate(`/pub-profile/${artist.id}`)}
                        >
                          <Typography
                            sx={{
                              fontFamily: 'var(--font-semi-bold)',
                              fontSize: 14,
                              color: theme.palette.success.light,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {artist.name}
                          </Typography>

                          <CardMedia
                            component={'img'}
                            image={OpenBrowserDarkIcon}
                            sx={{
                              width: 16,
                              height: 16,
                            }}
                          />
                        </Box>
                      )
                    },
                  )}
                </Box>
              </StyledDiv>
            </Box>

            {!loading && (
              <Box
                display={'flex'}
                flexDirection={'column'}
                gap={1}
                px={3}
                pb={4}
              >
                <Typography
                  fontSize={16}
                  fontFamily={'var(--font-semi-bold)'}
                  color={theme.palette.text.primary}
                >
                  Usage Details
                </Typography>

                <StyledDiv>
                  <Box
                    display={'flex'}
                    flexDirection={'column'}
                    gap={1}
                    width={'100%'}
                  >
                    <Typography
                      variant="body2"
                      color={theme.palette.text.secondary}
                    >
                      Usage Notes and Special Requirements
                    </Typography>
                    <Box
                      bgcolor={theme.palette.secondary.main}
                      pt={1}
                      px={1.5}
                      pb={3}
                      borderRadius={1}
                    >
                      <Typography
                        variant="body2"
                        color={theme.palette.text.primary}
                      >
                        {syncData.usageNotes}
                      </Typography>
                    </Box>
                  </Box>
                </StyledDiv>

                <MediaDetails
                  licensingType={purchasedLicense.licensingType}
                  usageDetails={usageDetails}
                />
              </Box>
            )}
          </Box>

          <Divider />

          <Box
            display={'flex'}
            flexDirection={'column'}
            gap={1}
            px={3}
            pt={2}
            pb={3}
            bgcolor={theme.palette.secondary.main}
          >
            {!isSeller && (
              <>
                <Typography
                  fontSize={16}
                  fontWeight={600}
                  color={theme.palette.containerPrimary.contrastText}
                >
                  Download Full Song
                </Typography>
                <Box display={'flex'} alignItems={'center'} gap={1}>
                  <StyledSelectFC
                    select
                    value={typeOfMusic}
                    onChange={typeOfMusicHandler}
                  >
                    {extentions.map((label, idx) => (
                      <MenuItem key={idx} value={label}>
                        {label}
                      </MenuItem>
                    ))}
                  </StyledSelectFC>

                  <PrimaryButton sx={{ width: `100px !important` }}>
                    Download
                  </PrimaryButton>
                </Box>
              </>
            )}

            <Box
              display={'flex'}
              alignItems={'center'}
              gap={1}
              mt={1}
              onClick={downloadHandler}
            >
              <Typography
                fontSize={14}
                fontWeight={600}
                color={theme.palette.success.light}
              >
                Download usage rights PDF
              </Typography>
              <CardMedia
                component={'img'}
                image={DownloadDarkIcon}
                sx={{ width: 18, height: 18 }}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  )
}
