import { Box, CardMedia, Typography, useTheme } from '@mui/material'
import { useKeenSlider } from 'keen-slider/react'
import BannerBackgroundImage from '../../assets/images/home/banner-background.png'
import LogoLight from '../../assets/images/logo_light.png'
import VoiceVolumeLeft from '../../assets/images/home/voice_volume_left.svg'
import VoiceVolumeRight from '../../assets/images/home/voice_volume_right.svg'
import 'keen-slider/keen-slider.min.css'
import './style.css'
import { useNavigate } from 'react-router-dom'

interface CinematicProps {
  licenses: Array<any>
  loaded: boolean
}

export default function Banner({ licenses, loaded }: CinematicProps) {
  const theme = useTheme()
  const navigate = useNavigate()

  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: {
      origin: 'center',
      perView: 1.5,
      spacing: 14,
    },
    vertical: true,
  })

  return (
    <Box className="container" pt={10} pb={4}>
      {loaded && (
        <>
          <Box
            sx={{
              overflow: 'hidden',
              height: 18,
              color: `${theme.palette.secondary.lighter}`,
              fontSize: '14px',
              mt: 1,
              mb: 4,
            }}
          >
            <Box
              className="infinite-animatedTextRotation"
              sx={{
                position: 'relative',
                height: '100%',
              }}
            >
              <Typography
                className="infinite-animatedTextScale transform-origin-center-left animation-direction-alternate-reverse"
                sx={{
                  position: 'absolute',
                  width: '100%',
                  left: 0,
                  top: '-18px',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
                component={'span'}
              >
                <Typography component={'span'} color="white">
                  Discover new music and prove you were there first
                </Typography>
              </Typography>
              <Typography
                className="infinite-animatedTextScale transform-origin-center-left animation-direction-alternate"
                component={'span'}
                sx={{
                  position: 'absolute',
                  width: '100%',
                  left: 0,
                  top: 0,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <Typography component={'span'} color="white">
                  We're coming in early 2024 welcome to the alpha
                </Typography>
              </Typography>
            </Box>
          </Box>

          <Box position={'relative'} overflow={'hidden'}>
            <CardMedia
              component={'img'}
              image={LogoLight}
              sx={{
                position: 'absolute',
                top: 24,
                left: 28,
                width: '31px !important',
                height: 36,
              }}
            />
            <Box sx={{ position: 'absolute', left: 0, top: 150 }}>
              <Box display={'flex'} flexDirection="column" gap={1}>
                <Typography
                  variant="h1"
                  color={theme.palette.grey[800]}
                  ml={'28px'}
                >
                  Millions of Popular
                </Typography>
                <Box display={'flex'} alignItems={'center'} gap={2}>
                  <CardMedia component={'img'} image={VoiceVolumeLeft} />
                  <Typography
                    variant="h1"
                    color={theme.palette.grey[800]}
                    sx={{
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Song Licenses
                  </Typography>
                  <CardMedia component={'img'} image={VoiceVolumeRight} />
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                right: '16px',
                top: '0px',
              }}
            >
              <Box
                ref={sliderRef}
                className="keen-slider"
                style={{
                  height: '452px',
                  width: '300px',
                }}
              >
                {licenses.slice(0, 4).map((license, idx) => {
                  return (
                    <Box
                      key={idx}
                      className={`keen-slider__slide cinematic-number-slide${idx}`}
                      onClick={() => navigate(`/purchase/${license.listedId}`)}
                    >
                      <CardMedia
                        component={'img'}
                        image={license.imagePath}
                        sx={{
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  )
                })}
              </Box>
            </Box>
            <Box
              sx={{
                position: 'absolute',
                right: '332px',
                bottom: '0px',
              }}
            >
              <Box
                ref={sliderRef}
                className="keen-slider"
                style={{ height: '452px', width: '300px' }}
              >
                {licenses.slice(0, 4).map((license, idx) => {
                  return (
                    <Box
                      key={idx}
                      className={`keen-slider__slide cinematic-number-slide${idx}`}
                      onClick={() => navigate(`/purchase/${license.listedId}`)}
                    >
                      <CardMedia
                        component={'img'}
                        image={license.imagePath}
                        sx={{
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  )
                })}
              </Box>
            </Box>
            <CardMedia component={'img'} image={BannerBackgroundImage} />
          </Box>
        </>
      )}
    </Box>
  )
}
