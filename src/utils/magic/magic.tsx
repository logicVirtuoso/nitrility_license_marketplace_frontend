import { Magic } from 'magic-sdk'
import { RPC_URL, MAGIC_API_KEY, CHAIN_ID } from 'src/config'

export const magic = new Magic(MAGIC_API_KEY as string, {
  network: {
    rpcUrl: RPC_URL as string,
    chainId: CHAIN_ID as unknown as number,
  },
})
