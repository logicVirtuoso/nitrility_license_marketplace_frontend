import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'

const CustomSecondaryButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  background: theme.palette.grey[600],
  color: theme.palette.text.secondary,
  height: 42,
  minHeight: 37,
  minWidth: 40,
  textTransform: 'initial',
  whiteSpace: 'nowrap',
  borderRadius: '8px',
  fontFamily: 'var(--font-base)',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '18px',
  '&:hover': {
    background: theme.palette.secondary[400],
  },
  '&:disabled': {
    color: theme.palette.text.disabled,
  },
}))

const SecondaryButton = ({ children, ...props }) => {
  return <CustomSecondaryButton {...props}>{children}</CustomSecondaryButton>
}

export default SecondaryButton
