import React from 'react'
import { Box, Divider, Typography } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { styled } from '@mui/material/styles'
import { useTokenPrice } from 'src/hooks/useTokenPrice'
import dayjs from 'dayjs'
import {
  TemplateDataIF,
  DaysFormat,
  SupplyFormat,
  listingTypes,
} from 'src/interface'
import { RevenueSplits } from 'src/components/revenueSplits'

const StyledImage = styled('img')(() => ({
  objectFit: 'cover',
  width: '72px',
  height: '72px',
  borderRadius: '10px',
}))

interface CreatorViewIF {
  CreatorData: TemplateDataIF
  imagePath: string
  licenseName: string
  sellerName: string
}

export default function CreatorView({
  CreatorData,
  imagePath,
  licenseName,
  sellerName,
}: CreatorViewIF) {
  const { tokenPrice } = useTokenPrice()
  const [duration, setDuration] = React.useState<string>('')

  React.useEffect(() => {
    if (CreatorData.infiniteListingDuration) {
      setDuration(DaysFormat.Infinite)
    } else {
      const data = dayjs(CreatorData.listingEndTime).format('MM/DD/YYYY')
      setDuration(data)
    }
  }, [CreatorData])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display={'flex'} justifyContent={'space-between'} pb={3} gap={2}>
        <Box display={'flex'}>
          <Box
            display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            pr={2}
          >
            <StyledImage src={imagePath} />
          </Box>

          <Box
            display={'flex'}
            flexDirection={'column'}
            justifyContent={'center'}
            gap={1}
          >
            <Typography fontWeight={600} fontSize={'16px'}>
              {licenseName}
            </Typography>
            <Typography variant="subtitle2">{sellerName}</Typography>
          </Box>
        </Box>

        <Box display={'flex'} flexDirection={'column'}>
          <Typography
            variant="subtitle2"
            textAlign={'right'}
            color="rgb(84, 84, 84)"
          >
            Marketplace price per item
          </Typography>

          <Typography variant="h5" textAlign={'right'} fontWeight={600}>
            ${(CreatorData.fPrice * tokenPrice).toLocaleString()}
          </Typography>
          <Typography
            variant="caption"
            textAlign={'right'}
            color="rgb(84, 84, 84)"
          >
            {CreatorData.fPrice.toLocaleString()} ETH
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Box display={'flex'} justifyContent={'space-between'} py={2}>
        <Typography variant="h5">Listing Type: </Typography>
        <Typography variant="h5">
          {listingTypes[CreatorData?.listingFormatValue]}
        </Typography>
      </Box>

      <Divider />

      <Box display={'flex'} justifyContent={'space-between'} py={2}>
        <Typography variant="h5">Marketplace Price($): </Typography>
        <Typography variant="h5">
          {(CreatorData?.fPrice * tokenPrice).toLocaleString()}
        </Typography>
      </Box>

      <Divider />

      <Box display={'flex'} justifyContent={'space-between'} py={2}>
        <Typography variant="h5">Recommended Price($): </Typography>
        <Typography variant="h5">
          {(CreatorData?.sPrice * tokenPrice).toLocaleString()}
        </Typography>
      </Box>

      <Divider />

      <Box display={'flex'} justifyContent={'space-between'} py={2}>
        <Typography variant="h5">Supply: </Typography>
        <Typography variant="h5">
          {CreatorData?.infiniteSupply
            ? SupplyFormat.Infinite
            : CreatorData.totalSupply}
        </Typography>
      </Box>

      <Divider />

      <Box display={'flex'} justifyContent={'space-between'} py={2}>
        <Typography variant="h5">License Duration: </Typography>
        <Typography variant="h5">{duration}</Typography>
      </Box>

      <Divider />

      <Box display={'flex'} flexDirection={'column'} width={'100%'} mt={2}>
        {CreatorData.revenues?.length > 1 && (
          <RevenueSplits
            readOnly={true}
            artistRevenues={CreatorData.revenues}
          />
        )}
      </Box>
    </LocalizationProvider>
  )
}
