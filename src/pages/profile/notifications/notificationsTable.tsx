import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import { visuallyHidden } from '@mui/utils'
import { styled } from '@mui/material/styles'
import SecondaryButton from '../../../components/buttons/secondary-button'
import { useSelector } from 'react-redux'
import { NotificationTypes } from 'src/actions/actionTypes'
import {
  reportAppealByUser,
  reportBurnedLicenseByUser,
} from '../../../api/report'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { IconButton } from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { AuthType } from 'src/store/reducers/authorizationReducer'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  cursor: 'pointer',
}))

const StyledTableHead = styled(TableCell)(({ theme }) => ({
  textTransform: 'capitalize',
  backgroundColor: '#fff',
  fontWeight: 500,
  fontSize: '16px',
}))

interface Data {
  time: string
  message: string
  options: number
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

type Order = 'asc' | 'desc'

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number,
) {
  const stabilizedThis = array?.map((el, index) => [el, index] as [T, number])
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis?.map((el) => el[0])
}

interface HeadCell {
  disablePadding: boolean
  id: keyof Data
  label: string
  numeric: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'time',
    numeric: false,
    disablePadding: true,
    label: 'Time',
  },
  {
    id: 'message',
    numeric: false,
    disablePadding: false,
    label: 'Message',
  },
  {
    id: 'options',
    numeric: false,
    disablePadding: false,
    label: 'Options',
  },
]

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, rowCount, onRequestSort } = props
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  return (
    <TableHead>
      <StyledTableRow>
        {headCells.map((headCell) => (
          <StyledTableHead
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableHead>
        ))}
      </StyledTableRow>
    </TableHead>
  )
}

interface NotificationsTableProps {
  notifications: Array<any>
}

export default function NotificationsTable({
  notifications,
}: NotificationsTableProps) {
  const navigate = useNavigate()
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('time')
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [reportedClaim, setReportedClaim] = React.useState([])

  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = notifications.map((n) => n.time)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - notifications?.length) : 0

  const reportAppeal = async (_claim) => {
    const claim = Object.assign({}, _claim)
    const toastReportingLicense = toast.loading('Reporting now')
    const res = await reportAppealByUser({
      accountAddress: authorization?.currentUser?.accountAddress,
      contentId: claim.contentId,
      userId: claim.userId,
    })
    if (res.status === 200 && res.data.success) {
      const tmp = reportedClaim.map((item) => {
        if (
          item.userId === res.data.data.userId &&
          item.contentId === res.data.data.contentId
        ) {
          return {
            ...item,
            status: res.data.data.status,
            active: false,
          }
        } else {
          return item
        }
      })
      setReportedClaim(tmp)
      toast.success('Successfully reported!', {
        id: toastReportingLicense,
      })
    } else {
      toast.error('couldnt report now', { id: toastReportingLicense })
    }
  }

  const reportBurned = async (licenseReportId) => {
    const toastReportingLicense = toast.loading('Reporting now')
    const res = await reportBurnedLicenseByUser(licenseReportId)
    if (res.status === 200 && res.data.success) {
      toast.success(res.data.msg, {
        id: toastReportingLicense,
      })
    } else {
      toast.error('couldnt report now', { id: toastReportingLicense })
    }
  }

  const viewHandler = async (notification) => {
    navigate(`/purchase/${notification.listedId}`)
  }

  return (
    <Box sx={{ width: '100%', marginTop: '20px' }}>
      <Paper
        sx={{
          width: '100%',
          mb: 2,
          p: 2,
          overflowX: 'auto',
          boxShadow: 'rgba(0, 0, 0, 0.08) 0px 6px 16px 1px',
        }}
      >
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={notifications?.length}
            />
            <TableBody>
              {stableSort(notifications, getComparator(order, orderBy))
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`
                  const created = new Date(row.createdAt).toISOString()

                  const remainedTime =
                    Date.parse(new Date().toISOString()) - Date.parse(created)
                  const days = Math.floor(remainedTime / (1000 * 60 * 60 * 24))
                  const hours = Math.floor(
                    (remainedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
                  )
                  const minutes = Math.floor(
                    (remainedTime % (1000 * 60 * 60)) / (1000 * 60),
                  )
                  const seconds = Math.floor(
                    (remainedTime % (1000 * 60)) / 1000,
                  )

                  let countedTime
                  if (days > 0) {
                    countedTime = `${days}d ${hours}h ${minutes}m ${seconds}s`
                  } else {
                    if (hours > 0) {
                      countedTime = `${hours}h ${minutes}m ${seconds}s`
                    } else {
                      if (minutes > 0) {
                        countedTime = `${minutes}m ${seconds}s`
                      } else {
                        countedTime = `${seconds}s`
                      }
                    }
                  }

                  return (
                    <StyledTableRow hover tabIndex={-1} key={index}>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {countedTime} ago
                      </TableCell>
                      <TableCell align="left">{row.description}</TableCell>
                      <TableCell align="left">
                        {row.type === NotificationTypes.Burnt && (
                          <SecondaryButton
                            onClick={() => reportBurned(row.licenseReportId)}
                          >
                            Dispute
                          </SecondaryButton>
                        )}
                        {(row.type === NotificationTypes.Changed ||
                          row.type === NotificationTypes.Recommended) && (
                          <IconButton onClick={() => viewHandler(row)}>
                            <VisibilityIcon
                              sx={{
                                color: 'black',
                              }}
                            />
                          </IconButton>
                        )}
                      </TableCell>
                    </StyledTableRow>
                  )
                })}
              {emptyRows > 0 && (
                <StyledTableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {notifications?.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[25, 50]}
            component="div"
            count={notifications.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    </Box>
  )
}
