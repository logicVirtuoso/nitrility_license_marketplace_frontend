import {
  Box,
  CardMedia,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import {
  LicensingTypes,
  AccessLevel,
  TemplateDataIF,
  CommonLicenseDataIF,
  UsageDetailIF,
} from 'src/interface'
import DialogContent from '@mui/material/DialogContent'
import { useEffect, useState } from 'react'
import PrimaryButton from 'src/components/buttons/primary-button'
import CloseDarkIcon from 'src/assets/images/close_dark.png'
import BackDarkIcon from 'src/assets/images/back_dark.svg'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { StyledOutlinedInputFC } from './styledInput'
import WhiteBtn from './buttons/whiteBtn'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: 0,
    backgroundColor: theme.palette.containerPrimary.main,
    border: 'none',
    borderRadius: 12,
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    backgroundColor: theme.palette.containerPrimary.main,
    borderRadius: 12,
    maxWidth: 500,
    border: `1px solid ${theme.palette.grey[600]}`,
  },
}))

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  handler?: () => void
  backForwards: () => void
}

export default function AddCardDialog({
  open,
  setOpen,
  handler,
  backForwards,
}: Props) {
  const theme = useTheme()
  const handleClose = () => {
    setOpen(false)
  }

  const addCardHandler = async () => {
    setOpen(false)
    handler()
  }

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      cardNumber: '',
      expirationDate: '',
      securityCode: '',
      billingAddress: '',
      city: '',
      zipCode: '',
      state: '',
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string().max(255).required('First name is required'),
      lastName: Yup.string().max(255).required('Last name is required'),
      cardNumber: Yup.string().max(255).required('Card number is required'),
      expirationDate: Yup.string()
        .max(255)
        .required('Expiration date is required'),
      securityCode: Yup.string().max(255).required('Security code is required'),
      billingAddress: Yup.string()
        .max(255)
        .required('Billing address is required'),
      city: Yup.string().max(255).required('City is required'),
      zipCode: Yup.string().max(255).required('ZipCode is required'),
      state: Yup.string().max(255).required('State is required'),
    }),
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(false)
    },
  })

  return (
    <BootstrapDialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogContent sx={{ position: 'relative' }}>
        <Box
          display={'flex'}
          alignItems={'center'}
          px={3}
          py={1.5}
          gap={2}
          mt={3}
        >
          <IconButton onClick={backForwards}>
            <CardMedia
              component={'img'}
              image={BackDarkIcon}
              sx={{ width: 10, objectFit: 'cover' }}
            />
          </IconButton>
          <Typography fontSize={21} color={theme.palette.text.primary}>
            Add Card
          </Typography>
        </Box>

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

        <Box display={'flex'} flexDirection={'column'} gap={1} p={3}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6}>
                <Stack spacing={0.5}>
                  <Typography
                    fontSize={12}
                    fontWeight={400}
                    color={theme.palette.text.secondary}
                  >
                    First Name
                  </Typography>
                  <StyledOutlinedInputFC
                    fullWidth
                    error={Boolean(
                      formik.touched.firstName && formik.errors.firstName,
                    )}
                    type="text"
                    value={formik.values.firstName}
                    name="firstName"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <FormHelperText error id="helper-text-firstName">
                      {formik.errors.firstName}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={0.5}>
                  <Typography
                    fontSize={12}
                    fontWeight={400}
                    color={theme.palette.text.secondary}
                  >
                    Last Name
                  </Typography>
                  <StyledOutlinedInputFC
                    fullWidth
                    error={Boolean(
                      formik.touched.lastName && formik.errors.lastName,
                    )}
                    type="text"
                    value={formik.values.lastName}
                    name="lastName"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <FormHelperText error id="helper-text-lastName">
                      {formik.errors.lastName}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={12}>
                <Stack spacing={0.5}>
                  <Typography
                    fontSize={12}
                    fontWeight={400}
                    color={theme.palette.text.secondary}
                  >
                    Card Number
                  </Typography>
                  <StyledOutlinedInputFC
                    fullWidth
                    error={Boolean(
                      formik.touched.cardNumber && formik.errors.cardNumber,
                    )}
                    type="text"
                    value={formik.values.cardNumber}
                    name="cardNumber"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.cardNumber && formik.errors.cardNumber && (
                    <FormHelperText error id="helper-text-cardNumber">
                      {formik.errors.cardNumber}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={0.5}>
                  <Typography
                    fontSize={12}
                    fontWeight={400}
                    color={theme.palette.text.secondary}
                  >
                    Expiration Date
                  </Typography>
                  <StyledOutlinedInputFC
                    fullWidth
                    error={Boolean(
                      formik.touched.expirationDate &&
                        formik.errors.expirationDate,
                    )}
                    type="text"
                    value={formik.values.expirationDate}
                    name="expirationDate"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.expirationDate &&
                    formik.errors.expirationDate && (
                      <FormHelperText error id="helper-text-expirationDate">
                        {formik.errors.expirationDate}
                      </FormHelperText>
                    )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Stack spacing={0.5}>
                  <Typography
                    fontSize={12}
                    fontWeight={400}
                    color={theme.palette.text.secondary}
                  >
                    Security Code
                  </Typography>
                  <StyledOutlinedInputFC
                    fullWidth
                    error={Boolean(
                      formik.touched.securityCode && formik.errors.securityCode,
                    )}
                    type="text"
                    value={formik.values.securityCode}
                    name="securityCode"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.securityCode &&
                    formik.errors.securityCode && (
                      <FormHelperText error id="helper-text-securityCode">
                        {formik.errors.securityCode}
                      </FormHelperText>
                    )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={12}>
                <Stack spacing={0.5}>
                  <Typography
                    fontSize={12}
                    fontWeight={400}
                    color={theme.palette.text.secondary}
                  >
                    Billing Address
                  </Typography>
                  <StyledOutlinedInputFC
                    fullWidth
                    error={Boolean(
                      formik.touched.billingAddress &&
                        formik.errors.billingAddress,
                    )}
                    type="text"
                    value={formik.values.billingAddress}
                    name="billingAddress"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.billingAddress &&
                    formik.errors.billingAddress && (
                      <FormHelperText error id="helper-text-billingAddress">
                        {formik.errors.billingAddress}
                      </FormHelperText>
                    )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={12}>
                <Stack spacing={0.5}>
                  <Typography
                    fontSize={12}
                    fontWeight={400}
                    color={theme.palette.text.secondary}
                  >
                    City
                  </Typography>
                  <StyledOutlinedInputFC
                    fullWidth
                    error={Boolean(formik.touched.city && formik.errors.city)}
                    type="text"
                    value={formik.values.city}
                    name="city"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.city && formik.errors.city && (
                    <FormHelperText error id="helper-text-city">
                      {formik.errors.city}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={12}>
                <Stack spacing={0.5}>
                  <Typography
                    fontSize={12}
                    fontWeight={400}
                    color={theme.palette.text.secondary}
                  >
                    Zip Code
                  </Typography>
                  <StyledOutlinedInputFC
                    fullWidth
                    error={Boolean(
                      formik.touched.zipCode && formik.errors.zipCode,
                    )}
                    type="text"
                    value={formik.values.zipCode}
                    name="zipCode"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.zipCode && formik.errors.zipCode && (
                    <FormHelperText error id="helper-text-zipCode">
                      {formik.errors.zipCode}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} md={12}>
                <Stack spacing={0.5}>
                  <Typography
                    fontSize={12}
                    fontWeight={400}
                    color={theme.palette.text.secondary}
                  >
                    State
                  </Typography>
                  <StyledOutlinedInputFC
                    fullWidth
                    error={Boolean(formik.touched.state && formik.errors.state)}
                    type="text"
                    value={formik.values.state}
                    name="state"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.state && formik.errors.state && (
                    <FormHelperText error id="helper-text-state">
                      {formik.errors.state}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </form>
        </Box>

        <Divider />

        <Box p={2}>
          <WhiteBtn
            sx={{ width: '100%', borderRadius: 14 }}
            onClick={addCardHandler}
          >
            Add Card
          </WhiteBtn>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  )
}
