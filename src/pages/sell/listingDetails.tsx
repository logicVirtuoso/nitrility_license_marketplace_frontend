import { Box, CardMedia, Typography, useTheme } from '@mui/material'
import DotDarkIcon from 'src/assets/images/dot_dark.svg'
import { LicenseDataIF, LicensingTypes } from 'src/interface'
import { useTokenPrice } from 'src/hooks/useTokenPrice'
import { licensingTypeList } from 'src/config'
import React from 'react'

interface Props {
  listingLicensingTypes: Array<LicensingTypes>
  licenseData: LicenseDataIF
  fPrice: number
  sPrice: number
}

export default function ListingDetails({
  listingLicensingTypes,
  licenseData,
  fPrice,
  sPrice,
}: Props) {
  const theme = useTheme()
  const { tokenPrice } = useTokenPrice()

  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent={'space-between'}
      p={3}
    >
      <Box display={'flex'} alignItems={'center'} gap={2}>
        <CardMedia
          component={'img'}
          image={licenseData.imagePath}
          sx={{
            width: 80,
            height: 80,
            borderRadius: 2,
          }}
        />

        <Box display={'flex'} flexDirection={'column'} gap={0.5}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              gap: 0.5,
              maxWidth: 300,
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {listingLicensingTypes.length > 3 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '8px',
                  animation: 'marquee 5s linear infinite',
                  '@keyframes marquee': {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-100%)' },
                  },
                }}
              >
                {listingLicensingTypes?.map((licensingType, idx) => {
                  if (licensingType !== LicensingTypes.None) {
                    return (
                      <Typography
                        key={idx}
                        sx={{
                          color: theme.palette.success.light,
                          borderRadius: '56px',
                          backgroundColor: theme.palette.grey[600],
                          p: '2px 8px',
                          fontSize: '12px',
                          fontFamily: 'var(--font-medium)',
                          lineHeight: '16px',
                          width: 'fit-content',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {licensingTypeList[licensingType]?.label}
                      </Typography>
                    )
                  } else {
                    return <React.Fragment key={idx}></React.Fragment>
                  }
                })}
              </Box>
            ) : (
              <>
                {listingLicensingTypes?.map((licensingType, idx) => {
                  if (licensingType !== LicensingTypes.None) {
                    return (
                      <Typography
                        key={idx}
                        sx={{
                          color: theme.palette.success.light,
                          borderRadius: '56px',
                          backgroundColor: theme.palette.grey[600],
                          p: '2px 8px',
                          fontSize: '12px',
                          fontFamily: 'var(--font-medium)',
                          lineHeight: '16px',
                          width: 'fit-content',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {licensingTypeList[licensingType]?.label}
                      </Typography>
                    )
                  } else {
                    return <React.Fragment key={idx}></React.Fragment>
                  }
                })}
              </>
            )}
          </Box>

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
                    key={index}
                    sx={{
                      lineHeight: '16px',
                      fontSize: '12px',
                      color: theme.palette.text.secondary,
                      whiteSpace: 'nowrap',
                    }}
                    component={'span'}
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

      <Box display={'flex'} alignItems={'center'} gap={4.5}>
        <Box display={'flex'} flexDirection={'column'} gap={0.5}>
          <Typography variant="subtitle1" color={theme.palette.text.secondary}>
            Exclusive price per item
          </Typography>
          <Typography
            align="right"
            sx={{
              fontFamily: 'var(--font-bold)',
              fontSize: '16px',
              color: theme.palette.containerSecondary.contrastText,
            }}
          >
            ${(sPrice * tokenPrice).toLocaleString()}
          </Typography>
        </Box>

        <Box display={'flex'} flexDirection={'column'} gap={0.5}>
          <Typography variant="subtitle1" color={theme.palette.text.secondary}>
            <Box display={'flex'} flexDirection={'column'} gap={0.5}>
              <Typography
                variant="subtitle1"
                color={theme.palette.text.secondary}
              >
                Non-exclusive price per item
              </Typography>
              <Typography
                align="right"
                sx={{
                  fontFamily: 'var(--font-bold)',
                  fontSize: '16px',
                  color: theme.palette.containerSecondary.contrastText,
                }}
              >
                ${(fPrice * tokenPrice).toLocaleString()}
              </Typography>
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
