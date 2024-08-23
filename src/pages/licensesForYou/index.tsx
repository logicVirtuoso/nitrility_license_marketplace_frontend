import { Box, Divider, Grid, Typography, useTheme } from '@mui/material'
import { getListedLicenseBySellerId, getRecommendingLicenses } from 'src/api'
import { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import LicenseCard from 'src/components/licenseCard'
import { GlobalMusicContext } from 'src/context/globalMusic'
import PageLoader from 'src/components/pageLoader'
import { makeStyles } from '@mui/styles'
import { CommonLicenseDataIF } from 'interface'

const useStyles = makeStyles({
  item: {
    width: '20%',
    flexBasis: '20%',
    flexGrow: 0,
  },
})

export default function LicensesForYouPage() {
  const theme = useTheme()
  const classes = useStyles()
  const [loading, setLoading] = useState(true)
  const { favoriteLicenses, setFavoriteLicenses } =
    useContext(GlobalMusicContext)
  const authorization = useSelector(
    (state: { authorization: any }) => state.authorization,
  )

  // license for you
  const [licensesOfFollowers, setLicensesOfFollowers] = useState<Array<any>>([])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      if (authorization?.currentUser?.accountAddress) {
        const { success, data } = await getRecommendingLicenses(
          authorization?.currentUser?.accountAddress,
        )
        if (success) {
          setLicensesOfFollowers(data)
        }
      }
      setLoading(false)
    }
    init()
  }, [authorization?.currentUser?.accountAddress])

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
        <Typography variant="h3" color={theme.palette.text.primary}>
          Recommended Licenses
        </Typography>
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
            {[...licensesOfFollowers, ...favoriteLicenses].map(
              (license, index) => {
                const commonLicenseData: CommonLicenseDataIF = license
                return (
                  <Grid item className={classes.item} key={index}>
                    <LicenseCard commonLicenseData={commonLicenseData} />
                  </Grid>
                )
              },
            )}
          </Grid>
        )}
      </Box>
    </Box>
  )
}
