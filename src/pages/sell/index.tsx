import * as React from 'react'
import Stack from '@mui/material/Stack'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import {
  Box,
  CardMedia,
  Divider,
  IconButton,
  InputAdornment,
  Pagination,
  Typography,
  useTheme,
} from '@mui/material'
import SecondaryButton from 'src/components/buttons/secondary-button'
import { toast } from 'react-hot-toast'
import {
  getAlbumsOfArtist,
  getSongsOfAlbum,
  searchAlbums,
} from 'src/api/spotify'
import PageLoader from 'src/components/pageLoader'
import { useNavigate } from 'react-router-dom'
import Grid from '@mui/material/Unstable_Grid2'
import CustomizedContainer from 'src/components/customizedeContainer'
import {
  LicenseDataIF,
  AccessLevel,
  ListingStatusType,
  DiscountTypeEN,
} from 'src/interface'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { listingFormatTypes } from 'src/config'
import { StyledInput } from '../profile/style'
import BackDarkIcon from 'src/assets/images/back_dark.svg'
import SelectSong from './selectSong'
import SearchDarkIcon from 'src/assets/images/listing/search_dark.svg'
import ConfiguringLicenseListing from './configuringLicense'

export const initialTemplateData = {
  fPrice: 0,
  sPrice: 0,
  tPrice: 0,
  totalSupply: 1,
  listingStartTime: Date.now(),
  listingEndTime: Date.now(),
  exclusiveEndTime: Date.now(),
  revenues: [],
  listingFormatValue: listingFormatTypes.bidAndPrice,
  infiniteSupply: true,
  infiniteListingDuration: true,
  infiniteExclusiveDuration: true,
  listed: ListingStatusType.NonListed,
  accessLevel: AccessLevel.Both,
  discountCode: {
    name: 'Untitled Discount',
    code: '',
    discountType: DiscountTypeEN.PercentageOff,
    percentage: 0,
    fixedAmount: 0,
    infinite: false,
    endTime: Date.now(),
    actived: false,
  },
  usageNotes: '',
  country: 'United States',
  state: 'New York',
  signature: '',
}

const initialLicenseData = {
  albumName: '',
  albumId: '',
  sellerName: '',
  sellerId: '',
  avatarPath: '',
  licenseName: '',
  imagePath: '',
  previewUrl: '',
  trackId: '',
  genres: [],
  artists: [],
  sellerAddress: '',
  signingData: {
    creator: initialTemplateData,
    movie: initialTemplateData,
    advertisement: initialTemplateData,
    videoGame: initialTemplateData,
    tvSeries: initialTemplateData,
    aiTraining: initialTemplateData,
  },
}

enum ActiveSteps {
  SelectingAlbum = 0,
  SelectingSong,
  ConfiguringLicense,
}

const steps = ['Select album', 'Select song', 'Configure license']

export interface ChildMethods {
  loadHandler: (value: boolean) => void
}

