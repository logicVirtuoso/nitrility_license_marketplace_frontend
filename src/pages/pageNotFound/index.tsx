import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import SecondaryButton from 'src/components/buttons/secondary-button'

export default function PageNotFound() {
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Typography variant="h5">Don't know where you are?</Typography>

        <Typography>we really have no idea either...</Typography>

        <SecondaryButton sx={{ width: '200px' }} onClick={() => navigate('/')}>
          Back To Home Page
        </SecondaryButton>
      </Box>
    </Box>
  )
}
