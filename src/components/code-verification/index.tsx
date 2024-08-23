import VerificationInput from 'react-verification-input'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

const StyledReactInputVerificationCode = styled(Box)(({ theme }) => ({
  display: 'flex',
  '& .ReactInputVerificationCode__item': {
    borderRadius: '8px',
    boxShadow: 'none',
    width: 'var(--ReactInputVerificationCode-itemWidth, 40px)', // Apply custom width
    height: 'var(--ReactInputVerificationCode-itemHeight, 48px)', // Apply custom height
    margin: `0 var(--ReactInputVerificationCode-itemSpacing, 8px)`, // Apply custom spacing
  },
  '& .ReactInputVerificationCode__item.is-active': {
    boxShadow: 'none',
    border: `1px solid ${theme.palette.grey[300]}`,
  },
  '& .verification-character': {
    fontSize: '16px',
    fontWeight: 500,
    backgroundColor: theme.palette.containerSecondary.main,
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.grey[600]}`,
    borderRadius: '6px',
  },
  '& .character--selected': {
    outline: `1px solid ${theme.palette.grey[300]}`,
  },
}))

type CodeVerificationProps = {
  verificationCode: string
  handler(val: string): void
}

const CodeVerification = ({
  verificationCode,
  handler,
}: CodeVerificationProps) => {
  return (
    <StyledReactInputVerificationCode>
      <VerificationInput
        classNames={{
          character: 'verification-character',
          characterInactive: 'character--inactive',
          characterSelected: 'character--selected',
        }}
        value={verificationCode}
        onChange={(val) => handler(val)}
        length={6}
        autoFocus={true}
        passwordMode={false}
      />
    </StyledReactInputVerificationCode>
  )
}

export default CodeVerification
