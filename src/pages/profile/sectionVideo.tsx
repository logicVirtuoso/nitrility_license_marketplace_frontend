import { useTheme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/material'
import StyledIconButton from '../../components/styledIconButton'
import CloseIcon from '@mui/icons-material/Close'
import CardMedia from '@mui/material/CardMedia'

const useStyles = makeStyles({
  root: {
    position: 'relative',
    marginTop: '-20px',
    padding: '10px 0px',
    borderRadius: '10px',
  },
  checkBox: {
    position: 'absolute !important' as any,
    right: '0px',
    top: '0px',
  },
})

interface SectionVideoProps {
  videoSrc: string
  showCloseButton: boolean
  handleChange: () => void
}

export const SectionVideo = ({
  videoSrc,
  showCloseButton,
  handleChange,
}: SectionVideoProps) => {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <Box className={classes.root}>
      <CardMedia
        component="video"
        autoPlay={false}
        controls
        src={videoSrc}
        sx={{ borderRadius: '10px' }}
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
          onClick={() => handleChange()}
        >
          <CloseIcon />
        </StyledIconButton>
      )}
    </Box>
  )
}
