import { Box } from '@mui/material'
import styled from 'styled-components'

const UnitWrapper = styled.div`
    background: transparent;
    flex: auto;
    width: 50px;
    transition: border-color 0.25s ease-in-out 0s;
    background-color 0.25s ease-in-out 0s;
    opacity: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    border-radius: 12px;
    border: 1px solid rgba(18, 18, 18, 0.12);
    border-bottom-left-radius: 0px;
    border-top-left-radius: 0px;
    padding: 12px;
`

const PriceWrapper = styled.div`
  cursor: text;
  display: flex;
  align-items: center;
  border-radius: 12px;
  color: rgb(18, 18, 18);
  font-variant-ligatures: no-contextual;
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background: transparent;
  border-bottom-right-radius: 0px;
  border-top-right-radius: 0px;
  transition: border-color 0.25s ease-in-out 0s,
    background-color 0.25s ease-in-out 0s;
  border: 1px solid rgba(18, 18, 18, 0.12);
`

const SupplyWrapper = styled.div`
  cursor: text;
  display: flex;
  align-items: center;
  border-radius: 12px;
  color: rgb(18, 18, 18);
  font-variant-ligatures: no-contextual;
  width: 100%;
  padding: 12px;
  font-size: 16px;
  background: transparent;
  transition: border-color 0.25s ease-in-out 0s,
    background-color 0.25s ease-in-out 0s;
  border: 1px solid rgba(18, 18, 18, 0.12);
`

const AmountInput = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;
  display: flex;
  font-size: 16px;
  line-height: 26px;
  cursor: text;
  &[type='number'] {
    -moz-appearance: textfield;
  }
  &[type='number']:hover,
  &[type='number']:focus {
    -moz-appearance: number-input;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type='number'] {
    -moz-appearance: textfield;
    /* Firefox */
  }
`

const UnitInput = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
`
interface InputProps {
  value: string
  handler: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function PriceInput({ value, handler }: InputProps) {
  return (
    <Box display={'flex'} height={46}>
      <PriceWrapper>
        <AmountInput value={value} onChange={handler} />
      </PriceWrapper>

      <UnitWrapper>
        <UnitInput readOnly={true} value={'$'} />
      </UnitWrapper>
    </Box>
  )
}

export const SupplyInput = ({ value, handler }: InputProps) => {
  return (
    <Box display={'flex'} height={46}>
      <SupplyWrapper>
        <AmountInput value={value} onChange={handler} pattern="\d*" />
      </SupplyWrapper>
    </Box>
  )
}
