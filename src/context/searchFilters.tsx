import { SearchFilterIF } from 'src/interface'
import React, { useState } from 'react'
import { initialSearchParams } from 'src/hooks/useUtils'

export const SearchFiltersContext = React.createContext([])

export const SearchFilterProvider = ({ children }) => {
  const [searchFilters, setSearchFilters] =
    useState<SearchFilterIF>(initialSearchParams)

  return (
    <SearchFiltersContext.Provider value={[searchFilters, setSearchFilters]}>
      {children}
    </SearchFiltersContext.Provider>
  )
}
