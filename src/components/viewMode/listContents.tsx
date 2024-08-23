import { Box, CardMedia, Divider, Typography, useTheme } from '@mui/material'
import ExplicitDarkSelected from 'src/assets/images/explicit_dark_selected.png'
import { formatMilliseconds } from 'src/utils/utils'
import IconFavoriteActive from 'src/assets/musicplayer/favoriteactive.svg'
import IconFavorite from 'src/assets/musicplayer/favorite.svg'
import IconPurchase from 'src/assets/musicplayer/purchase.svg'
import IconPlay from 'src/assets/musicplayer/play.svg'
import IconPause from 'src/assets/musicplayer/pause.svg'
import IconPlus from 'src/assets/plus.svg'
import { ReactSVG } from 'react-svg'
import { useEffect, useState, useContext } from 'react'
import { GlobalMusicContext } from 'src/context/globalMusic'
import { likeOrDislikeLicense } from 'src/api'
import { ACCESS_TOKEN } from 'src/config'
import jwtDecode from 'jwt-decode'
import toast from 'react-hot-toast'
import { CommonLicenseDataIF, ListViewTypes, listingTypes } from 'src/interface'
import useUtils from 'src/hooks/useUtils'

interface Props {
  isPending?: boolean
  licenses: Array<any>
  listViewType: ListViewTypes
  handler: (license: any) => void
}

interface BaseFCIF {
  isPending: boolean
  listViewType: ListViewTypes
  license: any
  no: number
  handler: (license: any) => void
}

const BaseFC = ({
  isPending,
  listViewType,
  license,
  no,
  handler,
}: BaseFCIF) => {
  const commonLicenseData: CommonLicenseDataIF = license
  const theme = useTheme()
  const { addToCartHandler } = useUtils()
  const { favoriteLicenses, setFavoriteLicenses } =
    useContext(GlobalMusicContext)
  const [timeDiff, setTimeDiff] = useState<string>('0 mins ago')
  const [showIcon, setShowIcon] = useState<boolean>(false)
  const [isFav, setIsFav] = useState(false)
  const { isPlaying, setIsPlaying, globalMusic, setGlobalMusic } =
    useContext(GlobalMusicContext)

  const playHandler = (e) => {
    e.stopPropagation()
    if (globalMusic?.listedId !== commonLicenseData.listedId) {
      setGlobalMusic(commonLicenseData)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  useEffect(() => {
    const now = new Date().getTime()
    const createdAt = new Date(license.createdAt).getTime()
    const diffMillisecs = now - createdAt
    const diffSeconds = Math.floor(diffMillisecs / 1000)
    const diffMinutesTotal = Math.floor(diffSeconds / 60)
    const diffHoursTotal = Math.floor(diffMinutesTotal / 60)
    const diffDays = Math.floor(diffHoursTotal / 24)
    const diffHours = diffHoursTotal % 24

    let timeAgo = ''
    if (diffDays > 0) {
      timeAgo += `${diffDays} days `
    }
    if (diffHours > 0) {
      timeAgo += `${diffHours}h `
    }
    timeAgo += 'ago'
    setTimeDiff(timeAgo)
    const res = favoriteLicenses.filter((favLincense) => {
      return favLincense._id === license._id
    })
    setIsFav(res?.length > 0)
  }, [license, favoriteLicenses])

  const handleFavorite = async (e) => {
    e.stopPropagation()
    const ls = window.localStorage.getItem(ACCESS_TOKEN)
    if (ls !== 'undefined' && ls) {
      const decodedToken: any = jwtDecode(ls)
      const payload = decodedToken.payload
      const { success, msg, data } = await likeOrDislikeLicense(
        payload.accountAddress,
        license?.listedId,
      )
      if (success) setFavoriteLicenses(data)
      else toast.error(msg)
    } else toast.error('Something went wrong')
  }

  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      onMouseOver={() => {
        setShowIcon(true)
      }}
      onMouseLeave={() => {
        setShowIcon(false)
      }}
      sx={{
        borderRadius: 2.5,
        padding: '8px 0px',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: theme.palette.containerSecondary.main,
        },
      }}
    >
      {!showIcon ? (
        <Typography
          fontFamily={'var(--font-medium)'}
          width={'50px'}
          fontSize={16}
          color={theme.palette.text.secondary}
        >
          {no}
        </Typography>
      ) : (
        <Box
          sx={{
            width: '50px',
            pt: '10px',
          }}
          onClick={playHandler}
        >
          {isPlaying && license.listedId === globalMusic?.listedId ? (
            <ReactSVG src={IconPause} />
          ) : (
            <ReactSVG src={IconPlay} />
          )}
        </Box>
      )}
      <Box
        width={`${
          listViewType === ListViewTypes.COLLECTIONS_DETAIL
            ? `calc(100% - 130px)`
            : listViewType === ListViewTypes.LIKED
            ? `calc(70% - 130px)`
            : `calc(100% - 210px)`
        }`}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Box
          display={'flex'}
          alignItems={'center'}
          gap={1.5}
          onClick={() => handler(license)}
        >
          <CardMedia
            component={'img'}
            image={license.imagePath}
            sx={{
              width: 56,
              height: 56,
              borderRadius: 1.5,
              filter: isPending ? 'grayscale(1)' : 'inherit',
            }}
          />
          <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'flex-start'}
          >
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: '500',
                color: theme.palette.grey[50],
              }}
            >
              {license.licenseName}
            </Typography>
            <Box display={'flex'} alignItems={'center'} gap={'6px'}>
              <CardMedia
                className={'selectedImg'}
                image={ExplicitDarkSelected}
                component={'img'}
                sx={{ width: 21, height: 21 }}
              />
              {license.artists.map(
                (artist: { name: string }, index: number) => {
                  return (
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-base)',
                        fontSize: '14px',
                        color: theme.palette.text.secondary,
                        whiteSpace: 'nowrap',
                      }}
                      component={'span'}
                      key={index}
                    >
                      {`${artist.name} ${
                        license.artists?.length == index + 1 ? '' : ', '
                      }`}
                    </Typography>
                  )
                },
              )}
            </Box>
          </Box>
        </Box>
        {showIcon && (
          <Box
            sx={{
              display: 'flex',
              gap: '20px',
              padding: '0px 20px 0px 0px',
            }}
          >
            <>
              {isFav &&
                listViewType !== ListViewTypes.LIKED &&
                listViewType !== ListViewTypes.PROFILE && (
                  <ReactSVG
                    src={IconFavoriteActive}
                    onClick={(e) => handleFavorite(e)}
                  />
                )}
              {!isFav &&
                listViewType !== ListViewTypes.LIKED &&
                listViewType !== ListViewTypes.PROFILE && (
                  <ReactSVG
                    src={IconFavorite}
                    onClick={(e) => handleFavorite(e)}
                  />
                )}
              {listViewType === ListViewTypes.EXPLORE && (
                <ReactSVG src={IconPurchase} />
              )}
              {listViewType === ListViewTypes.COLLECTIONS_DETAIL && (
                <ReactSVG src={IconPlus} />
              )}
            </>
          </Box>
        )}
      </Box>
      {listViewType === ListViewTypes.LIKED && (
        <Box
          sx={{
            width: '30%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            fontFamily={'var(--font-base)'}
            fontSize={14}
            color={theme.palette.text.secondary}
          >
            {timeDiff}
          </Typography>
          {showIcon && (
            <Box
              sx={{
                display: 'flex',
                gap: '20px',
                padding: '0px 20px 0px 0px',
              }}
            >
              <>
                {isFav ? (
                  <ReactSVG
                    src={IconFavoriteActive}
                    onClick={(e) => handleFavorite(e)}
                  />
                ) : (
                  <ReactSVG
                    src={IconFavorite}
                    onClick={(e) => handleFavorite(e)}
                  />
                )}
                <ReactSVG
                  src={IconPurchase}
                  onClick={() => addToCartHandler(commonLicenseData)}
                />
              </>
            </Box>
          )}
        </Box>
      )}
      {(listViewType === ListViewTypes.PROFILE ||
        listViewType === ListViewTypes.EXPLORE) && (
        <Typography
          sx={{
            width: '80px',
            textAlign: 'left',
            fontSize: '14px',
            fontWeight: '400',
            color: theme.palette.grey[400],
          }}
        >
          {license.tempo}
        </Typography>
      )}
      <Typography fontSize={16} color={theme.palette.text.primary}>
        {formatMilliseconds(license.length)}
      </Typography>
    </Box>
  )
}

