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
import DotDarkIcon from 'src/assets/images/dot_dark.svg'
import PrimaryButton from 'src/components/buttons/primary-button'
import SecondaryButton from 'src/components/buttons/secondary-button'
import CloseDarkIcon from 'src/assets/images/close_dark.png'
import toast from 'react-hot-toast'
import WhiteBtn from 'src/components/buttons/whiteBtn'
import { useEffect, useState } from 'react'
import {
  approveLicense,
  rejectLicense,
  sendEmailToCollaborators,
} from 'src/api'
import { StyledOutlinedInputFC } from 'src/components/styledInput'
import {
  ArtistRevenueType,
  ListingStatusType,
  ReviewStatus,
  SigningDataIF,
} from 'src/interface'
import CheckedDarkIcon from 'src/assets/images/checked_dark.png'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import ConfirmDialog from './ConfirmDialog'
import { useNavigate } from 'react-router-dom'
import { SellerAccountType } from 'src/config'

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
    backgroundColor: theme.palette.background.paper,
    maxWidth: 480,
    borderRadius: 12,
  },
}))

export interface Props {
  listedId: number
  imagePath: string
  licenseName: string
  sellerName: string
  albumName: string
  sellerId: string
  signingData: SigningDataIF
  open: boolean
  setOpen: (open: boolean) => void
}

