import {
  Box,
  CardMedia,
  DialogContent,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import SecondaryButton from 'src/components/buttons/secondary-button'
import CloseDarkIcon from 'src/assets/images/close_dark.png'

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

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  handler: () => void
}

export default function DeleteCollectionDlg({ open, setOpen, handler }: Props) {
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
        <IconButton
          sx={{
            position: 'absolute',
            right: 14,
            top: 14,
          }}
          onClick={() => setOpen(false)}
        >
          <CardMedia image={CloseDarkIcon} component={'img'} />
        </IconButton>
        <Box display={'flex'} flexDirection={'column'}>
          <Typography
            fontSize={21}
            fontFamily={'var(--font-semi-bold)'}
            color={theme.palette.text.primary}
            p={3}
          >
            Are you sure you want to delete this?
          </Typography>

          <Divider />

          <Typography variant="h5" color={theme.palette.text.primary} p={3}>
            By confirming your collection, YouTube Rap Mix, will no longer be
            visible by you or users on your profile.
          </Typography>

          <Divider />

          <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            py={2.5}
          >
            <Box display={'flex'} alignItems={'center'} gap={1}>
              <SecondaryButton
                sx={{
                  backgroundColor: theme.palette.grey[600],
                }}
                onClick={handler}
              >
                Yes, I want to delete this collection
              </SecondaryButton>
              <SecondaryButton
                sx={{
                  backgroundColor: theme.palette.grey[600],
                }}
                onClick={() => setOpen(false)}
              >
                Cancel
              </SecondaryButton>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  )
}
