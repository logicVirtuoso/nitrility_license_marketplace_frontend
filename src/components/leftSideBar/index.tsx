import { Box, Divider, useTheme } from '@mui/material'
import Application from './menu-items'
import Logo from './logo'
import SearchFiltersFC from './searchFilters'
import Recent from './recent'
import Library from './library'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { useContext } from 'react'
import { SearchFiltersContext } from 'src/context/searchFilters'

interface LeftSideBarIF {
  filterHandler: (SearchFilterIF) => void
}

export default function LeftSideBar({ filterHandler }: LeftSideBarIF) {
  const theme = useTheme()

  const location = useLocation()
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const [searchFilters, setSearchFilters] = useContext(SearchFiltersContext)

  return (
    <Box
      sx={{
        minWidth: '240px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 12px 12px',
        transition: 'all 0.1s ease-in-out 0s',
        minHeight: '100vh',
        zIndex: 100,
        bgcolor: theme.palette.containerPrimary.main,
      }}
    >
      <Box position={'fixed'} top={0}>
        <Logo />
        <Application />
      </Box>

      {location.pathname === '/explore' && searchFilters.showSearchFilter ? (
        <>
          <Divider variant="middle" />
          <SearchFiltersFC handler={filterHandler} />
        </>
      ) : (
        <Box position={'fixed'} bottom={'12px'}>
          <Divider
            sx={{
              width: '240px',
            }}
          />
          <Recent />
          {authorization.loggedIn && (
            <>
              <Divider
                sx={{
                  width: '240px',
                  marginTop: '20px',
                }}
              />
              <Library />
            </>
          )}
        </Box>
      )}
    </Box>
  )
}
