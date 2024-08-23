import { Typography, useTheme } from '@mui/material'

export default function NothingHere() {
  const theme = useTheme()
  return (
    <Typography
      align="center"
      variant="h4"
      py={2}
      color={theme.palette.text.primary}
    >
      Nothing here yet…
    </Typography>
  )
}
