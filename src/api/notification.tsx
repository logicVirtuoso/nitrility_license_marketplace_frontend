import { ACCESS_TOKEN, API_URL } from '../config'
import axios from 'axios'
import apiInstance from './interceptors'

export const getNotifications = async (accountAddress, sellerId) => {
  try {
    const ls = window.localStorage.getItem(ACCESS_TOKEN)

    const res = await axios.post(
      `${API_URL}/notification/get`,
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
    return res
  } catch (e) {
    console.log('error in getting notifications', e)
    return null
  }
}

export const markAsReadNotification = async (id) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)

  const resData: any = await apiInstance.post(
    `${API_URL}/notification/mark-one`,
    {
      id,
    },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const markAllAsReadNotification = async (accountAddress, sellerName) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)

  const resData: any = await apiInstance.post(
    `${API_URL}/notification/mark-all`,
    {
      accountAddress,
      sellerName,
    },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const createExpiredNotification = async (
  accountAddress,
  listedLicenseId,
) => {
  try {
    const ls = window.localStorage.getItem(ACCESS_TOKEN)

    const res = await axios.post(
      `${API_URL}/notification/expired-license`,
      {
        accountAddress,
        listedLicenseId,
      },
      {
        headers: {
          authorization: 'Bearer ' + ls,
        },
      },
    )
    return res
  } catch (e) {
    console.log('error in create expired notification', e)
    return null
  }
}
