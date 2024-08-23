import {
  CardMedia,
  List,
  ListItemButton,
  Typography,
  styled,
  useTheme,
} from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { SellerAccountDataContext } from 'src/context/sellerData'
import useAuth from 'src/hooks/useAuth'
import HomeDarkDefaultIcon from 'src/assets/images/home/home_dark_default.svg'
import HomeDarkSelectedIcon from 'src/assets/images/home/home_dark_selected.svg'
import ExploreDarkDefaultIcon from 'src/assets/images/home/explore_dark_default.svg'
import ExploreDarkSelectedIcon from 'src/assets/images/home/explore_dark_selected.svg'
import ResourcesDarkDefaultIcon from 'src/assets/images/home/resources_dark_default.svg'
import ResourcesDarkSelectedIcon from 'src/assets/images/home/resources_dark_selected.svg'
import ProfileDarkDefaultIcon from 'src/assets/images/home/profile_dark_default.svg'
import ProfileDarkSelectedIcon from 'src/assets/images/home/profile_dark_selected.svg'
import SettingDarkDefaultIcon from 'src/assets/images/home/setting_dark_default.svg'
import SettingDarkSelectedIcon from 'src/assets/images/home/setting_dark_selected.svg'
import SellDarkIcon from 'src/assets/images/home/sell_dark_default.svg'
import SelectedFlag from 'src/assets/images/home/selected_leftsidebar.png'
import { ACCESS_TOKEN } from 'src/config'
import jwtDecode from 'jwt-decode'
import { RoleTypes } from 'src/interface'

interface StyledProps {
  selected?: boolean
}

const StyledListItemText = styled(Typography)<StyledProps>(
  ({ theme, selected }) => ({
    transition: 'color 0.3s ease 0s',
    marginLeft: '16px',
    color: theme.palette.text.primary,
  }),
)

const StyledListItemButton = styled(ListItemButton)(() => ({
  paddingLeft: '24px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
}))

enum LeftSidebarItems {
  Home = 'Home',
  Explore = 'Explore',
  Resources = 'Resources',
  Profile = 'Profile',
  Settings = 'Settings',
  Sell = 'Sell',
}

export const menuItems = [
  {
    label: LeftSidebarItems.Home,
    href: '/',
    darkDefaultIcon: (
      <CardMedia
        image={HomeDarkDefaultIcon}
        component={'img'}
        sx={{ width: 24, objectFit: 'cover' }}
      />
    ),
    darkSelectedtIcon: (
      <CardMedia
        image={HomeDarkSelectedIcon}
        component={'img'}
        sx={{ width: 24, objectFit: 'cover' }}
      />
    ),
    lightDefaultIcon: (
      <CardMedia
        image={HomeDarkDefaultIcon}
        component={'img'}
        sx={{ width: 24, objectFit: 'cover' }}
      />
    ),
    lightSelectedIcon: (
      <CardMedia
        image={HomeDarkSelectedIcon}
        component={'img'}
        sx={{ width: 24, objectFit: 'cover' }}
      />
    ),
  },
  {
    label: LeftSidebarItems.Explore,
    href: '/explore',
    darkDefaultIcon: (
      <CardMedia
        image={ExploreDarkDefaultIcon}
        component={'img'}
        sx={{ width: 24, objectFit: 'cover' }}
      />
    ),
    darkSelectedtIcon: (
      <CardMedia
        image={ExploreDarkSelectedIcon}
        component={'img'}
        sx={{ width: 24, objectFit: 'cover' }}
      />
    ),
    lightDefaultIcon: (
      <CardMedia
        image={ExploreDarkDefaultIcon}
        component={'img'}
        sx={{ width: 24, objectFit: 'cover' }}
      />
    ),
    lightSelectedIcon: (
      <CardMedia
        image={ExploreDarkSelectedIcon}
        component={'img'}
        sx={{ width: 24, objectFit: 'cover' }}
      />
    ),
  },
  {
    label: LeftSidebarItems.Resources,
    href: '/resources',
    darkDefaultIcon: (
      <CardMedia
        image={ResourcesDarkDefaultIcon}
        component={'img'}
        sx={{ width: 24, objectFit: 'cover' }}
      />
    ),
    darkSelectedtIcon: (
      <CardMedia
        image={ResourcesDarkSelectedIcon}
        component={'img'}
        sx={{ width: 24, objectFit: 'cover' }}
      />
    ),
    lightDefaultIcon: (
      <CardMedia
        image={ResourcesDarkDefaultIcon}
        component={'img'}
        sx={{ width: 24, objectFit: 'cover' }}
      />
    ),
    lightSelectedIcon: (
      <CardMedia
        image={ResourcesDarkSelectedIcon}
        component={'img'}
        sx={{ width: 24, objectFit: 'cover' }}
      />
    ),
  },
  {
    label: LeftSidebarItems.Profile,
    href: '/profile',
    darkDefaultIcon: (
      <CardMedia
        image={ProfileDarkDefaultIcon}
        component={'img'}
        sx={{ width: 24, objectFit: 'cover' }}
      />
    ),
    darkSelectedtIcon: (
      <CardMedia
        image={ProfileDarkSelectedIcon}
        component={'img'}
        sx={{ width: 24, objectFit: 'cover' }}
      />
    ),
    lightDefaultIcon: (
      <CardMedia
        image={ProfileDarkDefaultIcon}
        component={'img'}
        sx={{ width: 24, objectFit: 'cover' }}
      />
    ),
    lightSelectedIcon: (
      <CardMedia
        image={ProfileDarkSelectedIcon}
        component={'img'}
        sx={{ width: 24, objectFit: 'cover' }}
      />
    ),
  },
  {
    label: LeftSidebarItems.Settings,
    href: '/settings',
    darkDefaultIcon: (
      <CardMedia
        image={SettingDarkDefaultIcon}
        component={'img'}
        sx={{ width: 24, objectFit: 'cover' }}
      />
    ),
    darkSelectedtIcon: (
      <CardMedia
        image={SettingDarkSelectedIcon}
        component={'img'}
        sx={{ width: 24, objectFit: 'cover' }}
      />
    ),
    lightDefaultIcon: (
      <CardMedia
        image={SettingDarkDefaultIcon}
        component={'img'}
        sx={{ width: 24, objectFit: 'cover' }}
      />
    ),
    lightSelectedIcon: (
      <CardMedia
        image={SettingDarkSelectedIcon}
        component={'img'}
        sx={{ width: 24, objectFit: 'cover' }}
      />
    ),
  },
]

