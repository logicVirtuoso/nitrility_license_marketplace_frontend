import React, { useState, useEffect, useCallback } from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import {
  Box,
  CardMedia,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material'
import { Theme, useTheme } from '@mui/material/styles'
import { toast } from 'react-hot-toast'
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker'
import TextField from '@mui/material/TextField'
import dayjs from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import MenuItem from '@mui/material/MenuItem'
import { FormHelperText } from '@mui/material'
import { licensingTypeList } from 'src/config'
import useAuction from 'src/hooks/useAuction'
import { placeCounterOfferBySeller } from 'src/api'
import { useTokenPrice } from 'src/hooks/useTokenPrice'
import useListingLicense from 'src/hooks/useListingLicense'
import {
  BidDaysFormat,
  AccessLevel,
  bidDaysOptions,
  TemplateDataIF,
  CommonLicenseDataIF,
  EventTypes,
} from 'src/interface'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import {
  StyledOutlinedInputFC,
  StyledSelectFC,
} from 'src/components/styledInput'
import CloseDarkIcon from 'src/assets/images/close_dark.png'
import WhiteBtn from 'src/components/buttons/whiteBtn'
import BackDarkIcon from 'src/assets/images/back_dark.svg'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { getCommonLicenseData, getSyncData } from 'src/utils/utils'
import useUtils from 'src/hooks/useUtils'

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

const StyledImg = styled('img')(({ theme }) => ({
  width: '80px',
  borderRadius: '4px',
  border: `1px solid ${theme.palette.containerSecondary.main}`,
}))

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

export interface Props {
  open: boolean
  offer: any
  setOpen: (open: boolean) => void
  backForwards: () => void
  handler: (result: boolean) => void
}

export default function CounterOfferDialog({
  open,
  offer,
  setOpen,
  backForwards,
  handler,
}: Props) {
  const theme = useTheme()
  const [syncData, setSyncData] = useState<TemplateDataIF>()
  const [askingPrice, setAskingPrice] = useState<number>(0)
  const [commonLicenseData, setCommonLicenseData] =
    useState<CommonLicenseDataIF>()
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const { tokenPrice } = useTokenPrice()
  const [loading, setLoading] = useState<boolean>(true)
  const { signLicenseData } = useListingLicense()
  const { editOffer } = useAuction()
  const { usdToEther, etherToUsd } = useUtils()
  const [isSeller, setIsSeller] = useState<boolean>(false)

  useEffect(() => {
    setIsSeller(authorization.currentUser.sellerId == offer.sellerId)
  }, [offer, authorization.currentUser])

  const handleClose = () => {
    setOpen(false)
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      offerPrice: etherToUsd(offer.offerPrice),
      offerDuration: dayjs(offer.offerDuration).valueOf(),
      offerDurationType: BidDaysFormat.CustomDate,
      submit: null,
    },
    validationSchema: Yup.object().shape({
      offerPrice: Yup.number()
        .typeError('Counter offer price must be a valid number')
        .required('Counter offer price is required'),
    }),
    onSubmit: async (
      values,
      { setErrors, setStatus, setSubmitting, setFieldError },
    ) => {
      const tLoading = await toast.loading('Placing your counter offer...')

      try {
        setOpen(false)
        const offerPriceInETh = usdToEther(values.offerPrice)
        const counterSyncData: TemplateDataIF = {
          ...syncData,
          fPrice:
            offer.accessLevel == AccessLevel.Exclusive
              ? syncData.fPrice
              : offerPriceInETh,
          sPrice:
            offer.accessLevel == AccessLevel.Exclusive
              ? offerPriceInETh
              : syncData.sPrice,
        }
        if (!isSeller) {
          const { success, msg } = await editOffer(
            offer.offerId,
            offerPriceInETh,
            values.offerDuration,
            offer.purchasedTokenURI,
            EventTypes.OfferEdited,
          )
          if (success) {
            handler(success)
            toast.success(msg, { id: tLoading })
          } else {
            toast.error(msg, { id: tLoading })
          }
        } else {
          const signature = await signLicenseData(
            counterSyncData,
            commonLicenseData.sellerId,
          )
          const { success, msg } = await placeCounterOfferBySeller(
            offer.offerId,
            offerPriceInETh,
            values.offerDuration,
            {
              ...counterSyncData,
              signature,
            },
          )
          if (success) {
            handler(success)
            toast.success(msg, { id: tLoading })
          } else {
            toast.error(msg, { id: tLoading })
          }
        }

        setStatus({ success: true })
        setSubmitting(false)
      } catch (e) {
        setErrors({ submit: e.message })
        setStatus({ success: false })
        setSubmitting(false)
        toast.error(e.message, { id: tLoading })
      }
    },
  })

  const handleOfferDurationType = (event, setFieldValue, handleChange) => {
    switch (event.target.value) {
      case BidDaysFormat.HalfDay:
        setFieldValue('offerDuration', dayjs().add(12, 'hour').valueOf())
        break
      case BidDaysFormat.OneDay:
        setFieldValue('offerDuration', dayjs().add(1, 'day').valueOf())
        break
      case BidDaysFormat.ThreeDay:
        setFieldValue('offerDuration', dayjs().add(3, 'day').valueOf())
        break
      case BidDaysFormat.SevenDay:
        setFieldValue('offerDuration', dayjs().add(7, 'day').valueOf())
        break
      case BidDaysFormat.OneMonth:
        setFieldValue('offerDuration', dayjs().add(1, 'month').valueOf())
        break
      case BidDaysFormat.CustomDate:
        break
      default:
        break
    }
    handleChange(event)
  }

  const handleSubmit = async () => {
    formik.handleSubmit()
  }

  useEffect(() => {
    setLoading(true)
    const licenseData = offer.listedLicense
    setCommonLicenseData(getCommonLicenseData(licenseData))
    const syncTmp = getSyncData(
      offer.licensingType,
      offer.listedLicense.signingData,
    )
    setSyncData(syncTmp)

    if (offer.accessLevel === AccessLevel.Exclusive) {
      setAskingPrice(syncTmp.sPrice * tokenPrice)
    } else {
      setAskingPrice(syncTmp.fPrice * tokenPrice)
    }
    setLoading(false)
  }, [offer, tokenPrice])

  return (
    <BootstrapDialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth={true}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DialogContent sx={{ position: 'relative' }}>
          <IconButton
            onClick={backForwards}
            sx={{
              position: 'absolute',
              left: '24px',
              top: '24px',
            }}
          >
            <CardMedia
              component={'img'}
              image={BackDarkIcon}
              sx={{ width: 10, objectFit: 'cover' }}
            />
          </IconButton>
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

          <Box mt={7} mx={4} display={'flex'} flexDirection={'column'} gap={1}>
            <Typography
              sx={{
                fontFamily: 'var(--font-semi-bold)',
                fontSize: 21,
                color: theme.palette.text.primary,
              }}
            >
              Place Counter Offer
            </Typography>

            <Typography color={theme.palette.text.secondary} fontSize={16}>
              Make an offer to the artist based on how much you’re willing to
              pay for the license.
            </Typography>
          </Box>

          {!loading && (
            <Box display={'flex'} p={3} gap={2}>
              <StyledImg src={commonLicenseData.imagePath} />

              <Box
                display={'flex'}
                justifyContent={'space-between'}
                width={'100%'}
              >
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  justifyContent={'center'}
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
                    {licensingTypeList[offer.licensingType].label}
                  </Typography>

                  <Typography
                    lineHeight="24px"
                    fontSize={'16px'}
                    fontWeight={700}
                    color={theme.palette.containerSecondary.contrastText}
                  >
                    {commonLicenseData.licenseName}
                  </Typography>

                  <Box display={'flex'} alignItems={'center'} gap={1}>
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
                              commonLicenseData.artists?.length == index + 1
                                ? ''
                                : ', '
                            }`}
                          </Typography>
                        )
                      },
                    )}
                    <Typography
                      component={'span'}
                      fontSize={12}
                      color={theme.palette.text.secondary}
                    >
                      · {commonLicenseData.albumName}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  justifyContent={'end'}
                  pt={3}
                >
                  <Typography
                    variant="subtitle2"
                    textAlign={'right'}
                    color={theme.palette.text.secondary}
                  >
                    Asking Price
                  </Typography>
                  <Typography
                    variant="body1"
                    textAlign={'right'}
                    color={theme.palette.text.primary}
                  >
                    ${askingPrice.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          <Divider />

          <form
            noValidate
            className="innerContainer"
            onSubmit={formik.handleSubmit}
          >
            <Box display={'flex'} flexDirection={'column'} p={3} gap={1.5}>
              <Box display={'flex'} flexDirection={'column'} gap={1}>
                <Typography
                  fontWeight={600}
                  fontSize={16}
                  color={theme.palette.text.primary}
                >
                  Bid Details
                </Typography>
                <Box display={'flex'} justifyContent={'space-between'}>
                  <Typography
                    fontSize={16}
                    fontWeight={400}
                    color={theme.palette.text.secondary}
                  >
                    Offer Price
                  </Typography>
                  <Typography
                    fontSize={16}
                    fontWeight={600}
                    color={theme.palette.text.primary}
                  >
                    ${etherToUsd(offer.offerPrice).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <Box display={'flex'} flexDirection={'column'} gap={2}>
                <Typography
                  variant="body1"
                  fontFamily={'var(--font-semi-bold)'}
                >
                  Counter Offer Price
                </Typography>
                <StyledOutlinedInputFC
                  fullWidth
                  error={Boolean(
                    formik.touched.offerPrice && formik.errors.offerPrice,
                  )}
                  type="number"
                  value={formik.values.offerPrice}
                  name="offerPrice"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                />
                {formik.touched.offerPrice && formik.errors.offerPrice && (
                  <FormHelperText error id="helper-text-offerPrice">
                    {formik.errors.offerPrice}
                  </FormHelperText>
                )}
              </Box>
            </Box>

            <Divider />

            <Box display={'flex'} flexDirection={'column'} p={3}>
              <Typography
                fontSize={'16px'}
                fontFamily={'var(--font-bold)'}
                color={theme.palette.containerSecondary.contrastText}
              >
                Counter Offer Duration
              </Typography>

              <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                <Grid item xs={12} md={6}>
                  <StyledSelectFC
                    select
                    name="offerDurationType"
                    value={formik.values.offerDurationType}
                    onBlur={formik.handleBlur}
                    onChange={(event) =>
                      handleOfferDurationType(
                        event,
                        formik.setFieldValue,
                        formik.handleChange,
                      )
                    }
                  >
                    {bidDaysOptions.map((item, idx) => (
                      <MenuItem key={idx} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </StyledSelectFC>
                </Grid>
                <Grid item xs={12} md={6}>
                  <MobileDateTimePicker
                    disabled={
                      formik.values.offerDurationType !==
                      BidDaysFormat.CustomDate
                    }
                    value={formik.values.offerDuration}
                    onChange={(newValue) => {
                      formik.setFieldValue(
                        'offerDuration',
                        dayjs(newValue).valueOf(),
                      )
                    }}
                    disablePast
                    renderInput={(params) => (
                      <TextField
                        inputProps={{
                          'aria-label': 'Without label',
                        }}
                        {...params}
                        sx={{
                          borderRadius: 2,
                          color: theme.palette.grey[200],
                          backgroundColor: theme.palette.grey[600],
                          fontSize: '16px',
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 4,
                            height: 42,
                          },
                          width: '100%',
                          '& fieldset': { border: 'none' },
                          '&::placeholder': {
                            fontSize: '16px',
                            color: theme.palette.grey[500],
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            <Box p={2}>
              <WhiteBtn
                sx={{
                  borderRadius: 7,
                  width: '100%',
                  height: 48,
                  fontWeight: 600,
                  fontSize: 16,
                }}
                onClick={handleSubmit}
                disabled={formik.isSubmitting}
              >
                Place Counter Offer
              </WhiteBtn>
            </Box>
          </form>
        </DialogContent>
      </LocalizationProvider>
    </BootstrapDialog>
  )
}
