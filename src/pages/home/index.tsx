import { Box, CardMedia, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import Cinematic from 'src/components/cinematic'
import { getAllLicenses } from 'src/api'
import TopSellingSection from './topSellingSection'
import TrendingLicenseSection from './trendingLicenseSection'
import TopArtistSection from './topArtistSection'
import RecentUploadSection from './recentUploadSection'
import LicenseForYouSection from './licensesForYouSection'
import GradiantDark from 'src/assets/images/background_dark.png'

export default function Home() {
  const theme = useTheme()
  const [allLicenses, setAllLicenses] = useState<Array<any>>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const listedLicenses = await getAllLicenses()

      setAllLicenses(listedLicenses)
      setLoading(false)
    }
    init()
  }, [])

  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      flexDirection={'column'}
      bgcolor={theme.palette.background.paper}
      position={'relative'}
    >
      <CardMedia
        image={GradiantDark}
        component={'img'}
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: 250,
        }}
      />
      <Cinematic licenses={allLicenses.slice(0, 8)} loaded={!loading} />
      <Box className="container">
        <TopArtistSection />
        <TopSellingSection />
        <TrendingLicenseSection />
        <RecentUploadSection />
        <LicenseForYouSection />
      </Box>
    </Box>
  )
}
