import {
  Box,
  CardMedia,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import DialogContent from '@mui/material/DialogContent'
import Dialog from '@mui/material/Dialog'
import CloseDarkIcon from 'src/assets/images/close_dark.png'
import SecondaryButton from 'src/components/buttons/secondary-button'
import CodeVerification from './code-verification'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { verifySellerAccount } from 'src/api'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { AUTHENTICATED } from 'src/actions/actionTypes'
import { updateStore } from 'src/utils/utils'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: 0,
    backgroundColor: theme.palette.secondary.main,
    border: 'none',
    borderRadius: 12,
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    backgroundColor: theme.palette.secondary.main,
    maxWidth: 500,
    borderRadius: 12,
  },
}))

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function SpotifyAuthDlg({ open, setOpen }: Props) {
  const theme = useTheme()
  const [verifying, setVerifying] = useState<boolean>(false)
  const [verificationCode, setVerificationCode] = useState<string>('')
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  const resendHandler = async () => {
    // const toastLoading = toast.loading('Resending verification code')
    // try {
    //   const res = await sendVerificationCodeToSpotifyEmail(
    //     authorization.currentUser.accountAddress,
    //   )
    //   if (res.status === 200 && res.data.success) {
    //     toast.success(res.data.msg, { id: toastLoading })
    //   } else {
    //     toast.error(res.data.msg, { id: toastLoading })
    //   }
    // } catch (e) {
    //   console.log('error in resending verification code', e)
    //   toast.error('Something went wrong', { id: toastLoading })
    // }
  }

  const verificationCodeHandler = async (val: string) => {
    setVerificationCode(val)
    if (val.length === 6) {
      setVerifying(true)
      const toastLoading = toast.loading('Verifying the code...')
      try {
        const res = await verifySellerAccount(
          authorization.currentUser.accountAddress,
          val,
        )
        if (res.status === 200 && res.data.success) {
          updateStore(AUTHENTICATED, res.data.data.accessToken)
          toast.success(res.data.msg, { id: toastLoading })
        } else {
          setVerificationCode('')
          toast.error(res.data.msg, { id: toastLoading })
        }
      } catch (e) {
        setVerificationCode('')
        toast.error(
          'Something went wrong, Please make sure if your account is artist account',
          { id: toastLoading },
        )
      }
      setVerifying(false)
    }
  }
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <BootstrapDialog open={open} maxWidth="sm" fullWidth={true}>
      <DialogContent sx={{ position: 'relative' }}>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
          p={3}
        >
          <Typography fontSize={21} fontWeight={600} lineHeight={'26px'}>
            Login Verification
          </Typography>
          <IconButton
            sx={{
              position: 'absolute',
              right: 14,
              top: 14,
            }}
            onClick={handleClose}
          >
            <CardMedia image={CloseDarkIcon} component={'img'} />
          </IconButton>
        </Box>
        <Divider />

        <Box p={3}>
          <Typography
            fontSize={16}
            fontWeight={500}
            color={theme.palette.text.primary}
          >
            We need to verify this is you before proceeding this session. We
            won’t ask you again for 24 hours.
          </Typography>
          <Box display={'flex'} flexDirection={'column'} py={3}>
            <Typography
              fontSize={14}
              fontWeight={600}
              color={theme.palette.text.primary}
            >
              Verify your account
            </Typography>
            <Typography
              fontSize={14}
              fontWeight={400}
              color={theme.palette.grey[400]}
            >
              Check the email you used to sign up for Spotify
            </Typography>
          </Box>

          <CodeVerification
            verificationCode={verificationCode}
            handler={verificationCodeHandler}
          />

          <Box display={'flex'}>
            <Typography
              fontWeight={400}
              fontSize={14}
              color={theme.palette.text.secondary}
            >
              Didn’t receive an email?
            </Typography>
            <Typography
              fontWeight={400}
              fontSize={14}
              color={theme.palette.text.primary}
              onClick={() => resendHandler()}
            >
              Resend code.
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          p={2}
        >
          <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            gap={1}
          >
            <SecondaryButton
              onClick={() => {
                setOpen(false)
              }}
            >
              Confirm
            </SecondaryButton>
            <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
          </Box>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  )
}
