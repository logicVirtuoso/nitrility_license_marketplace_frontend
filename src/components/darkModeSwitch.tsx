import React from 'react'
import { useTheme } from '@mui/material/styles'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import { ThemeContext } from 'src/themes/themeProvider'
import SecondaryButton from './buttons/secondary-button'

const DarkModeSwitch = () => {
  const theme = useTheme()
  const colorMode = React.useContext(ThemeContext)

  return (
    <SecondaryButton onClick={colorMode.toggleColorMode}>
      {theme.palette.mode === 'dark' && (
        <LightModeIcon sx={{ color: 'white' }} />
      )}
      {theme.palette.mode === 'light' && (
        <DarkModeIcon sx={{ color: 'white' }} />
      )}
    </SecondaryButton>
  )
}

export default DarkModeSwitch
