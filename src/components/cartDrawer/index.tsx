import React, {
  useCallback,
  useState,
  useEffect,
  useContext,
  useRef,
} from 'react'
import Drawer from '@mui/material/Drawer'
import { ADD_TO_CART } from '../../config'
import { Box, CardMedia, IconButton, Typography, useTheme } from '@mui/material'
import { CartContext } from 'src/context/carts'
import {
  AccessLevel,
  CartLocalStorageIF,
  CommonLicenseDataIF,
  LicensingTypes,
  ProjectTypeLabels,
  TemplateDataIF,
  UsageDetailIF,
} from 'src/interface'
import CloseDarkIcon from 'src/assets/images/close_dark.png'
import PrimaryButton from '../buttons/primary-button'
import CartItem from './cartItem'
import { getCartedLicenses } from 'src/api/listedLicenses'
import useUtils from 'src/hooks/useUtils'
import { getSyncData } from 'src/utils/utils'
import UsageDialog from '../usageDialog'
import BidDialog from 'src/pages/purchasing/bidDialog'
import BuyLicensesFC from './buyLicensesDlg'
import PaymentMethodDialog from '../paymentMethod'
import AddCardDialog from '../addCardDlg'
import useAuction from 'src/hooks/useAuction'
import toast from 'react-hot-toast'
import PurchasingResultDlg from '../purchasingResultDlg'

type Anchor = 'right'

interface CartDrawerProps {
  showCart: boolean
  setShowCart: (open: boolean) => void
}

const initialUsageDetail = {
  projectType: ProjectTypeLabels.Personal,
  releaseDate: Date.now(),
  contentTitle: '',
  contentDescription: '',
  productionDescription: '',
  aiModelDescription: '',
  previewFiles: [],
  intendedPlatforms: '',
  licenseUsage: '',
  submit: null,
}

