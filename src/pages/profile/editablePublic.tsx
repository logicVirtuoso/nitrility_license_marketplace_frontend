import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  Box,
  Typography,
  styled,
  TextareaAutosize,
  Divider,
  useTheme,
  Menu,
  MenuItem,
  CardMedia,
} from '@mui/material'
import SecondaryButton from '../../components/buttons/secondary-button'
import BrokenAvatar from 'src/assets/images/profile_broken_avatar.png'
import IconReport from 'src/assets/report.svg'
import IconArrowBottom from 'src/assets/arrowbottom.svg'
import { AuthType } from '../../store/reducers/authorizationReducer'
import { Container, PublicAvatarImageContainer, AvatarImage } from './style'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import {
  getListedLicenseBySellerId,
  getSellerData,
  updateSellerProfile,
  updateFollow,
  checkFollowing,
  getFollowingBuyers,
  addProfileViewer,
} from 'src/api'
import PrimaryButton from 'src/components/buttons/primary-button'
import ThridButton from 'src/components/third-button'
import CollectionTab from './collections'
import ContactDetailsDialog from 'src/components/contactDetailsDlg'
import ProfileSocialsDialog from 'src/components/profileSocialsDialog'
import ProfileFollowersDialog from 'src/components/profileFollowersDialog'
import ProfileReportDialog from 'src/components/profileReportDialog'
import ListedPage from './listed'
import { StyledTab, StyledTabs } from 'src/components/styledTab'
import { convertUtcToLocalTime } from 'src/utils/utils'
import { SocialAccountList, SocialAccountType } from 'src/constants'
import SpotifyDarkIcon from 'src/assets/images/settings/spotify_grey.png'
import WhiteBtn from 'src/components/buttons/whiteBtn'
import { SellerDataIF } from 'interface'
import { PublicProfileContext } from 'src/context/publicProfileContext'
import useAuth from 'src/hooks/useAuth'

interface ReportMenuIF {
  anchorEl: null | HTMLElement
  reportOpen: boolean
  setAnchorEl: (anchorEl: null | HTMLElement) => void
  sellerName: string
  setShowReportDialog: (showReportDlg: boolean) => void
}

const ReportMenu = ({
  anchorEl,
  reportOpen,
  setAnchorEl,
  sellerName,
  setShowReportDialog,
}: ReportMenuIF) => {
  const theme = useTheme()
  return (
    <Menu
      id="report-menu"
      anchorEl={anchorEl}
      open={reportOpen}
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      onClose={() => setAnchorEl(null)}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
      sx={{
        '.MuiMenu-paper': {
          border: `solid 1px #323232`,
          backgroundColor: theme.palette.containerPrimary.main,
          marginTop: theme.spacing(1),
          minWidth: 191,
          color:
            theme.palette.mode === 'light'
              ? 'rgb(55, 65, 81)'
              : theme.palette.grey[300],
          '& .MuiMenu-list': {
            padding: '4px',
          },
          '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
              fontSize: '14px',
              color: theme.palette.text.secondary,
              marginRight: theme.spacing(1.5),
            },
          },
        },
      }}
    >
      <MenuItem
        onClick={() => {
          setAnchorEl(null)
          setShowReportDialog(true)
        }}
      >
        <CardMedia component="img" image={IconReport} />
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#FFA5A5',
            marginLeft: '6px',
          }}
        >
          Report {sellerName}
        </Typography>
      </MenuItem>
    </Menu>
  )
}

