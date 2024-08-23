import React, { useEffect } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { ThemeProvider, createTheme, ThemeOptions } from '@mui/material/styles'
import { color as ThemeColor } from './default'
import { StyledEngineProvider } from '@mui/material/styles'

export const ThemeContext = React.createContext({
  toggleColorMode: () => {},
})

type MyThemeProviderProps = {
  children?: React.ReactNode
}

export default function MyThemeProvider(props: MyThemeProviderProps) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const [mode, setMode] = React.useState<'light' | 'dark'>(
    prefersDarkMode ? 'dark' : 'light',
  )

  useEffect(() => {
    setMode(prefersDarkMode ? 'dark' : 'light')
  }, [prefersDarkMode])

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      },
    }),
    [],
  )

  const theme = React.useMemo(
    () => createTheme(ThemeColor[mode] as ThemeOptions),
    [mode],
  )

  return (
    <StyledEngineProvider>
      <ThemeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <GlobalStyles styles={{}} />
          <CssBaseline enableColorScheme />
          {props.children}
        </ThemeProvider>
      </ThemeContext.Provider>
    </StyledEngineProvider>
  )
}
