import { Box, Divider, Grid, Typography, useTheme } from '@mui/material'
import { getRecentUploads } from 'src/api'
import React from 'react'
import LicenseCard from 'src/components/licenseCard'
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

export default function RecentUploadPage() {
  const classes = useStyles()
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
    <Box
      mt={15}
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box className="container">
        <Typography variant="h3" color={theme.palette.text.primary}>
          Recent Uploads
        </Typography>
        <Divider
          sx={{
            marginTop: '18px',
            marginBottom: '20px',
          }}
        />
        {!loading ? (
          <Grid container spacing={2} mt={4}>
            {recentUploads.map((license, index) => {
              const commonLicenseData: CommonLicenseDataIF = license
              return (
                <Grid item className={classes.item} key={index}>
                  <LicenseCard commonLicenseData={commonLicenseData} />
                </Grid>
              )
            })}
          </Grid>
        ) : (
          <PageLoader />
        )}
      </Box>
    </Box>
  )
}
