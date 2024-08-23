import { styled } from '@mui/material/styles'
import { Grid } from '@mui/material'

const CustomizedContainer = styled(Grid)(({ theme }) => ({
  width: 'calc(100% - 200px)',
  margin: 'auto',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    marginTop: theme.spacing(3),
    width: 'calc(100% - 100px)',
  },
}))

export default CustomizedContainer
