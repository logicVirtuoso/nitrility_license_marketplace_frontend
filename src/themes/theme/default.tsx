// ==============================|| PRESET THEME - DEFAULT ||============================== //

const Default = (colors) => {
  const { blue, red, yellow, cyan, green, grey } = colors
  const contrastText = '#fff'

  return {
    primary: {
      lighter: blue[50],
      100: blue[100],
      200: blue[200],
      light: blue[300],
      400: blue[400],
      main: blue[500],
      dark: blue[600],
      700: blue[700],
      darker: blue[800],
      900: blue[900],
      contrastText,
    },
    secondary: {
      lighter: 'rgb(247, 247, 247)',
      100: grey[100],
      200: grey[200],
      light: grey[300],
      400: grey[400],
      main: grey[500],
      600: grey[600],
      dark: grey[700],
      800: grey[800],
      darker: grey[900],
      A100: grey.A100,
      A200: grey.A200,
      A300: grey.A400,
      A700: grey.A700,
      contrastText: '#000',
    },
    error: {
      lighter: red[100],
      light: red[200],
      main: red[400],
      dark: red[700],
      darker: red[900],
      contrastText,
    },
    warning: {
      lighter: yellow[100],
      light: yellow[300],
      main: yellow[500],
      dark: yellow[700],
      darker: yellow[900],
      contrastText: green[100],
    },
    info: {
      lighter: cyan[100],
      light: cyan[300],
      main: cyan[500],
      dark: cyan[700],
      darker: cyan[900],
      contrastText,
    },
    success: {
      lighter: green[100],
      light: green[300],
      main: green[500],
      dark: green[700],
      darker: green[900],
      contrastText,
    },
    grey: grey,
    green: green,
  }
}

export default Default
