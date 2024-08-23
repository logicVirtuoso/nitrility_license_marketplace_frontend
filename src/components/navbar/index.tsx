import {
  Badge,
  Box,
  Divider,
  Typography,
  useTheme,
  styled,
  InputAdornment,
  Input,
  CardMedia,
  IconButton,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { searchArtists, searchLicenses } from '../../api'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { NotificationContext } from 'src/context/notification'
import NotificationMenu from '../notificationMenu'
import CartDrawer from '../cartDrawer'
import { CartContext } from 'src/context/carts'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import AuthButton from '../connectButton'
import BalanceMenu from '../balanceMenu'
import DarkModeSwitch from '../darkModeSwitch'
import SecondaryButton from '../buttons/secondary-button'
import NotificationDarkIcon from 'src/assets/images/notification.svg'
import NonEmptyNotificationDarkIcon from 'src/assets/images/non_empty_notification.svg'
import ShoppingCartIcon from 'src/assets/images/shopping-cart.svg'
import UserCircleDarkIcon from 'src/assets/images/user-circle.svg'
import DurationTool from './durationTool'
import TempoTool from './tempoTool'
import TypeTool from './typeTool'
import BackFowardsDarkIcon from 'src/assets/images/back_dark.svg'

const SearchInput = styled(Input)(({ theme }) => ({
  '&::before': {
    borderBottom: 'none',
  },
  '&::after': {
    borderBottom: 'none',
  },
  '&:hover:not(.Mui-disabled):before': {
    borderBottom: 'none',
  },
  borderRadius: '8px',
  color: theme.palette.grey[200],
  position: 'relative',
  fontSize: '16px',
  width: '480px',
  lineHeight: '17.36px',
  fontWeight: '400',
  padding: '6px 8px',
  fontFamily: 'var(--font-base)',
}))

const LicenseItem = ({ license, width }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '10px',
        cursor: 'pointer',
        width: `${width}%`,
      }}
      onClick={() => {
        navigate(`/purchase/${license.listedId}`)
      }}
    >
      <img
        width={48}
        height={48}
        src={license.imagePath}
        style={{ borderRadius: '4.8px' }}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: '700',
            color: theme.palette.containerPrimary.contrastText,
          }}
        >
          {license.licenseName}
        </Typography>
        <Typography
          sx={{
            fontSize: '14px',
            color: '#C1C1C1',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            width: '160px',
          }}
        >
          {license.albumName}
        </Typography>
      </Box>
    </Box>
  )
}

const ArtistItem = ({ artist, width }) => {
  const navigate = useNavigate()
  const theme = useTheme()
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        width: `${width}%`,
        cursor: 'pointer',
      }}
      onClick={() => navigate(`/pub-profile/${artist.sellerId}`)}
    >
      <CardMedia
        component={'img'}
        image={artist.avatarPath}
        sx={{
          width: 48,
          height: 48,
          borderRadius: '100%',
        }}
      />

      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: '700',
          color: theme.palette.containerPrimary.contrastText,
        }}
      >
        {artist.sellerName}
      </Typography>
    </Box>
  )
}

