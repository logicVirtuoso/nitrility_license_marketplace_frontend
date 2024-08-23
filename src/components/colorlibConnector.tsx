import StepConnector, {
  stepConnectorClasses,
} from '@mui/material/StepConnector'
import { styled } from '@mui/material/styles'

export const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient(95deg, rgba(70,70,70,1) 0%, rgba(37,37,37,1) 33%, rgba(0,0,0,1) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient(95deg, rgba(70,70,70,1) 0%, rgba(37,37,37,1) 33%, rgba(0,0,0,1) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    // backgroundColor: theme.palette.secondary.dark,
    backgroundImage:
      'linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(59,59,59,1) 62%, rgba(116,116,116,1) 100%)',
    borderRadius: 1,
  },
}))

export const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean }
}>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.secondary.dark,
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage:
      'linear-gradient(135deg, rgba(78,78,78,1) 0%, rgba(59,59,59,1) 33%, rgba(0,0,0,1) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
      'linear-gradient(135deg, rgba(78,78,78,1) 0%, rgba(59,59,59,1) 33%, rgba(0,0,0,1) 100%)',
  }),
}))
