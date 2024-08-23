import { getPublicProfile } from 'src/api'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import {
  AccessLevel,
  CartLocalStorageIF,
  CommonLicenseDataIF,
  LicensingTypes,
  SortOption,
  UsageDetailIF,
} from 'src/interface'
import { useTokenPrice } from './useTokenPrice'
import { BigNumber } from 'bignumber.js'
import { ADD_TO_CART } from 'src/config'
import { useContext } from 'react'
import { CartContext } from 'src/context/carts'

export const initialSearchParams = {
  showSearchFilter: false,
  keyword: '',
  songProperties: [
    { label: 'Instrumental', value: false },
    { label: 'Explicit', value: false },
  ],
  length: [0, 300],
  tempo: [0, 300],
  genre: 'Genre',
  sortOption: SortOption.Newest,
}

export default function useUtils() {
  const navigate = useNavigate()
  const { setCarts } = useContext(CartContext)
  const { tokenPrice } = useTokenPrice()
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  const goToProfilePage = async (sellerId: string) => {
    try {
      const res = await getPublicProfile(sellerId)
      if (res.status === 200 && res.data.success) {
        navigate(`/pub-profile/${sellerId}`)
      } else {
        toast.error(res.data.msg)
      }
    } catch (e) {
      console.log('error in getting public profile')
      toast.error('Something went wrong')
    }
  }

  const generateMetaData = (
    commonLicenseData: CommonLicenseDataIF,
    usageDetails?: UsageDetailIF,
  ) => {
    const {
      licenseName,
      imagePath,
      sellerName,
      artists,
      trackId,
      previewUrl,
      listedId,
      avatarPath,
      sellerId,
      genres,
      sellerAddress,
    } = commonLicenseData
    return {
      title: 'Asset Metadata',
      type: 'object',
      properties: {
        licenseName,
        imagePath,
        sellerName,
        artists,
        createdAt: new Date(),
        sellerAddress,
        trackId,
        previewUrl,
        sellerId,
        listedId,
        avatarPath,
        genres,
        projectType: usageDetails?.projectType ?? '',
        releaseDate: usageDetails?.releaseDate ?? Date.now(),
        contentTitle: usageDetails?.contentTitle ?? '',
        contentDescription: usageDetails?.contentDescription ?? '',
        productionDescription: usageDetails?.productionDescription ?? '',
        aiModelDescription: usageDetails?.aiModelDescription ?? '',
        previewFiles: usageDetails?.previewFiles ?? '',
        intendedPlatforms: usageDetails?.intendedPlatforms ?? '',
        licenseUsage: usageDetails?.licenseUsage ?? '',
      },
    }
  }

  const etherToUsd = (priceInEther: number) => {
    const usdValue = priceInEther * tokenPrice
    return usdValue
  }

  const usdToEther = (priceInUsd: number) => {
    const priceInUsdBN = new BigNumber(priceInUsd)
    const tokenPriceBN = new BigNumber(tokenPrice)
    const etherValue = priceInUsdBN.dividedBy(tokenPriceBN)
    const formattedEtherValue = etherValue.toFixed(10, BigNumber.ROUND_DOWN)
    return parseFloat(formattedEtherValue)
  }

  const addToCartHandler = async (commonLicenseData: CommonLicenseDataIF) => {
    const { trackId, sellerId } = commonLicenseData
    const isOwner = sellerId == authorization?.currentUser?.sellerId
    const accountAddress = authorization?.currentUser?.accountAddress
    if (!isOwner) {
      let cartedLicenses: Array<CartLocalStorageIF>
      const cartedLicense = {
        trackId,
        accessLevel: AccessLevel.None,
        licensingType: LicensingTypes.None,
        counts: 1,
        label: '',
        id: Date.now(),
        accountAddress,
      }
      const al = window.localStorage.getItem(ADD_TO_CART)
      if (al) {
        cartedLicenses = JSON.parse(al)
      }
      if (cartedLicenses) {
        if (
          cartedLicenses.find(
            (item) =>
              item.trackId == cartedLicense.trackId &&
              item.licensingType == LicensingTypes.None,
          )
        ) {
          toast.error('Already added to cart')
        } else {
          cartedLicenses.push(cartedLicense)
          window.localStorage.setItem(
            ADD_TO_CART,
            JSON.stringify(cartedLicenses),
          )
          setCarts(cartedLicenses)
          toast.success('added successfully')
        }
      } else {
        window.localStorage.setItem(
          ADD_TO_CART,
          JSON.stringify([cartedLicense]),
        )
        setCarts([cartedLicense])
        toast.success('added successfully')
      }
    } else {
      window.location.reload()
    }
  }

  return {
    addToCartHandler,
    goToProfilePage,
    generateMetaData,
    etherToUsd,
    usdToEther,
  }
}
