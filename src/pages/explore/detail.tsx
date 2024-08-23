import {
  Box,
  CardMedia,
  Divider,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import { AvatarImage, Container, PublicAvatarImageContainer } from './style'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCallback, useEffect, useMemo, useState } from 'react'
import OpenBrowserDarkIcon from 'src/assets/images/open_browser_dark.png'
import LinkDarkIcon from 'src/assets/images/link_dark.png'
import ShareDarkIcon from 'src/assets/images/share_dark.png'
import ThreeDotWhiteIcon from 'src/assets/images/three_dot_white.png'
import SecondaryButton from 'src/components/buttons/secondary-button'
import PrimaryButton from 'src/components/buttons/primary-button'
import ViewModeTools from 'src/components/viewMode/tools'
import { ListViewTypes, ViewMode } from 'src/interface'
import { topTimeOptions } from 'src/config'
import GridContents from 'src/components/viewMode/gridContents'
import ListContents from 'src/components/viewMode/listContents'
import { searchLicenses } from '../../api'
import TypeTool from 'src/components/navbar/typeTool'
import TempoTool from 'src/components/navbar/tempoTool'
import DurationTool from 'src/components/navbar/durationTool'
import {
  topActivitiesItems,
  topGenresItems,
  topMoodsItems,
} from 'src/constants'
import { exploreItemTypes } from './exploreItem'
import ImageLicense from 'src/assets/images/license_bg.png'
import { generateRGBValue } from 'src/utils/utils'
import SharingMenu from '../purchasing/sharingMenu'
import { CopyToClipboard } from 'react-copy-to-clipboard'