export default function SellingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const onePage = 10

  const [activeStep, setActiveStep] = React.useState<ActiveSteps>(
    ActiveSteps.SelectingAlbum,
  )
  const [keyword, setKeyword] = React.useState<string>()
  const [loading, setLoading] = React.useState(true)
  const [songLoading, setSongLoading] = React.useState(true)

  const [curAlbum, setCurAlbum] = React.useState<any>()
  const [searchedAlbums, setSearchedAlbums] = React.useState<Array<any>>()
  const [albumPageNumber, setAlbumPageNumber] = React.useState<number>(1)
  const [allAlbums, setAllAlbums] = React.useState<any>()
  const [totalAlbumPageNumber, setTotalAlbumPageNumber] =
    React.useState<number>(1)

  const [songPageNumber, setSongPageNumber] = React.useState<number>(1)
  const [searchedSongs, setSearchedSongs] = React.useState<any>([])
  const [totalSongPageNumber, setTotalSongPageNumber] =
    React.useState<number>(1)

  const [licenseData, setLicenseData] =
    React.useState<LicenseDataIF>(initialLicenseData)

  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  const nextStepHandler = () => {
    setActiveStep((prevActiveStep) => {
      if (prevActiveStep >= ActiveSteps.ConfiguringLicense) {
        return ActiveSteps.ConfiguringLicense
      } else {
        return prevActiveStep + 1
      }
    })
  }

  const backStepHandler = () => {
    setActiveStep((prevActiveStep) => {
      if (prevActiveStep > ActiveSteps.SelectingSong) {
        return prevActiveStep - 1
      } else {
        return 0
      }
    })
  }

  React.useEffect(() => {
    setLoading(true)
    const init = async () => {
      try {
        const { success, data, msg } = await getAlbumsOfArtist(
          authorization.currentUser.accountAddress,
          albumPageNumber,
        )
        if (success) {
          const { accountId, accountName, accountAvatar, albums } = data
          setLicenseData((prevState) => ({
            ...prevState,
            sellerName: accountName,
            sellerId: accountId,
            avatarPath: accountAvatar,
            sellerAddress: authorization.currentUser.accountAddress,
          }))

          setAllAlbums(albums)
          setSearchedAlbums(albums)
          setTotalAlbumPageNumber(Math.floor(data.albums.length / onePage) + 1)
        } else {
          toast.error(msg)
        }
      } catch (e) {
        console.log('error in gettting album from artist', e)
        toast.error(e?.msg ?? e.message)
      }
      setLoading(false)
    }

    init()
  }, [albumPageNumber, authorization.currentUser])

  const searchHandler = async (event: any) => {
    setKeyword(event.target.value)
    switch (activeStep) {
      case ActiveSteps.SelectingAlbum:
        setSearchedAlbums(
          allAlbums.filter((album) =>
            album.name.toLowerCase().includes(event.target.value.toLowerCase()),
          ),
        )
        break
      case ActiveSteps.SelectingSong:
        setSearchedSongs(
          searchedSongs.filter((song) =>
            song.name.toLowerCase().includes(event.target.value.toLowerCase()),
          ),
        )
        break
      default:
        break
    }
  }

  const albumKeyHandler = async (event: any) => {
    setLoading(true)
    if (event.keyCode === 13) {
      try {
        if (event.target.value && event.target.value !== '') {
          const toastSearching = toast.loading('Searching Albums now...')
          try {
            const res = await searchAlbums(
              licenseData.sellerId,
              event.target.value,
            )
            if (res.status === 200 && res.data.success) {
              const { albums } = res.data.data
              setSearchedAlbums(albums)
              toast.success('Searched albums succssfully', {
                id: toastSearching,
              })
            } else {
              toast.error(res.data.msg, {
                id: toastSearching,
              })
            }
          } catch (e) {
            console.log('error in search albums', e)
            toast.error('Something went wrong', {
              id: toastSearching,
            })
          }
        } else {
          setSearchedAlbums(allAlbums)
        }
      } catch (e) {
        console.log('error in searching album', e)
      }
    }
    setLoading(false)
  }

  const backHandler = () => {
    switch (activeStep) {
      case ActiveSteps.SelectingAlbum:
        navigate(-1)
        break
      case ActiveSteps.SelectingSong:
        break
      case ActiveSteps.ConfiguringLicense:
        break
      default:
        break
    }
    backStepHandler()
  }

  const selectAlbumHandler = async (album) => {
    setSongLoading(true)
    const toastLoading = toast.loading('Loading songs of this album')
    try {
      const { success, data, msg } = await getSongsOfAlbum(
        album.id,
        songPageNumber,
      )
      if (success) {
        nextStepHandler()
        setCurAlbum(album)
        setLicenseData((prev) => ({ ...prev, albumName: album.name }))
        setSearchedSongs(data)
        setSongPageNumber(1)
        setTotalSongPageNumber(Math.floor(data.length / onePage) + 1)
        toast.success('Loaded successfully', {
          id: toastLoading,
        })
      } else {
        toast.error(msg, { id: toastLoading })
      }
    } catch (e) {
      console.log('error in getting songs of album', e)
      toast.error(e.message, {
        id: toastLoading,
      })
    }
    setSongLoading(false)
  }

  const albumPageinationHandler = async (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    event.preventDefault()
    setLoading(true)
    const toastLoading = toast.loading('Loading Your Albums')
    try {
      setAlbumPageNumber(page)
      const { success, data, msg } = await getAlbumsOfArtist(
        authorization.currentUser.accountAddress,
        page,
      )
      if (success) {
        const { albums } = data
        setAllAlbums(albums)
        setSearchedAlbums(albums)
        toast.success('Loaded successfully', { id: toastLoading })
      } else {
        toast.error(msg, { id: toastLoading })
      }
    } catch (e) {
      console.log('error in gettting album from artist', e)
      toast.error(e?.msg ?? e.message, {
        id: toastLoading,
      })
    }
    setLoading(false)
  }

  return (
    <CustomizedContainer>
      <Box mt={13}>
        <Typography variant="h2">Sell a license</Typography>
        <Box display={'flex'} flexDirection={'row'} mt={2.5}>
          <Box maxHeight={160} minWidth={204}>
            <Stepper
              orientation="vertical"
              activeStep={activeStep}
              sx={{
                '& .MuiStepConnector-root': {
                  ml: 3,
                },
              }}
            >
              {steps.map((label, idx) => (
                <Step
                  key={label}
                  sx={{
                    borderRadius: 3,
                    bgcolor:
                      activeStep >= idx
                        ? theme.palette.grey[700]
                        : theme.palette.background.paper,
                    maxWidth: 180,
                    p: '8px 12px',
                  }}
                >
                  <StepLabel
                    sx={{
                      '& span': {
                        fontSize: '14px',
                        fontFamily: 'var(--font-medium)',
                      },
                      '& span.Mui-active, & span.Mui-completed': {
                        color: theme.palette.text.secondary,
                      },
                      '& .Mui-active .MuiStepIcon-text': {
                        fill: '#121212',
                        fontFamily: 'var(--font-bold)',
                        fontSize: 14,
                      },
                      '& .MuiStepIcon-text': {
                        fill: theme.palette.text.secondary,
                        fontFamily: 'var(--font-bold)',
                        fontSize: 14,
                      },
                      '.MuiStepIcon-root.Mui-active, .MuiStepIcon-root.Mui-completed ':
                        {
                          color: theme.palette.success.light,
                          width: 28,
                          height: 28,
                        },
                      '& .MuiStepIcon-root': {
                        color: theme.palette.secondary.main,
                        width: 28,
                        height: 28,
                      },
                    }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          <Stack
            width={'100%'}
            position={'relative'}
            bgcolor={theme.palette.secondary.main}
            borderRadius={3}
          >
            {activeStep <= ActiveSteps.SelectingSong && (
              <React.Fragment>
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  justifyContent={'center'}
                  gap={2}
                  p={2}
                >
                  {activeStep === ActiveSteps.SelectingAlbum ? (
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-semi-bold)',
                        fontSize: '18px',
                        color: theme.palette.text.primary,
                      }}
                    >
                      Select from discography
                    </Typography>
                  ) : (
                    <Box display={'flex'} alignItems={'center'} gap={1.5}>
                      <IconButton onClick={backHandler}>
                        <CardMedia
                          component={'img'}
                          image={BackDarkIcon}
                          sx={{ width: 10, objectFit: 'cover' }}
                        />
                      </IconButton>
                      <Typography
                        sx={{
                          fontFamily: 'var(--font-semi-bold)',
                          fontSize: '18px',
                        }}
                      >
                        Select a song to license on the marketplace
                      </Typography>
                    </Box>
                  )}
                  {activeStep === ActiveSteps.SelectingAlbum && (
                    <StyledInput
                      placeholder={'Search albums'}
                      type="text"
                      disableUnderline={true}
                      startAdornment={
                        <InputAdornment position="start">
                          <CardMedia
                            component={'img'}
                            image={SearchDarkIcon}
                            sx={{
                              width: 12,
                              height: 12,
                            }}
                          />
                        </InputAdornment>
                      }
                      sx={{ pl: 2 }}
                      value={keyword}
                      onChange={(e) => searchHandler(e)}
                      onKeyDown={(e) => albumKeyHandler(e)}
                    />
                  )}
                </Box>
                <Divider />
              </React.Fragment>
            )}
            {loading ? (
              <Box px={2} py={1}>
                <PageLoader totalCount={8} itemCountPerOnerow={15} />
              </Box>
            ) : (
              <>
                {activeStep === ActiveSteps.SelectingAlbum && (
                  <>
                    {searchedAlbums?.length > 0 ? (
                      <Box
                        display={'flex'}
                        flexDirection={'column'}
                        alignItems={'center'}
                        gap={2}
                        margin={'0px -10px'}
                        px={2}
                        pt={1}
                        pb={1.5}
                      >
                        <Grid
                          container
                          spacing={2.5}
                          columns={60}
                          sx={{
                            width: '100%',
                            maxHeight: 656,
                            overflowY: 'auto',
                            '&::-webkit-scrollbar': {
                              display: 'none',
                            },
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none',
                          }}
                        >
                          {searchedAlbums?.map((album, idx) => {
                            return (
                              <Grid xs={15} key={idx}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    p: 1,
                                    cursor: 'pointer',
                                    borderRadius: 3,
                                    '&:hover': {
                                      bgcolor:
                                        theme.palette.containerSecondary.main,
                                    },
                                  }}
                                  onClick={() => selectAlbumHandler(album)}
                                >
                                  <CardMedia
                                    image={album.images[0].url}
                                    component={'img'}
                                    sx={{
                                      borderRadius: 2,
                                    }}
                                  />
                                  <Box
                                    display={'flex'}
                                    flexDirection={'column'}
                                    gap={1.5}
                                    py={1}
                                  >
                                    <Box
                                      display={'flex'}
                                      flexDirection={'column'}
                                      gap={0.5}
                                    >
                                      <Typography
                                        className="gray-out-text"
                                        variant="h5"
                                        color={theme.palette.text.primary}
                                        fontSize={'16px'}
                                        fontFamily={'var(--font-bold)'}
                                      >
                                        {album.name}
                                      </Typography>
                                      <Box
                                        display={'flex'}
                                        alignItems={'center'}
                                        gap={0.5}
                                      >
                                        <Typography
                                          variant="subtitle1"
                                          color={theme.palette.text.secondary}
                                        >
                                          {album.release_date.slice(0, 4)}
                                        </Typography>
                                        ·
                                        <Typography
                                          variant="subtitle1"
                                          color={theme.palette.text.secondary}
                                        >
                                          {album.album_type}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>
                              </Grid>
                            )
                          })}
                        </Grid>

                        {totalAlbumPageNumber > 1 && (
                          <Pagination
                            page={albumPageNumber}
                            count={totalAlbumPageNumber}
                            color="secondary"
                            onChange={albumPageinationHandler}
                            hideNextButton={
                              albumPageNumber === totalAlbumPageNumber
                            }
                          />
                        )}
                      </Box>
                    ) : (
                      <Box
                        display={'flex'}
                        flexDirection={'column'}
                        alignItems={'center'}
                        gap={2}
                        py={8}
                      >
                        <Typography
                          fontFamily={'var(--font-semi-bold)'}
                          fontSize={18}
                          color={theme.palette.text.primary}
                        >
                          We couldn't find anything...
                        </Typography>

                        <Typography
                          variant="body2"
                          color={theme.palette.text.secondary}
                          sx={{
                            whiteSpace: 'pre-wrap',
                            maxWidth: 340,
                            textAlign: 'center',
                          }}
                        >
                          Get started by selling your first license or browse to
                          find a license to add to your collection.
                        </Typography>

                        <SecondaryButton
                          sx={{
                            backgroundColor: theme.palette.grey[600],
                            borderRadius: 2,
                          }}
                        >
                          Clear search
                        </SecondaryButton>
                      </Box>
                    )}
                  </>
                )}

                {activeStep === ActiveSteps.SelectingSong && (
                  <SelectSong
                    songLoading={songLoading}
                    setSongLoading={setSongLoading}
                    curAlbum={curAlbum}
                    searchedSongs={searchedSongs}
                    setSearchedSongs={setSearchedSongs}
                    setSongPageNumber={setSongPageNumber}
                    songPageNumber={songPageNumber}
                    totalSongPageNumber={totalSongPageNumber}
                    licenseData={licenseData}
                    setLicenseData={setLicenseData}
                    nextStepHandler={nextStepHandler}
                  />
                )}

                {activeStep === ActiveSteps.ConfiguringLicense && (
                  <ConfiguringLicenseListing
                    licenseData={licenseData}
                    setLicenseData={setLicenseData}
                    backHandler={backHandler}
                  />
                )}
              </>
            )}
          </Stack>
        </Box>
      </Box>
    </CustomizedContainer>
  )
}
