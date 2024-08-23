import { ACCESS_TOKEN, API_URL, LOGGED_ID } from 'src/config'
import apiInstance from './interceptors'
import { CustomResponseIF } from 'src/interface'

export const getSigninHistory = async (accountAddress: string) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData: CustomResponseIF = await apiInstance.get(
    `${API_URL}/security/signin-history/${accountAddress}`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )

  return resData
}

export const logoutHistory = async (loggedId: string) => {
  if (loggedId) {
    const ls = window.localStorage.getItem(ACCESS_TOKEN)
    const resData: CustomResponseIF = await apiInstance.get(
      `${API_URL}/security/logout-history/${loggedId}`,
      {
        headers: {
          authorization: 'Bearer ' + ls,
        },
      },
    )

    return resData
  }
}