export default function ExploreDetails() {
  const navigate = useNavigate()
  const theme = useTheme()
  const [clicked, setClicked] = useState(false)
  const [searchParams] = useSearchParams()
  const itemType = searchParams.get('type')
  const name = searchParams.get('name')
  const index = searchParams.get('number')

  const [licenses, setLicenses] = useState<Array<any>>([])
  const [searchedLicenses, setSearchedLicenses] = useState<Array<any>>([])
  const [curView, setCurView] = useState<ViewMode>(ViewMode.GridView)
  const [keyword, setKeyword] = useState<string>('')
  const [sortingTime, setSortingTime] = useState(topTimeOptions[0].label)

  const [minMins, setMinMins] = useState(0)
  const [minSecs, setMinSecs] = useState(0)
  const [maxMins, setMaxMins] = useState(0)
  const [maxSecs, setMaxSecs] = useState(0)
  const [slowChecked, setSlowChecked] = useState(false)
  const [moderateChecked, setModerateChecked] = useState(false)
  const [fastChecked, setFastChecked] = useState(false)
  const [veryFastChecked, setVeryFastChecked] = useState(false)
  const [insideClicked, setInsideClicked] = useState(false)
  const [licensingTypeFilter, setLicensingTypeFilter] = useState<
    Array<boolean>
  >([false, false, false, false, false, false])
  const [imageUrl, setImageUrl] = useState<string>('')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)

  const sortingByTime = (event) => {
    setSortingTime(event.target.value)
  }

  const searchHandler = (value) => {
    setKeyword(value)
    if (value !== '') {
      const tmp = licenses.filter((license) => {
        if (license.licenseName.toLowerCase().includes(value.toLowerCase())) {
          return true
        } else {
          return false
        }
      })
      setSearchedLicenses(tmp)
    } else {
      setSearchedLicenses(licenses)
    }
  }

  const handleFilterApply = useCallback(() => {
    const licneseFilter = {
      licenseName: keyword,
      isFilter: true,
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
        setLicenses(res.data.data)
        setSearchedLicenses(res.data.data)
      }
    })
  }, [
    keyword,
    minMins,
    minSecs,
    maxMins,
    maxSecs,
    slowChecked,
    moderateChecked,
    fastChecked,
    veryFastChecked,
    licensingTypeFilter,
  ])

  const filterElement = useMemo(() => {
    const clearFiltersHandler = () => {
      setLicensingTypeFilter([false, false, false, false, false, false])
      setMinMins(0)
      setMinSecs(0)
      setMaxMins(0)
      setMaxSecs(0)
      setFastChecked(false)
      setVeryFastChecked(false)
      setModerateChecked(false)
      setSlowChecked(false)
    }

    return (
      <Box display={'flex'} alignItems={'center'} gap={1}>
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
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: '400',
            color: theme.palette.success.light,
            cursor: 'pointer',
          }}
          onClick={clearFiltersHandler}
        >
          Clear Filters
        </Typography>
      </Box>
    )
  }, [
    minMins,
    minSecs,
    maxMins,
    maxSecs,
    slowChecked,
    moderateChecked,
    fastChecked,
    veryFastChecked,
    licensingTypeFilter,
    theme,
    handleFilterApply,
  ])

  useEffect(() => {
    try {
      switch (itemType) {
        case exploreItemTypes[0]:
          setImageUrl(topGenresItems.find((item) => item.name == name).imageUrl)
          break
        case exploreItemTypes[1]:
          setImageUrl(topMoodsItems.find((item) => item.name == name).imageUrl)
          break
        case exploreItemTypes[2]:
          setImageUrl(
            topActivitiesItems.find((item) => item.name == name).imageUrl,
          )
          break
        default:
          setImageUrl(ImageLicense)
          break
      }
    } catch (e) {
      setImageUrl(ImageLicense)
    }
  }, [name, itemType])

  const sharingMenuHandler = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  useEffect(() => {
    const licneseFilter = {
      type: itemType,
      name: name,
      licenseName: '',
      isFilter: false,
      duration: {
        min: 0,
        max: 0,
      },
      tempo: {
        slowChecked: false,
        moderateChecked: false,
        fastChecked: false,
        veryFastChecked: false,
      },
      licensingTypeFilter: [false, false, false, false, false, false],
    }
    searchLicenses(licneseFilter).then((res) => {
      if (res.status === 200 && res.data.success) {
        setLicenses(res.data.data)
        setSearchedLicenses(res.data.data)
      }
    })
  }, [itemType, name])

  return (
    <Box display={'flex'} justifyContent={'center'}>
      <Container>
        <Box
          sx={{
            width: '100%',
            textAlign: 'center',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 250,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              height: 250,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <CardMedia
              component={'img'}
              image={imageUrl}
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
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(10px)',
                transform: 'translate3d(0px, 0px, 0px)',
              }}
            />
          </Box>
        </Box>

        <Box sx={{ marginLeft: '100px', borderRadius: '12px' }}>
          <PublicAvatarImageContainer sx={{ borderRadius: '12px' }}>
            <Box
              sx={{
                width: '100%',
                objectFit: 'cover',
                position: 'relative',
                borderRadius: 8,
                backgroundColor:
                  imageUrl == ImageLicense
                    ? generateRGBValue(Number(index))
                    : 'none',
              }}
            >
              <CardMedia
                component={'img'}
                image={imageUrl}
                sx={{
                  width: '100%',
                  height: '100%',
                  padding: '0px',
                  border: `8px solid #111111`,
                  borderRadius: 3,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: 100,
                  zIndex: 1,
                  background:
                    'linear-gradient(180deg, rgb(0 0 0 / 79%) 0%, rgba(0, 0, 0, 0) 100%)',
                }}
              ></Box>
            </Box>
          </PublicAvatarImageContainer>
        </Box>
        <Box sx={{ padding: '0px 100px', mb: 4 }}>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Box display={'flex'} flexDirection={'column'} gap={1} pt={2}>
              <Typography
                variant="h2"
                sx={{
                  maxWidth: '300px',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textAlign: 'left',
                  color: theme.palette.text.primary,
                }}
              >
                {name}
              </Typography>

              <Box
                display={'flex'}
                alignItems={'center'}
                sx={{ cursor: 'pointer' }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    maxWidth: '300px',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textAlign: 'left',
                    color: theme.palette.text.secondary,
                  }}
                >
                  {itemType} · Listings by&nbsp;
                </Typography>
                <Typography variant="body2" color={theme.palette.success.light}>
                  Nitrility
                </Typography>

                <CardMedia
                  component={'img'}
                  image={OpenBrowserDarkIcon}
                  sx={{ width: 16, height: 16 }}
                />
              </Box>

              <Box display={'flex'} flexDirection={'column'}>
                <Typography
                  sx={{
                    fontSize: 14,
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textAlign: 'left',
                    lineHeight: '24px',
                    color: theme.palette.text.secondary,
                  }}
                >
                  Literally, popular music. Good rhythms, a catchy melody, pop
                  is memorable and easy to sing along to.
                </Typography>

                <Typography
                  sx={{
                    fontSize: 14,
                    lineHeight: '24px',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textAlign: 'left',
                    color: theme.palette.text.secondary,
                  }}
                >
                  Discover our high-quality, diverse catalog.
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems={'center'} gap={1}>
              <CopyToClipboard
                text={window.location.href}
                onCopy={() => setClicked(true)}
              >
                <Tooltip title={clicked ? 'Link Copied' : 'Copy Link'}>
                  <SecondaryButton>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        borderRadius: 2,
                        p: '6px 8px',
                      }}
                    >
                      <CardMedia
                        component={'img'}
                        image={LinkDarkIcon}
                        sx={{ width: 18, height: 18 }}
                      />
                    </Box>
                  </SecondaryButton>
                </Tooltip>
              </CopyToClipboard>

              <SecondaryButton onClick={sharingMenuHandler}>
                <Box
                  display={'flex'}
                  alignItems={'center'}
                  gap={1}
                  sx={{
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  <CardMedia
                    component={'img'}
                    image={ShareDarkIcon}
                    sx={{ width: 18, height: 18 }}
                  />
                  Share
                </Box>
              </SecondaryButton>
              <SharingMenu
                sharedURL={window.location.href}
                open={openMenu}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
              />
              <SecondaryButton>
                <CardMedia
                  component={'img'}
                  image={ThreeDotWhiteIcon}
                  sx={{
                    width: 17,
                    objectFit: 'cover',
                  }}
                />
              </SecondaryButton>
            </Box>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ padding: '0px 100px' }}>
          <ViewModeTools
            totalAmount={`${searchedLicenses.length} licenses`}
            filterElement={filterElement}
            selected={sortingTime}
            handleOptionChange={sortingByTime}
            options={topTimeOptions}
            keyword={keyword}
            handleSearch={searchHandler}
            searchPlaceholder="Search licenses..."
            viewMode={curView}
            setViewMode={setCurView}
          />
          {curView === ViewMode.GridView && (
            <GridContents
              licenses={searchedLicenses}
              handleClickLicnese={(license) => {
                navigate(`/purchase/${license.listedId}`)
              }}
            />
          )}
          {curView === ViewMode.ListView && (
            <ListContents
              listViewType={ListViewTypes.EXPLORE}
              licenses={searchedLicenses}
              handler={(license) => navigate(`/purchase/${license.listedId}`)}
            />
          )}
        </Box>
      </Container>
    </Box>
  )
}
