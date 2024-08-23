import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { getWeb3 } from 'src/utils/magic/web3'

const Web3Context = createContext<any>({})

export const Web3ContextProvider = ({ children }: any) => {
  const [web3, setWeb3] = useState<any>()

  const value = useMemo(
    () => ({
      web3,
      setWeb3,
    }),
    [web3, setWeb3],
  )

  useEffect(() => {
    getWeb3().then(setWeb3)
  }, [])

  return (
    <Web3Context.Provider value={{ ...value }}>{children}</Web3Context.Provider>
  )
}

export function useWeb3() {
  return useContext(Web3Context)
}
