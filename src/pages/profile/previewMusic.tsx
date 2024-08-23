import React, { useRef, useState, useEffect } from 'react'
import { Box, Typography, IconButton } from '@mui/material'
import Slider from '@mui/material/Slider'
import { Theme, useTheme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import PlayCircleFilledOutlinedIcon from '@mui/icons-material/PlayCircleFilledOutlined'
import { makeStyles } from '@mui/styles'
import CloseIcon from '@mui/icons-material/Close'
import StyledIconButton from '../../components/styledIconButton'
import PauseIcon from '@mui/icons-material/Pause'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import FastForwardIcon from '@mui/icons-material/FastForward'
import FastRewindIcon from '@mui/icons-material/FastRewind'
import IOSSlider from 'src/components/IOSSlider'

const MAX_TIME = 30
const STEP_VALUE = 2

const StyledImg = styled('img')(({ theme }) => ({
  borderRadius: '100%',
  width: '96px',
  objectFit: 'cover',
}))

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    borderTopLeftRadius: '6px',
    borderTopRightRadius: '6px',
  },
  checkBox: {
    position: 'absolute !important' as any,
    right: '-20px',
    top: '-20px',
  },
}))

interface PreviewMusicProps {
  licenseName: string
  sellerName: string
  imageSrc: string
  previewUrl?: string
  showCloseButton: boolean
  disabled?: boolean
  handleChange: () => void
}

export default function PreviewMusic({
  licenseName,
  sellerName,
  imageSrc,
  previewUrl,
  showCloseButton,
  disabled = false,
  handleChange,
}: PreviewMusicProps) {
  const classes = useStyles()
  const theme = useTheme()
  const audioRef = useRef(new Audio(previewUrl))
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [pos, setPos] = useState<number>(0)

  const playHandler = () => {
    if (audioRef) {
      if (audioRef.current.duration <= audioRef.current.currentTime) {
        audioRef.current.currentTime = 0
      }
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    } else {
      setIsPlaying(false)
      console.log('could not catch audio ref', audioRef)
    }
  }

  const onScrub = (e) => {
    const currentValue = e.target.value
    const audioEle = document.getElementById('myAudio')
    if (audioEle) {
      audioRef.current.currentTime = currentValue
      audioRef.current.play()
      setIsPlaying(true)
    } else {
      setIsPlaying(false)
      console.log('slider error')
    }
  }

  const backwardHandler = () => {
    if (audioRef.current.currentTime > STEP_VALUE) {
      audioRef.current.currentTime -= STEP_VALUE
    } else {
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      audioRef.current.pause()
    }
  }

  const forwardHandler = () => {
    if (audioRef.current.currentTime < MAX_TIME - STEP_VALUE) {
      audioRef.current.currentTime += STEP_VALUE
    } else {
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      audioRef.current.pause()
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (audioRef.current.currentTime >= audioRef.current.duration) {
        setPos(0)
        audioRef.current.currentTime = 0
        setIsPlaying(false)
      } else {
        setPos(audioRef.current.currentTime)
      }
    }, 1000)

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId)
  }, [])

  return (
    <Box
      sx={{
        margin: '4px 10px',
        p: '40px 20px 20px 20px',
        borderRadius: 1,
        position: 'relative',
        boxShadow:
          'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiSlider-root': {
          pb: 1,
          px: 0,
          pt: 0,
        },
      }}
    >
      <audio id="myAudio" src={previewUrl} />
      <Box className={classes.root}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <StyledImg src={imageSrc} />
          <Typography
            sx={{
              marginLeft: '10px',
              whiteSpace: 'nowrap',
              maxWidth: '160px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            variant="h3"
          >
            {licenseName}
          </Typography>
          <Typography
            sx={{
              marginLeft: '10px',
              whiteSpace: 'nowrap',
              maxWidth: '160px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            variant="h6"
          >
            {sellerName}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography variant="h6">{`00:${Math.floor(pos)
              .toString()
              .padStart(2, '0')}`}</Typography>
            <IOSSlider
              size="medium"
              min={0}
              max={30}
              value={pos}
              aria-label="medium"
              onChange={(e) => onScrub(e)}
              disabled={disabled}
            />
            <Typography variant="h6">00:30</Typography>
          </Box>

          <Box
            sx={{
              width: '100%',
              borderRadius: '4px',
              height: '40px',
              padding: '20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                maxWidth: '200px',
              }}
            >
              <IconButton disabled={!isPlaying}>
                <FastRewindIcon onClick={() => backwardHandler()} />
              </IconButton>
              <IconButton onClick={() => playHandler()}>
                {!isPlaying ? <PlayCircleIcon /> : <PauseIcon />}
              </IconButton>
              <IconButton disabled={!isPlaying}>
                <FastForwardIcon onClick={() => forwardHandler()} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {showCloseButton && (
          <StyledIconButton
            variant="contained"
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              padding: 0,
              backgroundColor: theme.palette.secondary.main,
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark,
              },
            }}
            onClick={() => handleChange()}
          >
            <CloseIcon />
          </StyledIconButton>
        )}
      </Box>
    </Box>
  )
}
