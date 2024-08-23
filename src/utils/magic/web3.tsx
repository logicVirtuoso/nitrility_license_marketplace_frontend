// eslint-disable-next-line import/no-named-as-default
import Web3 from 'web3'
import { getProvider } from './provider'

export const getWeb3 = async () => {
  return new Web3(await getProvider())
}
