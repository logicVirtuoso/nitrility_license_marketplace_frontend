import React from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import { Box, CardMedia, IconButton, Typography } from '@mui/material'
import { Theme, useTheme } from '@mui/material/styles'
import CloseDarkIcon from 'src/assets/images/close_dark.png'
import { PaymentType, PaymentlMethodIF, paymentMethods } from './constants'

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
    maxWidth: 472,
    borderRadius: 12,
  },
}))

interface PayoutCardProps extends PaymentlMethodIF {
  callback: (paymentMethod: PaymentType) => void
}

const PayoutCard = ({ label, content, icon, callback }: PayoutCardProps) => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderRadius: 2.5,
        border: `1px solid ${theme.palette.grey[600]}`,
        p: 2,
        cursor: 'pointer',
        '&:hover': {
          bgcolor: theme.palette.grey[600],
        },
      }}
      onClick={() => callback(label)}
    >
      {icon}
      <Box display={'flex'} flexDirection={'column'}>
        <Typography
          fontFamily={'var(--font-semi-bold)'}
          fontSize={16}
          color={theme.palette.text.primary}
        >
          {label}
        </Typography>
        <Typography fontSize={14} color={theme.palette.text.secondary}>
          {content}
        </Typography>
      </Box>
    </Box>
  )
}

export interface Props {
  paymentSelector: (paymentMethod: PaymentType) => void
  open: boolean
  setOpen: (open: boolean) => void
}

export default function PaymentMethodDialog({
  open,
  setOpen,
  paymentSelector,
}: Props) {
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
      <Box
        display={'flex'}
        flexDirection={'column'}
        alignItems={'center'}
        bgcolor={theme.palette.secondary.main}
        position={'relative'}
        pl={4.5}
        pr={4.5}
        pb={4.5}
        pt={7}
      >
        <IconButton
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
          }}
          onClick={() => setOpen(false)}
        >
          <CardMedia component={'img'} image={CloseDarkIcon} />
        </IconButton>
        <Typography
          color={theme.palette.text.primary}
          fontFamily={'var(--font-semi-bold)'}
          fontSize={21}
        >
          Add a new withdrawal method
        </Typography>

        <Box
          display={'flex'}
          flexDirection={'column'}
          gap={1}
          maxWidth={400}
          width={'100%'}
          pt={3}
        >
          <Typography color={theme.palette.text.secondary} fontSize={14}>
            Select a payment method
          </Typography>
          {paymentMethods.map((item, idx) => {
            return (
              <PayoutCard
                key={idx}
                label={item.label}
                content={item.content}
                icon={item.icon}
                callback={paymentSelector}
              />
            )
          })}
        </Box>
      </Box>
    </BootstrapDialog>
  )
}
