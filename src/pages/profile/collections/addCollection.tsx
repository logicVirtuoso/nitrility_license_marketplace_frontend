import { Box, CardMedia, Typography, useTheme } from '@mui/material'
import AddCollectionDarkIcon from 'src/assets/images/add_collection_dark.png'

interface Props {
  handler: () => void
}

export default function AddCollection({ handler }: Props) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        p: 1,
        borderRadius: 3,
        width: '100%',
        height: '100%',
        border: `1px dashed ${theme.palette.grey[600]}`,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          width: '100%',
          height: 'calc(100% - 86px)',
          border: `1px dashed ${theme.palette.grey[600]}`,
          cursor: 'pointer',
        }}
        onClick={() => handler()}
      >
        <CardMedia
          image={AddCollectionDarkIcon}
          component={'img'}
          sx={{
            width: 40,
          }}
        />
      </Box>

      <Typography
        mt={1.5}
        fontFamily={'var(--font-bold)'}
        fontSize={16}
        color={theme.palette.containerSecondary.contrastText}
        align="left"
      >
        New collection
      </Typography>

      <Typography
        variant="subtitle1"
        color={theme.palette.text.secondary}
        align="left"
      >
        Create a collection of licenses to show to viewers
      </Typography>
    </Box>
  )
}
