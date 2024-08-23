import { MAGIC_USER_INFO } from 'src/config'
import { magic } from './magic'
import { getProvider } from './provider'

// When a user logs out, disconnect with Magic & re-set web3 provider
export const logout = async (setWeb3: any, setUser: any) => {
  localStorage.removeItem(MAGIC_USER_INFO)
  await magic.user.logout()
  const web3 = await getProvider()
  setWeb3(web3)
  setUser(null)
  console.log('Successfully disconnected')
}
