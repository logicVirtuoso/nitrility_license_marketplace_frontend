import {
  Box,
  CardMedia,
  IconButton,
  Slider,
  Typography,
  useTheme,
} from '@mui/material'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { GlobalMusicContext } from 'src/context/globalMusic'
import { ACCESS_TOKEN, ADD_TO_CART } from 'src/config'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import useAuth from 'src/hooks/useAuth'
import useUtils from 'src/hooks/useUtils'
import jwtDecode from 'jwt-decode'
import {
  getAllLicenses,
  getLicenseForListedId,
  getNextOrPreviousLicense,
  likeOrDislikeLicense,
} from 'src/api'
import { ReactSVG } from 'react-svg'
import IconFavorite from 'src/assets/musicplayer/favorite.svg'
import IconFavoriteActive from 'src/assets/musicplayer/favoriteactive.svg'
import IconPurchase from 'src/assets/musicplayer/purchase.svg'
import IconVolume from 'src/assets/musicplayer/volume.svg'
import IconVolumeActive from 'src/assets/musicplayer/volumeactive.svg'
import IconVolumeLoud from 'src/assets/musicplayer/volumeloud.svg'
import IconVolumeLoudActive from 'src/assets/musicplayer/volumeloudactive.svg'
import IconVolumeMute from 'src/assets/musicplayer/volumemute.svg'
import IconVolumeMuteActive from 'src/assets/musicplayer/volumemuteactive.svg'
import IconPlay from 'src/assets/musicplayer/play.svg'
import IconPause from 'src/assets/musicplayer/pause.svg'
import IconShuffle from 'src/assets/musicplayer/shuffle.svg'
import IconShuffleActive from 'src/assets/musicplayer/shuffleactive.svg'
import IconPrev from 'src/assets/musicplayer/prev.svg'
import IconNext from 'src/assets/musicplayer/next.svg'
import IconRepeat from 'src/assets/musicplayer/repeat.svg'
import IconRepeatActive from 'src/assets/musicplayer/repeatactive.svg'
import IconClose from 'src/assets/close.svg'
import { getCommonLicenseData } from 'src/utils/utils'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'

