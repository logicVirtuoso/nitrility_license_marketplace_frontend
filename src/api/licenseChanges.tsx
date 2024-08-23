import { ACCESS_TOKEN, API_URL } from '../config'
import apiInstance from './interceptors'

export const getChangedLicenseData = async (historyId: string) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)
  const resData = await apiInstance.get(
    `${API_URL}/license-changes/${historyId}`,
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}
