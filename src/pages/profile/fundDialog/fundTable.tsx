import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import { visuallyHidden } from '@mui/utils'
import { Theme, useTheme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import HistoryDialog from './historyDialog'
import SpotifyLogin from 'react-spotify-login'
import {
  SPOTIFY_CLIENT_ID,
  WITHDRAW_REDIRECTED_URL,
  TIME_OUT,
} from '../../../config'
import { spotifyLogin, sendVerificationCodeToSpotifyEmail } from '../../../api'
import { toast } from 'react-hot-toast'
import SpotifyDialog from './spotifyDialog'
import { useSelector } from 'react-redux'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { IconButton } from '@mui/material'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { useTokenPrice } from 'src/hooks/useTokenPrice'
import TableRowsLoader from 'src/components/tableLoader'

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  cursor: 'pointer',
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  textTransform: 'capitalize',
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#fff',
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

interface Data {
  typeOfLicense: string
  amountedFunds: number
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
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

interface HeadCell {
  disablePadding: boolean
  id: keyof Data
  label: string
  numeric: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'typeOfLicense',
    numeric: false,
    disablePadding: true,
    label: 'Type of License',
  },
  {
    id: 'amountedFunds',
    numeric: true,
    disablePadding: false,
    label: 'Amounted Funds',
  },
]

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => void
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
          <StyledTableCell
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
          </StyledTableCell>
        ))}
        <StyledTableCell
          align={'center'}
          padding={'normal'}
          sortDirection={false}
        >
          History
        </StyledTableCell>
        <StyledTableCell
          align={'center'}
          padding={'normal'}
          sortDirection={false}
        >
          Withdraw Funds
        </StyledTableCell>
      </StyledTableRow>
    </TableHead>
  )
}

interface FundTableProps {
  loading: boolean
  amount: string
  setOpen: (open: boolean) => void
}

export default function FundTable({
  loading,
  amount,
  setOpen,
}: FundTableProps) {
  const theme = useTheme()
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('typeOfLicense')
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [funds, setFunds] = React.useState([
    {
      typeOfLicense: 'Music Licensing',
      amountedFunds: amount,
    },
  ])

  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  const { tokenPrice } = useTokenPrice()

  // history dialog
  const [openHistoryDlg, setOpenHistoryDlg] = React.useState<boolean>(false)

  // verify the spotify account
  const [openSpotifyDlg, setOpenSpotifyDlg] = React.useState<boolean>(false)

  const [spotifyEmail, setSpotifyEmail] = React.useState<string>()

  // set timer for spotify login
  const [startedTime, setStartedTime] = React.useState<number | undefined>(0)

  const spotifyDlgHandler = (opened: boolean) => {
    setOpenSpotifyDlg(opened)
    setOpen(opened)
  }

  const signInHandler = React.useCallback(
    async (token: string) => {
      if (token && token !== '') {
        const userRes = await spotifyLogin(token)
        if (userRes?.data) {
          const associatedEmail = userRes?.data?.email
          setSpotifyEmail(associatedEmail)

          try {
            const res = await sendVerificationCodeToSpotifyEmail(
              associatedEmail,
              authorization.currentUser.accountAddress,
            )
            if (res.status === 200 && res.data.success) {
              toast.success(res.data.msg)
              setOpenSpotifyDlg(true)
            } else {
              toast.error(res.data.msg)
            }
          } catch (e) {
            console.log(
              'error in sending verification code to spotify email',
              e,
            )
            toast.error('Something went wrong. Please try again')
          }
        } else {
          console.log('spotify sign in error')
          toast.error('Something went wrong. Please try again')
        }
      } else {
        toast.error('Invalid token. Please try again')
      }
    },
    [authorization.currentUser.accountAddress],
  )

  const onFailure = React.useCallback((response) => {
    console.log(response)
  }, [])

  const onSuccess = React.useCallback(
    (response) => {
      const endTime = Date.now()
      if (endTime > startedTime + TIME_OUT) {
        toast.error('Your token is expired. Please try again')
      } else {
        signInHandler(response.access_token)
      }
    },
    [startedTime, signInHandler],
  )

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name)
    let newSelected: readonly string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }

    setSelected(newSelected)
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

  return (
    <Box width={'100%'} mt={4}>
      <Paper
        sx={{
          width: 'calc(100% - 40px)',
          mb: 2,
          padding: '20px',
          overflowX: 'auto',
          backgroundColor: theme.palette.secondary.light,
        }}
      >
        <TableContainer>
          <Table
            width={'100%'}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={funds.length}
            />
            {!loading && (
              <TableBody>
                {stableSort(funds, getComparator(order, orderBy))
                  .filter((fund) => Number(fund.amountedFunds) > 0)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <StyledTableRow
                        hover
                        onClick={(event) =>
                          handleClick(event, row.typeOfLicense.toString())
                        }
                        tabIndex={-1}
                        key={index}
                      >
                        <StyledTableCell
                          component="th"
                          scope="row"
                          padding="none"
                        >
                          {row.typeOfLicense}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {`$${(
                            Number(row.amountedFunds) * tokenPrice
                          ).toLocaleString()}`}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <IconButton onClick={() => setOpenHistoryDlg(true)}>
                            <VisibilityIcon
                              sx={{
                                color: 'black',
                              }}
                            />
                          </IconButton>
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <SpotifyLogin
                            clientId={SPOTIFY_CLIENT_ID}
                            redirectUri={WITHDRAW_REDIRECTED_URL}
                            scope="user-read-email"
                            onSuccess={onSuccess}
                            onFailure={onFailure}
                            className="spotify-withdraw"
                            onRequest={() => setStartedTime(Date.now())}
                          >
                            <MonetizationOnIcon />
                          </SpotifyLogin>
                        </StyledTableCell>
                      </StyledTableRow>
                    )
                  })}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={funds.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <HistoryDialog open={openHistoryDlg} setOpen={setOpenHistoryDlg} />
      <SpotifyDialog
        spotifyEmail={spotifyEmail}
        open={openSpotifyDlg}
        setOpen={spotifyDlgHandler}
      />
    </Box>
  )
}
