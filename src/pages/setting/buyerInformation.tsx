import {
  Box,
  CardMedia,
  Divider,
  Grid,
  Typography,
  useTheme,
} from '@mui/material'
import PrimaryButton from 'src/components/buttons/primary-button'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  createSession,
  getBuyerMailingInfo,
  getBuyerPlatform,
  reLinkBusinessAcc,
  unlinkBusinessAcc,
  updateBuyerMailingInfo,
} from 'src/api'
import toast from 'react-hot-toast'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import BuyerPlatformItem from '../accountCenter/buyerPlatformItem'
import { IdenfyReviewTypes, MailingIF, RoleTypes } from 'src/interface'
import { AUTHENTICATED } from 'src/actions/actionTypes'
import { StyledOutlinedInputFC } from 'src/components/styledInput'
import { updateStore } from 'src/utils/utils'
import { GOOGLE_MAP_API_KEY } from 'src/config'
import ReactGoogleAutocomplete, {
  ReactGoogleAutocompleteInputProps,
} from 'react-google-autocomplete'
import SecondaryButton from 'src/components/buttons/secondary-button'
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

export default function BuyerInformationSetting() {
  const theme = useTheme()
  const [loading, setLoading] = useState<boolean>(true)
  const [searchedBuyerPlatformData, setSearchedBuyerPlatformData] =
    useState<Array<any>>()
  const [buyerPlatformData, setBuyerPlatformData] = useState<Array<any>>()
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const [buyerMailingInfo, setBuyerMailingInfo] = useState<MailingIF>({
    mail: '',
    mailingAddress: '',
  })
  const infoRef = useRef(buyerMailingInfo)
  useEffect(() => {
    infoRef.current = buyerMailingInfo
  }, [buyerMailingInfo])

  const init = useCallback(async () => {
    setLoading(true)
    if (authorization?.currentUser?.accountAddress) {
      const { success, msg, data } = await getBuyerPlatform(
        authorization?.currentUser?.accountAddress,
      )
      if (success) {
        setBuyerPlatformData(data.buyerData)
        setSearchedBuyerPlatformData(data.buyerData)
      } else {
        toast.error(msg)
        setBuyerPlatformData([])
        setSearchedBuyerPlatformData([])
      }
    }

    getBuyerMailingInfo().then(({ data }) => setBuyerMailingInfo(data))
    setLoading(false)
  }, [authorization?.currentUser?.accountAddress])

  useEffect(() => {
    init()
  }, [init])

  const buyerHandler = (data) => {
    setBuyerPlatformData(data)
    setSearchedBuyerPlatformData(data)
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

  const unLinkBusinessHandler = async (idenfy) => {
    const tLoading = toast.loading('Unlinking your business account...')
    try {
      const { success, accessToken } = await unlinkBusinessAcc(
        authorization.currentUser.accountAddress,
        idenfy,
      )
      updateStore(AUTHENTICATED, accessToken)
      if (success) {
        toast.success('Unlinked Successfully', { id: tLoading })
      } else {
        toast.error('Something went wrong', { id: tLoading })
      }
    } catch (e) {
      toast.error(e.message, { id: tLoading })
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

  const updateMailingInfo = async (newMailingInfo: Partial<MailingIF>) => {
    setBuyerMailingInfo(() => ({ ...infoRef.current, ...newMailingInfo }))
    await updateBuyerMailingInfo({ ...infoRef.current, ...newMailingInfo })
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
          General Account
        </Typography>
        <Typography
          color={theme.palette.text.secondary}
          fontFamily={'var(--font-base)'}
          fontSize={'14px'}
          mt={1}
        >
          Adjust key information about your account
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
            Safelist your channels
          </Typography>

          <Typography
            color={theme.palette.text.secondary}
            fontFamily={'var(--font-base)'}
            fontSize={'14px'}
            mt={1}
          >
            Provide us your social handle to associate licenses you own with
            your channels to avoid copyright claims
          </Typography>
        </Box>
        {!loading && (
          <Grid container spacing={2}>
            {searchedBuyerPlatformData.map((platformAccount, idx) => {
              return (
                <Grid item xs={12} md={6} key={idx}>
                  <BuyerPlatformItem
                    platform={platformAccount}
                    platformGroup={buyerPlatformData}
                    setPlatformGroup={buyerHandler}
                  />
                </Grid>
              )
            })}
          </Grid>
        )}

        <Divider />
        <Box display={'flex'} flexDirection={'column'} gap={2}>
          <Typography
            color={theme.palette.text.primary}
            fontSize={16}
            fontWeight={600}
            lineHeight={'22px'}
          >
            Company Information Associated with Purchases
          </Typography>

          <Box display={'flex'} flexDirection={'column'} gap={2}>
            {authorization.currentUser.idenfies?.buyer?.status ===
            IdenfyReviewTypes.None ? (
              <>
                <Typography
                  color={theme.palette.text.secondary}
                  fontSize={14}
                  fontWeight={400}
                  lineHeight={'17px'}
                  mt={1}
                >
                  If you intend on purchasing licenses as a company verify your
                  business below
                </Typography>
                <PrimaryButton
                  sx={{ maxWidth: 169 }}
                  onClick={() => verifyBusinessAccount(RoleTypes.Buyer)}
                >
                  Verify Business
                </PrimaryButton>
              </>
            ) : (
              <Box
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
                    variant="h5"
                    whiteSpace={'nowrap'}
                    textOverflow={'ellipsis'}
                    overflow={'hidden'}
                  >
                    {`${
                      authorization.currentUser.idenfies?.buyer?.status ===
                      IdenfyReviewTypes.Pending
                        ? 'Under the review'
                        : authorization.currentUser.idenfies?.buyer?.companyName
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

                <Box p={1.5} display={'flex'} flexDirection={'column'} gap={2}>
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
                        {
                          authorization.currentUser.idenfies?.buyer
                            ?.directorName
                        }
                      </Typography>

                      <Typography
                        fontSize={14}
                        fontWeight={400}
                        color={theme.palette.grey[200]}
                      >
                        {
                          authorization.currentUser.idenfies?.buyer
                            ?.directorEmail
                        }
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider />

                {authorization.currentUser.idenfies?.buyer?.status !==
                  IdenfyReviewTypes.None && (
                  <SecondaryButton
                    sx={{
                      backgroundColor: theme.palette.error.darker,
                      maxWidth: 156,
                      height: 29,
                      m: 1.5,
                    }}
                    onClick={() =>
                      unLinkBusinessHandler(
                        authorization.currentUser.idenfies?.buyer,
                      )
                    }
                  >
                    <Typography fontSize={14}>Unlink business</Typography>
                  </SecondaryButton>
                )}
              </Box>
            )}
          </Box>
        </Box>

        <Box display={'flex'} flexDirection={'column'} pt={2} gap={2}>
          <Typography
            color={theme.palette.text.primary}
            fontSize={16}
            fontWeight={600}
            lineHeight={'22px'}
          >
            User Information Associated with Purchases (Required)
          </Typography>

          <Box display={'flex'} flexDirection={'column'} gap={0.5}>
            <Typography
              color={theme.palette.text.secondary}
              fontWeight={400}
              fontSize={12}
              lineHeight={'16px'}
            >
              Public Email Address - Shown on License Details
            </Typography>
            <Box display={'flex'} alignItems={'center'} gap={2} maxWidth={370}>
              <StyledOutlinedInputFC
                fullWidth
                type="email"
                value={buyerMailingInfo.mail}
                name="mail"
                onChange={(e) =>
                  updateMailingInfo({
                    mail: e.target.value,
                  })
                }
                placeholder="Enter Public Email Address"
              />
            </Box>
          </Box>

          <Box display={'flex'} flexDirection={'column'} gap={0.5}>
            <Typography
              color={theme.palette.text.secondary}
              fontWeight={400}
              fontSize={12}
              lineHeight={'16px'}
            >
              Public Mailing Address - Shown on License Details
            </Typography>
            <Box display={'flex'} alignItems={'center'} gap={2} maxWidth={370}>
              <CustomGoogleAutocomplete
                placeholder="Enter Public Mailing Address"
                apiKey={GOOGLE_MAP_API_KEY}
                onPlaceSelected={(place) =>
                  updateMailingInfo({
                    mailingAddress: place.formatted_address,
                  })
                }
                defaultValue={buyerMailingInfo.mailingAddress}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
