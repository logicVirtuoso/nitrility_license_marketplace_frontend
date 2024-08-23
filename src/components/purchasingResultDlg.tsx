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
import { CommonLicenseDataIF } from 'interface'
import { useKeenSlider } from 'keen-slider/react'
import LicenseCard from './licenseCard'

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

export interface ListingResultDlgProps {
  commonLicenseDatas: Array<CommonLicenseDataIF>
  open: boolean
  setOpen: (open: boolean) => void
}

export default function PurchasingResultDlg({
  commonLicenseDatas,
  open,
  setOpen,
}: ListingResultDlgProps) {
  const nagivate = useNavigate()
  const theme = useTheme()
  const [sliderRef] = useKeenSlider({
    mode: 'free-snap',
    slides: {
      origin: 'center',
      perView: 2,
      spacing: 15,
    },
  })

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

          <Box
            ref={sliderRef}
            className="keen-slider"
            sx={{
              backgroundColor: theme.palette.grey[800],
              py: 3,
              border: `1px solid ${theme.palette.grey[600]}`,
              borderRadius: 2,
            }}
          >
            {commonLicenseDatas.map((commonLicenseData, idx) => {
              return (
                <Box
                  className={`keen-slider__slide number-slide${idx}`}
                  borderRadius={3}
                  border={'none'}
                  key={idx}
                >
                  <LicenseCard commonLicenseData={commonLicenseData} />
                </Box>
              )
            })}
          </Box>
          <Typography
            fontFamily={'var(--font-semi-bold)'}
            fontSize={'21px'}
            color={theme.palette.text.primary}
            whiteSpace={'nowrap'}
          >
            Your purchase was successful!
          </Typography>
          <Typography
            fontSize={14}
            color={theme.palette.text.secondary}
            textAlign={'center'}
            lineHeight={'20px'}
          >
            To view your licenses, select your Profile &gt; Licenses you Own and
            click into the respective license.
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
          <PrimaryButton>View license details</PrimaryButton>
          <SecondaryButton onClick={() => setOpen(false)}>
            Back to exploring
          </SecondaryButton>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  )
}
