import {
  Box,
  Typography,
  useTheme,
  CardMedia,
  MenuItem,
  Divider,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import PurchasingBackground from '../purchasing/background'
import React, { useCallback, useEffect, useRef } from 'react'
import {
  accpetOfferBySeller,
  getHistoryByListedId,
  getLicenseForListedId,
  getMyOffersOfSeller,
  getSaleStats,
  rejectOfferBySeller,
} from 'src/api'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import CustomizedContainer from 'src/components/customizedeContainer'
import { styled } from '@mui/material/styles'
import {
  convertHistoryTypeToAction,
  convertUtcToLocalTime,
  getCommonLicenseData,
  getSyncData,
} from 'src/utils/utils'
import { OFFER_TAB_KEY, licensingTypeList, topTimeOptions } from 'src/config'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import {
  LicenseHistoryTabTypes,
  AccessLevel,
  CommonLicenseDataIF,
  Activities,
  SortOption,
  sortOptions,
  LicensingTypes,
  accessLevels,
} from 'src/interface'
import useAuction from 'src/hooks/useAuction'
import StrokeDarkIcon from 'src/assets/images/stroke_dark.svg'
import RaiseUpDarkIcon from 'src/assets/images/raise_up_dark.png'
import dayjs from 'dayjs'
import AcceptDarkIcon from 'src/assets/images/purchasing/accept_dark.png'
import RejectDarkIcon from 'src/assets/images/close_dark.png'
import toast from 'react-hot-toast'
import { StyledTab, StyledTabs } from 'src/components/styledTab'
import ActivityTable from '../infoPublicProfile/activityTable'
import { StyledSelectFC } from 'src/components/styledInput'
import SaleState from 'src/components/SaleState'
import OfferManager from 'src/components/offerManager'
import useUtils from 'src/hooks/useUtils'
import IconView from 'src/assets/view.svg'
import useListingLicense from 'src/hooks/useListingLicense'

const StyledTh = styled(Th)(({ theme }) => ({
  fontFamily: 'var(--font-base)',
  fontSize: '14px',
  color: theme.palette.text.secondary,
  textAlign: 'left',
}))

const StyledTbody = styled(Tbody)(({ theme }) => ({
  borderTop: `1px solid #ffff`,
  padding: '4px 8px',
}))

const StyledTd = styled(Td)(({ theme }) => ({
  color: theme.palette.grey[200],
  fontWeight: 400,
  fontSize: 14,
  textAlign: 'left',
  padding: '16px',
  borderTop: '1px solid #242424',
}))

const StyledTrh = styled(Tr)(({ theme }) => ({
  border: `1px solid ${theme.palette.text.primary}`,
  borderBottom: '2px solid ${theme.palette.text.primary}',
  padding: '5px',
  marginBottom: '10px',
  height: '36px',
  fontSize: '14px',
  fontWeight: '400',
  lineHeight: '20px',
  color: theme.palette.text.secondary,
}))

const StyledTr = styled(Tr)(({ theme }) => ({
  border: 'solid 1px #ddd',
  borderBottom: 'solid 2px #ddd',
  borderBottomWidth: '2px',
  fontSize: '14px',
  fontWeight: '400',
  lineHeight: '20px',
}))

const StyledAvatar = styled('img')(({ theme }) => ({
  width: '18px',
  height: '18px',
  objectFit: 'cover',
  borderRadius: '100%',
}))

const activityTabItems = [
  { label: 'All Activity', value: LicenseHistoryTabTypes.AllActivity },
  { label: 'License Offers', value: LicenseHistoryTabTypes.LicenseOffers },
]

const ActivityMenuItem = ({ activity, checked, onChange }) => {
  const theme = useTheme()
  return (
    <MenuItem>
      <FormControlLabel
        control={<Checkbox checked={checked} onChange={onChange} />}
        label={activity}
        sx={{
          '& .MuiFormControlLabel-label': {
            fontSize: '14px',
            color: theme.palette.grey[200],
          },
        }}
      />
    </MenuItem>
  )
}

const ActivityMenu = ({ filters, setFilters }) => {
  const handleCheckboxChange = (activity) => {
    setFilters((prev) => ({
      ...prev,
      activities: {
        ...prev.activities,
        [activity]: !prev.activities[activity],
      },
    }))
  }
  return (
    <>
      {Object.keys(Activities).map((activity) => {
        return (
          <ActivityMenuItem
            key={activity}
            activity={activity}
            checked={filters.activities[activity]}
            onChange={() => handleCheckboxChange(activity)}
          />
        )
      })}
    </>
  )
}

export default function LicenseHistory() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { listedId } = useParams()
  const { etherToUsd } = useUtils()
  const [licenseLoading, setLicenseLoading] = React.useState<boolean>(true)
  const [isOwner, setIsOwner] = React.useState<boolean>(false)
  const [licenseData, setLicenseData] = React.useState<any>()
  const [tabValue, setTabValue] = React.useState<string>(
    LicenseHistoryTabTypes.AllActivity,
  )
  const [offers, setOffers] = React.useState<Array<any>>([])
  const [curOffer, setCurOffer] = React.useState<any>()
  const [commonLicenseData, setCommonLicenseData] =
    React.useState<CommonLicenseDataIF>()

  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  const [curHistories, setCurHistories] = React.useState<Array<any>>([])
  const tokenPrice = useSelector(
    (state: { priceReducer: { tokenPrice: number } }) =>
      state.priceReducer.tokenPrice,
  )
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [sortingTime, setSortingTime] = React.useState(topTimeOptions[0].label)
  const [filters, setFilters] = React.useState({
    activities: {
      [Activities.Listings]: true,
      [Activities.Collaborations]: true,
      [Activities.Sales]: true,
      [Activities.Offers]: true,
    },
    sortOption: SortOption.Newest,
    keyword: '',
  })
  const [saleStats, setSaleStats] = React.useState({
    totalSales: 0,
    payouts: 0,
    totalOffers: 0,
    totalVisitors: 0,
  })

  const { signLicenseData } = useListingLicense()

  const offerRef = useRef<{
    toggleState: () => void
  }>(null)

  const tabHandler = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue)
  }

  React.useEffect(() => {
    const init = async () => {
      setLicenseLoading(true)
      try {
        const license = await getLicenseForListedId(listedId)
        setLicenseData(license)
        if (license.sellerId === authorization?.currentUser?.sellerId) {
          setIsOwner(true)
        } else {
          setIsOwner(false)
        }
      } catch (e) {
        console.log('error in getting license for listedId', e)
      }
      setLicenseLoading(false)
    }
    init()
  }, [authorization?.currentUser, listedId])

  useEffect(() => {
    const ls = window.localStorage.getItem(OFFER_TAB_KEY)
    if (ls) setTabValue(ls)
  }, [])

  const getLicenseHistories = React.useCallback(async () => {
    const { success, data, msg } = await getHistoryByListedId(listedId, filters)
    if (success && licenseData) {
      let histories = data
      histories = histories.map((history) => {
        const price = history.price
          ? `${(history.price * tokenPrice).toLocaleString()}`
          : '---'
        return {
          ...history,
          action: convertHistoryTypeToAction(
            history,
            licenseData?.licenseName,
            price,
          ),
          date: convertUtcToLocalTime(history.createdAt),
          price,
        }
      })
      setCurHistories(histories)
    }
  }, [tokenPrice, listedId, filters, licenseData])

  React.useEffect(() => {
    getLicenseHistories()
  }, [getLicenseHistories])

  const acceptOfferHandler = useCallback(
    async (offer) => {
      const toastLoading = toast.loading('accepting offer...')
      try {
        const commonData = getCommonLicenseData(offer.listedLicense)
        const signature = await signLicenseData(
          offer.purchasedSigningData,
          commonData.sellerId,
        )
        const signingData = { ...offer.purchasedSigningData, signature }
        const { success, msg } = await accpetOfferBySeller(
          offer.offerId,
          signingData,
        )
        if (success) {
          toast.success(msg, { id: toastLoading })
        } else {
          toast.error(msg, {
            id: toastLoading,
          })
        }
      } catch (e) {
        toast.error(e.message, {
          id: toastLoading,
        })
      }
    },
    [signLicenseData],
  )

  const rejectOfferHandler = async (offer) => {
    const toastLoading = toast.loading('rejecting offer...')
    try {
      const { success, msg } = await rejectOfferBySeller(offer.offerId)
      if (success) {
        toast.success(msg, { id: toastLoading })
      } else {
        toast.error(msg, {
          id: toastLoading,
        })
      }
    } catch (e) {
      toast.error(e.message, {
        id: toastLoading,
      })
    }
  }

  useEffect(() => {
    const init = async () => {
      if (curOffer) {
        try {
          const licenseForOffer = curOffer.listedLicense
          setCommonLicenseData(getCommonLicenseData(licenseForOffer))
        } catch (e) {
          console.log('error in getting license for listedId', e)
          navigate('/')
        }
      }
    }
    init()
  }, [curOffer, navigate])

  const sortingByTime = (event) => {
    setSortingTime(event.target.value)
  }

  const handleOpen = () => {
    setMenuOpen(true)
  }

  const handleClose = (event) => {
    if (event && event.target) {
      const keepOpen = ['input', 'span', 'path', 'li', 'svg', 'label'].includes(
        event.target.tagName.toLowerCase(),
      )
      if (keepOpen) {
        return
      }
    }
    setMenuOpen(false)
  }

  const sortOptionHandler = useCallback((event) => {
    setFilters((prev) => ({
      ...prev,
      sortOption: event.target.value as SortOption,
    }))
  }, [])

  useEffect(() => {
    getSaleStats(authorization.currentUser.sellerId).then(({ data }) =>
      setSaleStats(data),
    )
  }, [authorization.currentUser.sellerId])

  const fetchOffers = useCallback(() => {
    getMyOffersOfSeller(Number(listedId), LicensingTypes.None)
      .then(setOffers)
      .catch((e) => console.log('error in fetching offers of license', e))
  }, [listedId])

  useEffect(() => {
    fetchOffers()
  }, [fetchOffers])

  return (
    <Box pb={2}>
      <PurchasingBackground
        loading={licenseLoading}
        license={licenseData}
        isOwner={isOwner}
      />

      <CustomizedContainer sx={{ py: 8 }}>
        <Typography variant="h3" color={theme.palette.text.primary} pb={3}>
          All License Activity
        </Typography>

        <StyledTabs value={tabValue} onChange={tabHandler}>
          {activityTabItems.map((tab, idx) => {
            return <StyledTab value={tab.value} label={tab.label} key={idx} />
          })}
        </StyledTabs>

        {tabValue === LicenseHistoryTabTypes.AllActivity && (
          <Box>
            <Box display={'flex'} flexDirection={'column'} gap={4} pt={4}>
              <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Typography
                  fontSize={24}
                  fontWeight={600}
                  color={theme.palette.text.primary}
                >
                  Sale Stats
                </Typography>

                <StyledSelectFC
                  select
                  value={sortingTime}
                  onChange={sortingByTime}
                  sx={{
                    width: '136px',
                    '& .MuiPaper-root .MuiList-root': {
                      pt: 0,
                      pb: 0,
                    },
                  }}
                >
                  {topTimeOptions.map((option, idx) => {
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
              </Box>

              <Box
                display={'flex'}
                alignItems={'center'}
                width={'100%'}
                border={`1px solid ${theme.palette.grey[600]}`}
                borderRadius={3}
              >
                <SaleState
                  title="Total Sales"
                  totalAmount={`${saleStats.totalSales}`}
                  percent={Math.random() * 10}
                  isRaiseup={true}
                />
                <Divider orientation="vertical" flexItem />
                <SaleState
                  title="Payouts"
                  totalAmount={`$${etherToUsd(
                    saleStats.payouts,
                  ).toLocaleString()}`}
                  percent={Math.random() * 10}
                  isRaiseup={true}
                />
                <Divider orientation="vertical" flexItem />
                <SaleState
                  title="Total Offers"
                  totalAmount={`${saleStats.totalOffers}`}
                  percent={Math.random() * 10}
                  isRaiseup={true}
                />
                <Divider orientation="vertical" flexItem />
                <SaleState
                  title="Profile Visits"
                  totalAmount={`${saleStats.totalVisitors}`}
                  percent={Math.random() * 10}
                  isRaiseup={true}
                />
              </Box>

              <Box display={'flex'} justifyContent={'space-between'}>
                <Box display={'flex'} alignItems={'center'} gap={'12px'}>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: '400',
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Filter
                  </Typography>
                  <FormControl
                    sx={{
                      width: '141px',
                      background: theme.palette.grey[600],
                      height: '38px',
                      fontSize: '12px',
                      borderRadius: 1,
                    }}
                  >
                    <InputLabel
                      id="duration-label"
                      shrink={false}
                      sx={{
                        position: 'absolute',
                        color: theme.palette.text.secondary,
                        transformOrigin: 'top left',
                        fontSize: '14px',
                        lineHeight: '1',
                        transform: 'none',
                        marginTop: '12px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        left: 0,
                        right: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        '& fieldset': { border: 'none' },
                        border: 'none',
                      }}
                    >
                      By Activity
                      <Typography
                        sx={{
                          fontSize: '10px',
                          bgcolor: theme.palette.text.primary,
                          color: theme.palette.grey[700],
                          width: '16px',
                          height: '16px',
                          textAlign: 'center',
                          borderRadius: '50%',
                          lineHeight: '18px',
                        }}
                      >
                        {
                          Object.values(filters.activities).filter(
                            (value) => value === true,
                          ).length
                        }
                      </Typography>
                    </InputLabel>
                    <Select
                      value=""
                      open={menuOpen}
                      onOpen={handleOpen}
                      onClose={handleClose}
                      input={<OutlinedInput sx={{ width: '100%' }} />}
                      renderValue={() => 'Type'}
                      inputProps={{
                        'aria-label': 'Without label',
                      }}
                      MenuProps={{
                        anchorOrigin: {
                          vertical: 'bottom',
                          horizontal: 'left',
                        },
                        transformOrigin: {
                          vertical: 'top',
                          horizontal: 'left',
                        },
                        PaperProps: {
                          sx: {
                            marginTop: '4px',
                            '& ul': {
                              padding: '12px 0px',
                            },
                            '& .MuiMenuItem-root': {
                              padding: '0px 12px',
                            },
                          },
                        },
                      }}
                      sx={{
                        width: '141px !important',
                        '& .MuiMenu-paper': {
                          backgroundColor: theme.palette.text.primary,
                        },
                        background: theme.palette.grey[600],
                        height: '38px',
                        fontSize: '12px',
                        color: theme.palette.text.primary,
                        '& .Mui-focused': {
                          boxShadow: 'none',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                          outline: 'none',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      <ActivityMenu filters={filters} setFilters={setFilters} />
                    </Select>
                  </FormControl>
                </Box>
                <Box display={'flex'} alignItems={'center'} gap={'12px'}>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: '400',
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Sort
                  </Typography>
                  <StyledSelectFC
                    select
                    name="sortOption"
                    value={filters.sortOption}
                    onChange={sortOptionHandler}
                  >
                    {sortOptions.map((filter, idx) => (
                      <MenuItem
                        key={idx}
                        value={filter}
                        sx={{ fontSize: '14px' }}
                      >
                        {filter}
                      </MenuItem>
                    ))}
                  </StyledSelectFC>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                mx: '-34px',
              }}
            >
              <ActivityTable activities={curHistories} />
            </Box>
          </Box>
        )}

        {tabValue === LicenseHistoryTabTypes.LicenseOffers && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              border: `1px solid ${theme.palette.grey[600]}`,
              mt: 4,
            }}
          >
            <Box
              display={'flex'}
              alignItems={'center'}
              py={1.5}
              px={2}
              borderBottom={`1px solid ${theme.palette.divider}`}
              gap={1}
            >
              <Typography variant="h5" color={theme.palette.text.secondary}>
                My License Offers
              </Typography>
              <CardMedia
                component={'img'}
                image={StrokeDarkIcon}
                sx={{ width: 12, objectFit: 'cover' }}
              />
            </Box>

            <Table>
              <Thead>
                <StyledTrh>
                  <StyledTh sx={{ pl: 2 }}>License Type</StyledTh>
                  <StyledTh sx={{ textAlign: 'right' }}>Offer (USD)</StyledTh>
                  <StyledTh sx={{ textAlign: 'right' }}>
                    Difference from RRP
                  </StyledTh>
                  <StyledTh sx={{ textAlign: 'right' }}>Expires</StyledTh>
                  <StyledTh sx={{ textAlign: 'right' }}>From</StyledTh>
                  <StyledTh sx={{ textAlign: 'right', pr: 2 }}>Action</StyledTh>
                </StyledTrh>
              </Thead>
              <StyledTbody>
                {offers.map((offer, idx) => {
                  const exl =
                    offer.accessLevel != null
                      ? ` · ${accessLevels[offer.accessLevel]}`
                      : ''
                  const caption =
                    `${licensingTypeList[offer.licensingType].label}` + exl
                  const expiredDate = dayjs(Number(offer.offerDuration)).diff(
                    dayjs(Date.now()),
                    'day',
                  )
                  const expired = expiredDate > 0 ? false : true
                  let originalPrice
                  let isRaisingUp = false
                  const syncData = getSyncData(
                    offer.licensingType,
                    offer.signingData,
                  )
                  if (offer.accessLevel == AccessLevel.Exclusive) {
                    originalPrice = syncData.sPrice
                  } else {
                    originalPrice = syncData.fPrice
                  }

                  if (originalPrice > offer.offerPrice) {
                    isRaisingUp = false
                  } else {
                    isRaisingUp = true
                  }
                  const percentage = (
                    (100 * Math.abs(originalPrice - offer.offerPrice)) /
                    originalPrice
                  ).toLocaleString()
                  return (
                    <StyledTr key={idx}>
                      <StyledTd
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                          setCurOffer(offer)
                          offerRef.current.toggleState()
                        }}
                      >
                        {caption}
                      </StyledTd>
                      <StyledTd sx={{ textAlign: 'right' }}>
                        ${etherToUsd(offer.offerPrice).toLocaleString()}
                      </StyledTd>
                      <StyledTd sx={{ textAlign: 'right' }}>
                        <Box
                          display={'flex'}
                          alignItems={'center'}
                          gap={1}
                          justifyContent={'flex-end'}
                        >
                          <Typography>{`${
                            isRaisingUp ? '+' : '-'
                          }${percentage}%`}</Typography>
                          <CardMedia
                            component={'img'}
                            image={RaiseUpDarkIcon}
                            sx={{
                              width: 16,
                              height: 16,
                              objectFit: 'cover',
                              transform: isRaisingUp
                                ? 'initial'
                                : 'rotate(180deg)',
                            }}
                          />
                        </Box>
                      </StyledTd>
                      <StyledTd sx={{ textAlign: 'right' }}>
                        {!expired ? `in ${expiredDate} days` : `expired`}
                      </StyledTd>
                      <StyledTd>
                        <Box
                          display={'flex'}
                          alignItems={'center'}
                          justifyContent={'flex-end'}
                          gap={0.5}
                          sx={{
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            navigate(
                              `/info-pub-profile/${offer.buyerAddr}/${offer.sellerId}`,
                            )
                          }}
                        >
                          <Typography
                            sx={{
                              color: theme.palette.success.light,
                              fontSize: '14px',
                              fontWeight: '400',
                              lineHeight: '20px',
                            }}
                          >
                            {offer.userName}
                          </Typography>
                          <CardMedia
                            component="img"
                            image={IconView}
                            sx={{
                              width: '12px',
                              height: '12px',
                            }}
                          />
                        </Box>
                      </StyledTd>

                      <StyledTd>
                        {!expired && (
                          <Box
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'flex-end'}
                            gap={2}
                          >
                            <Box
                              display={'flex'}
                              alignItems={'center'}
                              gap={0.5}
                              sx={{ cursor: 'pointer' }}
                              onClick={() => acceptOfferHandler(offer)}
                            >
                              <CardMedia
                                component={'img'}
                                image={AcceptDarkIcon}
                                sx={{
                                  width: 18,
                                  objectFit: 'cover',
                                }}
                              />

                              <Typography
                                fontSize={14}
                                fontWeight={500}
                                color={theme.palette.success.light}
                              >
                                Accept
                              </Typography>
                            </Box>

                            <Box
                              display={'flex'}
                              alignItems={'center'}
                              gap={0.5}
                              sx={{ cursor: 'pointer' }}
                              onClick={() => rejectOfferHandler(offer)}
                            >
                              <CardMedia
                                component={'img'}
                                image={RejectDarkIcon}
                                sx={{
                                  width: 18,
                                  objectFit: 'cover',
                                }}
                              />

                              <Typography
                                fontSize={14}
                                fontWeight={500}
                                color={'#FFA5A5'}
                              >
                                Reject
                              </Typography>
                            </Box>

                            <Box
                              display={'flex'}
                              alignItems={'center'}
                              sx={{ cursor: 'pointer' }}
                              gap={0.5}
                              onClick={() => rejectOfferHandler(offer)}
                            >
                              <Typography
                                fontSize={14}
                                fontWeight={500}
                                color={theme.palette.grey[200]}
                              >
                                Counter
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </StyledTd>
                    </StyledTr>
                  )
                })}
              </StyledTbody>
            </Table>
            <OfferManager
              ref={offerRef}
              offerData={curOffer}
              commonLicenseData={commonLicenseData}
            />
          </Box>
        )}
      </CustomizedContainer>
    </Box>
  )
}
