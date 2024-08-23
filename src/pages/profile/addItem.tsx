import { Theme, useTheme } from '@mui/material/styles'
import { Box } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { SectionTypes } from '../../config'

interface AddItemProps {
  sectionId: number
  sectionType: SectionTypes
  handleClick: (sectionId: number, sectionType: SectionTypes) => void
}

export default function AddItem({
  sectionId,
  sectionType,
  handleClick,
}: AddItemProps) {
  const theme = useTheme()
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '6px',
        backgroundColor: theme.palette.secondary.light,
        '&:hover': {
          backgroundColor: theme.palette.secondary.main,
          '& svg': {
            color: '#fff',
          },
        },
        cursor: 'pointer',
        height: '100%',
      }}
      onClick={() => handleClick(sectionId, sectionType)}
    >
      <AddIcon fontSize="large" color="secondary" />
    </Box>
  )
}
