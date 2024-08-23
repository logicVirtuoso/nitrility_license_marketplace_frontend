import { Box, CardMedia, Divider, Grid, Typography } from '@mui/material'
import { getBuyerPlatform } from 'src/api'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import loadingSpinnerSvg from 'src/assets/loadingSpinner.svg'
import toast from 'react-hot-toast'
import SecondaryButton from 'src/components/buttons/secondary-button'
import NothingHere from 'src/components/nothing'

export default function ReceiverDetails() {
  const navigate = useNavigate()
  const { accountAddress } = useParams()
  const [buyerPlatformData, setBuyerPlatformData] = useState<Array<any>>()
  const [companyInfo, setCompanyInfo] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const init = useCallback(async () => {
    setLoading(true)
    if (accountAddress) {
      try {
        const { success, data, msg } = await getBuyerPlatform(accountAddress)
        if (success) {
          setBuyerPlatformData(data.buyerData)
          setCompanyInfo(data.companyInfo)
        } else {
          toast.error(msg)
        }
      } catch (e) {
        toast.error(e.message)
        setBuyerPlatformData([])
      }
    }
    setLoading(false)
  }, [accountAddress])

  useEffect(() => {
    init()
  }, [init])

  return (
    <Box display={'flex'} justifyContent={'center'} height={'100%'} mt={15}>
      {loading ? (
        <Box m={'auto'} height={'60vh'}>
          <CardMedia component={'img'} image={loadingSpinnerSvg} />
        </Box>
      ) : (
        <Box className="container">
          <Box display={'flex'} flexDirection={'column'} width={'100%'} gap={2}>
            {companyInfo && (
              <>
                <Box display={'flex'} alignItems={'center'} gap={2}>
                  <Typography
                    variant="h5"
                    color="rgb(82, 82, 82)"
                    fontWeight={500}
                    display={'flex'}
                    alignItems={'center'}
                  >
                    {`Company: `}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      py: 1,
                      px: 2,
                      borderRadius: 1,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#e5e5e5',
                    }}
                  >
                    <Typography>{companyInfo.companyName}</Typography>
                  </Box>
                </Box>
                <Box display={'flex'} alignItems={'center'} gap={2}>
                  <Typography
                    variant="h5"
                    color="rgb(82, 82, 82)"
                    fontWeight={500}
                    display={'flex'}
                    alignItems={'center'}
                  >
                    {`Registration Number: `}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      py: 1,
                      px: 2,
                      borderRadius: 1,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#e5e5e5',
                    }}
                  >
                    <Typography>{companyInfo.registrationNumber}</Typography>
                  </Box>
                </Box>
              </>
            )}

            <Divider />

            {buyerPlatformData.map((platform, idx) => {
              return (
                <Box key={idx}>
                  <Grid container spacing={1} my={2}>
                    <Grid item xs={2} md={1} sm={12}>
                      <Typography
                        variant="h5"
                        color="rgb(82, 82, 82)"
                        width={200}
                        fontWeight={500}
                        display={'flex'}
                        alignItems={'center'}
                      >
                        {`${platform.platformTitle}: `}
                      </Typography>
                    </Grid>
                    <Grid item xs={10} md={11} sm={12}>
                      {platform.accounts.length > 0 ? (
                        <Grid container spacing={1}>
                          {platform.accounts.map((account, index) => {
                            return (
                              <Grid item xs={6} md={3} sm={12} key={index}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    py: 1,
                                    px: 2,
                                    borderRadius: 1,
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    backgroundColor: '#e5e5e5',
                                  }}
                                >
                                  <Typography>{account}</Typography>
                                </Box>
                              </Grid>
                            )
                          })}
                        </Grid>
                      ) : (
                        <NothingHere />
                      )}
                    </Grid>
                  </Grid>
                </Box>
              )
            })}
          </Box>
          <Box display={'flex'} width={'100%'} pt={1}>
            <Box display={'flex'} gap={2} ml={'auto'}>
              <SecondaryButton
                sx={{ width: '120px' }}
                onClick={() => navigate(-1)}
              >
                Back
              </SecondaryButton>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
}
