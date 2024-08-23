import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

const CustomWhiteBtn = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'white',
  whiteSpace: 'nowrap',
  padding: '6px 8px',
  borderRadius: '8px',
  outline: 'none',
  color: theme.palette.secondary.dark,
  backgroundColor: theme.palette.grey[200],
  cursor: 'pointer',
  textTransform: 'none',
  fontSize: 14,
  textAlign: 'center',
  fontWeight: 400,
  '&:hover': {
    backgroundColor: theme.palette.grey[300],
  },
  '&:disabled': {
    color: theme.palette.grey[400],
  },
}))

const WhiteBtn = ({ children, ...props }) => {
  return <CustomWhiteBtn {...props}>{children}</CustomWhiteBtn>
}

export default WhiteBtn
