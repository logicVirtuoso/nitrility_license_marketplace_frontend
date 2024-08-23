import { Box, useTheme, Typography, Divider, CardMedia } from '@mui/material'
import { useCallback, useEffect, useState, useContext, useRef } from 'react'
import { GlobalMusicContext } from 'src/context/globalMusic'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { getReceivedOffers } from 'src/api'
import Grid from '@mui/material/Unstable_Grid2'
import LicenseCard from 'src/components/licenseCard'
import { useNavigate } from 'react-router-dom'
import { CommonLicenseDataIF } from 'src/interface'
import ExplicitDarkDefault from 'src/assets/images/explicit_dark_default.png'
import ExplicitDarkSelected from 'src/assets/images/explicit_dark_selected.png'
import { topTimeOptions } from 'src/config'
import ViewModeTools from 'src/components/viewMode/tools'
import { ViewMode } from 'src/interface'
import SecondaryButton from 'src/components/buttons/secondary-button'
import { ReactSVG } from 'react-svg'
import IconPause from 'src/assets/musicplayer/pause.svg'
import IconPlay from 'src/assets/musicplayer/play.svg'
import { getCommonLicenseData } from 'src/utils/utils'
import OfferManager from 'src/components/offerManager'

const OfferReceivedTab = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [offers, setOffers] = useState<Array<any>>([])
  const [searchedOffers, setSearchedOffers] = useState<Array<any>>([])
  const [curView, setCurView] = useState<ViewMode>(ViewMode.GridView)
  const [sortingTime, setSortingTime] = useState(topTimeOptions[0].label)
  const [keyword, setKeyword] = useState<string>('')
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const [curOffer, setCurOffer] = useState<any>()
  const [commonLicenseData, setCommonLicenseData] =
    useState<CommonLicenseDataIF>()
  const offerRef = useRef<{
    toggleState: () => void
  }>(null)

  const fetchData = useCallback(async () => {
    const receivedOffers = await getReceivedOffers(
      authorization.currentUser.sellerId,
      authorization.currentUser.accountAddress,
    )
    setOffers(receivedOffers)
    setSearchedOffers(receivedOffers)
  }, [authorization])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const { isPlaying, setIsPlaying, globalMusic, setGlobalMusic } =
    useContext(GlobalMusicContext)

  const playHandler = (e, common: CommonLicenseDataIF) => {
    e.stopPropagation()
    if (globalMusic?.listedId !== common.listedId) {
      setGlobalMusic(common)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const sortingByTime = (event) => {
    setSortingTime(event.target.value)
  }

  const searchHandler = (value) => {
    setKeyword(value)
    if (value !== '') {
      const tmp = offers.filter((offer) => {
        if (
          offer.listedLicense.licenseName
            .toLowerCase()
            .includes(value.toLowerCase())
        ) {
          return true
        } else {
          return false
        }
      })
      setSearchedOffers(tmp)
    } else {
      setSearchedOffers(offers)
    }
  }

  useEffect(() => {
    const init = async () => {
      if (curOffer) {
        try {
          const licenseData = curOffer.listedLicense
          setCommonLicenseData(getCommonLicenseData(licenseData))
        } catch (e) {
          console.log('error in getting license for listedId', e)
          navigate('/')
        }
      }
    }
    init()
  }, [curOffer, navigate])

  return (
    <Box>
      <ViewModeTools
        totalAmount={`${searchedOffers.length} licenses`}
        selected={sortingTime}
        handleOptionChange={sortingByTime}
        options={topTimeOptions}
        keyword={keyword}
        handleSearch={searchHandler}
        searchPlaceholder="Search licenses..."
        viewMode={curView}
        setViewMode={setCurView}
      />
      {searchedOffers.length == 0 ? (
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          gap={2}
          mt={12.5}
        >
          <Typography
            fontWeight={600}
            fontSize={24}
            color={theme.palette.text.primary}
          >
            You don’t have any pending offers
          </Typography>
          <Typography
            fontWeight={400}
            fontSize={14}
            color={theme.palette.text.secondary}
          >
            Make an offer by bidding on a license on the marketplace.
          </Typography>
          <SecondaryButton sx={{ mt: 1 }}>Explore licenses</SecondaryButton>
        </Box>
      ) : (
        <>
          {curView === ViewMode.GridView ? (
            <Grid container spacing={2} columns={40}>
              {searchedOffers.map((offer, idx) => {
                const common: CommonLicenseDataIF = offer.listedLicense
                return (
                  <Grid xs={8} key={idx}>
                    <LicenseCard
                      commonLicenseData={common}
                      handler={() => {
                        setCurOffer(offer)
                        offerRef.current.toggleState()
                      }}
                    />
                  </Grid>
                )
              })}
            </Grid>
          ) : (
            <Box mt={2}>
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
                    width: 'calc(100% - 130px)',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '400',
                    color: theme.palette.grey[400],
                  }}
                >
                  Title
                </Typography>
                <Typography
                  sx={{
                    width: '80px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '400',
                    color: theme.palette.grey[400],
                  }}
                >
                  Offers
                </Typography>
              </Box>
              <Divider />
              <Box mt={2}>
                {searchedOffers.map((offer, idx) => {
                  const common = offer.listedLicense
                  return (
                    <Box
                      key={idx}
                      display={'flex'}
                      alignItems={'center'}
                      sx={{
                        borderRadius: 2.5,
                        padding: '8px 0px',
                        cursor: 'pointer',
                        '& .defaultImg': {
                          display: 'block',
                        },
                        '& .selectedImg': {
                          display: 'none',
                        },
                        '&:hover': {
                          bgcolor: theme.palette.containerSecondary.main,
                          '& .defaultImg': {
                            display: 'none',
                          },
                          '& .selectedImg': {
                            display: 'block',
                          },
                          '& .idx': {
                            display: 'none',
                          },
                          '& .icon-play': {
                            display: 'block',
                          },
                        },
                        '& .idx': {
                          display: 'block',
                        },
                        '& .icon-play': {
                          display: 'none',
                        },
                      }}
                      onClick={() => {
                        setCurOffer(offer)
                        offerRef.current.toggleState()
                      }}
                    >
                      <Typography
                        className="idx"
                        fontFamily={'var(--font-medium)'}
                        width={'50px'}
                        fontSize={16}
                        color={theme.palette.text.secondary}
                      >
                        {idx + 1}
                      </Typography>
                      <Box
                        className="icon-play"
                        sx={{
                          width: '50px',
                        }}
                        onClick={(e) => playHandler(e, common)}
                      >
                        {isPlaying &&
                        offer.listedId === globalMusic?.listedId ? (
                          <ReactSVG src={IconPause} className="svg-icon" />
                        ) : (
                          <ReactSVG src={IconPlay} className="svg-icon" />
                        )}
                      </Box>
                      <Box
                        width={'calc(100% - 130px)'}
                        display={'flex'}
                        alignItems={'center'}
                        gap={1.5}
                      >
                        <CardMedia
                          component={'img'}
                          image={offer.listedLicense.imagePath}
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: 1.5,
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
                            {offer.listedLicense.licenseName}
                          </Typography>
                          <Box
                            display={'flex'}
                            alignItems={'center'}
                            gap={'6px'}
                          >
                            <CardMedia
                              className={'defaultImg'}
                              image={ExplicitDarkDefault}
                              component={'img'}
                              sx={{ width: 21, height: 21 }}
                            />

                            <CardMedia
                              className={'selectedImg'}
                              image={ExplicitDarkSelected}
                              component={'img'}
                              sx={{ width: 21, height: 21 }}
                            />
                            {offer.listedLicense.artists.map(
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
                                      offer.listedLicense.artists?.length ==
                                      index + 1
                                        ? ''
                                        : ', '
                                    }`}
                                  </Typography>
                                )
                              },
                            )}
                          </Box>
                        </Box>
                      </Box>
                      <Typography width={'80px'} textAlign={'left'}>
                        {offer.offerCounts}
                      </Typography>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          )}
        </>
      )}

      <OfferManager
        ref={offerRef}
        offerData={curOffer}
        commonLicenseData={commonLicenseData}
      />
    </Box>
  )
}

export default OfferReceivedTab
