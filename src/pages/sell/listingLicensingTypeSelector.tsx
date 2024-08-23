import { Box, CardMedia, Typography, useTheme } from '@mui/material'
import {
  LicenseDataIF,
  LicensingTypes,
  ListingStatusType,
  SigningDataIF,
} from 'src/interface'
import PlusDarkIcon from 'src/assets/images/listing/plus_dark.svg'
import StyledSelector from './styledSelector'
import { licensingTypeList } from 'src/config'
import { initialTemplateData } from '.'

interface Props {
  curLicensingType: LicensingTypes
  listingLicensingTypes: LicensingTypes[]
  licenseData: LicenseDataIF
  setListingLicensingTypes: (listingLicensingTypes: LicensingTypes[]) => void
  setCurLicensingType: (licensingType: LicensingTypes) => void
  switchAnotherLicensing: (licensingType: LicensingTypes) => void
  listAnOtherLicensing: () => void
  setLicenseData: (licenseData: LicenseDataIF) => void
}

export default function ListingLicensingTypeSelector({
  curLicensingType,
  listingLicensingTypes,
  licenseData,
  setListingLicensingTypes,
  setCurLicensingType,
  switchAnotherLicensing,
  listAnOtherLicensing,
  setLicenseData,
}: Props) {
  const theme = useTheme()

  const licensingTypeHandler = (
    licensingType: LicensingTypes,
    index: number,
  ) => {
    if (licensingType !== LicensingTypes.All) {
      setCurLicensingType(licensingType)
      const newValue = [
        ...listingLicensingTypes.slice(0, index),
        licensingType,
        ...listingLicensingTypes.slice(index + 1),
      ]
      setListingLicensingTypes(newValue)
    } else {
      const licensingObj = licensingTypeList.find(
        (item) => item.type == listingLicensingTypes[index],
      )
      const newLicenseData = { ...licenseData }
      // Update the signingData for the specific key
      newLicenseData.signingData[licensingObj.key] = initialTemplateData
      // Update the state with the new licenseData
      setLicenseData(newLicenseData)
      const newValue = listingLicensingTypes.filter((_, i) => i !== index)
      if (newValue.length > 0) {
        setListingLicensingTypes(newValue)
        setCurLicensingType(newValue[newValue.length - 1])
      } else {
        setListingLicensingTypes([LicensingTypes.None])
        setCurLicensingType(LicensingTypes.None)
      }
    }
  }

  return (
    <Box display={'flex'} flexDirection={'column'} gap={1}>
      <Typography
        fontWeight={600}
        fontSize={16}
        color={theme.palette.text.primary}
      >
        Select your license listing type(s)
      </Typography>
      {listingLicensingTypes.map((licensingType, index) => (
        <StyledSelector
          key={index}
          active={curLicensingType === licensingType}
          keyVal={index}
          listingLicensingTypes={listingLicensingTypes}
          selectedLicensingType={licensingType}
          handleChange={licensingTypeHandler}
          handler={() => switchAnotherLicensing(licensingType)}
        />
      ))}

      {listingLicensingTypes.length >= 1 &&
        listingLicensingTypes.length < LicensingTypes.All &&
        !listingLicensingTypes.includes(LicensingTypes.None) && (
          <Box
            borderRadius={2.5}
            height={40}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              px: 2,
              py: 1.5,
              backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23333' stroke-width='1' stroke-dasharray='6' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
              cursor: 'pointer',
            }}
            onClick={listAnOtherLicensing}
          >
            <CardMedia
              image={PlusDarkIcon}
              component={'img'}
              sx={{
                width: 12,
                height: 12,
              }}
            />

            <Typography
              fontFamily={'body2'}
              fontWeight={400}
              color={theme.palette.grey[400]}
            >
              List another license type
            </Typography>
          </Box>
        )}
    </Box>
  )
}
