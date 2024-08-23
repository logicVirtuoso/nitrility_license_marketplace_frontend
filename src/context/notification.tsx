import React, { useReducer, useEffect } from 'react'
import { checkAuth } from '../api'
import { io } from 'socket.io-client'
import { API_URL, LOGGED_ID } from '../config'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { AUTHENTICATED, LOGGED_OUT } from 'src/actions/actionTypes'
import { updateStore } from 'src/utils/utils'
import { store } from 'src/store'

export const NotificationContext = React.createContext([])

const initialState = []

const reducer = (state, action) => {
  switch (action.type) {
    case 'init':
      return action.payload
    case 'add':
    case 'licenseAlert':
      if (!action.payload) return state
      const notification = state.find(
        (item) =>
          item._id === action.payload._id &&
          item.eventType === action.payload.eventType,
      )

      if (notification) return state
      else {
        return [...state, action.payload]
      }
    case 'update':
      return action.payload
    default:
      return state
  }
}

const socket = io(API_URL)

export const NotificationProvider = ({ children }) => {
  const [notifications, dispatch] = useReducer(reducer, initialState)

  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    const curWalletAddr =
      authorization?.currentUser?.accountAddress?.toLowerCase()
    const curSellerId = authorization?.currentUser?.sellerId
    if (curWalletAddr) {
      socket.emit('read-notification', {
        accountAddress: curWalletAddr,
        sellerId: curSellerId,
      })

      socket.on('created-notification', function (res) {
        if (curWalletAddr === res?.accountId?.toLowerCase()) {
          dispatch({ type: 'add', payload: res.data })
        }
      })

      socket.on('idenfy-callback', function (res) {
        try {
          if (curWalletAddr === res?.accountAddress?.toLowerCase()) {
            updateStore(AUTHENTICATED, res.accessToken)
          }
        } catch (e) {
          console.log('error in idenfy callback', e)
        }
      })

      socket.on('nitrility-signout', function (loggedId) {
        const localLoggedId = window.localStorage.getItem(LOGGED_ID)
        console.log('loggedId', loggedId)
        if (loggedId == localLoggedId) {
          console.log('localLoggedId', localLoggedId)
          store.dispatch({ type: LOGGED_OUT, payload: {} })
          window.localStorage.removeItem(LOGGED_ID)
        }
      })
    }

    socket.on(
      'nitrility-notification',
      function ({ reader, eventType, description }) {
        if (curWalletAddr === reader || curSellerId === reader) {
          dispatch({
            type: 'licenseAlert',
            payload: {
              reader,
              eventType,
              description,
            },
          })
        }
      },
    )

    socket.on('initial-notifications', function ({ success, data }) {
      if (success) {
        const { reader } = data
        if (curWalletAddr === reader || curSellerId === reader) {
          dispatch({ type: 'init', payload: data })
        }
      }
    })
  }, [authorization?.currentUser])

  return (
    <NotificationContext.Provider value={[notifications, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}
