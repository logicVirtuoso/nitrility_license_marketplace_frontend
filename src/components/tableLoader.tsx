import { Skeleton } from '@mui/material'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'

interface TableRowsLoaderProps {
  rowsNum: number
  colsNum: number
}

const TableRowsLoader = ({ rowsNum, colsNum }: TableRowsLoaderProps) => {
  const renderSkeletonRow = (index: number) => (
    <TableRow
      key={index}
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
      }}
    >
      {[...Array(colsNum)].map((_, idx) => (
        <TableCell key={idx} align="center">
          <Skeleton animation="wave" variant="text" />
        </TableCell>
      ))}
    </TableRow>
  )

  const skeletonRows = [...Array(rowsNum)].map((_, index) =>
    renderSkeletonRow(index),
  )

  return <>{skeletonRows}</>
}

export default TableRowsLoader
