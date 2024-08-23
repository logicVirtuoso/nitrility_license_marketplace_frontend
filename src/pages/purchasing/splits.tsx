import { Box, CardMedia, Divider, Typography, useTheme } from '@mui/material'
import { CommonLicenseDataIF, TemplateDataIF } from 'src/interface'
import AvatarImage from '../../assets/User-avatar.svg'

interface Props {
  commonLicenseData: CommonLicenseDataIF
  syncData: TemplateDataIF
}

export default function Splits({ commonLicenseData, syncData }: Props) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        bgcolor: theme.palette.secondary.main,
        borderRadius: 3,
      }}
    >
      <Box display={'flex'} flexDirection={'column'} gap={0.5} p={2}>
        <Typography variant="h5" color={theme.palette.text.primary}>
          Credits & Splits
        </Typography>
        <Typography color={theme.palette.text.secondary} variant="subtitle1">
          View credits and collaborator splits of this release.
        </Typography>
      </Box>

      <Divider />

      <Box display={'flex'} flexDirection={'column'} gap={0.5} p={2}>
        <Typography variant="h5" color={theme.palette.text.primary}>
          Performed by:
        </Typography>
        <Box display={'flex'} alignItems={'center'}>
          <Box display={'flex'} alignItems={'center'} gap={1}>
            <CardMedia
              image={commonLicenseData.avatarPath}
              component={'img'}
              sx={{
                width: 18,
                borderRadius: '100%',
                objectFit: 'cover',
              }}
            />

            <Typography
              color={theme.palette.text.secondary}
              variant="subtitle1"
            >
              {`By: ${commonLicenseData.sellerName}`}
            </Typography>
          </Box>
          <Typography sx={{ marginLeft: 'auto' }}>{`${
            syncData.revenues.find(
              (item) => item.sellerId === commonLicenseData.sellerId,
            ).percentage
          }%`}</Typography>
        </Box>

        {syncData.revenues?.length > 1 && (
          <>
            <Divider />
            <Typography variant="h5" color={theme.palette.text.primary}>
              Created by:
            </Typography>
          </>
        )}

        <Box display={'flex'} flexDirection={'column'} gap={2}>
          {syncData.revenues
            ?.filter((art) => art.sellerId !== commonLicenseData.sellerId)
            .map((art, idx) => {
              return (
                <Box display={'flex'} alignItems={'center'} gap={1} key={idx}>
                  <CardMedia
                    image={AvatarImage}
                    component={'img'}
                    sx={{
                      width: 18,
                      borderRadius: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <Typography
                    color={theme.palette.text.secondary}
                    variant="subtitle1"
                  >
                    {`By: ${art.sellerName}`}
                  </Typography>
                </Box>
              )
            })}
        </Box>
      </Box>
    </Box>
  )
}
