import { Box, CardMedia, IconButton, Typography, useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'
import { contentLabels } from 'src/config'
import { LicensingTypes, UsageDetailIF } from 'src/interface'
import DownloadDarkIcon from 'src/assets/images/download_dark.png'
import toast from 'react-hot-toast'
import useAwsS3 from 'src/hooks/useAwsS3'

const StyledDiv = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: 10,
  border: `1px solid ${theme.palette.grey[600]}`,
  padding: 16,
}))

interface Props {
  licensingType: LicensingTypes
  usageDetails: UsageDetailIF
}

export default function MediaDetails({ licensingType, usageDetails }: Props) {
  const theme = useTheme()
  const { downloadPreviewfiles } = useAwsS3()

  const downloadHandler = async () => {
    const tLoading = toast.loading('Downloading preview files...')
    try {
      const success = await downloadPreviewfiles(usageDetails.previewFiles)
      if (success) {
        toast.success('Successfully downloaded', { id: tLoading })
      } else {
        toast.error('Something went wrong', { id: tLoading })
      }
    } catch (e) {
      toast.error('Something went wrong', { id: tLoading })
    }
  }

  return (
    <Box display={'flex'} flexDirection={'column'} gap={1}>
      <StyledDiv>
        <Typography
          fontSize={14}
          fontWeight={400}
          color={theme.palette.text.secondary}
        >
          {contentLabels[licensingType].title}
        </Typography>
        <Typography
          fontSize={14}
          fontWeight={400}
          color={theme.palette.text.secondary}
        >
          {usageDetails.contentTitle}
        </Typography>
      </StyledDiv>

      {licensingType === LicensingTypes.Advertisement && (
        <Box
          display={'flex'}
          flexDirection={'column'}
          gap={1}
          border={`1px solid ${theme.palette.grey[600]}`}
          borderRadius={2.5}
        >
          <Typography
            fontSize={14}
            fontWeight={400}
            lineHeight={'21px'}
            color={theme.palette.text.secondary}
          >
            Product Description
          </Typography>

          <Typography
            fontSize={14}
            fontWeight={400}
            lineHeight={'21px'}
            bgcolor={theme.palette.grey[700]}
            borderRadius={1}
            px={1.5}
            py={1}
          >
            {usageDetails.productionDescription}
          </Typography>
        </Box>
      )}

      <Box
        display={'flex'}
        flexDirection={'column'}
        gap={1}
        border={`1px solid ${theme.palette.grey[600]}`}
        borderRadius={2.5}
        p={1.5}
      >
        <Typography
          fontSize={14}
          fontWeight={400}
          lineHeight={'21px'}
          color={theme.palette.text.secondary}
        >
          {contentLabels[licensingType].description}
        </Typography>

        <Typography
          fontSize={14}
          fontWeight={400}
          lineHeight={'21px'}
          bgcolor={theme.palette.grey[700]}
          borderRadius={1}
          px={1.5}
          py={1}
        >
          {usageDetails.contentDescription}
        </Typography>
      </Box>

      <StyledDiv>
        <Typography fontSize={14} color={theme.palette.text.secondary}>
          Production Preview Zip
        </Typography>

        <Box
          display={'flex'}
          alignItems={'center'}
          gap={0.5}
          onClick={downloadHandler}
        >
          <Typography
            fontSize={14}
            fontWeight={600}
            color={theme.palette.success.light}
          >
            Download Production ZIP
          </Typography>

          <CardMedia
            component={'img'}
            image={DownloadDarkIcon}
            sx={{ width: 18, height: 18 }}
          />
        </Box>
      </StyledDiv>

      <StyledDiv>
        <Typography fontSize={14} color={theme.palette.text.secondary}>
          {contentLabels[licensingType].platforms}
        </Typography>

        <Typography
          fontSize={14}
          fontWeight={600}
          color={theme.palette.containerPrimary.contrastText}
        >
          {usageDetails.intendedPlatforms}
        </Typography>
      </StyledDiv>

      <Box
        display={'flex'}
        flexDirection={'column'}
        gap={1}
        border={`1px solid ${theme.palette.grey[600]}`}
        borderRadius={2.5}
        p={1.5}
      >
        <Typography
          fontSize={14}
          fontWeight={400}
          lineHeight={'21px'}
          color={theme.palette.text.secondary}
        >
          Additional Information on License Usage
        </Typography>

        <Typography
          fontSize={14}
          fontWeight={400}
          lineHeight={'21px'}
          bgcolor={theme.palette.grey[700]}
          borderRadius={1}
          px={1.5}
          py={1}
        >
          {usageDetails.licenseUsage}
        </Typography>
      </Box>
    </Box>
  )
}
