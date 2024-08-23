import {
  Box,
  Button,
  CardMedia,
  Divider,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { styled } from '@mui/material/styles'
import { StyledImage } from 'src/components/styledImage'
import Dialog from '@mui/material/Dialog'
import {
  LicensingTypes,
  AccessLevel,
  UsageDetailIF,
  TemplateDataIF,
  projectTypes,
  CommonLicenseDataIF,
} from 'src/interface'
import DialogContent from '@mui/material/DialogContent'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import {
  StyledOutlinedInputFC,
  StyledSelectFC,
} from 'src/components/styledInput'
import CloseDarkIcon from 'src/assets/images/close_dark.png'
import StrokeDarkIcon from 'src/assets/images/stroke_dark.svg'
import { useCallback, useEffect, useState } from 'react'
import { useWeb3 } from 'src/context/web3Context'
import { contentLabels, licensingTypeList } from 'src/config'
import toast from 'react-hot-toast'
import useAwsS3 from 'src/hooks/useAwsS3'
import CircularProgress from '@mui/material/CircularProgress'
import DotDarkIcon from 'src/assets/images/dot_dark.svg'
import BackDarkIcon from 'src/assets/images/back_dark.svg'

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
  },
}))

interface UsageDlgProps {
  open: boolean
  setOpen: (open: boolean) => void
  initialFormValues: UsageDetailIF
  commonLicenseData: CommonLicenseDataIF
  syncData: TemplateDataIF
  licensingType: LicensingTypes
  accessLevel: AccessLevel
  usageCallback?: (UsageDetailIF) => void
  backForwards?: () => void
}

