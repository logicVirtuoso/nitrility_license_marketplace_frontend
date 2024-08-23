import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { Box, Typography } from '@mui/material'
import { toast } from 'react-hot-toast'
import { getContactInfoOfOffer } from '../../api'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    backgroundColor: '#fff',
    width: 400,
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

export interface OfferContactDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  buyerAddress: string
}

export default function OfferContactDialog({
  open,
  setOpen,
  buyerAddress,
}: OfferContactDialogProps) {
  const [email, setEmail] = useState<string>()

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    const init = async () => {
      if (buyerAddress) {
        const { success, msg, data } = await getContactInfoOfOffer(buyerAddress)
        if (success) {
          setEmail(data)
        } else {
          toast.error(msg)
        }
      }
    }
    init()
  }, [buyerAddress])

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogContent dividers sx={{ padding: 80 }}>
        <Box display={'flex'} alignItems={'center'} px={2}>
          <Typography
            component={'span'}
            sx={{ width: '120px', color: 'black' }}
          >
            Contact Email:
          </Typography>
          <Typography variant="h5" fontWeight={500}>
            {email}
          </Typography>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  )
}