export default function Application() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const darkMode = theme.palette.mode === 'dark' ? true : false
  const { checkAuthAndSignIn } = useAuth()
  const [selectedItem, setSelectedItem] = React.useState<string>('/')
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  const [sellerAccountData, setSellerAccountData] = React.useContext(
    SellerAccountDataContext,
  )

  useEffect(() => {
    const item = `/${location.pathname.split('/')[1]}`
    setSelectedItem(item)
  }, [location.pathname])

  const checkIfSelected = (menu) => {
    return selectedItem === menu.href
  }

  return (
    <List
      sx={{
        width: '240px',
        maxWidth: 240,
        padding: 0,
      }}
      component="nav"
    >
      {menuItems.map((menu, idx) => {
        return (
          <React.Fragment key={idx}>
            {menu.label === LeftSidebarItems.Profile ||
            menu.label === LeftSidebarItems.Settings ? (
              <StyledListItemButton
                onClick={async () => {
                  const { loggedIn, redirected } = await checkAuthAndSignIn()
                  if (loggedIn) {
                    setSelectedItem(menu.href)

                    if (menu.label === LeftSidebarItems.Profile) {
                      let accountAddress =
                        authorization?.currentUser?.accountAddress
                      if (!accountAddress) {
                        const ls = window.localStorage.getItem(ACCESS_TOKEN)
                        const decodedToken: any = jwtDecode(ls)
                        const payload = decodedToken.payload
                        accountAddress = payload.accountAddress
                      }
                      const url = menu.href + '/' + accountAddress
                      navigate(url)
                    } else {
                      navigate(menu.href)
                    }
                  } else {
                    if (redirected) navigate('/')
                  }
                }}
              >
                {checkIfSelected(menu)
                  ? darkMode
                    ? menu.darkSelectedtIcon
                    : menu.lightSelectedIcon
                  : darkMode
                  ? menu.darkDefaultIcon
                  : menu.lightDefaultIcon}
                <StyledListItemText
                  variant="h3"
                  selected={checkIfSelected(menu)}
                >
                  {menu.label}
                </StyledListItemText>

                {checkIfSelected(menu) && (
                  <CardMedia
                    component={'img'}
                    sx={{
                      position: 'absolute',
                      left: 0,
                      width: 3,
                      height: 24,
                    }}
                    image={SelectedFlag}
                  />
                )}
              </StyledListItemButton>
            ) : (
              <React.Fragment>
                <StyledListItemButton
                  onClick={() => {
                    setSelectedItem(menu.href)
                    navigate(menu.href)
                  }}
                >
                  {checkIfSelected(menu)
                    ? darkMode
                      ? menu.darkSelectedtIcon
                      : menu.lightSelectedIcon
                    : darkMode
                    ? menu.darkDefaultIcon
                    : menu.lightDefaultIcon}
                  <StyledListItemText
                    variant="h3"
                    selected={checkIfSelected(menu)}
                  >
                    {menu.label}
                  </StyledListItemText>
                  {checkIfSelected(menu) && (
                    <CardMedia
                      component={'img'}
                      sx={{
                        position: 'absolute',
                        left: 0,
                        width: 3,
                        height: 24,
                      }}
                      image={SelectedFlag}
                    />
                  )}
                </StyledListItemButton>
              </React.Fragment>
            )}
          </React.Fragment>
        )
      })}
      {authorization?.currentUser?.role === RoleTypes.Seller && (
        <>
          <StyledListItemButton
            onClick={() => {
              setSelectedItem('/sell')
              const account = sellerAccountData.find(
                (item) => item?.associatedEmail,
              )
              navigate('/sell', {
                state: {
                  platformTitle: account.platformTitle,
                  sellerId: account.sellerId,
                },
              })
            }}
          >
            {selectedItem === '/sell' ? (
              darkMode ? (
                <CardMedia
                  image={SellDarkIcon}
                  component={'img'}
                  sx={{ width: 24, objectFit: 'cover' }}
                />
              ) : (
                <CardMedia
                  image={SellDarkIcon}
                  component={'img'}
                  sx={{ width: 24, objectFit: 'cover' }}
                />
              )
            ) : darkMode ? (
              <CardMedia
                image={SellDarkIcon}
                component={'img'}
                sx={{ width: 24, objectFit: 'cover' }}
              />
            ) : (
              <CardMedia
                image={SellDarkIcon}
                component={'img'}
                sx={{ width: 24, objectFit: 'cover' }}
              />
            )}
            <StyledListItemText
              variant="h3"
              selected={selectedItem === '/sell'}
            >
              Sell
            </StyledListItemText>
            {selectedItem === '/sell' && (
              <CardMedia
                component={'img'}
                sx={{
                  position: 'absolute',
                  left: 0,
                  width: 3,
                  height: 24,
                }}
                image={SelectedFlag}
              />
            )}
          </StyledListItemButton>
        </>
      )}
    </List>
  )
}
