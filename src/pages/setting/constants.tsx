import BankTransferDarkIcon from 'src/assets/images/withdrawal/bank_transfer_dark.png'
import RevolutDarkIcon from 'src/assets/images/withdrawal/revolut_dark.png'
import PaypalDarkIcon from 'src/assets/images/withdrawal/paypal_dark.png'
import MoonpayDarkIcon from 'src/assets/images/withdrawal/moonpay_dark.png'
import { styled } from '@mui/material/styles'

const StyledImage = styled('img')(() => ({
  width: 40,
}))
export enum PaymentType {
  BankTransfer = 'Bank transfer',
  Revolut = 'Revolut',
  PayPal = 'PayPal',
  MoonPay = 'MoonPay',
}

export interface PaymentlMethodIF {
  label: PaymentType
  content: string
  icon: JSX.Element
}

export const paymentMethods = [
  {
    label: PaymentType.BankTransfer,
    content: 'Support 24+ currencies',
    icon: <StyledImage src={BankTransferDarkIcon} />,
  },
  {
    label: PaymentType.Revolut,
    content: 'Only available in USD',
    icon: <StyledImage src={RevolutDarkIcon} />,
  },
  {
    label: PaymentType.PayPal,
    content: 'Only available in USD',
    icon: <StyledImage src={PaypalDarkIcon} />,
  },
  {
    label: PaymentType.MoonPay,
    content: 'Supports 5 cryptocurrencies',
    icon: <StyledImage src={MoonpayDarkIcon} />,
  },
]

export enum WithdrawType {
  BankTransfer = 'Bank transfer',
  Revolut = 'Revolut',
  PayPal = 'PayPal',
  MoonPay = 'MoonPay',
}

export interface WithdrawalMethodIF {
  label: WithdrawType
  content: string
  icon: JSX.Element
}

export const withdrawalMethods = [
  {
    label: WithdrawType.BankTransfer,
    content: 'Support 24+ currencies',
    icon: <StyledImage src={BankTransferDarkIcon} />,
  },
  {
    label: WithdrawType.Revolut,
    content: 'Only available in USD',
    icon: <StyledImage src={RevolutDarkIcon} />,
  },
  {
    label: WithdrawType.PayPal,
    content: 'Only available in USD',
    icon: <StyledImage src={PaypalDarkIcon} />,
  },
  {
    label: WithdrawType.MoonPay,
    content: 'Supports 5 cryptocurrencies',
    icon: <StyledImage src={MoonpayDarkIcon} />,
  },
]
