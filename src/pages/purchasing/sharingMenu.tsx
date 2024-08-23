import { styled, alpha } from '@mui/material/styles'
import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Box, CardMedia, Grid, Typography, useTheme } from '@mui/material'
import logoSvg from '../../assets/images/logo.png'
import faceBookImg from '../../assets/facebook.png'
import twitterImg from '../../assets/twitter.png'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { CLIENT_URL } from '../../config'
import {
  TwitterShareButton,
  FacebookShareButton,
  TelegramShareButton,
} from 'react-share'
import { makeStyles } from '@mui/styles'
import { toast } from 'react-hot-toast'
import TelegramIcon from '@mui/icons-material/Telegram'

const useStyles = makeStyles(() => ({
  shareBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px',
    margin: '4px',
    maxHeight: '29px',
  },
}))

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    '& .MuiMenu-list': {
      padding: '10px',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}))

interface SharingMenuProps {
  sharedURL: string
  open: boolean
  anchorEl: null | HTMLElement
  setAnchorEl: (anchor: null | HTMLElement) => void
}

export default function SharingMenu({
  sharedURL,
  open,
  anchorEl,
  setAnchorEl,
}: SharingMenuProps) {
  const theme = useTheme()
  const classes = useStyles()

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <StyledMenu
      MenuListProps={{
        'aria-labelledby': 'demo-customized-button',
      }}
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
    >
      <CopyToClipboard text={sharedURL}>
        <MenuItem
          onClick={() => {
            toast.success('The sharable link was copied to the clipboard')
            handleClose()
          }}
          disableRipple
          sx={{
            borderRadius: '8px',
            maxHeight: '49px',
          }}
        >
          <Box className={classes.shareBtn} sx={{ padding: '0px !important' }}>
            <CardMedia
              component={'img'}
              image={logoSvg}
              sx={{
                width: '24px',
                height: '24px',
                marginRight: '10px',
                transform: 'scale(2)',
              }}
            />
            <Typography
              sx={{ paddingTop: '5px', color: theme.palette.text.primary }}
            >
              Copy link
            </Typography>
          </Box>
        </MenuItem>
      </CopyToClipboard>

      <MenuItem
        onClick={handleClose}
        disableRipple
        sx={{ borderRadius: '8px' }}
      >
        <FacebookShareButton
          url={sharedURL}
          title="Check out this item on Nitrility"
          className={classes.shareBtn}
        >
          <CardMedia
            component={'img'}
            image={faceBookImg}
            sx={{ width: '24px', marginRight: '10px' }}
          />
          <Typography
            sx={{ paddingTop: '5px', color: theme.palette.text.primary }}
          >
            Share on Facebook
          </Typography>
        </FacebookShareButton>
      </MenuItem>

      <MenuItem
        onClick={handleClose}
        disableRipple
        sx={{ borderRadius: '8px' }}
      >
        <TwitterShareButton
          url={sharedURL}
          title="Check out this item on Nitrility"
          className={classes.shareBtn}
        >
          <CardMedia
            component={'img'}
            image={twitterImg}
            sx={{ width: '24px', marginRight: '10px' }}
          />
          <Typography
            sx={{ paddingTop: '5px', color: theme.palette.text.primary }}
          >
            Share on Twitter
          </Typography>
        </TwitterShareButton>
      </MenuItem>
      <MenuItem
        onClick={handleClose}
        disableRipple
        sx={{ borderRadius: '8px' }}
      >
        <TelegramShareButton
          url={sharedURL}
          title="Check out this item on Nitrility"
          className={classes.shareBtn}
        >
          <TelegramIcon
            sx={{
              width: '24px',
              height: '24px',
              marginRight: '10px',
              borderRadius: '100%',
            }}
          />
          <Typography
            sx={{ paddingTop: '5px', color: theme.palette.text.primary }}
          >
            Share on Telegram
          </Typography>
        </TelegramShareButton>
      </MenuItem>
    </StyledMenu>
  )
}
