import { styled } from '@mui/material/styles'
import { Button, ButtonProps } from '@mui/material'

interface BaseButtonProps extends ButtonProps {
  height?: number
  width?: number
}

export const BaseButton = styled(Button)<BaseButtonProps>(({ ...rest }) => ({
  borderRadius: 2,
  textTransform: 'none',
  transition: 'all 0.3s ease 0s',
}))

interface TabButtonProps extends ButtonProps {
  selected: boolean
}

export const TabButton = styled(Button)<TabButtonProps>(
  ({ theme, selected, ...rest }) => ({
    fontSize: '14px',
    fontWeight: selected ? '700' : '400',
    height: '29px',
    borderRadius: '6px',
    textTransform: 'none',
    transition: 'all 0.3s ease 0s',
    zIndex: selected ? 1 : 0,
    textWrap: 'nowrap',
    color: selected
      ? theme.palette.mode === 'dark'
        ? '#121212'
        : '#FAFAFA'
      : theme.palette.mode === 'dark'
      ? '#C5C5C5'
      : '#666666',
    cursor: selected ? 'default' : 'pointer',
    backgroundColor: selected
      ? theme.palette.mode === 'dark'
        ? theme.palette.primary.main
        : theme.palette.background.paper
      : theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: selected
        ? theme.palette.primary.dark
        : theme.palette.containerPrimary.main,
    },
    '&:focus-visible': {
      outline: 'none',
      outlineOffset: 0,
    },
    '&:after, &:active:after': {
      boxShadow: '0 0 0 0 rgb(106 106 106 / 90%)',
    },
  }),
)
