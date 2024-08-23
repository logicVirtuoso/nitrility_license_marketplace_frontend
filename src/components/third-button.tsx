import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'

const StyledButton = styled(Button)(({ theme }) => ({
  background: '#FFF',
  color: theme.palette.grey[800],
  fontSize: '14px',
  fontWeight: '600',
  borderRadius: '8px',
  fontFamily: 'var(--font-semi-bold)',
  '&:hover': {
    background: theme.palette.grey[600],
    color: theme.palette.grey[200],
  },
  display: 'flex',
  height: '42px',
  textTransform: 'initial',
  whiteSpace: 'nowrap',
  '&:disabled': {
    color: theme.palette.grey[900],
    background: theme.palette.success.light,
    opacity: 0.4,
  },
}))

const ThridButton = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>
}

export default ThridButton
