import { Box, CardMedia, Link, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import DarkLogo from 'src/assets/images/footer_dark_logo.png'
import LightLogo from 'src/assets/images/footer_light_logo.png'

export default function Footer() {
  const theme = useTheme()
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      justifyContent={'center'}
      bgcolor={theme.palette.background.paper}
      pt={2}
    >
      <Box className="container">
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            py: 3,
          }}
        >
          <Box display={'flex'} alignItems={'center'} width={'100%'}>
            <Box display={'flex'} alignItems={'center'}>
              <Link href="/" underline="none">
                <CardMedia
                  component={'img'}
                  image={theme.palette.mode === 'dark' ? DarkLogo : LightLogo}
                  sx={{
                    width: 32,
                    height: 32,
                  }}
                />
              </Link>

              <Box display={'flex'} alignItems={'center'} gap={3} ml={6}>
                <Typography
                  variant="subtitle1"
                  color={theme.palette.text.disabled}
                >
                  Twitter
                </Typography>
                <Typography
                  variant="subtitle1"
                  color={theme.palette.text.disabled}
                >
                  Instagram
                </Typography>
                <Typography
                  variant="subtitle1"
                  color={theme.palette.text.disabled}
                >
                  Blog
                </Typography>
              </Box>
            </Box>

            <Box display={'flex'} alignItems={'center'} ml={'auto'} gap={3}>
              <Typography
                variant="subtitle1"
                color={theme.palette.text.disabled}
              >
                Frequently Asked Questions
              </Typography>
              <Typography
                variant="subtitle1"
                color={theme.palette.text.disabled}
              >
                Terms of Service
              </Typography>
              <Typography
                variant="subtitle1"
                color={theme.palette.text.disabled}
              >
                Privacy
              </Typography>
              <Typography
                variant="subtitle1"
                color={theme.palette.text.disabled}
              >
                Docs
              </Typography>
            </Box>
          </Box>

          <Typography variant="subtitle1" color={theme.palette.text.disabled}>
            © 2024 Nitrility Inc. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
