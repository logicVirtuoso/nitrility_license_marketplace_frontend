import React, { useState, useMemo, useEffect, useCallback } from 'react'
import {
  Box,
  styled,
  Typography,
  useTheme,
  Divider,
  Select,
  FormControlLabel,
  FormControl,
  MenuItem,
  InputLabel,
  OutlinedInput,
  Checkbox,
  CardMedia,
} from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'
import defaultSrc from '../../assets/images/profile/profile_banner_dark.png'
import { UploadImageContainer } from '../profile/style'
import { UploadImage } from '../profile/style'
import { StyledTab, StyledTabs } from 'src/components/styledTab'
import AccountTabList from './accountTabList'
import ActivityTable from './activityTable'
import { Activities, SortOption, sortOptions } from 'src/interface'
import { useParams } from 'react-router-dom'
import { getAllAccounts, getAllActivities } from 'src/api'
import IconSuccess from 'src/assets/success.svg'
import IconView from 'src/assets/view.svg'

export const Container = styled(Box)(({ theme }) => ({
  width: '100%',
  background: theme.palette.background.paper,
  margin: 'auto',
}))

const PageContent = styled(Box)(({ theme }) => ({
  padding: '0px 100px',
  display: 'flex',
  flexDirection: 'column',
}))

const TabsContainer = styled(Box)(({ theme }) => ({
  margin: 'auto',
  marginTop: theme.spacing(1),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    marginTop: theme.spacing(3),
    width: '95%',
  },
}))

enum TabTypes {
  Activity = 'Activity',
  Account = 'Account',
}

const TabItems = [
  {
    label: 'Activity',
    value: 'Activity',
  },
  {
    label: 'Account',
    value: 'Account',
  },
]

