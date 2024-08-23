import { OutlinedInput, TextField, styled } from '@mui/material'

export const StyledOutlinedInputFC = styled(OutlinedInput)(({ theme }) => ({
  borderRadius: '8px',
  height: 42,
  color: theme.palette.grey[200],
  backgroundColor: theme.palette.grey[600],
  '& fieldset': { border: 'none' },
  '&::placeholder': {
    fontSize: '14px',
    color: theme.palette.grey[500],
  },
  '& .MuiOutlinedInput-input': {
    fontSize: '14px',
  },
}))

export const StyledSelectFC = styled(TextField)(({ theme }) => ({
  borderRadius: '8px',
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.grey[600],
  fontSize: '14px',
  '& .MuiOutlinedInput-root': {
    color: theme.palette.text.secondary,
    borderRadius: '8px',
    height: 42,
  },
  '& .MuiOutlinedInput-input': {
    fontSize: '14px',
    color: theme.palette.text.secondary,
  },
  width: '100%',
  '& fieldset': { border: 'none' },
  '&::placeholder': {
    fontSize: '14px',
    color: theme.palette.grey[500],
  },
}))

export const StyledTextAreaFC = styled(OutlinedInput)(({ theme }) => ({
  borderRadius: '8px',
  minHeight: 100,
  alignItems: 'flex-start',
  '& fieldset': { border: 'none' },
  fontSize: '14px',
  color: theme.palette.grey[200],
  backgroundColor: theme.palette.grey[600],
}))
