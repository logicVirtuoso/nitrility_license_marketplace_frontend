import axios from 'axios'
import { IPFS_METADATA_API_URL, THEGRAPH_URL } from '../config'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'

export const useSoldLicenseHistory = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const tokenPrice = useSelector(
    (state: { priceReducer: { tokenPrice: number } }) =>
      state.priceReducer.tokenPrice,
  )

  const [soldHistories, setSoldHistories] = useState([])

  const init = useCallback(async () => {
    setLoading(true)
    if (!authorization?.currentUser?.sellerId) {
      setSoldHistories([])
    } else {
      const query = `
        query {
            soldLicenseEvents(where: {sellerId: "${authorization.currentUser.sellerId}"}) {
              sellerId
              blockNumber
              blockTimestamp
              buyerAddr
              copies
              eventType
              id
              licensingType
              listedId
              accessLevel
              price
              tokenId
              tokenURI
              transactionHash
            }
        }
      `
      try {
        const res = await axios.post(THEGRAPH_URL, { query })
        if (res.status === 200 && res.data?.data?.soldLicenseEvents) {
          const soldLicenseEvents = res.data.data.soldLicenseEvents
          const data = await Promise.all(
            soldLicenseEvents.map(async (item) => {
              const metaDataRes = await axios.get(
                `${IPFS_METADATA_API_URL}/${item.tokenURI}`,
              )
              const formattedTime = new Date(
                item.blockTimestamp * 1000,
              ).toLocaleString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })

              const result = {
                ...item,
                time: formattedTime,
                transactionHash: item.transactionHash,
                tokenId: item.tokenId,
                price: (tokenPrice * item.price) / 10 ** 18,
                sellerId: item.sellerId,
                buyerAddr: item.buyerAddr,
                licenseName:
                  metaDataRes.data.metadata.properties.licenseName.description,
                seller: metaDataRes.data.metadata.properties.seller.description,
                sellerName:
                  metaDataRes.data.metadata.properties.sellerName.description,
                listedId: item.listedId,
                avatarPath:
                  metaDataRes.data.metadata.properties?.avatarPath?.description,
                imagePath:
                  metaDataRes.data.metadata.properties.imagePath.description,
                artists:
                  metaDataRes.data.metadata.properties.artists?.description,
                trackId:
                  metaDataRes.data.metadata.properties.trackId.description,
                previewUrl: metaDataRes.data.metadata.properties.previewUrl
                  ? metaDataRes.data.metadata.properties.previewUrl.description
                  : null,
                tokenURI: item.tokenURI,
              }
              return result
            }),
          )
          setSoldHistories(data)
        } else {
          setSoldHistories([])
        }
      } catch (e) {
        console.log('error in getting sold license history', e)
        setSoldHistories([])
      }
      setLoading(false)
    }
  }, [tokenPrice, authorization])

  useEffect(() => {
    init()
  }, [init])

  return {
    loading,
    soldHistories,
  }
}
