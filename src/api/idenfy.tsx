import { RoleTypes } from 'src/interface'
import { API_URL } from '../config'
import axios from 'axios'

export const createSession = async (
  accountAddress: string,
  userRole: RoleTypes,
) => {
  try {
    const res = await axios.post(`${API_URL}/idenfy-callback/create-session`, {
      accountAddress,
      userRole,
    })
    return {
      success: res.data.success,
      idenfyUrl: `https://kyb.ui.idenfy.com/?authToken=${res.data.data}`,
    }
  } catch (e) {
    console.log('error in creating session', e)
    return {
      success: false,
      idenfyUrl: null,
    }
  }
}

export const unlinkBusinessAcc = async (accountAddress: string, idenfy) => {
  try {
    const res = await axios.post(`${API_URL}/idenfy-callback/unlink`, {
      accountAddress,
      idenfy,
    })
    return {
      success: res.data.success,
      accessToken: res.data.data.accessToken,
    }
  } catch (e) {
    console.log('error in unlinking', e)
    return {
      success: false,
      accessToken: null,
    }
  }
}

export const reLinkBusinessAcc = async (accountAddress: string, idenfy) => {
  try {
    const res = await axios.post(`${API_URL}/idenfy-callback/relink`, {
      accountAddress,
      idenfy,
    })
    return {
      success: res.data.success,
      idenfyUrl: `https://kyb.ui.idenfy.com/?authToken=${res.data.data}`,
    }
  } catch (e) {
    console.log('error in relinking', e)
    return {
      success: false,
      idenfyUrl: null,
    }
  }
}
