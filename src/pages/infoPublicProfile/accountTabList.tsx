import { Box, CardMedia, Divider, Typography, useTheme } from '@mui/material'
import IconSuccess from 'src/assets/success.svg'

interface Props {
  title: string
  desc: string
  children: React.ReactNode
}

const AccountTabList = ({ title, desc, children }: Props) => {
  const theme = useTheme()
  return (
    <Box display={'flex'} flexDirection={'column'} marginTop={'24px'}>
      <Typography
        sx={{ fontSize: '16px', fontWeight: '600', lineHeight: '24px' }}
      >
        {title}
      </Typography>
      <Box display={'flex'} alignItems={'center'}>
        <Box sx={{ width: '50%' }}>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: '400',
              lineHeight: '24px',
              color: theme.palette.text.secondary,
            }}
          >
            {desc}
          </Typography>
        </Box>
        <Box
          sx={{
            width: '50%',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '16px 0px',
          }}
        >
          {children}
        </Box>
      </Box>
      <Divider />
    </Box>
  )
}

export default AccountTabList
