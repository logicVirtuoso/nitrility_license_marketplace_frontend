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
  CardMedia,
} from '@mui/material'
import { ReactSVG } from 'react-svg'
import StrokeDarkIcon from 'src/assets/images/stroke_dark.svg'
import { licensingTypeList } from 'src/config'

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    height: '38px',
  },
  '& .MuiInputBase-input': {
    fontSize: '14px',
  },
}))

interface Props {
  setInsideClicked: (clicked: boolean) => void
  licensingTypeFilter: Array<boolean>
  setLicensingTypeFilter: (licensingTypeFilter: Array<boolean>) => void
  hanldeApply: () => void
}

const TypeTool = ({
  setInsideClicked,
  licensingTypeFilter,
  setLicensingTypeFilter,
  hanldeApply,
}: Props) => {
  const [selectOpen, setSelectOpen] = useState(false)
  const [trueCount, setTrueCount] = useState(0)
  const theme = useTheme()

  useEffect(() => {
    const cnt = licensingTypeFilter.filter(Boolean).length
    setTrueCount(cnt)
  }, [licensingTypeFilter])

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
        Type
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
          {licensingTypeList.map((item, idx) => {
            return (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '18px',
                }}
              >
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
                      checked={licensingTypeFilter[idx]}
                      onChange={() => {
                        const newLicensingTypeFilter = [...licensingTypeFilter]
                        newLicensingTypeFilter[idx] =
                          !newLicensingTypeFilter[idx]
                        setLicensingTypeFilter(newLicensingTypeFilter)
                      }}
                    />
                  }
                  label={item.label}
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: '14px',
                      color: theme.palette.grey[200],
                    },
                  }}
                />
                <ReactSVG src={StrokeDarkIcon} className="svg-icon" />
              </Box>
            )
          })}
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
        </StopPropagation>
      </Select>
    </FormControl>
  )
}

export default TypeTool
