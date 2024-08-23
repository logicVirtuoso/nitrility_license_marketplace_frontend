import React, { useRef } from 'react'
import {
  Box,
  CardMedia,
  MenuItem,
  Typography,
  useTheme,
  SvgIcon,
} from '@mui/material'
import ArrowDarkIcon from 'src/assets/images/listing/arrow_dark.svg'
import { LicensingTypes, ListingStatusType, SigningDataIF } from 'src/interface'
import DotDarkIcon from 'src/assets/images/dot_dark.svg'
import { styled, alpha } from '@mui/material/styles'
import Menu, { MenuProps } from '@mui/material/Menu'
import { licensingTypeList } from 'src/config'

interface StyledMenuProps extends MenuProps {
  width?: string
}

const StyledMenu = styled((props: StyledMenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme, width }) => ({
  '& .MuiPaper-root': {
    backgroundColor: theme.palette.grey[600],
    borderRadius: 6,
    marginTop: theme.spacing(1),
    width: width,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
      '&:hover': {
        bgcolor: theme.palette.secondary.main,
      },
    },
  },
}))

interface SelectorType {
  type: LicensingTypes
  label: string
  fLine: string
  sLine: string
}

interface Props {
  active: boolean
  keyVal: number
  listingLicensingTypes: LicensingTypes[]
  selectedLicensingType: LicensingTypes
  handleChange: (licensingType: LicensingTypes, keyVal: number) => void
  handler: () => void
}

