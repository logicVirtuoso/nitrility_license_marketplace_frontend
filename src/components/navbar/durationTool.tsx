import { useState, useRef } from 'react'
import {
  Select,
  styled,
  OutlinedInput,
  FormControl,
  InputLabel,
  Button,
  Box,
  Typography,
  Divider,
  InputBase,
  useTheme,
} from '@mui/material'

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    height: '38px',
  },
  '& .MuiInputBase-input': {
    fontSize: '14px',
  },
}))

const DurationInput = styled(OutlinedInput)(({ theme }) => ({
  '& .MuiOutlinedInput-input': {
    padding: '16.5px 6px',
    textAlign: 'center',
  },
  '& .MuiInputBase-input::-webkit-outer-spin-button': {
    WebkitAppearance: 'none',
    margin: '0',
  },
  '& .MuiInputBase-input::-webkit-inner-spin-button': {
    WebkitAppearance: 'none',
    margin: '0',
  },
}))

function DurationTool(props) {
  const {
    setInsideClicked,
    minMins,
    minSecs,
    maxMins,
    maxSecs,
    setMaxMins,
    setMaxSecs,
    setMinMins,
    setMinSecs,
    hanldeApply,
  } = props
  const theme = useTheme()
  const [selectOpen, setSelectOpen] = useState(false)
  const minMinsRef = useRef(null)
  const minSecsRef = useRef(null)
  const maxMinsRef = useRef(null)
  const maxSecsRef = useRef(null)

  const handleMinMinsChange = (e) => {
    const value = e.target.value
    if (value === '' || (value >= 0 && value <= 59)) {
      setMinMins(value)
    }
    setTimeout(() => {
      minMinsRef.current.focus()
    }, 0)
  }

  const hanldeMinSecsChange = (e) => {
    const value = e.target.value
    if (value === '' || (value >= 0 && value <= 59)) {
      setMinSecs(value)
    }
    setTimeout(() => {
      minSecsRef.current.focus()
    }, 0)
  }

  const hanldeMaxMinsChange = (e) => {
    const value = e.target.value
    if (value === '' || (value >= 0 && value <= 59)) {
      setMaxMins(value)
    }
    setTimeout(() => {
      maxMinsRef.current.focus()
    }, 0)
  }

  const hanldeMaxSecsChange = (e) => {
    const value = e.target.value
    if (value === '' || (value >= 0 && value <= 59)) {
      setMaxSecs(value)
    }
    setTimeout(() => {
      maxSecsRef.current.focus()
    }, 0)
  }

  const handleOpenSelect = (e) => {
    setSelectOpen(true)
    setInsideClicked(true)
    e.stopPropagation() // Prevent event from propagating further
  }

  const handleCloseSelect = (e) => {
    setSelectOpen(false)
    setInsideClicked(false)
    e.stopPropagation() // Prevent event from propagating further
  }

  const StopPropagation = ({ children }) => (
    <div
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      {children}
    </div>
  )

  return (
    <FormControl
      sx={{
        width: '104px',
        background: theme.palette.grey[600],
        height: '38px',
        fontSize: '12px',
        fontWeight: '400',
        borderRadius: '6px',
        '& .MuiInputLabel-root.Mui-focused': {
          color: theme.palette.grey[400],
        },
      }}
    >
      <InputLabel
        shrink={false}
        sx={{
          position: 'absolute',
          color: theme.palette.grey[400],
          transformOrigin: 'top left',
          fontSize: '14px',
          lineHeight: '1',
          transform: 'none',
          marginTop: '12px',
          marginLeft: 'auto',
          marginRight: 'auto',
          left: 0,
          right: 0,
        }}
      >
        Duration
      </InputLabel>
      <Select
        open={selectOpen}
        onOpen={handleOpenSelect}
        onClose={handleCloseSelect}
        input={<BootstrapInput />}
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
          PaperProps: {
            sx: {
              marginTop: '10px',
              '& ul': {
                padding: '12px',
              },
              '& .MuiMenuItem-root': {
                padding: 0,
              },
            },
          },
        }}
      >
        <StopPropagation>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '100%',
              alignItems: 'flex-end',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                  marginRight: '14px',
                  color: theme.palette.text.secondary,
                }}
              >
                Min.
              </Typography>
              <DurationInput
                inputRef={minMinsRef}
                type="number"
                inputProps={{
                  min: 0,
                  max: 59,
                }}
                sx={{
                  background: '#1F1F1F',
                  width: '40px',
                  height: '32px',
                }}
                value={minMins}
                onChange={handleMinMinsChange}
              />
              <Typography
                sx={{
                  fontSize: '14px',
                  marginRight: '14px',
                  marginLeft: '4px',
                  color: theme.palette.text.secondary,
                }}
              >
                mins
              </Typography>
              <DurationInput
                inputRef={minSecsRef}
                type="number"
                inputProps={{
                  min: 0,
                  max: 59,
                }}
                sx={{
                  background: '#1F1F1F',
                  width: '40px',
                  height: '32px',
                }}
                value={minSecs}
                onChange={hanldeMinSecsChange}
              />
              <Typography
                sx={{
                  fontSize: '14px',
                  marginRight: '14px',
                  marginLeft: '4px',
                  color: theme.palette.text.secondary,
                }}
              >
                sec
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                  marginRight: '14px',
                  color: theme.palette.text.secondary,
                }}
              >
                Max.
              </Typography>
              <DurationInput
                inputRef={maxMinsRef}
                type="number"
                inputProps={{
                  min: 0,
                  max: 59,
                }}
                sx={{
                  background: '#1F1F1F',
                  width: '40px',
                  height: '32px',
                }}
                value={maxMins}
                onChange={hanldeMaxMinsChange}
              />
              <Typography
                sx={{
                  fontSize: '14px',
                  marginRight: '14px',
                  marginLeft: '4px',
                  color: theme.palette.text.secondary,
                }}
              >
                mins
              </Typography>
              <DurationInput
                inputRef={maxSecsRef}
                type="number"
                inputProps={{
                  min: 0,
                  max: 59,
                }}
                sx={{
                  background: theme.palette.grey[700],
                  width: '40px',
                  height: '32px',
                }}
                value={maxSecs}
                onChange={hanldeMaxSecsChange}
              />
              <Typography
                sx={{
                  fontSize: '14px',
                  marginRight: '14px',
                  marginLeft: '4px',
                  fontWeight: '400',
                }}
              >
                sec
              </Typography>
            </Box>
            <Divider sx={{ width: '100%' }} />
            <Button
              sx={{
                height: '30px',
                borderRadius: '6px',
                textTransform: 'none',
                fontWeight: '700',
                fontSize: '14px',
              }}
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => {
                setSelectOpen(false)
                hanldeApply()
              }}
            >
              Apply
            </Button>
          </Box>
        </StopPropagation>
      </Select>
    </FormControl>
  )
}

export default DurationTool
