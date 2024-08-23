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
import {
  TemplateDataIF,
  LicensingTypes,
  AccessLevel,
  CommonLicenseDataIF,
  UsageDetailIF,
  OfferTypes,
  ReviewStatus,
  EventTypes,
} from 'src/interface'
import { useEffect, useState } from 'react'
import CloseDarkIcon from 'src/assets/images/close_dark.png'
import OpenBrowserDarkIcon from 'src/assets/images/open_browser_dark.png'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import {
  accpetOfferBySeller,
  getBuyerPlatform,
  rejectOfferBySeller,
  withdrawCounterOffer,
} from 'src/api'
import axios from 'axios'
import PrimaryButton from '../buttons/primary-button'
import SecondaryButton from '../buttons/secondary-button'
import { IPFS_METADATA_API_URL, licensingTypeList } from 'src/config'
import useAuction from 'src/hooks/useAuction'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import DotDarkIcon from 'src/assets/images/dot_dark.svg'
import OfferDescription from './offerDescription'
import useUtils from 'src/hooks/useUtils'
import StrokeDarkIcon from 'src/assets/images/stroke_dark.svg'
import MediaDetails from './mediaDetails'
import DownloadDarkIcon from 'src/assets/images/download_dark.png'
import { useNavigate } from 'react-router-dom'
import ConfirmWithdrawalDlg from 'src/pages/profile/licenseOffers/confirmOfferWithdrawal'
import ConfirmDlg from './confirmDlg'
import useListingLicense from 'src/hooks/useListingLicense'

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
      <Box display={'flex'} alignItems={'center'} gap={2} maxWidth={240}>
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
            <Typography
              component={'span'}
              fontSize={12}
              color={theme.palette.text.secondary}
              whiteSpace={'nowrap'}
              textOverflow={'ellipsis'}
              overflow={'hidden'}
              maxWidth={120}
            >
              · {commonLicenseData.albumName}
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

export enum OfferDetailsHandlerTypes {
  MakeChanges,
  CounterOffer,
  None,
}

interface Props {
  offer: any
  commonLicenseData: CommonLicenseDataIF
  open: boolean
  setOpen: (open: boolean) => void
  handler?: (type: OfferDetailsHandlerTypes) => void
}

