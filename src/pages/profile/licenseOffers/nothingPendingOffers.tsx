import { Box, Typography, useTheme } from '@mui/material'
import SecondaryButton from 'src/components/buttons/secondary-button'

export default function NothingPendingOffers() {
  const theme = useTheme()
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      mt={12.5}
    >
      <Typography
        fontWeight={600}
        fontSize={24}
        color={theme.palette.text.primary}
      >
        You don’t have any pending offers
      </Typography>
      <Typography
        fontWeight={400}
        fontSize={14}
        color={theme.palette.text.secondary}
      >
        Make an offer by bidding on a license on the marketplace.
      </Typography>
      <SecondaryButton sx={{ mt: 1 }}>Explore licenses</SecondaryButton>
    </Box>
  )
}
