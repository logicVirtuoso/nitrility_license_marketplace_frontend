import { createTheme } from '@mui/material/styles'
import { Palette, PaletteColor } from '@mui/material/styles'
import { theme as _default } from './default'
import { amber, deepOrange, grey } from '@mui/material/colors'
import { TypographyOptions } from '@mui/material/styles/createTypography'
import MyTypography from './typography'

declare module '@mui/material/styles' {
  interface Palette {
    upvote?: PaletteColor
    downvote?: PaletteColor
    containerPrimary?: PaletteColor
    containerSecondary?: PaletteColor
    pink?: PaletteColor // Add red to the PaletteOptions interface
  }
  interface PaletteOptions {
    upvote?: PaletteColor
    downvote?: PaletteColor
    containerPrimary?: PaletteColor
    containerSecondary?: PaletteColor
    pink?: PaletteColor // Add red to the PaletteOptions interface
  }
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export interface AppTheme {
  dark: {
    palette: DeepPartial<Palette>
    typography: DeepPartial<TypographyOptions>
  }
  light: {
    palette: DeepPartial<Palette>
    typography: DeepPartial<TypographyOptions>
  }
}

const { palette } = createTheme()

const defaultLight = createTheme({
  palette: {
    mode: 'light',
  },
})

const defaultDark = createTheme({
  palette: {
    mode: 'dark',
  },
})

const greyPrimary = {
  50: '#FAFAFA', // smoke00
  100: '#f5f5f5',
  200: '#F1F1F1', // smoke10
  300: '#E1E1E1', // smoke25
  400: '#C1C1C1', // smoke40
  500: '#666666', // smoke50
  600: '#303030', // smoke60
  700: '#1F1F1F', // smoke75
  800: '#111111', // smoke90
  900: '#000000',
  1000: '#C5C5C5',
}

const pinkPrimary = {
  100: '#FFDCF3',
  200: '#FF82FC',
  300: '#F049F4',
  400: '#ec407a',
  500: '#e91e63',
  600: '#d81b60',
  700: '#c2185b',
  800: '#ad1457',
  900: '#8F0056',
}

export const theme: AppTheme = {
  dark: {
    palette: {
      ...defaultDark.palette,
      text: {
        primary: '#fff',
        secondary: '#C1C1C1',
        disabled: '#666666',
      },
      grey: greyPrimary,
      pink: pinkPrimary,
      primary: {
        main: '#e9ff5d',
        light: '#f0ff8e',
        dark: '#a5bd08',
        contrastText: '#111111',
      },
      secondary: {
        main: '#1F1F1F',
        light: '#2f2f2f',
        dark: '#111111',
        contrastText: '#8a8a8a',
      },
      warning: {
        main: '#FFDF35',
        light: '#FFF6A4',
        dark: '#744600',
      },
      error: {
        main: '#FF6C1A',
        light: '#FFD0A5',
        dark: '#961200',
        darker: '#371c19',
      },
      info: {
        main: '#2CA6FF',
        light: '#A0EEFF',
        dark: '#1800A9',
      },
      success: {
        main: '#42CE00',
        light: '#DFFF5D',
        dark: '#007335',
      },
      upvote: palette.augmentColor({
        color: {
          main: '#66bb6a',
          contrastText: 'rgba(0,0,0,0.87)',
        },
      }),
      downvote: palette.augmentColor({
        color: {
          main: '#f44336',
          contrastText: '#fff',
        },
      }),
      containerPrimary: palette.augmentColor({
        color: {
          main: '#191919',
          contrastText: '#FAFAFA',
        },
      }),
      containerSecondary: palette.augmentColor({
        color: {
          main: '#2B2B2B',
          contrastText: '#F6F6F6',
        },
      }),
      background: {
        default: '#000000',
        paper: '#111111',
      },
    },
    typography: MyTypography(),
  },
  light: {
    palette: {
      ...defaultLight.palette,
      text: {
        primary: grey[900],
        secondary: grey[800],
        disabled: grey[400],
      },
      grey: greyPrimary,
      pink: pinkPrimary,
      primary: {
        main: '#e9ff5d',
        light: '#f0ff8e',
        dark: '#a5bd08',
        contrastText: '#111111',
      },
      secondary: {
        main: '#1f1f1f',
        light: '#2f2f2f',
        dark: '#111111',
        contrastText: '#8a8a8a',
      },
      upvote: palette.augmentColor({
        color: {
          main: '#2e7d32',
          contrastText: '#32009a',
        },
      }),
      downvote: palette.augmentColor({
        color: {
          main: '#d32f2f',
          contrastText: '#fff',
        },
      }),
      containerPrimary: palette.augmentColor({
        color: {
          main: '#F6F6F6',
          contrastText: '#black',
        },
      }),
      containerSecondary: palette.augmentColor({
        color: {
          main: '#fff',
          contrastText: '#black',
        },
      }),
      background: {
        default: '#FFFFFF',
        paper: '#F8F8F8',
      },
    },
    typography: MyTypography(),
  },
}

export const color = _default
