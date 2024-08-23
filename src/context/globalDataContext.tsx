import React, { useEffect, useState } from 'react'
import { TAB_KEY } from 'src/config'
import { TabTypes } from 'src/interface'

export const GlobalDataContext = React.createContext([])

interface GlobalDataIF {
  signing: boolean
  profileTabValue: TabTypes
}

export const GlobalDataProvider = ({ children }) => {
  const [globalData, setGlobalData] = useState<GlobalDataIF>({
    signing: false,
    profileTabValue: TabTypes.Activity,
  })

  useEffect(() => {
    localStorage.setItem(TAB_KEY, globalData.profileTabValue.toString())
  }, [globalData.profileTabValue])

  useEffect(() => {
    const tabValue = localStorage.getItem(TAB_KEY)
    if (tabValue) {
      setGlobalData((prev) => ({
        ...prev,
        profileTabValue: Number(tabValue) as unknown as TabTypes,
      }))
    } else {
      setGlobalData((prev) => ({
        ...prev,
        profileTabValue: TabTypes.Activity,
      }))
    }
  }, [])

  return (
    <GlobalDataContext.Provider value={[globalData, setGlobalData]}>
      {children}
    </GlobalDataContext.Provider>
  )
}
