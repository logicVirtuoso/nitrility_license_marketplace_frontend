import { useEffect, useState } from 'react'
import {
  Select,
  styled,
  FormControl,
  FormControlLabel,
  InputLabel,
  Button,
  Box,
  Typography,
  Checkbox,
  Divider,
  useTheme,
  InputBase,
} from '@mui/material'

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    height: '38px',
  },
  '& .MuiInputBase-input': {
    fontSize: '14px',
  },
}))

const TempoTool = (props) => {
  const {
    setInsideClicked,
    slowChecked,
    setSlowChecked,
    moderateChecked,
    setModerateChecked,
    fastChecked,
    setFastChecked,
    veryFastChecked,
    setVeryFastChecked,
    hanldeApply,
  } = props
  const [selectOpen, setSelectOpen] = useState(false)
  const [trueCount, setTrueCount] = useState(0)
  const theme = useTheme()

  useEffect(() => {
    const cnt = [
      slowChecked,
      fastChecked,
      moderateChecked,
      veryFastChecked,
    ].filter(Boolean).length
    setTrueCount(cnt)
  }, [slowChecked, fastChecked, moderateChecked, veryFastChecked])

  const handleOpenSelect = (e) => {
    e.stopPropagation() // Prevent event from propagating further
    setSelectOpen(true)
    setInsideClicked(true)
  }

  const handleCloseSelect = (e) => {
    e.stopPropagation() // Prevent event from propagating further
    setSelectOpen(false)
    setInsideClicked(false)
  }

  const StopPropagation = ({ children }) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      {children}
    </Box>
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
          display: 'flex',
          gap: '4px',
        }}
      >
        Tempo
        {trueCount > 0 && (
          <Typography
            sx={{
              fontSize: '10px',
              background: '#FFF',
              color: '#1F1F1F',
              width: '16px',
              height: '16px',
              textAlign: 'center',
              borderRadius: '50%',
              lineHeight: '16.5px',
            }}
          >
            {trueCount}
          </Typography>
        )}
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
              borderRadius: '12px',
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
          <FormControlLabel
            control={
              <Checkbox
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: 20,
                    borderRadius: '4px',
                    color: theme.palette.success.light,
                  },
                }}
                checked={slowChecked}
                onChange={(e) => setSlowChecked(e.target.checked)}
              />
            }
            label="Slow (60 – 100 BPM)"
            sx={{
              height: '18px',
              '& .MuiFormControlLabel-label': {
                fontSize: '14px',
                color: theme.palette.grey[200],
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: 20,
                    borderRadius: '4px',
                    color: theme.palette.success.light,
                  },
                }}
                checked={moderateChecked}
                onChange={(e) => setModerateChecked(e.target.checked)}
              />
            }
            label="Moderate (110 – 140 BPM)"
            sx={{
              height: '18px',
              '& .MuiFormControlLabel-label': {
                fontSize: '14px',
                color: theme.palette.grey[200],
              },
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: 20,
                    borderRadius: '4px',
                    color: theme.palette.success.light,
                  },
                }}
                checked={fastChecked}
                onChange={(e) => setFastChecked(e.target.checked)}
              />
            }
            label="Fast (150 – 190 BPM)"
            sx={{
              height: '18px',
              '& .MuiFormControlLabel-label': {
                fontSize: '14px',
                color: theme.palette.grey[200],
              },
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                sx={{
                  '& .MuiSvgIcon-root': {
                    fontSize: 20,
                    borderRadius: '4px',
                    color: theme.palette.success.light,
                  },
                }}
                checked={veryFastChecked}
                onChange={(e) => setVeryFastChecked(e.target.checked)}
              />
            }
            label="Very Fast (200 – 240 BPM)"
            sx={{
              height: '18px',
              '& .MuiFormControlLabel-label': {
                fontSize: '14px',
                color: theme.palette.grey[200],
              },
            }}
          />
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
            onClick={(e) => {
              setSelectOpen(false)
              hanldeApply(e)
            }}
          >
            Apply
          </Button>
        </StopPropagation>
      </Select>
    </FormControl>
  )
}

export default TempoTool
