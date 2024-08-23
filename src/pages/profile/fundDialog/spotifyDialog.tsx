import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { Theme, useTheme } from '@mui/material/styles'
import CodeVerification from '../../../components/code-verification'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import {
  sendVerificationCodeToSpotifyEmail,
  verifySellerAccount,
} from '../../../api'
import { toast } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import SecondaryButton from 'src/components/buttons/secondary-button'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import useListingLicense from 'src/hooks/useListingLicense'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    width: '100%',
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    backgroundColor: '#fff',
    width: 500,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

export interface SpotifyDialogDialogProps {
  spotifyEmail: string
  open: boolean
  setOpen: (open: boolean) => void
}

export default function SpotifyDialog({
  spotifyEmail,
  open,
  setOpen,
}: SpotifyDialogDialogProps) {
  const [verificationCode, setVerificationCode] = useState<string>('')
  const [next, setNext] = useState<boolean>(false)
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const { withdraw } = useListingLicense()
  const handleClose = () => {
    setOpen(false)
  }

  const resendHandler = async () => {
    const toastLoading = toast.loading('Resending verification code')
    try {
      const res = await sendVerificationCodeToSpotifyEmail(
        spotifyEmail,
        authorization.currentUser.accountAddress,
      )
      if (res.status === 200 && res.data.success) {
        toast.success(res.data.msg, { id: toastLoading })
      } else {
        toast.error(res.data.msg, { id: toastLoading })
      }
    } catch (e) {
      console.log('error in resending email', e)
      toast.error('Something went wrong', { id: toastLoading })
    }
  }

  const withdrawHandler = async () => {
    setOpen(false)
    await withdraw(authorization.currentUser.sellerId)
  }

  const verificationCodeHandler = async (val: string) => {
    setVerificationCode(val)
    if (val.length === 6) {
      const toastLoading = toast.loading('Verifying the code...')
      try {
        const res = await verifySellerAccount(
          authorization.currentUser.accountAddress,
          val,
        )
        if (res.status === 200 && res.data.success) {
          setNext(true)
          toast.success(res.data.msg, { id: toastLoading })
        } else {
          setVerificationCode('')
          toast.error(res.data.msg, { id: toastLoading })
        }
      } catch (e) {
        setVerificationCode('')
        console.log('error in verifying funding code', e)
        toast.error('Something went wrong', { id: toastLoading })
      }
    }
  }

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogContent dividers>
        {!next ? (
          <Box
            sx={{
              backgroundColor: '#fff',
              padding: '20px 0px 0px',
            }}
          >
            <Box sx={{ marginBottom: '20px' }}>
              <Typography align="center" variant="h4">
                Verify Your Spotify
              </Typography>
              <Typography align="center" variant="h4">
                (Check Email you used to Sign up for Spotify)
              </Typography>
            </Box>
            <CodeVerification
              verificationCode={verificationCode}
              handler={verificationCodeHandler}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <SecondaryButton
                sx={{ margin: '20px 0px', width: 120 }}
                onClick={() => resendHandler()}
              >
                Resend Code
              </SecondaryButton>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              padding: '0px',
              gap: '10px',
              width: '100%',
            }}
          >
            <SecondaryButton
              sx={{ width: '100%' }}
              onClick={() => withdrawHandler()}
            >
              Magic Wallet
            </SecondaryButton>
            <SecondaryButton sx={{ width: '100%' }}>Card</SecondaryButton>
            <SecondaryButton sx={{ width: '100%' }}>Bank</SecondaryButton>
            <SecondaryButton sx={{ width: '100%' }}>Other</SecondaryButton>
          </Box>
        )}
      </DialogContent>
    </BootstrapDialog>
  )
}
