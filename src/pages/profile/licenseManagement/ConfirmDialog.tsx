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

export interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  handler: (isConfirmed: boolean) => void
}

export default function ConfirmDialog({ open, setOpen, handler }: Props) {
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
            Confirm action
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
        <Typography
          fontSize={14}
          fontWeight={400}
          color={theme.palette.grey[300]}
          p={3}
        >
          Confirm action before proceeding
        </Typography>

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
              Confirm
            </SecondaryButton>
            <SecondaryButton onClick={handleClose}>Cancel</SecondaryButton>
          </Box>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  )
}
