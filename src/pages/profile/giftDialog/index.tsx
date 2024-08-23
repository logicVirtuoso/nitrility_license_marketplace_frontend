import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import OutlinedInput from '@mui/material/OutlinedInput'
import { FormHelperText, Typography } from '@mui/material'
import SecondaryButton from 'src/components/buttons/secondary-button'
import { useWeb3 } from 'src/context/web3Context'

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
    boxShadow: 'none',
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

export interface GiftDialogProps {
  infinite?: boolean
  showAmount?: boolean
  totalSupply?: number
  open: boolean
  setOpen: (open: boolean) => void
  handler: (receiverAddress: string, amount: number) => void
}

const errMsgForReceiver = 'Please input receiver address correctly'
const errMsgForAmount = 'Please input amount correctly'
const errMsgForTotalSupply = 'You can not give more license than total supply'

export default function GiftDialog({
  infinite = false,
  showAmount = true,
  totalSupply,
  open,
  setOpen,
  handler,
}: GiftDialogProps) {
  const { web3 } = useWeb3()
  const [receiverAddress, setReceiverAddress] = useState<string>('')
  const [amount, setAmount] = useState<number>()
  const [strAmount, setStrAmount] = useState<string>('')
  const [receiverError, setReceiverError] = useState<string>('')
  const [amountError, setAmountError] = useState<string>('')

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    if (receiverAddress !== '' && !web3.utils.isAddress(receiverAddress)) {
      setReceiverError(errMsgForReceiver)
    } else {
      setReceiverError('')
    }
  }, [receiverAddress, web3])

  useEffect(() => {
    if (strAmount[0] === '0') {
      setAmountError(errMsgForAmount)
    } else {
      if (amount <= 0) {
        setAmountError(errMsgForAmount)
      } else {
        if (!infinite) {
          if (amount > totalSupply) {
            setAmountError(errMsgForTotalSupply)
          } else {
            setAmountError('')
          }
        }
      }
    }
  }, [amount, strAmount, totalSupply, infinite])

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogContent dividers>
        <Typography
          gutterBottom
          align="left"
          component={'p'}
          sx={{
            width: '100%',
            padding: '10px 0px',
          }}
        >
          Enter Wallet Address of Receiver
        </Typography>
        <OutlinedInput
          type="text"
          error={receiverError !== ''}
          id="receiver-address"
          value={receiverAddress}
          sx={{
            width: '100%',
          }}
          onChange={(e) => setReceiverAddress(e.target.value)}
        />
        <FormHelperText id="receiver-address" error={true}>
          {receiverError}
        </FormHelperText>

        {showAmount && (
          <>
            <Typography gutterBottom align="left" component={'p'}>
              Enter Amount you want to Send
            </Typography>
            <OutlinedInput
              type="number"
              error={amountError !== ''}
              id="amount"
              value={amount}
              onChange={(e) => {
                setAmount(Number(e.target.value))
                setStrAmount(e.target.value)
              }}
              inputProps={{ min: 1, max: totalSupply }}
              placeholder="Enter a number"
              sx={{
                width: '100%',
              }}
            />
            <FormHelperText id="amount" error={true}>
              {amountError}
            </FormHelperText>
          </>
        )}
        <SecondaryButton
          sx={{
            width: '100%',
            height: '50px',
            margin: '20px 0px 0px 0px !important',
          }}
          onClick={() => {
            let isError = false
            if (!web3.utils.isAddress(receiverAddress)) {
              setReceiverError(errMsgForReceiver)
              isError = true
            }
            if (
              showAmount &&
              (!amount || amount <= 0 || strAmount[0] === '0')
            ) {
              setAmountError(errMsgForAmount)
              isError = true
            }
            if (!isError) {
              handler(receiverAddress, amount)
              setOpen(false)
            }
          }}
        >
          Send License
        </SecondaryButton>
      </DialogContent>
    </BootstrapDialog>
  )
}
