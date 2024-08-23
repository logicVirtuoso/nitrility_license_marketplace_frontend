import {
  Box,
  CardMedia,
  Divider,
  Theme,
  Typography,
  useTheme,
} from '@mui/material'
import SecondaryButton from 'src/components/buttons/secondary-button'
import CodeVerification from 'src/components/code-verification'
import SpotifyDarkIcon from 'src/assets/images/settings/spotify_dark.png'
import SpotifyLogin from 'react-spotify-login'
import { useContext, useEffect, useRef, useState } from 'react'
import {
  ACCESS_TOKEN,
  ACCOUNT_SETTING_REDIRECTED_URL,
  GOOGLE_MAP_API_KEY,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_TOKEN,
  SellerAccountType,
  TIME_OUT,
} from 'src/config'
import toast from 'react-hot-toast'
import {
  createSession,
  deleteSellerAccount,
  getSellerMailingInfo,
  reLinkBusinessAcc,
  sendVCodeToSpotifyEmail,
  spotifyLogin,
  spotifyLogout,
  unlinkBusinessAcc,
  updateSellerMailingInfo,
  verifySellerAccount,
} from 'src/api'
import { useDispatch, useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import makeStyles from '@mui/styles/makeStyles'
import { AUTHENTICATED, UNLINKED } from 'src/actions/actionTypes'
import { SellerAccountDataContext } from 'src/context/sellerData'
import VerifiedDarkIcon from 'src/assets/images/verified_dark.svg'
import ReactGoogleAutocomplete, {
  ReactGoogleAutocompleteInputProps,
} from 'react-google-autocomplete'
import PrimaryButton from 'src/components/buttons/primary-button'
import { IdenfyReviewTypes, MailingIF, RoleTypes } from 'src/interface'
import { StyledOutlinedInputFC } from 'src/components/styledInput'
import { updateStore } from 'src/utils/utils'
import BrowserGreyIcon from 'src/assets/images/browser_grey.png'

// Extend the original props with the placeholder prop
interface CustomGoogleAutocompleteProps
  extends ReactGoogleAutocompleteInputProps {
  placeholder: string
}

const CustomGoogleAutocomplete: React.FC<CustomGoogleAutocompleteProps> = (
  props,
) => {
  return <ReactGoogleAutocomplete {...props} />
}

const useStyles = makeStyles((theme: Theme) => ({
  spotifyLoginBtn: {
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.secondary.main,
    color: theme.palette.text.primary,
    height: 42,
    minHeight: 40,
    minWidth: 206,
    textTransform: 'initial',
    whiteSpace: 'nowrap',
    borderRadius: '10px',
    fontFamily: 'var(--font-semi-bold)',
    fontSize: '16px',
    cursor: 'pointer',
    border: `1.5px solid ${theme.palette.grey[600]}`,
    '&:hover': {
      background: theme.palette.secondary.dark,
    },
    '&:disabled': {
      color: theme.palette.text.disabled,
      background: theme.palette.secondary.light,
    },
  },
}))

export default function SellerProfileSetting() {
  const classes = useStyles()
  const theme = useTheme()
  const dispatch = useDispatch()

  const randomState = Math.random().toString(36).substring(7)
  const [startedTime, setStartedTime] = useState<number | undefined>(0)
  const [authenticating, setAuthenticating] = useState<boolean>(false)
  const [spotifyData, setSpotifyData] = useState<any>()
  const [spotifyToken, setSpotifyToken] = useState(null)
  const [spotifyEmail, setSpotifyEmail] = useState<string>()
  const [verificationCode, setVerificationCode] = useState<string>('')
  const [sellerMailingInfo, setSellerMailingInfo] = useState<MailingIF>({
    mail: '',
    mailingAddress: '',
  })
  const infoRef = useRef(sellerMailingInfo)

  useEffect(() => {
    infoRef.current = sellerMailingInfo
  }, [sellerMailingInfo])

  const [verifying, setVerifying] = useState<boolean>(false)

  const [sellerAccountData, setSellerAccountData] = useContext(
    SellerAccountDataContext,
  )
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  const unLinkBusinessHandler = async (idenfy) => {
    const tLoading = toast.loading('Unlinking your business account...')
    const { success, accessToken } = await unlinkBusinessAcc(
      authorization.currentUser.accountAddress,
      idenfy,
    )
    // update the store
    updateStore(AUTHENTICATED, accessToken)
    if (success) {
      toast.success('Unlinked Successfully', { id: tLoading })
    } else {
      toast.error('Something went wrong', { id: tLoading })
    }
  }

  const reLinkBusinessHandler = async (idenfy) => {
    const tLoading = toast.loading('Relinking your business account...')
    const { success, idenfyUrl } = await reLinkBusinessAcc(
      authorization.currentUser.accountAddress,
      idenfy,
    )
    if (success) {
      window.open(idenfyUrl, '_blank', 'noreferrer')
      toast.success('Please submit your company information', {
        id: tLoading,
      })
    } else {
      toast.error('Something went wrong', { id: tLoading })
    }
  }

  const verificationCodeHandler = async (val: string) => {
    setVerificationCode(val)
    if (val.length === 6) {
      setVerifying(true)
      const toastLoading = toast.loading('Verifying the code...')
      try {
        const res = await verifySellerAccount(
          authorization.currentUser.accountAddress,
          val,
        )
        if (res.status === 200 && res.data.success) {
          updateStore(AUTHENTICATED, res.data.data.accessToken)
          toast.success(res.data.msg, { id: toastLoading })
        } else {
          setVerificationCode('')
          toast.error(res.data.msg, { id: toastLoading })
        }
      } catch (e) {
        setVerificationCode('')
        toast.error(
          'Something went wrong, Please make sure if your account is artist account',
          { id: toastLoading },
        )
      }
      setVerifying(false)
      setAuthenticating(false)
    }
  }

  const signInHandler = async (token: string) => {
    if (token && token !== '') {
      window.localStorage.setItem(SPOTIFY_TOKEN, token)
      setSpotifyToken(token)
      const toastSpotifyLogin = toast.loading('Authenticating via Spotify...')
      try {
        const userRes = await spotifyLogin(token)
        toast.success('Successfully authenticated!', {
          id: toastSpotifyLogin,
        })
        if (userRes?.data) {
          const associatedEmail = userRes?.data?.email
          setSpotifyEmail(associatedEmail)
          const toastChecking = toast.loading('Checking if you are artist...')
          try {
            const res = await sendVCodeToSpotifyEmail(
              authorization.currentUser.accountAddress,
              userRes?.data,
            )
            if (res.status === 200 && res.data.success) {
              setAuthenticating(true)
              toast.success(res.data.msg, { id: toastChecking })
            } else {
              toast.error(res.data.msg, { id: toastChecking })
            }
          } catch (e) {
            toast.error('Something went wrong. Please try again', {
              id: toastChecking,
            })
          }
        } else {
          console.log('spotify sign in error')
          toast.error('Something went wrong. Please try again')
        }
      } catch (e) {
        console.log('Error in Spotify Login', e)
        toast.error(e.message, {
          id: toastSpotifyLogin,
        })
      }
    } else {
      toast.error('Invalid token. Please try again')
    }
  }

  const onFailure = (response) => console.log(response)

  const onSuccess = (response) => {
    const endTime = Date.now()
    if (endTime > startedTime + TIME_OUT) {
      toast.error('Your token is expired. Please try again')
    } else {
      signInHandler(response.access_token)
    }
  }

  useEffect(() => {
    setSpotifyData(
      sellerAccountData.find(
        (accountData) =>
          accountData.platformTitle === SellerAccountType.Spotify,
      ),
    )
  }, [sellerAccountData])

  const deleteHandler = async (title) => {
    const wallet = authorization.currentUser.accountAddress
    const toastLoading = toast.loading('DeLinking this account...')
    if (wallet) {
      try {
        const { success, data, msg } = await deleteSellerAccount(title, wallet)
        if (success) {
          toast.success(msg, { id: toastLoading })
          setSellerAccountData(data.sellerPlatforms)
          const ls = window.localStorage.getItem(ACCESS_TOKEN)
          updateStore(UNLINKED, ls)
          dispatch({ type: UNLINKED })
        } else {
          toast.error(msg, { id: toastLoading })
        }
      } catch (e) {
        toast.error(e.message, { id: toastLoading })
      }
    } else {
      toast.error('Something went wrong', { id: toastLoading })
    }
  }

  const verifyBusinessAccount = async (role: RoleTypes) => {
    const tLoading = toast.loading('Creating verification link...')
    const { success, idenfyUrl } = await createSession(
      authorization.currentUser.accountAddress,
      role,
    )
    if (success) {
      window.open(idenfyUrl, '_blank', 'noreferrer')
      toast.success('Please submit your company information', {
        id: tLoading,
      })
    } else {
      toast.error('Something went wrong', { id: tLoading })
    }
  }

  useEffect(() => {
    getSellerMailingInfo().then(({ data }) => {
      setSellerMailingInfo(data)
    })
  }, [])

  const updateMailingInfo = async (newMailingInfo: Partial<MailingIF>) => {
    setSellerMailingInfo(() => ({ ...infoRef.current, ...newMailingInfo }))
    await updateSellerMailingInfo({ ...infoRef.current, ...newMailingInfo })
  }

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      bgcolor={theme.palette.secondary.main}
      borderRadius={3}
      p={2}
    >
      <Box display={'flex'} flexDirection={'column'}>
        <Typography
          color={theme.palette.text.primary}
          fontFamily={'var(--font-semi-bold)'}
          fontSize={'18px'}
        >
          Set up a seller profile
        </Typography>
        <Typography
          color={theme.palette.text.secondary}
          fontFamily={'var(--font-base)'}
          fontSize={'14px'}
          mt={1}
        >
          Start selling licenses by syncing your artist account to Nitrility
        </Typography>
      </Box>

      <Divider />

      <Box display={'flex'} flexDirection={'column'} gap={2} py={2}>
        <Box display={'flex'} flexDirection={'column'}>
          <Typography
            color={theme.palette.text.primary}
            fontFamily={'var(--font-semi-bold)'}
            fontSize={'18px'}
          >
            {spotifyData?.sellerId ? 'Your Spotify account' : 'Spotify'}
          </Typography>
          <Typography
            color={theme.palette.text.secondary}
            fontFamily={'var(--font-base)'}
            fontSize={'14px'}
            mt={1}
          >
            {spotifyData?.sellerId
              ? 'View your linked Spotify artist account'
              : 'Link your Spotify artist account'}
          </Typography>
        </Box>

        <Box display={'flex'} flexDirection={'column'} gap={2}>
          <Box display={'flex'} alignItems={'center'} gap={2}>
            <SpotifyLogin
              clientId={SPOTIFY_CLIENT_ID}
              redirectUri={`${ACCOUNT_SETTING_REDIRECTED_URL}&state=${encodeURIComponent(
                randomState,
              )}`}
              scope="user-read-email"
              onSuccess={onSuccess}
              onFailure={onFailure}
              className={classes.spotifyLoginBtn}
              onRequest={() => {
                setStartedTime(Date.now())
              }}
            >
              <CardMedia
                component={'img'}
                image={SpotifyDarkIcon}
                sx={{
                  width: 24,
                  height: 24,
                  mr: 1.5,
                }}
              />
              <Typography align="center">Connect to Spotify</Typography>
            </SpotifyLogin>

            {spotifyToken && (
              <SecondaryButton
                onClick={() => {
                  spotifyLogout()
                  setSpotifyToken(null)
                }}
                sx={{ width: '95px', marginLeft: '10px' }}
              >
                Log out
              </SecondaryButton>
            )}

            {spotifyData?.sellerId ? (
              <Typography
                sx={{
                  fontSize: '12px',
                  color: theme.palette.grey[500],
                }}
              >
                You’ve connected an artist account already
              </Typography>
            ) : (
              <>
                {authenticating && (
                  <Box display={'flex'} flexDirection={'column'}>
                    <Typography>You’re almost there.</Typography>
                    <Typography>Verify to connect your account!</Typography>
                  </Box>
                )}
              </>
            )}
          </Box>

          {authenticating && (
            <Box
              display={'flex'}
              flexDirection={'column'}
              alignItems={'flex-start'}
              gap={2}
            >
              <Typography
                color={theme.palette.text.primary}
                fontFamily={'var(--font-semi-bold)'}
                fontSize={'18px'}
              >
                Verify your account
              </Typography>
              <Typography
                color={theme.palette.text.secondary}
                fontFamily={'var(--font-base)'}
                fontSize={'14px'}
                mt={1}
              >
                Check the email you used to sign up for Spotify
              </Typography>

              <CodeVerification
                verificationCode={verificationCode}
                handler={verificationCodeHandler}
              />

              <Box display={'flex'} gap={0.5}>
                <Typography
                  color={theme.palette.text.secondary}
                  fontFamily={'var(--font-base)'}
                  fontSize={'14px'}
                  mt={1}
                  component={'span'}
                >
                  Didn’t receive an email?
                </Typography>
                <Typography
                  color={theme.palette.text.secondary}
                  fontFamily={'var(--font-base)'}
                  fontSize={'14px'}
                  mt={1}
                  component={'span'}
                >
                  Resend code.
                </Typography>
              </Box>
            </Box>
          )}

          {spotifyData?.sellerId && (
            <Box
              display={'flex'}
              flexDirection={'column'}
              gap={2}
              p={2}
              bgcolor={theme.palette.grey[600]}
              maxWidth={360}
              borderRadius={2.5}
            >
              <Box display={'flex'} alignItems={'center'} gap={2}>
                <CardMedia
                  component={'img'}
                  image={spotifyData?.accountData?.avatarPath}
                  sx={{
                    width: '100%',
                    maxWidth: 80,
                    objectFit: 'cover',
                    borderRadius: '100%',
                  }}
                />

                <Box display={'flex'} flexDirection={'column'} gap={1}>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-semi-bold)',
                      fontSize: '16px',
                      color: theme.palette.text.primary,
                    }}
                  >
                    {spotifyData?.accountData?.sellerName}
                  </Typography>
                  <Box display={'flex'} alignItems={'center'} gap={0.5}>
                    <CardMedia
                      component={'img'}
                      image={VerifiedDarkIcon}
                      sx={{ width: 12, objectFit: 'cover' }}
                    />
                    <Typography
                      variant="body2"
                      color={theme.palette.text.secondary}
                    >
                      Verified artist on Spotify
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <SecondaryButton
                sx={{
                  backgroundColor: theme.palette.error.darker,
                  maxWidth: 156,
                }}
                onClick={() => deleteHandler(spotifyData.platformTitle)}
              >
                <Typography
                  sx={{
                    fontSize: '14px',
                  }}
                >
                  Disconnect account
                </Typography>
              </SecondaryButton>
            </Box>
          )}
        </Box>
      </Box>

      {spotifyData?.sellerId && (
        <>
          <Divider />

          <Box display={'flex'} flexDirection={'column'} gap={0.5} py={3}>
            <Typography
              color={theme.palette.text.primary}
              fontFamily={'var(--font-semi-bold)'}
              fontSize={'18px'}
            >
              Personal Information Associated with Sales (Required)
            </Typography>
            <Box display="flex" flexDirection={'column'} gap={0.5} pt={1.5}>
              <Typography color={theme.palette.text.secondary} fontSize={12}>
                Personal Email Address - Shown on License Details
              </Typography>
              <Box
                display={'flex'}
                alignItems={'center'}
                gap={2}
                maxWidth={370}
              >
                <StyledOutlinedInputFC
                  fullWidth
                  type="email"
                  name="mail"
                  value={sellerMailingInfo.mail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    updateMailingInfo({
                      mail: e.target.value,
                    })
                  }}
                  placeholder="Enter Public Email Address"
                />
              </Box>
            </Box>

            <Box display="flex" flexDirection={'column'} gap={0.5} pt={1.5}>
              <Typography color={theme.palette.text.secondary} fontSize={12}>
                Personal Mailing Address - Shown on License Details
              </Typography>
              <Box
                display={'flex'}
                alignItems={'center'}
                gap={2}
                maxWidth={370}
              >
                <CustomGoogleAutocomplete
                  placeholder="Enter Public Mailing Address"
                  apiKey={GOOGLE_MAP_API_KEY}
                  onPlaceSelected={(place) => {
                    updateMailingInfo({
                      mailingAddress: place.formatted_address,
                    })
                  }}
                  defaultValue={sellerMailingInfo.mailingAddress}
                />
              </Box>
            </Box>
          </Box>

          <Divider />

          <Box display={'flex'} flexDirection={'column'} gap={2} py={3}>
            <Box display={'flex'} flexDirection={'column'} gap={0.5}>
              <Typography
                color={theme.palette.text.primary}
                fontFamily={'var(--font-semi-bold)'}
                fontSize={16}
              >
                Company Information Associated with Sales
              </Typography>

              {(!authorization?.currentUser?.idenfies?.seller ||
                authorization?.currentUser?.idenfies?.seller?.length == 0) && (
                <Typography color={theme.palette.text.secondary} fontSize={14}>
                  If you intend on selling licenses under a company verify your
                  business below
                </Typography>
              )}
            </Box>

            <Box display={'flex'} flexDirection={'column'} gap={2}>
              {authorization?.currentUser?.idenfies?.seller?.map(
                (idenfy, idx) => {
                  return (
                    <Box
                      key={idx}
                      display={'flex'}
                      flexDirection={'column'}
                      maxWidth={360}
                      bgcolor={theme.palette.grey[600]}
                      borderRadius={2.5}
                    >
                      <Box
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                        p={1.5}
                      >
                        <Typography
                          fontWeight={600}
                          fontSize={16}
                          color={theme.palette.text.primary}
                          whiteSpace={'nowrap'}
                          textOverflow={'ellipsis'}
                          overflow={'hidden'}
                        >
                          {`${
                            idenfy?.status === IdenfyReviewTypes.Pending
                              ? 'Under the review'
                              : idenfy?.companyName
                          }`}
                        </Typography>

                        <CardMedia
                          component={'img'}
                          image={BrowserGreyIcon}
                          sx={{
                            width: 18,
                            height: 18,
                          }}
                        />
                      </Box>

                      <Divider />

                      <Box
                        p={1.5}
                        display={'flex'}
                        flexDirection={'column'}
                        gap={2}
                      >
                        <Box>
                          <Typography
                            fontSize={12}
                            fontWeight={400}
                            color={theme.palette.text.secondary}
                          >
                            Location
                          </Typography>
                          <Typography
                            fontSize={14}
                            fontWeight={400}
                            color={theme.palette.grey[200]}
                          >
                            US - United States of America
                          </Typography>
                        </Box>

                        <Box>
                          <Typography
                            fontSize={12}
                            fontWeight={400}
                            color={theme.palette.text.secondary}
                          >
                            Director details
                          </Typography>
                          <Box
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'space-between'}
                          >
                            <Typography
                              fontSize={14}
                              fontWeight={400}
                              color={theme.palette.grey[200]}
                            >
                              {idenfy.directorName}
                            </Typography>

                            <Typography
                              fontSize={14}
                              fontWeight={400}
                              color={theme.palette.grey[200]}
                            >
                              {idenfy.directorEmail}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      <Divider />

                      {idenfy?.status !== IdenfyReviewTypes.None && (
                        <SecondaryButton
                          sx={{
                            backgroundColor: theme.palette.error.darker,
                            maxWidth: 156,
                            height: 29,
                            m: 1.5,
                          }}
                          onClick={() => unLinkBusinessHandler(idenfy)}
                        >
                          <Typography fontSize={14}>Unlink business</Typography>
                        </SecondaryButton>
                      )}
                    </Box>
                  )
                },
              )}
            </Box>

            <PrimaryButton
              sx={{ maxWidth: 176 }}
              onClick={() => verifyBusinessAccount(RoleTypes.Seller)}
            >
              Add company details
            </PrimaryButton>
          </Box>
        </>
      )}

      <Divider />

      <Box display={'flex'} flexDirection={'column'} gap={2} py={2}>
        <Box display={'flex'} flexDirection={'column'}>
          <Typography
            color={theme.palette.text.disabled}
            fontFamily={'var(--font-semi-bold)'}
            fontSize={'18px'}
          >
            Coming soon
          </Typography>
          <Typography
            color={theme.palette.text.disabled}
            fontFamily={'var(--font-base)'}
            fontSize={'14px'}
            mt={1}
          >
            The ability to connect to these platforms are under development
          </Typography>
        </Box>

        <Box display={'flex'} flexDirection={'column'} gap={2}>
          <SecondaryButton sx={{ maxWidth: 206 }} disabled>
            USPTO
          </SecondaryButton>
          <SecondaryButton sx={{ maxWidth: 206 }} disabled>
            Apple Music
          </SecondaryButton>
          <SecondaryButton sx={{ maxWidth: 206 }} disabled>
            Crunchyroll
          </SecondaryButton>
        </Box>
      </Box>
    </Box>
  )
}