export default function UsageDialog({
  open,
  setOpen,
  initialFormValues,
  commonLicenseData,
  syncData,
  licensingType,
  accessLevel,
  usageCallback = null,
  backForwards = null,
}: UsageDlgProps) {
  const { web3 } = useWeb3()
  const theme = useTheme()
  const { uploadPreviewFiles, deletePreviewfile } = useAwsS3()
  const [loading, setLoading] = useState<boolean>(true)
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const [licensePrice, setLicensePrice] = useState<string>('')

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    setLoading(true)
    if (syncData) {
      switch (accessLevel) {
        case AccessLevel.NonExclusive:
          setLicensePrice(syncData.fPrice.toLocaleString())
          break
        case AccessLevel.Exclusive:
          setLicensePrice(syncData.sPrice.toLocaleString())
          break
        default:
          break
      }
    }
    setLoading(false)
  }, [syncData, accessLevel, web3])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialFormValues,
    validationSchema: Yup.object().shape({
      contentTitle:
        licensingType != LicensingTypes.Creator
          ? Yup.string().max(255).required('Content title is required')
          : Yup.string().notRequired(),
      intendedPlatforms:
        licensingType != LicensingTypes.Creator
          ? Yup.string()
              .max(255)
              .required(`${contentLabels[licensingType].platforms} is required`)
          : Yup.string().notRequired(),
      contentDescription:
        licensingType != LicensingTypes.Creator
          ? Yup.string()
              .max(255)
              .required(
                `${contentLabels[licensingType].description} is required`,
              )
          : Yup.string().notRequired(),
      productionDescription:
        licensingType == LicensingTypes.Advertisement
          ? Yup.string()
              .max(255)
              .required('Description of Product Being Advertised is required')
          : Yup.string().notRequired(),
      aiModelDescription:
        licensingType == LicensingTypes.AiTraining
          ? Yup.string()
              .max(255)
              .required('Description of AI Model is required')
          : Yup.string().notRequired(),
      previewFiles:
        licensingType != LicensingTypes.Creator
          ? Yup.array().required('Previews are required')
          : Yup.array().notRequired(),
      licenseUsage:
        licensingType != LicensingTypes.Creator
          ? Yup.string()
              .max(255)
              .required(
                'Additional information on the license’s usage is required',
              )
          : Yup.string().notRequired(),
    }),
    onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
      try {
        const usageData: UsageDetailIF = {
          projectType: values.projectType,
          releaseDate: values.releaseDate,
          contentTitle: values.contentTitle,
          contentDescription: values.contentDescription,
          intendedPlatforms: values.intendedPlatforms,
          productionDescription: values.productionDescription,
          aiModelDescription: values.aiModelDescription,
          previewFiles: values.previewFiles,
          licenseUsage: values.licenseUsage,
        }
        setOpen(false)
        usageCallback(usageData)

        setStatus({ success: true })
        setSubmitting(false)
      } catch (e) {
        setErrors({ submit: e.message })
        setStatus({ success: false })
        setSubmitting(false)
      }
    },
  })

  const uploadPreviews = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files[0]
      if (file) {
        const toastUploading = toast.loading('Uploading your previews...')
        formik.setSubmitting(true)
        uploadPreviewFiles(file, authorization.currentUser.accountAddress)
          .then((data) => {
            formik.setFieldValue('previewFiles', [
              ...formik.values.previewFiles,
              data,
            ])
            formik.setSubmitting(false)
            toast.success('Uploaded your previews', {
              id: toastUploading,
            })
          })
          .catch((e) => {
            formik.setSubmitting(false)
            toast.error(e.message, {
              id: toastUploading,
            })
          })
      }
    },
    [formik, uploadPreviewFiles, authorization.currentUser.accountAddress],
  )

  const deletePreviewfileHandler = useCallback(
    (idx: number) => {
      const fileName = formik.values.previewFiles[idx].split('/').pop()
      deletePreviewfile(authorization.currentUser.accountAddress, fileName)
        .then((data) => {
          const newFiles = formik.values.previewFiles.filter(
            (_, index) => index !== idx,
          )

          formik.setFieldValue('previewFiles', newFiles)
          formik.setSubmitting(false)
        })
        .catch((e) => {
          formik.setSubmitting(false)
        })
    },
    [formik, authorization.currentUser.accountAddress, deletePreviewfile],
  )

  return (
    <BootstrapDialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogContent sx={{ position: 'relative' }}>
        {!loading ? (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box display={'flex'} alignItems={'center'} gap={2} pt={3} px={3}>
              {backForwards && (
                <IconButton onClick={backForwards}>
                  <CardMedia
                    component={'img'}
                    image={BackDarkIcon}
                    sx={{ width: 10, objectFit: 'cover' }}
                  />
                </IconButton>
              )}
              <Typography
                sx={{
                  fontFamily: 'var(--font-semi-bold)',
                  fontSize: 21,
                  color: theme.palette.text.primary,
                }}
              >
                Information Needed
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

            <Box display={'flex'} p={3} gap={2}>
              <Box display={'flex'} gap={2}>
                <StyledImage src={commonLicenseData.imagePath} />

                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  justifyContent={'center'}
                  gap={0.5}
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
                    {`${licensingTypeList[licensingType].label} ${
                      accessLevel === AccessLevel.Exclusive
                        ? 'Exclusive'
                        : 'Nonexclusive'
                    }`}
                  </Typography>
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

                      <CardMedia
                        component={'img'}
                        image={DotDarkIcon}
                        sx={{ width: 2, height: 2 }}
                      />
                      <Typography
                        component={'span'}
                        fontSize={12}
                        color={theme.palette.text.secondary}
                      >
                        {commonLicenseData.albumName}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Divider />

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                p: 3,
                maxHeight: 576,
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              <Typography
                fontSize={'16px'}
                fontFamily={'var(--font-semi-bold)'}
                color={theme.palette.text.primary}
              >
                Notes From Seller
              </Typography>

              <Typography
                fontSize={'16px'}
                color={theme.palette.text.secondary}
              >
                The license being sold is under the following terms
              </Typography>

              <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
                border={`1px solid ${theme.palette.grey[600]}`}
                p={2}
                borderRadius={2.5}
              >
                <Box display={'flex'} alignItems={'center'} gap={0.5}>
                  <Typography
                    variant="subtitle1"
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
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                  }}
                >
                  {syncData.infiniteExclusiveDuration
                    ? 'Infinite'
                    : dayjs(syncData.exclusiveEndTime).format('MM/DD/YY hA')}
                </Typography>
              </Box>

              <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
                border={`1px solid ${theme.palette.grey[600]}`}
                p={2}
                borderRadius={2.5}
              >
                <Box display={'flex'} alignItems={'center'} gap={0.5}>
                  <Typography
                    variant="subtitle1"
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
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                  }}
                >
                  {`${syncData.country}, ${syncData.state}`}
                </Typography>
              </Box>

              <Box
                display={'flex'}
                flexDirection={'column'}
                border={`1px solid ${theme.palette.grey[600]}`}
                p={2}
                borderRadius={2.5}
                gap={1}
              >
                <Typography
                  variant="subtitle1"
                  color={theme.palette.text.secondary}
                  whiteSpace={'nowrap'}
                >
                  Usage Notes and Special Requirements
                </Typography>

                <Typography
                  borderRadius={1}
                  bgcolor={theme.palette.secondary.main}
                  boxShadow={'0px 1px 2px 0px #1018280D'}
                  px={1.5}
                  py={1}
                  minHeight={72}
                  sx={{
                    wordWrap: 'break-word',
                  }}
                >
                  {syncData.usageNotes}
                </Typography>
              </Box>

              <form
                noValidate
                className="innerContainer"
                onSubmit={formik.handleSubmit}
              >
                <Box display={'flex'} flexDirection={'column'} py={3} gap={1}>
                  <Typography
                    fontSize={'16px'}
                    fontFamily={'var(--font-semi-bold)'}
                    color={theme.palette.text.primary}
                  >
                    Usage Details (Information Needed)
                  </Typography>
                  <Typography
                    fontSize={'16px'}
                    color={theme.palette.text.secondary}
                  >
                    Before you are able to own this license, you will have to
                    tell the the artist how it will be used and receive
                    approval.
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12}>
                    <Stack spacing={1}>
                      <Box display={'flex'} alignItems={'center'} gap={0.5}>
                        <Typography
                          variant="subtitle1"
                          color={theme.palette.text.secondary}
                        >
                          Business or Personal Project
                        </Typography>
                        <CardMedia
                          component={'img'}
                          image={StrokeDarkIcon}
                          sx={{ width: 12, objectFit: 'cover' }}
                        />
                      </Box>
                      <StyledSelectFC
                        select
                        name="projectType"
                        value={formik.values.projectType}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      >
                        {projectTypes.map((label, idx) => (
                          <MenuItem key={idx} value={label}>
                            {label}
                          </MenuItem>
                        ))}
                      </StyledSelectFC>
                    </Stack>
                  </Grid>

                  {licensingType > LicensingTypes.Creator && (
                    <>
                      <Grid item xs={6} md={6}>
                        <Stack spacing={1}>
                          <Box
                            display={'flex'}
                            alignItems={'center'}
                            pt={1}
                            gap={0.5}
                          >
                            <Typography
                              variant="subtitle1"
                              color={theme.palette.text.secondary}
                            >
                              {contentLabels[licensingType].title}
                            </Typography>
                            <CardMedia
                              component={'img'}
                              image={StrokeDarkIcon}
                              sx={{ width: 12, objectFit: 'cover' }}
                            />
                          </Box>
                          <StyledOutlinedInputFC
                            type="text"
                            value={formik.values.contentTitle}
                            placeholder={
                              contentLabels[licensingType].titlePlaceholder
                            }
                            name="contentTitle"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            fullWidth
                            error={Boolean(
                              formik.touched.contentTitle &&
                                formik.errors.contentTitle,
                            )}
                          />
                          {formik.touched.contentTitle &&
                            formik.errors.contentTitle && (
                              <FormHelperText
                                error
                                id="helper-text-contentTitle"
                              >
                                {formik.errors.contentTitle}
                              </FormHelperText>
                            )}
                        </Stack>
                      </Grid>

                      <Grid item xs={6}>
                        <Stack spacing={1}>
                          <Box
                            display={'flex'}
                            alignItems={'center'}
                            pt={1}
                            gap={0.5}
                          >
                            <Typography
                              variant="subtitle1"
                              color={theme.palette.text.secondary}
                            >
                              {contentLabels[licensingType].platforms}
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
                              formik.touched.intendedPlatforms &&
                                formik.errors.intendedPlatforms,
                            )}
                            placeholder={
                              contentLabels[licensingType].platformsPlaceholder
                            }
                            type="text"
                            value={formik.values.intendedPlatforms}
                            name="intendedPlatforms"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                          />
                          {formik.touched.intendedPlatforms &&
                            formik.errors.intendedPlatforms && (
                              <FormHelperText
                                error
                                id="helper-text-intendedPlatforms"
                              >
                                {formik.errors.intendedPlatforms}
                              </FormHelperText>
                            )}
                        </Stack>
                      </Grid>

                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <Box
                            display={'flex'}
                            alignItems={'center'}
                            pt={1}
                            gap={0.5}
                          >
                            <Typography
                              variant="subtitle1"
                              color={theme.palette.text.secondary}
                            >
                              Expected Release Date
                            </Typography>
                            <CardMedia
                              component={'img'}
                              image={StrokeDarkIcon}
                              sx={{ width: 12, objectFit: 'cover' }}
                            />
                          </Box>

                          <DatePicker
                            disabled={formik.isSubmitting}
                            value={formik.values.releaseDate}
                            onChange={(date) => {
                              formik.setFieldValue(
                                'releaseDate',
                                dayjs(date).valueOf(),
                              )
                            }}
                            renderInput={(params) => {
                              return (
                                <TextField
                                  fullWidth
                                  label="releaseDate"
                                  name="releaseDate"
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
                        </Stack>
                      </Grid>

                      {licensingType === LicensingTypes.Advertisement && (
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <Box
                              display={'flex'}
                              alignItems={'center'}
                              pt={1}
                              gap={0.5}
                            >
                              <Typography
                                variant="subtitle1"
                                color={theme.palette.text.secondary}
                              >
                                Description of Product Being Advertised
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
                                formik.touched.productionDescription &&
                                  formik.errors.productionDescription,
                              )}
                              placeholder={'Describe your product'}
                              type="text"
                              value={formik.values.productionDescription}
                              name="productionDescription"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            />
                            {formik.touched.productionDescription &&
                              formik.errors.productionDescription && (
                                <FormHelperText
                                  error
                                  id="helper-text-productionDescription"
                                >
                                  {formik.errors.productionDescription}
                                </FormHelperText>
                              )}
                          </Stack>
                        </Grid>
                      )}

                      {licensingType === LicensingTypes.AiTraining && (
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <Box
                              display={'flex'}
                              alignItems={'center'}
                              pt={1}
                              gap={0.5}
                            >
                              <Typography
                                variant="subtitle1"
                                color={theme.palette.text.secondary}
                              >
                                Description of AI Model
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
                                formik.touched.aiModelDescription &&
                                  formik.errors.aiModelDescription,
                              )}
                              placeholder={'Describe your product'}
                              type="text"
                              value={formik.values.aiModelDescription}
                              name="aiModelDescription"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            />
                            {formik.touched.aiModelDescription &&
                              formik.errors.aiModelDescription && (
                                <FormHelperText
                                  error
                                  id="helper-text-aiModelDescription"
                                >
                                  {formik.errors.aiModelDescription}
                                </FormHelperText>
                              )}
                          </Stack>
                        </Grid>
                      )}

                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <Box
                            display={'flex'}
                            alignItems={'center'}
                            pt={1}
                            gap={0.5}
                          >
                            <Typography
                              variant="subtitle1"
                              color={theme.palette.text.secondary}
                            >
                              Content Description
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
                              formik.touched.contentDescription &&
                                formik.errors.contentDescription,
                            )}
                            placeholder={
                              contentLabels[licensingType]
                                .descriptionPlaceholder
                            }
                            type="text"
                            value={formik.values.contentDescription}
                            name="contentDescription"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                          />
                          {formik.touched.contentDescription &&
                            formik.errors.contentDescription && (
                              <FormHelperText
                                error
                                id="helper-text-contentDescription"
                              >
                                {formik.errors.contentDescription}
                              </FormHelperText>
                            )}
                        </Stack>
                      </Grid>

                      <Grid item xs={12}>
                        <Box sx={{ width: '100%', mb: 2 }}>
                          <input
                            accept="image/*,video/*"
                            style={{ display: 'none' }}
                            id="preview-file"
                            type="file"
                            onChange={uploadPreviews}
                            disabled={formik.isSubmitting}
                          />
                          <label htmlFor="preview-file">
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 1,
                                width: '100%',
                                height: 42,
                                borderRadius: 2,
                                cursor: 'pointer',
                                backgroundColor: theme.palette.success.light,
                              }}
                            >
                              <Typography
                                fontSize={16}
                                fontWeight={600}
                                color={theme.palette.grey[800]}
                              >
                                Upload Previews Of Production
                              </Typography>
                              <CardMedia
                                component={'img'}
                                image={StrokeDarkIcon}
                                sx={{ width: 12, objectFit: 'cover' }}
                              />
                            </Box>
                          </label>
                        </Box>

                        <Box
                          display={'flex'}
                          flexDirection={'column'}
                          gap={0.5}
                        >
                          {formik?.values?.previewFiles?.map((file, idx) => {
                            return (
                              <Box
                                key={idx}
                                display={'flex'}
                                alignItems={'center'}
                                gap={2}
                              >
                                <Typography
                                  fontSize={16}
                                  fontWeight={400}
                                  color={theme.palette.text.secondary}
                                >
                                  {file.split('/').pop()}
                                </Typography>

                                <IconButton
                                  onClick={() => {
                                    deletePreviewfileHandler(idx)
                                  }}
                                >
                                  <CardMedia
                                    component={'img'}
                                    image={CloseDarkIcon}
                                  />
                                </IconButton>
                              </Box>
                            )
                          })}
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <Typography
                            fontFamily={'var(--font-semi-bold)'}
                            fontSize={'16px'}
                            color={theme.palette.text.primary}
                          >
                            Optional Usage Notes and Special Requirements
                          </Typography>
                          <Box display={'flex'} alignItems={'center'} gap={0.5}>
                            <Typography
                              variant="subtitle1"
                              color={theme.palette.text.secondary}
                            >
                              Describe any additional information on the
                              license’s usage
                            </Typography>
                            <CardMedia
                              component={'img'}
                              image={StrokeDarkIcon}
                              sx={{ width: 12, objectFit: 'cover' }}
                            />
                          </Box>
                          <StyledOutlinedInputFC
                            fullWidth
                            multiline
                            maxRows={10}
                            placeholder={'Tell us more (Optional)'}
                            error={Boolean(
                              formik.touched.licenseUsage &&
                                formik.errors.licenseUsage,
                            )}
                            type="text"
                            value={formik.values.licenseUsage}
                            name="licenseUsage"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                          />
                          {formik.touched.licenseUsage &&
                            formik.errors.licenseUsage && (
                              <FormHelperText
                                error
                                id="helper-text-licenseUsage"
                              >
                                {formik.errors.licenseUsage}
                              </FormHelperText>
                            )}
                        </Stack>
                      </Grid>
                    </>
                  )}

                  {formik.errors.submit && (
                    <Grid item xs={12}>
                      <FormHelperText error>
                        {formik.errors.submit.toString()}
                      </FormHelperText>
                    </Grid>
                  )}
                </Grid>
              </form>
            </Box>

            <Divider />

            <Button
              disableElevation
              disabled={formik.isSubmitting}
              sx={{
                m: 2,
                height: 42,
                width: '-webkit-fill-available',
                borderRadius: '46px',
                fontFamily: 'var(--font-semi-bold)',
                fontSize: '16px',
                textTransform: 'none',
                color: '#000000',
                backgroundColor: '#ffffff',
                '&:hover': {
                  backgroundColor: theme.palette.grey[200],
                },
              }}
              onClick={() => formik.handleSubmit()}
            >
              Continue
            </Button>
          </LocalizationProvider>
        ) : (
          <CircularProgress />
        )}
      </DialogContent>
    </BootstrapDialog>
  )
}
