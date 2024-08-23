import React, { useCallback, useEffect, useState } from 'react'
import { MAGIC_USER_INFO } from 'src/config'
import { getProvider } from 'src/utils/magic/provider'

interface MagicUserInfoIF {
  accountAddress: string
  email: string
}

// Define the type for the user context.
type MagicUserInfoContextType = {
  magicUser: MagicUserInfoIF | null
  setMagicUser: (user: MagicUserInfoIF | null) => void
}

// Create a context for user data.
export const MagicUserContext = React.createContext<MagicUserInfoContextType>({
  magicUser: null,
  setMagicUser: () => {},
})

// Provider component that wraps parts of the app that need user context.
export const MagicUserProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [magicUser, setMagicUser] = useState<any>()

  useEffect(() => {
    try {
      setMagicUser(JSON.parse(localStorage.getItem(MAGIC_USER_INFO)))
    } catch (e) {
      console.log('magic local storage error', e)
    }
  }, [])

  const value = React.useMemo(
    () => ({
      magicUser,
      setMagicUser,
    }),
    [magicUser, setMagicUser],
  )

  return (
    <MagicUserContext.Provider value={{ ...value }}>
      {children}
    </MagicUserContext.Provider>
  )
}
