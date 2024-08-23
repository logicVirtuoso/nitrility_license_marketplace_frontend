import React from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { Box, Typography, useTheme } from '@mui/material'
import SecondaryButton from '../buttons/secondary-button'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import NonExclusivLicensesTable from './nonExclusivedTable'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: 16,
    backgroundColor: theme.palette.secondary.main,
    border: 'none',
    borderRadius: 12,
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 12,
  },
}))

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

export interface DialogProps {
  licenses: Array<any>
  open: boolean
  setOpen: (open: boolean) => void
  handler: (bContinue: boolean) => void
}

export default function ConfirmDialog({
  licenses,
  open,
  setOpen,
  handler,
}: DialogProps) {
  const theme = useTheme()
  const handleClose = () => {
    setOpen(false)
  }

  const confirmed = () => {
    setOpen(false)
    handler(true)
  }

  return (
    <BootstrapDialog
      onClose={handleClose}
      open={open}
      maxWidth="lg"
      fullWidth={true}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DialogContent sx={{ padding: 80 }}>
          <Box display={'flex'} flexDirection={'column'} gap={0.5}>
            <Typography variant="h5" color={theme.palette.text.primary}>
              Some peoples purchased non exlcusive license.
            </Typography>
            <Typography
              color={theme.palette.text.secondary}
              variant="subtitle1"
            >
              Are you sure to purchase exclusive license?
            </Typography>
          </Box>

          <NonExclusivLicensesTable licenses={licenses} />

          <Box
            display={'flex'}
            gap={0.5}
            justifyContent={'center'}
            ml={'auto'}
            sx={{
              float: 'right',
            }}
          >
            <SecondaryButton
              sx={{ height: '35px', maxWidth: '50px' }}
              onClick={confirmed}
            >
              Yes
            </SecondaryButton>
            <SecondaryButton
              sx={{ height: '35px', maxWidth: '50px' }}
              onClick={handleClose}
            >
              No
            </SecondaryButton>
          </Box>
        </DialogContent>
      </LocalizationProvider>
    </BootstrapDialog>
  )
}
