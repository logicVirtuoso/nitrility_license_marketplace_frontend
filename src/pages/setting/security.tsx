import {
  Box,
  CardMedia,
  Divider,
  Grid,
  Typography,
  useTheme,
} from '@mui/material'
import YoutubeDarkIcon from 'src/assets/images/settings/youtube_dark.png'
import { timeAgo } from 'src/utils/utils'
import { useEffect, useState } from 'react'
import { getSigninHistory, logoutHistory } from 'src/api'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import useAuth from 'src/hooks/useAuth'

export default function SecuritySetting() {
  const theme = useTheme()
  const { signOut } = useAuth()
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const [signinHistory, setSigninHistory] = useState<Array<any>>([])

  useEffect(() => {
    if (authorization?.currentUser?.accountAddress) {
      getSigninHistory(authorization.currentUser.accountAddress).then(
        ({ data, msg, success }) => {
          if (success) {
            setSigninHistory(data)
          } else {
            setSigninHistory([])
          }
        },
      )
    }
  }, [authorization])

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      bgcolor={theme.palette.secondary.main}
      borderRadius={3}
      p={2}
    >
      <Box display={'flex'} flexDirection={'column'}>
        <Typography
          color={theme.palette.text.primary}
          fontFamily={'var(--font-semi-bold)'}
          fontSize={'18px'}
        >
          Security
        </Typography>
        <Typography
          color={theme.palette.text.secondary}
          fontFamily={'var(--font-base)'}
          fontSize={'14px'}
          mt={1}
        >
          View what artist and social accounts are linked
        </Typography>
      </Box>

      <Divider />

      <Box display={'flex'} flexDirection={'column'} gap={2} py={2}>
        <Box display={'flex'} flexDirection={'column'}>
          <Typography
            color={theme.palette.text.primary}
            fontFamily={'var(--font-semi-bold)'}
            fontSize={'18px'}
          >
            Third party accounts
          </Typography>

          <Typography
            color={theme.palette.text.secondary}
            fontFamily={'var(--font-base)'}
            fontSize={'14px'}
            mt={1}
          >
            Below are all the emails linked to your Spotify account. Make sure
            you recognise all recent sign-in actvity for your account.
          </Typography>

          <Box display={'flex'} alignItems={'center'} gap={'2px'} my={2}>
            <Box
              py={1.5}
              px={1}
              bgcolor={theme.palette.grey[600]}
              borderRadius={'8px 0px 0px 8px'}
            >
              <CardMedia
                component={'img'}
                image={YoutubeDarkIcon}
                sx={{
                  width: 24,
                  objectFit: 'cover',
                }}
              />
            </Box>

            <Box
              p={1}
              bgcolor={theme.palette.grey[600]}
              borderRadius={'0px 8px 8px 0px'}
              maxWidth={368}
              width={'100%'}
              height={42}
            >
              <Typography fontSize={16} color={theme.palette.text.secondary}>
                YouTube channel connected:{' '}
              </Typography>
            </Box>
          </Box>

          <Typography fontSize={14} color={theme.palette.text.secondary}>
            If anything looks suspicious consider signing out of that session
            and changing your password.
          </Typography>
        </Box>

        <Box display={'flex'} flexDirection={'column'} gap={2} py={2}>
          <Box display={'flex'} flexDirection={'column'}>
            <Typography
              color={theme.palette.text.primary}
              fontFamily={'var(--font-semi-bold)'}
              fontSize={'18px'}
            >
              Review your sign-in history
            </Typography>
            <Typography
              color={theme.palette.text.secondary}
              fontFamily={'var(--font-base)'}
              fontSize={'14px'}
              mt={1}
            >
              Make sure you recognise all recent sign-in actvity for your
              account. You can sign out anywhere you’re still signed in.
            </Typography>
          </Box>

          <Box
            border={`1px solid ${theme.palette.grey[600]}`}
            borderRadius={2.5}
          >
            <Grid container spacing={1} px={2} pt={1}>
              <Grid item xs={2} py={1}>
                <Typography fontSize={14} color={theme.palette.text.secondary}>
                  Time
                </Typography>
              </Grid>

              <Grid item xs={4} py={1}>
                <Typography fontSize={14} color={theme.palette.text.secondary}>
                  Browser/Device
                </Typography>
              </Grid>

              <Grid item xs={2} py={1}>
                <Typography fontSize={14} color={theme.palette.text.secondary}>
                  IP address
                </Typography>
              </Grid>

              <Grid item xs={2} py={1}>
                <Typography fontSize={14} color={theme.palette.text.secondary}>
                  Location
                </Typography>
              </Grid>

              <Grid item xs={2} py={1}>
                <Typography fontSize={14} color={theme.palette.text.secondary}>
                  Status
                </Typography>
              </Grid>
            </Grid>

            {signinHistory.map((item, idx) => (
              <Box key={idx}>
                <Divider />

                <Grid container spacing={1} px={2} pt={1}>
                  <Grid item xs={2} py={1}>
                    <Typography fontSize={14} color={theme.palette.grey[200]}>
                      {timeAgo(item.createdAt)}
                    </Typography>
                  </Grid>

                  <Grid item xs={4} py={1}>
                    <Typography fontSize={14} color={theme.palette.grey[200]}>
                      {item.deviceInfo}
                    </Typography>
                  </Grid>

                  <Grid item xs={2} py={1}>
                    <Typography fontSize={14} color={theme.palette.grey[200]}>
                      {item.ipAddress}
                    </Typography>
                  </Grid>

                  <Grid item xs={2} py={1}>
                    <Typography fontSize={14} color={theme.palette.grey[200]}>
                      {item.location}
                    </Typography>
                  </Grid>

                  <Grid item xs={2} py={1}>
                    <Typography
                      fontSize={14}
                      color={theme.palette.success.light}
                      sx={{
                        cursor: item.status ? 'pointer' : 'inherit',
                      }}
                      onClick={() => {
                        if (item.status) {
                          logoutHistory(item._id)
                        }
                      }}
                    >
                      {item.status ? 'Sign out' : ''}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
