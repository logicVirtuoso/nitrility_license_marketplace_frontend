import { useCallback, useState, useContext, useEffect } from 'react'
import { Box, Divider, Grid, Typography, useTheme } from '@mui/material'
import LicenseCard from 'src/components/licenseCard'
import { GlobalMusicContext } from 'src/context/globalMusic'
import PageLoader from 'src/components/pageLoader'
import { makeStyles } from '@mui/styles'
import { getTrendingLicense } from 'src/api'
import { topTimeOptions } from 'src/config'
import { TabButton } from 'src/components/buttons'
import { CommonLicenseDataIF } from 'interface'

const useStyles = makeStyles({
  item: {
    width: '20%',
    flexBasis: '20%',
    flexGrow: 0,
  },
})

interface PeriodTimeIF {
  label: string
  value: number
}

const TrendingLicenses = () => {
  const [periodTime, setPeriodTime] = useState<PeriodTimeIF>(topTimeOptions[3])
  const theme = useTheme()
  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const [licenses, setLicenses] = useState<Array<any>>([])

  const fetchTopSellingLicenses = useCallback(async () => {
    setLoading(true)
    const { success, msg, data } = await getTrendingLicense(periodTime.value)
    if (success) {
      setLicenses(data)
    }
    setLoading(false)
  }, [periodTime])

  useEffect(() => {
    fetchTopSellingLicenses()
  }, [fetchTopSellingLicenses])

  return (
    <Box
      mt={15}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box className="container">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant="h3" color={theme.palette.text.primary}>
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
        </Box>
        <Divider
          sx={{
            width: '100%',
            marginTop: '20px',
          }}
        />
        {loading ? (
          <PageLoader />
        ) : (
          <Grid container spacing={2} mt={4}>
            {licenses.map((license, index) => {
              const commonLicenseData: CommonLicenseDataIF = license
              return (
                <Grid item className={classes.item} key={index}>
                  <LicenseCard commonLicenseData={commonLicenseData} />
                </Grid>
              )
            })}
          </Grid>
        )}
      </Box>
    </Box>
  )
}

export default TrendingLicenses