const Textarea = styled(TextareaAutosize)(
  ({ theme }) => `
  box-sizing: border-box;
  fontFamily: 'var(--font-semi-bold)',
  width: 245px;
  font-family: var(--font-base);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 16px,
  font-weight: 400,
  line-height: 24px,
  color: ${
    theme.palette.mode === 'dark'
      ? theme.palette.grey[500]
      : theme.palette.grey[900]
  };
  background: ${
    theme.palette.mode === 'dark' ? theme.palette.grey[600] : '#fff'
  };
  border: 1px solid ${
    theme.palette.mode === 'dark'
      ? theme.palette.grey[700]
      : theme.palette.grey[200]
  };
  box-shadow: 0px 1px 2px ${
    theme.palette.mode === 'dark' ? '#101828' : theme.palette.grey[50]
  };
  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
)

const PageContent = styled(Box)(({ theme }) => ({
  padding: '0px 100px',
  display: 'flex',
  flexDirection: 'column',
}))

const TabsContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(5),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    marginTop: theme.spacing(3),
    width: '95%',
  },
}))

enum TabTypes {
  Listings = 'Listings',
  Collections = 'Collections',
}

const EditablePublicProfile = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const { sellerId } = useParams()
  const { signIn } = useAuth()
  const queryParams = new URLSearchParams(location.search)
  const editMode = queryParams.get('editMode') == 'true' ? false : true

  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const [sellerData, setSellerData] = useState<SellerDataIF>({
    sellerName: '',
    email: '',
    sellerId: '',
    avatarPath: '',
    createdAt: 0,
  })

  const [showContactDialog, setShowContactDialog] = useState(false)
  const [showSocialsDialog, setShowSocialsDialog] = useState(false)
  const [showFollowersDialog, setShowFollowersDialog] = useState(false)
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [tabValue, setTabValue] = React.useState<string>(TabTypes.Listings)
  const [listedLicenses, setListedLicenses] = useState([])
  const {
    setPublicSellerId,
    publicProfileData,
    setPublicProfileData,
    initPublicProfileData,
  } = useContext(PublicProfileContext)
  const { contacts, socials, bio } = publicProfileData
  const [seeMore, setSeeMore] = useState(false)
  const [followers, setFollowers] = useState<Array<any>>([])
  const [isFollow, setIsFollow] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const reportOpen = Boolean(anchorEl)
  const handleClickContext = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  useEffect(() => {
    getSellerData(sellerId)
      .then((resData) => {
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
      .catch((e) => console.log('error in fetching sellerId', e))

    getFollowingBuyers(sellerId).then(({ data }) => setFollowers(data))
  }, [sellerId])

  const updateProfile = async () => {
    const profile = {
      sellerId,
      publicProfileData,
    }
    const { success, msg } = await updateSellerProfile(profile)
    if (success) {
      toast.success(msg)
    } else {
      toast.error(msg)
    }
  }

  useEffect(() => {
    const isCurrentUserOwner = sellerId === authorization?.currentUser?.sellerId
    if (!isCurrentUserOwner) {
      addProfileViewer(sellerId)
    }
    setIsOwner(isCurrentUserOwner)
  }, [sellerId, authorization])

  const fetchLicense = useCallback(async () => {
    if (sellerId) {
      getListedLicenseBySellerId(sellerId).then(setListedLicenses)
    }
  }, [sellerId])

  useEffect(() => {
    fetchLicense()
  }, [fetchLicense])

  const tabHandler = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue)
  }

  const handleClickFollow = async (isfollowing: boolean) => {
    if (authorization.loggedIn) {
      if (authorization.currentUser.sellerId !== sellerId) {
        const { success, msg } = await updateFollow(
          sellerId,
          authorization.currentUser.accountAddress,
        )
        if (success && isfollowing) {
          toast.success(msg)
          setIsFollow(true)
          setFollowers((prev) => [
            ...prev,
            authorization.currentUser.accountAddress,
          ])
        } else {
          setIsFollow(false)
          toast.success(msg)
        }
      }
    } else {
      await signIn()
    }
  }

  useEffect(() => {
    if (sellerId && authorization.currentUser.accountAddress) {
      checkFollowing(sellerId, authorization.currentUser.accountAddress).then(
        ({ success }) => setIsFollow(success),
      )
    }
  }, [authorization.currentUser, sellerId])

  const tabContent = useMemo(() => {
    if (tabValue === TabTypes.Listings) {
      return <ListedPage listedLicenses={listedLicenses} />
    } else {
      return (
        <CollectionTab isOwner={editMode && isOwner} sellerData={sellerData} />
      )
    }
  }, [tabValue, isOwner, editMode, sellerData, listedLicenses])

  const handleChangeBio = (e) => {
    setPublicProfileData((prev) => ({
      ...prev,
      bio: e.target.value,
    }))
  }

  const goToPreviewMode = () => {
    const newParams = new URLSearchParams()
    newParams.append('editMode', 'true')
    navigate(`?${newParams.toString()}`)
  }

  useEffect(() => {
    setPublicSellerId(sellerId)
  }, [sellerId, setPublicSellerId])

  return (
    <Container sx={{ minHeight: '100vh' }}>
      <Box
        display={'flex'}
        justifyContent={'center'}
        position={'relative'}
        height={250}
      >
        <CardMedia
          component={'img'}
          image={sellerData?.avatarPath}
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
      <Box sx={{ marginLeft: '100px' }}>
        <PublicAvatarImageContainer>
          <AvatarImage
            src={sellerData.avatarPath ? sellerData.avatarPath : BrokenAvatar}
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
      <PageContent sx={{ mb: 5 }}>
        <Box display={'flex'} justifyContent={'space-between'}>
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            <Typography
              sx={{
                color: theme.palette.grey[50],
                fontSize: '32px',
                lineHeight: '40px',
                fontWeight: '600',
              }}
            >
              {sellerData.sellerName}
            </Typography>
            {isOwner && editMode ? (
              <Textarea
                aria-label="minimum height"
                minRows={3}
                placeholder="Edit Bio"
                value={bio}
                onChange={(e) => handleChangeBio(e)}
              />
            ) : (
              <Box display={'flex'} flexDirection={'column'} gap={0.5}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: seeMore ? 'none' : '45px',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontFamily: 'var(--font-base)',
                      color: theme.palette.grey[200],
                    }}
                  >
                    {bio}
                  </Typography>

                  {Object.entries(socials).map(([key, url]) => {
                    if (!url) return null
                    return (
                      <Typography
                        key={key}
                        sx={{
                          fontSize: '14px',
                          fontFamily: 'var(--font-base)',
                          color: theme.palette.grey[200],
                        }}
                      >
                        {key}: {socials[key]}
                      </Typography>
                    )
                  })}
                </Box>
                {Object.values(socials).filter((value) => value !== '').length >
                  2 && (
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontFamily: 'var(--font-base)',
                      color: theme.palette.success.light,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                    onClick={() => setSeeMore(!seeMore)}
                  >
                    {seeMore ? `Show less` : `Show more`}
                  </Typography>
                )}
                {(contacts.email || contacts.phone) && (
                  <Box display={'flex'} alignItems={'center'} gap={0.5}>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontFamily: 'var(--font-base)',
                        color: theme.palette.grey[200],
                        cursor: 'pointer',
                      }}
                      onClick={() => setShowContactDialog(true)}
                    >
                      Contact details
                    </Typography>
                    <CardMedia
                      component={'img'}
                      image={IconArrowBottom}
                      sx={{
                        cursor: 'pointer',
                        width: 8,
                        height: 4,
                      }}
                      onClick={() => setShowContactDialog(true)}
                    />
                  </Box>
                )}
              </Box>
            )}
            {isOwner && editMode ? (
              <ThridButton
                sx={{
                  width: 245,
                  height: 35,
                }}
                onClick={() => setShowContactDialog(true)}
              >
                Edit Contact Info
              </ThridButton>
            ) : (
              <Box display={'flex'} alignItems={'center'} gap={2}>
                {isFollow ? (
                  <ThridButton onClick={() => handleClickFollow(false)}>
                    Unfollow
                  </ThridButton>
                ) : (
                  <PrimaryButton onClick={() => handleClickFollow(true)}>
                    Follow +
                  </PrimaryButton>
                )}
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: '400',
                    lineHeight: '20px',
                    color: theme.palette.grey[400],
                  }}
                >
                  {`Joined ${convertUtcToLocalTime(sellerData.createdAt)}`}
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            display={'flex'}
            justifyContent={'flex-end'}
            flexDirection={'column'}
            gap={2}
          >
            <Box display={'flex'} justifyContent={'flex-end'} gap={5}>
              <Box display={'flex'} flexDirection={'column'}>
                <Typography
                  sx={{
                    color: theme.palette.grey[300],
                    fontSize: '14px',
                    fontFamily: 'var(--font-base)',
                  }}
                >
                  Listings
                </Typography>
                <Typography
                  sx={{
                    color: theme.palette.grey[50],
                    fontSize: '24px',
                    fontWeight: '600',
                  }}
                >
                  {listedLicenses?.length}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover .MuiTypography-root': {
                    color: theme.palette.success.light,
                  },
                }}
                onClick={() => setShowFollowersDialog(true)}
              >
                <Typography
                  sx={{
                    color: theme.palette.grey[300],
                    fontSize: '14px',
                    fontFamily: 'var(--font-base)',
                  }}
                >
                  Followers
                </Typography>
                <Typography
                  sx={{
                    color: theme.palette.grey[50],
                    fontSize: '24px',
                    fontWeight: '600',
                  }}
                >
                  {followers.length}
                </Typography>
              </Box>
            </Box>
            {isOwner && editMode ? (
              <PrimaryButton onClick={goToPreviewMode}>
                Preview Profile
              </PrimaryButton>
            ) : (
              <Box display={'flex'} gap={1} justifyContent={'flex-end'}>
                {Object.entries(socials).map(([key, url]) => {
                  if (!url) return null
                  return (
                    <SecondaryButton
                      key={key}
                      onClick={() =>
                        window.open(url as unknown as string, '_blank')
                      }
                    >
                      <CardMedia
                        component={'img'}
                        image={SocialAccountList[key].icon}
                        sx={{
                          width: 18,
                          height: 18,
                        }}
                      />
                    </SecondaryButton>
                  )
                })}

                {Object.values(socials).some(Boolean) && (
                  <SecondaryButton
                    id="basic-button"
                    aria-controls={reportOpen ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={reportOpen ? 'true' : undefined}
                    onClick={handleClickContext}
                  >
                    . . .
                  </SecondaryButton>
                )}
              </Box>
            )}
            {isOwner && editMode && (
              <Box display={'flex'} justifyContent={'space-between'}>
                <ThridButton onClick={() => setShowSocialsDialog(true)}>
                  Edit Socials
                </ThridButton>
                <SecondaryButton
                  onClick={() => {
                    window.open(socials[SocialAccountType.Spotify], '_blank')
                  }}
                >
                  <CardMedia component={'img'} image={SpotifyDarkIcon} />
                </SecondaryButton>
              </Box>
            )}
          </Box>
        </Box>
      </PageContent>
      <Divider />
      <PageContent>
        <TabsContainer>
          <Box width="100%" position="relative">
            <StyledTabs value={tabValue} onChange={tabHandler}>
              <StyledTab
                value={TabTypes.Listings}
                label={
                  <Box display={'flex'} alignItems={'center'} gap={0.5}>
                    <Typography fontSize={14} lineHeight={2} className="label">
                      Listings
                    </Typography>
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
                      {listedLicenses.length}
                    </Typography>
                  </Box>
                }
              />
              {!(isOwner && editMode) &&
              publicProfileData.collections.filter(
                (collection) => collection.published,
              ).length == 0 ? (
                <></>
              ) : (
                <StyledTab
                  value={TabTypes.Collections}
                  label={
                    <Box display={'flex'} alignItems={'center'} gap={0.5}>
                      <Typography
                        fontSize={14}
                        lineHeight={2}
                        className="label"
                      >
                        Collections
                      </Typography>
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
                        {isOwner && editMode
                          ? publicProfileData.collections.length
                          : publicProfileData.collections.filter(
                              (collection) => collection.published,
                            ).length}
                      </Typography>
                    </Box>
                  }
                />
              )}
            </StyledTabs>
          </Box>
        </TabsContainer>
        {tabContent}
      </PageContent>
      <ContactDetailsDialog
        open={showContactDialog}
        setOpen={setShowContactDialog}
        editMode={editMode}
        isOwner={isOwner}
      />
      <ProfileSocialsDialog
        open={showSocialsDialog}
        setOpen={setShowSocialsDialog}
      />
      <ProfileFollowersDialog
        sellerView={isOwner}
        open={showFollowersDialog}
        setOpen={setShowFollowersDialog}
        followers={followers}
      />
      <ProfileReportDialog
        currentUser={authorization.currentUser}
        sellerId={sellerId}
        open={showReportDialog}
        setOpen={setShowReportDialog}
      />

      <ReportMenu
        reportOpen={reportOpen}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        sellerName={sellerData.sellerName}
        setShowReportDialog={setShowReportDialog}
      />

      {isOwner && editMode && (
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          gap={1.5}
          position={'fixed'}
          bottom={19}
          right={20}
        >
          <WhiteBtn
            sx={{
              fontWeight: 600,
              color: theme.palette.grey[800],
              height: 42,
            }}
            onClick={async () => {
              await initPublicProfileData()
              toast.success('Canceled your changes')
            }}
          >
            Cancel
          </WhiteBtn>
          <PrimaryButton
            sx={{
              fontWeight: 600,
              color: theme.palette.grey[800],
              height: 42,
            }}
            onClick={updateProfile}
          >
            Save
          </PrimaryButton>
        </Box>
      )}
    </Container>
  )
}

export default EditablePublicProfile
