import axios from 'axios'
import { ACCESS_TOKEN, API_URL } from '../config'
import { LicenseFilterIF } from 'interface'
import apiInstance from './interceptors'

export const getSoldLicenses = async (sellerId) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.get(
    `${API_URL}/soldlicense/groups/${sellerId}`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const getOwnedLicense = async (
  accountAddress: string,
  searchFilter: LicenseFilterIF,
) => {
  try {
    const ls = window.localStorage.getItem(ACCESS_TOKEN)

    const resData: any = await apiInstance.post(
      `${API_URL}/soldlicense/owned`,
      {
        accountAddress,
        searchFilter,
      },
      {
        headers: {
          authorization: 'Bearer ' + ls,
        },
      },
    )
    return resData
  } catch (e) {
    return {
      success: false,
      msg: e.message,
      data: [],
    }
  }
}

export const getTrendingArtist = async (time) => {
  try {
    const ls = window.localStorage.getItem(ACCESS_TOKEN)

    const res = await axios.get(`${API_URL}/soldlicense/trending/${time}`, {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    })
    return res
  } catch (e) {
    console.log('error in getting trending artist', e)
    return null
  }
}

export const getTopArtist = async (time: string) => {
  try {
    const ls = window.localStorage.getItem(ACCESS_TOKEN)
    const res = await axios.get(`${API_URL}/soldlicense/top/${time}`, {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    })
    return res.data
  } catch (e) {
    console.log('error in getting top artist', e)
    return {
      success: false,
      data: null,
    }
  }
}

export const getTopSellingLicense = async (time) => {
  try {
    const ls = window.localStorage.getItem(ACCESS_TOKEN)

    const res = await axios.get(
      `${API_URL}/soldlicense/top-selling-license/${time}`,
      {
        headers: {
          authorization: 'Bearer ' + ls,
        },
      },
    )
    return res.data
  } catch (e) {
    console.log('error in getting top artist', e)
    return {
      success: false,
      data: null,
    }
  }
}

export const getTrendingLicense = async (time) => {
  try {
    const ls = window.localStorage.getItem(ACCESS_TOKEN)

    const res = await axios.get(
      `${API_URL}/soldlicense/trending-license/${time}`,
      {
        headers: {
          authorization: 'Bearer ' + ls,
        },
      },
    )
    return {
      success: res.data.success,
      data: res.data.data,
      msg: res.data.msg,
    }
  } catch (e) {
    console.log('error in getting top artist', e)
    return {
      success: false,
      data: null,
      msg: e.message,
    }
  }
}

export const getMostPopularLicenses = async (sellerId: string) => {
  const resData: any = await apiInstance.post(
    `${API_URL}/soldlicense/most-popular-licenses`,
    {
      sellerId,
    },
  )
  return resData
}

export const getOrdersByLicenseType = async (sellerId: string) => {
  const resData: any = await apiInstance.post(
    `${API_URL}/soldlicense/orders-by-licensetype`,
    {
      sellerId,
    },
  )
  return resData
}

export const getSaleVolumeByMonth = async (sellerId: string) => {
  const resData: any = await apiInstance.post(
    `${API_URL}/soldlicense/sale-volume-by-month`,
    {
      sellerId,
    },
  )
  return resData
}

export const getPurchasedNonExclusive = async (listedId: number) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.get(
    `${API_URL}/soldlicense/purchased-non-exclusive/${listedId}`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const getPublicLicense = async (
  tokenId: string,
  accountAddress: string | null,
) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.get(
    `${API_URL}/soldlicense/public/${tokenId}/${accountAddress}`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const publishLicense = async (tokenId: string) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.get(
    `${API_URL}/soldlicense/publish-public-license/${tokenId}`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const getSaleStats = async (sellerId: string) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.get(
    `${API_URL}/soldlicense/fetch-sale-stats/${sellerId}`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}