export default function Navbar() {
  const theme = useTheme()
  const navigate = useNavigate()
  const [notifications] = useContext(NotificationContext)
  const { carts } = useContext(CartContext)
  const [minMins, setMinMins] = useState(0)
  const [minSecs, setMinSecs] = useState(0)
  const [maxMins, setMaxMins] = useState(0)
  const [maxSecs, setMaxSecs] = useState(0)
  const [slowChecked, setSlowChecked] = useState(false)
  const [moderateChecked, setModerateChecked] = useState(false)
  const [fastChecked, setFastChecked] = useState(false)
  const [veryFastChecked, setVeryFastChecked] = useState(false)
  const [licensingTypeFilter, setLicensingTypeFilter] = useState<
    Array<boolean>
  >([false, false, false, false, false, false])
  const [searchTag, setSearchTag] = useState('')
  const [keyword, setKeywrod] = useState('')
  const [licenses, setLicences] = useState<Array<any>>([])
  const [artists, setArtists] = useState<Array<any>>([])
  const [categories, setCategories] = useState<Array<any>>([])
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const [showCart, setShowCart] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [insideClicked, setInsideClicked] = useState(false)
  const [showBalance, setShowBalance] = useState<boolean>(false)
  const balanceRef = useRef<HTMLElement>(null)
  const [showNotification, setShowNotification] = useState<boolean>(false)
  const notificationRef = useRef<HTMLElement>(null)
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false)
  const searchBarRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleClickSearchOutside = (e) => {
      if (
        showSearchBar &&
        searchBarRef.current &&
        !insideClicked &&
        !searchBarRef.current.contains(e.target)
      ) {
        setShowSearchBar(false)
      }
    }
    document.addEventListener('mousedown', handleClickSearchOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickSearchOutside)
    }
  }, [showSearchBar, insideClicked])

  useEffect(() => {
    const handleClickBalanceOutside = (e) => {
      if (
        showBalance &&
        balanceRef.current &&
        !balanceRef.current.contains(e.target)
      ) {
        setShowBalance(false)
      }
    }
    document.addEventListener('mousedown', handleClickBalanceOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickBalanceOutside)
    }
  }, [showBalance])

  useEffect(() => {
    const handleClickNotificationOutside = (e) => {
      if (
        showNotification &&
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShowNotification(false)
      }
    }
    document.addEventListener('mousedown', handleClickNotificationOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickNotificationOutside)
    }
  }, [showNotification])

  const handleClearFilter = () => {
    setSearchTag('')
    setMaxMins(0)
    setMaxSecs(0)
    setMinMins(0)
    setMinSecs(0)
    setSlowChecked(false)
    setModerateChecked(false)
    setFastChecked(false)
    setVeryFastChecked(false)
    setLicensingTypeFilter([false, false, false, false, false, false])
  }

  const searchContentsWSearchKey = useMemo(() => {
    if (searchTag === 'Licenses') {
      return licenses.length > 0 ? (
        licenses.map((license, idx) => {
          return <LicenseItem license={license} width={32} key={idx} />
        })
      ) : (
        <Typography
          sx={{
            fontSize: '14px',
            color: theme.palette.grey[400],
            textAlign: 'left',
          }}
        >
          No Licenses
        </Typography>
      )
    } else if (searchTag === 'Artists') {
      return artists.length > 0 ? (
        artists.map((artist, idx) => {
          return <ArtistItem artist={artist} width={32} key={idx} />
        })
      ) : (
        <Typography
          sx={{
            fontSize: '14px',
            color: theme.palette.grey[400],
            textAlign: 'left',
          }}
        >
          No Artists
        </Typography>
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [licenses, searchTag, artists])

  const searchHandler = (e) => {
    setKeywrod(e.target.value)
  }

  const handleLicensesFilter = () => {
    const licneseFilter = {
      licenseName: keyword,
      isFilter: searchTag === 'Licenses' ? true : false,
      duration: {
        min: (minMins * 60 + minSecs) * 1000,
        max: (maxMins * 60 + maxSecs) * 1000,
      },
      tempo: {
        slowChecked,
        moderateChecked,
        fastChecked,
        veryFastChecked,
      },
      licensingTypeFilter,
    }
    searchLicenses(licneseFilter).then((res) => {
      if (res.status === 200 && res.data.success) {
        setLicences(res.data.data)
      }
    })
  }

  const handleArtistsFilter = () => {
    searchArtists(keyword)
      .then((res) => {
        if (res.status === 200 && res.data.success) {
          setArtists(res.data.data)
        }
      })
      .catch((err) => console.log('error in searching artist', err))
  }

  const filterHandler = () => {
    handleLicensesFilter()
    handleArtistsFilter()
  }

  useEffect(() => {
    if (keyword) {
      filterHandler()
    } else {
      setLicences([])
      setArtists([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, searchTag])

  const handleFilterApply = () => {
    filterHandler()
  }

  return (
    <Box
      display="flex"
      alignItems={'center'}
      justifyContent={'space-between'}
      width="100%"
    >
      <Box display={'flex'} height={'100%'} gap={2} width="100%">
        <Box
          sx={{
            borderRadius: '8px',
            backgroundColor: 'rgb(255, 255, 255, 0.1)',
            transitionDuration: '.3s',
            '& svg': {
              color: theme.palette.mode === 'dark' ? '#B0B0B0' : '#717171',
            },
            position: 'relative',
          }}
        >
          {(window.location.href.includes('collection-details') ||
            window.location.href.includes('editMode')) && (
            <Box
              sx={{
                position: 'absolute',
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                left: '-50px',
              }}
            >
              <IconButton onClick={() => navigate(-1)}>
                <CardMedia
                  component={'img'}
                  image={BackFowardsDarkIcon}
                  sx={{
                    width: 18,
                    height: 18,
                  }}
                />
              </IconButton>
            </Box>
          )}
          <Box ref={searchBarRef}>
            <SearchInput
              placeholder={`Search for anything on Nitrility`}
              value={keyword}
              onClick={() => setShowSearchBar(true)}
              onChange={(e) => searchHandler(e)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
            />
            {showSearchBar && (
              <Box
                sx={{
                  marginTop: '10px',
                  position: 'absolute',
                  width: '796px',
                  zIndex: 100,
                  backgroundColor: '#191919',
                  borderRadius: '10px',
                  color: '#FFF',
                  boxShadow:
                    'rgba(0, 0, 0, 0.04) 0px 0px 0px 1px, rgba(0, 0, 0, 0.12) 0px 6px 8px',
                }}
              >
                <Box
                  sx={{
                    padding: '12px 16px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    align="left"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: '14px',
                      fontWeight: '400',
                    }}
                  >
                    Filter by:{' '}
                  </Typography>
                  <Box
                    sx={{
                      background: '#303030',
                      padding: '4px',
                      borderRadius: '10px',
                      display: 'flex',
                      gap: '8px',
                    }}
                  >
                    <Typography
                      align="center"
                      sx={{
                        padding: '0px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: searchTag === 'Licenses' ? 600 : 400,
                        color:
                          searchTag === 'Licenses'
                            ? theme.palette.primary.contrastText
                            : theme.palette.text.secondary,
                        background:
                          searchTag === 'Licenses'
                            ? theme.palette.success.light
                            : 'transparent',
                      }}
                      onClick={() => {
                        setSearchTag('Licenses')
                      }}
                    >
                      Licenses
                    </Typography>
                    <Typography
                      align="center"
                      sx={{
                        padding: '0px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: searchTag === 'Artists' ? 600 : 400,
                        color:
                          searchTag === 'Artists'
                            ? theme.palette.primary.contrastText
                            : theme.palette.text.secondary,
                        background:
                          searchTag === 'Artists'
                            ? theme.palette.success.light
                            : 'transparent',
                      }}
                      onClick={() => {
                        setSearchTag('Artists')
                      }}
                    >
                      Artists
                    </Typography>
                    <Typography
                      align="center"
                      sx={{
                        padding: '0px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: searchTag === 'Genres' ? 600 : 400,
                        color:
                          searchTag === 'Genres'
                            ? theme.palette.primary.contrastText
                            : theme.palette.text.secondary,
                        background:
                          searchTag === 'Genres'
                            ? theme.palette.success.light
                            : 'transparent',
                      }}
                      onClick={() => {
                        setSearchTag('Genres')
                      }}
                    >
                      Genres
                    </Typography>
                    <Typography
                      align="center"
                      sx={{
                        padding: '0px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: searchTag === 'Activities' ? 600 : 400,
                        color:
                          searchTag === 'Activities'
                            ? theme.palette.primary.contrastText
                            : theme.palette.text.secondary,
                        background:
                          searchTag === 'Activities'
                            ? theme.palette.success.light
                            : 'transparent',
                      }}
                      onClick={() => {
                        setSearchTag('Activities')
                      }}
                    >
                      Activities
                    </Typography>
                    <Typography
                      align="center"
                      sx={{
                        padding: '0px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: searchTag === 'Moods' ? 600 : 400,
                        color:
                          searchTag === 'Moods'
                            ? theme.palette.primary.contrastText
                            : theme.palette.text.secondary,
                        background:
                          searchTag === 'Moods'
                            ? theme.palette.success.light
                            : 'transparent',
                      }}
                      onClick={() => {
                        setSearchTag('Moods')
                      }}
                    >
                      Moods
                    </Typography>
                  </Box>
                  {searchTag && (
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: theme.palette.success.light,
                        cursor: 'pointer',
                      }}
                      onClick={handleClearFilter}
                    >
                      Clear Filter
                    </Typography>
                  )}
                </Box>
                <Divider />
                <Box>
                  <Box
                    sx={{
                      padding: '12px 16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    {searchTag === 'Licenses' && (
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '10px',
                        }}
                      >
                        <DurationTool
                          setInsideClicked={setInsideClicked}
                          minMins={minMins}
                          minSecs={minSecs}
                          setMinMins={setMinMins}
                          setMinSecs={setMinSecs}
                          maxMins={maxMins}
                          maxSecs={maxSecs}
                          setMaxMins={setMaxMins}
                          setMaxSecs={setMaxSecs}
                          hanldeApply={handleFilterApply}
                        />
                        <TempoTool
                          setInsideClicked={setInsideClicked}
                          slowChecked={slowChecked}
                          setSlowChecked={setSlowChecked}
                          moderateChecked={moderateChecked}
                          setModerateChecked={setModerateChecked}
                          fastChecked={fastChecked}
                          setFastChecked={setFastChecked}
                          veryFastChecked={veryFastChecked}
                          setVeryFastChecked={setVeryFastChecked}
                          hanldeApply={handleFilterApply}
                        />
                        <TypeTool
                          setInsideClicked={setInsideClicked}
                          licensingTypeFilter={licensingTypeFilter}
                          setLicensingTypeFilter={setLicensingTypeFilter}
                          hanldeApply={handleFilterApply}
                        />
                      </Box>
                    )}
                    {searchTag ? (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '10px',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            width: '100%',
                          }}
                        >
                          <Typography
                            sx={{
                              color:
                                theme.palette.containerPrimary.contrastText,
                              fontSize: '16px',
                              fontWeight: '600',
                            }}
                          >
                            {searchTag}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: '10px',
                            }}
                          >
                            {searchContentsWSearchKey}
                          </Box>
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '10px',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '33%',
                            gap: '10px',
                          }}
                        >
                          <Typography
                            sx={{
                              color:
                                theme.palette.containerPrimary.contrastText,
                              fontSize: '16px',
                              fontWeight: '600',
                            }}
                          >
                            Licenses
                          </Typography>
                          {licenses?.length > 0 ? (
                            licenses.map((license, idx) => {
                              return (
                                <LicenseItem
                                  license={license}
                                  width={100}
                                  key={idx}
                                />
                              )
                            })
                          ) : (
                            <Typography
                              align="left"
                              sx={{
                                fontSize: '14px',
                                color: theme.palette.grey[400],
                              }}
                            >
                              No Licenses
                            </Typography>
                          )}
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '33%',
                            gap: '10px',
                          }}
                        >
                          <Typography
                            sx={{
                              color:
                                theme.palette.containerPrimary.contrastText,
                              fontSize: '16px',
                              fontWeight: '600',
                            }}
                          >
                            Artists
                          </Typography>
                          {artists.length > 0 ? (
                            artists.map((artist, idx) => {
                              return (
                                <ArtistItem
                                  width={100}
                                  artist={artist}
                                  key={idx}
                                />
                              )
                            })
                          ) : (
                            <Typography
                              align="left"
                              sx={{
                                fontSize: '14px',
                                color: theme.palette.grey[400],
                              }}
                            >
                              No Artists
                            </Typography>
                          )}
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '33%',
                            gap: '10px',
                          }}
                        >
                          <Typography
                            sx={{
                              color:
                                theme.palette.containerPrimary.contrastText,
                              fontSize: '16px',
                              fontWeight: '600',
                            }}
                          >
                            Category
                          </Typography>
                          {categories.length > 0 ? (
                            categories.map((cat) => {
                              return (
                                <Box sx={{ display: 'flex', gap: '10px' }}>
                                  <img
                                    width={48}
                                    height={48}
                                    src=""
                                    style={{ borderRadius: '4.8px' }}
                                    alt="not found"
                                  />
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: '16px',
                                      }}
                                    >
                                      Pop!
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: '14px',
                                        color: '#C1C1C1',
                                      }}
                                    >
                                      Nayeon
                                    </Typography>
                                  </Box>
                                </Box>
                              )
                            })
                          ) : (
                            <Typography
                              align="left"
                              sx={{
                                fontSize: '14px',
                                color: theme.palette.grey[400],
                              }}
                            >
                              No Categries
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Divider />
                <Box
                  sx={{
                    background: theme.palette.grey[600],
                    padding: '12px 16px',
                    borderBottomLeftRadius: '8px',
                    borderBottomRightRadius: '8px',
                    display: 'flex',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: '400',
                      color: theme.palette.grey[200],
                    }}
                  >
                    See all&nbsp;
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: '800',
                      color: theme.palette.grey[200],
                    }}
                  >
                    {licenses.length + artists.length}
                    &nbsp;
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: '400',
                      color: theme.palette.grey[200],
                    }}
                  >
                    results for &nbsp;
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: '800',
                      color: theme.palette.grey[200],
                    }}
                  >
                    "{keyword}"
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
          ml={'auto'}
          gap={1}
        >
          <AuthButton loading={loading} setLoading={setLoading} />
          {authorization?.loggedIn && (
            <Box
              ref={balanceRef}
              sx={{
                position: 'relative',
              }}
            >
              <SecondaryButton
                sx={{ width: 40, backgroundColor: `#FFFFFF1A` }}
                onClick={() => setShowBalance(!showBalance)}
              >
                <CardMedia
                  component={'img'}
                  image={UserCircleDarkIcon}
                  sx={{
                    width: '16px',
                    height: '16px',
                    objectFit: 'cover',
                  }}
                />
              </SecondaryButton>
              {showBalance && <BalanceMenu />}
            </Box>
          )}

          <Box
            ref={notificationRef}
            sx={{
              display: 'flex',
              position: 'relative',
            }}
          >
            <SecondaryButton
              sx={{
                width: 40,
                backgroundColor: `#FFFFFF1A`,
              }}
              onClick={() => setShowNotification(!showNotification)}
            >
              {notifications.length > 0 ? (
                <CardMedia
                  component={'img'}
                  image={NonEmptyNotificationDarkIcon}
                  sx={{
                    width: '16px',
                    height: '16px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <CardMedia
                  component={'img'}
                  image={NotificationDarkIcon}
                  sx={{
                    width: '16px',
                    height: '16px',
                    objectFit: 'cover',
                  }}
                />
              )}
            </SecondaryButton>
            {showNotification && <NotificationMenu />}
          </Box>
          {/* <DarkModeSwitch /> */}
          {authorization?.loggedIn && (
            <Box display={'flex'} position="relative">
              <SecondaryButton
                sx={{
                  width: 40,
                  backgroundColor: `#FFFFFF1A`,
                }}
                onClick={() => setShowCart(true)}
              >
                <CardMedia
                  component={'img'}
                  image={ShoppingCartIcon}
                  sx={{
                    width: '16px',
                    height: '16px',
                    objectFit: 'cover',
                  }}
                />
              </SecondaryButton>
              <Badge
                badgeContent={carts?.length}
                color="primary"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: theme.palette.text.primary,
                    right: 0,
                    top: 0,
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
      <CartDrawer showCart={showCart} setShowCart={setShowCart} />
    </Box>
  )
}
