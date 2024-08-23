import { styled, alpha } from '@mui/material/styles'
import Menu, { MenuProps } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Box, CardMedia, Grid, Typography, useTheme } from '@mui/material'
import { toast } from 'react-hot-toast'
import RemoveProfileDarkIcon from 'src/assets/images/remove_profile_dark.png'
import TrashDarkIcon from 'src/assets/images/trash_dark.png'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteCollection, removeCollection } from 'src/api'
import DeleteCollectionDlg from './deleteCollectionDlg'
import { useContext, useState } from 'react'
import { PublicProfileContext } from 'src/context/publicProfileContext'

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
    backgroundColor: theme.palette.containerPrimary.main,
    borderRadius: 9,
    border: `1px solid ${theme.palette.grey[600]}`,
    marginTop: theme.spacing(1),
    minWidth: 191,
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

interface Props {
  open: boolean
  anchorEl: null | HTMLElement
  setAnchorEl: (anchor: null | HTMLElement) => void
  handler: () => void
}

export default function CollectionMenu({
  open,
  anchorEl,
  setAnchorEl,
  handler,
}: Props) {
  const theme = useTheme()
  const { publicProfileData, setPublicProfileData } =
    useContext(PublicProfileContext)
  const { collectionId, sellerId } = useParams()

  const handleClose = () => {
    setAnchorEl(null)
  }

  const removeCollectionHandler = async () => {
    setPublicProfileData((prev) => ({
      ...prev,
      collections: prev.collections.map((collection) => {
        if (collection.collectionId == Number(collectionId)) {
          return { ...collection, published: false }
        } else {
          return collection
        }
      }),
    }))
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
      <MenuItem
        onClick={handleClose}
        disableRipple
        sx={{ borderRadius: '8px' }}
      >
        <Box
          display={'flex'}
          alignItems={'center'}
          gap={1}
          onClick={removeCollectionHandler}
        >
          <CardMedia
            image={RemoveProfileDarkIcon}
            component={'img'}
            sx={{ width: 18, height: 18 }}
          />
          <Typography color={theme.palette.grey[200]} fontSize={14}>
            Remove from profile
          </Typography>
        </Box>
      </MenuItem>

      <MenuItem
        onClick={handleClose}
        disableRipple
        sx={{ borderRadius: '8px' }}
      >
        <Box display={'flex'} alignItems={'center'} gap={1} onClick={handler}>
          <CardMedia
            image={TrashDarkIcon}
            component={'img'}
            sx={{ width: 18, height: 18 }}
          />
          <Typography color={'#FFA5A5'} fontSize={14}>
            Delete collection
          </Typography>
        </Box>
      </MenuItem>
    </StyledMenu>
  )
}
