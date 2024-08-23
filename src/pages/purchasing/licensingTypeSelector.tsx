import {
  Box,
  CardMedia,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme,
} from '@mui/material'
import { LicensingTypes } from 'src/interface'
import MusicDarkIcon from 'src/assets/images/purchasing/music_dark.png'
import DotDarkIcon from 'src/assets/images/dot_dark.svg'

interface MediaSelectItemIF {
  item: {
    label: string
    type: LicensingTypes
    fLine: string
    sLine: string
  }
  isMenu?: boolean
}

const MediaSelectItem = ({ item, isMenu = true }: MediaSelectItemIF) => {
  const theme = useTheme()
  return (
    <Box display={'flex'} gap={1.5}>
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
        height={24}
      >
        {isMenu ? (
          <CardMedia
            component={'img'}
            image={DotDarkIcon}
            sx={{ width: 2, height: 2 }}
          />
        ) : (
          <CardMedia
            component={'img'}
            image={MusicDarkIcon}
            sx={{
              width: 18,
              height: 18,
            }}
          />
        )}
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
          <Typography color={theme.palette.text.secondary} fontSize={'14px'}>
            {item.fLine}
          </Typography>
          <Typography color={theme.palette.text.secondary} fontSize={'14px'}>
            {item.sLine}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

interface Props {
  licensingList: Array<any>
  licensingType: LicensingTypes
  setLicensingType: (licensingType: LicensingTypes) => void
}

export default function LicensingTypeSelector({
  licensingList,
  licensingType,
  setLicensingType,
}: Props) {
  const theme = useTheme()

  const licensingTypeHandler = (
    event: SelectChangeEvent<typeof licensingType>,
  ) => {
    setLicensingType(event.target.value as unknown as LicensingTypes)
  }

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        border: `1px solid ${theme.palette.grey[600]}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h5" color={theme.palette.text.secondary}>
        Select your license type
      </Typography>
      <Select
        displayEmpty
        value={licensingType}
        onChange={licensingTypeHandler}
        input={
          <OutlinedInput
            sx={{
              zIndex: 100,
              backgroundColor: theme.palette.secondary.main,
              borderRadius: 2.5,
              fontSize: '16px',
              '& .MuiOutlinedInput-input': {
                padding: 2,
              },
              '& fieldset': { border: 'none' },
            }}
          />
        }
        renderValue={(selected) => {
          if (selected === LicensingTypes.None) {
            return (
              <Box display="flex" gap={1.5}>
                <CardMedia
                  component={'img'}
                  image={MusicDarkIcon}
                  sx={{
                    width: 18,
                    height: 18,
                  }}
                />
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  justifyContent={'center'}
                  borderRadius={1.5}
                  gap={0.5}
                >
                  <Typography color={theme.palette.text.primary} variant="h5">
                    Select license type
                  </Typography>
                  <Typography
                    color={theme.palette.text.secondary}
                    fontSize={'14px'}
                  >
                    Each license has different usage rights for license holders
                    and implications
                  </Typography>
                </Box>
              </Box>
            )
          } else {
            const selectedItem = licensingList.find(
              (item) => item.type == selected,
            )
            return <MediaSelectItem item={selectedItem} isMenu={false} />
          }
        }}
        inputProps={{ 'aria-label': 'Without label' }}
      >
        {licensingList.map((item, idx) => {
          return (
            <MenuItem
              key={idx}
              value={item.type}
              sx={{
                p: 1.5,
                margin: '3px 6px',
                borderRadius: 2.5,
                '&:hover, &.Mui-selected:hover': {
                  bgcolor: theme.palette.secondary.main,
                },
              }}
            >
              <MediaSelectItem item={item} />
            </MenuItem>
          )
        })}
      </Select>
    </Box>
  )
}
