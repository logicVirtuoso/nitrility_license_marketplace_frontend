import {
  Box,
  Typography,
  MenuItem,
  InputAdornment,
  useTheme,
  CardMedia,
} from '@mui/material'
import { ReactSVG } from 'react-svg'
import IconSearch from 'src/assets/search.svg'
import IconGridView from 'src/assets/gridview.svg'
import IconListView from 'src/assets/listview.svg'
import PrimaryButton from '../buttons/primary-button'
import { ViewMode } from 'src/interface'
import { StyledOutlinedInputFC, StyledSelectFC } from '../styledInput'
import { ReactNode } from 'react'

interface Props {
  filterElement?: ReactNode
  totalAmount: string
  selected: string
  options: Array<any>
  keyword: string
  searchPlaceholder: string
  viewMode: ViewMode
  handleOptionChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  setViewMode: (viewMode: ViewMode) => void
  handleSearch: (keyword: string) => void
}

export default function ViewModeTools({
  filterElement = null,
  totalAmount,
  selected,
  options,
  keyword,
  viewMode,
  searchPlaceholder,
  handleOptionChange,
  setViewMode,
  handleSearch,
}: Props) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '32px',
        marginBottom: '24px',
      }}
    >
      {filterElement ? (
        filterElement
      ) : (
        <Typography
          sx={{
            fontSize: '14px',
            lineHeight: '17.36px',
            fontWeight: '500',
            color: theme.palette.text.secondary,
            fontFamily: 'var(--font-base)',
          }}
        >
          {totalAmount}
        </Typography>
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <Typography
          sx={{
            lineHeight: '24px',
            fontSize: '14px',
            fontWeight: '400',
            color: theme.palette.text.secondary,
            whiteSpace: 'nowrap',
          }}
        >
          Sort by
        </Typography>
        <StyledSelectFC
          select
          value={selected}
          onChange={handleOptionChange}
          sx={{
            width: '136px',
            '& .MuiPaper-root .MuiList-root': {
              pt: 0,
              pb: 0,
            },
          }}
        >
          {options.map((option, idx) => {
            return (
              <MenuItem
                key={idx}
                value={option.label}
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '14px',
                  fontFamily: '400',
                }}
              >
                {option.label}
              </MenuItem>
            )
          })}
        </StyledSelectFC>
        <StyledOutlinedInputFC
          fullWidth
          type="text"
          value={keyword}
          placeholder={searchPlaceholder}
          onChange={(e) => {
            handleSearch(e.target.value)
          }}
          startAdornment={
            <InputAdornment position="start">
              <CardMedia
                component={'img'}
                image={IconSearch}
                sx={{
                  width: 16,
                  height: 16,
                }}
              />
            </InputAdornment>
          }
          sx={{ maxWidth: 210 }}
        />
        <Box display={'flex'} alignItems={'center'} gap={1}>
          <PrimaryButton
            sx={{
              width: 42,
              height: 42,
              background:
                viewMode === ViewMode.GridView
                  ? theme.palette.success.light
                  : theme.palette.grey[600],
              '&.MuiButtonBase-root svg path': {
                stroke:
                  viewMode === ViewMode.GridView
                    ? theme.palette.grey[700]
                    : theme.palette.grey[400],
              },
              '&.MuiButtonBase-root:hover svg path': {
                stroke: theme.palette.grey[700],
              },
            }}
            onClick={() => setViewMode(ViewMode.GridView)}
          >
            <ReactSVG src={IconGridView} className="svg-icon" />
          </PrimaryButton>

          <PrimaryButton
            sx={{
              width: 42,
              height: 42,
              background:
                viewMode === ViewMode.ListView
                  ? theme.palette.success.light
                  : theme.palette.grey[600],
              '&.MuiButtonBase-root svg path': {
                stroke:
                  viewMode === ViewMode.ListView
                    ? theme.palette.grey[700]
                    : theme.palette.grey[400],
              },
              '&.MuiButtonBase-root:hover svg path': {
                stroke: theme.palette.grey[700],
              },
            }}
            onClick={() => setViewMode(ViewMode.ListView)}
          >
            <ReactSVG src={IconListView} className="svg-icon" />
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  )
}
