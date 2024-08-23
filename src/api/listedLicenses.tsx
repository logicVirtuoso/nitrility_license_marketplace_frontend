import {
  LicensingTypes,
  SearchFilterIF,
  LicenseDataIF,
  SigningDataIF,
} from 'src/interface'
import { ACCESS_TOKEN, API_URL } from '../config'
import axios from 'axios'
import apiInstance from './interceptors'

export const getGenres = async (tokenId: string) => {
  const res = await axios.get(`${API_URL}/listedlicense/genres/${tokenId}`)
  return res
}

export const searchLicenses = async (filter: object) => {
  const res = await axios.post(
    `${API_URL}/listedlicense/license-search`,
    filter,
  )
  return res
}

export const checkduplication = async (trackId: string) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)

  const resData: any = await apiInstance.post(
    `${API_URL}/listedlicense/checkduplication`,
    {
      trackId,
    },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const searchListedLicensesByFilter = async (
  searchParameters,
  sellerId,
) => {
  const res = await axios.post(
    `${API_URL}/listedlicense/search/listed-licenses`,
    {
      searchParameters,
      sellerId,
    },
  )
  return res
}

export const getListedLicenseBySellerId = async (sellerId: string) => {
  try {
    const res = await axios.get(
      `${API_URL}/listedlicense/all-licenses/${sellerId}`,
    )
    return res.data.data
  } catch (e) {
    console.log('error in getting listed license of seller', e)
    return []
  }
}

export const getAllUnLicensesBySellerId = async (sellerId: string) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)

  const resData: any = await apiInstance.get(
    `${API_URL}/listedlicense/unlisted/${sellerId}`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const getRecentUploads = async () => {
  try {
    const res = await axios.get(`${API_URL}/listedlicense/recent-uploads`)
    return res.data.data
  } catch (e) {
    console.log('error in getting recent uploads', e)
    return []
  }
}

export const getAllLicenses = async () => {
  try {
    const res = await axios.get(`${API_URL}/listedlicense/all`)
    return res.data.data
  } catch (e) {
    console.log('error in getting all licenses', e)
    return []
  }
}

export const unlistLicense = async (
  listedId: number,
  licensingType: LicensingTypes,
) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.post(
    `${API_URL}/listedlicense/unlist`,
    {
      listedId,
      licensingType,
    },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const unlistLicenseAll = async (listedId: number) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.post(
    `${API_URL}/listedlicense/unlist-all`,
    {
      listedId,
    },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const rejectLicense = async (listedId: number) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)

  const resData: any = await apiInstance.get(
    `${API_URL}/listedlicense/reject-license/${listedId}`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const approveLicense = async (listedId: number) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)

  const resData: any = await apiInstance.get(
    `${API_URL}/listedlicense/approve-license/${listedId}`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const uploadLicense = async (licenseData: LicenseDataIF) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.post(
    `${API_URL}/listedlicense/upload-license`,
    { licenseData },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const uploadMediaSyncLicense = async (uploadedData) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.post(
    `${API_URL}/listedlicense/upload-mediasync`,
    uploadedData,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const adjustLicense = async (
  listedId: number,
  signingData: SigningDataIF,
) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)

  const resData: any = await apiInstance.post(
    `${API_URL}/listedlicense/adjust-license`,
    {
      listedId,
      signingData,
    },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const getLicenseForListedId = async (listedId) => {
  try {
    const res = await axios.get(
      `${API_URL}/listedlicense/get-license/${listedId}`,
    )
    return res.data.data
  } catch (e) {
    console.log('error in fetching license for listed id', e)
    return null
  }
}

export const getNextOrPreviousLicense = async (
  listedId: number,
  isPrevious: boolean,
) => {
  try {
    const res = await axios.get(
      `${API_URL}/listedlicense/get-next-or-previous-license/${listedId}/${isPrevious}`,
    )
    return res.data
  } catch (e) {
    console.log('error in fetching next or previous license', e)
    return {
      success: false,
      msg: e.message,
      data: null,
    }
  }
}

export const getSyncData = async (
  listedId: string,
  licensingType: LicensingTypes,
) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData = await apiInstance.post(
    `${API_URL}/listedlicense/get-syncdata`,
    {
      listedId,
      licensingType,
    },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const getPendingListings = async (sellerId: string, searchFilter) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)

  const resData: any = await apiInstance.post(
    `${API_URL}/listedlicense/pending-listings`,
    {
      sellerId,
      searchFilter,
    },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const getTotalViewers = async (listedId: string) => {
  try {
    const res = await axios.post(
      `${API_URL}/listedlicense/fetch-total-viewers`,
      {
        listedId,
      },
    )
    return res.data.data
  } catch (e) {
    console.log('error in getting all licenses', e)
    return 0
  }
}

export const addViewer = async (listedId: number) => {
  try {
    const res = await axios.post(`${API_URL}/listedlicense/add-new-viewer`, {
      listedId,
    })
    return res.data.data
  } catch (e) {
    console.log('error in getting all licenses', e)
    return 0
  }
}

export const getAdditionalInfo = async (listedId: number) => {
  try {
    const res = await axios.post(
      `${API_URL}/listedlicense/fetch-additional-info`,
      {
        listedId,
      },
    )
    return res.data.data
  } catch (e) {
    console.log('error in getting all licenses', e)
    return {
      totalViewers: 0,
      totalOwners: 0,
      totalLikers: 0,
    }
  }
}

export const getCartedLicenses = async (trackIds: Array<string>) => {
  try {
    const res = await axios.post(
      `${API_URL}/listedlicense/fetch-carted-licenses`,
      {
        trackIds,
      },
    )
    return res.data
  } catch (e) {
    console.log('error in getting carted licenses', e)
    return {
      success: false,
      msg: e.message,
      data: [],
    }
  }
}

export const getRecommendingLicenses = async (buyerAddress: string) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.get(
    `${API_URL}/listedlicense/get-recommended-licenses/${buyerAddress}`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const getListedLicensesByIds = async (listedIds: string[]) => {
  try {
    const resData = await axios.post(
      `${API_URL}/listedlicense/get-listed-licenses`,
      {
        listedIds,
      },
    )
    console.log('resData', resData)
    return resData.data
  } catch (e) {
    console.log('error in getting listed licenses', e)
    return {
      success: false,
      data: [],
    }
  }
}
