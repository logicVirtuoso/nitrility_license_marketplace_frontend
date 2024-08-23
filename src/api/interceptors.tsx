import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { LOGGED_OUT } from 'src/actions/actionTypes'
import { ACCESS_TOKEN, API_URL } from 'src/config'
import { store } from 'src/store'

// Create Axios instance
const apiInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

apiInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(ACCESS_TOKEN) // Fetch token from local storage
    if (token) {
      config.headers.authorization = `Bearer ${token}`
    } else {
      throw new Error('Please sign in first')
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

apiInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.message === 'Please sign in first') {
      // Handle case where user is not signed in
      return {
        success: false,
        data: null,
        msg: error.message,
      }
    } else if (error.response?.status === 401) {
      // Handle 401 Unauthorized error
      localStorage.removeItem(ACCESS_TOKEN)
      store.dispatch({ type: LOGGED_OUT, payload: {} })
      return error.response.data
    } else if (error.response) {
      return error.response.data
    } else {
      return {
        success: false,
        data: null,
        msg: 'Something went wrong',
      }
    }
  },
)

// Export the configured Axios instance
export default apiInstance
