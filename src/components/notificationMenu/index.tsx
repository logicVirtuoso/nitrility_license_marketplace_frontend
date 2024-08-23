import { useContext } from 'react'
import {
  Box,
  Stack,
  useTheme,
  CardMedia,
  Typography,
  Divider,
} from '@mui/material'
import { NotificationContext } from '../../context/notification'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import WhiteLogo from 'src/assets/images/white_logo.svg'
import { timeAgo } from 'src/utils/utils'
import { EventTypes, TabTypes } from 'src/interface'
import defaultSrc from 'src/assets/images/profile/profile_banner_dark.png'
import { GlobalDataContext } from 'src/context/globalDataContext'

const NotificationMenu = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const [notifications, dispatch] = useContext(NotificationContext)
  const [globalData, setGlobalData] = useContext(GlobalDataContext)

  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  return (
    <Box position={'absolute'} borderRadius={2} right={0} top={55}>
      <Box
        bgcolor={theme.palette.grey[700]}
        borderRadius={1.5}
        sx={{
          '&::before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 10,
            height: 10,
            bgcolor: theme.palette.grey[700],
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        }}
      >
        {notifications.length > 0 ? (
          <>
            <Typography
              fontSize={16}
              fontWeight={600}
              color={theme.palette.text.primary}
              px={2}
              py={1.5}
            >
              Notifications
            </Typography>
            <Divider />
            <Stack
              sx={{
                maxHeight: '320px',
                width: 350,
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                borderTopRightRadius: 6,
                borderTopLeftRadius: 6,
                borderBottomLeftRadius: notifications.length === 0 ? 6 : '0px',
                borderBottomRightRadius: notifications.length === 0 ? 6 : '0px',
              }}
            >
              {notifications
                .sort(
                  (a, b) =>
                    Date.parse(new Date(b.createdAt).toISOString()) -
                    Date.parse(new Date(a.createdAt).toISOString()),
                )
                .map((notification, idx) => {
                  return (
                    <Box
                      key={idx}
                      display={'flex'}
                      flexDirection={'row'}
                      alignItems={'center'}
                      px={3}
                      py={1.5}
                      gap={1}
                      sx={{
                        '& .notification-dot': {
                          display: 'none',
                        },
                        '&:hover .notification-dot': {
                          display: 'block',
                        },
                        '&:hover': {
                          backgroundColor: theme.palette.grey[600],
                        },
                        cursor: 'pointer',
                        borderBottom: '1px solid #303030',
                      }}
                    >
                      {notification.eventType !== EventTypes.Listed ? (
                        <CardMedia
                          component={'img'}
                          image={defaultSrc}
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                          }}
                        />
                      ) : (
                        <>
                          <Box
                            sx={{
                              position: 'relative',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 32,
                              height: 32,
                              minWidth: 32,
                              bgcolor: theme.palette.grey[800],
                              borderRadius: '100%',
                            }}
                          >
                            <Box
                              className={'notification-dot'}
                              width={5}
                              height={5}
                              borderRadius={'100%'}
                              bgcolor={'#FF82FC'}
                              position={'absolute'}
                              left={'-13.5px'}
                            />

                            <CardMedia
                              component={'img'}
                              image={WhiteLogo}
                              sx={{
                                width: 16,
                                height: 19,
                                mt: '-4px',
                                ml: '-1px',
                              }}
                            />
                          </Box>
                        </>
                      )}

                      <Box display={'flex'} flexDirection={'column'}>
                        <Typography
                          fontSize={12}
                          fontWeight={400}
                          color={theme.palette.grey[200]}
                          lineHeight={'15px'}
                          component={'p'}
                          dangerouslySetInnerHTML={{
                            __html: notification.description,
                          }}
                        />

                        <Typography
                          fontSize={12}
                          fontWeight={600}
                          color={theme.palette.grey[200]}
                        >
                          {timeAgo(notification.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  )
                })}
            </Stack>

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomRightRadius: '6px',
                borderBottomLeftRadius: '6px',
                py: 1.5,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: theme.palette.grey[600],
                },
              }}
              onClick={() => {
                setGlobalData((prev) => ({
                  ...prev,
                  profileTabValue: TabTypes.Activity,
                }))
                navigate(`/profile/${authorization.currentUser.accountAddress}`)
              }}
            >
              <Typography
                fontWeight={600}
                fontSize={12}
                color={theme.palette.grey[200]}
              >
                View all activity
              </Typography>
            </Box>
          </>
        ) : (
          <Typography
            fontSize={16}
            fontWeight={600}
            color={theme.palette.text.primary}
            px={2}
            py={1.5}
            whiteSpace={'nowrap'}
          >
            You don't have notification
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default NotificationMenu
