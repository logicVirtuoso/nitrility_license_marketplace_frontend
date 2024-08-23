import {
  Box,
  Typography,
  useTheme,
  Input,
  Grid,
  FormControl,
  RadioGroup,
  FormControlLabel,
  InputAdornment,
  TextField,
  CardMedia,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import EditDarkIcon from 'src/assets/images/edit_dark.svg'
import { useState } from 'react'
import StrokeDarkIcon from 'src/assets/images/stroke_dark.svg'
import { DatePicker, DesktopTimePicker } from '@mui/x-date-pickers'
import { StyledOutlinedInputFC } from '../styledInput'
import BpRadio from '../StyledRadio'
import BpCheckbox from '../StyledCheckbox'
import { DiscountCodeIF, DiscountTypeEN } from 'src/interface'
import dayjs from 'dayjs'

interface Props {
  discountCode: DiscountCodeIF
  setDiscountCode: (discountCode: DiscountCodeIF) => void
  setInActive: (active: boolean) => void
}

const DiscountCard = ({
  discountCode,
  setDiscountCode,
  setInActive,
}: Props) => {
  console.log('discountCode', discountCode)
  const theme = useTheme()
  const [editable, setEditable] = useState<boolean>(false)

  const checkDiscountValidation = (curDiscountCode) => {
    if (discountCode.name !== '' && discountCode.code !== '') {
      if (discountCode.discountType === DiscountTypeEN.FixedAmountOff) {
        if (discountCode.fixedAmount !== 0) {
          const tempDiscountCode = { ...curDiscountCode, actived: true }
          setDiscountCode(tempDiscountCode)
        } else {
          setDiscountCode(curDiscountCode)
        }
      } else {
        if (discountCode.percentage !== 0) {
          const tempDiscountCode = { ...curDiscountCode, actived: true }
          setDiscountCode(tempDiscountCode)
        } else {
          setDiscountCode(curDiscountCode)
        }
      }
    } else {
      setDiscountCode(curDiscountCode)
    }
  }

  const discountNameHandler = (newName: string) => {
    const updatedDiscountCode = { ...discountCode }
    updatedDiscountCode.name = newName
    checkDiscountValidation(updatedDiscountCode)
  }

  const discountCodeHandler = (newCode: string) => {
    const updatedDiscountCode = { ...discountCode }
    updatedDiscountCode.code = newCode
    checkDiscountValidation(updatedDiscountCode)
  }

  const percentageHandler = (newPercentage: number) => {
    const updatedDiscountCode = { ...discountCode }
    updatedDiscountCode.percentage = newPercentage
    checkDiscountValidation(updatedDiscountCode)
  }

  const settingValidTimeHandler = () => {
    const updatedDiscountCode = { ...discountCode }
    updatedDiscountCode.infinite = !updatedDiscountCode.infinite
    checkDiscountValidation(updatedDiscountCode)
  }

  const dateHandler = (newTime) => {
    const date1 = new Date(discountCode.endTime)
    const date2 = new Date(newTime)

    const combinedDate = new Date(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate(),
      date1.getHours(),
      date1.getMinutes(),
      date1.getSeconds(),
      date1.getMilliseconds(),
    )

    const updatedDiscountCode = { ...discountCode }
    updatedDiscountCode.endTime = dayjs(combinedDate).valueOf()
    setDiscountCode(updatedDiscountCode)
  }

  const timeHandler = (newTime) => {
    const date1 = new Date(discountCode.endTime)
    const date2 = new Date(newTime)

    const combinedDate = new Date(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate(),
      date2.getHours(),
      date2.getMinutes(),
      date2.getSeconds(),
      date2.getMilliseconds(),
    )
    const updatedDiscountCode = { ...discountCode }
    updatedDiscountCode.endTime = dayjs(combinedDate).valueOf()
    setDiscountCode(updatedDiscountCode)
  }

  const removeHandler = () => {
    setInActive(false)
    setDiscountCode({
      name: 'Untitled Discount',
      code: '',
      discountType: DiscountTypeEN.PercentageOff,
      percentage: 0,
      fixedAmount: 0,
      infinite: false,
      endTime: Date.now(),
      actived: false,
    })
  }

  const handleChange = (event) => {
    setDiscountCode({
      ...discountCode,
      discountType: event.target.value as DiscountTypeEN.PercentageOff,
    })
  }

  return (
    <Box
      sx={{
        width: '100%',
        p: 1.5,
        borderRadius: 2.5,
        border: `1px solid ${theme.palette.grey[600]}`,
      }}
    >
      <Box display={'flex'} flexDirection={'column'} gap={1.5}>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Box display={'flex'} alignItems={'cener'} gap={1.5}>
            <IconButton onClick={() => setEditable(true)}>
              <CardMedia component={'img'} image={EditDarkIcon} />
            </IconButton>
            {editable ? (
              <Input
                placeholder="Write discount name"
                inputProps={{
                  'aria-label': 'description',
                  maxLength: 20,
                }}
                onBlur={() => {
                  setEditable(false)
                }}
                onChange={(e) => discountNameHandler(e.target.value)}
                value={discountCode.name}
                sx={{
                  width: '200px',
                  padding: theme.spacing(0, 1),
                }}
              />
            ) : (
              <Box
                sx={{
                  fontFamily: 'var(--font-medium)',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {discountCode.name}
              </Box>
            )}
          </Box>

          <IconButton onClick={removeHandler}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box px={4.5} display={'flex'} flexDirection={'column'} gap={2}>
          <Grid container>
            <Grid item xs={12} md={6}>
              <Box display={'flex'} flexDirection={'column'} gap={0.5}>
                <Box display={'flex'} alignItems={'center'} gap={0.5}>
                  <Typography
                    variant="subtitle1"
                    color={theme.palette.text.secondary}
                  >
                    Discount code
                  </Typography>
                  <CardMedia
                    component={'img'}
                    image={StrokeDarkIcon}
                    sx={{ width: 12, objectFit: 'cover' }}
                  />
                </Box>
                <StyledOutlinedInputFC
                  fullWidth
                  type="text"
                  value={discountCode.code}
                  name="discountCode"
                  onChange={(e) => discountCodeHandler(e.target.value)}
                />
              </Box>
            </Grid>
          </Grid>

          <Box display={'flex'} flexDirection={'column'} gap={1}>
            <Typography fontFamily={'var(--font-semi-bold)'} fontSize={'16px'}>
              Discount amount
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box display={'flex'} flexDirection={'column'} gap={1}>
                  <FormControl>
                    <Box display={'flex'} alignItems={'center'} gap={0.5}>
                      <Typography
                        variant="subtitle1"
                        color={theme.palette.text.secondary}
                      >
                        Discount type
                      </Typography>
                      <CardMedia
                        component={'img'}
                        image={StrokeDarkIcon}
                        sx={{ width: 12, objectFit: 'cover' }}
                      />
                    </Box>
                    <RadioGroup
                      row
                      value={discountCode.discountType}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value={DiscountTypeEN.PercentageOff}
                        control={<BpRadio />}
                        label="Percentage off"
                      />
                      <FormControlLabel
                        value={DiscountTypeEN.FixedAmountOff}
                        control={<BpRadio />}
                        label="Fixed amount off"
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box display={'flex'} flexDirection={'column'} gap={1}>
                  <Typography
                    variant="subtitle1"
                    color={theme.palette.text.secondary}
                  >
                    Percentage deduction
                  </Typography>
                  <StyledOutlinedInputFC
                    type="number"
                    value={discountCode.percentage}
                    name="percentage"
                    onChange={(e) => percentageHandler(Number(e.target.value))}
                    endAdornment={
                      <InputAdornment position="end">%</InputAdornment>
                    }
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>

          <Box display={'flex'} flexDirection={'column'} gap={1}>
            <Typography fontFamily={'var(--font-semi-bold)'} fontSize={'16px'}>
              Valid until
            </Typography>

            <FormControlLabel
              control={
                <BpCheckbox
                  checked={discountCode.infinite}
                  onChange={settingValidTimeHandler}
                />
              }
              label={'Set end date'}
              sx={{
                maxWidth: 200,
              }}
            />
          </Box>

          {discountCode.infinite && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box display={'flex'} flexDirection={'column'} gap={1}>
                  <Typography
                    variant="subtitle1"
                    color={theme.palette.text.secondary}
                  >
                    Discount end date
                  </Typography>
                  <DatePicker
                    value={discountCode.endTime}
                    onChange={dateHandler}
                    renderInput={(params) => {
                      return (
                        <TextField
                          fullWidth
                          label="expiredTime"
                          name="expiredTime"
                          inputProps={{
                            'aria-label': 'Without label',
                          }}
                          {...params}
                          sx={{
                            color: theme.palette.text.primary,
                            backgroundColor: theme.palette.grey[600],
                            borderRadius: 2,
                            '& .MuiInputBase-root': {
                              height: 42,
                            },
                            '& fieldset': {
                              borderRadius: 2,
                              outline: 'none',
                              border: 'none',
                            },
                          }}
                        />
                      )
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box display={'flex'} flexDirection={'column'} gap={1}>
                  <Typography
                    variant="subtitle1"
                    color={theme.palette.text.secondary}
                  >
                    End Time
                  </Typography>
                  <DesktopTimePicker
                    value={discountCode.endTime}
                    onChange={timeHandler}
                    renderInput={(params) => {
                      return (
                        <TextField
                          fullWidth
                          label="endDate"
                          name="endDate"
                          inputProps={{
                            'aria-label': 'Without label',
                          }}
                          {...params}
                          sx={{
                            color: theme.palette.text.primary,
                            backgroundColor: theme.palette.grey[600],
                            borderRadius: 2,
                            '& .MuiInputBase-root': {
                              height: 42,
                            },
                            '& fieldset': {
                              borderRadius: 2,
                              outline: 'none',
                              border: 'none',
                            },
                          }}
                        />
                      )
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default DiscountCard
