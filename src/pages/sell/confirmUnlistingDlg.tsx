import React from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import {
  Box,
  CardMedia,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material'
import CloseDarkIcon from 'src/assets/images/close_dark.png'
import SecondaryButton from 'src/components/buttons/secondary-button'

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

export interface ConfirmDlgProps {
  open: boolean
  setOpen: (open: boolean) => void
  handler: (isConfirmed: boolean) => void
}

export default function ConfirmUnlistingDlg({
  open,
  setOpen,
  handler,
}: ConfirmDlgProps) {
  const theme = useTheme()

  const handleClose = () => {
    setOpen(false)
    handler(false)
  }

  const confirm = () => {
    setOpen(false)
    handler(true)
  }

  return (
    <BootstrapDialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogContent sx={{ position: 'relative' }}>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
          p={3}
        >
          <Typography fontSize={21} fontWeight={600} lineHeight={'26px'}>
            Confirm license unlisting
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
        <Box display={'flex'} flexDirection={'column'} gap={1} py={3}>
          <Typography
            fontSize={14}
            fontWeight={500}
            color={theme.palette.text.primary}
            px={3}
          >
            By confirming your un-listing, users will no longer be able to see
            or interact with your license. Current offers on this license will
            be automatically declined and refunded.
          </Typography>

          <Typography
            fontSize={14}
            fontWeight={400}
            color={theme.palette.grey[300]}
            px={3}
          >
            By un-listing you will need to get permission from any other
            rights-holders on the song before re-listing the license, you may do
            this whenever you please.
          </Typography>
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
                confirm()
              }}
            >
              Confirm unlisting
            </SecondaryButton>
            <SecondaryButton onClick={handleClose}>
              Cancel unlisting
            </SecondaryButton>
          </Box>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  )
}
