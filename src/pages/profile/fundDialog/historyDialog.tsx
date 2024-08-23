import React, { useContext } from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import {
  Table,
  Box,
  Typography,
  IconButton,
  CardMedia,
  useTheme,
} from '@mui/material'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { GlobalMusicContext } from 'src/context/globalMusic'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import TableRowsLoader from 'src/components/tableLoader'
import { AccessLevel, CommonLicenseDataIF } from 'src/interface'
import useSoldLicenseHistory from 'src/hooks/useSoldLicenseHistory'
import BrokenAvatar from 'src/assets/avatar.png'
import { licensingTypeList } from 'src/config'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: 0,
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    borderRadius: 12,
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    backgroundColor: theme.palette.background.paper,
    maxWidth: 1080,
    borderRadius: 12,
  },
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  textTransform: 'capitalize',
  fontWeight: 500,
  border: 'none',
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.secondary,
    fontSize: 14,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTimeCell = styled(TableCell)(({ theme }) => ({
  textTransform: 'capitalize',
  fontWeight: 500,
  fontSize: 14,
  color: theme.palette.grey[200],
  border: 'none',
  maxWidth: 120,
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  maxHeight: '100px',
  borderTop: `1px solid ${theme.palette.grey[600]}`,
}))

const StyledAvatar = styled('img')(({ theme }) => ({
  width: '18px',
  height: '18px',
  objectFit: 'cover',
  borderRadius: '100%',
}))

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

export interface HistoryDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function HistoryDialog({ open, setOpen }: HistoryDialogProps) {
  const theme = useTheme()
  const { loading, soldHistories } = useSoldLicenseHistory()
  const { isPlaying, setIsPlaying, globalMusic, setGlobalMusic } =
    useContext(GlobalMusicContext)

  const handleClose = () => {
    setOpen(false)
  }

  const playHandler = (license) => {
    const commonLicenseData: CommonLicenseDataIF = license
    if (globalMusic?.listedId !== commonLicenseData.listedId) {
      setGlobalMusic(commonLicenseData)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="md"
      fullWidth={true}
    >
      <DialogContent dividers sx={{ padding: 80 }}>
        <Box
          display={'flex'}
          alignItems={'center'}
          bgcolor={theme.palette.containerPrimary.main}
          gap={2}
          p={3}
        >
          <Typography
            color={theme.palette.text.primary}
            fontFamily={'var(--font-semi-bold)'}
            fontSize={21}
          >
            License Sales History
          </Typography>
          <Typography
            variant="h5"
            color={theme.palette.grey[500]}
          >{`${soldHistories.length} sales`}</Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 400 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell component={'th'} sx={{ width: '12%' }}>
                  Time
                </StyledTableCell>
                <StyledTableCell component={'th'} sx={{ width: '19%' }}>
                  Source
                </StyledTableCell>
                <StyledTableCell component={'th'}>License Type</StyledTableCell>
                <StyledTableCell component={'th'}>
                  Amounted Funds
                </StyledTableCell>
                <StyledTableCell component={'th'}></StyledTableCell>
                <StyledTableCell component={'th'}>Buyer</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ backgroundColor: theme.palette.background.paper }}>
              {loading ? (
                <TableRowsLoader rowsNum={5} colsNum={6} />
              ) : (
                <>
                  {soldHistories?.map((row, idx) => {
                    const date = new Date(row.createdAt)
                    const formattedDate = date.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })

                    return (
                      <StyledTableRow key={idx}>
                        <StyledTimeCell>{formattedDate}</StyledTimeCell>
                        <StyledTableCell
                          align="left"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            gap: 2,
                            '&:hover .cover-image': {
                              display: 'block',
                            },
                          }}
                        >
                          <Box
                            sx={{
                              position: 'relative',
                              width: '48px',
                              height: '48px',
                              cursor: 'pointer',
                            }}
                          >
                            <Box
                              sx={{
                                position: 'relative',
                                overflow: 'hidden',
                                outline: 'none',
                                transform: 'translateZ(0px)',
                                backgroundColor: 'unset',
                                borderRadius: '4px',
                                pointerEvents: 'auto',
                              }}
                            >
                              <CardMedia
                                component={'img'}
                                image={row.imagePath}
                                sx={{
                                  width: '48px',
                                  height: '48px',
                                  '&:hover': {
                                    transform: 'scale(1.08)',
                                  },
                                }}
                              />
                              <Box
                                className="cover-image"
                                sx={{
                                  display: 'none',
                                  position: 'absolute',
                                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                  borderRadius: '4px',
                                  top: 0,
                                  left: 0,
                                  width: '100%',
                                  height: '100%',
                                }}
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%',
                                    height: '100%',
                                  }}
                                >
                                  <IconButton
                                    className="play-button"
                                    onClick={() => playHandler(row)}
                                  >
                                    {isPlaying &&
                                    row.listedId === globalMusic.listedId ? (
                                      <PauseIcon
                                        sx={{
                                          fontSize: 18,
                                          color: 'white',
                                        }}
                                      />
                                    ) : (
                                      <PlayArrowIcon
                                        sx={{
                                          fontSize: 18,
                                          color: 'white',
                                        }}
                                      />
                                    )}
                                  </IconButton>
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: 144,
                            }}
                          >
                            {row.licenseName}
                          </Typography>
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {licensingTypeList[row.licensingType].label}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          ${row.price.toLocaleString()}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.accessLevel === AccessLevel.NonExclusive &&
                            'Non-exclusive'}
                          {row.accessLevel === AccessLevel.Exclusive &&
                            'Exclusive'}
                          {(row.accessLevel === AccessLevel.Both ||
                            row.accessLevel === AccessLevel.None) &&
                            ''}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Box display={'flex'} alignItems={'center'} gap={1}>
                            <Typography
                              variant="body2"
                              color={theme.palette.grey[200]}
                            >
                              {row.userName}
                            </Typography>
                          </Box>
                        </StyledTableCell>
                      </StyledTableRow>
                    )
                  })}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </BootstrapDialog>
  )
}