export default function CartDrawer({ showCart, setShowCart }: CartDrawerProps) {
  const theme = useTheme()
  const [addedLicenses, setAddedLicenses] = useState<Array<any>>([])
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const { carts, setCarts } = useContext(CartContext)
  const [openBidDialog, setOpenBidDialog] = useState<boolean>(false)

  const [curIdx, setCurIdx] = useState<number>(0)
  const [openUsageDlg, setOpenUsageDlg] = useState<boolean>(false)

  const [accessLevels, setAccessLevels] = useState<Array<AccessLevel>>([])
  const [licensingTypes, setLicensingTypes] = useState<Array<LicensingTypes>>(
    [],
  )
  const [commonLicenseDataList, setCommonLicenseDataList] = useState<
    Array<CommonLicenseDataIF>
  >([])
  const [syncDataList, setSyncDataList] = useState<Array<TemplateDataIF>>([])
  const [usageDetails, setUsageDetails] = useState<Array<UsageDetailIF>>([])
  const [offerDetails, setOfferDetails] = useState<
    Array<{ offerPrice: number; offerDuration: number }>
  >([])
  const [openBuyLicensesDlg, setOpenBuyLicensesDlg] = useState<boolean>(false)
  const [openPaymentMethodsDlg, setOpenPaymentMethodsDlg] =
    useState<boolean>(false)
  const [openAddCardDlg, setOpenAddCardDlg] = useState<boolean>(false)
  const [openPurchasingResultDlg, setOpenPurchasingResultDlg] =
    useState<boolean>(false)
  const { etherToUsd } = useUtils()
  const { purchaseLicenses } = useAuction()

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      setShowCart(open)
    }

  const cartsRef = useRef(carts)

  useEffect(() => {
    cartsRef.current = carts
  }, [carts])

  const getAddedLicenses = useCallback(() => {
    if (cartsRef.current) {
      const trackIds = cartsRef.current.map((cart) => cart.trackId)
      getCartedLicenses(trackIds).then(({ data }) => {
        // Remove the unlisted licenses on local storage
        const updatedCarts = cartsRef.current.filter((cart) =>
          data.find((licenseData) => licenseData.trackId === cart.trackId),
        )

        // Prepare carted license data with cart information
        const cartedLicenseDatas = data.map((licenseData) => {
          const cartInfo = updatedCarts.find(
            (cart) => cart.trackId === licenseData.trackId,
          )
          return {
            licenseData,
            cartedInfo: cartInfo,
          }
        })

        // Update states without causing re-renders
        setAddedLicenses(cartedLicenseDatas)
        setUsageDetails(
          Array(cartedLicenseDatas.length).fill(initialUsageDetail),
        )
        setOfferDetails(
          Array(cartedLicenseDatas.length).fill({
            offerPrice: 0,
            offerDuration: Date.now(),
          }),
        )

        // Update local state to trigger context update
        setCarts(updatedCarts)
      })
    }
  }, [setCarts])

  useEffect(() => {
    getAddedLicenses()
  }, [getAddedLicenses, showCart])

  const deleteAllHandler = () => {
    window.localStorage.setItem(ADD_TO_CART, JSON.stringify([]))
    setAddedLicenses([])
    setCarts([])
  }

  const buyHandler = () => {
    setOpenUsageDlg(true)
  }

  const handleCartItemChange = (idx: number, cartInfo: CartLocalStorageIF) => {
    const updatedLicenses = addedLicenses.map((item, index) =>
      index === idx ? { ...item, cartedInfo: cartInfo } : item,
    )

    const updatedCarts = carts.map((item) =>
      item.id === cartInfo.id ? { ...item, ...cartInfo } : item,
    )
    setCarts(updatedCarts)
    window.localStorage.setItem(ADD_TO_CART, JSON.stringify(updatedCarts))
    setAddedLicenses(updatedLicenses)
  }

  const handleCartItemRemove = (idx, cartInfo) => {
    // Remove the item from addedLicenses
    const updatedLicenses = addedLicenses.filter((_, index) => index !== idx)

    // Remove the item from carts
    const updatedCarts = carts.filter((item) => item.id !== cartInfo.id)

    // Update the state and local storage
    setAddedLicenses(updatedLicenses)
    setCarts(updatedCarts)
    window.localStorage.setItem(ADD_TO_CART, JSON.stringify(updatedCarts))
  }

  useEffect(() => {
    let tempPrice = 0
    addedLicenses.forEach((data) => {
      const { cartedInfo, licenseData } = data
      const templateData = getSyncData(
        cartedInfo.licensingType,
        licenseData.signingData,
      )
      if (cartedInfo.licensingType != LicensingTypes.None) {
        tempPrice += etherToUsd(
          cartedInfo.accessLevel == AccessLevel.NonExclusive
            ? templateData?.fPrice * cartedInfo.counts
            : templateData?.sPrice * cartedInfo.counts,
        )
      }
    })
    setTotalPrice(tempPrice)
  }, [addedLicenses, etherToUsd])

  const usageCallback = async (data: UsageDetailIF) => {
    setUsageDetails((prev) =>
      prev.map((item, index) => (index === curIdx ? data : item)),
    )
    setOpenBidDialog(true)
  }

  useEffect(() => {
    const updatedCommonLicenseDataList: Array<CommonLicenseDataIF> =
      addedLicenses.map(({ licenseData }) => {
        return {
          listedId: licenseData.listedId,
          tokenURI: licenseData.tokenURI,
          albumName: licenseData.albumName,
          albumId: licenseData.albumId,
          sellerName: licenseData.sellerName,
          sellerId: licenseData.sellerId,
          avatarPath: licenseData.avatarPath,
          licenseName: licenseData.licenseName,
          imagePath: licenseData.imagePath,
          previewUrl: licenseData.previewUrl,
          trackId: licenseData.trackId,
          genres: licenseData.genres,
          artists: licenseData.artists,
          sellerAddress: licenseData.sellerAddress,
          length: licenseData.length,
        }
      })

    const updatedAccessLevels = addedLicenses.map(({ cartedInfo }) => {
      return cartedInfo.accessLevel
    })
    const updatedLicensingTypes = addedLicenses.map(({ cartedInfo }) => {
      return cartedInfo.licensingType
    })

    const updatedSyncDataList = addedLicenses.map(
      ({ cartedInfo, licenseData }) => {
        let syncData
        if (cartedInfo.licensingType !== LicensingTypes.None) {
          switch (cartedInfo.licensingType) {
            case LicensingTypes.Creator:
              syncData = licenseData.signingData.creator
              break
            case LicensingTypes.Movie:
              syncData = licenseData.signingData.movie
              break
            case LicensingTypes.Advertisement:
              syncData = licenseData.signingData.advertisement
              break
            case LicensingTypes.VideoGame:
              syncData = licenseData.signingData.videoGame
              break
            case LicensingTypes.TvSeries:
              syncData = licenseData.signingData.tvSeries
              break
            case LicensingTypes.AiTraining:
              syncData = licenseData.signingData.aiTraining
              break
            default:
              break
          }
          return syncData
        } else {
          return null
        }
      },
    )
    setCommonLicenseDataList(updatedCommonLicenseDataList)
    setAccessLevels(updatedAccessLevels)
    setLicensingTypes(updatedLicensingTypes)
    setSyncDataList(updatedSyncDataList)
  }, [addedLicenses])

  const placeOfferHandler = (offerPrice: number, offerDuration: number) => {
    setOfferDetails((prev) =>
      prev.map((item, index) =>
        index === curIdx ? { offerPrice, offerDuration } : item,
      ),
    )
    if (curIdx < addedLicenses.length - 1) {
      setCurIdx(curIdx + 1)
      setOpenUsageDlg(true)
    } else {
      setOpenBuyLicensesDlg(true)
    }
  }

  const purchaseLicensesHandler = async () => {
    const tLoading = toast.loading('Purchasing the licenses...')
    const { success, msg } = await purchaseLicenses(
      addedLicenses,
      usageDetails,
      offerDetails,
      commonLicenseDataList,
      syncDataList,
      accessLevels,
      licensingTypes,
    )
    if (success) {
      setOpenPurchasingResultDlg(true)
      toast.success(msg, { id: tLoading })
    } else {
      toast.error(msg, { id: tLoading })
    }
  }

  const drawer = (anchor: Anchor) => (
    <Box
      sx={{
        width: '360px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        maxHeight: 590,
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
      }}
      role="presentation"
    >
      <Box display={'flex'} flexDirection={'column'} height={'100%'}>
        {addedLicenses?.length > 0 ? (
          <>
            {addedLicenses.map((item, idx) => {
              return (
                <CartItem
                  key={idx}
                  licenseData={item.licenseData}
                  cartedInfo={item.cartedInfo}
                  onChange={(cartInfo: CartLocalStorageIF) =>
                    handleCartItemChange(idx, cartInfo)
                  }
                  onDelete={(cartInfo: CartLocalStorageIF) =>
                    handleCartItemRemove(idx, cartInfo)
                  }
                />
              )
            })}
          </>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              borderTop: `1px solid ${theme.palette.grey[600]}`,
            }}
          >
            <Typography
              variant="body1"
              align="center"
              color={theme.palette.text.secondary}
            >
              You have nothing in your cart.
            </Typography>
            <Typography
              variant="body1"
              align="center"
              color={theme.palette.text.secondary}
            >
              Add licenses to get started
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )

  return (
    <Drawer
      sx={{
        '& .MuiDrawer-paper': {
          borderRadius: '16px',
          height: 'calc(100vh - 129px)',
          top: '14.5px',
          right: '16px',
          backgroundColor: theme.palette.grey[700],
          backgroundImage: 'initial',
        },
      }}
      anchor={'right'}
      open={showCart}
      onClose={toggleDrawer('right', false)}
    >
      <Box display={'flex'} flexDirection={'column'} px={3} pt={3} pb={2}>
        <Box
          display={'flex'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Typography
            sx={{
              fontFamily: 'var(--font-semi-bold)',
              fontSize: 21,
              color: theme.palette.text.primary,
            }}
          >
            Your cart
          </Typography>

          <IconButton
            sx={{ width: 36, height: 36 }}
            onClick={() => setShowCart(false)}
          >
            <CardMedia component={'img'} image={CloseDarkIcon} />
          </IconButton>
        </Box>
        <Box display={'flex'} flexDirection={'column'} gap={0.5}>
          {addedLicenses?.length > 0 && (
            <Box display={'flex'} alignItems={'center'} gap={1}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 20,
                  height: 20,
                  borderRadius: '100%',
                  backgroundColor: theme.palette.grey[600],
                }}
              >
                <Typography
                  color={theme.palette.text.secondary}
                  variant="subtitle1"
                >
                  {addedLicenses.length}
                </Typography>
              </Box>
              <Typography
                variant="body1"
                color={theme.palette.text.secondary}
                align="center"
                onClick={deleteAllHandler}
              >
                Clear all
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {drawer('right')}

      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'center'}
        position={'absolute'}
        width={'100%'}
        px={2}
        gap={2}
        bottom={16}
      >
        {addedLicenses?.length > 0 && (
          <Typography
            align="center"
            color={theme.palette.text.primary}
          >{`Subtotal: $${totalPrice.toLocaleString()}`}</Typography>
        )}

        <PrimaryButton
          sx={{
            width: '100%',
            borderRadius: 12,
          }}
          onClick={buyHandler}
          disabled={addedLicenses?.length > 0 ? false : true}
        >
          Checkout
        </PrimaryButton>
      </Box>

      {openUsageDlg && (
        <UsageDialog
          open={openUsageDlg}
          setOpen={setOpenUsageDlg}
          initialFormValues={usageDetails[curIdx]}
          commonLicenseData={commonLicenseDataList[curIdx]}
          syncData={syncDataList[curIdx]}
          licensingType={addedLicenses[curIdx].cartedInfo.licensingType}
          accessLevel={addedLicenses[curIdx].cartedInfo.accessLevel}
          usageCallback={usageCallback}
          backForwards={() => {
            setOpenUsageDlg(false)
            if (curIdx > 0) {
              setCurIdx((prev) => prev - 1)
              setOpenBidDialog(true)
            }
          }}
        />
      )}

      {openBidDialog && (
        <BidDialog
          usageData={addedLicenses[curIdx].usageData}
          open={openBidDialog}
          setOpen={setOpenBidDialog}
          backForwards={() => {
            setOpenBidDialog(false)
            setOpenUsageDlg(true)
          }}
          commonLicenseData={commonLicenseDataList[curIdx]}
          syncData={syncDataList[curIdx]}
          licensingType={addedLicenses[curIdx].cartedInfo.licensingType}
          accessLevel={addedLicenses[curIdx].cartedInfo.accessLevel}
          handler={placeOfferHandler}
        />
      )}

      {openBuyLicensesDlg && (
        <BuyLicensesFC
          open={openBuyLicensesDlg}
          setOpen={setOpenBuyLicensesDlg}
          addedLicenses={addedLicenses}
          usageDetails={usageDetails}
          offerDetails={offerDetails}
          backForwards={() => {
            setOpenBidDialog(true)
            setOpenBuyLicensesDlg(false)
          }}
          handler={() => setOpenPaymentMethodsDlg(true)}
        />
      )}

      {openPaymentMethodsDlg && (
        <PaymentMethodDialog
          open={openPaymentMethodsDlg}
          setOpen={setOpenPaymentMethodsDlg}
          commonLicenseDataList={commonLicenseDataList}
          syncDataList={syncDataList}
          licensingTypes={licensingTypes}
          accessLevels={accessLevels}
          usageDetails={usageDetails}
          offerDetails={offerDetails}
          paymentHandler={purchaseLicensesHandler}
          backForwards={() => {
            setOpenPaymentMethodsDlg(false)
            setOpenBuyLicensesDlg(true)
          }}
        />
      )}

      <AddCardDialog
        open={openAddCardDlg}
        setOpen={setOpenAddCardDlg}
        backForwards={() => {
          setOpenAddCardDlg(false)
          setOpenPaymentMethodsDlg(true)
        }}
        handler={() => console.log('added card')}
      />

      <PurchasingResultDlg
        commonLicenseDatas={commonLicenseDataList}
        open={openPurchasingResultDlg}
        setOpen={setOpenPurchasingResultDlg}
      />
    </Drawer>
  )
}
