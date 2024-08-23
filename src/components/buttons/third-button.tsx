import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'

const CustomThirdButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  background: theme.palette.secondary.main,
  color: theme.palette.text.secondary,
  height: 35,
  minHeight: 35,
  minWidth: 40,
  textTransform: 'initial',
  whiteSpace: 'nowrap',
  borderRadius: '5px',
  fontWeight: '400',
  fontSize: '14px',
  '&:hover': {
    background: theme.palette.secondary[600],
  },
  '&:disabled': {
    color: theme.palette.text.disabled,
  },
}))

const ThirdButton = ({ children, ...props }) => {
  return <CustomThirdButton {...props}>{children}</CustomThirdButton>
}

export default ThirdButton
