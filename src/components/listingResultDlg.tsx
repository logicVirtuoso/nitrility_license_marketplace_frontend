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
import { StyledOutlinedInputFC } from './styledInput'
import { useState } from 'react'
import { sendEmailToCollaborators } from 'src/api'
import toast from 'react-hot-toast'

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

export interface ListingResultDlgProps {
  multiCollaborators: boolean
  listedId: string
  imagePath: string
  licenseName: string
  sellerName: string
  albumName: string
  open: boolean
  setOpen: (open: boolean) => void
}

export default function ListingResultDlg({
  multiCollaborators,
  listedId,
  imagePath,
  licenseName,
  sellerName,
  albumName,
  open,
  setOpen,
}: ListingResultDlgProps) {
  const nagivate = useNavigate()
  const theme = useTheme()
  const [collaboratorEmails, setCollaboratorEmails] = useState<string>('')

  const handleClose = () => {
    setOpen(false)
  }

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setCollaboratorEmails(event.target.value)
  }

  const sendHandler = async () => {
    const tLoading = toast.loading('Sending emails to collaborators')
    try {
      const { success, msg } = await sendEmailToCollaborators(
        collaboratorEmails,
        licenseName,
        imagePath,
      )
      if (success) {
        setOpen(false)
        toast.success(msg, { id: tLoading })
      } else {
        toast.error(msg, { id: tLoading })
      }
    } catch (e) {
      console.log('error in sending email to collaborators', e)
      toast.error(e.message, { id: tLoading })
    }
  }

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="md"
      fullWidth={true}
      multiCollaborators={multiCollaborators}
    >
      <DialogContent dividers sx={{ padding: 80, position: 'relative' }}>
        <Box
          display={'flex'}
          alignItems={'center'}
          flexDirection={'column'}
          gap={1}
          mb={4.5}
          pt={7}
          px={4}
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

          {multiCollaborators && (
            <Typography
              fontFamily={'var(--font-semi-bold)'}
              fontSize={21}
              color={theme.palette.text.primary}
              mb={3}
            >
              Just one more step!
            </Typography>
          )}
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
                filter: multiCollaborators ? 'grayscale(1)' : 'inherit',
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
            {!multiCollaborators
              ? 'Your license was successfully listed!'
              : 'Awaiting confirmation from collaborators'}
          </Typography>
          {multiCollaborators ? (
            <>
              <Typography
                fontSize={14}
                color={theme.palette.text.secondary}
                textAlign={'center'}
                lineHeight={'20px'}
              >
                Before we can list your license we need verification on the
                revenue split & permissions from song collaborators.
              </Typography>
              <Typography fontSize={14} color={theme.palette.text.secondary}>
                Send an email to your collaborators to notify them to approve.
              </Typography>
            </>
          ) : (
            <Typography
              fontSize={'14px'}
              color={theme.palette.text.secondary}
              sx={{
                '& span': {
                  color: theme.palette.text.primary,
                },
              }}
            >
              To make any changes select from your <span>Listings</span> in your
              <span> Profile.</span>
            </Typography>
          )}

          {multiCollaborators && (
            <Box
              display={'flex'}
              flexDirection={'column'}
              width={'-webkit-fill-available'}
              gap={1}
              pt={3}
            >
              <Box display={'flex'} alignItems={'center'} gap={1}>
                <StyledOutlinedInputFC
                  fullWidth
                  type="text"
                  placeholder="Email address"
                  value={collaboratorEmails}
                  onChange={handleChange}
                />

                <PrimaryButton
                  sx={{ width: 108 }}
                  disabled={collaboratorEmails.length === 0}
                  onClick={sendHandler}
                >
                  Send email
                </PrimaryButton>
              </Box>

              <Typography
                color={theme.palette.text.disabled}
                fontSize={12}
                fontFamily={'var(--font-base)'}
                lineHeight={'20px'}
                whiteSpace={'nowrap'}
              >
                If there are multiple collaborators, separate email addresses
                with a comma
              </Typography>
            </Box>
          )}
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
              nagivate(`/purchase/${listedId}`)
            }}
          >
            {multiCollaborators ? 'View draft listing' : 'View listing'}
          </PrimaryButton>
          <SecondaryButton onClick={() => setOpen(false)}>
            Create new listing
          </SecondaryButton>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  )
}
