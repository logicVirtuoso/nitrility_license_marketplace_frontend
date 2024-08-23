import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import {
  Box,
  CardMedia,
  Divider,
  Typography,
  useTheme,
  IconButton,
} from '@mui/material'
import PrimaryButton from './buttons/primary-button'
import SecondaryButton from './buttons/secondary-button'
import { useNavigate } from 'react-router-dom'
import CloseDarkIcon from 'src/assets/images/close_dark.png'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'

interface BootstrapDialogProps {
  multiCollaborators: boolean
}

const BootstrapDialog = styled(Dialog)<BootstrapDialogProps>(
  ({ theme, multiCollaborators }) => ({
    '& .MuiDialogContent-root': {
      padding: 0,
      backgroundColor: !multiCollaborators
        ? theme.palette.background.paper
        : theme.palette.secondary.main,
      border: 'none',
      borderRadius: 12,
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
    '& .MuiPaper-root': {
      backgroundColor: multiCollaborators
        ? theme.palette.background.paper
        : theme.palette.secondary.main,
      maxWidth: 480,
      borderRadius: 12,
    },
  }),
)

export interface Props {
  imagePath: string
  licenseName: string
  sellerName: string
  albumName: string
  open: boolean
  setOpen: (open: boolean) => void
}

export default function OfferMadeResultDlg({
  imagePath,
  licenseName,
  sellerName,
  albumName,
  open,
  setOpen,
}: Props) {
  const nagivate = useNavigate()
  const theme = useTheme()
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="md"
      fullWidth={true}
      multiCollaborators
    >
      <DialogContent dividers sx={{ padding: 80, position: 'relative' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            gap: 1,
            mb: 4.5,
            pt: 7,
            px: 4,
          }}
        >
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

          <Box
            sx={{
              mb: 3,
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              maxWidth: 191,
              backgroundColor: theme.palette.secondary.main,
              borderRadius: 3,
              border: `1px solid ${theme.palette.grey[600]}`,
              background:
                'linear-gradient(225deg, rgba(17,17,17,1) 0%, rgba(31,31,31,1) 38%, rgba(54,54,54,1) 50%, rgba(31,31,31,1) 62%, rgba(17,17,17,1) 100%)',
            }}
          >
            <CardMedia
              component={'img'}
              image={imagePath}
              sx={{
                borderRadius: 3,
                filter: 'inherit',
              }}
            />

            <Box display={'flex'} flexDirection={'column'}>
              <Typography
                className="gray-out-text"
                color={theme.palette.text.primary}
                fontSize={'16px'}
                fontFamily={'var(--font-bold)'}
              >
                {licenseName}
              </Typography>
              <Box display={'flex'} alignItems={'center'} gap={1}>
                <Typography
                  className="gray-out-text"
                  variant="subtitle1"
                  color={theme.palette.text.secondary}
                >
                  {sellerName}
                </Typography>
                <Typography
                  className="gray-out-text"
                  variant="subtitle1"
                  color={theme.palette.text.secondary}
                >
                  · {albumName}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Typography
            fontFamily={'var(--font-semi-bold)'}
            fontSize={'21px'}
            color={theme.palette.text.primary}
            whiteSpace={'nowrap'}
          >
            Your offer was made!
          </Typography>
          <Typography
            fontSize={'14px'}
            color={theme.palette.text.secondary}
            align="center"
            sx={{
              maxWidth: 320,
              '& span': {
                color: theme.palette.text.primary,
              },
            }}
          >
            We will notify you when your offer has been accepted, declined, or
            has expired.
          </Typography>
        </Box>

        <Divider />

        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          gap={1}
          p={2}
        >
          <PrimaryButton
            onClick={() => {
              setOpen(false)
            }}
          >
            View license offers
          </PrimaryButton>
          <SecondaryButton onClick={() => setOpen(false)}>
            Back to exploring
          </SecondaryButton>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  )
}
