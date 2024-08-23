import {
  Box,
  CardMedia,
  Divider,
  Grid,
  Typography,
  useTheme,
} from '@mui/material'
import { getMyOffersOfSeller } from 'src/api'
import dayjs from 'dayjs'
import { useCallback, useEffect, useRef, useState } from 'react'
import NothingHere from 'src/components/nothing'
import {
  AccessLevel,
  CommonLicenseDataIF,
  LicensingTypes,
  OfferDataIF,
} from 'src/interface'
import useUtils from 'src/hooks/useUtils'
import { useNavigate } from 'react-router-dom'
import { getCommonLicenseData } from 'src/utils/utils'
import OfferManager from 'src/components/offerManager'

interface Props {
  listedId: number
  licensingType: LicensingTypes
}

export default function MyOffers({ listedId, licensingType }: Props) {
  const theme = useTheme()
  const navigate = useNavigate()
  const { etherToUsd } = useUtils()
  const [offers, setOffers] = useState<Array<OfferDataIF>>([])
  const [curOffer, setCurOffer] = useState<any>()
  useState<boolean>(false)
  const [commonLicenseData, setCommonLicenseData] =
    useState<CommonLicenseDataIF>()
  const offerRef = useRef<{
    toggleState: () => void
  }>(null)

  const fetchOffers = useCallback(() => {
    getMyOffersOfSeller(listedId, licensingType)
      .then(setOffers)
      .catch((e) => console.log('error in fetching offers of license', e))
  }, [listedId, licensingType])

  useEffect(() => {
    fetchOffers()
  }, [fetchOffers])

  useEffect(() => {
    const init = async () => {
      if (curOffer) {
        try {
          const licenseData = curOffer.listedLicense
          setCommonLicenseData(getCommonLicenseData(licenseData))
        } catch (e) {
          console.log('error in getting license for listedId', e)
          navigate('/')
        }
      }
    }
    init()
  }, [curOffer, navigate])

  return (
    <Box
      my={3}
      width={'100%'}
      overflow={'hidden'}
      borderRadius={3}
      display={'flex'}
      flexDirection={'column'}
      border={`1px solid ${theme.palette.grey[600]}`}
    >
      <Typography
        variant="h5"
        py={1.5}
        px={2}
        color={theme.palette.text.secondary}
      >
        My License Offers
      </Typography>

      <Divider />

      {offers && offers.length > 0 ? (
        <>
          <Grid container spacing={1} py={1} px={2}>
            <Grid item xs={3}>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Unit Price (USD)
              </Typography>
            </Grid>

            <Grid item xs={3}>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Exclusivity
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Expiration
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                From
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Typography variant="body2" color={theme.palette.text.secondary}>
                Action
              </Typography>
            </Grid>
          </Grid>
          <Divider />
          {offers.map((offer, idx) => {
            return (
              <Grid container spacing={1} key={idx} p={2}>
                <Grid item xs={3}>
                  <Typography>
                    ${etherToUsd(offer.offerPrice).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography
                    fontSize={14}
                    fontWeight={400}
                    color={theme.palette.grey[200]}
                  >
                    {offer.accessLevel === AccessLevel.Exclusive
                      ? 'Exclusive'
                      : 'Nonexclusive'}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography>
                    {offer.offerDuration > Date.now()
                      ? `in ${dayjs(offer.offerDuration).diff(
                          dayjs(Date.now()),
                          'day',
                        )} days`
                      : 'Expired'}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography
                    sx={{
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      color: theme.palette.success.light,
                      fontWeight: 400,
                      fontSize: 14,
                      lineHeight: '20px',
                    }}
                  >
                    {offer.buyerAddr}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography
                    sx={{
                      color: theme.palette.success.light,
                      fontWeight: 400,
                      fontSize: 14,
                      lineHeight: '20px',
                    }}
                    onClick={() => {
                      setCurOffer(offer)
                      offerRef.current.toggleState()
                    }}
                  >
                    View Offer
                  </Typography>
                </Grid>
              </Grid>
            )
          })}
        </>
      ) : (
        <NothingHere />
      )}

      <OfferManager
        ref={offerRef}
        offerData={curOffer}
        commonLicenseData={commonLicenseData}
      />
    </Box>
  )
}
