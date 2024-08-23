import React from 'react'
import {
  List,
  Box,
  CardMedia,
  ListItemButton,
  Typography,
  ListItemText,
  useTheme,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { useSelector } from 'react-redux'
import useAuth from 'src/hooks/useAuth'
import FavoriteDarkIcon from '../../assets/images/favorite_dark.svg'

export default function Library() {
  const theme = useTheme()
  const navigate = useNavigate()
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const { signIn } = useAuth()

  const goToLikedLicensePage = async () => {
    let success = false
    if (!authorization.loggedIn) {
      const { loggedIn } = await signIn()
      success = loggedIn
    } else {
      success = true
    }
    if (success) navigate(`/liked-licenses`)
  }

  return (
    <React.Fragment>
      <Typography
        sx={{
          fontFamily: 'var(--font-semi-bold)',
          color: theme.palette.text.secondary,
          fontSize: '16px',
          lineHeight: '18px',
          p: '20px',
        }}
      >
        Library
      </Typography>
      <Box sx={{ padding: '0px 8px 2px 8px', marginBottom: '20px' }}>
        <List component="div" disablePadding>
          <ListItemButton
            sx={{ borderRadius: 1, p: '8px 12px' }}
            onClick={goToLikedLicensePage}
          >
            <Box
              bgcolor={theme.palette.primary.main}
              width={40}
              height={40}
              borderRadius={1}
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
            >
              <CardMedia
                component={'img'}
                image={FavoriteDarkIcon}
                sx={{ width: 18, objectFit: 'cover' }}
              />
            </Box>
            <ListItemText primary="Liked Sounds" sx={{ ml: '0.5rem' }} />
          </ListItemButton>
        </List>
      </Box>
    </React.Fragment>
  )
}