export default function ListContents({
  isPending = false,
  licenses,
  listViewType,
  handler,
}: Props) {
  const theme = useTheme()
  return (
    <>
      {licenses.length > 0 && (
        <Box textAlign={'center'}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 0px',
            }}
          >
            <Typography
              sx={{
                width: '50px',
                fontSize: '16px',
                fontWeight: '600',
                color: theme.palette.grey[400],
              }}
            >
              #
            </Typography>
            <Typography
              sx={{
                width: `${
                  listViewType === ListViewTypes.COLLECTIONS_DETAIL
                    ? `calc(100% - 130px)`
                    : listViewType === ListViewTypes.LIKED
                    ? `calc(70% - 130px)`
                    : `calc(100% - 210px)`
                }`,
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: '400',
                color: theme.palette.grey[400],
              }}
            >
              Title
            </Typography>
            {listViewType === ListViewTypes.LIKED && (
              <Typography
                sx={{
                  width: '30%',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '400',
                  color: theme.palette.grey[400],
                }}
              >
                Date added
              </Typography>
            )}
            {(listViewType === ListViewTypes.PROFILE ||
              listViewType === ListViewTypes.EXPLORE) && (
              <Typography
                sx={{
                  width: '80px',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '400',
                  color: theme.palette.grey[400],
                }}
              >
                BPM
              </Typography>
            )}
            <Typography
              sx={{
                width: '80px',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: '400',
                color: theme.palette.grey[400],
              }}
            >
              Duration
            </Typography>
          </Box>
          <Divider />
          <Box mt={'10px'}>
            {licenses.map((license, idx) => {
              return (
                <BaseFC
                  isPending={isPending}
                  listViewType={listViewType}
                  license={license}
                  key={idx}
                  no={idx + 1}
                  handler={handler}
                />
              )
            })}
          </Box>
        </Box>
      )}
    </>
  )
}
