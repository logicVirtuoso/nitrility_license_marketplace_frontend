import React, { useContext } from 'react'
import LeftSideBar from '../leftSideBar'
import Navbar from '../navbar'
import { Box, useTheme } from '@mui/material'
import { SearchFiltersContext } from 'src/context/searchFilters'
import { GlobalMusicContext } from 'src/context/globalMusic'
import Footer from '../footer'
import { SearchFilterIF } from 'interface'

interface PageLayoutProps {
  children: React.ReactElement
}

export default function PageLayout({ children }: PageLayoutProps) {
  const theme = useTheme()

  const [searchParameters, setSearchParameters] =
    useContext(SearchFiltersContext)

  const { globalMusic, setGlobalMusic } = useContext(GlobalMusicContext)

  const filterHandler = (val: SearchFilterIF) => {
    setSearchParameters(val)
  }

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        pb: globalMusic?.licenseName ? '90px' : '0px',
      }}
      bgcolor={theme.palette.background.paper}
    >
      <LeftSideBar filterHandler={filterHandler} />
      <Box
        display={'flex'}
        flexDirection={'column'}
        position={'relative'}
        width={'calc(100% - 240px)'}
      >
        {children}
        <Box mt={'auto'}>
          <Footer />
        </Box>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '240px',
          display: 'flex',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: 'calc(100% - 240px)',
        }}
      >
        <Box
          sx={{
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            padding: '32px 0px 32px 0px',
          }}
          className="container"
        >
          <Navbar />
        </Box>
      </Box>
    </Box>
  )
}
