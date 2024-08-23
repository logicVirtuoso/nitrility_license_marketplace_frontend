import { Box, Typography, useTheme } from '@mui/material'

interface Props {
  title: string
  value: number | string
  isViewed: boolean
  viewerTitle?: string
  onClick?: () => void
}

const StatsCard = ({
  title,
  value,
  isViewed = false,
  viewerTitle = '',
  onClick,
}: Props) => {
  const theme = useTheme()

  return (
    <Box
      px={2}
      py={1.5}
      display={'flex'}
      flexDirection={'column'}
      gap={1}
      width={'100%'}
    >
      <Typography
        fontSize={16}
        color={theme.palette.text.secondary}
        align="left"
      >
        {title}
      </Typography>
      <Typography variant="h2" color={theme.palette.text.primary} align="left">
        {value}
      </Typography>

      {isViewed && (
        <Typography
          fontFamily={'var(--font-semi-bold)'}
          fontSize={12}
          color={theme.palette.success.light}
          align="left"
          sx={{ cursor: 'pointer' }}
          onClick={onClick}
        >
          {viewerTitle}
        </Typography>
      )}
    </Box>
  )
}

export default StatsCard
