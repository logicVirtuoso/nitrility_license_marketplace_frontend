import axios from 'axios'
import {
  ACCESS_TOKEN,
  API_URL,
  EXPIRATION_TIME,
  SPOTIFY_TOKEN,
} from '../config'
import jwtDecode from 'jwt-decode'
import { store } from '../store'
import {
  AUTHENTICATED,
  AUTHENTICATION_EXPIRED,
  NOT_AUTHENTICATED,
} from '../actions/actionTypes'
import apiInstance from './interceptors'
import { updateStore } from 'src/utils/utils'
import { DeviceInfoIF } from 'interface'

export const signInByMagic = async (
  email: string,
  accountAddress: string,
  deviceInfo: DeviceInfoIF,
) => {
  const res = await axios.post(`${API_URL}/user/signin-by-magic`, {
    email,
    accountAddress,
    deviceInfo,
  })

  return res.data
}

export const getAllArtists = async () => {
  try {
    const res = await axios.get(`${API_URL}/user/all-artists`)
    return res.data.data
  } catch (e) {
    console.log('error in getting all artists', e)
    return []
  }
}

export const checkAuth = () => {
  try {
    const now = Date.now()
    const ls = window.localStorage.getItem(ACCESS_TOKEN)
    let result = NOT_AUTHENTICATED
    if (ls !== 'undefined' && ls) {
      const decodedToken: any = jwtDecode(ls)
      const payload = decodedToken.payload
      if (now - payload.loggedTime < EXPIRATION_TIME) {
        updateStore(AUTHENTICATED, ls, false)
        result = AUTHENTICATED
      } else {
        store.dispatch({
          type: AUTHENTICATION_EXPIRED,
          payload: {},
        })
        result = AUTHENTICATION_EXPIRED
      }
    } else {
      result = NOT_AUTHENTICATED
    }
    return result
  } catch (e) {
    console.log('error in checking auth', e)
  }
}

export const sendCodeToPersonalEmail = async (userName, personalEmail) => {
  const res = await axios.post(`${API_URL}/user/sendcode/personalemail`, {
    userName,
    personalEmail,
  })
  return res
}

export const sendCodeToPlatformEmail = async (
  personalEmail,
  accountData,
  platformTitle = 'Spotify',
) => {
  const res = await axios.post(`${API_URL}/user/sendcode/platformemail`, {
    personalEmail,
    accountData,
    platformTitle,
  })
  return res
}

export const checkPersonalCode = async (
  personalEmail: string,
  personalCode: string,
) => {
  const res = await axios.post(`${API_URL}/user/check-personalcode`, {
    personalEmail,
    personalCode,
  })
  return res
}

export const signUpAsSeller = async (
  platformEmail: string,
  accountAddress: string,
) => {
  const res = await axios.post(`${API_URL}/user/signup-seller`, {
    platformEmail,
    accountAddress,
  })
  return res
}

export const spotifyLogin = async (token: string) => {
  const userRes = await axios({
    url: `https://api.spotify.com/v1/me`,
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
  return userRes
}

export const spotifyLogout = async () => {
  try {
    const url = 'https://www.spotify.com/logout/'
    const spotifyLogoutWindow = await window.open(
      url,
      'Spotify Logout',
      'width=500,height=500,hidden=yes',
    )
    setTimeout(() => {
      spotifyLogoutWindow.close()
      window.localStorage.removeItem(SPOTIFY_TOKEN)
    }, 3000)
  } catch (e) {
    console.log('error in log out', e)
  }
}

export const getContactInfoOfOffer = async (accountAddress: string) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)

  const resData: any = await apiInstance.get(
    `${API_URL}/user/contact/${accountAddress}`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const checkIfLiked = async (
  accountAddress: string,
  listedId: string,
) => {
  try {
    // const ls = window.localStorage.getItem(ACCESS_TOKEN)

    const res = await axios.post(
      `${API_URL}/user/favorite`,
      {
        accountAddress,
        listedId,
      },
      // {
      //     headers: {
      //         authorization: 'Bearer ' + ls,
      //     },
      // },
    )
    return res
  } catch (e) {
    return null
  }
}

export const likeOrDislikeLicense = async (
  accountAddress: string,
  listedId: number,
) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)

  const resData: any = await apiInstance.post(
    `${API_URL}/user/likeOrDislike`,
    {
      accountAddress,
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

export const checkFollowing = async (
  sellerId: string,
  buyerAddress: string,
) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.post(
    `${API_URL}/user/check-following`,
    {
      sellerId,
      buyerAddress,
    },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const updateFollow = async (sellerId: string, buyerAddress: string) => {
  try {
    const ls = window.localStorage.getItem(ACCESS_TOKEN)

    const resData: any = await apiInstance.post(
      `${API_URL}/user/update-follow`,
      {
        sellerId,
        buyerAddress,
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
    }
  }
}

export const getFollowingBuyers = async (sellerId: string) => {
  try {
    const resData: any = await axios.get(
      `${API_URL}/user/get-following-buyers/${sellerId}`,
    )
    return resData.data
  } catch (e) {
    return {
      success: false,
      data: [],
      msg: e.message,
    }
  }
}

export const searchArtists = async (keyword: string) => {
  const res = await axios.post(`${API_URL}/user/artists/search`, {
    keyword,
  })
  return res
}

export const getFavoriteLicenses = async (accountAddress: string) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.get(
    `${API_URL}/user/favorite-licenses/${accountAddress}`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const sendVerificationCodeToSpotifyEmail = async (
  spotifyEmail,
  accountAddress,
) => {
  const res = await axios.post(`${API_URL}/user/send-code-spotify`, {
    spotifyEmail,
    accountAddress,
  })
  return res
}

export const sendVCodeToSpotifyEmail = async (accountAddress, spotifyData) => {
  const res = await axios.post(`${API_URL}/user/add/send-code-spotify`, {
    accountAddress,
    spotifyData,
  })
  return res
}

export const verifySellerAccount = async (
  accountAddress,
  verificationCode,
  platformTitle = 'Spotify',
) => {
  const res = await axios.post(`${API_URL}/user/verify-spotify`, {
    platformTitle,
    accountAddress,
    verificationCode,
  })
  return res
}

export const deleteSellerAccount = async (accountTitle, accountAddress) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)

  const resData: any = await apiInstance.delete(
    `${API_URL}/user/seller-account`,
    {
      data: {
        accountTitle,
        accountAddress,
      },
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const sendEmailToCollaborators = async (
  emails: string,
  licenseName: string,
  imagePath: string,
) => {
  const resData: any = await apiInstance.post(
    `${API_URL}/user/email-to-collaborators`,
    {
      emails,
      licenseName,
      imagePath,
    },
  )
  return resData
}
