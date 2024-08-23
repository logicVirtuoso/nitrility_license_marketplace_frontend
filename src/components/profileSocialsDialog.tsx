import {
  styled,
  Dialog,
  DialogContent,
  Box,
  Typography,
  useTheme,
  Divider,
  IconButton,
  InputBase,
  CardMedia,
} from '@mui/material'
import IconClose from 'src/assets/close.svg'

import ThridButton from './third-button'
import { SocialAccountList, SocialAccountType } from 'src/constants'
import { useContext } from 'react'
import { PublicProfileContext } from 'src/context/publicProfileContext'

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  width: '100%',
  '& .MuiInputBase-input': {
    borderTopRightRadius: '8px',
    color: theme.palette.grey[400],
    borderBottomRightRadius: '8px',
    position: 'relative',
    backgroundColor:
      theme.palette.mode === 'light' ? '#F3F6F9' : theme.palette.grey[600],
    fontSize: '16px',
    width: '100%',
    lineHeight: '24px',
    fontWeight: '400',
    padding: '9px 12px',
    fontFamily: 'var(--font-base)',
  },
}))

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: 0,
    backgroundColor: '#191919',
    border: 'none',
    borderRadius: '12px',
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

interface SocialCardIF {
  socialAccountType: string
}

const SocialCard = ({ socialAccountType }: SocialCardIF) => {
  const theme = useTheme()
  const { publicProfileData, setPublicProfileData } =
    useContext(PublicProfileContext)

  return (
    <Box display={'flex'} justifyContent={'space-between'} px={3} gap={'2px'}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '42px',
          height: '41px',
          background: theme.palette.grey[600],
          borderRadius: '8px 0px 0px 8px',
          p: 1.5,
        }}
      >
        <CardMedia
          component={'img'}
          image={SocialAccountList[socialAccountType].icon}
        />
      </Box>
      <BootstrapInput
        placeholder={SocialAccountList[socialAccountType].placeHolder}
        value={
          publicProfileData.socials[socialAccountType]
            ? publicProfileData.socials[socialAccountType]
            : ''
        }
        onChange={(e) => {
          setPublicProfileData((prev) => ({
            ...prev,
            socials: {
              ...prev.socials,
              [socialAccountType]: e.target.value,
            },
          }))
        }}
      />
    </Box>
  )
}

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

const ProfileSocialsDialog = ({ open, setOpen }: Props) => {
  const theme = useTheme()

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <BootstrapDialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogContent sx={{ position: 'relative' }}>
        <Box display={'flex'} justifyContent={'space-between'} p={3}>
          <Typography
            sx={{
              fontFamily: 'var(--font-semi-bold)',
              fontSize: 21,
              color: theme.palette.text.primary,
              lineHeight: '26px',
            }}
          >
            Socials
          </Typography>
          <IconButton onClick={handleClose}>
            <CardMedia component={'img'} image={IconClose} />
          </IconButton>
        </Box>
        <Divider />
        <Box display={'flex'} flexDirection={'column'} gap={3} py={3}>
          {Object.keys(SocialAccountList)
            .filter((account) => account !== SocialAccountType.Spotify)
            .map((socialAccount, idx) => (
              <SocialCard key={idx} socialAccountType={socialAccount} />
            ))}
        </Box>
        <Divider />
        <Box p={3}>
          <ThridButton
            sx={{
              width: '100%',
              borderRadius: 12,
            }}
            onClick={() => {
              setOpen(false)
            }}
          >
            Continue
          </ThridButton>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  )
}

export default ProfileSocialsDialog
