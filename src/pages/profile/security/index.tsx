import { Box, Button, Divider, Typography } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useContext, useEffect, useState } from 'react'
import { MenuProps, totalPlatforms } from '../../../config'
import OutlinedInput from '@mui/material/OutlinedInput'
import { useTheme } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import { ContainerFluid } from '../style'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getCurrentAccount } from '../../../api'
import SecondaryButton from 'src/components/buttons/secondary-button'
import { GlobalMusicContext } from 'src/context/globalMusic'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import { toast } from 'react-hot-toast'
import { AuthType } from 'src/store/reducers/authorizationReducer'

export default function ProfileSecurityPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { globalMusic, setGlobalMusic } = useContext(GlobalMusicContext)

  const [mediaName, setMediaName] = useState<string>(totalPlatforms[0])
  const [currentAccount, setCurrentAccount] = useState<any>(null)

  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  const mediaHandler = async (event: SelectChangeEvent<typeof mediaName>) => {
    const {
      target: { value },
    } = event
    setMediaName(value)
  }

  useEffect(() => {
    const init = async () => {
      const toastLoading = toast.loading('Loading...')
      try {
        const { success, data, msg } = await getCurrentAccount(
          mediaName,
          authorization?.currentUser?.accountAddress,
        )
        if (success) {
          setCurrentAccount(data)
          toast.success('Loaded Successfully', { id: toastLoading })
        } else {
          setCurrentAccount(null)
          toast.error(msg)
        }
      } catch (e) {
        console.log('error in searching accounts', e)
        toast.error(e.message, { id: toastLoading })
      }
    }
    init()
  }, [mediaName, authorization?.currentUser?.accountAddress])

  return (
    <ContainerFluid
      sx={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Select
          value={mediaName}
          onChange={mediaHandler}
          input={<OutlinedInput sx={{ width: '80%', marginLeft: 'auto' }} />}
          renderValue={(selected) => {
            return selected
          }}
          MenuProps={MenuProps}
          inputProps={{ 'aria-label': 'Without label' }}
          sx={{
            width: '300px',
            backgroundColor: '#fff',
          }}
        >
          {totalPlatforms.map((platform, idx) => (
            <MenuItem key={idx} value={platform}>
              {`${platform}`}
            </MenuItem>
          ))}
        </Select>

        {currentAccount && currentAccount.length > 0 ? (
          currentAccount.map((current, idx) => {
            return (
              <Box sx={{ py: 2 }} key={idx}>
                <Typography variant="h5" component="span">
                  @{current?.account}
                </Typography>

                <Typography variant="h5" sx={{ py: 2 }}>{`${
                  current?.accounts?.length
                } Account${
                  current?.accounts?.length === 1 ? '' : 's'
                } Using This Account`}</Typography>

                <Divider />
                <Box
                  sx={{
                    mt: 3,
                    backgroundColor: '#fff',
                    borderRadius: '6px',
                  }}
                >
                  <Typography align="center" variant="h4">
                    Wallet IDs
                  </Typography>
                  <Box
                    sx={{
                      py: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                    }}
                  >
                    {current?.accounts.map((item, cIdx) => {
                      return (
                        <Typography
                          sx={{ padding: '4px' }}
                          key={cIdx}
                          variant="h6"
                        >
                          {item.accountAddress}
                        </Typography>
                      )
                    })}
                  </Box>

                  <Typography sx={{ padding: '4px' }} align="center">
                    If Anything Looks Suspicious Consider Changing the Password
                    of This Spotify Account
                  </Typography>
                </Box>
              </Box>
            )
          })
        ) : (
          <Box
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}
            gap={2}
          >
            <PersonOffIcon sx={{ fontSize: 64 }} />
            <Typography variant="h6" align="center">
              There is no duplicated account
            </Typography>
          </Box>
        )}
        <Box display={'flex'} width={'100%'}>
          <SecondaryButton sx={{ ml: 'auto' }} onClick={() => navigate(-1)}>
            Back
          </SecondaryButton>
        </Box>
      </Box>
    </ContainerFluid>
  )
}
