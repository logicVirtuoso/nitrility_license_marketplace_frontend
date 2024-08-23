import { useWeb3 } from 'src/context/web3Context'
import { aggregatorV3InterfaceABI } from 'src/abi/priceFeed'
import { useCallback, useEffect, useState } from 'react'
import { PRICE_FEED_ADDRESS } from 'src/config'

export const useTokenPrice = () => {
  const { web3 } = useWeb3()
  const [tokenPrice, setTokenPrice] = useState<number>(0)

  const fetchTokenPrice = useCallback(async () => {
    try {
      const contract = new web3.eth.Contract(
        aggregatorV3InterfaceABI,
        PRICE_FEED_ADDRESS,
      )
      const { answer } = await contract.methods.latestRoundData().call()
      setTokenPrice(parseInt(answer) / 10 ** 8)
    } catch (e) {
      // console.log('fetching token price', e)
    }
  }, [web3])

  useEffect(() => {
    fetchTokenPrice()
  }, [fetchTokenPrice])

  return {
    tokenPrice,
  }
}
