import { CHAIN_ID, RPC_URL } from 'src/config'
import { useWeb3 } from 'src/context/web3Context'
import useAuth from './useAuth'
import { WalletTypes } from 'src/interface'

export default function useWallet() {
  const { web3 } = useWeb3()
  const { getUserInfoFromMagic } = useAuth()
  // Add Polygon
  async function addArbitrumOne() {
    try {
      await web3.currentProvider.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: CHAIN_ID,
            chainName: 'Arbitrum One',
            rpcUrls: [RPC_URL],
            nativeCurrency: {
              name: 'ETH',
              symbol: 'ETH',
              decimals: 18,
            },
            blockExplorerUrls: ['https://polygonscan.com'],
          },
        ],
      })
      return true
    } catch (error) {
      console.log('Error adding network:', error)
      return false
    }
  }

  // Switch to Polygon
  async function switchToArbitrumOne() {
    try {
      await web3.currentProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CHAIN_ID }], // Polygon chain ID
      })
      return true
    } catch (error) {
      console.log('Error switching network:', error)
      return false
    }
  }

  async function checkArbitrumNetwork() {
    try {
      const networkId = await web3.eth.net.getId()
      return networkId == CHAIN_ID
    } catch (error) {
      console.log('Error checking network:', error)
      return false
    }
  }

  async function autoArbitrumHandler() {
    try {
      const { walletType } = await getUserInfoFromMagic()
      if (walletType == WalletTypes.magic) {
        return true
      } else {
        const isArbitrumNetwork = await checkArbitrumNetwork()
        if (isArbitrumNetwork) {
          // Proceed with the next action
          console.log('Connected to ArbitrumOne')
          return true
        } else {
          const switched = await switchToArbitrumOne()
          if (switched) {
            // Switch to ArbitrumOne
            console.log('switched to ArbitrumOne network')
            return true
          } else {
            // Add ArbitrumOne or show an alert to the user
            const hasAddEthereumChain = await addArbitrumOne()
            if (hasAddEthereumChain) {
              console.log('ArbitrumOne added')
              return true
            } else {
              return false
            }
          }
        }
      }
    } catch (e) {
      window.open(`https://metamask.io/download.html`, '_blank', 'noreferrer')
      return false
    }
  }
  return {
    addArbitrumOne,
    switchToArbitrumOne,
    autoArbitrumHandler,
  }
}
