import { Box, CardMedia } from '@mui/material'

interface BlurredBackgroundProps {
  imagePath: string
}

export default function BlurredBackground({
  imagePath,
}: BlurredBackgroundProps) {
  return (
    <>
      <CardMedia
        component={'img'}
        image={imagePath}
        sx={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          inset: '0px',
          color: 'transparent',
          visibility: 'visible',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          top: '0px',
          left: '0px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          transform: 'translate3d(0px, 0px, 0px)',
        }}
      />
    </>
  )
}