export default function InformationPublicProfile() {
  const theme = useTheme()
  const { buyerAddr, sellerId } = useParams()
  const [tabValue, setTabValue] = React.useState<string>(TabTypes.Activity)
  const [menuOpen, setMenuOpen] = useState(false)
  const [filters, setFilters] = React.useState({
    activities: { [Activities.Sales]: true, [Activities.Offers]: true },
    sortOption: SortOption.Newest,
  })
  const [userName, setUserName] = React.useState<string>('')
  const [joinedDate, setJoinedDate] = React.useState<string>('')
  const [owned, setOwned] = React.useState<number>(0)

  const [allActivities, setAllActivities] = useState([])
  const [allAccounts, setAllAccounts] = useState({
    artistAccounts: [],
    buyerCompanies: [],
    sellerCompanies: [],
    socialAccounts: [],
  })
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

  const tabHandler = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue)
  }

  const sortOptionHandler = useCallback(
    (event: SelectChangeEvent<SortOption>) => {
      setFilters((prev) => ({
        ...prev,
        sortOption: event.target.value as SortOption,
      }))
    },
    [],
  )

  useEffect(() => {
    const fetchActivities = async () => {
      const { data, success } = await getAllActivities(
        buyerAddr,
        sellerId,
        filters,
        false,
      )
      if (success) {
        const monthNames = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ]
        const date = new Date(data.joinedDate)
        const formattedDate = `${
          monthNames[date.getMonth()]
        } ${date.getFullYear()}`
        setJoinedDate(formattedDate)
        setAllActivities(data.activities)
        setUserName(data.userName)
        setOwned(data.owned)
      }
    }

    const fetchAllAccounts = async () => {
      const { data, success } = await getAllAccounts(buyerAddr)
      if (success) {
        setAllAccounts(data)
      }
    }

    fetchActivities()
    fetchAllAccounts()
  }, [buyerAddr, sellerId, filters])

  const currentTabPage = useMemo(() => {
    if (tabValue === TabTypes.Activity) {
      return (
        <Box marginTop={'24px'}>
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
                }}
              >
                <InputLabel
                  id="duration-label"
                  shrink={false}
                  sx={{
                    position: 'absolute',
                    color: '#FFF',
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
                  }}
                >
                  By Activity
                  <Typography
                    sx={{
                      fontSize: '10px',
                      bgcolor: theme.palette.text.primary,
                      color: theme.palette.grey[700],
                      width: 16,
                      height: 16,
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
                        borderRadius: '8px',
                        marginTop: '4px',
                        '& ul': {
                          py: 1.5,
                        },
                        '& li': {
                          px: 1.5,
                        },
                        '& .MuiMenuItem-root': {
                          py: 0,
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
                  }}
                >
                  <MenuItem>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.activities[Activities.Sales]}
                          onChange={() => {
                            setFilters((prev) => ({
                              ...prev,
                              activities: {
                                ...prev.activities,
                                [Activities.Sales]:
                                  !prev.activities[Activities.Sales],
                              },
                            }))
                          }}
                        />
                      }
                      label={Activities.Sales}
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontSize: '14px',
                          color: theme.palette.grey[200],
                        },
                      }}
                    />
                  </MenuItem>
                  <MenuItem>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={filters.activities[Activities.Offers]}
                          onChange={() => {
                            setFilters((prev) => ({
                              ...prev,
                              activities: {
                                ...prev.activities,
                                [Activities.Offers]:
                                  !prev.activities[Activities.Offers],
                              },
                            }))
                          }}
                        />
                      }
                      label={Activities.Offers}
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          fontSize: '14px',
                          color: theme.palette.grey[200],
                        },
                      }}
                    />
                  </MenuItem>
                </Select>
              </FormControl>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: '400',
                  color: theme.palette.success.light,
                  cursor: 'pointer',
                }}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    activities: { Sales: false, Offers: false },
                  }))
                }
              >
                Clear Filters
              </Typography>
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
              <Select
                value={filters.sortOption}
                onChange={sortOptionHandler}
                input={<OutlinedInput />}
                renderValue={(selected) => {
                  return selected
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
                    style: {
                      maxWidth: '200px',
                      fontSize: '14px',
                    },
                  },
                }}
                inputProps={{
                  'aria-label': 'Without label',
                }}
                sx={{
                  width: '136px',
                  height: '38px',
                  fontSize: '14px',
                  fontWeight: '400',
                  '& .MuiOutlinedInput-notchedOutline': {
                    marginLeft: 'auto',
                  },
                  '& .Mui-focused': {
                    boxShadow: 'none',
                  },
                  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                    outline: 'none',
                    boxShadow: 'none',
                  },
                }}
              >
                {sortOptions.map((filter, idx) => (
                  <MenuItem key={idx} value={filter} sx={{ fontSize: '14px' }}>
                    {filter}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
          <ActivityTable activities={allActivities} />
        </Box>
      )
    } else {
      return (
        <Box display={'flex'} flexDirection={'column'}>
          <AccountTabList
            title="Current Linked Artist Account"
            desc="Sellers Profile"
          >
            {allAccounts.artistAccounts.length === 0 ? (
              <Typography
                sx={{
                  width: '50%',
                  fontSize: '14px',
                  fontWeight: '600',
                  lineHeight: '21px',
                }}
              >
                {`No Sellers Profile Linked`}
              </Typography>
            ) : (
              <>
                {allAccounts.artistAccounts.map((artistAccount, idx) => {
                  return (
                    <React.Fragment key={idx}>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: '600',
                          lineHeight: '21px',
                          color: theme.palette.success.light,
                        }}
                      >
                        {artistAccount}
                      </Typography>
                      <CardMedia
                        component={'img'}
                        image={IconSuccess}
                        sx={{
                          width: '12px',
                          height: '12px',
                        }}
                      />
                    </React.Fragment>
                  )
                })}
              </>
            )}
          </AccountTabList>
          <AccountTabList
            title="Current Company Associated with Sales"
            desc="Company"
          >
            {allAccounts.buyerCompanies.length === 0 ? (
              <Typography
                sx={{
                  width: '50%',
                  fontSize: '14px',
                  fontWeight: '600',
                  lineHeight: '21px',
                }}
              >
                {`No Company Linked`}
              </Typography>
            ) : (
              <>
                {allAccounts.buyerCompanies.map((company, idx) => {
                  return (
                    <React.Fragment key={idx}>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: '600',
                          lineHeight: '21px',
                          color: theme.palette.success.light,
                        }}
                      >
                        {company}
                      </Typography>
                      <CardMedia
                        component={'img'}
                        image={IconSuccess}
                        sx={{ width: '12px', height: '12px' }}
                      />
                    </React.Fragment>
                  )
                })}
              </>
            )}
          </AccountTabList>
          <AccountTabList
            title="Current Company Associated with Purchases"
            desc="Company"
          >
            {allAccounts.buyerCompanies.length === 0 ? (
              <Typography
                sx={{
                  width: '50%',
                  fontSize: '14px',
                  fontWeight: '600',
                  lineHeight: '21px',
                }}
              >
                {`No Company Linked`}
              </Typography>
            ) : (
              <>
                {allAccounts.buyerCompanies.map((company, idx) => {
                  return (
                    <React.Fragment key={idx}>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: '600',
                          lineHeight: '21px',
                          color: theme.palette.success.light,
                        }}
                      >
                        {company}
                      </Typography>
                      <CardMedia
                        component={'img'}
                        image={IconSuccess}
                        sx={{ width: '12px', height: '12px' }}
                      />
                    </React.Fragment>
                  )
                })}
              </>
            )}
          </AccountTabList>
          <Box marginTop={'24px'}>
            <Typography
              sx={{ fontSize: '16px', fontWeight: '600', lineHeight: '24px' }}
            >
              Current Linked Accounts
            </Typography>
            <Box display={'flex'} flexDirection={'column'}>
              {allAccounts.socialAccounts.map((platform, idx) => {
                return (
                  <Box
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    key={idx}
                    borderBottom={`1px solid ${theme.palette.grey[600]}`}
                    py={2}
                  >
                    <Box sx={{ width: '50%' }}>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: '400',
                          lineHeight: '24px',
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {platform.platformTitle}
                      </Typography>
                    </Box>

                    <Box display="flex" flexDirection={'column'} width={'50%'}>
                      {platform.accounts.map((account, index) => {
                        return (
                          <Box
                            sx={{
                              width: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              cursor: 'pointer',
                            }}
                            key={index}
                            onClick={() =>
                              window.open(account, '_blank', 'noreferrer')
                            }
                          >
                            <Typography
                              sx={{
                                fontSize: '14px',
                                fontWeight: '600',
                                lineHeight: '21px',
                                color: theme.palette.success.light,
                              }}
                            >
                              {account}
                            </Typography>
                            <CardMedia
                              component={'img'}
                              image={IconView}
                              sx={{ width: '12px', height: '12px' }}
                            />
                          </Box>
                        )
                      })}
                    </Box>
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Box>
      )
    }
  }, [
    tabValue,
    theme,
    menuOpen,
    filters,
    allActivities,
    allAccounts,
    sortOptionHandler,
  ])

  return (
    <Box display={'flex'} justifyContent={'center'}>
      <Container>
        <Box className="container"></Box>
        <UploadImageContainer>
          <UploadImage
            sx={{
              height: '100%',
              width: '100%',
              borderRadius: '10px',
            }}
            src={defaultSrc}
          />
        </UploadImageContainer>

        <PageContent sx={{ mb: 5, mt: 5 }}>
          <Box display={'flex'} alignItems={'center'}>
            <Box
              display={'flex'}
              flexDirection={'column'}
              alignItems={'flex-start'}
              ml={1}
            >
              <Typography
                variant="h2"
                sx={{
                  maxWidth: '300px',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textAlign: 'left',
                  paddingTop: 2,
                  color: theme.palette.text.primary,
                }}
              >
                {userName}
              </Typography>
              <Typography
                sx={{
                  maxWidth: '200px',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  fontSize: '14px',
                  fontFamily: 'var(--font-base)',
                  color: theme.palette.text.secondary,
                }}
              >
                Joined {joinedDate}
              </Typography>
            </Box>
            <Box display={'flex'} alignItems={'center'} ml={'auto'} gap={5}>
              <Box
                display={'flex'}
                flexDirection={'column'}
                alignItems={'flex-start'}
              >
                <Typography variant="body2" color={theme.palette.text.primary}>
                  Licenses Owned From You
                </Typography>
                <Typography
                  variant="h3"
                  color={theme.palette.containerPrimary.contrastText}
                >
                  {owned}
                </Typography>
              </Box>
            </Box>
          </Box>
        </PageContent>
        <Divider />
        <PageContent sx={{ mt: 4, display: 'inherit' }}>
          <TabsContainer>
            <Box width="100%" position="relative">
              <StyledTabs value={tabValue} onChange={tabHandler}>
                {TabItems.map((item, idx) => {
                  return (
                    <StyledTab
                      value={item.value}
                      label={item.label}
                      key={idx}
                    />
                  )
                })}
              </StyledTabs>
            </Box>
          </TabsContainer>
          {currentTabPage}
        </PageContent>
      </Container>
    </Box>
  )
}
