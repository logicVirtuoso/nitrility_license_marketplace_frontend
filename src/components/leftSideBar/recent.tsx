import React from 'react'
import {
  Box,
  CardMedia,
  List,
  ListItemButton,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material'
import { getRecentUploads } from '../../api'
import { randomRange } from 'src/utils/utils'
import { useNavigate } from 'react-router-dom'

interface RecentCardIF {
  license: any
}

const RecentCard = ({ license }: RecentCardIF) => {
  const theme = useTheme()
  const navigate = useNavigate()
  return (
    <Box sx={{ padding: '0px 8px 2px 8px' }}>
      <List component="div" disablePadding>
        <ListItemButton
          sx={{ borderRadius: 1, p: '8px 12px' }}
          onClick={() => navigate(`/purchase/${license.listedId}`)}
        >
          <Box
            bgcolor={theme.palette.primary.main}
            borderRadius={1}
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
          >
            <CardMedia
              component={'img'}
              image={license.imagePath}
              sx={{
                width: 40,
                height: 40,
                borderRadius: '4px',
              }}
            />
          </Box>
          <Box display={'flex'} flexDirection={'column'} ml={1.5} gap={0.5}>
            <Typography
              variant="subtitle1"
              color={theme.palette.text.primary}
              sx={{
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {license.licenseName}
            </Typography>
            <Typography
              variant="subtitle2"
              color={theme.palette.text.secondary}
            >
              {license.sellerName}
            </Typography>
          </Box>
        </ListItemButton>
      </List>
    </Box>
  )
}

export default function Recent() {
  const theme = useTheme()
  const [loading, setLoading] = React.useState<boolean>(true)
  const [recentUploads, setRecentUploads] = React.useState<Array<any>>([])

  const getRecent = React.useCallback(async () => {
    setLoading(true)
    const recentLicenses = await getRecentUploads()
    const data = recentLicenses.map((license) => {
      return { ...license, listedTime: license.createdAt }
    })
    setRecentUploads(data)
    setLoading(false)
  }, [])

  React.useEffect(() => {
    getRecent()
  }, [getRecent])

  return (
    <React.Fragment>
      <Typography
        sx={{
          fontFamily: 'var(--font-semi-bold)',
          color: theme.palette.text.secondary,
          fontSize: '16px',
          lineHeight: '18px',
          p: '20px',
        }}
      >
        Recent Uploads
      </Typography>
      <Box sx={{ padding: '0px 8px 2px 4px' }}>
        {!loading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {recentUploads?.slice(0, 3).map((license, idx) => {
              return <RecentCard key={idx} license={license} />
            })}
          </Box>
        ) : (
          <Box sx={{ padding: '0px 8px' }}>
            {randomRange(3).map((idx) => {
              return (
                <Box
                  sx={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                  }}
                  key={idx}
                >
                  <Skeleton
                    variant="rounded"
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '4px',
                    }}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginLeft: '8px',
                      width: '100%',
                    }}
                  >
                    <Skeleton variant="text" sx={{ width: '60%' }} />
                    <Skeleton variant="text" sx={{ width: '40%' }} />
                  </Box>
                </Box>
              )
            })}
          </Box>
        )}
      </Box>
    </React.Fragment>
  )
}