export default function StyledSelector({
  active,
  keyVal,
  listingLicensingTypes,
  selectedLicensingType,
  handleChange,
  handler,
}: Props) {
  const theme = useTheme()
  const ref = useRef(null)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [value, setValue] = React.useState<SelectorType>()
  const [loading, setLoading] = React.useState<boolean>(true)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const onChange = (event: React.MouseEvent<HTMLElement>) => {
    if (selectedLicensingType === LicensingTypes.None) {
      handler()
      setAnchorEl(event.currentTarget)
    } else {
      handler()
    }
  }

  React.useEffect(() => {
    setLoading(true)
    const selectedValue = licensingTypeList.find(
      (item) => item.type == selectedLicensingType,
    )
    if (selectedValue) {
      setValue(selectedValue)
    } else {
      setValue({
        type: LicensingTypes.None,
        label: 'Select license type',
        fLine:
          'Each license has different usage rights for license holders and implications',
        sLine: '',
      })
    }
    setLoading(false)
  }, [selectedLicensingType])

  return (
    <Box ref={ref} width={'100%'}>
      {!loading && (
        <>
          <Box
            display={'flex'}
            borderRadius={1.5}
            border={`1px solid ${theme.palette.grey[600]}`}
            width={'100%'}
            sx={{
              cursor: 'pointer',
              backgroundColor: active ? theme.palette.grey[600] : 'inherit',
            }}
          >
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              width={'100%'}
            >
              <Box
                display={'flex'}
                gap={1.5}
                padding={'12px 0px 12px 12px'}
                width={'100%'}
                onClick={onChange}
              >
                <SvgIcon
                  sx={{
                    width: 16,
                    height: 18,
                    fill: 'none',
                    mt: 0.5,
                  }}
                  viewBox="0 0 16 18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.5 8.25H4M5.5 11.25H4M10 5.25H4M13 7.875V5.1C13 3.83988 13 3.20982 12.7548 2.72852C12.539 2.30516 12.1948 1.96095 11.7715 1.74524C11.2902 1.5 10.6601 1.5 9.4 1.5H4.6C3.33988 1.5 2.70982 1.5 2.22852 1.74524C1.80516 1.96095 1.46095 2.30516 1.24524 2.72852C1 3.20982 1 3.83988 1 5.1V12.9C1 14.1601 1 14.7902 1.24524 15.2715C1.46095 15.6948 1.80516 16.039 2.22852 16.2548C2.70982 16.5 3.33988 16.5 4.6 16.5H6.625M14.5 16.5L13.375 15.375M14.125 13.5C14.125 14.9497 12.9497 16.125 11.5 16.125C10.0503 16.125 8.875 14.9497 8.875 13.5C8.875 12.0503 10.0503 10.875 11.5 10.875C12.9497 10.875 14.125 12.0503 14.125 13.5Z"
                    stroke={
                      selectedLicensingType === LicensingTypes.None
                        ? theme.palette.grey[500]
                        : theme.palette.grey[300]
                    }
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </SvgIcon>

                <Box display={'flex'} flexDirection={'column'}>
                  <Typography
                    color={theme.palette.text.primary}
                    fontFamily={'var(--font-medium)'}
                    fontSize={'16px'}
                    fontWeight={500}
                  >
                    {selectedLicensingType === LicensingTypes.None
                      ? 'Select license type'
                      : value.label}
                  </Typography>
                  {selectedLicensingType === LicensingTypes.None ? (
                    <Typography
                      color={theme.palette.text.secondary}
                      fontSize={'14px'}
                    >
                      Each license has different usage rights for license
                      holders and implications
                    </Typography>
                  ) : (
                    <Box display="flex" flexDirection={'column'}>
                      <Typography
                        color={theme.palette.text.secondary}
                        fontSize={'14px'}
                      >
                        {value.fLine}
                      </Typography>
                      <Typography
                        color={theme.palette.text.secondary}
                        fontSize={'14px'}
                      >
                        {value.sLine}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>

              <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
                onClick={handleClick}
                pr={1.5}
              >
                <CardMedia
                  component={'img'}
                  image={ArrowDarkIcon}
                  sx={{
                    width: 24,
                    height: 24,
                  }}
                />
              </Box>
            </Box>
          </Box>
          {listingLicensingTypes.length <= LicensingTypes.All && (
            <StyledMenu
              width={ref?.current?.offsetWidth}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              {licensingTypeList
                .filter((item) => !listingLicensingTypes.includes(item.type))
                .map((item, idx) => {
                  return (
                    <MenuItem
                      key={idx}
                      value={item.type}
                      sx={{
                        p: 1.5,
                        margin: '3px 6px',
                        borderRadius: 1.5,
                        '&:hover': {
                          bgcolor: theme.palette.secondary.main,
                        },
                      }}
                      onClick={() => {
                        handleChange(item.type, keyVal)
                        handleClose()
                      }}
                    >
                      <Box display={'flex'} gap={1.5}>
                        <Box
                          display={'flex'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          height={24}
                        >
                          <CardMedia
                            component={'img'}
                            image={DotDarkIcon}
                            sx={{ width: 4, height: 4 }}
                          />
                        </Box>
                        <Box
                          display={'flex'}
                          flexDirection={'column'}
                          justifyContent={'center'}
                          borderRadius={1.5}
                        >
                          <Typography
                            color={theme.palette.text.primary}
                            fontFamily={'var(--font-medium)'}
                            fontSize={'16px'}
                          >
                            {item.label}
                          </Typography>
                          <Box display="flex" flexDirection={'column'}>
                            <Typography
                              color={theme.palette.text.secondary}
                              fontSize={'14px'}
                            >
                              {item.fLine}
                            </Typography>
                            <Typography
                              color={theme.palette.text.secondary}
                              fontSize={'14px'}
                            >
                              {item.sLine}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </MenuItem>
                  )
                })}

              {selectedLicensingType !== LicensingTypes.None && (
                <MenuItem
                  value={LicensingTypes.All}
                  sx={{
                    p: 1.5,
                    margin: '3px 6px',
                    borderRadius: 1.5,
                    '&:hover': {
                      bgcolor: theme.palette.secondary.main,
                    },
                  }}
                  onClick={() => {
                    handleChange(LicensingTypes.All, keyVal)
                    handleClose()
                  }}
                >
                  <Box display={'flex'} gap={1.5}>
                    <Box
                      display={'flex'}
                      alignItems={'center'}
                      justifyContent={'center'}
                      height={24}
                    >
                      <CardMedia
                        component={'img'}
                        image={DotDarkIcon}
                        sx={{ width: 4, height: 4 }}
                      />
                    </Box>
                    <Box
                      display={'flex'}
                      flexDirection={'column'}
                      justifyContent={'center'}
                      borderRadius={1.5}
                    >
                      <Typography
                        color={theme.palette.text.primary}
                        fontFamily={'var(--font-medium)'}
                        fontSize={'16px'}
                      >
                        Remove Usecase
                      </Typography>
                    </Box>
                  </Box>
                </MenuItem>
              )}
            </StyledMenu>
          )}
        </>
      )}
    </Box>
  )
}
