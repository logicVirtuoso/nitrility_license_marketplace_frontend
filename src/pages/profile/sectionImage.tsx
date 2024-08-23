import { styled } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import { Box, useTheme } from '@mui/material'
import StyledIconButton from '../../components/styledIconButton'
import CloseIcon from '@mui/icons-material/Close'

const useStyles = makeStyles({
  root: {
    position: 'relative',
  },
  checkBox: {
    position: 'absolute !important' as any,
    right: '-20px',
    top: '0px',
  },
})

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%',
  display: 'flex',
  margin: 'auto',
  height: '400px',
  objectFit: 'cover',
  borderRadius: '8px',
}))

interface SectionImageProps {
  imageSrc: string
  showCloseButton: boolean
  handleChange?: () => void
}

export const SectionImage = ({
  imageSrc,
  showCloseButton,
  handleChange,
}: SectionImageProps) => {
  const classes = useStyles()
  const theme = useTheme()
  return (
    <Box className={classes.root}>
      <StyledImage src={imageSrc} />
      {showCloseButton && (
        <StyledIconButton
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
          onClick={() => handleChange()}
        >
          <CloseIcon sx={{ color: 'white' }} />
        </StyledIconButton>
      )}
    </Box>
  )
}
