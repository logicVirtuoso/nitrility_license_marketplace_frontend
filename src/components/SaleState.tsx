import { Box, CardMedia, Typography, useTheme } from '@mui/material'
import RaiseUpDarkIcon from 'src/assets/images/raise_up_dark.png'

interface SaleStatusProps {
  title: string
  totalAmount: string
  percent: number
  isRaiseup: boolean
}

const SaleState = ({
  title,
  totalAmount,
  percent,
  isRaiseup,
}: SaleStatusProps) => {
  const theme = useTheme()
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      width={'25%'}
      border={`1px solid ${theme.palette.primary.contrastText}`}
      p={1.5}
      borderRadius={3}
    >
      <Typography
        fontSize={16}
        color={theme.palette.text.secondary}
        align="left"
      >
        {title}
      </Typography>

      <Typography
        variant="h2"
        color={theme.palette.text.primary}
        align="left"
        pt={1}
      >
        {totalAmount}
      </Typography>

      <Box display={'flex'} alignItems={'center'} gap={'8px'}>
        <CardMedia
          component={'img'}
          image={RaiseUpDarkIcon}
          sx={{ width: 16, height: 16 }}
        />

        <Typography fontSize={12} color={theme.palette.success.light}>
          {`${percent.toLocaleString()}% ${
            isRaiseup ? 'increase' : 'decrease'
          }`}
        </Typography>
        <Typography fontSize={12} color={theme.palette.text.disabled}>
          in past month
        </Typography>
      </Box>
    </Box>
  )
}

export default SaleState
