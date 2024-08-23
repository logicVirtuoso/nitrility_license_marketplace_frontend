import { Slider, styled } from '@mui/material'

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)'

const IOSSlider = styled(Slider)(({ theme }) => ({
  color: `${theme.palette.secondary.darker}`,
  height: 6,
  marginLeft: '4px',
  padding: 0,
  '& .MuiSlider-thumb': {
    backgroundColor: `${theme.palette.secondary.darker}`,
    boxShadow: iOSBoxShadow,
  },
  '& .MuiSlider-thumb:before': {
    backgroundColor: `${theme.palette.secondary.darker}`,
    width: 6,
    height: 6,
  },
  '& .MuiSlider-thumbColorPrimary': {
    border: 'none',
    width: 6,
    height: 6,
  },
  '& .MuiSlider-valueLabel': {
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: 'unset',
    color: theme.palette.text.primary,
    '&:before': {
      display: 'none',
    },
    '& *': {
      background: 'transparent',
      color: '#000',
    },
  },
  '& .MuiSlider-track': {
    border: 'none',
    height: 6,
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: '#bfbfbf',
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    '&.MuiSlider-markActive': {
      opacity: 1,
      backgroundColor: 'currentColor',
    },
  },
}))

export default IOSSlider
