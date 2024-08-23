import React from 'react'
import { Box, Divider, Typography } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { styled } from '@mui/material/styles'
import { useTokenPrice } from 'src/hooks/useTokenPrice'
import dayjs from 'dayjs'
import {
  DaysFormat,
  TemplateDataIF,
  AccessLevel,
  SupplyFormat,
  listingTypes,
} from 'src/interface'
import { RevenueSplits } from 'src/components/revenueSplits'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const StyledImage = styled('img')(() => ({
  objectFit: 'cover',
  width: '72px',
  height: '72px',
  borderRadius: '10px',
}))

interface MediaSyncViewIF {
  mediaSyncData: TemplateDataIF
  imagePath: string
  licenseName: string
  sellerName: string
}

export default function MediaSyncView({
  mediaSyncData,
  imagePath,
  licenseName,
  sellerName,
}: MediaSyncViewIF) {
  const navigate = useNavigate()
  const { tokenPrice } = useTokenPrice()
  const [duration, setDuration] = React.useState<string>('')
  const [price, setPrice] = React.useState<number>(0)

  React.useEffect(() => {
    if (mediaSyncData.infiniteListingDuration) {
      setDuration(DaysFormat.Infinite)
    } else {
      const data = dayjs(mediaSyncData.listingEndTime).format('MM/DD/YYYY')
      setDuration(data)
    }

    switch (mediaSyncData.accessLevel) {
      case AccessLevel.Both:
      case AccessLevel.NonExclusive:
        setPrice(mediaSyncData.fPrice)
        break
      case AccessLevel.Exclusive:
        setPrice(mediaSyncData.sPrice)
        break
      default:
        toast.error('Invalid License')
        navigate('/')
        break
    }
  }, [mediaSyncData, navigate])

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
            License Price per item
          </Typography>

          <Typography variant="h5" textAlign={'right'} fontWeight={600}>
            ${(price * tokenPrice).toLocaleString()}
          </Typography>

          <Typography
            variant="caption"
            textAlign={'right'}
            color="rgb(84, 84, 84)"
          >
            {price.toLocaleString()} ETH
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Box display={'flex'} justifyContent={'space-between'} py={2}>
        <Typography variant="h5">Listing Type: </Typography>
        <Typography variant="h5">
          {listingTypes[mediaSyncData?.listingFormatValue]}
        </Typography>
      </Box>

      {mediaSyncData.accessLevel !== AccessLevel.Exclusive && (
        <>
          <Divider />
          <Box display={'flex'} justifyContent={'space-between'} py={2}>
            <Typography variant="h5">Non Exclusive Price($): </Typography>
            <Typography variant="h5">
              {(mediaSyncData?.fPrice * tokenPrice).toLocaleString()}
            </Typography>
          </Box>
        </>
      )}

      {mediaSyncData.accessLevel !== AccessLevel.NonExclusive && (
        <>
          <Divider />
          <Box display={'flex'} justifyContent={'space-between'} py={2}>
            <Typography variant="h5">Exclusive Price($): </Typography>
            <Typography variant="h5">
              {(mediaSyncData?.sPrice * tokenPrice).toLocaleString()}
            </Typography>
          </Box>
        </>
      )}

      <Divider />

      <Box display={'flex'} justifyContent={'space-between'} py={2}>
        <Typography variant="h5">Supply: </Typography>
        <Typography variant="h5">
          {mediaSyncData?.infiniteSupply
            ? SupplyFormat.Infinite
            : mediaSyncData.totalSupply}
        </Typography>
      </Box>

      <Divider />

      <Box display={'flex'} justifyContent={'space-between'} py={2}>
        <Typography variant="h5">License Duration: </Typography>
        <Typography variant="h5">{duration}</Typography>
      </Box>

      <Divider />

      <Box display={'flex'} flexDirection={'column'} py={2} gap={1}>
        <Typography variant="h5">Usage Notes/Special Requirements: </Typography>
        <Typography variant="h5">{mediaSyncData.usageNotes}</Typography>
      </Box>

      <Divider />

      <Box display={'flex'} flexDirection={'column'} width={'100%'} mt={2}>
        {mediaSyncData.revenues?.length > 1 && (
          <RevenueSplits
            readOnly={true}
            artistRevenues={mediaSyncData.revenues}
          />
        )}
      </Box>
    </LocalizationProvider>
  )
}
