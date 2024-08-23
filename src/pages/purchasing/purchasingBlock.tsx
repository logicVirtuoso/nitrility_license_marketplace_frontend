import { Box } from '@mui/material'
import {
  EventTypes,
  LicensingTypes,
  AccessLevel,
  TemplateDataIF,
  UsageDetailIF,
  listingTypes,
  ListingFormat,
  CommonLicenseDataIF,
  ProjectTypeLabels,
} from 'src/interface'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from 'src/hooks/useAuth'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { useSelector } from 'react-redux'
import LicenseDetails from './licenseDetails'
import BidDialog from './bidDialog'
import { getBuyerPlatform, getPurchasedNonExclusive } from 'src/api'
import toast from 'react-hot-toast'
import ConfirmDialog from 'src/components/nonExclusive/confirmDialog'
import { listingFormatTypes } from 'src/config'
import UsageDialog from 'src/components/usageDialog'
import PaymentMethodDialog from 'src/components/paymentMethod'
import MyOffers from './myOffers'
import useAuction from 'src/hooks/useAuction'
import useUtils from 'src/hooks/useUtils'

interface Props {
  isOwner: boolean
  commonLicenseData: CommonLicenseDataIF
  licensingType: LicensingTypes
  syncData: TemplateDataIF
}

export default function PurchasingBlock({
  isOwner,
  commonLicenseData,
  licensingType,
  syncData,
}: Props) {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const { addToCartHandler } = useUtils()

  const [openBidDialog, setOpenBidDialog] = useState<boolean>(false)
  const [usageData, setUsageData] = useState<any>()
  const [nonExclusiveLicenses, setNonExclusiveLicenses] = useState<Array<any>>(
    [],
  )
  const [openCardDlg, setOpenCardDlg] = useState<boolean>(false)
  const [openPaymentDlg, setOpenPaymentDlg] = useState<boolean>(false)
  const [openConfirmDlg, setOpenConfirmDlg] = useState<boolean>(false)
  const [openUsageDlg, setOpenUsageDlg] = useState<boolean>(false)
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(AccessLevel.None)
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const [offerDetail, setOfferDetail] = useState<{
    offerPrice: number
    offerDuration: number
  }>()
  const { placeOffer, purchaseLicenses } = useAuction()

  const [initialFormValues, setInitialFormValues] = useState<UsageDetailIF>({
    projectType: ProjectTypeLabels.Personal,
    contentTitle: '',
    intendedPlatforms: '',
    releaseDate: Date.now(),
    productionDescription: '',
    aiModelDescription: '',
    contentDescription: '',
    previewFiles: [],
    licenseUsage: '',
    submit: null,
  })

  const goToLicenseSettingPage = () => {
    navigate(`/license/setting/${commonLicenseData.listedId}`)
  }

  const historyHandler = async () => {
    const loggedIn = authorization.loggedIn
    if (!loggedIn) {
      await signIn()
    }
    if (isOwner) {
      navigate(`/license/history/${commonLicenseData.listedId}`)
    } else {
      window.location.reload()
    }
  }

  const placeBid = async (curLevel: AccessLevel) => {
    const loggedIn = authorization.loggedIn
    if (!loggedIn) {
      await signIn()
    } else {
      try {
        if (licensingType <= LicensingTypes.Creator) {
          const { success, msg, data } = await getBuyerPlatform(
            authorization?.currentUser?.accountAddress,
          )
          if (success) {
            let bExisted = false
            data.buyerData.forEach((element) => {
              if (element.accounts.length > 0) {
                bExisted = true
              }
            })
            if (!bExisted) {
              navigate('/settings')
              toast.error('You need to have creator accounts linked')
            } else {
              setOpenBidDialog(true)
            }
          } else {
            toast.error(msg)
          }
        } else {
          setAccessLevel(curLevel)
          setOpenUsageDlg(true)
        }
      } catch (e) {
        console.log('Place Bid Connect Wallet Error', e)
        toast.error('Please connect your wallet first!')
      }
    }
  }

  const buyHandler = async (curLevel: AccessLevel) => {
    try {
      if (syncData.totalSupply === 0 && syncData.infiniteSupply === false) {
        toast.error('This license is expired')
      } else {
        let loggedIn = authorization.loggedIn

        if (!loggedIn) {
          const signingRes = await signIn()
          loggedIn = signingRes.loggedIn
        }

        if (!loggedIn) {
          return
        }

        setAccessLevel(curLevel)
        if (curLevel === AccessLevel.None) {
          const { success, msg, data } = await getBuyerPlatform(
            authorization?.currentUser?.accountAddress,
          )

          if (success) {
            let bExisted = false
            data.buyerData.forEach((element) => {
              if (element.accounts.length > 0) {
                bExisted = true
              }
            })
            if (!bExisted) {
              navigate('/settings')
              toast.error('You need to have creator accounts linked')
            } else {
              if (!isOwner) {
                if (
                  licensingType > LicensingTypes.Creator ||
                  (licensingType == LicensingTypes.Creator &&
                    syncData.listingFormatValue !== listingFormatTypes.price)
                ) {
                  setOpenUsageDlg(true)
                } else {
                  setOpenCardDlg(true)
                }
              } else {
                window.location.reload()
              }
            }
          } else {
            toast.error(msg)
          }
        } else {
          const { success, data, msg } = await getPurchasedNonExclusive(
            commonLicenseData.listedId,
          )
          if (success) {
            if (data.length > 0) {
              setNonExclusiveLicenses(data)
              setOpenConfirmDlg(true)
              return
            }
          } else {
            toast.error(msg)
            return
          }
          setOpenUsageDlg(true)
        }
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  const confirmHandler = async (bContinue: boolean) => {
    if (bContinue) {
      setOpenUsageDlg(true)
    }
  }

  const usageCallback = async (data: UsageDetailIF) => {
    setUsageData(data)
    if (
      licensingType === LicensingTypes.Creator &&
      listingTypes[syncData.listingFormatValue] === ListingFormat.ForPrice
    ) {
      setOpenCardDlg(true)
    } else {
      setOpenBidDialog(true)
    }
  }

  const placeOfferHandler = async (
    offerPrice: number,
    offerDuration: number,
  ) => {
    setOfferDetail({ offerPrice, offerDuration })
    const tLoading = await toast.loading('Placing your offer...')
    const { success, msg } = await placeOffer(
      commonLicenseData,
      offerPrice,
      offerDuration,
      licensingType,
      accessLevel,
      usageData,
    )
    if (success) {
      toast.success(msg, { id: tLoading })
    } else {
      toast.error(msg, { id: tLoading })
    }
  }

  const purchaseLicensesHandler = async () => {
    const tLoading = toast.loading('Purchasing the licenses...')
    const { success, msg } = await purchaseLicenses(
      [{ cartedInfo: { counts: 1 } }],
      [usageData],
      offerDetail,
      [commonLicenseData],
      [syncData],
      [accessLevel],
      [licensingType],
    )
    if (success) {
      toast.success(msg, { id: tLoading })
    } else {
      toast.error(msg, { id: tLoading })
    }
  }

  return (
    <Box display={'flex'} flexDirection={'column'} width={'100%'} ml={'auto'}>
      <LicenseDetails
        licensingType={licensingType}
        syncData={syncData}
        isOwner={isOwner}
        sellerName={commonLicenseData.sellerName}
        sellerId={commonLicenseData.sellerId}
        goToLicenseSettingPage={goToLicenseSettingPage}
        historyHandler={historyHandler}
        placeBid={placeBid}
        buyHandler={buyHandler}
        addToCartHandler={() => addToCartHandler(commonLicenseData)}
      />

      {isOwner && (
        <MyOffers
          listedId={commonLicenseData.listedId}
          licensingType={licensingType}
        />
      )}

      {openBidDialog && (
        <BidDialog
          usageData={usageData}
          open={openBidDialog}
          setOpen={setOpenBidDialog}
          backForwards={() => {
            setOpenBidDialog(false)
            setOpenUsageDlg(true)
          }}
          commonLicenseData={commonLicenseData}
          syncData={syncData}
          licensingType={licensingType}
          accessLevel={accessLevel}
          handler={placeOfferHandler}
        />
      )}

      <ConfirmDialog
        open={openConfirmDlg}
        setOpen={setOpenConfirmDlg}
        licenses={nonExclusiveLicenses}
        handler={confirmHandler}
      />

      <UsageDialog
        open={openUsageDlg}
        setOpen={setOpenUsageDlg}
        initialFormValues={initialFormValues}
        commonLicenseData={commonLicenseData}
        syncData={syncData}
        licensingType={licensingType}
        accessLevel={accessLevel}
        usageCallback={usageCallback}
      />

      <PaymentMethodDialog
        open={openPaymentDlg}
        setOpen={setOpenPaymentDlg}
        commonLicenseDataList={[commonLicenseData]}
        syncDataList={[syncData]}
        licensingTypes={[licensingType]}
        accessLevels={[accessLevel]}
        usageDetails={[usageData]}
        offerDetails={[offerDetail]}
        paymentHandler={purchaseLicensesHandler}
        backForwards={() => {
          setOpenPaymentDlg(false)
        }}
      />
    </Box>
  )
}