const MusicDetails = () => {
  const { goToProfilePage } = useUtils()
  const { globalMusic } = useContext(GlobalMusicContext)
  const navigate = useNavigate()
  return (
    <Box display={'flex'} alignItems={'center'} gap={1.5}>
      <CardMedia
        component={'img'}
        image={globalMusic.imagePath}
        sx={{
          borderRadius: 1,
          width: 56,
          height: 56,
          objectFit: 'cover',
        }}
        alt="music-preview"
      />
      <Box display={'flex'} flexDirection={'column'} width={152}>
        <Typography
          sx={{
            fontSize: '16px',
            color: '#FAFAFA',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
          onClick={() => {
            navigate(`/purchase/${globalMusic.listedId}`)
          }}
        >
          {globalMusic.licenseName}
        </Typography>
        <Typography
          sx={{
            fontSize: '12px',
            color: '#C1C1C1',
            background: 'linear-gradient(to right, #C1C1C1 100%, #9A9A9A 0%)',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
          }}
          onClick={() => goToProfilePage(globalMusic?.sellerId)}
        >
          {globalMusic.sellerName}
        </Typography>
      </Box>
    </Box>
  )
}

interface ProgressProps {
  isLooping: boolean
  isShuffle: boolean
}

const Progress = ({ isLooping, isShuffle }: ProgressProps) => {
  const theme = useTheme()
  const { globalMusic, setGlobalMusic } = useContext(GlobalMusicContext)
  const [currLength, setCurrLength] = React.useState<number>(0)
  const [length, setLength] = React.useState<number>(0)
  const [progressWidth, setProgressWidth] = React.useState<number>(0)
  const progressBarWidth = 660

  const [playlist, setPlaylist] = React.useState<Array<any>>([])

  useEffect(() => {
    getAllLicenses().then(setPlaylist)
  }, [])

  const shufflePlayer = useCallback(() => {
    if (playlist.length > 0) {
      const randomIndex = Math.floor(Math.random() * playlist.length)
      setGlobalMusic(getCommonLicenseData(playlist[randomIndex]))
    }
  }, [setGlobalMusic, playlist])

  React.useEffect(() => {
    const interval = setInterval(() => {
      const audio = document.getElementById('myAudio') as HTMLVideoElement
      const duration = Math.ceil(audio.duration)
      const currentTime = Math.ceil(audio.currentTime)
      setLength(duration)
      setCurrLength(currentTime)
      const secPerPx = duration / progressBarWidth
      const newWidth = currentTime / secPerPx
      setProgressWidth(newWidth)

      if (currentTime >= duration) {
        if (isShuffle) {
          audio.pause()
          shufflePlayer()
        } else if (isLooping) {
          audio.play()
        } else {
          audio.pause()
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isShuffle, isLooping, shufflePlayer])

  function updateProgress(e) {
    const audio = document.getElementById('myAudio') as HTMLVideoElement
    const offset = e.target.getBoundingClientRect().left
    const newOffSet = e.clientX
    const newWidth = newOffSet - offset
    setProgressWidth(newWidth)
    const secPerPx = length / progressBarWidth
    audio.currentTime = secPerPx * newWidth
  }

  function formatTime(s) {
    return Number.isNaN(s)
      ? '0:00'
      : (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
  }

  return (
    <Box
      sx={{
        margin: '5px 0',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box>
        <Typography fontSize={12}>{formatTime(currLength)}</Typography>
      </Box>
      <Box
        sx={{
          width: '660px',
          height: '4px',
          backgroundColor: '#666666',
          borderRadius: '54px',
          cursor: 'pointer',
        }}
        onClick={(e) => updateProgress(e)}
      >
        <Box
          sx={{
            width: '0px',
            height: '4px',
            borderRadius: '54px',
            backgroundColor: theme.palette.text.primary,
          }}
          style={{ width: `${progressWidth}px` }}
        ></Box>
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: '12px',
          }}
        >
          {formatTime(length)}
        </Typography>
      </Box>
    </Box>
  )
}

interface ControlProps {
  isLooping: boolean
  setIsLooping: (isLooping: boolean) => void
  isShuffle: boolean
  setIsShuffle: (isShuffle: boolean) => void
}

const Control = ({
  isLooping,
  setIsLooping,
  isShuffle,
  setIsShuffle,
}: ControlProps) => {
  const { isPlaying, setIsPlaying, globalMusic, setGlobalMusic } =
    useContext(GlobalMusicContext)

  const shuffle = () => {
    setIsShuffle(!isShuffle)
    setIsLooping(false)
  }

  const repeatHandler = () => {
    setIsShuffle(false)
    setIsLooping(!isLooping)
  }

  const playNextLicense = async () => {
    setIsPlaying(false)
    const { data, success, msg } = await getNextOrPreviousLicense(
      globalMusic.listedId,
      false,
    )
    if (success) {
      setGlobalMusic(getCommonLicenseData(data))
      setIsPlaying(true)
    } else {
      toast.error(msg)
    }
  }

  const playPreviousLicense = async () => {
    setIsPlaying(false)
    const { data, success, msg } = await getNextOrPreviousLicense(
      globalMusic.listedId,
      true,
    )
    if (success) {
      setGlobalMusic(getCommonLicenseData(data))
      setIsPlaying(true)
    } else {
      toast.error(msg)
    }
  }

  return (
    <Box display={'flex'} alignItems={'center'} padding={'22px 20px'} gap={1.5}>
      {isShuffle ? (
        <CardMedia
          component={'img'}
          image={IconShuffleActive}
          sx={{
            cursor: 'pointer',
            width: 24,
            height: 24,
          }}
          onClick={shuffle}
        />
      ) : (
        <CardMedia
          component={'img'}
          image={IconShuffle}
          sx={{
            cursor: 'pointer',
            width: 24,
            height: 24,
          }}
          onClick={shuffle}
        />
      )}
      <CardMedia
        component={'img'}
        image={IconPrev}
        sx={{
          cursor: 'pointer',
          width: 24,
          height: 24,
        }}
        onClick={playPreviousLicense}
      />
      {isPlaying ? (
        <ReactSVG
          src={IconPause}
          className="svg-icon"
          style={{
            cursor: 'pointer',
            width: 24,
          }}
          onClick={() => setIsPlaying(false)}
        />
      ) : (
        <ReactSVG
          src={IconPlay}
          className="svg-icon"
          style={{
            cursor: 'pointer',
            width: 24,
          }}
          onClick={() => setIsPlaying(true)}
        />
      )}
      <CardMedia
        component={'img'}
        image={IconNext}
        sx={{
          cursor: 'pointer',
          width: 24,
          height: 24,
        }}
        onClick={playNextLicense}
      />
      {isLooping ? (
        <CardMedia
          component={'img'}
          image={IconRepeatActive}
          sx={{
            cursor: 'pointer',
            width: 24,
            height: 24,
          }}
          onClick={repeatHandler}
        />
      ) : (
        <CardMedia
          component={'img'}
          image={IconRepeat}
          sx={{
            cursor: 'pointer',
            width: 24,
            height: 24,
          }}
          onClick={repeatHandler}
        />
      )}

      <ReactSVG
        src={IconClose}
        style={{
          cursor: 'pointer',
        }}
        onClick={() => {
          setIsPlaying(false)
          setGlobalMusic(null)
        }}
      />
    </Box>
  )
}

export default function GlobalMusicPlayerbar() {
  const navigate = useNavigate()
  const theme = useTheme()
  const { checkAuthAndSignIn } = useAuth()
  const {
    isPlaying,
    setIsPlaying,
    globalMusic,
    setGlobalMusic,
    favoriteLicenses,
    setFavoriteLicenses,
  } = useContext(GlobalMusicContext)
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  const [isFavorite, setFavorite] = useState<boolean>(false)
  const [volume, setVolume] = React.useState<number>(100)
  const [isMuted, setIsMuted] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)

  const { addToCartHandler } = useUtils()

  React.useEffect(() => {
    if (
      favoriteLicenses?.find((obj) => obj?.listedId == globalMusic?.listedId)
    ) {
      setFavorite(true)
    } else {
      setFavorite(false)
    }
  }, [favoriteLicenses, globalMusic])
  const [showVolumeControl, setShowVolumeControl] = React.useState(false)

  React.useEffect(() => {
    try {
      if (globalMusic?.previewUrl) {
        const audio = document.getElementById('myAudio') as HTMLVideoElement
        if (audio) {
          if (isPlaying) {
            audio.play()
          } else {
            audio.pause()
          }
        }
      }
    } catch (e) {
      console.log('error in playing license', e)
    }
  }, [isPlaying, globalMusic])

  const favorite = async () => {
    const { loggedIn, redirected } = await checkAuthAndSignIn()
    if (loggedIn) {
      setFavorite(!isFavorite)
      const ls = window.localStorage.getItem(ACCESS_TOKEN)
      if (ls !== 'undefined' && ls) {
        const decodedToken: any = jwtDecode(ls)
        const payload = decodedToken.payload
        const { success, msg, data } = await likeOrDislikeLicense(
          payload.accountAddress,
          globalMusic?.listedId,
        )
        if (success) setFavoriteLicenses(data)
      } else toast.error('Something went wrong')
    } else {
      if (redirected) navigate('/')
    }
  }

  useEffect(() => {
    try {
      const audio = document.getElementById('myAudio') as HTMLVideoElement
      audio.loop = isLooping
    } catch {}
  }, [isLooping])

  return (
    <React.Fragment>
      {globalMusic && (
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'space-between',
            height: '100px',
            width: '100%',
            maxWidth: '100%',
            borderTop: `1px solid ${theme.palette.secondary.light}`,
            zIndex: 100,
            bgcolor: theme.palette.secondary.main,
            alignItems: 'center',
          }}
        >
          <audio id="myAudio" src={globalMusic?.previewUrl} />
          <Box
            sx={{
              width: '402px',
              padding: '22px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <MusicDetails />
            <Box
              sx={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onClick={favorite}
            >
              {isFavorite ? (
                <CardMedia
                  component={'img'}
                  image={IconFavoriteActive}
                  sx={{
                    width: 20,
                    height: 18,
                  }}
                />
              ) : (
                <CardMedia
                  component={'img'}
                  image={IconFavorite}
                  sx={{
                    width: 20,
                    height: 18,
                    color: 'red',
                  }}
                />
              )}
            </Box>

            <Box
              sx={{
                width: 40,
                height: 40,
                display:
                  authorization?.currentUser?.sellerId == globalMusic?.sellerId
                    ? 'none'
                    : 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              onClick={() => addToCartHandler(globalMusic)}
            >
              <CardMedia
                component={'img'}
                image={IconPurchase}
                sx={{
                  width: 20,
                  height: 18,
                }}
              />
            </Box>

            <Box
              sx={{
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              {showVolumeControl && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '72px',
                    left: '-10px',
                    width: '40px',
                    height: '88px',
                    background: '#1F1F1F',
                    borderRadius: '4px',
                    padding: '12px 18px',
                  }}
                >
                  <Slider
                    min={0}
                    max={100}
                    size="medium"
                    aria-label="Volume"
                    orientation="vertical"
                    defaultValue={100}
                    value={volume}
                    sx={{
                      height: '100%',
                      padding: '0px',
                      color: '#000',
                      '& .MuiSlider-rail': {
                        backgroundColor: theme.palette.secondary.light,
                        opacity: 1,
                      },
                      '& .MuiSlider-thumb': {
                        width: '8px',
                        height: '8px',
                        background: '#FFF',
                      },
                      '& .MuiSlider-thumb:hover': {
                        boxShadow: 'none',
                      },
                      '& .MuiSlider-thumb.Mui-focusVisible': {
                        boxShadow: 'none',
                      },
                      '& .MuiSlider-track': {
                        background: theme.palette.success.light,
                      },
                    }}
                    onChange={(
                      event: Event,
                      value: number,
                      activeThumb: number,
                    ) => {
                      setVolume(value)
                      if (value === 0) {
                        setIsMuted(true)
                      } else {
                        setIsMuted(false)
                      }
                    }}
                  />
                </Box>
              )}
              {isMuted ? (
                showVolumeControl ? (
                  <CardMedia
                    component={'img'}
                    image={IconVolumeMuteActive}
                    sx={{
                      width: 20,
                      height: 20,
                    }}
                    onClick={() => setShowVolumeControl(!showVolumeControl)}
                  />
                ) : (
                  <CardMedia
                    component={'img'}
                    image={IconVolumeMute}
                    sx={{
                      width: 20,
                      height: 20,
                    }}
                    onClick={() => setShowVolumeControl(!showVolumeControl)}
                  />
                )
              ) : volume >= 50 ? (
                showVolumeControl ? (
                  <CardMedia
                    component={'img'}
                    image={IconVolumeLoudActive}
                    sx={{
                      cursor: 'pointer',
                      width: 20,
                      height: 20,
                    }}
                    onClick={() => setShowVolumeControl(!showVolumeControl)}
                  />
                ) : (
                  <CardMedia
                    component={'img'}
                    image={IconVolumeLoud}
                    sx={{
                      width: 20,
                      height: 20,
                      stroke: 'red',
                    }}
                    onClick={() => setShowVolumeControl(!showVolumeControl)}
                  />
                )
              ) : showVolumeControl ? (
                <CardMedia
                  component={'img'}
                  image={IconVolumeActive}
                  sx={{
                    width: 20,
                    height: 20,
                    stroke: 'red',
                  }}
                  onClick={() => setShowVolumeControl(!showVolumeControl)}
                />
              ) : (
                <CardMedia
                  component={'img'}
                  image={IconVolume}
                  sx={{
                    width: 20,
                    height: 20,
                    stroke: 'red',
                  }}
                  onClick={() => setShowVolumeControl(!showVolumeControl)}
                />
              )}
            </Box>
          </Box>
          <Progress isLooping={isLooping} isShuffle={isShuffle} />
          <Control
            isLooping={isLooping}
            isShuffle={isShuffle}
            setIsLooping={setIsLooping}
            setIsShuffle={setIsShuffle}
          />
        </Box>
      )}
    </React.Fragment>
  )
}
