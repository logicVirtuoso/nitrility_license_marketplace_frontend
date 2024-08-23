import {
  Box,
  CardMedia,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputAdornment,
  InputBase,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
  styled,
  useTheme,
} from '@mui/material'
import { Activities, RoleTypes, SortOption, sortOptions } from 'src/interface'
import React, { useCallback, useEffect, useState } from 'react'
import ActivityTable from '../infoPublicProfile/activityTable'
import {
  StyledOutlinedInputFC,
  StyledSelectFC,
} from 'src/components/styledInput'
import IconSearch from 'src/assets/search.svg'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { getAllActivities } from 'src/api'

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    height: '38px',
  },
  '& .MuiInputBase-input': {
    fontSize: '14px',
  },
}))

const StopPropagation = ({ children }) => (
  <div
    onClick={(e) => {
      e.stopPropagation()
    }}
  >
    {children}
  </div>
)

interface Props {
  isSeller: boolean
}

const buyerActivities = [Activities.Sales, Activities.Offers]

const sellerActivities = [
  Activities.Listings,
  Activities.Collaborations,
  Activities.Sales,
  Activities.Offers,
]

const sellerFilter = {
  [Activities.Listings]: true,
  [Activities.Collaborations]: true,
  [Activities.Sales]: true,
  [Activities.Offers]: true,
}

const buyerFilter = {
  [Activities.Sales]: true,
  [Activities.Offers]: true,
}

export default function ActivityTab({ isSeller }: Props) {
  const theme = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectOpen, setSelectOpen] = useState(false)
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const [allActivities, setAllActivities] = useState([])
  const [filters, setFilters] = React.useState({
    activities: isSeller ? sellerFilter : buyerFilter,
    sortOption: SortOption.Newest,
    keyword: '',
  })

  const handleOpenSelect = (e) => {
    setSelectOpen(true)
    e.stopPropagation()
  }

  const handleCloseSelect = (e) => {
    setSelectOpen(false)
    e.stopPropagation()
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

  const searchHandler = (value) => {
    setFilters((prev) => ({ ...prev, keyword: value }))
  }

  useEffect(() => {
    const fetchActivities = async () => {
      const { data, success } = await getAllActivities(
        authorization.currentUser.accountAddress,
        authorization.currentUser.sellerId ?? '',
        filters,
        authorization.currentUser.role == RoleTypes.Seller ? true : false,
      )
      if (success) {
        setAllActivities(data.activities)
      }
    }
    fetchActivities()
  }, [authorization.currentUser, filters])

  const renderActivities = (activities) => {
    return activities.map((item, idx) => (
      <MenuItem key={idx}>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.activities[item]}
              onChange={() => {
                setFilters((prev) => ({
                  ...prev,
                  activities: {
                    ...prev.activities,
                    [item]: !prev.activities[item],
                  },
                }))
              }}
            />
          }
          label={item}
          sx={{
            '& .MuiFormControlLabel-label': {
              fontSize: '14px',
              color: theme.palette.grey[200],
            },
          }}
        />
      </MenuItem>
    ))
  }

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
              input={
                <OutlinedInput
                  sx={{ width: '100%', border: 'none !important' }}
                />
              }
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
              {isSeller
                ? renderActivities(sellerActivities)
                : renderActivities(buyerActivities)}
            </Select>
          </FormControl>

          <FormControl
            sx={{
              width: '155px',
              background: theme.palette.grey[600],
              height: '38px',
              fontSize: '12px',
              fontWeight: '400',
              borderRadius: '6px',
              '& .MuiInputLabel-root.Mui-focused': {
                color: theme.palette.grey[400],
              },
            }}
          >
            <InputLabel
              shrink={false}
              sx={{
                position: 'absolute',
                color: theme.palette.grey[400],
                transformOrigin: 'top left',
                fontSize: '14px',
                lineHeight: '1',
                transform: 'none',
                marginTop: '12px',
                left: 0,
                right: 0,
              }}
            >
              By your licenses
            </InputLabel>
            <Select
              open={selectOpen}
              onOpen={handleOpenSelect}
              onClose={handleCloseSelect}
              input={<BootstrapInput />}
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
                    marginTop: '10px',
                    '& ul': {
                      padding: '12px',
                    },
                    '& .MuiMenuItem-root': {
                      padding: 0,
                    },
                  },
                },
              }}
            >
              <StopPropagation>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '100%',
                    alignItems: 'flex-end',
                  }}
                >
                  <StyledOutlinedInputFC
                    fullWidth
                    type="text"
                    value={filters.keyword}
                    placeholder={'Search licenses...'}
                    onChange={(e) => {
                      searchHandler(e.target.value)
                    }}
                    sx={{
                      bgcolor: theme.palette.grey[700],
                      maxWidth: 250,
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
                  />
                </Box>
              </StopPropagation>
            </Select>
          </FormControl>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: '400',
              color: theme.palette.success.light,
              cursor: 'pointer',
            }}
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
          <StyledSelectFC
            select
            name="sortOption"
            value={filters.sortOption}
            onChange={sortOptionHandler}
          >
            {sortOptions.map((filter, idx) => (
              <MenuItem key={idx} value={filter} sx={{ fontSize: '14px' }}>
                {filter}
              </MenuItem>
            ))}
          </StyledSelectFC>
        </Box>
      </Box>
      <Box
        sx={{
          mx: '-34px',
        }}
      >
        <ActivityTable activities={allActivities} />
      </Box>
    </Box>
  )
}
