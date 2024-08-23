import {
  Box,
  CardMedia,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import PrimaryButton from 'src/components/buttons/primary-button'
import BackDarkIcon from 'src/assets/images/back_dark.svg'
import ListingDetails from './listingDetails'
import { useEffect, useRef, useState } from 'react'
import { LicenseDataIF, LicensingTypes, ListingStatusType } from 'src/interface'
import ListingLicensingTypeSelector from './listingLicensingTypeSelector'
import LicenseEditor from 'src/components/licenseEditor'
import useListingLicense from 'src/hooks/useListingLicense'
import toast from 'react-hot-toast'
import { EnSubmitting } from 'src/interface'
import ListingResultDlg from 'src/components/listingResultDlg'
import { getSyncData } from 'src/utils/utils'

interface Props {
  licenseData: any
  setLicenseData: (licenseData: any) => void
  backHandler: () => void
}

interface ChildComponentRef {
  handleSubmit: (mode: EnSubmitting) => void
}

export default function ConfiguringLicenseListing({
  licenseData,
  setLicenseData,
  backHandler,
}: Props) {
  const theme = useTheme()
  const { listLicense } = useListingLicense()

  const formikRef = useRef<ChildComponentRef>(null)
  const [prices, setPrices] = useState({
    fPrice: 0,
    sPrice: 0,
  })
  const [openListingResult, setOpenListingResult] = useState<boolean>(false)

  const [curLicensingType, setCurLicensingType] = useState<LicensingTypes>(
    LicensingTypes.None,
  )
  const [pendedLicensingType, setPendedLicensingType] =
    useState<LicensingTypes>(LicensingTypes.None)
  const [listingLicensingTypes, setListingLicensingTypes] = useState<
    LicensingTypes[]
  >([LicensingTypes.None])
  const [listedId, setListedId] = useState<string>('')

  const createListing = async () => {
    await formikRef.current.handleSubmit(EnSubmitting.CreateListing)
  }

  const listAnOtherLicensing = async () => {
    await formikRef.current.handleSubmit(EnSubmitting.NewLicensing)
  }

  const switchAnotherLicensing = async (newLicensingType: LicensingTypes) => {
    if (curLicensingType !== LicensingTypes.None) {
      await formikRef?.current?.handleSubmit(EnSubmitting.Switched)
    } else {
      setCurLicensingType(pendedLicensingType)
    }
    setPendedLicensingType(newLicensingType)
  }

  useEffect(() => {
    if (curLicensingType !== LicensingTypes.None) {
      const syncData = getSyncData(curLicensingType, licenseData.signingData)
      if (syncData) {
        setPrices({
          fPrice: syncData.fPrice,
          sPrice: syncData.sPrice,
        })
      }
    } else {
      setPrices({
        fPrice: 0,
        sPrice: 0,
      })
    }
  }, [curLicensingType, licenseData.signingData])

  const onSubmitSuccess = async (
    mode: EnSubmitting,
    newLicenseData: LicenseDataIF,
  ) => {
    switch (mode) {
      case EnSubmitting.Switched:
        setCurLicensingType(pendedLicensingType)
        break
      case EnSubmitting.NewLicensing:
        const newValue = [...listingLicensingTypes, LicensingTypes.None]
        setCurLicensingType(LicensingTypes.None)
        setListingLicensingTypes(newValue)
        break
      case EnSubmitting.CreateListing:
        const tLoading = toast.loading('listing your license...')
        setLicenseData(newLicenseData)
        const { success, data, msg } = await listLicense(newLicenseData)
        if (success) {
          toast.success(msg, { id: tLoading })
          setListedId(data.listedId)
        } else {
          toast.error(msg, { id: tLoading })
        }
        setOpenListingResult(success)
        break
    }
  }

  const onSubmitError = (errors) => {
    // toast.error('Please fill out the fields correctly')
  }

  // useEffect(() => {
  //   const tmpLicensingTypes = []
  //   if (licenseData.signingData.creator.listed === ListingStatusType.Listed) {
  //     tmpLicensingTypes.push(LicensingTypes.Creator)
  //   }
  //   if (
  //     licenseData.signingData.advertisement.listed === ListingStatusType.Listed
  //   ) {
  //     tmpLicensingTypes.push(LicensingTypes.Advertisement)
  //   }
  //   if (licenseData.signingData.tvSeries.listed === ListingStatusType.Listed) {
  //     tmpLicensingTypes.push(LicensingTypes.TvSeries)
  //   }
  //   if (licenseData.signingData.movie.listed === ListingStatusType.Listed) {
  //     tmpLicensingTypes.push(LicensingTypes.Movie)
  //   }
  //   if (licenseData.signingData.videoGame.listed === ListingStatusType.Listed) {
  //     tmpLicensingTypes.push(LicensingTypes.VideoGame)
  //   }
  //   if (
  //     licenseData.signingData.aiTraining.listed === ListingStatusType.Listed
  //   ) {
  //     tmpLicensingTypes.push(LicensingTypes.AiTraining)
  //   }
  //   setListingLicensingTypes(tmpLicensingTypes)
  // }, [licenseData])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display={'flex'} flexDirection={'column'} width="100%">
        <Box display={'flex'} justifyContent={'space-between'} p={2}>
          <Box display={'flex'} alignItems={'flex-start'} gap={1}>
            <IconButton onClick={backHandler}>
              <CardMedia
                component={'img'}
                image={BackDarkIcon}
                sx={{ width: 10, objectFit: 'cover' }}
              />
            </IconButton>
            <Box display={'flex'} flexDirection={'column'} gap={0.5}>
              <Typography
                sx={{
                  fontFamily: 'var(--font-semi-bold)',
                  fontSize: '18px',
                }}
              >
                Configure your license price and usage
              </Typography>

              <Typography
                sx={{
                  fontSize: '14px',
                  color: theme.palette.text.secondary,
                }}
              >
                Tell us about the type of license listing you are making and
                other key details
              </Typography>
            </Box>
          </Box>

          <PrimaryButton onClick={createListing}>Create listing</PrimaryButton>
        </Box>

        <Divider />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 696,
            overflowY: 'auto',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <ListingDetails
            listingLicensingTypes={listingLicensingTypes}
            licenseData={licenseData}
            fPrice={prices.fPrice}
            sPrice={prices.sPrice}
          />

          <Divider />

          <Box p={4}>
            <ListingLicensingTypeSelector
              curLicensingType={curLicensingType}
              listingLicensingTypes={listingLicensingTypes}
              setListingLicensingTypes={setListingLicensingTypes}
              setCurLicensingType={setCurLicensingType}
              switchAnotherLicensing={switchAnotherLicensing}
              listAnOtherLicensing={listAnOtherLicensing}
              licenseData={licenseData}
              setLicenseData={setLicenseData}
            />
          </Box>

          {curLicensingType !== LicensingTypes.None && (
            <>
              <Divider />
              <LicenseEditor
                ref={formikRef}
                licenseData={licenseData}
                setLicenseData={setLicenseData}
                licensingType={curLicensingType}
                setPrices={setPrices}
                onSubmitSuccess={onSubmitSuccess}
                onSubmitError={onSubmitError}
              />
            </>
          )}
        </Box>
      </Box>

      <ListingResultDlg
        multiCollaborators={licenseData.artists.length > 1}
        listedId={listedId}
        imagePath={licenseData.imagePath}
        licenseName={licenseData.licenseName}
        sellerName={licenseData.sellerName}
        albumName={licenseData.albumName}
        open={openListingResult}
        setOpen={setOpenListingResult}
      />
    </LocalizationProvider>
  )
}
