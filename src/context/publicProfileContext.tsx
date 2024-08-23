import React, { useEffect, useState, ReactNode, FC, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { getPublicProfile } from 'src/api'
import { PublicProfileDataIF } from 'src/interface'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { SocialAccountType } from 'src/constants'

// Define the shape of the context
interface PublicProfileContextType {
  publicSellerId: string
  setPublicSellerId: React.Dispatch<React.SetStateAction<string>>
  initPublicProfileData: () => void
  publicProfileData: PublicProfileDataIF
  setPublicProfileData: React.Dispatch<
    React.SetStateAction<PublicProfileDataIF>
  >
}

// Create a default value for the context
const defaultPublicProfileData: PublicProfileDataIF = {
  collections: [],
  bio: '',
  contacts: {
    email: '',
    phone: '',
  },
  socials: {
    [SocialAccountType.WebSite]: '',
    [SocialAccountType.Instagram]: '',
    [SocialAccountType.Youtube]: '',
    [SocialAccountType.TikTok]: '',
    [SocialAccountType.TwitterX]: '',
    [SocialAccountType.Twitch]: '',
    [SocialAccountType.Spotify]: '',
  },
}

const defaultContext: PublicProfileContextType = {
  publicSellerId: '',
  setPublicSellerId: () => {},
  initPublicProfileData: () => {},
  publicProfileData: defaultPublicProfileData,
  setPublicProfileData: () => {},
}

// Create the context
export const PublicProfileContext =
  React.createContext<PublicProfileContextType>(defaultContext)

// Define the provider component
export const PublicProfileProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [publicSellerId, setPublicSellerId] = useState<string>()
  const [publicProfileData, setPublicProfileData] =
    useState<PublicProfileDataIF>(defaultPublicProfileData)

  const initPublicProfileData = useCallback(() => {
    if (publicSellerId && publicSellerId !== '') {
      getPublicProfile(publicSellerId).then((resData) => {
        if (resData.status === 200 && resData.data.success) {
          setPublicProfileData(resData.data.data)
        }
      })
    }
  }, [publicSellerId])

  useEffect(() => {
    initPublicProfileData()
  }, [initPublicProfileData])

  return (
    <PublicProfileContext.Provider
      value={{
        publicSellerId,
        setPublicSellerId,
        publicProfileData,
        setPublicProfileData,
        initPublicProfileData,
      }}
    >
      {children}
    </PublicProfileContext.Provider>
  )
}
