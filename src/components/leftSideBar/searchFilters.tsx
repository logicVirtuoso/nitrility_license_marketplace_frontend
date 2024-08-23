import React from 'react'
import {
  Autocomplete,
  Box,
  Checkbox,
  Collapse,
  FormControlLabel,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
  styled,
  useTheme,
} from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Slider, { SliderValueLabelProps } from '@mui/material/Slider'
import IOSSlider from '../IOSSlider'
import { SearchFilterIF } from 'interface'
import { SearchFiltersContext } from 'src/context/searchFilters'

const FilterBlock = styled(Box)(({ theme }) => ({
  marginBottom: '10px',
  display: 'flex',
  flexDirection: 'column',
}))

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  padding: '0px 0px',
  borderRadius: '4px',
}))

interface FilterDrawerProps {
  handler: (any) => void
}

function ValueLabelComponent(props: SliderValueLabelProps) {
  const { children, value } = props

  return (
    <Tooltip enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  )
}

export default function SearchFiltersFC({ handler }: FilterDrawerProps) {
  const theme = useTheme()
  const [searchFilters, setSearchFilters] =
    React.useContext(SearchFiltersContext)
  const [openSongProperty, setOpenSongProperty] = React.useState<boolean>(false)

  const songPropertyHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
    label: string,
  ) => {
    const ipTemp = searchFilters.songProperties.map((item) => {
      if (item.label === label) {
        return { ...item, value: event.target.checked }
      } else {
        return item
      }
    })
    setSearchFilters((prevState) => ({
      ...prevState,
      songProperties: ipTemp,
    }))
    handler({ ...searchFilters, songProperties: ipTemp })
  }

  const lengthHandler = (event: Event, newValue: number[]) => {
    setSearchFilters((prevState) => ({ ...prevState, length: newValue }))
    handler({ ...searchFilters, length: newValue })
  }

  const tempoHandler = (event: Event, newValue: number[]) => {
    setSearchFilters((prevState) => ({ ...prevState, tempo: newValue }))
    handler({ ...searchFilters, tempo: newValue })
  }

  const songPropertyCollapseHandler = () => {
    setOpenSongProperty(!openSongProperty)
  }

  return (
    <React.Fragment>
      <Box sx={{ padding: ' 0px 20px' }}>
        <Typography
          sx={{
            fontFamily: 'var(--font-base)',
            color: theme.palette.secondary.dark,
            textTransform: 'uppercase',
            fontSize: '14px',
            lineHeight: '18px',
            py: '8px',
          }}
        >
          Search Filters
        </Typography>
        <Box
          sx={{
            maxHeight: '550px',
            overflow: 'hidden',
          }}
        >
          {/* Song Properties */}
          <FilterBlock>
            <StyledListItemButton onClick={songPropertyCollapseHandler}>
              <ListItemText primary="Song Properties" />
              {openSongProperty ? <ExpandLess /> : <ExpandMore />}
            </StyledListItemButton>
            <Collapse in={openSongProperty} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {searchFilters.songProperties?.map((item, idx) => {
                  return (
                    <ListItemButton sx={{ py: 0 }} key={idx}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={item.value}
                            onChange={(e) => songPropertyHandler(e, item.label)}
                          />
                        }
                        label={item.label}
                      />
                    </ListItemButton>
                  )
                })}
              </List>
            </Collapse>
          </FilterBlock>

          {/* Length */}
          <FilterBlock sx={{ paddingRight: '10px', mt: 3 }}>
            <Typography variant="h6">Length(Seconds)</Typography>
            <IOSSlider
              min={0}
              max={300}
              value={searchFilters.length}
              slots={{
                valueLabel: ValueLabelComponent,
              }}
              getAriaLabel={() => 'Length range'}
              sx={{ marginTop: '10px' }}
              onChange={lengthHandler}
              valueLabelDisplay="on"
            />
          </FilterBlock>

          {/* Tempo */}
          <FilterBlock sx={{ paddingRight: '10px', mt: 3 }}>
            <Typography variant="h6">Tempo(BPM)</Typography>
            <IOSSlider
              min={0}
              max={300}
              value={searchFilters.tempo}
              slots={{
                valueLabel: ValueLabelComponent,
              }}
              getAriaLabel={() => 'Tempo range'}
              sx={{ marginTop: '10px' }}
              onChange={tempoHandler}
              valueLabelDisplay="on"
            />
          </FilterBlock>
        </Box>
      </Box>
    </React.Fragment>
  )
}
