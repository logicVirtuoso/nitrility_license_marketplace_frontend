import { Box, Divider, Grid, Typography, useTheme } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import PurchasingBackground from './background'
import React, { useCallback, useEffect } from 'react'
import { getLicenseForListedId, getListedLicenseBySellerId } from 'src/api'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import CustomizedContainer from 'src/components/customizedeContainer'
import {
  CommonLicenseDataIF,
  LicensingTypes,
  ListingStatusType,
  TemplateDataIF,
} from 'src/interface'
import AccountInfo from './accountInfo'
import AdditionalInfo from './additionalInfo'
import LicensingTypeSelector from './licensingTypeSelector'
import PurchasingBlock from './purchasingBlock'
import Splits from './splits'
import AnimatedCarousel from 'src/components/animatedCarousel'
import PageLoader from 'src/components/pageLoader'
import { licensingTypeList } from 'src/config'
import { getCommonLicenseData } from 'src/utils/utils'

export default function Purchasing() {
  const theme = useTheme()
  const { listedId } = useParams()
  const navigate = useNavigate()

  const [licenseData, setLicenseData] = React.useState<any>()

  const [licenseLoading, setLicenseLoading] = React.useState<boolean>(true)
  const [loadingMoreLicenses, setLoadingMoreLicenses] =
    React.useState<boolean>(true)

  const [isOwner, setIsOwner] = React.useState<boolean>(false)
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const [syncData, setSyncData] = React.useState<TemplateDataIF>()
  const [commonLicenseData, setCommonLicenseData] =
    React.useState<CommonLicenseDataIF>()
  const [licensingType, setLicensingType] = React.useState<LicensingTypes>(
    LicensingTypes.None,
  )
  const [licensingList, setLicensingList] =
    React.useState<Array<any>>(licensingTypeList)
  const [listedLicenses, setListedLicenses] = React.useState<Array<any>>([])

  const removeUnlistedLicensingType = (
    templateData: TemplateDataIF,
    filteredLicensing: Array<any>,
    filteredlicensingType: LicensingTypes,
  ) => {
    if (templateData.listed != ListingStatusType.Listed) {
      return filteredLicensing.filter(
        (item) => item.type !== filteredlicensingType,
      )
    } else {
      return filteredLicensing
    }
  }

  useEffect(() => {
    const init = async () => {
      setLicenseLoading(true)
      try {
        const license = await getLicenseForListedId(listedId)
        setLicenseData(license)
        if (license?.sellerId === authorization?.currentUser?.sellerId) {
          setIsOwner(true)
        } else {
          setIsOwner(false)
        }
        const {
          creator,
          movie,
          advertisement,
          videoGame,
          tvSeries,
          aiTraining,
        } = license.signingData
        setCommonLicenseData(getCommonLicenseData(license))

        const templateDataMappings = [
          { data: creator, type: LicensingTypes.Creator },
          { data: movie, type: LicensingTypes.Movie },
          { data: advertisement, type: LicensingTypes.Advertisement },
          { data: videoGame, type: LicensingTypes.VideoGame },
          { data: tvSeries, type: LicensingTypes.TvSeries },
          { data: aiTraining, type: LicensingTypes.AiTraining },
        ]

        let filteredList = licensingTypeList

        templateDataMappings.forEach(({ data, type }) => {
          if (data) {
            filteredList = removeUnlistedLicensingType(data, filteredList, type)
          }
        })

        setLicensingList(filteredList)
      } catch (e) {
        console.log('error in getting license for listedId', e)
        navigate('/')
      }
      setLicenseLoading(false)
    }
    init()
  }, [authorization?.currentUser, listedId, navigate])

  useEffect(() => {
    if (licensingType !== LicensingTypes.None) {
      switch (licensingType) {
        case LicensingTypes.Creator:
          setSyncData(licenseData.signingData.creator)
          break
        case LicensingTypes.Movie:
          setSyncData(licenseData.signingData.movie)
          break
        case LicensingTypes.Advertisement:
          setSyncData(licenseData.signingData.advertisement)
          break
        case LicensingTypes.VideoGame:
          setSyncData(licenseData.signingData.videoGame)
          break
        case LicensingTypes.TvSeries:
          setSyncData(licenseData.signingData.tvSeries)
          break
        case LicensingTypes.AiTraining:
          setSyncData(licenseData.signingData.aiTraining)
          break
        default:
          navigate('/')
          break
      }
    }
  }, [licenseData, licensingType, navigate, authorization])

  const getLicensesOfSeller = useCallback(async () => {
    if (licenseData?.sellerId) {
      const data = await getListedLicenseBySellerId(licenseData.sellerId)
      setListedLicenses(data)
      setLoadingMoreLicenses(false)
    }
  }, [licenseData?.sellerId])

  useEffect(() => {
    getLicensesOfSeller()
  }, [getLicensesOfSeller])

  return (
    <Box pb={2}>
      <PurchasingBackground
        loading={licenseLoading}
        license={licenseData}
        isOwner={isOwner}
      />
      <CustomizedContainer sx={{ py: 8 }}>
        {!licenseLoading && (
          <Grid container spacing={4}>
            <Grid item xs={4} md={4} lg={4}>
              <Box display={'flex'} flexDirection={'column'} gap={2}>
                <AccountInfo
                  license={licenseData}
                  licensingType={licensingType}
                />
                {syncData && commonLicenseData && (
                  <Splits
                    commonLicenseData={commonLicenseData}
                    syncData={syncData}
                  />
                )}
              </Box>
            </Grid>

            <Grid item xs={8} md={8} lg={8}>
              <Box display={'flex'} flexDirection={'column'} gap={2}>
                <AdditionalInfo listedId={licenseData.listedId} />

                <LicensingTypeSelector
                  licensingList={licensingList}
                  licensingType={licensingType}
                  setLicensingType={(data) => {
                    setSyncData(null)
                    setLicensingType(data)
                  }}
                />

                {syncData && (
                  <PurchasingBlock
                    isOwner={isOwner}
                    syncData={syncData}
                    commonLicenseData={commonLicenseData}
                    licensingType={licensingType}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        )}
      </CustomizedContainer>

      <Divider />

      {!licenseLoading && (
        <CustomizedContainer
          sx={{
            pt: 5,
          }}
        >
          <Typography variant="h4" color={theme.palette.text.primary}>
            {`More songs from ${licenseData.sellerName}`}
          </Typography>
          <Box sx={{ mt: '14px' }}>
            {!loadingMoreLicenses ? (
              <AnimatedCarousel
                licenses={listedLicenses}
                autoScroll={listedLicenses.length > 4 ? true : false}
                handler={(license) => {
                  setLicensingType(LicensingTypes.None)
                  setSyncData(null)
                  navigate(`/purchase/${license.listedId}`)
                }}
              />
            ) : (
              <Box sx={{ height: 420 }}>
                <PageLoader totalCount={5} itemCountPerOnerow={12} />
              </Box>
            )}
          </Box>
        </CustomizedContainer>
      )}
    </Box>
  )
}
