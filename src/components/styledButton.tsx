import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: '10px',
  color: '#F6F6F6',
  backgroundColor: theme.palette.mode === 'dark' ? 'rgb(72,59,86)' : '#111111',
  border:
    theme.palette.mode === 'dark'
      ? '1px solid rgb(91, 59, 97)'
      : 'rgb(65, 65, 65)',
  gap: 8,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgb(71 53 90)' : '#111111',
  },
  minWidth: 40,
  height: 40,
  '& svg': {
    width: 18,
    height: 18,
  },
  textTransform: 'none',
}))

export default StyledButton
