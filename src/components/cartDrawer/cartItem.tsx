import {
  Box,
  CardMedia,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  useTheme,
} from '@mui/material'
import {
  AccessLevel,
  CartLocalStorageIF,
  LicensingTypes,
  ListingStatusType,
  SigningDataIF,
  TemplateDataIF,
} from 'src/interface'
import DotDarkIcon from 'src/assets/images/dot_dark.svg'
import { licensingTypeList } from 'src/config'
import { useEffect, useState } from 'react'
import { styled, alpha } from '@mui/material/styles'
import Menu, { MenuProps } from '@mui/material/Menu'
import ArrowDarkIcon from 'src/assets/images/listing/arrow_dark.svg'
import TrashIcon from 'src/assets/images/trash_dark.png'
import { getSyncData } from 'src/utils/utils'
import useUtils from 'src/hooks/useUtils'

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light'
        ? 'rgb(55, 65, 81)'
        : theme.palette.grey[300],
    backgroundColor: theme.palette.grey[600],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      marginLeft: 4,
      marginRight: 4,
      borderRadius: 4,
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:hover': {
        backgroundColor: theme.palette.grey[700],
      },
    },
  },
}))

function LicenseAccessSelector({ avaialbleOptions, selectedInfo, onChange }) {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Box
        id="cart-selector"
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
        onClick={handleClick}
      >
        {selectedInfo.licensingType == LicensingTypes.None ? (
          <Box
            display={'flex'}
            bgcolor={theme.palette.grey[600]}
            borderRadius={14}
            padding={'0px 6px'}
            alignItems={'center'}
            gap={1}
          >
            <Typography color={theme.palette.text.secondary} fontSize={12}>
              Select license
            </Typography>{' '}
            <CardMedia
              component={'img'}
              image={ArrowDarkIcon}
              sx={{
                width: 8,
                height: 4,
              }}
            />
          </Box>
        ) : (
          <Typography
            sx={{
              color: theme.palette.success.light,
              borderRadius: 14,
              backgroundColor: theme.palette.grey[600],
              p: '2px 8px',
              fontSize: '12px',
              fontFamily: 'var(--font-medium)',
              lineHeight: '16px',
              width: 'fit-content',
              whiteSpace: 'nowrap',
            }}
          >
            {selectedInfo.label}
          </Typography>
        )}
      </Box>

      <StyledMenu
        MenuListProps={{
          'aria-labelledby': 'cart-selector',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {avaialbleOptions.map((option, idx) => (
          <MenuItem
            key={idx}
            onClick={() => {
              onChange({
                ...selectedInfo,
                label: option.label,
                accessLevel: option.accessLevel,
                licensingType: option.licensingType,
              })
              handleClose()
            }}
            sx={{ fontSize: 12 }}
          >
            {option.label}
          </MenuItem>
        ))}
      </StyledMenu>
    </>
  )
}

interface Props {
  cartedInfo: CartLocalStorageIF
  licenseData: any
  onChange: (cartInfo: CartLocalStorageIF) => void
  onDelete: (cartInfo: CartLocalStorageIF) => void
}

export default function CartItem({
  cartedInfo,
  licenseData,
  onChange,
  onDelete,
}: Props) {
  const theme = useTheme()
  const [avaialbleOptions, setAvailableOptions] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [templateData, setTemplateData] = useState<TemplateDataIF>()
  const [disableCounter, setDisableCounter] = useState<boolean>(false)
  const { etherToUsd } = useUtils()

  useEffect(() => {
    const temp = []
    const signingData: SigningDataIF = licenseData.signingData
    const addLicensingOptions = (typeKey, label, type) => {
      const typeData = signingData[typeKey]
      if (typeData.listed === ListingStatusType.Listed) {
        if (typeData.accessLevel === AccessLevel.Both) {
          temp.push({
            label: `${label} Nonexclusive`,
            licensingType: type,
            accessLevel: AccessLevel.NonExclusive,
          })
          temp.push({
            label: `${label} Exclusive`,
            licensingType: type,
            accessLevel: AccessLevel.Exclusive,
          })
        } else {
          temp.push({
            label: `${label} ${
              typeData.accessLevel === AccessLevel.Exclusive
                ? 'Exclusive'
                : 'Nonexclusive'
            }`,
            licensingType: type,
            accessLevel: typeData.accessLevel,
          })
        }
      }
    }

    licensingTypeList.forEach(({ key, label, type }) =>
      addLicensingOptions(key, label, type),
    )
    setAvailableOptions(temp)
  }, [licenseData])

  useEffect(() => {
    setTemplateData(
      getSyncData(cartedInfo.licensingType, licenseData.signingData),
    )
    if (cartedInfo.accessLevel === AccessLevel.Exclusive) {
      setDisableCounter(true)
    } else {
      setDisableCounter(false)
    }
  }, [cartedInfo, licenseData])

  const minusHandler = () => {
    if (!disableCounter) {
      onChange({
        ...cartedInfo,
        counts: Math.max(
          cartedInfo.counts > 1 ? cartedInfo.counts - 1 : cartedInfo.counts,
          1,
        ),
      })
    }
  }

  const plusHandler = () => {
    if (!disableCounter) {
      onChange({ ...cartedInfo, counts: cartedInfo.counts + 1 })
    }
  }

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      p={3}
      borderTop={`1px solid ${theme.palette.grey[600]}`}
    >
      <Box display={'flex'} alignItems={'center'} gap={2}>
        <CardMedia
          component={'img'}
          image={licenseData.imagePath}
          sx={{
            width: 64,
            height: 64,
            borderRadius: 2,
          }}
        />

        <Box display={'flex'} flexDirection={'column'}>
          <LicenseAccessSelector
            avaialbleOptions={avaialbleOptions}
            selectedInfo={cartedInfo}
            onChange={(data: CartLocalStorageIF) => onChange(data)}
          />

          <Typography
            fontSize={'16px'}
            fontFamily={'var(--font-bold)'}
            color={theme.palette.containerSecondary.contrastText}
          >
            {licenseData.licenseName}
          </Typography>

          <Box display={'flex'} alignItems={'center'} gap={1}>
            {licenseData.artists.map(
              (artist: { name: string }, index: number) => {
                return (
                  <Typography
                    sx={{
                      lineHeight: '16px',
                      fontSize: '12px',
                      color: theme.palette.text.secondary,
                      whiteSpace: 'nowrap',
                    }}
                    component={'span'}
                    key={index}
                  >
                    {`${artist.name} ${
                      licenseData.artists?.length == index + 1 ? '' : ', '
                    }`}
                  </Typography>
                )
              },
            )}

            <CardMedia
              component={'img'}
              image={DotDarkIcon}
              sx={{ width: 2, height: 2 }}
            />
            <Typography
              component={'span'}
              fontSize={12}
              color={theme.palette.text.secondary}
            >
              {licenseData.albumName}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
        mt={2}
      >
        {cartedInfo.licensingType != LicensingTypes.None && (
          <Box
            display={'flex'}
            alignItems={'center'}
            gap={0.5}
            width={126}
            height={34}
            borderRadius={1.5}
          >
            <Box
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              width={'100%'}
              height={'100%'}
              bgcolor={theme.palette.grey[600]}
              sx={{
                borderTopLeftRadius: 6,
                borderBottomLeftRadius: 6,
                cursor: 'pointer',
                color:
                  cartedInfo.accessLevel == AccessLevel.Exclusive
                    ? theme.palette.grey[500]
                    : theme.palette.text.primary,
              }}
              onClick={minusHandler}
            >
              -
            </Box>
            <Box
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              width={'100%'}
              height={'100%'}
              bgcolor={theme.palette.grey[600]}
            >
              {cartedInfo.counts}
            </Box>
            <Box
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              width={'100%'}
              height={'100%'}
              bgcolor={theme.palette.grey[600]}
              sx={{
                borderTopRightRadius: 6,
                borderBottomRightRadius: 6,
                cursor: 'pointer',
                color:
                  cartedInfo.accessLevel == AccessLevel.Exclusive
                    ? theme.palette.grey[500]
                    : theme.palette.text.primary,
              }}
              onClick={plusHandler}
            >
              +
            </Box>
          </Box>
        )}

        <Box display={'flex'} alignItems={'center'} gap={1} ml={'auto'}>
          {cartedInfo.licensingType != LicensingTypes.None && (
            <Typography
              color={theme.palette.containerSecondary.contrastText}
              fontSize={14}
            >
              $
              {etherToUsd(
                cartedInfo.accessLevel == AccessLevel.NonExclusive
                  ? templateData?.fPrice * cartedInfo.counts
                  : templateData?.sPrice * cartedInfo.counts,
              ).toLocaleString()}
            </Typography>
          )}
          <IconButton onClick={() => onDelete(cartedInfo)}>
            <CardMedia
              component={'img'}
              image={TrashIcon}
              sx={{
                width: 18,
                height: 18,
              }}
            />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}
