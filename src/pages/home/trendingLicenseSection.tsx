import { Box, Typography, useTheme } from '@mui/material'
import { getTrendingLicense } from '../../api'
import React, { useEffect } from 'react'
import { trendingTimeOptions } from 'src/config'
import AnimatedCarousel from 'src/components/animatedCarousel'
import { TabButton } from 'src/components/buttons'
import PageLoader from 'src/components/pageLoader'
import SecondaryButton from 'src/components/buttons/secondary-button'
import { useNavigate } from 'react-router-dom'
interface PeriodTimeIF {
  label: string
  value: number
}

export default function TrendingLicenseSection() {
  const navigate = useNavigate()
  const theme = useTheme()
  const [loading, setLoading] = React.useState<boolean>(true)
  const [trendingLicenses, setTrendingLicenses] = React.useState<Array<any>>([])
  const [periodTime, setPeriodTime] = React.useState<PeriodTimeIF>(
    trendingTimeOptions[3],
  )

  const getTrending = React.useCallback(async () => {
    setLoading(true)
    const { success, data, msg } = await getTrendingLicense(periodTime.value)
    if (success) {
      setTrendingLicenses(data)
    }
    setLoading(false)
  }, [periodTime])

  useEffect(() => {
    getTrending()
  }, [getTrending])

  return (
    <Box mt={8}>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        mb={2.5}
        gap={'10px'}
      >
        <Typography
          variant="h3"
          fontFamily={'var(--font-semi-bold)'}
          color={theme.palette.text.primary}
        >
          Trending Licenses
        </Typography>
        <Box display={'flex'} ml={'auto'}>
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            height={37}
            overflow={'hidden'}
            borderRadius={'10px'}
            padding={'2px'}
            bgcolor={theme.palette.secondary.main}
          >
            {trendingTimeOptions.map((item, idx) => {
              return (
                <TabButton
                  key={idx}
                  selected={periodTime === item}
                  onClick={() => {
                    setPeriodTime(item)
                  }}
                  sx={{ width: 30 }}
                >
                  {item.label}
                </TabButton>
              )
            })}
          </Box>
        </Box>
        <SecondaryButton
          sx={{
            height: 35,
            border: 'none',
            backgroundColor: theme.palette.secondary.main,
            '&:hover': {
              backgroundColor: theme.palette.containerPrimary.main,
            },
          }}
          onClick={() => navigate('/trending-linceses')}
        >
          <Typography fontSize={'14px'} color={theme.palette.text.secondary}>
            View all
          </Typography>
        </SecondaryButton>
      </Box>

      {!loading ? (
        <AnimatedCarousel
          licenses={trendingLicenses}
          autoScroll={trendingLicenses.length > 4 ? true : false}
        />
      ) : (
        <Box sx={{ height: 420 }}>
          <PageLoader totalCount={4} itemCountPerOnerow={15} />
        </Box>
      )}
    </Box>
  )
}
