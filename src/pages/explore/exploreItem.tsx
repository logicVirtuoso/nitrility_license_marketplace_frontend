import { Box, CardMedia, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { generateRGBValue } from 'src/utils/utils'
import WhiteLogo from '../../assets/images/white_logo.svg'

export enum ExploreItemType {
  Genre,
  Mood,
  Activity,
}

export const exploreItemTypes = ['Genre', 'Mood', 'Activity']

interface GenreProps {
  idx: number
  name: string
  imageUrl: string
  isTop: boolean
  itemType: ExploreItemType
}

export default function ExploreItem({
  idx,
  name,
  imageUrl,
  isTop,
  itemType,
}: GenreProps) {
  const theme = useTheme()
  const navigate = useNavigate()

  const genresHandler = () => {
    navigate(
      `/explore/details?type=${encodeURIComponent(
        exploreItemTypes[itemType],
      )}&name=${encodeURIComponent(name)}&number=${idx}`,
    )
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundColor: isTop ? generateRGBValue(idx) : 'none',
        borderRadius: 2,
      }}
      onClick={() => genresHandler()}
    >
      <CardMedia
        component={'img'}
        image={imageUrl}
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: 2,
          left: 0,
          top: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100px',
          zIndex: 1,
          background:
            'linear-gradient(180deg, rgba(17, 17, 17, 0.41) 0%, rgba(0, 0, 0, 0) 100%)',
        }}
      />
      <Typography
        sx={{
          position: 'absolute',
          left: 15,
          top: 15,
          color: theme.palette.text.primary,
          fontFamily: 'var(--font-semi-bold)',
          fontSize: '24px',
          zIndex: 1,
        }}
      >
        {name}
      </Typography>
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 15,
          zIndex: 1,
        }}
      >
        <CardMedia component={'img'} image={WhiteLogo} width={34} height={40} />
      </Box>
    </Box>
  )
}
