import React, { useState, useEffect, useContext } from 'react'
import { checkAuth, getPublicProfile } from '../api'
import { useSelector } from 'react-redux'
import { AccountTypes } from '../config'
import { SellerAccountDataContext } from './sellerData'
import { AuthType } from 'src/store/reducers/authorizationReducer'

const initialSocialLinks = [
  {
    id: 1,
    text: 'Instagram',
    isLinked: false,
    type: AccountTypes.Instagram,
    accountData: null,
  },
  {
    id: 2,
    text: 'Twitter',
    isLinked: false,
    type: AccountTypes.Twitter,
    accountData: null,
  },
  {
    id: 3,
    text: 'Website',
    isLinked: false,
    type: AccountTypes.Website,
    accountData: null,
  },
  {
    id: 4,
    text: 'YouTube',
    isLinked: false,
    type: AccountTypes.YouTube,
    accountData: null,
  },
  {
    id: 5,
    text: 'Spotify',
    isLinked: false,
    type: AccountTypes.Spotify,
    accountData: null,
  },
  {
    id: 6,
    text: 'Twitch',
    isLinked: false,
    type: AccountTypes.Twitch,
    accountData: null,
  },
]

export const SocialLinkingContext = React.createContext([])

export const SocialLinkingProvider = ({ children }) => {
  const [sellerAccountData, setSellerAccountData] = useContext(
    SellerAccountDataContext,
  )
  const [socialLinks, setSocialLinks] = useState<Array<any>>(initialSocialLinks)

  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  useEffect(() => {
    const init = async () => {
      if (authorization?.currentUser?.sellerId) {
        const res = await getPublicProfile(authorization?.currentUser?.sellerId)

        try {
          if (res.status === 200 && res.data.success) {
            const profileData = res.data.data
            setSocialLinks(profileData?.socialLinks)
          } else {
            try {
              const spotifyData = sellerAccountData.find(
                (item) => item.platformTitle === 'Spotify',
              )
              const tmpSocialLinks = [...initialSocialLinks]
              if (spotifyData) {
                const tmpSpotify = tmpSocialLinks.find(
                  (item) => item.text === 'Spotify',
                )
                tmpSocialLinks[tmpSpotify.id - 1].accountData =
                  spotifyData.accountData
                tmpSocialLinks[tmpSpotify.id - 1].isLinked = true
              }
              setSocialLinks(tmpSocialLinks)
            } catch (e) {
              setSocialLinks(initialSocialLinks)
            }
          }
        } catch (e) {
          console.log('error in get public profile', e)
        }
      }
    }
    init()
  }, [authorization?.currentUser, sellerAccountData])

  return (
    <SocialLinkingContext.Provider value={[socialLinks, setSocialLinks]}>
      {children}
    </SocialLinkingContext.Provider>
  )
}
