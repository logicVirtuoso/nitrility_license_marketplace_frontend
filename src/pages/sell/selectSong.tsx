import React from 'react'
import {
  Box,
  CardMedia,
  Divider,
  Pagination,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material'
import {
  checkduplication,
  getAvatarPathByDisplayname,
  getGenresOfArtists,
  getSongsOfAlbum,
} from 'src/api'
import toast from 'react-hot-toast'
import ExplicitDarkDefault from 'src/assets/images/explicit_dark_default.png'
import ExplicitDarkSelected from 'src/assets/images/explicit_dark_selected.png'
import { formatMilliseconds, randomRange } from 'src/utils/utils'
import {
  LicenseDataIF,
  TemplateDataIF,
  ListingStatusType,
  ReviewStatus,
  SigningDataIF,
} from 'src/interface'
import { initialTemplateData } from '.'

interface TableLoaderProps {
  count: number
}

const TableLoader = ({ count }: TableLoaderProps) => {
  return (
    <Box>
      {randomRange(count).map((item) => {
        return (
          <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
            gap={4}
            key={item}
          >
            <Box
              display={'flex'}
              alignItems={'center'}
              width={'100%'}
              gap={1.5}
            >
              <Skeleton sx={{ width: 50 }} variant="text" />
              <Skeleton sx={{ width: '100%' }} variant="text" />
            </Box>
            <Skeleton sx={{ width: 50 }} variant="text" />
          </Box>
        )
      })}
    </Box>
  )
}

interface Props {
  curAlbum: any
  searchedSongs: Array<any>
  songPageNumber: number
  totalSongPageNumber: number
  licenseData: LicenseDataIF
  songLoading: boolean
  setSongLoading: (loading: boolean) => void
  setSearchedSongs: (searchedSongs: Array<any>) => void
  setSongPageNumber: (songPageNumber: number) => void
  setLicenseData: (licenseData: LicenseDataIF) => void
  nextStepHandler: () => void
}

const SelectSong = ({
  curAlbum,
  searchedSongs,
  totalSongPageNumber,
  songPageNumber,
  licenseData,
  songLoading,
  setSongLoading,
  setSearchedSongs,
  setSongPageNumber,
  setLicenseData,
  nextStepHandler,
}: Props) => {
  const theme = useTheme()

  const checkIfAllListed = (signingData: SigningDataIF) => {
    try {
      return (
        signingData.creator.listed &&
        signingData.movie.listed &&
        signingData.advertisement.listed &&
        signingData.tvSeries.listed &&
        signingData.aiTraining.listed &&
        signingData.videoGame.listed
      )
    } catch {
      return false
    }
  }

  const checkIfListed = (signingData: SigningDataIF) => {
    try {
      return (
        signingData.creator.listed == ListingStatusType.Listed ||
        signingData.movie.listed == ListingStatusType.Listed ||
        signingData.advertisement.listed == ListingStatusType.Listed ||
        signingData.tvSeries.listed == ListingStatusType.Listed ||
        signingData.aiTraining.listed == ListingStatusType.Listed ||
        signingData.videoGame.listed == ListingStatusType.Listed
      )
    } catch {
      return false
    }
  }

  const songPageinationHandler = async (
    event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    event.preventDefault()
    setSongLoading(true)
    const toastLoading = toast.loading('Loading Songs Of This Album')
    try {
      setSongPageNumber(page)
      const { success, data, msg } = await getSongsOfAlbum(curAlbum.id, page)
      if (success) {
        setSearchedSongs(data)
        toast.success('Loaded successfully', { id: toastLoading })
      } else {
        toast.error(msg, { id: toastLoading })
      }
      setSongLoading(false)
    } catch (e) {
      console.log('error in fetching songs', e)
      toast.error(e.message, {
        id: toastLoading,
      })
    }
    setSongLoading(false)
  }

  const selectSongHandler = async (song: {
    id: string
    artists: any[]
    name: any
    preview_url: any
  }) => {
    setSongLoading(true)
    const toastLoading = toast.loading('Getting genres...')
    try {
      const { success, data, msg } = await checkduplication(song.id)
      if (success) {
        const { listedLicense } = data
        if (listedLicense && checkIfAllListed(listedLicense.signingData)) {
          toast.error('This license is already listed', {
            id: toastLoading,
          })
        } else {
          let artistQuery = ''
          const artistRev = await Promise.all(
            song.artists.map(
              async (artist: { id: string; name: any }, idx: number) => {
                artistQuery = artistQuery + artist.id
                if (idx !== song.artists.length - 1) {
                  artistQuery += ','
                }
                const avatarPath = await getAvatarPathByDisplayname(
                  artist.name,
                  artist.id,
                )
                return {
                  sellerName: artist.name,
                  sellerId: artist.id,
                  percentage:
                    song.artists.length === 1 ? 100 : 100 / song.artists.length,
                  isAdmin: idx === 0 ? true : false,
                  status:
                    artist.id === licenseData.sellerId
                      ? ReviewStatus.Approved
                      : ReviewStatus.Pending,
                  avatarPath,
                }
              },
            ),
          )

          const tempData: TemplateDataIF = {
            ...initialTemplateData,
            revenues: artistRev,
          }

          if (listedLicense && checkIfListed(listedLicense.signingData)) {
            setLicenseData(listedLicense as LicenseDataIF)
            nextStepHandler()
            toast.success('Loaded successfully', {
              id: toastLoading,
            })
          } else {
            const genresRes = await getGenresOfArtists(artistQuery)
            if (genresRes.status === 200 && genresRes.data.success) {
              nextStepHandler()

              const updatedLicenseData: LicenseDataIF = {
                ...licenseData,
                licenseName: song.name,
                imagePath: curAlbum?.images[0].url,
                previewUrl: song.preview_url,
                trackId: song.id,
                albumId: curAlbum.id,
                genres: genresRes.data.data,
                artists: song.artists,
                signingData: {
                  creator: tempData,
                  movie: tempData,
                  videoGame: tempData,
                  tvSeries: tempData,
                  advertisement: tempData,
                  aiTraining: tempData,
                },
              }

              setLicenseData(updatedLicenseData)
              toast.success('Got the genres successfully', {
                id: toastLoading,
              })
            } else {
              toast.error('Something went wrong', {
                id: toastLoading,
              })
            }
          }
        }
      } else {
        toast.error(msg, { id: toastLoading })
      }
    } catch (e) {
      console.log('error in checking duplicated license', e)
      toast.error(e.message, { id: toastLoading })
    }
    setSongLoading(false)
  }

  return (
    <>
      {songLoading ? (
        <Box p={2}>
          <TableLoader count={10} />
        </Box>
      ) : (
        <Box
          display={'flex'}
          flexDirection={'column'}
          pb={2}
          sx={{
            width: '100%',
            maxHeight: 650,
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          <Box display={'flex'} alignItems={'center'} py={3} px={2} gap={2}>
            <CardMedia
              component={'img'}
              image={curAlbum.images[0].url}
              sx={{
                width: 80,
                height: 80,
                borderRadius: 2,
              }}
            />

            <Box display={'flex'} flexDirection={'column'} gap={0.5}>
              <Typography color={theme.palette.text.disabled} fontSize={'16px'}>
                You’re selecting a song from the following album
              </Typography>
              <Typography
                fontSize={'16px'}
                fontFamily={'var(--font-bold)'}
                color={theme.palette.containerSecondary.contrastText}
              >
                {curAlbum.name}
              </Typography>

              <Typography
                component="span"
                fontSize={12}
                color={theme.palette.text.secondary}
                dangerouslySetInnerHTML={{
                  __html: `${curAlbum.release_date.slice(
                    0,
                    4,
                  )}&nbsp;&nbsp;&middot;&nbsp;&nbsp;Album&nbsp;&nbsp;&middot;&nbsp;&nbsp;${
                    curAlbum.total_tracks
                  } songs`,
                }}
              />
            </Box>
          </Box>

          <Divider />

          <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
            pl={2}
            pr={5}
            py={1.5}
          >
            <Box display={'flex'} alignItems={'center'} gap={1.5} p={1}>
              <Typography align={'center'} sx={{ width: 50 }}>
                #
              </Typography>
              <Typography>Title</Typography>
            </Box>
            <Typography>Length</Typography>
          </Box>

          <Divider />

          <Box display={'flex'} flexDirection={'column'} gap={1} px={2} pt={2}>
            {searchedSongs.map((item, idx) => {
              return (
                <Box
                  key={idx}
                  display={'flex'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  sx={{
                    borderRadius: 2.5,
                    py: 1,
                    pl: 1,
                    pr: 3,
                    cursor: 'pointer',
                    '& .defaultImg': {
                      display: 'block',
                    },
                    '& .selectedImg': {
                      display: 'none',
                    },
                    '&:hover': {
                      bgcolor: theme.palette.containerSecondary.main,
                      '& .defaultImg': {
                        display: 'none',
                      },
                      '& .selectedImg': {
                        display: 'block',
                      },
                    },
                  }}
                  onClick={() => selectSongHandler(item)}
                >
                  <Box display={'flex'} alignItems={'center'} gap={1.5}>
                    <Typography align="center" sx={{ width: 50 }}>
                      {idx + 1}
                    </Typography>
                    <Box display={'flex'} flexDirection={'column'} gap={0.25}>
                      <Typography
                        component={'span'}
                        sx={{
                          fontFamily: 'var(--font-medium)',
                          fontSize: '16px',
                          color: theme.palette.text.primary,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Box display={'flex'} alignItems={'center'} gap={'6px'}>
                        <CardMedia
                          className={'defaultImg'}
                          image={ExplicitDarkDefault}
                          component={'img'}
                          sx={{ width: 21, height: 21 }}
                        />

                        <CardMedia
                          className={'selectedImg'}
                          image={ExplicitDarkSelected}
                          component={'img'}
                          sx={{ width: 21, height: 21 }}
                        />
                        {item.artists.map(
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
                                  item.artists?.length == index + 1 ? '' : ', '
                                }`}
                              </Typography>
                            )
                          },
                        )}
                      </Box>
                    </Box>
                  </Box>

                  <Typography fontSize={16} color={theme.palette.text.primary}>
                    {formatMilliseconds(item.duration_ms)}
                  </Typography>
                </Box>
              )
            })}
          </Box>

          {totalSongPageNumber > 1 && (
            <Pagination
              page={songPageNumber}
              count={totalSongPageNumber}
              color="secondary"
              onChange={songPageinationHandler}
              hideNextButton={songPageNumber === totalSongPageNumber}
            />
          )}
        </Box>
      )}
    </>
  )
}

export default SelectSong
