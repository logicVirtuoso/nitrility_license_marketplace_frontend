import { Box } from '@mui/material'

export default function BackgroundBar() {
  return (
    <Box
      sx={{
        position: 'absolute',
        left: '0px',
        top: '0px',
        width: '100%',
        height: '64px',
        backgroundColor: 'rgb(75 75 75)',
        zIndex: -2,
      }}
    />
  )
}
