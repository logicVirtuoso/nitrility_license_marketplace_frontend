import {
  styled,
  Dialog,
  DialogContent,
  Box,
  Typography,
  useTheme,
  Divider,
  IconButton,
  FormControl,
  Input,
  InputAdornment,
  CardMedia,
} from '@mui/material'
import IconClose from 'src/assets/close.svg'
import IconSearch from 'src/assets/search.svg'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SecondaryButton from './buttons/secondary-button'
import { updateFollow } from 'src/api'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import defaultSrc from 'src/assets/images/profile/profile_banner_dark.png'
import { RoleTypes } from 'src/interface'

const SearchInput = styled(Input)(({ theme }) => ({
  '&::before': {
    borderBottom: 'none',
  },
  '&::after': {
    borderBottom: 'none',
  },
  '&:hover:not(.Mui-disabled):before': {
    borderBottom: 'none',
  },
  borderRadius: '8px',
  color: theme.palette.grey[400],
  position: 'relative',
  backgroundColor:
    theme.palette.mode === 'light' ? '#F3F6F9' : theme.palette.grey[600],
  fontSize: '14px',
  width: '100%',
  lineHeight: '17.36px',
  fontWeight: '100',
  padding: '6px 8px',
  fontFamily: 'var(--font-base)',
}))

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: 0,
    backgroundColor: '#191919',
    border: 'none',
    borderRadius: 12,
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    backgroundColor: '#191919',
    maxWidth: 500,
    borderRadius: 12,
    boxShadow: 'none',
  },
}))

interface Props {
  sellerView: boolean
  open: boolean
  setOpen: (open: boolean) => void
  followers: Array<any>
}

const ProfileFollowersDialog = ({
  sellerView,
  open,
  setOpen,
  followers,
}: Props) => {
  const theme = useTheme()
  const [keyword, setKeyword] = useState('')
  const [searchedFollowers, setSeachedFollowers] = useState([])
  const navigate = useNavigate()
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (keyword) {
      const searched = followers.filter((folllower: any) => {
        return (
          folllower.firstName.toLowerCase().includes(keyword.toLowerCase()) ||
          folllower.lastName.toLowerCase().includes(keyword.toLowerCase()) ||
          `${folllower.firstName} ${folllower.lastName}`
            .toLowerCase()
            .includes(keyword.toLowerCase())
        )
      })
      setSeachedFollowers(searched)
    } else {
      setSeachedFollowers(followers)
    }
  }, [followers, keyword])

  return (
    <BootstrapDialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogContent sx={{ position: 'relative' }}>
        <Box
          sx={{
            padding: '24px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'var(--font-semi-bold)',
              fontSize: 21,
              color: theme.palette.text.primary,
              lineHeight: '26px',
            }}
          >
            Follwers
          </Typography>
          <IconButton onClick={handleClose}>
            <CardMedia component={'img'} image={IconClose} />
          </IconButton>
        </Box>
        <Divider />
        <Box
          sx={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <FormControl variant="standard">
            <SearchInput
              id="standard-adornment-amount"
              placeholder={`Search ${followers.length} followers...`}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <CardMedia component={'img'} image={IconSearch} />
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
        <Box sx={{ padding: '0px 24px 24px 24px' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              height: '300px',
              overflowY: 'auto',
            }}
          >
            {searchedFollowers?.map((follower, idx) => {
              return (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    cursor: 'pointer',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onClick={() => {
                    if (sellerView) {
                      navigate(
                        `/info-pub-profile/${follower.accountAddress}/${authorization.currentUser.sellerId}}`,
                      )
                      setOpen(false)
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                    }}
                  >
                    <CardMedia
                      component={'img'}
                      image={
                        follower.avatarPath ? follower.avatarPath : defaultSrc
                      }
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                      }}
                    />
                    <Box display={'flex'} flexDirection={'column'}>
                      <Typography
                        sx={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: theme.palette.grey[50],
                        }}
                      >
                        {follower.userName}
                      </Typography>

                      <Typography
                        fontSize={14}
                        fontWeight={400}
                        color={theme.palette.grey[400]}
                      >
                        {follower.userName}
                      </Typography>
                    </Box>
                  </Box>
                  {authorization?.currentUser?.accountAddress ==
                    follower.accountAddress && (
                    <SecondaryButton
                      onClick={async (e) => {
                        e.stopPropagation()
                        const res = await updateFollow(
                          follower.sellerId,
                          authorization.currentUser.accountAddress,
                        )
                        console.log(res)
                      }}
                    >
                      Unfollow
                    </SecondaryButton>
                  )}
                </Box>
              )
            })}
          </Box>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  )
}

export default ProfileFollowersDialog
