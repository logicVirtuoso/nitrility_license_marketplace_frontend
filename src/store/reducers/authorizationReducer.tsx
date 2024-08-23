import { PayloadIF, RoleTypes } from 'src/interface'
import {
  AUTH_INITIALIZATION,
  UNLINKED,
  AUTHENTICATED,
  AUTHENTICATION_EXPIRED,
  NOT_AUTHENTICATED,
  WALLETADDRESS_CHANGED,
  AUTHENTICATION_WALLET_CONNECTED,
  LOGGED_OUT,
  ADDRESS_CHANGED,
} from '../../actions/actionTypes'

export type AuthType = {
  loggedIn: boolean
  walletConnected: boolean
  currentUser: PayloadIF
}

const initialState = {
  loggedIn: false,
  walletConnected: false,
  currentUser: {
    id: null,
    firstName: '',
    lastName: '',
    accountAddress: null,
    sellerId: null,
    address: null,
    sellerName: '',
    role: RoleTypes.None,
    idenfies: null,
    loggedTime: null,
  },
}

export default function authorization(
  state: AuthType = initialState,
  action = {
    type: AUTH_INITIALIZATION,
    payload: {
      accountAddress: null,
      address: null,
    },
  },
) {
  switch (action.type) {
    case AUTH_INITIALIZATION:
      return state
    case UNLINKED:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          role: RoleTypes.Buyer,
          sellerId: null,
        },
      }
    case AUTHENTICATED:
      return {
        loggedIn: true,
        currentUser: action.payload,
      }
    case WALLETADDRESS_CHANGED:
      if (state.loggedIn) {
        return {
          ...state,
          accountAddress: action.payload.accountAddress,
        }
      }
      return state
    case NOT_AUTHENTICATED:
    case AUTHENTICATION_EXPIRED:
    case LOGGED_OUT:
      return {
        loggedIn: false,
        currentUser: initialState.currentUser,
      }
    case AUTHENTICATION_WALLET_CONNECTED:
      return {
        ...state,
        walletConnected: true,
      }
    case ADDRESS_CHANGED:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          address: action.payload.address,
        },
      }
    default:
      return state
  }
}
