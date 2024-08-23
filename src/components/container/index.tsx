import { styled } from '@mui/material/styles'
import { Grid } from '@mui/material'

const Container = styled(Grid)(({ theme }) => ({
  width: '85%',
  margin: 'auto',
  marginTop: theme.spacing(5),
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    marginTop: theme.spacing(3),
    width: '95%',
  },
}))

export default Container
