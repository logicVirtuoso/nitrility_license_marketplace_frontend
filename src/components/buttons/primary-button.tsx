import { styled } from '@mui/material/styles'
import { Button } from '@mui/material'

const StyledButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  height: '42px',
  textTransform: 'initial',
  whiteSpace: 'nowrap',
  borderRadius: '8px',
  fontFamily: 'var(--font-semi-bold)',
  fontSize: '14px',
  border: `1.5px solid ${theme.palette.grey[600]}`,
  minWidth: '42px',
  '&:hover': {
    background: theme.palette.primary.dark,
  },
  '&:disabled': {
    color: theme.palette.grey[900],
    background: theme.palette.success.light,
    opacity: 0.4,
  },
}))

const PrimaryButton = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>
}

export default PrimaryButton
