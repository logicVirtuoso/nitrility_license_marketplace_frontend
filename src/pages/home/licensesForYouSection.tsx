import { Box, Divider, Typography, useTheme } from '@mui/material'
import { getRecommendingLicenses } from 'src/api'
import { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getListedLicenseBySellerId } from 'src/api'
import { GlobalMusicContext } from 'src/context/globalMusic'
import AnimatedCarousel from 'src/components/animatedCarousel'
import { useNavigate } from 'react-router-dom'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import PageLoader from 'src/components/pageLoader'
import SecondaryButton from 'src/components/buttons/secondary-button'

export default function LicenseForYouSection() {
  const theme = useTheme()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const { favoriteLicenses, setFavoriteLicenses } =
    useContext(GlobalMusicContext)
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
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
    <>
      {authorization?.loggedIn && (
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
              Recommended Licenses
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
              onClick={() => navigate('/license-for-you')}
            >
              <Typography
                fontSize={'14px'}
                color={theme.palette.text.secondary}
              >
                View all
              </Typography>
            </SecondaryButton>
          </Box>

          {!loading ? (
            <AnimatedCarousel
              licenses={[...licensesOfFollowers, ...favoriteLicenses]}
              autoScroll={
                [...licensesOfFollowers, ...favoriteLicenses].length > 4
                  ? true
                  : false
              }
            />
          ) : (
            <Box sx={{ height: 420 }}>
              <PageLoader totalCount={4} itemCountPerOnerow={15} />
            </Box>
          )}
        </Box>
      )}
    </>
  )
}
