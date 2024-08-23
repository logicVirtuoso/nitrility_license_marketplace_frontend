import { randomRange } from 'src/utils/utils'
import { Box } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import './style.css'

interface PageLoaderProps {
  totalCount?: number
  itemCountPerOnerow?: number
}
const PageLoader = ({
  totalCount = 5,
  itemCountPerOnerow = 12,
}: PageLoaderProps) => {
  return (
    <Grid container spacing={2} sx={{ mt: 2 }} columns={60}>
      {randomRange(totalCount).map((idx) => {
        return (
          <Grid xs={itemCountPerOnerow} key={idx}>
            <Box className="group animate-pulse" />
          </Grid>
        )
      })}
    </Grid>
  )
}

export default PageLoader
