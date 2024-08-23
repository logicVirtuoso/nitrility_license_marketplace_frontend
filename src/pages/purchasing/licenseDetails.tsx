import {
  Box,
  Button,
  CardMedia,
  Divider,
  Grid,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import SecondaryButton from 'src/components/buttons/secondary-button'
import React from 'react'
import { listingFormatTypes } from 'src/config'
import { useTokenPrice } from 'src/hooks/useTokenPrice'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { LicensingTypes, AccessLevel, GoverningLaw } from 'src/interface'
import useUtils from 'src/hooks/useUtils'
import WhiteBtn from 'src/components/buttons/whiteBtn'
import StrokeDarkIcon from 'src/assets/images/stroke_dark.svg'
import dayjs from 'dayjs'
import ArrowDarkIcon from 'src/assets/images/purchasing/arrow_dark.svg'
import { styled, alpha } from '@mui/material/styles'
import Menu, { MenuProps } from '@mui/material/Menu'

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: theme.palette.grey[600],
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 200,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
      '&:hover': {
        bgcolor: theme.palette.secondary.main,
      },
    },
  },
}))

const StyledBtn = styled(Button)(({ theme }) => ({
  color: theme.palette.secondary.dark,
  backgroundColor: theme.palette.grey[200],
  width: '100%',
  borderRadius: 72,
  height: 42,
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: theme.palette.grey[300],
  },
}))

interface PurchasingBtnProps {
  buyHandler: (AccessLevel) => void
}

const PurchasingBtn = ({ buyHandler }: PurchasingBtnProps) => {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const purchaseLicense = (accessLevel: AccessLevel) => {
    buyHandler(accessLevel)
    handleClose()
  }

  return (
    <>
      <StyledBtn
        id="purchasing-button"
        aria-controls={open ? 'purchasing-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={
          <CardMedia
            component={'img'}
            image={ArrowDarkIcon}
            sx={{
              width: 15,
              height: 7,
            }}
          />
        }
      >
        Purchase License
      </StyledBtn>
      <StyledMenu
        id="purchasing-menu"
        MenuListProps={{
          'aria-labelledby': 'purchasing-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          sx={{
            p: 1.5,
            margin: '3px 6px',
            borderRadius: 1.5,
            '&:hover': {
              bgcolor: theme.palette.secondary.main,
            },
          }}
          onClick={() => purchaseLicense(AccessLevel.NonExclusive)}
          disableRipple
        >
          Nonexclusive
        </MenuItem>
        <MenuItem
          sx={{
            p: 1.5,
            margin: '3px 6px',
            borderRadius: 1.5,
            '&:hover': {
              bgcolor: theme.palette.secondary.main,
            },
          }}
          onClick={() => purchaseLicense(AccessLevel.Exclusive)}
          disableRipple
        >
          Exclusive
        </MenuItem>
      </StyledMenu>
    </>
  )
}

interface Props {
  licensingType: LicensingTypes
  syncData: any
  isOwner: boolean
  sellerId: string
  sellerName: string
  goToLicenseSettingPage: () => void
  historyHandler: () => void
  placeBid: (AccessLevel) => void
  buyHandler: (AccessLevel) => void
  addToCartHandler: () => void
}