export default function InvitationDlg({
  listedId,
  imagePath,
  licenseName,
  sellerName,
  albumName,
  sellerId,
  signingData,
  open,
  setOpen,
}: Props) {
  const theme = useTheme()
  const navigate = useNavigate()
  const [collaboratorEmails, setCollaboratorEmails] = useState<string>('')
  const [collaborators, setCollaborators] = useState<ArtistRevenueType[]>([])
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const [openConfirmDlg, setOpenConfirmDlg] = useState<boolean>(false)
  const [isAccepting, setIsAccepting] = useState<boolean>(false)
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

  useEffect(() => {
    let tempCollaborators = []
    if (signingData.creator.listed == ListingStatusType.Listed) {
      signingData.creator.revenues.forEach((revenue: ArtistRevenueType) => {
        if (
          revenue.status == ReviewStatus.Pending &&
          !tempCollaborators.find(
            (collaborator) => collaborator.sellerId == revenue.sellerId,
          )
        ) {
          tempCollaborators = [...tempCollaborators, revenue]
        }
      })
    }
    if (signingData.movie.listed == ListingStatusType.Listed) {
      signingData.movie.revenues.forEach((revenue: ArtistRevenueType) => {
        if (
          revenue.status == ReviewStatus.Pending &&
          !tempCollaborators.find(
            (collaborator) => collaborator.sellerId == revenue.sellerId,
          )
        ) {
          tempCollaborators = [...tempCollaborators, revenue]
        }
      })
    }
    if (signingData.advertisement.listed == ListingStatusType.Listed) {
      signingData.advertisement.revenues.forEach(
        (revenue: ArtistRevenueType) => {
          if (
            revenue.status == ReviewStatus.Pending &&
            !tempCollaborators.find(
              (collaborator) => collaborator.sellerId == revenue.sellerId,
            )
          ) {
            tempCollaborators = [...tempCollaborators, revenue]
          }
        },
      )
    }
    if (signingData.videoGame.listed == ListingStatusType.Listed) {
      signingData.videoGame.revenues.forEach((revenue: ArtistRevenueType) => {
        if (
          revenue.status == ReviewStatus.Pending &&
          !tempCollaborators.find(
            (collaborator) => collaborator.sellerId == revenue.sellerId,
          )
        ) {
          tempCollaborators = [...tempCollaborators, revenue]
        }
      })
    }
    if (signingData.tvSeries.listed == ListingStatusType.Listed) {
      signingData.tvSeries.revenues.forEach((revenue: ArtistRevenueType) => {
        if (
          revenue.status == ReviewStatus.Pending &&
          !tempCollaborators.find(
            (collaborator) => collaborator.sellerId == revenue.sellerId,
          )
        ) {
          tempCollaborators = [...tempCollaborators, revenue]
        }
      })
    }
    if (signingData.aiTraining.listed == ListingStatusType.Listed) {
      signingData.aiTraining.revenues.forEach((revenue: ArtistRevenueType) => {
        if (
          revenue.status == ReviewStatus.Pending &&
          !tempCollaborators.find(
            (collaborator) => collaborator.sellerId == revenue.sellerId,
          )
        ) {
          tempCollaborators = [...tempCollaborators, revenue]
        }
      })
    }
    setCollaborators(tempCollaborators)
  }, [signingData])

  const rejectHandler = async () => {
    const tLoading = toast.loading('Rejecting this license')
    try {
      const { success, data, msg } = await rejectLicense(listedId)
      if (success) {
        setOpen(false)
        toast.success(msg, { id: tLoading })
      } else {
        toast.error(msg, { id: tLoading })
      }
    } catch (e) {
      toast.error(e.message, { id: tLoading })
    }
  }

  const approveHandler = async () => {
    const tLoading = toast.loading('Rejecting this license')
    try {
      const { success, data, msg } = await approveLicense(listedId)
      if (success) {
        setOpen(false)
        toast.success(msg, { id: tLoading })
      } else {
        toast.error(msg, { id: tLoading })
      }
    } catch (e) {
      toast.error(e.message, { id: tLoading })
    }
  }

  const confirmHandler = (isConfirmed: boolean) => {
    if (isAccepting && isConfirmed) {
      approveHandler()
    } else {
      if (!isAccepting && isConfirmed) {
        rejectHandler()
      }
    }
  }

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="md"
      fullWidth={true}
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

          <Typography
            fontFamily={'var(--font-semi-bold)'}
            fontSize={21}
            color={theme.palette.text.primary}
            mb={3}
          >
            Invitation expires in 30 days
          </Typography>
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
                filter: 'grayscale(1)',
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
                <CardMedia
                  component={'img'}
                  image={DotDarkIcon}
                  sx={{ width: 4, objectFit: 'cover' }}
                />
                <Typography
                  className="gray-out-text"
                  variant="subtitle1"
                  color={theme.palette.text.secondary}
                >
                  {albumName}
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
            Awaiting confirmation from collaborators
          </Typography>
          <Typography
            fontSize={14}
            color={theme.palette.text.secondary}
            textAlign={'center'}
            lineHeight={'20px'}
          >
            Before we can list your license we need verification on the revenue
            split & permissions from song collaborators.
          </Typography>
          <Typography fontSize={14} color={theme.palette.text.secondary}>
            Send an email to your collaborators to notify them to approve.
          </Typography>

          <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
            mt={2}
            borderRadius={2}
            border={`1px solid ${theme.palette.grey[600]}`}
            padding={'10px 12px 10px 12px'}
            width={'100%'}
          >
            <Box display={'flex'} alignItems={'center'} gap={1}>
              <CardMedia
                component={'img'}
                image={CheckedDarkIcon}
                sx={{ width: 18, height: 18 }}
              />

              <Typography
                fontWeight={500}
                fontSize={14}
                color={theme.palette.success.light}
              >
                {sellerName}
              </Typography>
            </Box>
            <Typography
              fontWeight={400}
              fontSize={14}
              color={theme.palette.text.secondary}
            >
              {sellerId !== authorization.currentUser.sellerId
                ? 'Initiated Listing'
                : ''}
            </Typography>
          </Box>

          {collaborators.map((collaborator, idx) => {
            return (
              <Box
                key={idx}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
                borderRadius={2}
                border={`1px solid ${theme.palette.grey[600]}`}
                padding={'10px 12px 10px 12px'}
                width={'100%'}
              >
                <Box display={'flex'} alignItems={'center'} gap={1}>
                  {collaborator.status != ReviewStatus.Approved ? (
                    <CardMedia
                      component={'img'}
                      image={DotDarkIcon}
                      sx={{ width: 5, height: 5, ml: 0.5 }}
                    />
                  ) : (
                    <CardMedia
                      component={'img'}
                      image={CheckedDarkIcon}
                      sx={{ width: 18, height: 18 }}
                    />
                  )}

                  <Typography
                    fontWeight={500}
                    fontSize={14}
                    color={theme.palette.text.secondary}
                  >
                    {collaborator.sellerName}
                  </Typography>
                </Box>
                {collaborator.status != ReviewStatus.Approved && (
                  <Typography
                    fontWeight={400}
                    fontSize={14}
                    color={theme.palette.text.secondary}
                  >
                    {collaborator.status == ReviewStatus.Pending
                      ? 'Invite Pending'
                      : 'Rejected'}
                  </Typography>
                )}
              </Box>
            )
          })}

          {sellerId === authorization.currentUser.sellerId && (
            <Box
              display={'flex'}
              flexDirection={'column'}
              width={'-webkit-fill-available'}
              gap={1}
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
          {sellerId !== authorization.currentUser.sellerId ? (
            <>
              <WhiteBtn
                onClick={() => navigate(`/license/setting/${listedId}`)}
              >
                View Listing Details
              </WhiteBtn>
              <PrimaryButton
                onClick={() => {
                  setIsAccepting(true)
                  setOpenConfirmDlg(true)
                }}
              >
                Accept
              </PrimaryButton>
              <SecondaryButton
                onClick={() => {
                  setIsAccepting(false)
                  setOpenConfirmDlg(true)
                }}
              >
                Reject
              </SecondaryButton>
            </>
          ) : (
            <>
              <PrimaryButton
                onClick={() => navigate(`/license/setting/${listedId}`)}
              >
                Edit draft listing
              </PrimaryButton>
              <SecondaryButton
                onClick={() =>
                  navigate('/sell', {
                    state: {
                      platformTitle: SellerAccountType.Spotify,
                      sellerId: authorization.currentUser.sellerId,
                    },
                  })
                }
              >
                Create new listing
              </SecondaryButton>
            </>
          )}
        </Box>
      </DialogContent>

      <ConfirmDialog
        open={openConfirmDlg}
        setOpen={setOpenConfirmDlg}
        handler={confirmHandler}
      />
    </BootstrapDialog>
  )
}
