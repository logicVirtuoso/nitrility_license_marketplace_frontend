import { makeStyles } from '@mui/styles'
import { styled } from '@mui/material/styles'
import { Box, Grid, Tabs, Tab, Input } from '@mui/material'
import { Theme } from '@mui/material/styles'

export const TransparentSearchInput = styled(Input)(({ theme }) => ({
  color: theme.palette.secondary.main,
  backgroundColor: theme.palette.containerSecondary.main,
  position: 'absolute !important' as any,
  right: 0,
  top: 0,
  height: '45px',
  minWidth: '300px',
  '&:hover': {
    backgroundColor: 'white',
  },
  '& .MuiInputBase-input': {
    height: 32,
    paddingLeft: `calc(1em + ${theme.spacing(2)})`,
    transition: theme.transitions.create('width'),
    fontSize: 14,
    fontWeight: 400,
    color: 'black',
  },
  borderRadius: '8px',
  '& .MuiInputBase-input::placeholder': {
    color: theme.palette.mode === 'dark' ? '#C5C5C5' : '#666666',
  },
  '& .MuiInputBase-input:hover::placeholder': {
    color: theme.palette.mode === 'dark' ? '#C5C5C5' : '#666666',
  },
}))

export const StyledInput = styled(Input)(({ theme }) => ({
  color: theme.palette.text.primary,
  height: '42px',
  width: '100%',
  backgroundColor: theme.palette.containerSecondary.main,
  borderRadius: '8px',
  '& .MuiInputBase-input': {
    height: 32,
    paddingLeft: `8px`,
    transition: theme.transitions.create('width'),
    fontSize: 14,
    fontWeight: 400,
    color: theme.palette.text.primary,
  },
}))

export const Container = styled(Box)(({ theme }) => ({
  width: '100%',
  background: theme.palette.background.paper,
  margin: 'auto',
}))

export const ContainerFluid = styled(Box)(({ theme }) => ({
  padding: '0px 100px',
  background: theme.palette.background.paper,
  margin: 'auto',
}))

export const UploadImageContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  background: theme.palette.secondary.main,
  textAlign: 'center',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 250,
}))

export const UploadImage = styled('img')(({ theme }) => ({
  width: '100%',
  textAlign: 'center',
  objectFit: 'cover',
  height: '100%',
}))

export const PublicAvatarImageContainer = styled(Grid)(({ theme }) => ({
  height: theme.spacing(18),
  width: theme.spacing(18),
  background: theme.palette.secondary.light,
  marginTop: theme.spacing(-9),
  borderRadius: '100%',
  position: 'sticky',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  maxWidth: '100%',
  overflow: 'hidden',
  transition: 'transform .5s ease',
}))

export const PrivateAvatarImageContainer = styled(Grid)(({ theme }) => ({
  height: theme.spacing(12),
  width: theme.spacing(12),
  background: theme.palette.secondary.light,
  margin: 'auto',
  marginTop: theme.spacing(-3.5),
  borderRadius: theme.spacing(10),
}))

export const AvatarImage = styled('img')(({ theme }) => ({
  width: '100%',
  objectFit: 'cover',
  margin: 'auto',
}))

export const PersonaLabel = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '200px',
  fontSize: '28px',
  lineHeight: '34px',
  fontWeight: 500,
  color: theme.palette.secondary.dark,
  [theme.breakpoints.down('md')]: {
    fontSize: theme.spacing(0.93),
  },
}))

export const ButtonContainer = styled(Grid)(({ theme }) => ({
  width: '0px 100px',
  margin: 'auto',
  display: 'flex',
  marginTop: theme.spacing(1),
  justifyContent: 'space-between',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    marginTop: theme.spacing(3),
    width: '95%',
  },
}))

export const TabsContainer = styled(Grid)(({ theme }) => ({
  width: 'calc(100% - 200px)',
  margin: 'auto',
  marginTop: theme.spacing(1),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    marginTop: theme.spacing(3),
    width: '95%',
  },
}))

export const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'initial',
  color: theme.palette.secondary.dark,
  fontWeight: 500,
  fontSize: '18px',
  '&:hover': {
    color: theme.palette.secondary.darker,
  },
}))

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.secondary.light}`,
}))

export const useProfileStyles = makeStyles((theme: Theme) => ({
  personal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  musicBoxes: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    margin: 35,
  },
  musicBox: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '250px',
    background: 'grey',
  },
  descBox: {
    background: '#c3c3c3',
    padding: '15px',
    textAlign: 'left',
    width: '80%',
    margin: 'auto',
    marginTop: '35px',
    marginBottom: '35px',
  },
  input: {
    display: 'none',
  },
  iconButton: {},
}))
