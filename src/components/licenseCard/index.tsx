import { Box, CardMedia, Grid, Typography, useTheme } from '@mui/material'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { GlobalMusicContext } from 'src/context/globalMusic'
import VerifiedLightIcon from '../../assets/images/verified_light.svg'
import VerifiedDarkIcon from '../../assets/images/verified_dark.svg'
import { addViewer } from 'src/api'

import PlayDarkIcon from '../../assets/images/play_dark.svg'
import PauseDarkIcon from '../../assets/images/pause_dark.svg'
import { formatMilliseconds } from 'src/utils/utils'
import { CommonLicenseDataIF } from 'interface'

interface LicenseCardInterface {
  isPending?: boolean
  commonLicenseData: CommonLicenseDataIF
  showControler?: boolean
  handler?: () => void
}

export default function LicenseCard({
  isPending = false,
  commonLicenseData,
  showControler = true,
  handler = null,
}: LicenseCardInterface) {
  const theme = useTheme()
  const navigate = useNavigate()
  const { isPlaying, setIsPlaying, globalMusic, setGlobalMusic } =
    useContext(GlobalMusicContext)

  const playHandler = (e) => {
    e.stopPropagation()
    if (globalMusic?.listedId !== commonLicenseData.listedId) {
      setGlobalMusic(commonLicenseData)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const licenseHandler = () => {
    if (handler) {
      handler()
    } else {
      navigate(`/purchase/${commonLicenseData.listedId}`)
      addViewer(commonLicenseData.listedId)
    }
  }

  return (
    <Box
      sx={{
        bgcolor: theme.palette.secondary.main,
        borderRadius: '12px',
        width: '100%',
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        border: `1px solid ${
          theme.palette.mode === 'dark' ? '#2c2c2c' : '#E3E3E3'
        }`,
        boxShadow: 'rgba(0, 0, 0, 0.08) 0px 4px 16px',
        position: 'relative',
        '& .fadeBtn': {
          opacity: 0,
          transform: 'none',
          transitionDuration: '.5s',
        },
        '&:hover .fadeBtn': {
          opacity: 1,
          transform: 'scale(0.95) translateZ(0px)',
        },
      }}
      onClick={() => licenseHandler()}
    >
      <Box
        sx={{
          transitionTimingFunction: 'cubic-bezier(.4,0,.2,1)',
          transitionDuration: '.5s',
          transitionProperty: 'transform',
          objectFit: 'contain',
          overflow: 'hidden',
          height: '100%',
          position: 'relative',
        }}
      >
        <CardMedia
          component={'img'}
          image={commonLicenseData.imagePath}
          sx={{
            borderRadius: 2,
            filter: isPending ? 'grayscale(1)' : 'inherit',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            overflow: 'hidden',
            cursor: 'pointer',
            inset: 0,
            transform:
              'translate3d(0,0,0) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1)',
          }}
        >
          {showControler && (
            <Box
              className="fadeBtn"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                borderRadius: '100%',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'scale(0.95)',
                },
              }}
              onClick={playHandler}
            >
              {isPlaying &&
              commonLicenseData.listedId === globalMusic?.listedId ? (
                <CardMedia component={'img'} image={PauseDarkIcon} />
              ) : (
                <CardMedia component={'img'} image={PlayDarkIcon} />
              )}
            </Box>
          )}
        </Box>
      </Box>

      <Box
        display={'flex'}
        flexDirection={'column'}
        position={'relative'}
        gap={0.5}
      >
        <Typography
          className="gray-out-text"
          variant="h5"
          color={theme.palette.containerSecondary.contrastText}
          align="left"
        >
          {commonLicenseData.licenseName}
        </Typography>
        <Box display={'flex'} alignItems={'center'} gap={0.5}>
          <Typography
            variant="subtitle1"
            color={theme.palette.text.secondary}
            align="left"
          >
            {`By ${commonLicenseData.sellerName}`}
          </Typography>
          {theme.palette.mode === 'dark' ? (
            <CardMedia
              component={'img'}
              image={VerifiedDarkIcon}
              sx={{ width: 12, objectFit: 'cover' }}
            />
          ) : (
            <CardMedia
              component={'img'}
              image={VerifiedLightIcon}
              sx={{ width: 12, objectFit: 'cover' }}
            />
          )}
        </Box>
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            height: 40,
            width: 100,
            background:
              'linear-gradient(90deg, rgba(31,31,31,0) 0%, rgba(31,31,31,1) 100%)',
          }}
        ></Box>
      </Box>

      <Box
        display={'flex'}
        borderRadius={2}
        width={'100%'}
        bgcolor={theme.palette.grey[600]}
        p={1}
      >
        {/* {commonLicenseData.genres?.length > 0 ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'flex-start'}
                gap={0.5}
              >
                <Typography variant="caption">Genre</Typography>
                <Typography variant="subtitle2">Pop</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'flex-start'}
                gap={0.5}
              >
                <Typography variant="caption">Duration</Typography>
                <Typography variant="subtitle2">
                  {formatMilliseconds(commonLicenseData.length)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <Box display={'flex'} alignItems={'center'} width={'100%'}>
            <Typography
              variant="caption"
              component={'p'}
              width={'50%'}
              align="left"
            >
              Duration
            </Typography>
            <Typography variant="subtitle2" width={'50%'} align="left">
              {formatMilliseconds(commonLicenseData.length)}
            </Typography>
          </Box>
        )} */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              display={'flex'}
              flexDirection={'column'}
              alignItems={'flex-start'}
              gap={0.5}
            >
              <Typography variant="caption">Genre</Typography>
              <Typography variant="subtitle2">Hip pop</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              display={'flex'}
              flexDirection={'column'}
              alignItems={'flex-start'}
              gap={0.5}
            >
              <Typography variant="caption">Duration</Typography>
              <Typography variant="subtitle2">
                {formatMilliseconds(commonLicenseData.length)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
