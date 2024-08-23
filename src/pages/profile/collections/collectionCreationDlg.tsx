import {
  Box,
  CardMedia,
  Divider,
  IconButton,
  Input,
  InputBase,
  Paper,
  Typography,
  useTheme,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import PencilDarkIcon from 'src/assets/images/pen_dark.png'
import UploadDarkIcon from 'src/assets/images/upload_dark.png'
import { useContext, useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import SecondaryButton from 'src/components/buttons/secondary-button'
import { StyledTextAreaFC } from 'src/components/styledInput'
import SearchIcon from '@mui/icons-material/Search'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { getListedLicenseBySellerId, savePublicProfile } from 'src/api'
import Grid from '@mui/material/Unstable_Grid2'
import LicenseCard from 'src/components/licenseCard'
import PrimaryButton from 'src/components/buttons/primary-button'
import ExplicitDarkDefault from 'src/assets/images/explicit_dark_default.png'
import { formatMilliseconds } from 'src/utils/utils'
import useAwsS3 from 'src/hooks/useAwsS3'
import toast from 'react-hot-toast'
import { CollectionIF, ImagePath } from 'src/interface'
import CloseDarkIcon from 'src/assets/images/close_dark.png'
import { PublicProfileContext } from 'src/context/publicProfileContext'

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
    maxWidth: 800,
    borderRadius: 12,
  },
}))

interface Props {
  collectionId: number
  open: boolean
  setOpen: (open: boolean) => void
}

