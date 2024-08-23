import { styled } from '@mui/material/styles'
import { Tab, Tabs } from '@mui/material'

export const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'initial',
  fontSize: 14,
  padding: 0,
  minWidth: 'auto',
  minHeight: 26,
  fontWeight: '400',
  color: theme.palette.grey[500],
  '&:hover': {
    color: theme.palette.grey[400],
  },
  '&.Mui-selected .MuiTypography-root.label': {
    color: theme.palette.grey[300],
    fontFamily: 'var(--font-medium)',
  },
  '&.MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
    height: 1.5,
  },
}))

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  minHeight: 30,
  '& .MuiTabs-flexContainer': {
    gap: 16,
  },
}))