export default function LicenseDetails({
  licensingType,
  syncData,
  isOwner,
  sellerId,
  sellerName,
  goToLicenseSettingPage,
  historyHandler,
  placeBid,
  buyHandler,
  addToCartHandler,
}: Props) {
  const theme = useTheme()
  const [percentOfExpiration, setPercentOfExpiration] =
    React.useState<number>(0)
  const [forward, setForward] = React.useState<boolean>(false)
  const [coountedDays, setCountedDays] = React.useState<number>(0)
  const [coountedHrs, setCountedHrs] = React.useState<number>(0)
  const [coountedMins, setCountedMins] = React.useState<number>(0)
  const [coountedSecs, setCountedSecs] = React.useState<number>(0)
  const [expired, setExpired] = React.useState<boolean>(false)
  const { tokenPrice } = useTokenPrice()

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (syncData.infiniteListingDuration) {
      } else {
        const currentTime = new Date().getTime()
        const expiration = syncData.endTime

        setPercentOfExpiration(currentTime / expiration)
        setForward((prevForward) => !prevForward)
        if (currentTime < expiration) {
          const remainedTime = expiration - currentTime
          const days = Math.floor(remainedTime / (1000 * 60 * 60 * 24))
          const hours = Math.floor(
            (remainedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          )
          const minutes = Math.floor(
            (remainedTime % (1000 * 60 * 60)) / (1000 * 60),
          )
          const seconds = Math.floor((remainedTime % (1000 * 60)) / 1000)

          setCountedDays(days)
          setCountedHrs(hours)
          setCountedMins(minutes)
          setCountedSecs(seconds)
        } else {
          setExpired(true)
        }
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [syncData])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderRadius: 3,
        border: `1px solid ${theme.palette.grey[600]}`,
      }}
    >
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
        p={2}
      >
        <Box display={'flex'} gap={4}>
          {syncData.accessLevel !== AccessLevel.Exclusive && (
            <Box display={'flex'} flexDirection={'column'} gap={0.5}>
              <Typography variant="h5" color={theme.palette.grey[400]}>
                Non Exclusive Price
              </Typography>

              <Typography variant="h3" color={theme.palette.text.primary}>
                {syncData.listingFormatValue == listingFormatTypes.bid
                  ? 'For Bid Only'
                  : `$${(syncData.fPrice * tokenPrice).toLocaleString()} USD`}
              </Typography>
            </Box>
          )}

          {syncData.accessLevel !== AccessLevel.NonExclusive && (
            <Box display={'flex'} flexDirection={'column'} gap={0.5}>
              <Typography variant="h5" color={theme.palette.grey[400]}>
                Exclusive Price
              </Typography>

              <Typography variant="h3" color={theme.palette.text.primary}>
                {syncData.listingFormatValue == listingFormatTypes.bid
                  ? 'For Bid Only'
                  : `$${(syncData.sPrice * tokenPrice).toLocaleString()} USD`}
              </Typography>
            </Box>
          )}
        </Box>

        <Box display={'flex'} flexDirection={'column'}>
          <Typography variant="h5" color={theme.palette.grey[400]}>
            Governing Law
          </Typography>
          <Typography
            variant="h3"
            color={theme.palette.text.primary}
          >{`${syncData.country}, ${syncData.state}`}</Typography>
        </Box>
      </Box>

      <Divider />

      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Box p={2}>
            <Typography variant="h5" color={theme.palette.text.secondary}>
              Sale Ends in
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mt: 1.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                }}
              >
                <Typography
                  variant="h5"
                  color={theme.palette.containerSecondary.contrastText}
                >
                  {syncData.infiniteListingDuration ? '--' : coountedDays}
                </Typography>
                <Typography color={theme.palette.grey[1000]}>DAYS</Typography>
              </Box>
              <Typography
                variant="h3"
                color={theme.palette.containerSecondary.contrastText}
              >
                :
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                }}
              >
                <Typography
                  color={theme.palette.containerSecondary.contrastText}
                  variant="h5"
                >
                  {syncData.infiniteListingDuration ? '--' : coountedHrs}
                </Typography>
                <Typography color={theme.palette.grey[1000]}>HRS</Typography>
              </Box>
              <Typography
                variant="h3"
                color={theme.palette.containerSecondary.contrastText}
              >
                :
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                }}
              >
                <Typography
                  color={theme.palette.containerSecondary.contrastText}
                  variant="h5"
                >
                  {syncData.infiniteListingDuration ? '--' : coountedMins}
                </Typography>
                <Typography color={theme.palette.grey[1000]}>MIN</Typography>
              </Box>
              <Typography
                variant="h3"
                color={theme.palette.containerSecondary.contrastText}
              >
                :
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                }}
              >
                <Typography
                  color={theme.palette.containerSecondary.contrastText}
                  variant="h5"
                >
                  {syncData.infiniteListingDuration ? '--' : coountedSecs}
                </Typography>
                <Typography color={theme.palette.grey[1000]}>SEC</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box p={2}>
            <Box display={'flex'} alignItems={'center'} gap={0.5}>
              <Typography variant="h5" color={theme.palette.text.secondary}>
                Exclusive License Duration
              </Typography>
              <CardMedia
                component={'img'}
                image={StrokeDarkIcon}
                sx={{ width: 12, objectFit: 'cover' }}
              />
            </Box>
            <Typography
              variant="h5"
              color={theme.palette.containerSecondary.contrastText}
              mt={1.5}
            >
              {syncData.infiniteExclusiveDuration
                ? 'Infinite'
                : dayjs(syncData.exclusiveEndTime).format('DD/MM/YYYY')}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box p={2}>
            <Box display={'flex'} alignItems={'center'} gap={0.5}>
              <Typography variant="h5" color={theme.palette.text.secondary}>
                Supply of Nonexclusive Licenses
              </Typography>
              <CardMedia
                component={'img'}
                image={StrokeDarkIcon}
                sx={{ width: 12, objectFit: 'cover' }}
              />
            </Box>
            <Typography
              variant="h5"
              color={theme.palette.containerSecondary.contrastText}
              mt={1.5}
            >
              {syncData.infiniteSupply
                ? 'Infinite'
                : `${syncData.totalSupply} licenses left`}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider />

      {!isOwner ? (
        <>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 2 }}
            p={2}
          >
            <Box sx={{ width: { xs: '100%', md: '50%' } }}>
              <PurchasingBtn buyHandler={buyHandler} />
            </Box>

            <SecondaryButton
              sx={{
                width: { xs: '100%', md: '50%' },
                borderRadius: 9,
              }}
              onClick={addToCartHandler}
            >
              Add to Cart
            </SecondaryButton>
          </Stack>

          <Box display={'flex'} alignItems={'center'} gap={0.5} px={2} pb={2}>
            <Typography
              variant="subtitle1"
              color={theme.palette.text.secondary}
            >
              What’s the difference between exclusive and non-exclusive
              licenses?
            </Typography>
            <CardMedia
              component={'img'}
              image={StrokeDarkIcon}
              sx={{ width: 12, objectFit: 'cover' }}
            />
          </Box>
        </>
      ) : (
        <Box display={'flex'} alignItems={'center'} gap={1} p={2}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <WhiteBtn
                sx={{
                  width: '100%',
                  height: 42,
                  borderRadius: 18,
                }}
                disabled={!syncData.infiniteSupply && syncData.totalSupply <= 0}
                onClick={() => goToLicenseSettingPage()}
              >
                <Typography
                  sx={{
                    fontFamily: 'var(--font-semi-bold)',
                    fontSize: '14px',
                  }}
                >
                  Edit Listing
                </Typography>
              </WhiteBtn>
            </Grid>
            <Grid item xs={12} md={6}>
              <SecondaryButton
                sx={{
                  width: '100%',
                  borderRadius: 18,
                  backgroundColor: theme.palette.grey[600],
                }}
                onClick={() => historyHandler()}
              >
                Listing Activity
              </SecondaryButton>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  )
}
