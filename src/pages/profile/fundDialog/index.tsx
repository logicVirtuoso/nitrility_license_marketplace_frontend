import React, { useState, useEffect, useCallback } from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import FundTable from './fundTable'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import useListingLicense from 'src/hooks/useListingLicense'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    backgroundColor: '#fff',
  },
}))

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

export interface FundDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function FundDialog({ open, setOpen }: FundDialogProps) {
  const [amount, setAmount] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  const { getWithdrawalFund } = useListingLicense()

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    const init = async () => {
      if (authorization?.currentUser?.sellerId) {
        setIsLoading(true)
        const res = await getWithdrawalFund(
          authorization?.currentUser?.sellerId,
        )
        setAmount(res)
        setIsLoading(false)
      }
    }
    init()
  }, [getWithdrawalFund, authorization?.currentUser, open])

  const openHandler = (opened: boolean) => {
    setOpen(opened)
  }

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="lg"
      fullWidth={true}
    >
      <DialogContent dividers sx={{ padding: 80, textAlign: 'center' }}>
        <FundTable loading={isLoading} amount={amount} setOpen={openHandler} />
      </DialogContent>
    </BootstrapDialog>
  )
}
