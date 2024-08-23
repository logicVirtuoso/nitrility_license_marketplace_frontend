import {
  styled,
  Dialog,
  DialogContent,
  Box,
  Typography,
  useTheme,
  Divider,
  IconButton,
  InputLabel,
  InputBase,
  CardMedia,
  Grid,
  FormHelperText,
  Stack,
} from '@mui/material'
import IconClose from 'src/assets/close.svg'
import StrokeDarkIcon from 'src/assets/images/stroke_dark.svg'
import ThridButton from './third-button'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { StyledOutlinedInputFC } from './styledInput'
import { useContext } from 'react'
import { PublicProfileContext } from 'src/context/publicProfileContext'

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  width: '100%',
  '& .MuiInputBase-input': {
    borderRadius: '8px',
    color: theme.palette.grey[400],
    position: 'relative',
    backgroundColor:
      theme.palette.mode === 'light' ? '#F3F6F9' : theme.palette.grey[600],
    fontSize: '16px',
    width: '100%',
    lineHeight: '24px',
    fontWeight: '400',
    padding: '9px 12px',
    fontFamily: 'var(--font-base)',
  },
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
    boxShadow: 'none',
  },
}))

interface ContractInfoIF {
  email: string
  phone: string
}

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  isOwner: boolean
  editMode: boolean
}

const ContactDetailsDialog = ({ open, setOpen, isOwner, editMode }: Props) => {
  const { publicProfileData, setPublicProfileData } =
    useContext(PublicProfileContext)
  const theme = useTheme()
  const handleClose = () => {
    setOpen(false)
  }

  const formik = useFormik({
    initialValues: {
      email: publicProfileData.contacts.email,
      phone: publicProfileData.contacts.phone,
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email('Invalid email address')
        .max(255, 'Email must be 255 characters or less')
        .required('Email is required'),
      phone: Yup.string()
        .matches(/^[0-9]+$/, 'Phone number must be only digits')
        .max(15, 'Phone number must be 15 characters or less')
        .required('Phone number is required'),
    }),
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setPublicProfileData((prev) => ({
        ...prev,
        contacts: values,
      }))
      setOpen(false)
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
          sx={{
            padding: '24px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'var(--font-semi-bold)',
              fontSize: 21,
              color: theme.palette.text.primary,
              lineHeight: '26px',
            }}
          >
            Contact Details
          </Typography>

          <IconButton onClick={handleClose}>
            <CardMedia image={IconClose} component={'img'} />
          </IconButton>
        </Box>
        <Divider />
        {isOwner && editMode ? (
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1} px={3} pt={3}>
                  <Box display={'flex'} alignItems={'center'} gap={0.5}>
                    <Typography
                      variant="subtitle1"
                      color={theme.palette.text.secondary}
                    >
                      Email
                    </Typography>
                    <CardMedia
                      component={'img'}
                      image={StrokeDarkIcon}
                      sx={{ width: 12, objectFit: 'cover' }}
                    />
                  </Box>
                  <StyledOutlinedInputFC
                    fullWidth
                    placeholder="Enter your email"
                    error={Boolean(formik.touched.email && formik.errors.email)}
                    type="email"
                    value={formik.values.email}
                    name="email"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <FormHelperText error id="helper-text-email">
                      {formik.errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1} px={3} pb={3}>
                  <Box display={'flex'} alignItems={'center'} gap={0.5}>
                    <Typography
                      variant="subtitle1"
                      color={theme.palette.text.secondary}
                    >
                      Phone Number
                    </Typography>
                    <CardMedia
                      component={'img'}
                      image={StrokeDarkIcon}
                      sx={{ width: 12, objectFit: 'cover' }}
                    />
                  </Box>
                  <PhoneInput
                    inputProps={{
                      name: 'phone',
                      required: true,
                      autoFocus: true,
                    }}
                    inputStyle={{
                      borderRadius: '8px',
                      color: theme.palette.grey[400],
                      backgroundColor:
                        theme.palette.mode === 'light'
                          ? '#F3F6F9'
                          : theme.palette.grey[600],
                      fontSize: '16px',
                      width: '100%',
                      lineHeight: '24px',
                      fontWeight: '400',
                      fontFamily: 'var(--font-base)',
                      borderWidth: '0px',
                      height: '42px',
                    }}
                    country={'us'}
                    value={formik.values.phone}
                    onChange={(e) => formik.setFieldValue('phone', e)}
                  />

                  {formik.touched.phone && formik.errors.phone && (
                    <FormHelperText error id="helper-text-phone">
                      {formik.errors.phone}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
            </Grid>

            <Divider />
            <Box px={3} pb={3} pt={2}>
              <ThridButton
                sx={{
                  width: '100%',
                  borderRadius: 12,
                }}
                type="submit"
              >
                Continue
              </ThridButton>
            </Box>
          </form>
        ) : (
          <Box
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'space-between'}
            gap={1}
            p={3}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: `solid 1px ${theme.palette.grey[600]}`,
                borderRadius: '10px',
                p: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: '400',
                  lineHeight: '21px',
                  color: theme.palette.grey[400],
                }}
              >
                Email
              </Typography>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: '600',
                  lineHeight: '16px',
                  color: theme.palette.success.light,
                }}
              >
                {publicProfileData.contacts.email}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: `solid 1px ${theme.palette.grey[600]}`,
                borderRadius: '10px',
                p: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: '400',
                  lineHeight: '21px',
                  color: theme.palette.grey[400],
                }}
              >
                Phone Number
              </Typography>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: '600',
                  lineHeight: '16px',
                  color: theme.palette.success.light,
                }}
              >
                +{publicProfileData.contacts.phone}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>
    </BootstrapDialog>
  )
}

export default ContactDetailsDialog
