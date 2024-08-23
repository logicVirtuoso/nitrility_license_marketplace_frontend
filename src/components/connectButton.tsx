import {
  Box,
  Button,
  CardMedia,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import LogoutIcon from '@mui/icons-material/Logout'
import LoginIcon from '@mui/icons-material/Login'
import useAuth from 'src/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import StyledButton from './styledButton'
import SecondaryButton from './buttons/secondary-button'
import LoginDarkIcon from 'src/assets/images/login_dark.png'

interface AuthButtonIF {
  loading: boolean
  setLoading: (boolean) => void
}

export default function AuthButton({ loading, setLoading }: AuthButtonIF) {
  const theme = useTheme()
  const { signIn, signOut } = useAuth()

  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  const loginHandler = async () => {
    setLoading(true)
    if (!authorization?.loggedIn) {
      await signIn()
    } else {
      await signOut()
    }
    setLoading(false)
  }

  return (
    <SecondaryButton
      disabled={loading}
      onClick={loginHandler}
      sx={{
        backgroundColor: `#FFFFFF1A`,
        width: 70,
        height: 40,
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight={700}
        color={theme.palette.text.primary}
      >
        {authorization?.loggedIn ? 'Logout' : 'Login'}
      </Typography>
    </SecondaryButton>
  )
}
