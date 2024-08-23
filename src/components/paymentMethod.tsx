import {
  Box,
  CardMedia,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import {
  LicensingTypes,
  AccessLevel,
  TemplateDataIF,
  CommonLicenseDataIF,
  UsageDetailIF,
} from 'src/interface'
import DialogContent from '@mui/material/DialogContent'
import { useEffect, useState } from 'react'
import PrimaryButton from 'src/components/buttons/primary-button'
import CreditDarkIcon from 'src/assets/images/credit_dark.png'
import MagicDarkIcon from 'src/assets/images/magic_dark.png'
import CloseDarkIcon from 'src/assets/images/close_dark.png'
import { StyledImage } from './styledImage'
import { licensingTypeList } from 'src/config'
import BackDarkIcon from 'src/assets/images/back_dark.svg'

enum PaymentMethod {
  None = '',
  Credit = 'Add Credit/Debit Card',
  Magic = 'Crypto/Magic Wallet',
}

const paymentMethods = [
  {
    label: PaymentMethod.Credit,
    content: 'Pay via your credit or debit card',
    icon: CreditDarkIcon,
  },
  {
    label: PaymentMethod.Magic,
    content: 'Supports 5 cryptocurrencies',
    icon: MagicDarkIcon,
  },
]

const StyledPaymentDiv = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  padding: 16,
  borderRadius: 10,
  cursor: 'pointer',
  border: `1px solid ${theme.palette.grey[600]}`,
  '&:hover': {
    backgroundColor: theme.palette.grey[600],
  },
}))

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: 0,
    backgroundColor: theme.palette.containerPrimary.main,
    border: 'none',
    borderRadius: 12,
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    backgroundColor: theme.palette.containerPrimary.main,
    borderRadius: 12,
    maxWidth: 500,
  },
}))

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
  commonLicenseDataList: Array<CommonLicenseDataIF>
  syncDataList: Array<TemplateDataIF>
  licensingTypes: Array<LicensingTypes>
  accessLevels: Array<AccessLevel>
  usageDetails: Array<UsageDetailIF>
  offerDetails: Array<{ offerPrice: number; offerDuration: number }>
  paymentHandler?: () => void
  backForwards: () => void
}

export default function PaymentMethodDialog({
  open,
  setOpen,
  commonLicenseDataList,
  syncDataList,
  licensingTypes,
  accessLevels,
  paymentHandler,
  backForwards,
}: Props) {
  const theme = useTheme()
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>(PaymentMethod.None)

  const handleClose = () => {
    setOpen(false)
  }

  const purchaseHandler = async () => {
    setOpen(false)
    paymentHandler()
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
          px={3}
          py={1.5}
          gap={2}
          mt={3}
        >
          <IconButton onClick={backForwards}>
            <CardMedia
              component={'img'}
              image={BackDarkIcon}
              sx={{ width: 10, objectFit: 'cover' }}
            />
          </IconButton>
          <Typography fontSize={21} color={theme.palette.text.primary}>
            Select a payment method
          </Typography>
        </Box>

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

        <Box display={'flex'} flexDirection={'column'} gap={1} px={3}>
          {commonLicenseDataList.map((commonLicenseData, idx) => {
            return (
              <Box display={'flex'} gap={2} py={2} key={idx}>
                <StyledImage src={commonLicenseData.imagePath} />

                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  justifyContent={'center'}
                  gap={0.5}
                >
                  <Typography
                    sx={{
                      color: theme.palette.success.light,
                      borderRadius: '56px',
                      backgroundColor: theme.palette.grey[600],
                      p: '2px 8px',
                      fontSize: '12px',
                      fontFamily: 'var(--font-medium)',
                      lineHeight: '16px',
                    }}
                  >
                    {`${licensingTypeList[licensingTypes[idx]].label} ${
                      accessLevels[idx] === AccessLevel.Exclusive
                        ? 'Exclusive'
                        : 'Nonexclusive'
                    }`}
                  </Typography>
                  <Box
                    display={'flex'}
                    flexDirection={'column'}
                    gap={0.5}
                    px={0.5}
                  >
                    <Typography
                      lineHeight="24px"
                      fontSize={'16px'}
                      fontFamily={'var(--font-bold)'}
                      color={theme.palette.containerSecondary.contrastText}
                    >
                      {commonLicenseData.licenseName}
                    </Typography>

                    {commonLicenseData.artists.map(
                      (artist: { name: string }, index: number) => {
                        return (
                          <Typography
                            sx={{
                              lineHeight: '16px',
                              fontFamily: 'var(--font-base)',
                              fontSize: '12px',
                              color: theme.palette.text.secondary,
                              whiteSpace: 'nowrap',
                            }}
                            component={'span'}
                            key={index}
                          >
                            {`${artist.name} ${
                              commonLicenseData.artists?.length == index + 1
                                ? ''
                                : ', '
                            }`}
                          </Typography>
                        )
                      },
                    )}
                  </Box>
                </Box>
              </Box>
            )
          })}
        </Box>

        <Divider />
        <Box display={'flex'} flexDirection={'column'} gap={1} p={3}>
          {paymentMethods.map((payment, idx) => {
            return (
              <StyledPaymentDiv
                key={idx}
                sx={{
                  backgroundColor:
                    payment.label === selectedPaymentMethod
                      ? theme.palette.grey[600]
                      : 'inherit',
                }}
                onClick={() => setSelectedPaymentMethod(payment.label)}
              >
                <CardMedia
                  component={'img'}
                  image={payment.icon}
                  sx={{
                    width: 40,
                    objectFit: 'cover',
                  }}
                />

                <Box display={'flex'} flexDirection={'column'}>
                  <Typography
                    color={theme.palette.text.primary}
                    fontFamily={'var(--font-semi-bold)'}
                    lineHeight={'150%'}
                  >
                    {payment.label}
                  </Typography>
                  <Typography
                    fontSize={'14px'}
                    color={theme.palette.text.secondary}
                    lineHeight={'150%'}
                  >
                    {payment.content}
                  </Typography>
                </Box>
              </StyledPaymentDiv>
            )
          })}
        </Box>
        <Divider />

        <Box p={2}>
          <PrimaryButton
            sx={{ width: '100%', borderRadius: 14 }}
            onClick={purchaseHandler}
          >
            Next
          </PrimaryButton>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  )
}