export default function CollectionCreationDlg({
  collectionId,
  open,
  setOpen,
}: Props) {
  const theme = useTheme()
  const { publicProfileData, setPublicProfileData } =
    useContext(PublicProfileContext)
  const [editable, setEditable] = useState<boolean>(false)
  const [collectionName, setCollectionName] = useState<string>('New collection')
  const [description, setDescription] = useState<string>('')
  const [searchedLicenses, setSearchedLicenses] = useState<Array<any>>([])
  const [listedLicenses, setListedLicenses] = useState<Array<any>>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedLicenses, setSelectedLicenses] = useState<Array<number>>([])
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [collectionImage, setCollectionImage] = useState<ImagePath>({
    imageFile: null,
    imagePath: null,
  })

  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  const { uploadCollection } = useAwsS3()

  const handleClose = () => {
    setOpen(false)
  }

  const collectionNameHandler = (newCollectionName: string) => {
    setCollectionName(newCollectionName)
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value)
  }

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      try {
        if (authorization?.currentUser?.sellerId) {
          const data = await getListedLicenseBySellerId(
            authorization?.currentUser?.sellerId,
          )
          setListedLicenses(data)
          setSearchedLicenses(data)
        }
      } catch (e) {
        console.log('error in getting all listed license by artist id', e)
      }
      setIsLoading(false)
    }
    init()
  }, [authorization?.currentUser?.sellerId])

  const selectHandler = (license) => {
    let tmp
    tmp = [...selectedLicenses]
    if (selectedLicenses.includes(license.listedId)) {
      tmp = tmp.filter((item) => item !== license.listedId)
      setSelectedLicenses(tmp)
    } else {
      tmp.push(license.listedId)
      setSelectedLicenses(tmp)
    }
    setSelectedLicenses(tmp)
  }

  const uploadCollectionHandler = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files[0]
    if (file) {
      const toastUploading = toast.loading('Uploading your cover image...')
      setSubmitting(true)
      uploadCollection(file, authorization.currentUser.accountAddress)
        .then((data) => {
          setCollectionImage({
            imagePath: data,
            imageFile: file,
          })
          setSubmitting(false)
          toast.success('Uploaded your cover image', {
            id: toastUploading,
          })
        })
        .catch((e) => {
          setCollectionImage(null)
          setSubmitting(false)
          toast.error(e.message, {
            id: toastUploading,
          })
        })
    }
  }

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedLicenses(
      listedLicenses.filter((license) => {
        return license.licenseName
          .toLocaleLowerCase()
          .includes(event.target.value.toLocaleLowerCase())
      }),
    )
  }

  const createCollectionHandler = async () => {
    setPublicProfileData((prev) => ({
      ...prev,
      collections: [
        ...prev.collections,
        {
          description,
          collectionName,
          selectedLicenses,
          imagePath: collectionImage.imagePath,
          collectionId,
          createdAt: Date.now(),
          published: true,
        },
      ],
    }))
    setDescription('')
    setCollectionName('New collection')
    setCollectionImage({
      imageFile: null,
      imagePath: null,
    })
    setSelectedLicenses([])
    setOpen(false)
  }

  return (
    <BootstrapDialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogContent sx={{ position: 'relative' }}>
        <Box>
          <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
            p={3}
          >
            <Box display={'flex'} alignItems={'center'} gap={1.5}>
              {editable ? (
                <Input
                  placeholder="Write new collection"
                  inputProps={{
                    'aria-label': 'description',
                    maxLength: 20,
                  }}
                  onBlur={() => {
                    setEditable(false)
                  }}
                  onChange={(e) => collectionNameHandler(e.target.value)}
                  value={collectionName}
                  sx={{
                    width: 116,
                    py: theme.spacing(0, 1),
                    '&>input::after': {
                      borderBottom: `1px dashed ${theme.palette.success.light}`,
                    },
                  }}
                />
              ) : (
                <Typography
                  fontFamily="var(--font-medium)"
                  fontSize="16px"
                  height={26}
                  borderBottom={`1px dashed ${theme.palette.success.light}`}
                >
                  {collectionName ?? 'New collection'}
                </Typography>
              )}
              <IconButton onClick={() => setEditable(true)}>
                <CardMedia component={'img'} image={PencilDarkIcon} />
              </IconButton>
            </Box>

            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          <Box display={'flex'} flexDirection={'column'} gap={3} p={3}>
            <Box display={'flex'} flexDirection={'column'} gap={1}>
              <Typography
                fontSize={16}
                fontFamily={'var(--font-semi-bold)'}
                color={theme.palette.containerPrimary.contrastText}
              >
                Add cover image
              </Typography>

              <Box
                display={'flex'}
                alignItems={'center'}
                gap={2}
                borderRadius={2.5}
                border={`1px solid ${theme.palette.grey[600]}`}
                p={1.5}
              >
                {!collectionImage?.imagePath ? (
                  <Box sx={{ width: 80 }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="collection-image-file"
                      type="file"
                      onChange={uploadCollectionHandler}
                      disabled={submitting}
                    />
                    <label htmlFor="collection-image-file">
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 80,
                          height: 80,
                          borderRadius: 1.5,
                          cursor: 'pointer',
                          backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23333' stroke-width='1' stroke-dasharray='10' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
                        }}
                      >
                        <CardMedia
                          component={'img'}
                          image={UploadDarkIcon}
                          sx={{ width: 24, height: 24 }}
                        />
                      </Box>
                    </label>
                  </Box>
                ) : (
                  <Box
                    display={'flex'}
                    alignItems={'center'}
                    position={'relative'}
                  >
                    <IconButton
                      sx={{
                        position: 'absolute',
                        right: 4,
                        top: 4,
                      }}
                      onClick={() =>
                        setCollectionImage({
                          imageFile: null,
                          imagePath: null,
                        })
                      }
                    >
                      <CardMedia
                        image={CloseDarkIcon}
                        component={'img'}
                        sx={{
                          width: 10,
                          height: 10,
                        }}
                      />
                    </IconButton>
                    <CardMedia
                      component={'img'}
                      image={collectionImage?.imagePath}
                      sx={{
                        borderBottomLeftRadius: 6,
                        borderTopLeftRadius: 6,
                        width: 64,
                        height: 64,
                        objectFit: 'cover',
                      }}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: 1,
                        borderTopRightRadius: 6,
                        borderBottomRightRadius: 6,
                        bgcolor: theme.palette.grey[600],
                        pl: 1,
                        height: 64,
                        width: 116,
                      }}
                    >
                      <Typography
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontFamily: 'var(--font-semi-bold)',
                          fontSize: 10,
                          color: theme.palette.grey[200],
                          lineHeight: '10px',
                          maxWidth: 64,
                        }}
                      >
                        {collectionImage.imageFile.name}
                      </Typography>
                      <Typography
                        sx={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontSize: 10,
                          color: theme.palette.text.secondary,
                          lineHeight: '10px',
                          maxWidth: 64,
                        }}
                      >
                        {`${(
                          collectionImage.imageFile.size / 1000
                        ).toLocaleString()} kB`}
                      </Typography>
                    </Box>
                  </Box>
                )}

                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  py={1.5}
                  gap={0.5}
                >
                  <Typography
                    fontSize={14}
                    fontFamily={'var(--font-semi-bold)'}
                    color={theme.palette.containerSecondary.contrastText}
                  >
                    {collectionImage.imageFile
                      ? 'Change image'
                      : 'Add or Drag file here to upload'}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    color={theme.palette.text.secondary}
                  >
                    Please only use the following file formats: .png, .jpg, .gif
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    color={theme.palette.text.secondary}
                  >
                    Max file size: 20MBs
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box display={'flex'} flexDirection={'column'} gap={1}>
              <Typography
                fontSize={16}
                fontFamily={'var(--font-semi-bold)'}
                color={theme.palette.containerPrimary.contrastText}
              >
                Add a description
              </Typography>

              <StyledTextAreaFC
                fullWidth
                type="text"
                multiline
                maxRows={10}
                placeholder="What is this collection about?"
                value={description}
                onChange={handleChange}
                sx={{ height: 80 }}
              />
            </Box>

            {selectedLicenses.length > 0 && (
              <Box display={'flex'} flexDirection={'column'} gap={1}>
                <Typography
                  fontSize={16}
                  fontFamily={'var(--font-semi-bold)'}
                  color={theme.palette.containerPrimary.contrastText}
                >
                  Selected licenses
                </Typography>

                {listedLicenses
                  .filter((license) =>
                    selectedLicenses.find((item) => item == license.listedId),
                  )
                  .map((license, idx) => {
                    return (
                      <Box
                        display={'flex'}
                        alignItems={'center'}
                        borderRadius={2.5}
                        border={`1px solid ${theme.palette.grey[600]}`}
                        p={1}
                        gap={2}
                        key={idx}
                      >
                        <CardMedia
                          image={license.imagePath}
                          component={'img'}
                          sx={{
                            width: 64,
                            height: 64,
                            borderRadius: 1.5,
                          }}
                        />

                        <Box
                          display={'flex'}
                          alignItems={'center'}
                          justifyContent={'space-between'}
                          width={'100%'}
                        >
                          <Box display={'flex'} alignItems={'center'} gap={1.5}>
                            <Box
                              display={'flex'}
                              flexDirection={'column'}
                              gap={0.25}
                            >
                              <Typography
                                component={'span'}
                                sx={{
                                  fontFamily: 'var(--font-medium)',
                                  fontSize: '16px',
                                  color: theme.palette.text.primary,
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {license.licenseName}
                              </Typography>
                              <Box
                                display={'flex'}
                                alignItems={'center'}
                                gap={'6px'}
                              >
                                <CardMedia
                                  className={'defaultImg'}
                                  image={ExplicitDarkDefault}
                                  component={'img'}
                                  sx={{ width: 21, height: 21 }}
                                />

                                {license.artists.map(
                                  (artist: { name: string }, index: number) => {
                                    return (
                                      <Typography
                                        sx={{
                                          fontFamily: 'var(--font-base)',
                                          fontSize: '14px',
                                          color: theme.palette.text.secondary,
                                          whiteSpace: 'nowrap',
                                        }}
                                        component={'span'}
                                        key={index}
                                      >
                                        {`${artist.name} ${
                                          license.artists?.length == index + 1
                                            ? ''
                                            : ', '
                                        }`}
                                      </Typography>
                                    )
                                  },
                                )}
                              </Box>
                            </Box>
                          </Box>

                          <Typography
                            fontSize={16}
                            color={theme.palette.containerPrimary.contrastText}
                          >
                            {formatMilliseconds(license.length)}
                          </Typography>
                        </Box>
                      </Box>
                    )
                  })}
              </Box>
            )}

            <Box display={'flex'} flexDirection={'column'} gap={1}>
              <Typography
                fontSize={16}
                fontFamily={'var(--font-semi-bold)'}
                color={theme.palette.containerPrimary.contrastText}
              >
                Add licenses
              </Typography>

              <Box
                display={'flex'}
                flexDirection={'column'}
                gap={2}
                borderRadius={2.5}
                border={`1px solid ${theme.palette.grey[600]}`}
                p={1.5}
              >
                <Paper
                  component="form"
                  sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <IconButton
                    type="button"
                    sx={{ p: '10px' }}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search licenses..."
                    onChange={searchHandler}
                  />
                </Paper>

                {!isLoading && (
                  <Grid
                    container
                    spacing={1}
                    columns={60}
                    sx={{
                      width: '100%',
                      maxHeight: 300,
                      overflowY: 'auto',
                      '&::-webkit-scrollbar': {
                        display: 'none',
                      },
                      msOverflowStyle: 'none',
                      scrollbarWidth: 'none',
                    }}
                  >
                    {searchedLicenses?.map((license, idx) => {
                      return (
                        <Grid md={15} xs={30} sm={60} key={idx}>
                          <Box
                            display={'flex'}
                            flexDirection={'column'}
                            gap={1}
                            borderRadius={3}
                            p={1}
                            sx={{
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: '#363636',
                              },
                              backgroundColor: selectedLicenses.find(
                                (item) => item == license.listedId,
                              )
                                ? '#363636'
                                : 'inherit',
                            }}
                            onClick={() => selectHandler(license)}
                          >
                            <CardMedia
                              image={license?.imagePath}
                              component={'img'}
                              sx={{ borderRadius: 2.5 }}
                            />

                            <Box display={'flex'} flexDirection={'column'}>
                              <Typography
                                fontSize={14}
                                fontFamily={'var(--font-bold)'}
                                color={theme.palette.text.primary}
                                sx={{
                                  width: '100%',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {license.licenseName}
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                color={theme.palette.text.secondary}
                                sx={{
                                  width: '100%',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {license.albumName}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )
                    })}
                  </Grid>
                )}
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box display={'flex'} flexDirection={'column'} gap={2} p={1.5}>
            <PrimaryButton onClick={createCollectionHandler}>
              Create collection
            </PrimaryButton>
          </Box>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  )
}
