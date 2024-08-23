import { getSellerPlatform } from '../api'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'

export const SellerAccountDataContext = React.createContext([])

export const SellerAccountDataProvider = ({ children }) => {
  const [sellerAccountData, setSellerAccountData] = useState<Array<any>>([])

  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  useEffect(() => {
    const init = async () => {
      try {
        if (authorization?.currentUser?.accountAddress) {
          const { success, data } = await getSellerPlatform(
            authorization?.currentUser?.accountAddress,
          )
          if (success) {
            setSellerAccountData(data)
          } else {
            setSellerAccountData([])
          }
        }
      } catch (e) {
        console.log('error in getting seller account data', e)
      }
    }
    init()
  }, [authorization?.currentUser])

  return (
    <SellerAccountDataContext.Provider
      value={[sellerAccountData, setSellerAccountData]}
    >
      {children}
    </SellerAccountDataContext.Provider>
  )
}
