import React, { useContext, useEffect, useState } from 'react'
import { Box, CardMedia, Typography, useTheme } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import { GlobalMusicContext } from 'src/context/globalMusic'
import useUtils from 'src/hooks/useUtils'
import BrowserDarkIcon from 'src/assets/images/browser_dark.png'
import { CommonLicenseDataIF } from 'interface'

interface MusicPlayerInterface {
  isOwner: boolean
  license: any
}

export const MusicPlayer = ({ isOwner, license }: MusicPlayerInterface) => {
  const theme = useTheme()
  const [mintedTime, setMintedTime] = useState<string>('')

  const { isPlaying, setIsPlaying, globalMusic, setGlobalMusic } =
    useContext(GlobalMusicContext)

  const { goToProfilePage } = useUtils()

  const playHandler = () => {
    const commonLicenseData: CommonLicenseDataIF = license
    if (globalMusic?.listedId !== commonLicenseData.listedId) {
      setGlobalMusic(commonLicenseData)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  useEffect(() => {
    if (license?.createdAt) {
      const minted = new Date(license.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
      setMintedTime(minted)
    }
  }, [license])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            width: 42,
            height: 42,
            borderRadius: '100%',
            bgcolor: theme.palette.text.primary,
            zIndex: 2,
            '&:hover': {
              transform: 'scale(0.98)',
              opacity: 0.9,
            },
          }}
          onClick={playHandler}
        >
          {isPlaying && license.listedId === globalMusic?.listedId ? (
            <PauseIcon sx={{ fontSize: 28, color: 'black' }} />
          ) : (
            <PlayArrowIcon sx={{ fontSize: 28, color: 'black' }} />
          )}
        </Box>
        <Typography color={theme.palette.grey[100]} variant="h2">
          {license?.licenseName}
        </Typography>
      </Box>

      <Box display={'flex'} alignItems={'center'} gap={1.5}>
        <Box
          sx={{
            display: 'flex',
            cursor: 'pointer',
            height: 28,
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(24px)',
            gap: 1,
            borderRadius: '52px',
            padding: '5px 8px',
          }}
          onClick={() =>
            window.open(`https://open.spotify.com/album/${license.albumId}`)
          }
        >
          <Typography color={theme.palette.text.primary} variant="body2">
            {license?.albumName}
          </Typography>

          <CardMedia
            component={'img'}
            image={BrowserDarkIcon}
            sx={{
              width: 16,
              objectFit: 'cover',
              borderRadius: '100%',
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            cursor: 'pointer',
            height: 28,
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(24px)',
            gap: 1,
            borderRadius: '52px',
            padding: '5px 8px',
          }}
          onClick={() => goToProfilePage(license.sellerId)}
        >
          <CardMedia
            component={'img'}
            image={license.avatarPath}
            sx={{
              width: 18,
              objectFit: 'cover',
              borderRadius: '100%',
            }}
          />

          <Typography color={theme.palette.text.primary} variant="body2">
            {license?.sellerName}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color={theme.palette.text.primary}
        >{`Listed ${mintedTime}`}</Typography>
      </Box>
    </Box>
  )
}
