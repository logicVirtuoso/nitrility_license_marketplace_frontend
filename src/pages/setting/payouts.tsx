import { Box, Divider, Typography, useTheme } from '@mui/material'
import PrimaryButton from 'src/components/buttons/primary-button'
import IOSSwitch from 'src/components/isoSwitch'
import { useEffect, useState } from 'react'
import useListingLicense from 'src/hooks/useListingLicense'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { useTokenPrice } from 'src/hooks/useTokenPrice'
import HistoryDialog from '../profile/fundDialog/historyDialog'
import WithdrawalMethodDlg from './withdrawalMethodDlg'
import { WithdrawType, withdrawalMethods } from './constants'
import PayoutDetails from './payoutDetails'

export default function PayoutsSetting() {
  const theme = useTheme()

  const [curTime, setCurTime] = useState<string>('')
  const { getWithdrawalFund, withdraw } = useListingLicense()
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const [balance, setBalance] = useState<number>(0)
  const { tokenPrice } = useTokenPrice()
  const [openHistoryDlg, setOpenHistoryDlg] = useState<boolean>(false)
  const [openWithdrawalMethodDlg, setOpenWithdrawalMethodDlg] =
    useState<boolean>(false)
  const [paymentMethods, setPaymentMethods] = useState<Array<any>>([])
  const [openPayoutDetails, setOpenPayoutDetails] = useState<boolean>(false)

  useEffect(() => {
    const getCurrentTime = () => {
      const now = new Date()
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const currentTime = hours + ':' + minutes
      return currentTime
    }
    setCurTime(getCurrentTime())

    const timer = setInterval(() => {
      setCurTime(getCurrentTime())
    }, 60000)

    // Clear the interval when the component unmounts
    return () => clearInterval(timer)
  }, []) // Empty dependency array ensures this effect runs only once

  useEffect(() => {
    const fetchWithdrawal = () => {
      if (authorization?.currentUser?.sellerId) {
        getWithdrawalFund(authorization.currentUser.sellerId).then((data) => {
          setBalance(data)
        })
      }
    }
    fetchWithdrawal()
    const timer = setInterval(() => {
      fetchWithdrawal()
    }, 60000)

    // Clear the interval when the component unmounts
    return () => clearInterval(timer)
  }, [authorization?.currentUser?.sellerId, getWithdrawalFund]) // Empty dependency array ensures this effect runs only once

  const paymentSelector = async (label: WithdrawType) => {
    setPaymentMethods((prev) => [...prev, label])
    setOpenWithdrawalMethodDlg(false)
  }

  const withdrawHandler = async () => {
    await withdraw(authorization.currentUser.sellerId)
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
          Get paid
        </Typography>
        <Typography
          color={theme.palette.text.secondary}
          fontFamily={'var(--font-base)'}
          fontSize={'14px'}
          mt={1}
        >
          Withdraw available funds, and set your withdrawal methods.
        </Typography>
      </Box>

      <Divider />

      <Box display={'flex'} flexDirection={'column'} gap={2} py={2}>
        <Box
          display={'flex'}
          flexDirection={'column'}
          gap={1}
          borderRadius={2.5}
          border={`1px solid ${theme.palette.grey[600]}`}
          position={'relative'}
          padding={'16px 20px'}
        >
          <Typography
            fontFamily={'var(--font-medium)'}
            fontSize={16}
            color={theme.palette.text.primary}
          >
            Balance
          </Typography>
          <Typography variant="h2" color={theme.palette.text.primary}>
            {`$${(balance * tokenPrice).toLocaleString()}`}
          </Typography>
          <Typography fontSize={14} color={theme.palette.text.secondary}>
            {`As of ${curTime}`}
          </Typography>

          <PrimaryButton
            sx={{
              maxWidth: 93,
              right: 20,
              bottom: 16,
              position: 'absolute',
            }}
            disabled={balance === 0}
            onClick={withdrawHandler}
          >
            Withdraw
          </PrimaryButton>
        </Box>

        <Box
          display={'flex'}
          flexDirection={'column'}
          gap={1}
          borderRadius={2.5}
          border={`1px solid ${theme.palette.grey[600]}`}
          position={'relative'}
          padding={'16px 20px'}
        >
          <Typography
            fontFamily={'var(--font-medium)'}
            fontSize={16}
            color={theme.palette.text.primary}
          >
            Sales History
          </Typography>

          <Typography fontSize={14} color={theme.palette.text.secondary}>
            View your license transaction history and what people have purchased
            in the past
          </Typography>

          <PrimaryButton
            sx={{
              maxWidth: 113,
              right: 20,
              top: 16,
              position: 'absolute',
            }}
            onClick={() => setOpenHistoryDlg(true)}
          >
            View history
          </PrimaryButton>
        </Box>

        <Box
          display={'flex'}
          flexDirection={'column'}
          gap={1}
          borderRadius={2.5}
          border={`1px solid ${theme.palette.grey[600]}`}
          position={'relative'}
          padding={'16px 20px'}
        >
          <Typography
            fontFamily={'var(--font-medium)'}
            fontSize={16}
            color={theme.palette.text.primary}
            lineHeight={'150%'}
          >
            Withdrawal schedule
          </Typography>

          <Typography
            fontFamily={'var(--font-semi-bold)'}
            fontSize={14}
            color={theme.palette.text.primary}
            lineHeight={'150%'}
          >
            Recent withdrawals
          </Typography>

          <Typography fontSize={14} color={theme.palette.text.secondary}>
            You have not made any withdrawals yet.
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
              Withdrawal methods
            </Typography>

            <PrimaryButton
              sx={{ width: 111 }}
              onClick={() => setOpenWithdrawalMethodDlg(true)}
            >
              Add method
            </PrimaryButton>
          </Box>

          <Divider />

          {paymentMethods.length === 0 ? (
            <Typography
              fontSize={14}
              color={theme.palette.text.secondary}
              p={2}
            >
              You have not set up any withdrawal methods yet.
            </Typography>
          ) : (
            <Box display={'flex'} flexDirection={'column'} gap={1} p={2}>
              {paymentMethods.map((item, idx) => {
                const withdrawItem = withdrawalMethods.find(
                  (method) => method.label === item,
                )
                return (
                  <Box
                    key={idx}
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      borderRadius: 2.5,
                      border: `1px solid ${theme.palette.grey[600]}`,
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: theme.palette.grey[600],
                      },
                    }}
                    onClick={() => setOpenPayoutDetails(true)}
                  >
                    {withdrawItem.icon}
                    <Box display={'flex'} flexDirection={'column'}>
                      <Typography
                        fontSize={16}
                        fontFamily={'var(--font-semi-bold)'}
                      >
                        {withdrawItem.label}
                      </Typography>
                    </Box>
                  </Box>
                )
              })}
            </Box>
          )}
        </Box>

        <Box
          display={'flex'}
          flexDirection={'column'}
          borderRadius={2.5}
          border={`1px solid ${theme.palette.grey[600]}`}
          position={'relative'}
          padding={'16px 20px'}
          gap={1}
        >
          <Box display={'flex'} alignItems="center" gap={1}>
            <IOSSwitch />

            <Typography
              fontFamily={'var(--font-medium)'}
              fontSize={16}
              color={theme.palette.text.primary}
            >
              Automatic withdrawal
            </Typography>
          </Box>

          <Typography fontSize={14} color={theme.palette.text.secondary}>
            When turned ON, your funds will directly be withdrawn to your
            preferred method every time a payment is received.
          </Typography>
        </Box>
      </Box>

      <HistoryDialog open={openHistoryDlg} setOpen={setOpenHistoryDlg} />

      <WithdrawalMethodDlg
        paymentSelector={paymentSelector}
        open={openWithdrawalMethodDlg}
        setOpen={setOpenWithdrawalMethodDlg}
      />

      <PayoutDetails open={openPayoutDetails} setOpen={setOpenPayoutDetails} />
    </Box>
  )
}
