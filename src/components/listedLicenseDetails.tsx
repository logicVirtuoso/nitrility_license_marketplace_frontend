import {
  Box,
  CardMedia,
  DialogContent,
  Divider,
  IconButton,
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
import CheckboxDarkIcon from 'src/assets/images/checkbox_dark.png'
import dayjs from 'dayjs'
import axios from 'axios'
import PrimaryButton from './buttons/primary-button'
import SecondaryButton from './buttons/secondary-button'
import { IPFS_METADATA_API_URL } from 'src/config'
import useAuction from 'src/hooks/useAuction'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import DownloadDarkIcon from 'src/assets/images/download_dark.png'
import { useNavigate } from 'react-router-dom'

const StyledDiv = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: 10,
  border: `1px solid ${theme.palette.grey[600]}`,
  padding: 16,
}))

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

export default function ListedLicenseDetails({
  open,
  setOpen,
  license,
}: Props) {
  const navigate = useNavigate()
  const theme = useTheme()
  const { tokenPrice } = useTokenPrice()
  const [loading, setLoading] = useState<boolean>(true)
  const [syncData, setSyncData] = useState<TemplateDataIF>()
  const [metaData, setMetaData] = useState<any>()
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const [listingStatus, setListingStatus] = useState<Array<any>>([])
  const [curLicensingType, setCurLicensingType] = useState<number>()
  const handleClose = () => {
    setOpen(false)
  }

  // useEffect(() => {
  //   const init = async () => {
  //     setLoading(true)
  //     try {
  //       setSyncData(getSyncData(offer.licensingType, license))
  //       if (offer.licensingType > LicensingTypes.Creator) {
  //         const metaRes = await axios.get(
  //           `${IPFS_METADATA_API_URL}/${offer.tokenURI}`,
  //         )
  //         setMetaData(metaRes.data.metadata.properties)
  //       }
  //       const { success, data, msg } = await getBuyerPlatform(offer.buyerAddr)
  //       if (success) {
  //         setBuyerCompany(data.companyInfo)
  //       } else {
  //         toast.error(msg)
  //       }
  //     } catch (e) {
  //       toast.error(e.message)
  //       setOpen(false)
  //     }
  //     setLoading(false)
  //   }
  //   if (offer && license) init()
  // }, [license, setOpen, offer])

  useEffect(() => {
    const availableLicensingTypes = license?.listingStatus?.filter(
      (item) => item.status == 1,
    )
    console.log(availableLicensingTypes)
    setListingStatus(availableLicensingTypes)
    setCurLicensingType(availableLicensingTypes[0]?.status)
  }, [license])

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
                License details
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

                    {license.artists.map(
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
                              license.artists?.length == index + 1 ? '' : ', '
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
                      Purchase price
                    </Typography>
                    <Typography
                      fontSize={16}
                      fontFamily={'var(--font-bold)'}
                      color={theme.palette.containerSecondary.contrastText}
                      textAlign={'right'}
                    >
                      ${(license.offerPrice * tokenPrice).toLocaleString()}
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

              {!loading && (
                <StyledDiv>
                  <Typography
                    fontSize={14}
                    color={theme.palette.text.secondary}
                  >
                    License type
                  </Typography>
                </StyledDiv>
              )}

              <StyledDiv>
                <Typography fontSize={14} color={theme.palette.text.secondary}>
                  Seller Profiles
                </Typography>

                <Box display={'flex'} flexDirection={'column'} gap={1}>
                  {license.artists.map(
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

            {!loading && curLicensingType > LicensingTypes.Creator && (
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

          {curLicensingType > LicensingTypes.Creator && (
            <>
              <Box p={3}>
                <Typography variant="h5" color={theme.palette.text.primary}>
                  By accepting this offer, this song will no longer be up for
                  sale to other users under the Creator Masters license type.
                </Typography>

                <Box display={'flex'} alignItems={'center'} gap={0.5} pt={3}>
                  <CardMedia
                    image={CheckboxDarkIcon}
                    component={'img'}
                    sx={{ width: 18, height: 18 }}
                  />
                  <Typography fontSize={14} color={theme.palette.grey[300]}>
                    I accept this exclusive license offer and it’s{' '}
                    <Typography
                      component={'span'}
                      fontSize={14}
                      color={theme.palette.success.light}
                    >
                      terms and conditions
                    </Typography>
                  </Typography>
                </Box>
              </Box>

              <Divider />
            </>
          )}

          <Box
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            gap={1}
            px={3}
            pt={2}
            pb={3}
            bgcolor={theme.palette.secondary.main}
          >
            <Box
              display={'flex'}
              alignItems={'center'}
              justifyContent={'space-between'}
              gap={1}
            >
              <Typography
                fontFamily={'var(--font-family)'}
                fontSize={16}
                color={theme.palette.grey[200]}
              >
                Make changes to your listing
              </Typography>
              <PrimaryButton
                sx={{ maxWidth: 63, width: '100%', height: 40 }}
                onClick={() =>
                  navigate('/license/setting', {
                    state: {
                      ...license,
                      licensingTyp: curLicensingType,
                    },
                  })
                }
              >
                Edit
              </PrimaryButton>
            </Box>

            <Box display={'flex'} alignItems={'center'}>
              <Typography
                fontFamily={'var(--font-family)'}
                fontSize={16}
                color={theme.palette.grey[200]}
              >
                Download usage rights PDF
              </Typography>
              <CardMedia
                component={'img'}
                image={DownloadDarkIcon}
                sx={{
                  width: 15,
                  height: 15,
                }}
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  )
}
