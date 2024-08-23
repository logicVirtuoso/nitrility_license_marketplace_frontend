import { Box, CardMedia } from '@mui/material'
import BlurredBackground from 'src/components/blurredBackground'
import { MusicPlayer } from 'src/components/musicPlayer'
import VolumeDarkIcon from 'src/assets/images/purchasing/volume_dark.png'

interface Props {
  license: any
  loading: boolean
  isOwner: boolean
}

export default function PurchasingBackground({
  license,
  loading,
  isOwner,
}: Props) {
  return (
    <>
      <Box
        sx={{
          position: 'relative',
          height: '393px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <BlurredBackground imagePath={license?.imagePath} />
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          width="calc(100% - 200px)"
          pt={3}
        >
          <Box flex={'1 1 0%'} maxWidth={'100%'} minWidth={'0px'} zIndex={1}>
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              width={'100%'}
              position={'relative'}
            >
              {!loading && (
                <>
                  <MusicPlayer isOwner={isOwner} license={license} />
                  <CardMedia
                    component={'img'}
                    image={license?.imagePath}
                    sx={{
                      maxWidth: '200px',
                      border: 'solid 5px #575a5a',
                      inset: '0px',
                      color: 'transparent',
                      visibility: 'visible',
                      borderRadius: '10px',
                    }}
                  />
                  <CardMedia
                    component={'img'}
                    image={VolumeDarkIcon}
                    sx={{
                      height: 50,
                      maxWidth: 800,
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                    }}
                  />
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
