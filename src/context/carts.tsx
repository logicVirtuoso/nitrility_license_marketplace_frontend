import { CartLocalStorageIF } from 'interface'
import React, { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { ADD_TO_CART } from 'src/config'
import { AuthType } from 'src/store/reducers/authorizationReducer'

interface Props {
  carts: CartLocalStorageIF[]
  setCarts: (carts: CartLocalStorageIF[]) => void
  initializeCarts: () => void
}

export const CartContext = React.createContext<Props>({
  carts: [],
  setCarts: () => {},
  initializeCarts: () => {},
})

export const CartProvider = ({ children }) => {
  const [carts, setCarts] = useState<Array<CartLocalStorageIF>>([])
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const initializeCarts = useCallback(() => {
    try {
      const al = window.localStorage.getItem(ADD_TO_CART)
      if (al) {
        const licenses: Array<any> = JSON.parse(al)
        setCarts(
          licenses.filter(
            (license) =>
              license.accountAddress ==
              authorization?.currentUser?.accountAddress,
          ),
        )
      } else {
        setCarts([])
      }
    } catch (e) {
      console.log('error in initialize carts', e)
      setCarts([])
    }
  }, [authorization?.currentUser?.accountAddress])

  const handleStorageChange = useCallback(
    (event) => {
      if (event.storageArea === window.localStorage) {
        initializeCarts()
      }
    },
    [initializeCarts],
  )

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [handleStorageChange])

  useEffect(() => {
    if (!authorization.loggedIn) {
      setCarts([])
    } else {
      initializeCarts()
    }
  }, [authorization, initializeCarts])

  return (
    <CartContext.Provider value={{ carts, setCarts, initializeCarts }}>
      {children}
    </CartContext.Provider>
  )
}
