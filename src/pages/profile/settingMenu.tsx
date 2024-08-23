import * as React from 'react'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Settings from '@mui/icons-material/Settings'
import OpenWithIcon from '@mui/icons-material/OpenWith'
import { Typography } from '@mui/material'
import Input from '@mui/material/Input'
import { makeStyles } from '@mui/styles'
import { Theme } from '@mui/material/styles'
import { SizeTypes } from '../../config'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'space-between',
    marginTop: '30px',
    marginBottom: '20px',
  },
}))

interface SettingMenuProps {
  initialSectionName?: string
  isSettingExisted: boolean
  settingHandler?: (sizeType: SizeTypes) => void
  sectionNameHandler: (string) => void
}

export default function SettingMenu({
  initialSectionName,
  isSettingExisted,
  settingHandler,
  sectionNameHandler,
}: SettingMenuProps) {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [sectionName, setSectionName] = React.useState<string>(
    initialSectionName ? initialSectionName : 'Section Name',
  )
  const [showEditableText, setShowEditableText] = React.useState<boolean>(false)

  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const inputHandler = (val: string) => {
    setSectionName(val)
    sectionNameHandler(val)
  }

  return (
    <React.Fragment>
      <Box className={classes.root}>
        <Box display="flex" alignItems="center">
          <IconButton sx={{ cursor: 'move' }}>
            <OpenWithIcon />
          </IconButton>

          {!showEditableText ? (
            <Typography variant="h4" onClick={() => setShowEditableText(true)}>
              {sectionName}
            </Typography>
          ) : (
            <Input
              placeholder="Placeholder"
              autoFocus
              onBlur={() => setShowEditableText(false)}
              onChange={(e) => inputHandler(e.target.value)}
            />
          )}
        </Box>
        {isSettingExisted && (
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Settings />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      {isSettingExisted && (
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem
            onClick={() => {
              settingHandler(SizeTypes.Small)
              setAnchorEl(null)
            }}
          >
            Small
          </MenuItem>
          <MenuItem
            onClick={() => {
              settingHandler(SizeTypes.Medium)
              setAnchorEl(null)
            }}
          >
            Medium
          </MenuItem>
          <MenuItem
            onClick={() => {
              settingHandler(SizeTypes.Large)
              setAnchorEl(null)
            }}
          >
            Large
          </MenuItem>
        </Menu>
      )}
    </React.Fragment>
  )
}
