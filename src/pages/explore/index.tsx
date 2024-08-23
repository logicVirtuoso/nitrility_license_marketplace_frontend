import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Box,
  Typography,
  MenuItem,
  InputAdornment,
  CardMedia,
} from '@mui/material'
import {
  StyledSelectFC,
  StyledOutlinedInputFC,
} from 'src/components/styledInput'
import { useTheme } from '@mui/material/styles'
import { topTimeOptions } from '../../config'
import { getGenresList } from 'src/api'
import Grid from '@mui/material/Unstable_Grid2'
import ExploreItem, { ExploreItemType } from './exploreItem'
import SecondaryButton from 'src/components/buttons/secondary-button'
import IconSearch from 'src/assets/search.svg'
import IconGrid from '../../assets/grid.svg'
import IconList from '../../assets/list.svg'
import ImageLicense from 'src/assets/images/license_bg.png'
import { ReactSVG } from 'react-svg'
import PrimaryButton from 'src/components/buttons/primary-button'
import { ViewMode } from 'src/interface'
import BackgroundImage from 'src/assets/images/explore/background.png'
import {
  allGenresItems,
  topActivitiesItems,
  topGenresItems,
  topMoodsItems,
} from 'src/constants'

const LOAD_COUNT = 10

export default function Explore() {
  const theme = useTheme()
  const exploreRef = useRef(null)
  const [expandGenres, setExpendGenres] = useState<boolean>(false)
  const [expandMoods, setExpendMoods] = useState<boolean>(false)
  const [expandActivities, setExpendActivities] = useState<boolean>(false)
  const [sortGenres, setSortGenres] = useState<string>(topTimeOptions[0].label)
  const [sortMoods, setSortMoods] = useState<string>(topTimeOptions[0].label)
  const [sortActivities, setSortActivities] = useState<string>(
    topTimeOptions[0].label,
  )
  const [genresViewMode, setGenresViewMode] = useState<ViewMode>(
    ViewMode.GridView,
  )
  const [moodsViewMode, setMoodsViewMode] = useState<ViewMode>(
    ViewMode.GridView,
  )
  const [activitiesViewMode, setActivitiesViewMode] = useState<ViewMode>(
    ViewMode.GridView,
  )
  const [totalGenres, setTotalGenres] = useState<Array<string>>([])
  const [genres, setGenres] = useState<Array<string>>([])
  const [visibleGenres, setVisibleGenres] = useState<Array<string>>([])
  const [groupbyGenresData, setGroupbyGenresData] = useState([])
  const [keyword, setKeyword] = useState<string>('')

  const loadMoreGenres = useCallback(() => {
    const newVisibleGenres = genres.slice(0, visibleGenres.length + LOAD_COUNT)
    setVisibleGenres(newVisibleGenres)
  }, [visibleGenres, genres])

  const sortGenresHandler = (e) => {
    setSortGenres(e.target.value)
  }

  const sortMoodsHandler = (e) => {
    setSortMoods(e.target.value)
  }

  const sortActivitiesHandler = (e) => {
    setSortActivities(e.target.value)
  }

  const searchGenresHandler = (e) => {
    setKeyword(e.target.value)
    const filteredGenres = totalGenres.filter((genre) =>
      genre.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()),
    )
    setGenres(filteredGenres)
  }

  const searchMoodsHandler = (e) => {
    setKeyword(e.target.value)
    const filteredGenres = totalGenres.filter((genre) =>
      genre.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()),
    )
    setGenres(filteredGenres)
  }

  const searchActivitiesHandler = (e) => {
    setKeyword(e.target.value)
    const filteredGenres = totalGenres.filter((genre) =>
      genre.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()),
    )
    setGenres(filteredGenres)
  }

  useEffect(() => {
    setVisibleGenres(genres.slice(0, LOAD_COUNT))
  }, [genres])

  const groupByFirstLetter = (array) => {
    return array.reduce((result, currentItem) => {
      const firstLetter = currentItem[0].toUpperCase()
      if (!result[firstLetter]) {
        result[firstLetter] = []
      }
      result[firstLetter].push(currentItem)
      return result
    }, {})
  }

  useEffect(() => {
    const grouped = groupByFirstLetter(genres)
    const resultArray = Object.keys(grouped).map((letter) => {
      return { letter: letter, data: grouped[letter] }
    })
    setGroupbyGenresData(resultArray)
  }, [genres])

  useEffect(() => {
    const init = async () => {
      try {
        const genresData = await getGenresList()
        console.log('genresData', genresData)
        setTotalGenres(genresData)
        setGenres(genresData)
        setVisibleGenres(genresData.slice(0, LOAD_COUNT))
      } catch (e) {
        console.log('error in fetching genres', e)
      }
    }
    init()
  }, [])

  const allGenresComponent = useMemo(() => {
    if (genresViewMode === ViewMode.GridView) {
      return (
        <Box display={'flex'} flexWrap={'wrap'} gap={'30px'} mb={5}>
          {visibleGenres.map((item, idx) => {
            return (
              <Grid
                key={idx}
                width={`calc((100% - 120px)/ 5)`}
                sx={{
                  aspectRatio: '1/1',
                }}
              >
                <ExploreItem
                  idx={idx}
                  name={item}
                  imageUrl={ImageLicense}
                  isTop={true}
                  itemType={ExploreItemType.Genre}
                />
              </Grid>
            )
          })}
          {visibleGenres.length < genres.length && (
            <PrimaryButton
              onClick={loadMoreGenres}
              sx={{
                margin: 'auto',
              }}
            >
              Load More
            </PrimaryButton>
          )}
        </Box>
      )
    } else {
      return (
        <Box
          sx={{
            columnCount: 4,
            columnGap: '1em',
          }}
        >
          {groupbyGenresData.map((item, idx) => {
            return (
              <Box
                key={idx}
                sx={{
                  breakInside: 'avoid',
                  marginBottom: '1em',
                  boxSizing: 'border-box',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '24px',
                  }}
                >
                  {item.letter}
                </Typography>
                <Box
                  sx={{
                    marginTop: '10px',
                  }}
                >
                  {item.data.map((i: string, index: number) => {
                    return (
                      <Typography
                        key={index}
                        sx={{
                          fontSize: '16px',
                          padding: '2px 0px',
                        }}
                      >
                        {i}
                      </Typography>
                    )
                  })}
                </Box>
              </Box>
            )
          })}
        </Box>
      )
    }
  }, [visibleGenres, genres, loadMoreGenres, genresViewMode, groupbyGenresData])

  return (
    <Box display={'flex'} justifyContent={'center'} minHeight={'100vh'}>
      <CardMedia
        component={'img'}
        image={BackgroundImage}
        width={'100%'}
        height={282}
        sx={{
          position: 'absolute',
        }}
      />

      <Box
        className="container"
        ref={exploreRef}
        sx={{
          zIndex: '10',
          marginTop: '150px',
        }}
      >
        <Typography
          sx={{
            fontSize: '48px',
            lineHeight: '56px',
            fontFamily: 'var(--font-medium)',
            mb: '86px',
          }}
        >
          Explore
        </Typography>
        {expandGenres && (
          <Typography
            sx={{
              fontSize: '32px',
              fontFamily: 'var(--font-medium)',
              color: theme.palette.text.primary,
            }}
            mb={6}
          >
            Genres
          </Typography>
        )}

        {expandActivities && (
          <Typography
            sx={{
              fontSize: '32px',
              fontFamily: 'var(--font-medium)',
              color: theme.palette.text.primary,
            }}
            mb={6}
          >
            Activities
          </Typography>
        )}

        {expandMoods && (
          <Typography
            sx={{
              fontSize: '32px',
              fontFamily: 'var(--font-medium)',
              color: theme.palette.text.primary,
            }}
            mb={6}
          >
            Moods
          </Typography>
        )}

        {!expandActivities && !expandMoods && (
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            <Box display={'flex'} gap={'30px'} justifyContent={'space-between'}>
              <Typography
                sx={{
                  fontSize: '32px',
                  fontFamily: 'var(--font-medium)',
                  color: theme.palette.text.primary,
                }}
              >
                Top Genres
              </Typography>
              <SecondaryButton
                sx={{
                  height: 40,
                  width: 84,
                  border: 'none',
                  borderRadius: '5px',
                  backgroundColor: theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.containerPrimary.main,
                  },
                }}
                onClick={() => {
                  setExpendGenres(!expandGenres)
                  setVisibleGenres(genres.slice(0, LOAD_COUNT))
                  setExpendMoods(false)
                  setExpendActivities(false)
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  })
                }}
              >
                <Typography
                  fontSize={'14px'}
                  color={theme.palette.text.secondary}
                >
                  {expandGenres ? `Collapse` : `View all`}
                </Typography>
              </SecondaryButton>
            </Box>
            <Box display={'flex'} flexWrap={'wrap'} gap={'30px'} mb={5}>
              {topGenresItems.map((item, idx) => {
                return (
                  <Grid
                    key={idx}
                    width={`calc((100% - 120px)/ 5)`}
                    sx={{
                      aspectRatio: '1 / 1',
                    }}
                  >
                    <ExploreItem
                      idx={idx}
                      name={item.name}
                      imageUrl={item.imageUrl}
                      isTop={false}
                      itemType={ExploreItemType.Genre}
                    />
                  </Grid>
                )
              })}
            </Box>
          </Box>
        )}

        {expandGenres && (
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            <Box display={'flex'} gap={'30px'} justifyContent={'space-between'}>
              <Typography
                sx={{
                  fontSize: '32px',
                  color: theme.palette.text.primary,
                  fontFamily: 'var(--font-medium)',
                }}
              >
                All Genres
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Typography
                  sx={{
                    lineHeight: '24px',
                    fontSize: '14px',
                    fontWeight: '400',
                    color: theme.palette.text.secondary,
                  }}
                >
                  Sort by
                </Typography>
                <StyledSelectFC
                  select
                  value={sortGenres}
                  onChange={(e) => sortGenresHandler(e)}
                  sx={{
                    width: '136px',
                    '& .MuiPaper-root .MuiList-root': {
                      pt: 0,
                      pb: 0,
                    },
                  }}
                >
                  {topTimeOptions.map((option, idx: number) => {
                    return (
                      <MenuItem
                        key={idx}
                        value={option.label}
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: '14px',
                          fontFamily: '400',
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    )
                  })}
                </StyledSelectFC>
                <StyledOutlinedInputFC
                  fullWidth
                  type="text"
                  value={keyword}
                  placeholder={`Search Genres...`}
                  onChange={(e) => {
                    searchGenresHandler(e)
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <CardMedia
                        component={'img'}
                        image={IconSearch}
                        sx={{
                          width: 16,
                          height: 16,
                        }}
                      />
                    </InputAdornment>
                  }
                  sx={{ maxWidth: 210 }}
                />
                <Box display={'flex'} alignItems={'center'} gap={1}>
                  <PrimaryButton
                    sx={{
                      width: 42,
                      height: 42,
                      background:
                        genresViewMode === ViewMode.GridView
                          ? theme.palette.success.light
                          : theme.palette.grey[600],
                      '&.MuiButtonBase-root svg path': {
                        stroke:
                          genresViewMode === ViewMode.GridView
                            ? theme.palette.grey[700]
                            : theme.palette.grey[400],
                      },
                      '&.MuiButtonBase-root:hover svg path': {
                        stroke: theme.palette.grey[700],
                      },
                    }}
                    onClick={() => setGenresViewMode(ViewMode.GridView)}
                  >
                    <ReactSVG src={IconGrid} className="svg-icon" />
                  </PrimaryButton>

                  <PrimaryButton
                    sx={{
                      width: 42,
                      height: 42,
                      background:
                        genresViewMode === ViewMode.ListView
                          ? theme.palette.success.light
                          : theme.palette.grey[600],
                      '&.MuiButtonBase-root svg path': {
                        stroke:
                          genresViewMode === ViewMode.ListView
                            ? theme.palette.grey[700]
                            : theme.palette.grey[400],
                      },
                      '&.MuiButtonBase-root:hover svg path': {
                        stroke: theme.palette.grey[700],
                      },
                    }}
                    onClick={() => setGenresViewMode(ViewMode.ListView)}
                  >
                    <ReactSVG src={IconList} className="svg-icon" />
                  </PrimaryButton>
                </Box>
              </Box>
            </Box>
            {allGenresComponent}
          </Box>
        )}
        {!expandGenres && !expandActivities && (
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            <Box display={'flex'} gap={'30px'} justifyContent={'space-between'}>
              <Typography
                sx={{
                  fontSize: '32px',
                  fontFamily: 'var(--font-medium)',
                  color: theme.palette.text.primary,
                }}
              >
                Top Moods
              </Typography>
              <SecondaryButton
                sx={{
                  height: 40,
                  width: 84,
                  border: 'none',
                  borderRadius: '5px',
                  backgroundColor: theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.containerPrimary.main,
                  },
                }}
                onClick={() => {
                  setExpendMoods(!expandMoods)
                  setExpendActivities(false)
                  setExpendGenres(false)
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  })
                }}
              >
                <Typography
                  fontSize={'14px'}
                  color={theme.palette.text.secondary}
                >
                  {expandMoods ? `Collapse` : `View all`}
                </Typography>
              </SecondaryButton>
            </Box>
            <Box display={'flex'} flexWrap={'wrap'} gap={'30px'} mb={5}>
              {topMoodsItems.map((item, idx) => {
                return (
                  <Grid
                    key={idx}
                    width={`calc((100% - 120px)/ 5)`}
                    sx={{
                      aspectRatio: '1 / 1',
                    }}
                  >
                    <ExploreItem
                      idx={idx}
                      name={item.name}
                      imageUrl={item.imageUrl}
                      isTop={false}
                      itemType={ExploreItemType.Mood}
                    />
                  </Grid>
                )
              })}
            </Box>
          </Box>
        )}

        {expandMoods && (
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            <Box display={'flex'} gap={'30px'} justifyContent={'space-between'}>
              <Typography
                sx={{
                  fontSize: '32px',
                  fontFamily: 'var(--font-medium)',
                  color: theme.palette.text.primary,
                }}
              >
                All Moods
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Typography
                  sx={{
                    lineHeight: '24px',
                    fontSize: '14px',
                    fontWeight: '400',
                    color: theme.palette.text.secondary,
                  }}
                >
                  Sort by
                </Typography>
                <StyledSelectFC
                  select
                  value={sortMoods}
                  onChange={(e) => sortMoodsHandler(e)}
                  sx={{
                    width: '136px',
                    '& .MuiPaper-root .MuiList-root': {
                      pt: 0,
                      pb: 0,
                    },
                  }}
                >
                  {topTimeOptions.map((option, idx: number) => {
                    return (
                      <MenuItem
                        key={idx}
                        value={option.label}
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: '14px',
                          fontFamily: '400',
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    )
                  })}
                </StyledSelectFC>
                <StyledOutlinedInputFC
                  fullWidth
                  type="text"
                  value={keyword}
                  placeholder={`Search Moods...`}
                  onChange={(e) => {
                    searchMoodsHandler(e)
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <CardMedia
                        component={'img'}
                        image={IconSearch}
                        sx={{
                          width: 16,
                          height: 16,
                        }}
                      />
                    </InputAdornment>
                  }
                  sx={{ maxWidth: 210 }}
                />
                <Box display={'flex'} alignItems={'center'} gap={1}>
                  <PrimaryButton
                    sx={{
                      width: 42,
                      height: 42,
                      background:
                        moodsViewMode === ViewMode.GridView
                          ? theme.palette.success.light
                          : theme.palette.grey[600],
                      '&.MuiButtonBase-root svg path': {
                        stroke:
                          moodsViewMode === ViewMode.GridView
                            ? theme.palette.grey[700]
                            : theme.palette.grey[400],
                      },
                      '&.MuiButtonBase-root:hover svg path': {
                        stroke: theme.palette.grey[700],
                      },
                    }}
                    onClick={() => setMoodsViewMode(ViewMode.GridView)}
                  >
                    <ReactSVG src={IconGrid} className="svg-icon" />
                  </PrimaryButton>

                  <PrimaryButton
                    sx={{
                      width: 42,
                      height: 42,
                      background:
                        moodsViewMode === ViewMode.ListView
                          ? theme.palette.success.light
                          : theme.palette.grey[600],
                      '&.MuiButtonBase-root svg path': {
                        stroke:
                          moodsViewMode === ViewMode.ListView
                            ? theme.palette.grey[700]
                            : theme.palette.grey[400],
                      },
                      '&.MuiButtonBase-root:hover svg path': {
                        stroke: theme.palette.grey[700],
                      },
                    }}
                    onClick={() => setMoodsViewMode(ViewMode.ListView)}
                  >
                    <ReactSVG src={IconList} className="svg-icon" />
                  </PrimaryButton>
                </Box>
              </Box>
            </Box>
            <Box display={'flex'} flexWrap={'wrap'} gap={'30px'} mb={5}>
              {allGenresItems.map((item, idx: number) => {
                return (
                  <Grid
                    key={idx}
                    width={`calc((100% - 120px)/ 5)`}
                    sx={{
                      aspectRatio: '1 / 1',
                    }}
                  >
                    <ExploreItem
                      idx={idx}
                      name={item.name}
                      imageUrl={item.imageUrl}
                      isTop={true}
                      itemType={ExploreItemType.Genre}
                    />
                  </Grid>
                )
              })}
            </Box>
          </Box>
        )}

        {!expandMoods && !expandGenres && (
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            <Box display={'flex'} gap={'30px'} justifyContent={'space-between'}>
              <Typography
                sx={{
                  fontSize: '32px',
                  fontFamily: 'var(--font-medium)',
                  color: theme.palette.text.primary,
                }}
              >
                Top Activities
              </Typography>
              <SecondaryButton
                sx={{
                  height: 40,
                  width: 84,
                  border: 'none',
                  borderRadius: '5px',
                  backgroundColor: theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: theme.palette.containerPrimary.main,
                  },
                }}
                onClick={() => {
                  setExpendActivities(!expandActivities)
                  setExpendGenres(false)
                  setExpendMoods(false)
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  })
                }}
              >
                <Typography
                  fontSize={'14px'}
                  color={theme.palette.text.secondary}
                >
                  {expandActivities ? `Collapse` : `View all`}
                </Typography>
              </SecondaryButton>
            </Box>
            <Box display={'flex'} flexWrap={'wrap'} gap={'30px'} mb={5}>
              {topActivitiesItems.map((item, idx) => {
                return (
                  <Grid
                    key={idx}
                    width={`calc((100% - 120px)/ 5)`}
                    sx={{
                      aspectRatio: '1 / 1',
                    }}
                  >
                    <ExploreItem
                      idx={idx}
                      name={item.name}
                      imageUrl={item.imageUrl}
                      isTop={false}
                      itemType={ExploreItemType.Activity}
                    />
                  </Grid>
                )
              })}
            </Box>
          </Box>
        )}

        {expandActivities && (
          <Box display={'flex'} flexDirection={'column'} gap={2}>
            <Box display={'flex'} gap={'30px'} justifyContent={'space-between'}>
              <Typography
                sx={{
                  fontSize: '32px',
                  fontFamily: 'var(--font-medium)',
                  color: theme.palette.text.primary,
                }}
              >
                All Activities
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Typography
                  sx={{
                    lineHeight: '24px',
                    fontSize: '14px',
                    fontWeight: '400',
                    color: theme.palette.text.secondary,
                  }}
                >
                  Sort by
                </Typography>
                <StyledSelectFC
                  select
                  value={sortActivities}
                  onChange={(e) => sortActivitiesHandler(e)}
                  sx={{
                    width: '136px',
                    '& .MuiPaper-root .MuiList-root': {
                      pt: 0,
                      pb: 0,
                    },
                  }}
                >
                  {topTimeOptions.map((option, idx: number) => {
                    return (
                      <MenuItem
                        key={idx}
                        value={option.label}
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: '14px',
                          fontFamily: '400',
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    )
                  })}
                </StyledSelectFC>
                <StyledOutlinedInputFC
                  fullWidth
                  type="text"
                  value={keyword}
                  placeholder={`Search Activities...`}
                  onChange={(e) => {
                    searchActivitiesHandler(e)
                  }}
                  startAdornment={
                    <InputAdornment position="start">
                      <CardMedia
                        component={'img'}
                        image={IconSearch}
                        sx={{
                          width: 16,
                          height: 16,
                        }}
                      />
                    </InputAdornment>
                  }
                  sx={{ maxWidth: 210 }}
                />
                <Box display={'flex'} alignItems={'center'} gap={1}>
                  <PrimaryButton
                    sx={{
                      width: 42,
                      height: 42,
                      background:
                        activitiesViewMode === ViewMode.GridView
                          ? theme.palette.success.light
                          : theme.palette.grey[600],
                      '&.MuiButtonBase-root svg path': {
                        stroke:
                          activitiesViewMode === ViewMode.GridView
                            ? theme.palette.grey[700]
                            : theme.palette.grey[400],
                      },
                      '&.MuiButtonBase-root:hover svg path': {
                        stroke: theme.palette.grey[700],
                      },
                    }}
                    onClick={() => setActivitiesViewMode(ViewMode.GridView)}
                  >
                    <ReactSVG src={IconGrid} className="svg-icon" />
                  </PrimaryButton>

                  <PrimaryButton
                    sx={{
                      width: 42,
                      height: 42,
                      background:
                        activitiesViewMode === ViewMode.ListView
                          ? theme.palette.success.light
                          : theme.palette.grey[600],
                      '&.MuiButtonBase-root svg path': {
                        stroke:
                          activitiesViewMode === ViewMode.ListView
                            ? theme.palette.grey[700]
                            : theme.palette.grey[400],
                      },
                      '&.MuiButtonBase-root:hover svg path': {
                        stroke: theme.palette.grey[700],
                      },
                    }}
                    onClick={() => setActivitiesViewMode(ViewMode.ListView)}
                  >
                    <ReactSVG src={IconList} className="svg-icon" />
                  </PrimaryButton>
                </Box>
              </Box>
            </Box>
            <Box display={'flex'} flexWrap={'wrap'} gap={'30px'}>
              {allGenresItems.map((item, idx: number) => {
                return (
                  <Grid
                    key={idx}
                    width={`calc((100% - 120px)/ 5)`}
                    sx={{
                      aspectRatio: '1 / 1',
                    }}
                  >
                    <ExploreItem
                      idx={idx}
                      name={item.name}
                      imageUrl={item.imageUrl}
                      isTop={true}
                      itemType={ExploreItemType.Genre}
                    />
                  </Grid>
                )
              })}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
