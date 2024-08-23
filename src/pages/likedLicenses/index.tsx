import React, { useContext, useEffect, useState } from 'react'
import { Box, Typography, Grid, Divider } from '@mui/material'
import ImageLikedSoundsAvatar from 'src/assets/images/liked-sounds-avatar.png'
import { GlobalMusicContext } from 'src/context/globalMusic'
import { useNavigate } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import { toast } from 'react-hot-toast'
import useAuth from 'src/hooks/useAuth'
import { ACCESS_TOKEN } from 'src/config'
import jwtDecode from 'jwt-decode'
import { likeOrDislikeLicense } from 'src/api'
import defaultSrc from '../../assets/images/profile/profile_banner_dark.png'
import {
  AvatarImage,
  UploadImage,
  UploadImageContainer,
} from '../profile/style'
import { CommonLicenseDataIF, ListViewTypes, ViewMode } from 'src/interface'
import { likedOptions } from 'src/config'
import ViewModeTools from 'src/components/viewMode/tools'
import GridContents from 'src/components/viewMode/gridContents'
import ListContents from 'src/components/viewMode/listContents'

const PublicAvatarImageContainer = styled(Grid)(({ theme }) => ({
  height: theme.spacing(18),
  width: theme.spacing(18),
  background: theme.palette.secondary.light,
  marginTop: theme.spacing(-13),
  borderRadius: '15px',
  position: 'sticky',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  maxWidth: '100%',
  overflow: 'hidden',
  transition: 'transform .5s ease',
}))

const Container = styled(Box)(() => ({
  width: '100%',
  textAlign: 'center',
  minHeight: ' 100vh',
}))

const PageContent = styled(Box)(() => ({
  padding: '0px 100px',
  display: 'flex',
  flexDirection: 'column',
}))

export default function LikedLicenses() {
  const navigate = useNavigate()
  const { checkAuthAndSignIn } = useAuth()
  const {
    isPlaying,
    setIsPlaying,
    globalMusic,
    setGlobalMusic,
    favoriteLicenses,
    setFavoriteLicenses,
  } = useContext(GlobalMusicContext)
  const [keyword, setKeyword] = useState<string>('')
  const [sortingTime, setSortingTime] = useState(likedOptions[0].label)
  const [curView, setCurView] = useState<ViewMode>(ViewMode.GridView)
  const [searchedFavLincenses, setSearchedFavLincenses] = useState<Array<any>>(
    [],
  )
  const sortingByTime = (event) => {
    setSortingTime(event.target.value)
  }

  const searchHandler = (value) => {
    setKeyword(value)
    if (value !== '') {
      const tmp = favoriteLicenses.filter((license) => {
        if (license.licenseName.toLowerCase().includes(value.toLowerCase())) {
          return true
        } else {
          return false
        }
      })
      setSearchedFavLincenses(tmp)
    } else {
      setSearchedFavLincenses(favoriteLicenses)
    }
  }

  const favoriteHandler = async (listedId: number) => {
    const { loggedIn, redirected } = await checkAuthAndSignIn()
    if (loggedIn) {
      const ls = window.localStorage.getItem(ACCESS_TOKEN)
      if (ls !== 'undefined' && ls) {
        const decodedToken: any = jwtDecode(ls)
        const payload = decodedToken.payload
        const { success, data, msg } = await likeOrDislikeLicense(
          payload.accountAddress,
          listedId,
        )
        if (success) setFavoriteLicenses(data)
        else toast.error(msg)
      } else toast.error('Something went wrong')
    } else {
      if (redirected) navigate('/')
    }
  }

  const playHandler = (license) => {
    const commonLicenseData: CommonLicenseDataIF = license
    if (globalMusic?.listedId !== commonLicenseData.listedId) {
      setGlobalMusic(commonLicenseData)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  useEffect(() => {
    setSearchedFavLincenses(favoriteLicenses)
  }, [favoriteLicenses])

  return (
    <Box display={'flex'} justifyContent={'center'}>
      <Container>
        <UploadImageContainer>
          <UploadImage
            sx={{
              height: '100%',
              width: '100%',
            }}
            src={defaultSrc}
          />
        </UploadImageContainer>
        <Box sx={{ marginLeft: '82px' }}>
          <PublicAvatarImageContainer>
            <AvatarImage
              src={ImageLikedSoundsAvatar}
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: '15px',
                padding: '0px',
                border: `8px solid #111111`,
              }}
            />
          </PublicAvatarImageContainer>
        </Box>
        <Typography
          sx={{
            textAlign: 'left',
            fontSize: '32px',
            lineHeight: '40px',
            fontWeight: '600',
            marginLeft: '82px',
            marginTop: '12px',
            marginBottom: '32px',
          }}
        >
          Liked Sounds
        </Typography>
        <Divider />
        <PageContent>
          <ViewModeTools
            totalAmount={`${searchedFavLincenses.length} licenses`}
            selected={sortingTime}
            handleOptionChange={sortingByTime}
            options={likedOptions}
            keyword={keyword}
            handleSearch={searchHandler}
            searchPlaceholder="Search licenses..."
            viewMode={curView}
            setViewMode={setCurView}
          />
          {curView === ViewMode.GridView ? (
            <GridContents
              licenses={searchedFavLincenses}
              handleClickLicnese={(license) =>
                navigate(`/purchase/${license.listedId}`)
              }
            />
          ) : (
            <ListContents
              listViewType={ListViewTypes.LIKED}
              licenses={searchedFavLincenses}
              handler={(license) => navigate(`/purchase/${license.listedId}`)}
            />
          )}
        </PageContent>
      </Container>
    </Box>
  )
}