export default function OfferDetailsDlg({
  open,
  setOpen,
  offer,
  commonLicenseData,
  handler,
}: Props) {
  const theme = useTheme()
  const navigate = useNavigate()

  const expired = offer.offerDuration > Date.now() ? false : true
  const { etherToUsd } = useUtils()
  const [loading, setLoading] = useState<boolean>(true)
  const [syncData, setSyncData] = useState<TemplateDataIF>()
  const [usageDetails, setUsageDetails] = useState<UsageDetailIF>()
  const { acceptOffer, rejectOfferByBuyer, editOffer } = useAuction()
  const { signLicenseData } = useListingLicense()
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const [buyerProfile, setBuyerProfile] = useState({
    name: '',
    companyInfo: null,
    email: '',
  })
  const [openConfirmWithdrawalDlg, setOpenConfirmWithdrawalDlg] =
    useState<boolean>(false)
  const [openConfirmDlg, setOpenConfirmDlg] = useState<boolean>(false)
  const [showOwnerControls, setShowOwnerControls] = useState<boolean>(false)
  const [isSeller, setIsSeller] = useState<boolean>(false)

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    const shouldShowOwnerControls = () => {
      const bSeller = authorization.currentUser.sellerId == offer.sellerId
      setIsSeller(bSeller)
      if (offer.offerType === OfferTypes.GeneralOffer) {
        return bSeller
      } else {
        if (bSeller) {
          return offer.sellerStatus !== ReviewStatus.Approved
        } else {
          return offer.buyerStatus !== ReviewStatus.Approved
        }
      }
    }

    setShowOwnerControls(shouldShowOwnerControls())
  }, [offer, authorization.currentUser])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        setSyncData(offer.purchasedSigningData)
        if (offer.licensingType > LicensingTypes.Creator) {
          const metaRes = await axios.get(
            `${IPFS_METADATA_API_URL}/${offer.purchasedTokenURI}`,
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
        const { success, data, msg } = await getBuyerPlatform(offer.buyerAddr)
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
    if (offer) init()
  }, [setOpen, offer])

  const acceptOfferHandler = async () => {
    setOpen(false)
    const tLoading = toast.loading('accepting offer...')
    try {
      if (offer.offerType == OfferTypes.GeneralOffer && isSeller) {
        const signature = await signLicenseData(
          offer.purchasedSigningData,
          commonLicenseData.sellerId,
        )
        const signingData = { ...offer.purchasedSigningData, signature }
        const { success, msg } = await accpetOfferBySeller(
          offer.offerId,
          signingData,
        )
        if (success) {
          toast.success(msg, { id: tLoading })
        } else {
          toast.error(msg, {
            id: tLoading,
          })
        }
      } else {
        const success = await acceptOffer(
          offer.offerId,
          offer.accessLevel,
          syncData,
          commonLicenseData.sellerId,
        )
        if (success) {
          toast.success('Accepted the offer', { id: tLoading })
        } else {
          toast.error('Something went wrong', {
            id: tLoading,
          })
        }
      }
    } catch (e) {
      console.log('error in offer details dialog', e.message)
      toast.error(e.message, {
        id: tLoading,
      })
    }
  }

  const rejectOfferHandler = async () => {
    const tLoading = toast.loading('rejecting offer...')
    try {
      let result
      if (isSeller) {
        result = await rejectOfferBySeller(offer.offerId)
      } else {
        result = await rejectOfferByBuyer(offer.offerId)
      }
      const { success, msg } = result
      if (success) {
        setOpen(false)
        toast.success(msg, { id: tLoading })
      } else {
        toast.error(msg, {
          id: tLoading,
        })
      }
    } catch (e) {
      toast.error(e.message, {
        id: tLoading,
      })
    }
  }

  const withdrawOfferHandler = async () => {
    setOpenConfirmWithdrawalDlg(false)
    const tLoading = toast.loading('Withdrawing offer...')
    try {
      let result
      if (offer.offerType == OfferTypes.GeneralOffer) {
        result = await rejectOfferByBuyer(offer.offerId)
      } else {
        if (isSeller) {
          result = await withdrawCounterOffer(offer.offerId)
        } else {
          const lastOne = offer.preOffers.pop()
          result = await editOffer(
            offer.offerId,
            lastOne.offerPrice,
            lastOne.offerDuration,
            lastOne.tokenURI,
            EventTypes.OfferWithdrawn,
          )
        }
      }
      const { success, msg } = result
      if (success) {
        setOpen(false)
        toast.success(msg, { id: tLoading })
      } else {
        toast.error(msg, {
          id: tLoading,
        })
      }
    } catch (e) {
      toast.error(e.message, {
        id: tLoading,
      })
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
                accessLevel={offer.accessLevel}
                licensingType={offer.licensingType}
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
              <OfferDescription licensingType={offer.licensingType} />
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
                  Time of Offer
                </Typography>

                <Typography fontSize={14} fontFamily={'var(--font-semi-bold)'}>
                  {dayjs(offer.createdAt).format('M/D/YYYY h a [EST]')}
                </Typography>
              </StyledDiv>
              <StyledDiv>
                <Typography fontSize={14} color={theme.palette.text.secondary}>
                  Offer Expiration
                </Typography>

                <Typography fontSize={14} fontFamily={'var(--font-semi-bold)'}>
                  {dayjs(offer.offerDuration).format('M/D/YYYY h a [EST]')}
                </Typography>
              </StyledDiv>
              <StyledDiv>
                <Typography fontSize={14} color={theme.palette.text.secondary}>
                  Purchase Price
                </Typography>

                <Typography fontSize={14} fontFamily={'var(--font-semi-bold)'}>
                  ${etherToUsd(offer.offerPrice).toLocaleString()}
                </Typography>
              </StyledDiv>
              {!loading && (
                <>
                  <StyledDiv>
                    <Typography
                      fontSize={14}
                      color={theme.palette.text.secondary}
                    >
                      Purchase Type
                    </Typography>

                    <Typography
                      fontSize={14}
                      fontFamily={'var(--font-semi-bold)'}
                    >
                      {`${usageDetails.projectType} Project`}
                    </Typography>
                  </StyledDiv>

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

                <Box
                  display={'flex'}
                  alignItems={'center'}
                  gap={0.5}
                  sx={{
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    navigate(
                      `/info-pub-profile/${offer.buyerAddr}/${authorization.currentUser.sellerId}`,
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
              </StyledDiv>

              <StyledDiv>
                <Typography fontSize={14} color={theme.palette.text.secondary}>
                  Seller Profiles
                </Typography>

                <Box display={'flex'} flexDirection={'column'} gap={1}>
                  {offer.listedLicense.artists.map(
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

                {offer.licensingType != LicensingTypes.Creator && (
                  <MediaDetails
                    licensingType={offer.licensingType}
                    usageDetails={usageDetails}
                  />
                )}
              </Box>
            )}
          </Box>

          <Divider />

          {offer.eventType == EventTypes.OfferPlaced ||
          offer.eventType == EventTypes.OfferEdited ||
          offer.eventType == EventTypes.OfferWithdrawn ? (
            <>
              {showOwnerControls ? (
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  gap={1}
                  px={3}
                  pt={2}
                  pb={3}
                  bgcolor={theme.palette.secondary.main}
                >
                  <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    gap={0.5}
                  >
                    <Typography
                      fontSize={16}
                      fontWeight={600}
                      color={theme.palette.success.light}
                    >
                      Download usage rights PDF Preview
                    </Typography>

                    <CardMedia
                      component={'img'}
                      image={DownloadDarkIcon}
                      sx={{ width: 18, height: 18 }}
                    />
                  </Box>

                  <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    gap={1}
                    pt={2}
                  >
                    <PrimaryButton
                      sx={{ width: '100%', height: 40 }}
                      // disabled={expired}
                      onClick={() => setOpenConfirmDlg(true)}
                    >
                      Accept offer
                    </PrimaryButton>

                    <SecondaryButton
                      sx={{
                        width: '100%',
                        height: 40,
                        backgroundColor: theme.palette.grey[600],
                      }}
                      // disabled={expired}
                      onClick={rejectOfferHandler}
                    >
                      Reject offer
                    </SecondaryButton>

                    <SecondaryButton
                      sx={{
                        width: '100%',
                        height: 40,
                        backgroundColor: theme.palette.grey[600],
                      }}
                      // disabled={expired}
                      onClick={() =>
                        handler(OfferDetailsHandlerTypes.CounterOffer)
                      }
                    >
                      Counter offer
                    </SecondaryButton>
                  </Box>
                </Box>
              ) : (
                <Box
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  py={2}
                >
                  <Box display={'flex'} alignItems={'center'} gap={1}>
                    <PrimaryButton
                      onClick={() =>
                        handler(OfferDetailsHandlerTypes.MakeChanges)
                      }
                    >
                      Make changes
                    </PrimaryButton>
                    <SecondaryButton
                      onClick={() => setOpenConfirmWithdrawalDlg(true)}
                    >
                      Withdraw offer
                    </SecondaryButton>
                  </Box>

                  <ConfirmWithdrawalDlg
                    open={openConfirmWithdrawalDlg}
                    setOpen={setOpenConfirmWithdrawalDlg}
                    confirmWithdraw={withdrawOfferHandler}
                  />
                </Box>
              )}
            </>
          ) : (
            <Box
              display={'flex'}
              flexDirection={'column'}
              gap={1}
              px={3}
              pt={2}
              pb={3}
              bgcolor={theme.palette.secondary.main}
            >
              <Box display={'flex'} alignItems={'center'} gap={0.5}>
                <Typography
                  fontSize={16}
                  fontWeight={600}
                  color={theme.palette.success.light}
                >
                  Download usage rights PDF Preview
                </Typography>

                <CardMedia
                  component={'img'}
                  image={DownloadDarkIcon}
                  sx={{ width: 18, height: 18 }}
                />
              </Box>
            </Box>
          )}

          <ConfirmDlg
            open={openConfirmDlg}
            setOpen={setOpenConfirmDlg}
            confrim={acceptOfferHandler}
          />
        </Box>
      </DialogContent>
    </BootstrapDialog>
  )
}
