import { signInByMagic } from 'src/api'
import {
  ACCESS_TOKEN,
  EXPIRATION_TIME,
  LOGGED_ID,
  MAGIC_USER_INFO,
} from 'src/config'
import { useDispatch } from 'react-redux'
import { AUTHENTICATED, LOGGED_OUT } from 'src/actions/actionTypes'
import toast from 'react-hot-toast'
import { MagicUserContext } from 'src/context/magicUserContext'
import { WalletTypes } from 'src/interface'
import jwtDecode from 'jwt-decode'
import { useContext } from 'react'
import { useWeb3 } from 'src/context/web3Context'
import { magic } from 'src/utils/magic/magic'
import { getWeb3 } from 'src/utils/magic/web3'
import 'magic-sdk'
import { getDeviceInfo, updateStore } from 'src/utils/utils'
import { useNavigate } from 'react-router-dom'
import { logoutHistory } from 'src/api'

declare module 'magic-sdk' {
  interface MagicUserMetadata {
    walletType?: string // Assuming walletType is optional
  }
}

export default function useAuth() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { web3, setWeb3 } = useWeb3()
  const { magicUser, setMagicUser } = useContext(MagicUserContext)

  const getUserInfoFromMagic = async () => {
    try {
      const userInfo = await magic.user.getInfo()
      return {
        email: userInfo.email,
        walletType: userInfo.walletType,
      }
    } catch (err) {
      console.log('error in getting email from magic', err)
      return {
        email: '',
        walletType: WalletTypes.none,
      }
    }
  }

  const connectWallet = async () => {
    try {
      // Try to connect to the wallet using Magic's user interface
      const accounts = await magic.wallet.connectWithUI()
      const newWeb3 = await getWeb3()
      setWeb3(newWeb3)
      return accounts[0]
    } catch (error) {
      // Log any errors that occur during the connection process
      console.log('handleConnect:', error)
      return null
    }
  }

  const signIn = async () => {
    const toastSigning = toast.loading('Logging in...')
    try {
      const accountAddress = await connectWallet()
      const { email } = await getUserInfoFromMagic()
      localStorage.setItem(
        MAGIC_USER_INFO,
        JSON.stringify({
          accountAddress,
          email,
        }),
      )
      setMagicUser({
        accountAddress,
        email,
      })
      const deviceInfo = getDeviceInfo()
      const { data, success, msg } = await signInByMagic(
        email,
        accountAddress,
        deviceInfo,
      )
      if (success) {
        updateStore(AUTHENTICATED, data.accessToken)
        window.localStorage.setItem(LOGGED_ID, data.loggedId)
      }
      toast.success(msg, {
        id: toastSigning,
      })
      if (data.newUser) {
        navigate('/settings')
      }
      return {
        loggedIn: true,
        data: data,
        redirected: data.newUser,
      }
    } catch (e) {
      console.log('error in signing', e)
      toast.error(e.message, { id: toastSigning })
      return {
        loggedIn: false,
        data: null,
        redirected: false,
      }
    }
  }

  const signOut = async () => {
    const loggedId = window.localStorage.getItem(LOGGED_ID)
    window.localStorage.removeItem(LOGGED_ID)
    logoutHistory(loggedId)
    localStorage.removeItem(ACCESS_TOKEN)
    dispatch({ type: LOGGED_OUT, payload: {} })
    // logout(setWeb3, setMagicUser)
  }

  const checkAuthAndSignIn = async () => {
    try {
      const now = Date.now()
      const ls = window.localStorage.getItem(ACCESS_TOKEN)
      if (ls !== 'undefined' && ls) {
        const decodedToken: any = jwtDecode(ls)
        const payload = decodedToken.payload

        if (now - payload.loggedTime < EXPIRATION_TIME) {
          return { loggedIn: true, redirected: false }
        } else {
          await signOut()
          const { loggedIn, redirected } = await signIn()
          return { loggedIn, redirected }
        }
      } else {
        const { loggedIn, redirected } = await signIn()
        return { loggedIn, redirected }
      }
    } catch (e) {
      return { loggedIn: false, redirected: false }
    }
  }

  return {
    getUserInfoFromMagic,
    connectWallet,
    signIn,
    signOut,
    checkAuthAndSignIn,
  }
}
