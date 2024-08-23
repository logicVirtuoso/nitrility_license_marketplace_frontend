import {
  HistoryFilters,
  EventTypes,
  CustomResponseIF,
  LicensingTypes,
} from 'src/interface'
import { ACCESS_TOKEN, API_URL } from '../config'
import apiInstance from './interceptors'

// fetch all history for specific listed id
export const getHistoryByListedId = async (listedId: string, filters) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: CustomResponseIF = await apiInstance.post(
    `${API_URL}/history/license`,
    {
      listedId,
      filters,
    },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )

  return resData
}

// fetch history for license of specific listed id
export const getSaleDetails = async (listedId: string) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData = await apiInstance.post(
    `${API_URL}/history/sale-details`,
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

// fetch history for offer details of specific offer id
export const getOfferDetails = async (
  offerId: string,
  licensingType: LicensingTypes,
) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData = await apiInstance.get(
    `${API_URL}/history/offer-details/${offerId}/${licensingType}`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const getAllActivities = async (
  buyerAddr: string,
  sellerId: string,
  filters,
  isSeller: boolean,
) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.post(
    `${API_URL}/history/all-activities`,
    {
      buyerAddr,
      sellerId,
      filters,
      isSeller,
    },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )

  return resData
}

export const getAllAccounts = async (accountAddress: string) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: any = await apiInstance.post(
    `${API_URL}/history/all-accounts`,
    {
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
