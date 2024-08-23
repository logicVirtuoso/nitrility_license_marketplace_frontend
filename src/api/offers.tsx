import axios from 'axios'
import { LicensingTypes, SigningDataIF, TemplateDataIF } from 'src/interface'
import { ACCESS_TOKEN, API_URL } from 'src/config'
import apiInstance from './interceptors'

export const getMyOffersForBuyer = async (
  accountAddress: string,
  listedId: string,
) => {
  try {
    const res = await axios.get(
      `${API_URL}/offers/buyer-offer/${accountAddress}/${listedId}`,
    )
    return res.data.data
  } catch (e) {
    console.log('error in getting my offers', e)
    return []
  }
}

export const getMyOffersOfSeller = async (
  listedId: number,
  licensingType: LicensingTypes,
) => {
  try {
    const res = await axios.get(
      `${API_URL}/offers/seller-offer/${listedId}/${licensingType}`,
    )
    return res.data.data
  } catch (e) {
    console.log('error in getting my offers', e)
    return []
  }
}

export const getMadeOffers = async (
  sellerId: string,
  accountAddress: string,
) => {
  try {
    const res = await axios.get(
      `${API_URL}/offers/made-offer/${sellerId}/${accountAddress}`,
    )
    return res.data.data
  } catch (e) {
    console.log('error in getting my offers', e)
    return []
  }
}

export const getReceivedOffers = async (
  sellerId: string,
  accountAddress: string,
) => {
  try {
    const res = await axios.get(
      `${API_URL}/offers/received-offer/${sellerId}/${accountAddress}`,
    )
    return res.data.data
  } catch (e) {
    console.log('error in getting my offers', e)
    return []
  }
}

export const rejectOfferBySeller = async (offerId: string) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)

  const resData: any = await apiInstance.get(
    `${API_URL}/offers/reject-by-seller/${offerId}`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const getTotalOffers = async (sellerId: string) => {
  const resData: any = await apiInstance.post(
    `${API_URL}/offers/sale-total-offers`,
    {
      sellerId,
    },
  )
  return resData
}

export const placeCounterOfferBySeller = async (
  offerId: number,
  offerPrice: number,
  offerDuration: number,
  signingData: TemplateDataIF,
) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)

  const resData: any = await apiInstance.post(
    `${API_URL}/offers/counter-by-seller`,
    {
      offerId,
      offerPrice,
      offerDuration,
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

export const withdrawCounterOffer = async (offerId: number) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)

  const resData: any = await apiInstance.post(
    `${API_URL}/offers/withdraw-counter-offer`,
    {
      offerId,
    },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const editCounterOffer = async (
  offerId: number,
  offerPrice: number,
  offerDuration: number,
  signingData: TemplateDataIF,
) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)

  const resData: any = await apiInstance.post(
    `${API_URL}/offers/edit-counter-offer`,
    {
      offerId,
      offerPrice,
      offerDuration,
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

export const rejectCounterOffer = async (offerId: number) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)

  const resData: any = await apiInstance.post(
    `${API_URL}/offers/reject-counter-offer`,
    {
      offerId,
    },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const accpetOfferBySeller = async (
  offerId: number,
  signingData: SigningDataIF,
) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)

  const resData: any = await apiInstance.post(
    `${API_URL}/offers/accept`,
    {
      offerId,
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
