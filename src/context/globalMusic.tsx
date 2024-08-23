import { getFavoriteLicenses } from 'src/api'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CommonLicenseDataIF } from 'interface'
import { AuthType } from 'src/store/reducers/authorizationReducer'

interface GlobalMusicContextProps {
  globalMusic: CommonLicenseDataIF
  setGlobalMusic: (music: CommonLicenseDataIF | null) => void
  isPlaying: boolean
  setIsPlaying: (isPlaying: boolean) => void
  favoriteLicenses: Array<any>
  setFavoriteLicenses: (favoriteIds: Array<any>) => void
}

export const GlobalMusicContext = React.createContext<GlobalMusicContextProps>({
  globalMusic: null,
  setGlobalMusic: () => {},
  isPlaying: false,
  setIsPlaying: () => {},
  favoriteLicenses: [],
  setFavoriteLicenses: () => {},
})

export const GlobalMusicProvider = ({ children }) => {
  const [globalMusic, setGlobalMusic] = useState<CommonLicenseDataIF | null>(
    null,
  )
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [favoriteLicenses, setFavoriteLicenses] = useState<Array<any>>([])

  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  useEffect(() => {
    const init = async () => {
      if (authorization?.currentUser?.accountAddress) {
        const { success, data } = await getFavoriteLicenses(
          authorization?.currentUser?.accountAddress,
        )
        if (success) {
          setFavoriteLicenses(data)
        }
      }
    }
    init()
  }, [authorization?.currentUser?.accountAddress])

  return (
    <GlobalMusicContext.Provider
      value={{
        globalMusic,
        setGlobalMusic,
        isPlaying,
        setIsPlaying,
        favoriteLicenses,
        setFavoriteLicenses,
      }}
    >
      {children}
    </GlobalMusicContext.Provider>
  )
}
