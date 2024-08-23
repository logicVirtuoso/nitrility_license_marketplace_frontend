import React, { useEffect, useState, useCallback, useContext } from 'react'
import { styled } from '@mui/material/styles'
import { Box, useTheme, Typography, Divider, CardMedia } from '@mui/material'
import NotificationsPage from './notifications'
import OwnedPage from './owned'
import ListedPage from './listed'
import { useNavigate, useParams } from 'react-router-dom'
import FundDialog from './fundDialog'
import { useSelector } from 'react-redux'
import { AuthType } from '../../store/reducers/authorizationReducer'
import { getPrivateProfileData, getSellerData } from '../../api'
import LicenseManagementTab from './licenseManagement'
import { getListedLicenseBySellerId } from '../../api'
import {
  AvatarImage,
  PublicAvatarImageContainer,
  UploadImage,
  UploadImageContainer,
} from './style'
import StatsTab from './stats'
import UnListedPage from './unlisted/unlisted'
import toast from 'react-hot-toast'
import { RoleTypes, TabTypes } from 'src/interface'
import BannerImage from '../../assets/images/profile/profile_banner_dark.png'
import PlusDarkIcon from 'src/assets/images/plus_dark.png'
import PrimaryButton from 'src/components/buttons/primary-button'
import { StyledTab, StyledTabs } from 'src/components/styledTab'
import OfferReceivedTab from './licenseOffers/offerReceived'
import OfferMadeTab from './licenseOffers/offerMade'
import ProfileFollowersDialog from 'src/components/profileFollowersDialog'
import SoldLicenses from './soldLicenses'
import ThirdButton from 'src/components/buttons/third-button'
import ActivityTab from './activity'
import { GlobalDataContext } from 'src/context/globalDataContext'

const Container = styled(Box)(({ theme }) => ({
  width: '100%',
  textAlign: 'center',
  minHeight: ' 100vh',
}))

const PageContent = styled(Box)(({ theme }) => ({
  padding: '0px 100px',
  display: 'flex',
  flexDirection: 'column',
}))

const TabsContainer = styled(Box)(({ theme }) => ({
  margin: 'auto',
  marginTop: theme.spacing(1),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    marginTop: theme.spacing(3),
    width: '95%',
  },
}))

const tabItems = [
  {
    label: 'Listings',
    value: TabTypes.Listed,
    externalView: true,
    buyerView: false,
  },
  {
    label: 'Licenses Boughts',
    value: TabTypes.Owned,
    externalView: false,
    buyerView: true,
  },
  {
    label: 'Licenses Sold',
    value: TabTypes.Sold,
    externalView: false,
    buyerView: false,
  },
  {
    label: 'Offers received',
    value: TabTypes.OfferReceived,
    externalView: false,
    buyerView: true,
  },
  {
    label: 'Offers made',
    value: TabTypes.OfferMade,
    externalView: false,
    buyerView: true,
  },
  {
    label: 'Pending Listings',
    value: TabTypes.PendingListings,
    externalView: false,
    buyerView: false,
  },
  {
    label: 'Unlisted licenses',
    value: TabTypes.UnListed,
    externalView: false,
    buyerView: false,
  },
  {
    label: 'Seller Stats',
    value: TabTypes.SellerStats,
    externalView: false,
    buyerView: false,
  },
  // {
  //   label: 'Notifications',
  //   value: 'Notifications',
  //   externalView: false,
  //   buyerView: true,
  // },
  {
    label: 'Activity',
    value: TabTypes.Activity,
    externalView: false,
    buyerView: true,
  },
]

interface ProfileInfoIF {
  listings: number
  owned: number
  sold: number
  pendingListings: number
  unlistedListings: number
  offerMade: number
  offerReceived: number
  followers: object[]
  following: object[]
  displayName: string
}

interface SellerDataIF {
  sellerName: string
  email: string
  sellerId: string | null
  avatarPath: string
  createdAt: number
}

