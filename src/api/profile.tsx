import { MailingIF } from 'interface'
import { ACCESS_TOKEN, API_URL } from '../config'
import apiInstance from './interceptors'
import axios from 'axios'

export const savePublicProfile = async (
  sellerId: string,
  description: string,
  collectionName: string,
  selectedLicenses: Array<number>,
  imagePath: string,
  collectionId: number,
) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.post(
    `${API_URL}/user/save-profile`,
    {
      sellerId,
      description,
      collectionName,
      selectedLicenses,
      imagePath,
      collectionId,
    },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const updatePublicProfile = async (
  sellerId: string,
  description: string,
  collectionName: string,
  selectedLicenses: Array<number>,
  imagePath: string,
  collectionId: number,
) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.post(
    `${API_URL}/user/update-profile`,
    {
      sellerId,
      description,
      collectionName,
      selectedLicenses,
      imagePath,
      collectionId,
    },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const deleteCollection = async (
  sellerId: string,
  collectionId: string,
) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.get(
    `${API_URL}/user/delete-profile/${sellerId}/${collectionId}`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const removeCollection = async (
  sellerId: string,
  collectionId: string,
) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.get(
    `${API_URL}/user/remove-profile/${sellerId}/${collectionId}`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const updateBuyerPlatform = async (accountAddress, buyerAccountData) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.post(
    `${API_URL}/user/update-buyerplatform`,
    {
      accountAddress,
      buyerAccountData,
    },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const updateBuyerMailingInfo = async (mailingInfo: MailingIF) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.post(
    `${API_URL}/user/update-buyer-mailing`,
    mailingInfo,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const updateSellerMailingInfo = async (mailingInfo: MailingIF) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.post(
    `${API_URL}/user/update-seller-mailing`,
    mailingInfo,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const getBuyerMailingInfo = async () => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.get(
    `${API_URL}/user/fetch-buyer-mailing`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const getSellerMailingInfo = async () => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.get(
    `${API_URL}/user/fetch-seller-mailing`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const getBuyerPlatform = async (accountAddress) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.get(
    `${API_URL}/user/get-buyerplatform/${accountAddress}`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const getSellerPlatform = async (accountAddress: string) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.get(
    `${API_URL}/user/get-sellerplatform/${accountAddress}`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const updateSellerPlatform = async (
  accountAddress,
  sellerAccountData,
) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.post(
    `${API_URL}/user/update-sellerplatform`,
    {
      accountAddress,
      sellerAccountData,
    },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )

  return resData
}

export const getDetailCountsOfProfile = async (
  accountAddress: string,
  sellerId: string,
) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.post(
    `${API_URL}/user/fetch-profile-details`,
    {
      accountAddress,
      sellerId,
    },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )

  return resData
}

export const getCurrentAccount = async (platformTitle, accountAddress) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.post(
    `${API_URL}/user/current-account`,
    {
      platformTitle,
      accountAddress,
    },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )

  return resData
}

export const getPrivateProfileData = async (accountAddress: string) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.get(
    `${API_URL}/user/fetch-private-data/${accountAddress}`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const getPublicProfileData = async (sellerId: string) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.get(
    `${API_URL}/user/fetch-public-data/${sellerId}`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const getUserLegalName = async () => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.get(
    `${API_URL}/user/user-legal-name`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const updateUserName = async (firstName: string, lastName: string) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.post(
    `${API_URL}/user/update-name`,
    {
      firstName,
      lastName,
    },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const getPublicProfile = async (sellerId: string) => {
  try {
    const resData = await axios.get(`${API_URL}/user/fetch-profile/${sellerId}`)
    return resData
  } catch (e) {
    console.log('error in fetching public profile', e)
    return e.response
  }
}

export const getCollectionData = async (
  sellerId: string,
  collectionId: string,
) => {
  try {
    const resData = await axios.get(
      `${API_URL}/user/fetch-collection/${sellerId}/${collectionId}`,
    )
    return resData
  } catch (e) {
    console.log('error in fetching public profile', e)
    return e.response
  }
}

export const getSellerData = async (sellerId: string) => {
  try {
    const resData = await axios.get(
      `${API_URL}/user/fetch-sellerdata/${sellerId}`,
    )
    return resData
  } catch (e) {
    console.log('error in fetching public profile', e)
    return e.response
  }
}

export const updateSellerProfile = async (profile) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.post(
    `${API_URL}/user/update-seller-profile`,
    profile,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const updateFollow = async (
  followerAddress: string,
  followingAddress: string,
  isFollow: boolean,
) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  try {
    const resData = await axios.post(
      `${API_URL}/user/update-follow`,
      {
        followerAddress,
        followingAddress,
        isFollow,
      },
      {
        headers: {
          authorization: `Bearer ${ls}`,
        },
      },
    )
    return resData
  } catch (e) {
    console.log('error in fetching public profile', e)
    return e.response
  }
}

export const getSocialAccounts = async (selelrId: string) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  try {
    const resData = await axios.get(
      `${API_URL}/user/fetch-social-accounts/${selelrId}`,
      {
        headers: {
          authorization: 'Bearer ' + ls,
        },
      },
    )
    return resData.data
  } catch (e) {
    console.log('error in fetching public profile', e)
    return {
      success: false,
      data: [],
    }
  }
}

export const addProfileViewer = async (sellerId: string) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  try {
    const resData = await axios.post(
      `${API_URL}/user/add-viewer`,
      {
        sellerId,
      },
      {
        headers: {
          authorization: `Bearer ${ls}`,
        },
      },
    )
    return resData
  } catch (e) {
    console.log('error in fetching public profile', e)
    return e.response
  }
}
