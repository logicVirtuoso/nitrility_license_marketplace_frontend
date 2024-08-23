import React from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { getRecentUploads } from '../../api'
import AnimatedCarousel from 'src/components/animatedCarousel'
import { useNavigate } from 'react-router-dom'
import PageLoader from 'src/components/pageLoader'
import SecondaryButton from 'src/components/buttons/secondary-button'

export default function RecentUploadSection() {
  const theme = useTheme()
  const navigate = useNavigate()
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
    <Box mt={8}>
      <Box
        mb={3}
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Typography
          variant="h3"
          fontFamily={'var(--font-semi-bold)'}
          color={theme.palette.text.primary}
        >
          Recent Uploads
        </Typography>
        <SecondaryButton
          sx={{
            height: 35,
            border: 'none',
            backgroundColor: theme.palette.secondary.main,
            '&:hover': {
              backgroundColor: theme.palette.containerPrimary.main,
            },
          }}
          onClick={() => navigate('/recent-uploads')}
        >
          <Typography fontSize={'14px'} color={theme.palette.text.secondary}>
            View all
          </Typography>
        </SecondaryButton>
      </Box>

      {!loading ? (
        <AnimatedCarousel
          licenses={recentUploads}
          autoScroll={recentUploads.length > 4 ? true : false}
        />
      ) : (
        <Box sx={{ height: 420 }}>
          <PageLoader totalCount={5} itemCountPerOnerow={12} />
        </Box>
      )}
    </Box>
  )
}
