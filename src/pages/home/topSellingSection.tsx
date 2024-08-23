import React, { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Typography, useTheme } from '@mui/material'
import { getTopSellingLicense } from '../../api'
import { topTimeOptions } from 'src/config'
import AnimatedCarousel from 'src/components/animatedCarousel'
import { TabButton } from 'src/components/buttons'
import PageLoader from 'src/components/pageLoader'
import SecondaryButton from 'src/components/buttons/secondary-button'

interface PeriodTimeIF {
  label: string
  value: number
}

export default function TopSellingSection() {
  const navigate = useNavigate()
  const theme = useTheme()
  const [loading, setLoading] = React.useState<boolean>(true)
  const [topSellingLicenses, setTopSellingLicenses] = React.useState<
    Array<any>
  >([])
  const [periodTime, setPeriodTime] = React.useState<PeriodTimeIF>(
    topTimeOptions[3],
  )

  const getTopSelling = useCallback(async () => {
    setLoading(true)
    const { success, data } = await getTopSellingLicense(periodTime.value)
    if (success) setTopSellingLicenses(data)
    setLoading(false)
  }, [periodTime])

  useEffect(() => {
    getTopSelling()
  }, [getTopSelling])

  return (
    <Box mt={8}>
      <Box display="flex" alignItems="center" mb={3} gap={'10px'}>
        <Typography
          variant="h3"
          fontFamily={'var(--font-semi-bold)'}
          color={theme.palette.text.primary}
        >
          Top Selling Licenses
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
            {topTimeOptions.map((item, idx) => {
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
          onClick={() => navigate('/selling-linceses')}
        >
          <Typography fontSize={'14px'} color={theme.palette.text.secondary}>
            View all
          </Typography>
        </SecondaryButton>
      </Box>

      {!loading ? (
        <AnimatedCarousel
          licenses={topSellingLicenses}
          autoScroll={topSellingLicenses.length > 5 ? true : false}
        />
      ) : (
        <Box sx={{ height: 420 }}>
          <PageLoader totalCount={5} itemCountPerOnerow={12} />
        </Box>
      )}
    </Box>
  )
}
