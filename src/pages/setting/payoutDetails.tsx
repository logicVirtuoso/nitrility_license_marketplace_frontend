import {
  Box,
  CardMedia,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material'
import CloseDarkIcon from 'src/assets/images/close_dark.png'
import Dialog from '@mui/material/Dialog'
import { styled } from '@mui/material/styles'
import BankDarkIcon from 'src/assets/images/withdrawal/bank_transfer_dark.png'
import { StyledOutlinedInputFC } from 'src/components/styledInput'
import { useState } from 'react'
import IOSSwitch from 'src/components/isoSwitch'
import PrimaryButton from 'src/components/buttons/primary-button'
import SecondaryButton from 'src/components/buttons/secondary-button'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: 0,
    backgroundColor: theme.palette.containerPrimary.main,
    border: 'none',
    borderRadius: 8,
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    backgroundColor: theme.palette.containerPrimary.main,
    maxWidth: 500,
    borderRadius: 8,
  },
}))

const StyledDiv = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 16,
  bgcolor: theme.palette.secondary.main,
  border: `1px solid ${theme.palette.grey[600]}`,
  borderRadius: 10,
}))

export interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function PayoutDetails({ open, setOpen }: Props) {
  const theme = useTheme()
  const [customName, setCustomName] = useState<string>('')

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
        sx={{
          position: 'relative',
          p: 4.5,
          bgcolor: theme.palette.secondary.main,
          borderRadius: 2,
        }}
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

        <Box display={'flex'} alignItems={'center'} gap={2}>
          <CardMedia
            component={'img'}
            image={BankDarkIcon}
            sx={{
              width: 40,
            }}
          />
          <Typography
            color={theme.palette.text.primary}
            fontFamily={'var(--font-semi-bold)'}
            fontSize={21}
          >
            Bank Transfer
          </Typography>
        </Box>

        <Box display={'flex'} flexDirection={'column'}>
          <Typography
            color={theme.palette.text.primary}
            fontFamily={'var(--font-semi-bold)'}
            fontSize={16}
          >
            Customise withdrawal method
          </Typography>
          <Typography color={theme.palette.text.secondary} fontSize={12}>
            Custom Name*
          </Typography>

          <StyledOutlinedInputFC
            fullWidth
            type="text"
            value={customName}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
            ) => setCustomName(e.target.value)}
          />
          <Typography
            color={theme.palette.text.secondary}
            fontSize={12}
            mt={0.5}
            align="right"
          >
            13/21
          </Typography>
        </Box>

        <Box display={'flex'} flexDirection={'column'} gap={1}>
          <Typography
            color={theme.palette.text.primary}
            fontFamily={'var(--font-semi-bold)'}
            fontSize={16}
          >
            Preferred method
          </Typography>

          <Box
            sx={{
              bgcolor: theme.palette.grey[600],
              borderRadius: 2.5,
              display: 'flex',
              flexDirection: 'column',
              p: 1.5,
              gap: 1,
            }}
          >
            <Box display={'flex'} alignItems="center" gap={1}>
              <IOSSwitch />

              <Typography
                fontFamily={'var(--font-medium)'}
                fontSize={16}
                color={theme.palette.text.primary}
              >
                Preferred method
              </Typography>
            </Box>

            <Typography color={theme.palette.text.secondary} fontSize={14}>
              This method will be used for automatic withdrawals.
            </Typography>
          </Box>
        </Box>

        <Box display={'flex'} flexDirection={'column'} gap={1} pt={3}>
          <Typography>Details</Typography>

          <StyledDiv>
            <Typography color={theme.palette.text.secondary} fontSize={14}>
              Account type
            </Typography>
            <Typography
              color={theme.palette.text.primary}
              fontFamily={'var(--font-semi-bold)'}
              fontSize={14}
            >
              Bank transfer
            </Typography>
          </StyledDiv>

          <StyledDiv>
            <Typography color={theme.palette.text.secondary} fontSize={14}>
              Recipient’s full name
            </Typography>
            <Typography
              color={theme.palette.text.primary}
              fontFamily={'var(--font-semi-bold)'}
              fontSize={14}
            >
              Chad Bussa
            </Typography>
          </StyledDiv>

          <StyledDiv>
            <Typography color={theme.palette.text.secondary} fontSize={14}>
              Currency
            </Typography>
            <Typography
              color={theme.palette.text.primary}
              fontFamily={'var(--font-semi-bold)'}
              fontSize={14}
            >
              USD · United States Dollar
            </Typography>
          </StyledDiv>

          <StyledDiv>
            <Typography color={theme.palette.text.secondary} fontSize={14}>
              Transfer type
            </Typography>
            <Typography
              color={theme.palette.text.primary}
              fontFamily={'var(--font-semi-bold)'}
              fontSize={14}
            >
              Local
            </Typography>
          </StyledDiv>

          <StyledDiv>
            <Typography color={theme.palette.text.secondary} fontSize={14}>
              Provider fee
            </Typography>
            <Typography
              color={theme.palette.text.primary}
              fontFamily={'var(--font-semi-bold)'}
              fontSize={14}
            >
              Fee based on selected currency
            </Typography>
          </StyledDiv>

          <StyledDiv>
            <Typography color={theme.palette.text.secondary} fontSize={14}>
              Account number
            </Typography>
            <Typography
              color={theme.palette.text.primary}
              fontFamily={'var(--font-semi-bold)'}
              fontSize={14}
            >
              ****3420
            </Typography>
          </StyledDiv>
        </Box>
      </Box>

      <Divider />

      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        width={'100%'}
        bgcolor={theme.palette.secondary.main}
        sx={{
          opacity: 0.8,
        }}
      >
        <Box display={'flex'} alignItems={'center'} gap={1} py={2}>
          <SecondaryButton
            sx={{
              backgroundColor: theme.palette.error.darker,
              width: 80,
              borderColor: '#682B2B',
              '&:hover': {
                backgroundColor: theme.palette.error.dark,
              },
            }}
          >
            Delete
          </SecondaryButton>

          <PrimaryButton sx={{ width: 80 }}>Update</PrimaryButton>
        </Box>
      </Box>
    </BootstrapDialog>
  )
}
