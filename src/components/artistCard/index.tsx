import { Box, CardMedia, Typography } from '@mui/material'
import artistBgSvg from '../../assets/artist-effect.svg'
import useUtils from 'src/hooks/useUtils'

interface ArtistIF {
  avatarPath: string
  sellerId: string
  sellerName: string
  platformTitle: string
  email: string
}

interface ArtistCardProps {
  artist: ArtistIF
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  const { goToProfilePage } = useUtils()

  return (
    <Box
      sx={{
        display: 'block',
        width: '100%',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        transform:
          'translate3d(0,0,0) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1)',
        backgroundColor: 'rgb(14, 18, 19)',
        maxHeight: 'fit-content',
        cursor: 'pointer',
      }}
      onClick={() => goToProfilePage(artist.sellerId)}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          backgroundColor: 'rgb(211, 211, 211)',
          aspectRatio: '1/1',
        }}
      >
        <Box
          sx={{
            zIndex: 1,
            position: 'absolute',
            padding: '1rem',
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                borderRadius: '50%',
                backgroundColor: 'unset',
                transform: 'translateZ(0px)',
                position: 'relative',
                overflow: 'hidden',
                outline: 'none',
              }}
            >
              <CardMedia
                component={'img'}
                image={artist.avatarPath}
                sx={{
                  color: 'transparent',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  aspectRatio: '1 / 1',
                  maxWidth: '100%',
                  height: 'auto',
                  borderStyle: 'none',
                  display: 'block',
                  width: 140,
                  transitionDuration: '0.3s',
                  '&:hover': {
                    scale: '1.2',
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            top: 0,
            left: 0,
          }}
        >
          <CardMedia image={artistBgSvg} />
        </Box>
        <Box
          sx={{
            height: 112,
            width: '100%',
            position: 'absolute',
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 0,
            transform:
              'translate3d(0,0,0) rotate(0) skewX(0) skewY(0) scaleX(1) scaleY(1)',
            backgroundImage:
              'linear-gradient(to top, #0e1213, rgba(14,18,19,0))',
          }}
        ></Box>
      </Box>

      <Box
        sx={{
          color: 'rgb(163, 163, 163)',
          fontSize: '12px',
          lineHeight: '16px',
          pt: 1,
          pb: 3,
          px: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="subtitle2">Artist</Typography>
        <Typography
          sx={{
            pt: '2px',
            fontWeight: 500,
            fontSize: '18px',
            lineHeight: '22px',
            fontFamily: 'var(--font-semi-bold)',
          }}
        >
          {artist.sellerName}
        </Typography>
      </Box>
    </Box>
  )
}
