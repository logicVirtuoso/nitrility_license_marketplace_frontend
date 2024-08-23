import { useNavigate } from 'react-router-dom'
import { Box, CardMedia, useTheme } from '@mui/material'
import WhiteLogo from '../../assets/images/white_logo.svg'
import LightLogo from '../../assets/images/logo_light.png'

export default function Logo() {
  const theme = useTheme()
  const navigate = useNavigate()

  return (
    <Box display={'flex'} flexDirection={'column'} justifyContent={'center'}>
      <CardMedia
        onClick={() => navigate('/')}
        component={'img'}
        image={theme.palette.mode === 'dark' ? WhiteLogo : LightLogo}
        sx={{
          width: 31,
          height: 36,
          ml: 2.5,
          mt: 4,
          mb: 1,
          cursor: 'pointer',
        }}
      />
    </Box>
  )
}
