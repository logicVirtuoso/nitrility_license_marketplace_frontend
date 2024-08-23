// material-ui
import { createTheme } from '@mui/material/styles'

// third-party
import { colors } from '@mui/material'

// project import
import ThemeOption from './theme'

declare module '@mui/material/styles' {
  interface PaletteColor {
    lighter?: string
    darker?: string
    600?: string
  }
}

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

const Palette = () => {
  const paletteColor = ThemeOption(colors)
  return createTheme({
    palette: {
      common: {
        black: '#000',
        white: '#fff',
      },
      ...paletteColor,
      text: {
        primary: paletteColor.grey[700],
        secondary: paletteColor.grey[500],
        disabled: paletteColor.grey[400],
      },
      action: {
        disabled: paletteColor.grey[300],
      },
      divider: paletteColor.grey[200],
      background: {
        paper: paletteColor.grey[0],
        default: paletteColor.grey.A50,
      },
    },
  })
}

export default Palette
