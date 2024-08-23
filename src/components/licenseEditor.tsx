import React, { useEffect, useImperativeHandle, useState } from 'react'
import {
  Box,
  Button,
  IconButton,
  CardMedia,
  Divider,
  FormHelperText,
  Grid,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import {
  DatePicker,
  LocalizationProvider,
  DesktopTimePicker,
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useFormik } from 'formik'
import {
  AccessLevel,
  AccessLevelLabels,
  ArtistRevenueType,
  DaysFormat,
  DiscountCodeIF,
  LicenseDataIF,
  LicensingTypes,
  ListingFormat,
  SupplyFormat,
  TemplateDataIF,
  accessLevels,
  daysTypes,
  listingTypes,
  supplyTypes,
  EnSubmitting,
  ListingStatusType,
  DiscountTypeEN,
} from 'src/interface'
import StrokeDarkIcon from 'src/assets/images/stroke_dark.svg'
import { Country, State } from 'country-state-city'
import {
  StyledOutlinedInputFC,
  StyledSelectFC,
  StyledTextAreaFC,
} from './styledInput'
import dayjs from 'dayjs'
import { listingFormatTypes } from 'src/config'
import * as Yup from 'yup'
import { RevenueSplits } from './revenueSplits'
import WhiteBtn from './buttons/whiteBtn'
import PrimaryButton from './buttons/primary-button'
import DiscountCard from './discountCard'
import toast from 'react-hot-toast'

interface Props {
  licenseData: any
  licensingType: LicensingTypes
  setLicenseData: (licenseData: any) => void
  setPrices: (prices: { fPrice: number; sPrice: number }) => void
  onSubmitSuccess: (mode: EnSubmitting, newLicenseData: LicenseDataIF) => void
  onSubmitError: (errors: any) => void
}

interface ChildComponentRef {
  handleSubmit: (mode: EnSubmitting) => void
}

interface FormValues {
  country: string
  countryId: string
  state: string
  listingFormat: string
  fPrice: number
  sPrice: number
  tPrice: number
  totalSupply: number
  accessLevel: string
  supplyType: SupplyFormat
  listingStartTime: number
  listingEndTime: number
  exclusiveEndTime: number
  listingDurationType: DaysFormat
  exclusiveDurationType: DaysFormat
  revenues: ArtistRevenueType[]
  isCreatedDiscountCode: boolean
  discountCode: DiscountCodeIF
  usageNotes: string
  submit: null | string
}

const defaultInitialValues: FormValues = {
  country: 'United States',
  countryId: '231',
  state: 'New York',
  listingFormat: listingTypes[listingFormatTypes.bidAndPrice],
  fPrice: 0,
  sPrice: 0,
  tPrice: 0,
  totalSupply: 0,
  usageNotes: '',
  accessLevel: accessLevels[AccessLevel.Both],
  supplyType: SupplyFormat.Infinite,
  listingStartTime: Date.now(),
  listingEndTime: Date.now(),
  exclusiveEndTime: Date.now(),
  listingDurationType: DaysFormat.Infinite,
  exclusiveDurationType: DaysFormat.Infinite,
  revenues: [],
  isCreatedDiscountCode: false,
  discountCode: {
    name: '',
    code: '',
    discountType: DiscountTypeEN.PercentageOff,
    percentage: 0,
    fixedAmount: 0,
    infinite: false,
    endTime: Date.now(),
    actived: false,
  },
  submit: null,
}

const LicenseEditor = React.forwardRef<ChildComponentRef, Props>(
  (props, ref) => {
    const theme = useTheme()
    const {
      licenseData,
      licensingType,
      setLicenseData,
      setPrices,
      onSubmitSuccess,
      onSubmitError,
    } = props
    const [submitMode, setSubmitMode] = useState<EnSubmitting>(
      EnSubmitting.NewLicensing,
    )
    const [templateData, setTemplateData] = useState<TemplateDataIF>()
    const [initialFormValues, setInitialFormValues] =
      useState(defaultInitialValues)

    const [allCountries, setAllCountries] = useState<Array<any>>([])

    useEffect(() => {
      const fetchCountries = async () => {
        setAllCountries(await Country.getAllCountries())
      }
      fetchCountries()
    }, [])

    useEffect(() => {
      let syncData
      const signingData = licenseData.signingData
      switch (licensingType) {
        case LicensingTypes.Creator:
          syncData = signingData.creator
          break
        case LicensingTypes.Movie:
          syncData = signingData.movie
          break
        case LicensingTypes.Advertisement:
          syncData = signingData.advertisement
          break
        case LicensingTypes.VideoGame:
          syncData = signingData.videoGame
          break
        case LicensingTypes.TvSeries:
          syncData = signingData.tvSeries
          break
        case LicensingTypes.AiTraining:
          syncData = signingData.aiTraining
          break
        default:
          break
      }
      setTemplateData(syncData)
    }, [licensingType, licenseData])

    useEffect(() => {
      if (templateData) {
        setInitialFormValues({
          country: templateData.country,
          countryId: '231',
          state: templateData.state,
          listingFormat: listingTypes[templateData.listingFormatValue],
          fPrice: templateData.fPrice,
          sPrice: templateData.sPrice,
          tPrice: templateData.tPrice,
          totalSupply: templateData.totalSupply,
          accessLevel: accessLevels[templateData.accessLevel],
          supplyType: templateData.infiniteSupply
            ? SupplyFormat.Infinite
            : SupplyFormat.CertainSupply,
          listingStartTime: templateData.listingStartTime,
          listingEndTime: templateData.listingEndTime,
          exclusiveEndTime: templateData.exclusiveEndTime,
          listingDurationType: templateData.infiniteListingDuration
            ? DaysFormat.Infinite
            : DaysFormat.CustomDate,
          exclusiveDurationType: templateData.infiniteExclusiveDuration
            ? DaysFormat.Infinite
            : DaysFormat.CustomDate,
          usageNotes: templateData.usageNotes,
          revenues: templateData.revenues,
          isCreatedDiscountCode: templateData.discountCode.actived === true,
          discountCode: templateData.discountCode,
          submit: null,
        })
      }
    }, [templateData, licenseData, submitMode])

    const handleExclusiveDurationType = (
      event,
      handleChange,
      setFieldValue,
    ) => {
      switch (event.target.value) {
        case DaysFormat.Infinite:
          break
        case DaysFormat.OneHour:
          setFieldValue('exclusiveEndTime', dayjs().add(1, 'hour').valueOf())
          break
        case DaysFormat.SixHours:
          setFieldValue('exclusiveEndTime', dayjs().add(6, 'hour').valueOf())
          break
        case DaysFormat.OneDay:
          setFieldValue('exclusiveEndTime', dayjs().add(1, 'day').valueOf())
          break
        case DaysFormat.ThreeDays:
          setFieldValue('exclusiveEndTime', dayjs().add(3, 'day').valueOf())
          break
        case DaysFormat.SevenDays:
          setFieldValue('exclusiveEndTime', dayjs().add(7, 'day').valueOf())
          break
        case DaysFormat.OneMonth:
          setFieldValue('exclusiveEndTime', dayjs().add(1, 'month').valueOf())
          break
        case DaysFormat.ThreeMonths:
          setFieldValue('exclusiveEndTime', dayjs().add(3, 'month').valueOf())
          break
        case DaysFormat.SixMonths:
          setFieldValue('exclusiveEndTime', dayjs().add(6, 'month').valueOf())
          break
        case DaysFormat.CustomDate:
          break
        default:
          break
      }
      handleChange(event) // Call Formik's handleChange
    }

    const formik = useFormik({
      initialValues: initialFormValues,
      validationSchema: Yup.object().shape({
        listingFormat: Yup.string()
          .max(255)
          .required('listingFormat is required'),
        fPrice: Yup.number().when('accessLevel', {
          is: (val) => val === accessLevels[1] || val === accessLevels[2],
          then: () =>
            Yup.number()
              .typeError('Non-exclusive price must be a valid number')
              .test(
                'not-zero',
                'Non-exclusive price must be greater than zero',
                (value) => value > 0,
              )
              .max(Infinity)
              .required('Non-exclusive price is required'),
          otherwise: () => Yup.number().notRequired(),
        }),
        sPrice: Yup.number().when('accessLevel', {
          is: (val) => val === accessLevels[1] || val === accessLevels[2],
          then: () =>
            Yup.number()
              .typeError('Exclusive price must be a valid number')
              .test(
                'not-zero',
                'Exclusive price must be greater than zero',
                (value) => value > 0,
              )
              .max(Infinity)
              .required('Exclusive price is required'),
          otherwise: () => Yup.number().notRequired(),
        }),
        tPrice:
          licensingType === LicensingTypes.Creator
            ? Yup.number()
                .typeError('Third-party platform price must be a valid number')
                .min(0, 'Third-party platform price must be greater than zero')
                .required('Third-party platform price is required')
            : Yup.number().notRequired(),
        totalSupply: Yup.number()
          .min(1, 'total supply should be greater than 1')
          .max(Infinity)
          .required('total supply is required'),
      }),
      enableReinitialize: true,
      onSubmit: (values, { setSubmitting }) => {
        try {
          let signingData = licenseData.signingData
          let listingFormatValue = listingFormatTypes.bidAndPrice
          switch (values.listingFormat) {
            case ListingFormat.ForBid:
              listingFormatValue = listingFormatTypes.bid
              break
            case ListingFormat.ForPrice:
              listingFormatValue = listingFormatTypes.price
              break
            case ListingFormat.ForPriceAndBids:
              listingFormatValue = listingFormatTypes.bidAndPrice
              break
            default:
              break
          }
          let accessLevel = AccessLevel.Both
          switch (values.accessLevel) {
            case AccessLevelLabels.NonExclusive:
              accessLevel = AccessLevel.NonExclusive
              break
            case AccessLevelLabels.Exclusive:
              accessLevel = AccessLevel.Exclusive
              break
            case AccessLevelLabels.Both:
              accessLevel = AccessLevel.Both
              break
            default:
              break
          }
          const newTemplateData: TemplateDataIF = {
            fPrice: values.fPrice,
            sPrice: values.sPrice,
            tPrice: values.tPrice,
            totalSupply: values.totalSupply,
            listingStartTime: values.listingStartTime,
            listingEndTime: values.listingEndTime,
            exclusiveEndTime: values.exclusiveEndTime,
            revenues: values.revenues,
            listingFormatValue,
            infiniteSupply:
              values.supplyType === SupplyFormat.Infinite ? true : false,
            infiniteListingDuration:
              values.listingDurationType === DaysFormat.Infinite ? true : false,
            infiniteExclusiveDuration:
              values.exclusiveDurationType === DaysFormat.Infinite
                ? true
                : false,
            accessLevel: accessLevel,
            discountCode: values.discountCode,
            usageNotes: values.usageNotes,
            listed: ListingStatusType.Listed,
            country: values.country,
            state: values.state,
          }
          switch (licensingType) {
            case LicensingTypes.Creator:
              signingData = { ...signingData, creator: newTemplateData }
              break
            case LicensingTypes.Movie:
              signingData = { ...signingData, movie: newTemplateData }
              break
            case LicensingTypes.Advertisement:
              signingData = { ...signingData, advertisement: newTemplateData }
              break
            case LicensingTypes.VideoGame:
              signingData = { ...signingData, videoGame: newTemplateData }
              break
            case LicensingTypes.TvSeries:
              signingData = { ...signingData, tvSeries: newTemplateData }
              break
            case LicensingTypes.AiTraining:
              signingData = { ...signingData, aiTraining: newTemplateData }
              break
            default:
              break
          }
          const newLicenseData = { ...licenseData, signingData }
          setLicenseData(newLicenseData)
          setSubmitting(false)
          onSubmitSuccess(submitMode, newLicenseData)
        } catch (e) {
          toast.error(e.message)
        } finally {
          setSubmitting(false)
        }
      },
    })

    const handleListingDurationType = (event, setFieldValue, handleChange) => {
      setFieldValue('listingStartTime', dayjs().valueOf())
      switch (event.target.value) {
        case DaysFormat.Infinite:
          break
        case DaysFormat.OneHour:
          setFieldValue('listingEndTime', dayjs().add(1, 'hour').valueOf())
          break
        case DaysFormat.SixHours:
          setFieldValue('listingEndTime', dayjs().add(6, 'hour').valueOf())
          break
        case DaysFormat.OneDay:
          setFieldValue('listingEndTime', dayjs().add(1, 'day').valueOf())
          break
        case DaysFormat.ThreeDays:
          setFieldValue('listingEndTime', dayjs().add(3, 'day').valueOf())
          break
        case DaysFormat.SevenDays:
          setFieldValue('listingEndTime', dayjs().add(7, 'day').valueOf())
          break
        case DaysFormat.OneMonth:
          setFieldValue('listingEndTime', dayjs().add(1, 'month').valueOf())
          break
        case DaysFormat.ThreeMonths:
          setFieldValue('listingEndTime', dayjs().add(3, 'month').valueOf())
          break
        case DaysFormat.SixMonths:
          setFieldValue('listingEndTime', dayjs().add(6, 'month').valueOf())
          break
        case DaysFormat.CustomDate:
          break
        default:
          break
      }
      handleChange(event)
    }

    const revenuesHandler = (
      newRevenues: ArtistRevenueType[],
      setFieldValue,
    ) => {
      let signingData = licenseData.signingData
      switch (licensingType) {
        case LicensingTypes.Creator:
          signingData = {
            ...signingData,
            creator: { ...signingData.creator, revenues: newRevenues },
          }
          break
        case LicensingTypes.Movie:
          signingData = {
            ...signingData,
            creator: { ...signingData.movie, revenues: newRevenues },
          }
          break
        case LicensingTypes.Advertisement:
          signingData = {
            ...signingData,
            creator: { ...signingData.advertisement, revenues: newRevenues },
          }
          break
        case LicensingTypes.VideoGame:
          signingData = {
            ...signingData,
            creator: { ...signingData.videoGame, revenues: newRevenues },
          }
          break
        case LicensingTypes.TvSeries:
          signingData = {
            ...signingData,
            creator: { ...signingData.tvSeries, revenues: newRevenues },
          }
          break
        case LicensingTypes.AiTraining:
          signingData = {
            ...signingData,
            creator: { ...signingData.aiTraining, revenues: newRevenues },
          }
          break
        default:
          break
      }

      setLicenseData((prevLicenseData) => ({
        ...prevLicenseData,
        signingData,
      }))
      setFieldValue('revenues', newRevenues)
    }

    const handleSubmit = async (mode: EnSubmitting) => {
      setSubmitMode(mode)

      // Trigger validation manually
      const errors = await formik.validateForm()

      // Check for validation errors
      if (Object.keys(errors).length === 0) {
        formik.handleSubmit()
      } else {
        toast.error('Please fill out the fields correctly')
        // Optionally, you can handle the errors here
        onSubmitError(errors)
      }
    }

    // Expose the submit function to the parent component
    useImperativeHandle(ref, () => ({
      handleSubmit,
    }))

    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box display={'flex'} flexDirection={'column'} width={'100%'}>
          <Box px={2} pt={2}>
            <WhiteBtn
              sx={{
                borderRadius: 12,
                width: '100%',
                height: 37,
                fontWeight: 600,
              }}
            >
              Autofill Listing Details With What We Think Works Best
            </WhiteBtn>
          </Box>

          <form onSubmit={formik.handleSubmit}>
            <Typography
              sx={{
                fontFamily: 'var(--font-semi-bold)',
                fontSize: '16px',
                color: theme.palette.text.primary,
                py: 2,
                px: 2,
              }}
            >
              Listing details
            </Typography>
            <Grid container spacing={2} px={2}>
              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Box display={'flex'} alignItems={'center'} gap={0.5}>
                    <Typography
                      variant="subtitle1"
                      color={theme.palette.text.secondary}
                    >
                      Country - Governing Law?
                    </Typography>
                    <CardMedia
                      component={'img'}
                      image={StrokeDarkIcon}
                      sx={{ width: 12, objectFit: 'cover' }}
                    />
                  </Box>

                  <Select
                    displayEmpty
                    name="country"
                    value={formik.values.country}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    input={
                      <OutlinedInput
                        sx={{
                          borderRadius: 2,
                          fontSize: '16px',
                          '& .MuiOutlinedInput-input': {
                            padding: 1,
                          },
                          bgcolor: theme.palette.grey[600],
                          '& fieldset': { border: 'none' },
                        }}
                      />
                    }
                    renderValue={(selected) => {
                      return (
                        <Box
                          display={'flex'}
                          flexDirection={'column'}
                          justifyContent={'center'}
                          borderRadius={1.5}
                          p={'1px 6px'}
                        >
                          <Typography
                            fontSize={16}
                            color={theme.palette.grey[200]}
                          >
                            {selected}
                          </Typography>
                        </Box>
                      )
                    }}
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    {allCountries.map((countryItem, idx) => (
                      <MenuItem key={idx} value={countryItem.name}>
                        {countryItem.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.country && formik.errors.country && (
                    <FormHelperText error id="helper-text-country">
                      {formik.errors.country}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Box display={'flex'} alignItems={'center'} gap={0.5}>
                    <Typography
                      variant="subtitle1"
                      color={theme.palette.text.secondary}
                    >
                      State - Governing Law?
                    </Typography>
                    <CardMedia
                      component={'img'}
                      image={StrokeDarkIcon}
                      sx={{ width: 12, objectFit: 'cover' }}
                    />
                  </Box>

                  <Select
                    displayEmpty
                    name="state"
                    value={formik.values.state}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    input={
                      <OutlinedInput
                        sx={{
                          borderRadius: 2,
                          fontSize: '16px',
                          '& .MuiOutlinedInput-input': {
                            padding: 1,
                          },
                          bgcolor: theme.palette.grey[600],
                          '& fieldset': { border: 'none' },
                        }}
                      />
                    }
                    renderValue={(selected) => {
                      return (
                        <Box
                          display={'flex'}
                          flexDirection={'column'}
                          justifyContent={'center'}
                          borderRadius={1.5}
                          p={'1px 6px'}
                        >
                          <Typography
                            fontSize={16}
                            color={theme.palette.grey[200]}
                          >
                            {selected}
                          </Typography>
                        </Box>
                      )
                    }}
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    {State.getStatesOfCountry(
                      allCountries.find(
                        (item) => item.name == formik.values.country,
                      )?.isoCode,
                    ).map((stateItem, idx) => (
                      <MenuItem key={idx} value={stateItem.name}>
                        {stateItem.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.state && formik.errors.state && (
                    <FormHelperText error id="helper-text-state">
                      {formik.errors.state}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Box display={'flex'} alignItems={'center'} gap={0.5}>
                    <Typography
                      variant="subtitle1"
                      color={theme.palette.text.secondary}
                    >
                      License exclusivity for this listing
                    </Typography>
                    <CardMedia
                      component={'img'}
                      image={StrokeDarkIcon}
                      sx={{ width: 12, objectFit: 'cover' }}
                    />
                  </Box>
                  <StyledSelectFC
                    select
                    name="accessLevel"
                    value={formik.values.accessLevel}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  >
                    {accessLevels.map((label, idx) => (
                      <MenuItem key={idx} value={label}>
                        {label}
                      </MenuItem>
                    ))}
                  </StyledSelectFC>
                  {formik.touched.accessLevel && formik.errors.accessLevel && (
                    <FormHelperText error id="helper-text-accessLevel">
                      {formik.errors.accessLevel}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Box display={'flex'} alignItems={'center'} gap={0.5}>
                    <Typography
                      variant="subtitle1"
                      color={theme.palette.text.secondary}
                    >
                      Flat price or bids?
                    </Typography>
                    <CardMedia
                      component={'img'}
                      image={StrokeDarkIcon}
                      sx={{ width: 12, objectFit: 'cover' }}
                    />
                  </Box>

                  <Select
                    displayEmpty
                    name="listingFormat"
                    value={formik.values.listingFormat}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    input={
                      <OutlinedInput
                        sx={{
                          borderRadius: 2,
                          fontSize: '16px',
                          '& .MuiOutlinedInput-input': {
                            padding: 1,
                          },
                          bgcolor: theme.palette.grey[600],
                          '& fieldset': { border: 'none' },
                        }}
                      />
                    }
                    renderValue={(selected) => {
                      return (
                        <Box
                          display={'flex'}
                          flexDirection={'column'}
                          justifyContent={'center'}
                          borderRadius={1.5}
                          p={'1px 6px'}
                        >
                          <Typography>
                            {`${selected}` === '' ? 'Select option' : selected}
                          </Typography>
                        </Box>
                      )
                    }}
                    inputProps={{ 'aria-label': 'Without label' }}
                  >
                    {listingTypes.map((label, idx) => (
                      <MenuItem key={idx} value={label}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.listingFormat &&
                    formik.errors.listingFormat && (
                      <FormHelperText error id="helper-text-listingFormat">
                        {formik.errors.listingFormat}
                      </FormHelperText>
                    )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Box display={'flex'} alignItems={'center'} gap={0.5}>
                    <Typography
                      variant="subtitle1"
                      color={theme.palette.text.secondary}
                    >
                      License listing duration
                    </Typography>
                    <CardMedia
                      component={'img'}
                      image={StrokeDarkIcon}
                      sx={{ width: 12, objectFit: 'cover' }}
                    />
                  </Box>
                  <StyledSelectFC
                    select
                    name="listingDurationType"
                    value={formik.values.listingDurationType}
                    onBlur={formik.handleBlur}
                    onChange={(event) =>
                      handleListingDurationType(
                        event,
                        formik.setFieldValue,
                        formik.handleChange,
                      )
                    }
                  >
                    {daysTypes.map((label, idx) => (
                      <MenuItem key={idx} value={label}>
                        {label}
                      </MenuItem>
                    ))}
                  </StyledSelectFC>
                  {formik.touched.listingDurationType &&
                    formik.errors.listingDurationType && (
                      <FormHelperText
                        error
                        id="helper-text-listingDurationType"
                      >
                        {formik.errors.listingDurationType}
                      </FormHelperText>
                    )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={1}>
                  <Box display={'flex'} alignItems={'center'} gap={0.5}>
                    <Typography
                      variant="subtitle1"
                      color={theme.palette.text.secondary}
                    >
                      Duration of exclusive license
                    </Typography>
                    <CardMedia
                      component={'img'}
                      image={StrokeDarkIcon}
                      sx={{ width: 12, objectFit: 'cover' }}
                    />
                  </Box>
                  <StyledSelectFC
                    select
                    name="exclusiveDurationType"
                    value={formik.values.exclusiveDurationType}
                    onBlur={formik.handleBlur}
                    onChange={(event) =>
                      handleExclusiveDurationType(
                        event,
                        formik.handleChange,
                        formik.setFieldValue,
                      )
                    }
                  >
                    {daysTypes.map((label, idx) => (
                      <MenuItem key={idx} value={label}>
                        {label}
                      </MenuItem>
                    ))}
                  </StyledSelectFC>
                  {formik.touched.exclusiveDurationType &&
                    formik.errors.exclusiveDurationType && (
                      <FormHelperText
                        error
                        id="helper-text-exclusiveDurationType"
                      >
                        {formik.errors.exclusiveDurationType}
                      </FormHelperText>
                    )}
                </Stack>
              </Grid>

              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  pl: 2,
                  py: 2,
                }}
              >
                <Box display={'flex'} alignItems={'center'} gap={0.5}>
                  <Typography
                    variant="subtitle1"
                    color={theme.palette.text.secondary}
                  >
                    Supply of non-exclusive license
                  </Typography>
                  <CardMedia
                    component={'img'}
                    image={StrokeDarkIcon}
                    sx={{ width: 12, objectFit: 'cover' }}
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <StyledSelectFC
                        select
                        name="supplyType"
                        value={formik.values.supplyType}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      >
                        {supplyTypes.map((label, idx) => (
                          <MenuItem key={idx} value={label}>
                            {label}
                          </MenuItem>
                        ))}
                      </StyledSelectFC>
                      {formik.touched.supplyType &&
                        formik.errors.supplyType && (
                          <FormHelperText error id="helper-text-supplyFormat">
                            {formik.errors.supplyType}
                          </FormHelperText>
                        )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      {formik.values.supplyType ===
                        SupplyFormat.CertainSupply && (
                        <>
                          <StyledOutlinedInputFC
                            fullWidth
                            error={Boolean(
                              formik.touched.totalSupply &&
                                formik.errors.totalSupply,
                            )}
                            type="number"
                            value={formik.values.totalSupply}
                            name="totalSupply"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                          />
                          {formik.touched.totalSupply &&
                            formik.errors.totalSupply && (
                              <FormHelperText
                                error
                                id="helper-text-totalSupply"
                              >
                                {formik.errors.totalSupply}
                              </FormHelperText>
                            )}
                        </>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* custom listing date */}
            {formik.values.listingDurationType === DaysFormat.CustomDate && (
              <Box
                display={'flex'}
                flexDirection={'column'}
                width={'100%'}
                gap={2}
                pt={2}
                px={2}
              >
                <Typography
                  fontFamily={'var(--font-semi-bold)'}
                  fontSize={'16px'}
                >
                  Set a custom sale duration for this listing
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box display={'flex'} flexDirection={'column'} gap={1}>
                      <Typography
                        variant="subtitle1"
                        color={theme.palette.text.secondary}
                      >
                        Start Date
                      </Typography>
                      <DatePicker
                        disabled={
                          formik.values.listingDurationType !==
                          DaysFormat.CustomDate
                        }
                        value={formik.values.listingStartTime}
                        onChange={(date) => {
                          const date1 = new Date(formik.values.listingStartTime)
                          const date2 = new Date(date)
                          const combinedDate = new Date(
                            date2.getFullYear(),
                            date2.getMonth(),
                            date2.getDate(),
                            date1.getHours(),
                            date1.getMinutes(),
                            date1.getSeconds(),
                            date1.getMilliseconds(),
                          )
                          formik.setFieldValue(
                            'listingStartTime',
                            dayjs(combinedDate).valueOf(),
                          )
                        }}
                        renderInput={(params) => {
                          return (
                            <TextField
                              fullWidth
                              label="listingStartTime"
                              name="listingStartTime"
                              inputProps={{
                                'aria-label': 'Without label',
                              }}
                              {...params}
                              sx={{
                                color: theme.palette.text.primary,
                                backgroundColor: theme.palette.grey[600],
                                borderRadius: 2,
                                '& .MuiInputBase-root': {
                                  height: 42,
                                },
                                '& fieldset': {
                                  borderRadius: 2,
                                  outline: 'none',
                                  border: 'none',
                                },
                              }}
                            />
                          )
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box display={'flex'} flexDirection={'column'} gap={1}>
                      <Typography
                        variant="subtitle1"
                        color={theme.palette.text.secondary}
                      >
                        Start Time
                      </Typography>
                      <DesktopTimePicker
                        disabled={
                          formik.values.listingDurationType !==
                          DaysFormat.CustomDate
                        }
                        value={formik.values.listingStartTime}
                        onChange={(date) => {
                          const date1 = new Date(formik.values.listingStartTime)
                          const date2 = new Date(date)
                          const combinedDate = new Date(
                            date1.getFullYear(),
                            date1.getMonth(),
                            date1.getDate(),
                            date2.getHours(),
                            date2.getMinutes(),
                            date2.getSeconds(),
                            date2.getMilliseconds(),
                          )
                          formik.setFieldValue(
                            'listingStartTime',
                            dayjs(combinedDate).valueOf(),
                          )
                        }}
                        renderInput={(params) => {
                          return (
                            <TextField
                              fullWidth
                              label="listingStartTime"
                              name="listingStartTime"
                              inputProps={{
                                'aria-label': 'Without label',
                              }}
                              {...params}
                              sx={{
                                color: theme.palette.text.primary,
                                backgroundColor: theme.palette.grey[600],
                                borderRadius: 2,
                                '& .MuiInputBase-root': {
                                  height: 42,
                                },
                                '& fieldset': {
                                  borderRadius: 2,
                                  outline: 'none',
                                  border: 'none',
                                },
                              }}
                            />
                          )
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box display={'flex'} flexDirection={'column'} gap={1}>
                      <Typography
                        variant="subtitle1"
                        color={theme.palette.text.secondary}
                      >
                        End Date
                      </Typography>
                      <DatePicker
                        disabled={
                          formik.values.listingDurationType !==
                          DaysFormat.CustomDate
                        }
                        value={formik.values.listingEndTime}
                        onChange={(date) => {
                          const date1 = new Date(formik.values.listingEndTime)
                          const date2 = new Date(date)
                          const combinedDate = new Date(
                            date2.getFullYear(),
                            date2.getMonth(),
                            date2.getDate(),
                            date1.getHours(),
                            date1.getMinutes(),
                            date1.getSeconds(),
                            date1.getMilliseconds(),
                          )
                          formik.setFieldValue(
                            'listingEndTime',
                            dayjs(combinedDate).valueOf(),
                          )
                        }}
                        renderInput={(params) => {
                          return (
                            <TextField
                              fullWidth
                              label="listingEndTime"
                              name="listingEndTime"
                              inputProps={{
                                'aria-label': 'Without label',
                              }}
                              {...params}
                              sx={{
                                color: theme.palette.text.primary,
                                backgroundColor: theme.palette.grey[600],
                                borderRadius: 2,
                                '& .MuiInputBase-root': {
                                  height: 42,
                                },
                                '& fieldset': {
                                  borderRadius: 2,
                                  outline: 'none',
                                  border: 'none',
                                },
                              }}
                            />
                          )
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box display={'flex'} flexDirection={'column'} gap={1}>
                      <Typography
                        variant="subtitle1"
                        color={theme.palette.text.secondary}
                      >
                        End Time
                      </Typography>
                      <DesktopTimePicker
                        disabled={
                          formik.values.listingDurationType !==
                          DaysFormat.CustomDate
                        }
                        value={formik.values.listingEndTime}
                        onChange={(date) => {
                          const date1 = new Date(formik.values.listingEndTime)
                          const date2 = new Date(date)
                          const combinedDate = new Date(
                            date1.getFullYear(),
                            date1.getMonth(),
                            date1.getDate(),
                            date2.getHours(),
                            date2.getMinutes(),
                            date2.getSeconds(),
                            date2.getMilliseconds(),
                          )
                          formik.setFieldValue(
                            'listingEndTime',
                            dayjs(combinedDate).valueOf(),
                          )
                        }}
                        renderInput={(params) => {
                          return (
                            <TextField
                              fullWidth
                              label="listingEndTime"
                              name="listingEndTime"
                              inputProps={{
                                'aria-label': 'Without label',
                              }}
                              {...params}
                              sx={{
                                color: theme.palette.text.primary,
                                backgroundColor: theme.palette.grey[600],
                                borderRadius: 2,
                                '& .MuiInputBase-root': {
                                  height: 42,
                                },
                                '& fieldset': {
                                  borderRadius: 2,
                                  outline: 'none',
                                  border: 'none',
                                },
                              }}
                            />
                          )
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* custom exclusive date */}
            {formik.values.exclusiveDurationType === DaysFormat.CustomDate && (
              <Box
                display={'flex'}
                flexDirection={'column'}
                width={'100%'}
                gap={2}
                py={2}
                px={2}
              >
                <Typography
                  fontFamily={'var(--font-semi-bold)'}
                  fontSize={'16px'}
                >
                  Set a custom exclusive duration for this listing
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box display={'flex'} flexDirection={'column'} gap={1}>
                      <Typography
                        variant="subtitle1"
                        color={theme.palette.text.secondary}
                      >
                        End Date
                      </Typography>
                      <DatePicker
                        disabled={
                          formik.values.exclusiveDurationType !==
                          DaysFormat.CustomDate
                        }
                        value={formik.values.exclusiveEndTime}
                        onChange={(date) => {
                          const date1 = new Date(formik.values.exclusiveEndTime)
                          const date2 = new Date(date)
                          const combinedDate = new Date(
                            date2.getFullYear(),
                            date2.getMonth(),
                            date2.getDate(),
                            date1.getHours(),
                            date1.getMinutes(),
                            date1.getSeconds(),
                            date1.getMilliseconds(),
                          )
                          formik.setFieldValue(
                            'exclusiveEndTime',
                            dayjs(combinedDate).valueOf(),
                          )
                        }}
                        renderInput={(params) => {
                          return (
                            <TextField
                              fullWidth
                              label="exclusiveEndTime"
                              name="exclusiveEndTime"
                              inputProps={{
                                'aria-label': 'Without label',
                              }}
                              {...params}
                              sx={{
                                color: theme.palette.text.primary,
                                backgroundColor: theme.palette.grey[600],
                                borderRadius: 2,
                                '& .MuiInputBase-root': {
                                  height: 42,
                                },
                                '& fieldset': {
                                  borderRadius: 2,
                                  outline: 'none',
                                  border: 'none',
                                },
                              }}
                            />
                          )
                        }}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box display={'flex'} flexDirection={'column'} gap={1}>
                      <Typography
                        variant="subtitle1"
                        color={theme.palette.text.secondary}
                      >
                        End Time
                      </Typography>
                      <DesktopTimePicker
                        disabled={
                          formik.values.exclusiveDurationType !==
                          DaysFormat.CustomDate
                        }
                        value={formik.values.exclusiveEndTime}
                        onChange={(date) => {
                          const date1 = new Date(formik.values.exclusiveEndTime)
                          const date2 = new Date(date)
                          const combinedDate = new Date(
                            date1.getFullYear(),
                            date1.getMonth(),
                            date1.getDate(),
                            date2.getHours(),
                            date2.getMinutes(),
                            date2.getSeconds(),
                            date2.getMilliseconds(),
                          )
                          formik.setFieldValue(
                            'exclusiveEndTime',
                            dayjs(combinedDate).valueOf(),
                          )
                        }}
                        renderInput={(params) => {
                          return (
                            <TextField
                              fullWidth
                              label="exclusiveEndTime"
                              name="exclusiveEndTime"
                              inputProps={{
                                'aria-label': 'Without label',
                              }}
                              {...params}
                              sx={{
                                color: theme.palette.text.primary,
                                backgroundColor: theme.palette.grey[600],
                                borderRadius: 2,
                                '& .MuiInputBase-root': {
                                  height: 42,
                                },
                                '& fieldset': {
                                  borderRadius: 2,
                                  outline: 'none',
                                  border: 'none',
                                },
                              }}
                            />
                          )
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}

            <Divider />

            <Box
              display={'flex'}
              flexDirection={'column'}
              gap={2}
              width={'100%'}
              px={2}
              py={2}
            >
              <Typography
                sx={{
                  fontFamily: 'var(--font-semi-bold)',
                  fontSize: '16px',
                  color: theme.palette.text.primary,
                }}
              >
                Listing Price
              </Typography>

              <Grid container spacing={2}>
                {(formik.values.accessLevel ===
                  AccessLevelLabels.NonExclusive ||
                  formik.values.accessLevel === AccessLevelLabels.Both) && (
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <Box display={'flex'} alignItems={'center'} gap={0.5}>
                        <Typography
                          variant="subtitle1"
                          color={theme.palette.text.secondary}
                        >
                          Non Exclusive Price
                        </Typography>
                        <CardMedia
                          component={'img'}
                          image={StrokeDarkIcon}
                          sx={{ width: 12, objectFit: 'cover' }}
                        />
                      </Box>
                      <StyledOutlinedInputFC
                        fullWidth
                        error={Boolean(
                          formik.touched.fPrice && formik.errors.fPrice,
                        )}
                        type="number"
                        value={formik.values.fPrice}
                        name="fPrice"
                        onBlur={formik.handleBlur}
                        onChange={(event) => {
                          formik.handleChange(event)
                          setPrices({
                            fPrice: event.target.value as unknown as number,
                            sPrice: formik.values.sPrice,
                          })
                        }}
                        endAdornment={
                          <InputAdornment position="end">ETH</InputAdornment>
                        }
                      />
                      {formik.touched.fPrice && formik.errors.fPrice && (
                        <FormHelperText error id="helper-text-fPrice">
                          {formik.errors.fPrice}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                )}
                {(formik.values.accessLevel === AccessLevelLabels.Exclusive ||
                  formik.values.accessLevel === AccessLevelLabels.Both) && (
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <Box display={'flex'} alignItems={'center'} gap={0.5}>
                        <Typography
                          variant="subtitle1"
                          color={theme.palette.text.secondary}
                        >
                          Exclusive Price
                        </Typography>
                        <CardMedia
                          component={'img'}
                          image={StrokeDarkIcon}
                          sx={{ width: 12, objectFit: 'cover' }}
                        />
                      </Box>
                      <StyledOutlinedInputFC
                        fullWidth
                        error={Boolean(
                          formik.touched.sPrice && formik.errors.sPrice,
                        )}
                        type="number"
                        value={formik.values.sPrice}
                        name="sPrice"
                        onBlur={formik.handleBlur}
                        onChange={(event) => {
                          formik.handleChange(event)
                          setPrices({
                            sPrice: event.target.value as unknown as number,
                            fPrice: formik.values.fPrice,
                          })
                        }}
                        endAdornment={
                          <InputAdornment position="end">ETH</InputAdornment>
                        }
                      />
                      {formik.touched.sPrice && formik.errors.sPrice && (
                        <FormHelperText error id="helper-text-sPrice">
                          {formik.errors.sPrice}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                )}

                {licensingType === LicensingTypes.Creator && (
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1}>
                      <Box display={'flex'} alignItems={'center'} gap={0.5}>
                        <Typography
                          variant="subtitle1"
                          color={theme.palette.text.secondary}
                        >
                          Third-party platform price
                        </Typography>
                        <CardMedia
                          component={'img'}
                          image={StrokeDarkIcon}
                          sx={{ width: 12, objectFit: 'cover' }}
                        />
                      </Box>
                      <StyledOutlinedInputFC
                        fullWidth
                        error={Boolean(
                          formik.touched.tPrice && formik.errors.tPrice,
                        )}
                        type="number"
                        value={formik.values.tPrice}
                        name="tPrice"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        endAdornment={
                          <InputAdornment position="end">ETH</InputAdornment>
                        }
                      />
                      {formik.touched.tPrice && formik.errors.tPrice && (
                        <FormHelperText error id="helper-text-tPrice">
                          {formik.errors.tPrice}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                )}
              </Grid>
            </Box>

            <Divider />

            <Box display={'flex'} flexDirection={'column'} gap={2} p={2}>
              <Typography
                sx={{
                  fontFamily: 'var(--font-semi-bold)',
                  fontSize: '16px',
                  color: theme.palette.text.primary,
                }}
              >
                Usage Notes and Special Requirements
              </Typography>

              <Box display={'flex'} flexDirection={'column'} gap={0.5}>
                <Box display={'flex'} alignItems={'center'} gap={0.5}>
                  <Typography
                    fontSize={'12px'}
                    color={theme.palette.text.secondary}
                  >
                    Describe any usage requirements or restrictions for
                    commercial use of this license
                  </Typography>
                  <CardMedia
                    component={'img'}
                    image={StrokeDarkIcon}
                    sx={{ width: 12, objectFit: 'cover' }}
                  />
                </Box>

                <StyledTextAreaFC
                  fullWidth
                  type="text"
                  multiline
                  maxRows={10}
                  name="usageNotes"
                  placeholder="Example: License cannot be used in any violent or sexually explicit forms of media"
                  value={formik.values.usageNotes}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
              </Box>
            </Box>

            {licensingType === LicensingTypes.Creator && (
              <>
                <Divider />

                <Box display={'flex'} flexDirection={'column'} gap={2} p={2}>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-semi-bold)',
                      fontSize: '16px',
                      color: theme.palette.text.primary,
                    }}
                  >
                    Discount codes (Only Applies To Flat Price Purchases)
                  </Typography>

                  {!formik.values.isCreatedDiscountCode ? (
                    <PrimaryButton
                      sx={{ maxWidth: 124 }}
                      onClick={() => {
                        formik.setFieldValue('isCreatedDiscountCode', true)
                      }}
                    >
                      Create a Code
                    </PrimaryButton>
                  ) : (
                    <DiscountCard
                      discountCode={formik.values.discountCode}
                      setDiscountCode={(newDiscountCode) =>
                        formik.setFieldValue('discountCode', newDiscountCode)
                      }
                      setInActive={() =>
                        formik.setFieldValue('isCreatedDiscountCode', false)
                      }
                    />
                  )}
                </Box>
              </>
            )}

            {templateData && templateData?.revenues?.length > 1 && (
              <>
                <Divider />
                <RevenueSplits
                  readOnly={formik.isSubmitting}
                  artistRevenues={templateData.revenues}
                  revenuesHandler={(newRevenues) =>
                    revenuesHandler(newRevenues, formik.setFieldValue)
                  }
                />
              </>
            )}

            <Button sx={{ display: 'none' }} type="submit">
              Submit
            </Button>
          </form>
        </Box>
      </LocalizationProvider>
    )
  },
)

export default LicenseEditor
