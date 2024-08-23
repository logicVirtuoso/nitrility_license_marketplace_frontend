import { Box, CardMedia, Typography, useTheme } from '@mui/material'
import GroupDarkIcon from 'src/assets/images/purchasing/group_dark.png'
import ViewDarkIcon from 'src/assets/images/purchasing/view_dark.png'
import HeartDarkIcon from 'src/assets/images/heart_dark.png'
import ShareDarkIcon from 'src/assets/images/purchasing/share_dark.png'
import { useContext, useEffect, useState } from 'react'
import { getAdditionalInfo, likeOrDislikeLicense } from 'src/api'
import SharingMenu from './sharingMenu'
import SecondaryButton from 'src/components/buttons/secondary-button'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { GlobalMusicContext } from 'src/context/globalMusic'
import toast from 'react-hot-toast'
import { CLIENT_URL } from 'src/config'

interface Props {
  listedId: number
}

export default function AdditionalInfo({ listedId }: Props) {
  const theme = useTheme()
  const [info, setInfo] = useState({
    totalViewers: 0,
    totalOwners: 0,
    totalLikers: 0,
  })
  const [isFavorite, setFavorite] = useState<boolean>(false)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  const { favoriteLicenses, setFavoriteLicenses } =
    useContext(GlobalMusicContext)

  const sharingMenuHandler = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const favoriteHandler = async () => {
    if (authorization.loggedIn) {
      setFavorite(!isFavorite)
      const { success, data } = await likeOrDislikeLicense(
        authorization.currentUser.accountAddress,
        listedId,
      )
      if (success) setFavoriteLicenses(data)
    } else {
      toast.error('Please login first')
    }
  }

  useEffect(() => {
    if (favoriteLicenses?.find((obj) => obj?.listedId == listedId)) {
      setFavorite(true)
    } else {
      setFavorite(false)
    }
  }, [favoriteLicenses, listedId])

  useEffect(() => {
    getAdditionalInfo(listedId).then((data) => setInfo(data))
  }, [listedId])

  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent={'space-between'}
    >
      <Box display={'flex'} alignItems={'center'} gap={2}>
        <Box display={'flex'} alignItems={'center'} gap={'3px'}>
          <CardMedia
            component={'img'}
            image={GroupDarkIcon}
            sx={{
              width: 14,
              objectFit: 'cover',
            }}
          />
          <Typography
            sx={{
              color: theme.palette.grey[200],
              fontFamily: 'var(--font-medium)',
              fontSize: '14px',
            }}
          >
            {`${info.totalOwners} Owners`}
          </Typography>
        </Box>

        <Box display={'flex'} alignItems={'center'} gap={'3px'}>
          <CardMedia
            component={'img'}
            image={ViewDarkIcon}
            sx={{
              width: 14,
              objectFit: 'cover',
            }}
          />
          <Typography
            sx={{
              color: theme.palette.grey[200],
              fontFamily: 'var(--font-medium)',
              fontSize: '14px',
            }}
          >
            {`${info.totalViewers} viewers`}
          </Typography>
        </Box>

        <Box display={'flex'} alignItems={'center'} gap={'3px'}>
          <CardMedia
            component={'img'}
            image={HeartDarkIcon}
            sx={{
              width: 14,
              objectFit: 'cover',
            }}
          />
          <Typography
            sx={{
              color: theme.palette.grey[200],
              fontFamily: 'var(--font-medium)',
              fontSize: '14px',
            }}
          >
            {`${info.totalLikers} likes`}
          </Typography>
        </Box>
      </Box>

      <Box display={'flex'} alignItems={'center'} gap={1}>
        <SecondaryButton onClick={() => favoriteHandler()}>
          {isFavorite ? (
            <FavoriteIcon
              sx={{
                color: 'rgb(235, 92, 187)',
                '&:hover': {
                  color: '#fff',
                  transform: 'scale(1.08)',
                },
              }}
            />
          ) : (
            <FavoriteBorderIcon
              sx={{
                color: '#706f6f',
                '&:hover': {
                  color: '#fff',
                  transform: 'scale(1.08)',
                },
              }}
            />
          )}
        </SecondaryButton>

        <SecondaryButton onClick={sharingMenuHandler}>
          <CardMedia
            component={'img'}
            image={ShareDarkIcon}
            sx={{
              width: 14,
              objectFit: 'cover',
            }}
          />
          <Typography
            sx={{
              color: theme.palette.grey[200],
              fontFamily: 'var(--font-medium)',
              fontSize: '14px',
            }}
          >
            Share
          </Typography>
        </SecondaryButton>
      </Box>
      <SharingMenu
        sharedURL={`${CLIENT_URL}/purchase/${listedId}`}
        open={openMenu}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
      />
    </Box>
  )
}