const ProfileLayout = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { accountAddress } = useParams()
  const [globalData, setGlobalData] = useContext(GlobalDataContext)

  const [listedLicenses, setListedLicenses] = useState<Array<any>>([])
  const [openFundDlg, setOpenFundDlg] = useState<boolean>(false)
  const [openFollowingDlg, setOpenFollowingDlg] = useState<boolean>(false)
  const [openFollowerDlg, setOpenFollowerDlg] = useState<boolean>(false)
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const [sellerId, setSellerId] = useState<string | null>(null)
  const [sellerData, setSellerData] = useState<SellerDataIF>({
    sellerName: '',
    email: '',
    sellerId: '',
    avatarPath: '',
    createdAt: 0,
  })

  const [profileInfo, setProfileInfo] = useState<ProfileInfoIF>({
    listings: 0,
    followers: [],
    following: [],
    owned: 0,
    sold: 0,
    pendingListings: 0,
    unlistedListings: 0,
    offerMade: 0,
    offerReceived: 0,
    displayName: '',
  })
  const [joinedDate, setJoinedDate] = useState<string>('')

  const fetchLicense = useCallback(() => {
    if (sellerId) {
      getListedLicenseBySellerId(sellerId).then(setListedLicenses)
    }
  }, [sellerId])

  useEffect(() => {
    fetchLicense()
  }, [fetchLicense])

  const [externalView, setExternalView] = useState<boolean>(true)

  const currentTabPage = React.useMemo(() => {
    let tabPage = null
    switch (globalData.profileTabValue) {
      case TabTypes.Listed:
        tabPage = <ListedPage listedLicenses={listedLicenses} />
        break
      case TabTypes.Owned:
        tabPage = <OwnedPage />
        break
      case TabTypes.Sold:
        tabPage = <SoldLicenses />
        break
      case TabTypes.UnListed:
        tabPage = <UnListedPage />
        break
      case TabTypes.SellerStats:
        tabPage = <StatsTab />
        break
      case TabTypes.OfferMade:
        tabPage = <OfferMadeTab />
        break
      case TabTypes.OfferReceived:
        tabPage = <OfferReceivedTab />
        break
      case TabTypes.Notifications:
        tabPage = <NotificationsPage />
        break
      case TabTypes.PendingListings:
        tabPage = <LicenseManagementTab />
        break
      case TabTypes.Activity:
        tabPage = (
          <ActivityTab
            isSeller={authorization.currentUser.role == RoleTypes.Seller}
          />
        )
        break
      default:
        break
    }
    return tabPage
  }, [globalData.profileTabValue, listedLicenses, authorization.currentUser])

  useEffect(() => {
    const getPrivate = async () => {
      if (accountAddress) {
        const { success, data, msg } = await getPrivateProfileData(
          accountAddress,
        )
        if (success) {
          const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ]
          const date = new Date(data.timeOfCreation)
          const formattedDate = `${
            monthNames[date.getMonth()]
          } ${date.getFullYear()}`
          setJoinedDate(formattedDate)
          setProfileInfo(data)
        } else {
          toast.error(msg)
        }
      }
    }
    getPrivate()
  }, [accountAddress])

  useEffect(() => {
    setSellerId(authorization?.currentUser?.sellerId)
  }, [authorization?.currentUser?.sellerId])

  const tabHandler = (event: React.SyntheticEvent, newValue: TabTypes) => {
    setGlobalData((prev) => ({ ...prev, profileTabValue: newValue }))
  }

  useEffect(() => {
    setExternalView(
      authorization?.currentUser?.accountAddress != accountAddress,
    )
  }, [accountAddress, authorization?.currentUser])

  useEffect(() => {
    getSellerData(sellerId).then((resData) => {
      if (resData.status == 200 && resData.data.success == true) {
        setSellerData({
          sellerName: resData.data.data.sellerName,
          email: resData.data.data.email,
          sellerId: resData.data.data.sellerId,
          avatarPath: resData.data.data.avatarPath,
          createdAt: resData.data.data.createdAt,
        })
      }
    })
  }, [sellerId])

  return (
    <Box display={'flex'} justifyContent={'center'}>
      <Container>
        {/* banner image */}
        {authorization.currentUser.role == RoleTypes.Buyer ? (
          <UploadImageContainer>
            <UploadImage
              sx={{
                height: '100%',
                width: '100%',
              }}
              src={BannerImage}
            />
          </UploadImageContainer>
        ) : (
          <Box
            sx={{
              position: 'relative',
              height: 250,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <CardMedia
              component={'img'}
              image={sellerData.avatarPath}
              sx={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                inset: '0px',
                color: 'transparent',
                visibility: 'visible',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                top: '0px',
                left: '0px',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(50px)',
                transform: 'translate3d(0px, 0px, 0px)',
                zIndex: 1,
              }}
            />

            <Box
              sx={{
                zIndex: 2,
                width: '100%',
                height: 104,
                background:
                  'linear-gradient(180deg, rgba(17, 17, 17, 0.8) 0%, rgba(17, 17, 17, 0) 100%), linear-gradient(180deg, rgba(0, 0, 0, 0.2) -115.98%, rgba(0, 0, 0, 0) 100%)',
              }}
            ></Box>
          </Box>
        )}

        {/* avatar image */}
        {authorization.currentUser.role == RoleTypes.Seller && (
          <Box sx={{ marginLeft: '100px' }}>
            <PublicAvatarImageContainer>
              <AvatarImage
                src={sellerData.avatarPath}
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '100%',
                  padding: '0px',
                  border: `8px solid #111111`,
                }}
              />
            </PublicAvatarImageContainer>
          </Box>
        )}

        <PageContent sx={{ mb: 5, mt: 1 }}>
          <Typography
            variant="h2"
            sx={{
              maxWidth: '300px',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textAlign: 'left',
              paddingTop: 2,
              color: theme.palette.text.primary,
            }}
          >
            {profileInfo.displayName ?? 'Entered Name'}
          </Typography>

          <Box display={'flex'} alignItems={'center'}>
            <Box display={'flex'} alignItems={'center'} gap={'16px'}>
              {externalView ? (
                <PrimaryButton sx={{ width: 88, height: 35 }}>
                  Follow
                  <CardMedia
                    image={PlusDarkIcon}
                    component={'img'}
                    sx={{ width: 12, height: 12, ml: 0.5 }}
                  />
                </PrimaryButton>
              ) : (
                <ThirdButton
                  sx={{
                    fontFamily: 'var(--font-base)',
                    fontSize: 14,
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.grey[400],
                    border: 'none',
                    padding: '6px 10px',
                  }}
                  onClick={() => navigate('/settings')}
                >
                  Edit profile
                </ThirdButton>
              )}
              {authorization?.currentUser?.role === RoleTypes.Seller &&
                accountAddress === authorization.currentUser.accountAddress && (
                  <ThirdButton
                    sx={{
                      fontFamily: 'var(--font-base)',
                      fontSize: 14,
                      backgroundColor: theme.palette.secondary.main,
                      color: theme.palette.grey[400],
                      border: 'none',
                      padding: '6px 10px',
                    }}
                    onClick={() => navigate(`/pub-profile/${sellerId}`)}
                  >
                    Edit public profile
                  </ThirdButton>
                )}

              <Typography
                sx={{
                  maxWidth: '200px',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  fontSize: '14px',
                  fontFamily: 'var(--font-base)',
                  color: theme.palette.text.secondary,
                }}
              >
                {`Joined ${joinedDate}`}
              </Typography>
            </Box>

            <Box display={'flex'} alignItems={'center'} ml={'auto'} gap={5}>
              {authorization.currentUser.role == RoleTypes.Seller && (
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'flex-start'}
                >
                  <Typography variant="body2" color={theme.palette.grey[300]}>
                    Listings
                  </Typography>
                  <Typography
                    variant="h3"
                    color={theme.palette.containerPrimary.contrastText}
                  >
                    {profileInfo.listings}
                  </Typography>
                </Box>
              )}

              {!externalView && (
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'flex-start'}
                >
                  <Typography variant="body2" color={theme.palette.grey[300]}>
                    Licenses Owned
                  </Typography>
                  <Typography
                    variant="h3"
                    color={theme.palette.containerPrimary.contrastText}
                  >
                    {profileInfo.owned}
                  </Typography>
                </Box>
              )}

              {authorization.currentUser.role == RoleTypes.Seller && (
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'flex-start'}
                  sx={{
                    cursor: 'pointer',
                    '&:hover .MuiTypography-root': {
                      color: theme.palette.success.light,
                    },
                  }}
                  onClick={() => setOpenFollowerDlg(true)}
                >
                  <Typography variant="body2" color={theme.palette.grey[300]}>
                    Followers
                  </Typography>
                  <Typography
                    variant="h3"
                    color={theme.palette.containerPrimary.contrastText}
                  >
                    {profileInfo.followers.length}
                  </Typography>
                </Box>
              )}

              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'flex-start'}
                sx={{
                  cursor: 'pointer',
                  '&:hover .MuiTypography-root': {
                    color: theme.palette.success.light,
                  },
                }}
                onClick={() => setOpenFollowingDlg(true)}
              >
                <Typography variant="body2" color={theme.palette.grey[300]}>
                  Following
                </Typography>
                <Typography
                  variant="h3"
                  color={theme.palette.containerPrimary.contrastText}
                >
                  {profileInfo.following.length}
                </Typography>
              </Box>
            </Box>
          </Box>
        </PageContent>

        <Divider />

        <PageContent sx={{ mt: 4, display: 'inherit' }}>
          <TabsContainer>
            <Box width="100%" position="relative">
              <StyledTabs
                value={globalData.profileTabValue}
                onChange={tabHandler}
              >
                {tabItems
                  .filter((tab) => {
                    if (externalView) {
                      return tab.externalView
                    } else {
                      if (authorization.currentUser.role == RoleTypes.Buyer) {
                        return tab.buyerView
                      } else {
                        return true
                      }
                    }
                  })
                  .map((tab, idx) => {
                    let counts = 0
                    switch (tab.value) {
                      case TabTypes.Listed:
                        counts = profileInfo.listings
                        break
                      case TabTypes.Owned:
                        counts = profileInfo.owned
                        break
                      case TabTypes.Sold:
                        counts = profileInfo.sold
                        break
                      case TabTypes.PendingListings:
                        counts = profileInfo.pendingListings
                        break
                      case TabTypes.UnListed:
                        counts = profileInfo.unlistedListings
                        break
                      case TabTypes.OfferMade:
                        counts = profileInfo.offerMade
                        break
                      case TabTypes.OfferReceived:
                        counts = profileInfo.offerReceived
                        break
                      default:
                        break
                    }
                    return (
                      <StyledTab
                        value={tab.value}
                        label={
                          <Box
                            sx={{
                              display: 'flex',
                              gap: '4px',
                              alignItems: 'center',
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '14px',
                                lineHeight: '17.36px',
                              }}
                              className="label"
                            >
                              {tab.label}
                            </Typography>
                            {tab.value !== TabTypes.SellerStats &&
                              tab.value !== TabTypes.Activity && (
                                <Typography
                                  sx={{
                                    fontSize: '12px',
                                    lineHeight: '17.36px',
                                    borderRadius: '45%',
                                    background: theme.palette.grey[600],
                                    width: '20px',
                                    height: '18px',
                                    color: theme.palette.grey[400],
                                    paddingTop: '1px',
                                  }}
                                >
                                  {counts}
                                </Typography>
                              )}
                          </Box>
                        }
                        key={idx}
                      />
                    )
                  })}
              </StyledTabs>
            </Box>
          </TabsContainer>

          {currentTabPage}
        </PageContent>

        <ProfileFollowersDialog
          sellerView={true}
          open={openFollowerDlg}
          setOpen={setOpenFollowerDlg}
          followers={profileInfo.followers}
        />
        <ProfileFollowersDialog
          sellerView={false}
          open={openFollowingDlg}
          setOpen={setOpenFollowingDlg}
          followers={profileInfo.following}
        />
        {sellerId && <FundDialog open={openFundDlg} setOpen={setOpenFundDlg} />}
      </Container>
    </Box>
  )
}

export default ProfileLayout
