import React, { useState } from 'react'
import {
  Select,
  MenuItem,
  Toolbar,
  TextField,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
} from '@mui/material'

function MyComponent() {
  const [selectedValues, setSelectedValues] = useState([])
  const [selectOpen, setSelectOpen] = useState(false)

  const handleSelectChange = (event) => {
    const {
      target: { value },
    } = event
    setSelectedValues(typeof value === 'string' ? value.split(',') : value)
  }

  const handleSelectOpen = () => {
    setSelectOpen(true)
  }

  const handleSelectClose = () => {
    // Keep the select open if the toolbar is being interacted with
    if (
      document.activeElement &&
      document.activeElement.closest('.MuiToolbar-root')
    ) {
      return
    }
    setSelectOpen(false)
  }

  return (
    <div>
      <FormControl variant="outlined" fullWidth>
        <InputLabel id="multiple-select-label">Select Options</InputLabel>
        <Select
          labelId="multiple-select-label"
          multiple
          open={selectOpen}
          onOpen={handleSelectOpen}
          onClose={handleSelectClose}
          value={selectedValues}
          onChange={handleSelectChange}
          input={
            <OutlinedInput id="select-multiple-chip" label="Select Options" />
          }
          renderValue={(selected) => (
            <div>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </div>
          )}
        >
          <MenuItem value="option1">Option 1</MenuItem>
          <MenuItem value="option2">Option 2</MenuItem>
          <MenuItem value="option3">Option 3</MenuItem>
        </Select>
      </FormControl>

      {selectOpen && (
        <Toolbar>
          <TextField
            label="Input 1"
            variant="outlined"
            style={{ marginRight: 8 }}
          />
          <TextField label="Input 2" variant="outlined" />
        </Toolbar>
      )}
    </div>
  )
}

export default MyComponent
