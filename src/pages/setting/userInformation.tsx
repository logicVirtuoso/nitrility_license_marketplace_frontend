import { Box, Divider, Grid, Typography, useTheme } from '@mui/material'
import PrimaryButton from 'src/components/buttons/primary-button'
import { StyledInput } from '../profile/style'
import React, { useEffect, useState } from 'react'
import PaymentMethodDialog from './paymenetMethodDialog'
import { PaymentType, paymentMethods } from './constants'
import PayoutDetails from './payoutDetails'
import { updateUserName, getUserLegalName } from 'src/api'
import toast from 'react-hot-toast'
import { updateStore } from 'src/utils/utils'
import { AUTHENTICATED } from 'src/actions/actionTypes'

export default function UserInformationSetting() {
  const theme = useTheme()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [editName, setEditName] = useState(false)

  const [openPaymentMethodDialog, setOpenPaymentMethodDialog] =
    useState<boolean>(false)
  const [payments, setPayments] = useState<Array<any>>([])
  const [openPaymentDetails, setOpenPaymentDetails] = useState<boolean>(false)

  const paymentSelector = async (label: PaymentType) => {
    if (payments.indexOf(label) === -1) setPayments((prev) => [...prev, label])
    setOpenPaymentMethodDialog(false)
  }

  useEffect(() => {
    const fetchUser = async () => {
      const { success, data } = await getUserLegalName()
      if (success) {
        setFirstName(data.firstName)
        setLastName(data.lastName)
      }
    }
    fetchUser()
  }, [])

  const updateLegalName = async () => {
    const { success, msg, data } = await updateUserName(firstName, lastName)
    if (success) {
      updateStore(AUTHENTICATED, data.accessToken)
      toast.success(msg)
    } else {
      toast.error(msg)
    }
  }

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      bgcolor={theme.palette.secondary.main}
      borderRadius={3}
      p={2}
    >
      <Box display={'flex'} flexDirection={'column'}>
        <Typography
          color={theme.palette.text.primary}
          fontFamily={'var(--font-semi-bold)'}
          fontSize={'18px'}
        >
          General Account
        </Typography>
        <Typography
          color={theme.palette.text.secondary}
          fontFamily={'var(--font-base)'}
          fontSize={'14px'}
          mt={1}
        >
          Adjust key information about your account
        </Typography>
      </Box>

      <Divider />

      <Box display={'flex'} flexDirection={'column'} gap={2} py={2}>
        <Grid item xs={12} md={6}>
          <Box display={'flex'} flexDirection={'column'} gap={0.5}>
            <Typography
              variant="subtitle1"
              color={theme.palette.text.secondary}
            >
              Legal First Name
            </Typography>
            <StyledInput
              placeholder="first name"
              value={firstName}
              type="text"
              disableUnderline={true}
              readOnly={editName ? false : true}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setFirstName(event.target.value)
              }
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box display={'flex'} flexDirection={'column'} gap={0.5}>
            <Typography
              variant="subtitle1"
              color={theme.palette.text.secondary}
            >
              Legal Last Name
            </Typography>
            <StyledInput
              placeholder="last name"
              value={lastName}
              type="text"
              readOnly={editName ? false : true}
              disableUnderline={true}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setLastName(event.target.value)
              }
            />
          </Box>
        </Grid>
        <PrimaryButton
          sx={{ maxWidth: 220 }}
          onClick={() => {
            if (editName) {
              updateLegalName()
            }
            setEditName(!editName)
          }}
        >
          {editName ? 'Save First and Last Name' : 'Edit First and Last Name'}
        </PrimaryButton>
        <Box display={'flex'} flexDirection={'column'}>
          <Typography
            color={theme.palette.text.primary}
            fontFamily={'var(--font-semi-bold)'}
            fontSize={'18px'}
          >
            Payment Info
          </Typography>
          <Typography
            color={theme.palette.text.secondary}
            fontFamily={'var(--font-base)'}
            fontSize={'14px'}
            mt={1}
          >
            Enter your payment info when purchasing licenses
          </Typography>
        </Box>
        <Box
          display={'flex'}
          flexDirection={'column'}
          borderRadius={2.5}
          border={`1px solid ${theme.palette.grey[600]}`}
          position={'relative'}
        >
          <Box
            display={'flex'}
            alignItems="center"
            justifyContent={'space-between'}
            p={2}
          >
            <Typography
              fontFamily={'var(--font-medium)'}
              fontSize={16}
              color={theme.palette.text.primary}
            >
              Payment methods
            </Typography>

            <PrimaryButton
              sx={{ width: 111 }}
              onClick={() => setOpenPaymentMethodDialog(true)}
            >
              Add method
            </PrimaryButton>
          </Box>
          <Divider />

          {payments.length === 0 ? (
            <Typography
              fontSize={14}
              color={theme.palette.text.secondary}
              p={2}
            >
              You have not set up any payment methods yet.
            </Typography>
          ) : (
            <Box display={'flex'} flexDirection={'column'} gap={1} p={2}>
              {payments.map((item, idx) => {
                const paymentItem = paymentMethods.find(
                  (method) => method.label === item,
                )
                return (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderRadius: 2.5,
                      border: `1px solid ${theme.palette.grey[600]}`,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: theme.palette.grey[600],
                      },
                    }}
                    onClick={() => setOpenPaymentDetails(true)}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                      }}
                    >
                      {paymentItem.icon}
                      <Box display={'flex'} flexDirection={'column'}>
                        <Typography
                          fontSize={16}
                          fontFamily={'var(--font-semi-bold)'}
                        >
                          {paymentItem.label}
                        </Typography>
                      </Box>
                    </Box>
                    <PrimaryButton
                      sx={{ width: 108 }}
                      onClick={(e) => {
                        const res = payments.filter(
                          (paymentMethod) =>
                            paymentMethod !== paymentItem.label,
                        )
                        setPayments(res)
                        e.stopPropagation()
                      }}
                    >
                      Remove
                    </PrimaryButton>
                  </Box>
                )
              })}
            </Box>
          )}
        </Box>
      </Box>
      <PaymentMethodDialog
        paymentSelector={paymentSelector}
        open={openPaymentMethodDialog}
        setOpen={setOpenPaymentMethodDialog}
      />
      <PayoutDetails
        open={openPaymentDetails}
        setOpen={setOpenPaymentDetails}
      />
    </Box>
  )
}
