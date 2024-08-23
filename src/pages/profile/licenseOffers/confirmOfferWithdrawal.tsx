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
  confirmWithdraw: () => void
}

export default function ConfirmWithdrawalDlg({
  open,
  setOpen,
  confirmWithdraw,
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
      <DialogContent sx={{ position: 'relative' }}>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
          p={3}
        >
          <Typography fontSize={21} fontWeight={600} lineHeight={'26px'}>
            Confirm offer withdrawal
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

        <Box display={'flex'} flexDirection={'column'} p={3}>
          <Typography
            fontWeight={500}
            fontSize={16}
            color={theme.palette.text.primary}
          >
            By confirming your withdrawal, the artist will no longer see and be
            able to accept your offer.
          </Typography>
          <Typography
            fontSize={14}
            fontWeight={400}
            color={theme.palette.grey[300]}
          >
            By withdrawing you will receive a refund on the amount paid so far.
            Withdrawal of offer will show in both activity statements of the
            buyer and seller.
          </Typography>
          <Typography
            fontSize={14}
            fontWeight={400}
            color={theme.palette.grey[300]}
          >
            You may also send a new offer at any time.
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
            <SecondaryButton onClick={confirmWithdraw}>
              Confirm withdrawal
            </SecondaryButton>
            <SecondaryButton onClick={handleClose}>
              Cancel withdrawal
            </SecondaryButton>
          </Box>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  )
}
