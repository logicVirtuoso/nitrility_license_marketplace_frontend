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
import { TemplateDataIF, LicensingTypes, AccessLevel } from 'src/interface'
import { useEffect, useState } from 'react'
import { useTokenPrice } from 'src/hooks/useTokenPrice'
import { getSyncData } from 'src/utils/utils'
import { StyledImage } from 'src/components/styledImage'
import CloseDarkIcon from 'src/assets/images/close_dark.png'
import OpenBrowserDarkIcon from 'src/assets/images/open_browser_dark.png'
import DownloadDarkIcon from 'src/assets/images/download_dark.png'
import dayjs from 'dayjs'
import { StyledSelectFC } from './styledInput'
import toast from 'react-hot-toast'
import { getBuyerPlatform, getMusicFromSpotify } from 'src/api'
import { API_URL, IPFS_METADATA_API_URL, licensingTypeList } from 'src/config'
import fileDownload from 'js-file-download'
import axios from 'axios'
import PrimaryButton from './buttons/primary-button'
import { SupplyFormat } from 'src/interface'
import { useNavigate } from 'react-router-dom'

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
  license: any
  open: boolean
  setOpen: (open: boolean) => void
}

export default function LicenseHistoryDetails({
  open,
  setOpen,
  license,
}: Props) {
  const theme = useTheme()
  const navigate = useNavigate()
  const { tokenPrice } = useTokenPrice()
  const [typeOfMusic, setTypeOfMusic] = useState<string>(extentions[0])
  const [metaData, setMetaData] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)
  const [syncData, setSyncData] = useState<TemplateDataIF>()
  const [buyerCompany, setBuyerCompany] = useState<any>()
  const handleClose = () => {
    setOpen(false)
  }

  const downloadHandler = async () => {
    const toastDownloading = toast.loading('Downloading License...')
    try {
      const downloadRes = await getMusicFromSpotify(license.trackId)
      if (downloadRes.status === 200 && downloadRes.data.success) {
        try {
          const res = await axios.get(`${API_URL}${downloadRes.data.data}`, {
            responseType: 'blob',
          })

          await fileDownload(res.data, `${license.licenseName}.mp3`)
          toast.success('Successfully Downloaded', {
            id: toastDownloading,
          })
        } catch (e) {
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

  const typeOfMusicHandler = (event) => {
    const {
      target: { value },
    } = event
    setTypeOfMusic(value)
  }

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        setSyncData(getSyncData(license.licensingType, license.listedLicense))
        if (license.licensingType > LicensingTypes.Creator) {
          const metaRes = await axios.get(
            `${IPFS_METADATA_API_URL}/${license.tokenURI}`,
          )
          setMetaData(metaRes.data.metadata.properties)
        }
        const { success, data, msg } = await getBuyerPlatform(
          license.buyerAddress,
        )
        if (success) {
          setBuyerCompany(data.companyInfo)
        } else {
          toast.error(msg)
        }
      } catch (e) {
        toast.error(e.message)
        setOpen(false)
      }
      setLoading(false)
    }
    if (license) init()
  }, [license, setOpen])

  return (
    <BootstrapDialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogContent sx={{ position: 'relative' }}>
        <Box bgcolor={theme.palette.containerPrimary.main}>
          <Box display={'flex'} flexDirection={'column'}>
            <Box pt={3} px={4}>
              <Typography
                sx={{
                  fontFamily: 'var(--font-semi-bold)',
                  fontSize: 21,
                  color: theme.palette.text.primary,
                }}
              >
                License Details
              </Typography>
            </Box>
            <Box display={'flex'} p={3} gap={2}>
              <StyledImage src={license.imagePath} />

              <Box
                display={'flex'}
                flexDirection={'column'}
                justifyContent={'center'}
                gap={0.5}
                width="100%"
              >
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
                  {licensingTypeList[license.licensingType].label}
                </Typography>
                <Box
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                >
                  <Box
                    display={'flex'}
                    flexDirection={'column'}
                    gap={0.5}
                    px={0.5}
                  >
                    <Typography
                      lineHeight="24px"
                      fontSize={'16px'}
                      fontFamily={'var(--font-bold)'}
                      color={theme.palette.containerSecondary.contrastText}
                    >
                      {license.licenseName}
                    </Typography>

                    {license.listedLicense.artists.map(
                      (artist: { name: string }, index: number) => {
                        return (
                          <Typography
                            sx={{
                              lineHeight: '16px',
                              fontFamily: 'var(--font-base)',
                              fontSize: '12px',
                              color: theme.palette.text.secondary,
                              whiteSpace: 'nowrap',
                            }}
                            component={'span'}
                            key={index}
                          >
                            {`${artist.name} ${
                              license.listedLicense.artists?.length == index + 1
                                ? ''
                                : ', '
                            }`}
                          </Typography>
                        )
                      },
                    )}
                  </Box>
                  <Box display="flex" flexDirection={'column'}>
                    <Typography
                      variant="subtitle1"
                      color={theme.palette.text.secondary}
                    >
                      Purchasing price
                    </Typography>
                    <Typography
                      fontSize={16}
                      fontFamily={'var(--font-bold)'}
                      color={theme.palette.containerSecondary.contrastText}
                      textAlign={'right'}
                    >
                      ${(license.price * tokenPrice).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

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
              pt={3}
              pb={4}
              position={'relative'}
            >
              <Typography
                sx={{
                  fontFamily: 'var(--font-semi-bold)',
                  fontSize: 16,
                  color: theme.palette.text.primary,
                }}
              >
                Sale Details
              </Typography>

              <IconButton
                sx={{
                  position: 'absolute',
                  right: 14,
                  top: 14,
                }}
                onClick={handleClose}
              >
                <CardMedia image={CloseDarkIcon} component={'img'} />
              </IconButton>

              {/* Buyer Company Details */}
              {license.licensingType >= LicensingTypes.Creator &&
                buyerCompany && (
                  <Box
                    display={'flex'}
                    flexDirection={'column'}
                    borderRadius={2.5}
                    border={`1px solid ${theme.palette.grey[600]}`}
                    p={2}
                  >
                    <Typography
                      fontSize={14}
                      color={theme.palette.text.primary}
                    >
                      Buyer's Company Details
                    </Typography>
                    <Box
                      display={'flex'}
                      alignItems={'center'}
                      justifyContent={'space-between'}
                    >
                      <Typography
                        fontSize={14}
                        color={theme.palette.text.secondary}
                      >
                        Name
                      </Typography>

                      <Typography
                        fontSize={14}
                        fontFamily={'var(--font-semi-bold)'}
                        color={theme.palette.text.secondary}
                      >
                        {buyerCompany.companyName}
                      </Typography>
                    </Box>

                    <Box
                      display={'flex'}
                      alignItems={'center'}
                      justifyContent={'space-between'}
                    >
                      <Typography
                        fontSize={14}
                        color={theme.palette.text.secondary}
                      >
                        Registration Number
                      </Typography>

                      <Typography
                        fontSize={14}
                        fontFamily={'var(--font-semi-bold)'}
                        color={theme.palette.text.secondary}
                      >
                        {buyerCompany.registrationNumber}
                      </Typography>
                    </Box>
                  </Box>
                )}

              {/* Seller Profiles */}
              <StyledDiv>
                <Typography fontSize={14} color={theme.palette.text.secondary}>
                  Seller Profiles
                </Typography>

                <Box display={'flex'} flexDirection={'column'} gap={1}>
                  {license.listedLicense.artists.map(
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

              {!loading && (
                <>
                  {license.licensingType <= LicensingTypes.Creator ? (
                    <StyledDiv>
                      <Typography
                        fontSize={14}
                        color={theme.palette.text.secondary}
                      >
                        Marketplace Price ($)
                      </Typography>

                      <Typography
                        fontSize={14}
                        fontFamily={'var(--font-semi-bold)'}
                      >
                        ${(syncData.fPrice * tokenPrice).toLocaleString()}
                      </Typography>
                    </StyledDiv>
                  ) : (
                    <StyledDiv>
                      <Typography
                        fontSize={14}
                        color={theme.palette.text.secondary}
                      >
                        {syncData.accessLevel !== AccessLevel.Exclusive
                          ? 'Non-Exclusive Price'
                          : 'Exclusive Price'}
                      </Typography>

                      <Typography
                        fontSize={14}
                        fontFamily={'var(--font-semi-bold)'}
                      >
                        $
                        {syncData.accessLevel !== AccessLevel.Exclusive
                          ? (syncData.fPrice * tokenPrice).toLocaleString()
                          : (syncData.sPrice * tokenPrice).toLocaleString()}
                      </Typography>
                    </StyledDiv>
                  )}
                </>
              )}

              {!loading && license.licensingType > LicensingTypes.Creator && (
                <StyledDiv>
                  <Typography
                    fontSize={14}
                    color={theme.palette.text.secondary}
                  >
                    Supply
                  </Typography>

                  <Typography
                    fontSize={14}
                    fontFamily={'var(--font-semi-bold)'}
                  >
                    {syncData?.infiniteSupply
                      ? SupplyFormat.Infinite
                      : syncData.totalSupply}
                  </Typography>
                </StyledDiv>
              )}

              {license.licensingType <= LicensingTypes.Creator && (
                <StyledDiv>
                  <Typography
                    fontSize={14}
                    color={theme.palette.text.secondary}
                  >
                    Purchase Date
                  </Typography>

                  <Typography
                    fontSize={14}
                    fontFamily={'var(--font-semi-bold)'}
                  >
                    {dayjs(license.createdAt).format('MM/DD/YYYY')}
                  </Typography>
                </StyledDiv>
              )}
            </Box>

            {!loading && license.licensingType > LicensingTypes.Creator && (
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
                  <Box display={'flex'} flexDirection={'column'} gap={1}>
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
                        License cannot be used in any violent or sexually
                        explicit forms of media
                      </Typography>
                    </Box>
                  </Box>
                </StyledDiv>

                <StyledDiv>
                  <Typography
                    fontSize={14}
                    color={theme.palette.text.secondary}
                  >
                    Content Title
                  </Typography>

                  <Typography
                    fontSize={14}
                    fontFamily={'var(--font-semi-bold)'}
                  >
                    {metaData.contentTitle.description}
                  </Typography>
                </StyledDiv>

                <StyledDiv>
                  <Typography
                    fontSize={14}
                    color={theme.palette.text.secondary}
                  >
                    Intended Platforms
                  </Typography>

                  <Typography
                    fontSize={14}
                    fontFamily={'var(--font-semi-bold)'}
                  >
                    {metaData.intendedPlatforms.description}
                  </Typography>
                </StyledDiv>

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
                      Additional Information on License Usage
                    </Typography>
                    <Box
                      bgcolor={theme.palette.secondary.main}
                      pt={1}
                      px={1.5}
                      pb={3}
                      borderRadius={1}
                      width={'100%'}
                    >
                      <Typography
                        variant="body2"
                        color={theme.palette.text.primary}
                      >
                        {metaData.licenseUsage.description}
                      </Typography>
                    </Box>
                  </Box>
                </StyledDiv>
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
            <Typography
              fontSize={16}
              fontFamily={'var(--font-semi-bold)'}
              color={theme.palette.text.primary}
            >
              Download File
            </Typography>
            <Box display={'flex'} alignItems={'center'} gap={1} width={'100%'}>
              <StyledSelectFC
                select
                value={typeOfMusic}
                onChange={typeOfMusicHandler}
              >
                {extentions.map((item, idx) => (
                  <MenuItem key={idx} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </StyledSelectFC>
              <PrimaryButton
                sx={{ maxWidth: 110, width: '100%' }}
                onClick={downloadHandler}
              >
                Download
              </PrimaryButton>
            </Box>
            {license.licensingType > LicensingTypes.Creator && (
              <Box display={'flex'} alignItems={'center'} gap={1} pt={1}>
                <Typography fontFamily={'var(--font-semi-bold)'} fontSize={16}>
                  Download usage rights PDF
                </Typography>
                <CardMedia
                  image={DownloadDarkIcon}
                  component={'img'}
                  sx={{
                    width: 18,
                    height: 18,
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  )
}
