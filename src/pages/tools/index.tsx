import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import jwtDecode from 'jwt-decode'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import SecondaryButton from 'src/components/buttons/secondary-button'
import useAuth from 'src/hooks/useAuth'
import { AuthType } from 'src/store/reducers/authorizationReducer'

const Tools = () => {
  const navigate = useNavigate()
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const { signIn } = useAuth()
  const publicSalesDatabaseHandler = async () => {
    try {
      let payload
      if (!authorization.loggedIn) {
        const { loggedIn, data } = await signIn()
        if (loggedIn) {
          const decodedToken: any = jwtDecode(data.accessToken)
          payload = decodedToken.payload
        }
      }
      const sellerId = authorization.currentUser?.sellerId || payload?.sellerId
      if (sellerId) {
        navigate('/publicsalesdatabase')
      } else {
        toast.error('Only Artist can use this function')
      }
    } catch (e) {
      console.log('error in public slaes database', e)
    }
  }

  return (
    <Box
      sx={{
        bgcolor: 'white',
        width: '50vw',
        height: '50vh',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: 'rgba(0, 0, 0, 0.08) 0px 6px 16px 1px',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <SecondaryButton
          sx={{ mb: 2, textTransform: 'none', width: '170px' }}
          onClick={publicSalesDatabaseHandler}
        >
          Public Sales Database
        </SecondaryButton>
        <SecondaryButton
          sx={{ textTransform: 'none', width: '170px' }}
          onClick={() => {
            navigate('/licensechecker')
          }}
        >
          License Checker
        </SecondaryButton>
      </Box>
    </Box>
  )
}

export default Tools
