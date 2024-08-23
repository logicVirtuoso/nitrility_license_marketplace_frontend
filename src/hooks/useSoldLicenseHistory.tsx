import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { getSoldLicenses } from 'src/api'
import { useTokenPrice } from './useTokenPrice'

export default function useSoldLicenseHistory() {
  const [loading, setLoading] = useState<boolean>(false)
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const { tokenPrice } = useTokenPrice()
  const [soldHistories, setSoldHistories] = useState<any[]>([]) // Initialize with an empty array

  const init = useCallback(async () => {
    setLoading(true)
    try {
      const { success, data } = await getSoldLicenses(
        authorization.currentUser.sellerId,
      )
      const tmp = data.map((item) => {
        return {
          ...item,
          price: tokenPrice * item.price,
        }
      })
      if (success) {
        setSoldHistories(tmp)
      } else {
        setSoldHistories([])
      }
    } catch (error) {
      console.log('Error fetching sold licenses:', error)
      setSoldHistories([]) // Handle error by setting soldHistories to an empty array
    } finally {
      setLoading(false)
    }
  }, [authorization.currentUser.sellerId, tokenPrice])

  useEffect(() => {
    init()
  }, [init])

  return {
    loading,
    soldHistories,
  }
}
