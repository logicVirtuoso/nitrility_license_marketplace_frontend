import TextField from '@mui/material/TextField'
import { Box } from '@mui/material'
import { Theme, useTheme } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import StyledIconButton from '../../components/styledIconButton'
import CloseIcon from '@mui/icons-material/Close'
import { SizeTypes } from '../../config'

interface DescriptionTextFieldProps {
  txt: string
  editMode: boolean
  showCloseButton: boolean
  size?: SizeTypes
  handleChange?: (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => void
  removeItem?: () => void
}

export default function DescriptionTextField({
  txt,
  editMode,
  showCloseButton,
  size,
  handleChange,
  removeItem,
}: DescriptionTextFieldProps) {
  const theme = useTheme()
  return (
    <Box
      sx={{
        display: 'flex',
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '6px',
        position: 'relative',
        height: '100%',
        boxShadow: '1px 2px 9px #c5c2c2',
        margin: !editMode ? '4px 0px 0px 0px' : '4px 10px 0px 4px',
      }}
    >
      <TextField
        value={txt}
        fullWidth
        multiline
        placeholder="Write a description"
        inputProps={{
          maxLength:
            size === SizeTypes.Large
              ? 800
              : size === SizeTypes.Medium
              ? 400
              : 100,
          readOnly: editMode,
        }}
        sx={{
          height: '100%',
          '& .MuiInputBase-root': {
            height: '100%',
            display: 'flex',
            alignItems: 'flex-start',
          },
        }}
        onChange={handleChange}
      />
      {showCloseButton && (
        <StyledIconButton
          variant="contained"
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            padding: 0,
            backgroundColor: theme.palette.secondary.main,
            '&:hover': {
              backgroundColor: theme.palette.secondary.dark,
            },
          }}
          onClick={() => removeItem()}
        >
          <CloseIcon />
        </StyledIconButton>
      )}
    </Box>
  )
}
