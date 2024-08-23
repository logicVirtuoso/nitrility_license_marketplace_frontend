import { Box, Typography, useTheme } from '@mui/material'
import { LicensingTypes } from 'src/interface'

const definitions = [
  {
    type: LicensingTypes.Creator,
    title: 'Creator License Definition',
    description:
      'Grants license holders permission to synchronize music with visual content in social media content. This license will last indefinitely for any buyer and will apply only to the specific video it is licensed for. ',
  },
  {
    type: LicensingTypes.Advertisement,
    title: 'Advertisement License Definition',
    description:
      'Grants license holders permission to synchronize music with visual content in an advertisement. This license will last indefinitely for any buyer and will apply only to the specific AD it is licensed for. ',
  },
  {
    type: LicensingTypes.TvSeries,
    title: 'TV Series License Definition',
    description:
      'Grants license holders permission to synchronize music with visual content in a single episode of a TV Series. This license will last indefinitely for any buyer and will apply only to the specific episode it is licensed for. ',
  },
  {
    type: LicensingTypes.Movie,
    title: 'Movie License Definition',
    description:
      'Grants license holders permission to synchronize music with visual content in film productions. This license will last indefinitely for any buyer and will apply only to the specific movie it is licensed for. ',
  },
  {
    type: LicensingTypes.VideoGame,
    title: 'Video Game License Definition',
    description:
      'Grants license holders permission to synchronize music with visual content in a video game. This license will last indefinitely for any buyer and will apply only to the specific game it is licensed for. ',
  },
  {
    type: LicensingTypes.AiTraining,
    title: 'Ai Training License Definition',
    description:
      'Grants license holders permission to synchronize music with visual content in a video game. This license will last indefinitely for any buyer and will apply only to the specific game it is licensed for. ',
  },
]

interface Props {
  licensingType: LicensingTypes
}

export default function OfferDescription({ licensingType }: Props) {
  const theme = useTheme()
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      border={`1px solid ${theme.palette.grey[600]}`}
      borderRadius={2.5}
      p={2}
      my={3}
      gap={1}
    >
      <Typography
        fontSize={14}
        fontWeight={400}
        color={theme.palette.grey[400]}
      >
        {definitions[licensingType].title}
      </Typography>
      <Typography
        bgcolor={theme.palette.grey[700]}
        py={1}
        px={1.5}
        fontSize={14}
        fontWeight={400}
        color={theme.palette.grey[400]}
      >
        {definitions[licensingType].description}
      </Typography>
    </Box>
  )
}
