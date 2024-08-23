import {
  Box,
  CardMedia,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { getLicenseForListedId, unlistLicense, unlistLicenseAll } from 'src/api'
import {
  EnSubmitting,
  LicenseDataIF,
  LicensingTypes,
  ListingStatusType,
} from 'src/interface'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import BackDarkIcon from 'src/assets/images/back_dark.svg'
import CircularProgress from '@mui/material/CircularProgress'
import PrimaryButton from 'src/components/buttons/primary-button'
import ListingDetails from './listingDetails'
import ListingResultDlg from 'src/components/listingResultDlg'
import ListingLicensingTypeSelector from './listingLicensingTypeSelector'
import useListingLicense from 'src/hooks/useListingLicense'
import LicenseEditor from 'src/components/licenseEditor'
import { getSyncData } from 'src/utils/utils'
import { licensingTypeList } from 'src/config'
import ConfirmUnlistingDlg from './confirmUnlistingDlg'
import toast from 'react-hot-toast'

interface ChildComponentRef {
  handleSubmit: (mode: EnSubmitting) => void
}

export default function LicenseSetting() {
  const theme = useTheme()
  const { listedId } = useParams()
  const navigate = useNavigate()
  const { updateListing } = useListingLicense()
  const formikRef = useRef<ChildComponentRef>(null)
  const [licenseData, setLicenseData] = useState<LicenseDataIF>()
  const [loading, setLoading] = useState<boolean>(true)
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
  >([])
  const [openConfirmDlg, setOpenConfirmDlg] = useState<boolean>(false)
  const [isUnlistAll, setIsUnlistAll] = useState<boolean>(false)

  const switchAnotherLicensing = async (newLicensingType: LicensingTypes) => {
    await formikRef?.current?.handleSubmit(EnSubmitting.Switched)
    setPendedLicensingType(newLicensingType)
  }

  const listAnOtherLicensing = async () => {
    await formikRef.current.handleSubmit(EnSubmitting.NewLicensing)
  }

  useEffect(() => {
    setLoading(true)
    getLicenseForListedId(listedId)
      .then((data) => {
        const tmpLicensingTypes = []

        if (data.signingData.creator.listed === ListingStatusType.Listed) {
          tmpLicensingTypes.push(LicensingTypes.Creator)
        }
        if (
          data.signingData.advertisement.listed === ListingStatusType.Listed
        ) {
          tmpLicensingTypes.push(LicensingTypes.Advertisement)
        }
        if (data.signingData.tvSeries.listed === ListingStatusType.Listed) {
          tmpLicensingTypes.push(LicensingTypes.TvSeries)
        }
        if (data.signingData.movie.listed === ListingStatusType.Listed) {
          tmpLicensingTypes.push(LicensingTypes.Movie)
        }
        if (data.signingData.videoGame.listed === ListingStatusType.Listed) {
          tmpLicensingTypes.push(LicensingTypes.VideoGame)
        }
        if (data.signingData.aiTraining.listed === ListingStatusType.Listed) {
          tmpLicensingTypes.push(LicensingTypes.AiTraining)
        }

        setLicenseData(data)
        setListingLicensingTypes(tmpLicensingTypes)
        setCurLicensingType(tmpLicensingTypes[0])

        const syncData = getSyncData(tmpLicensingTypes[0], data.signingData)
        setPrices({
          fPrice: syncData.fPrice,
          sPrice: syncData.sPrice,
        })

        setLoading(false)
      })
      .catch((e) => {
        toast.error(e.message)
        setLoading(false)
      })
  }, [listedId])

  useEffect(() => {
    if (!loading) {
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
    } else {
      setPrices({
        fPrice: 0,
        sPrice: 0,
      })
    }
  }, [loading, curLicensingType, licenseData?.signingData])

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
        setListingLicensingTypes(newValue)
        break
      case EnSubmitting.CreateListing:
        setLicenseData(newLicenseData)
        const success = await updateListing(
          newLicenseData.listedId,
          newLicenseData.sellerId,
          newLicenseData.signingData,
        )
        setOpenListingResult(success)
        break
    }
  }

  const onSubmitError = (errors) => {
    // console.log('errors', errors)
    // toast.error('Please fill out the fields correctly')
  }

  const saveEditing = async () => {
    await formikRef.current.handleSubmit(EnSubmitting.CreateListing)
  }

  const unList = async () => {
    let tLoading
    try {
      const licensingLabel = licensingTypeList[curLicensingType].label
      tLoading = toast.loading(`Unlisting ${licensingLabel}...`)
      const { data, success, msg } = await unlistLicense(
        licenseData.listedId,
        curLicensingType,
      )
      if (success) {
        // Filter out the current licensing type from the listingLicensingTypes array
        const updatedListingLicensingTypes = listingLicensingTypes.filter(
          (type) => type !== curLicensingType,
        )
        setListingLicensingTypes(updatedListingLicensingTypes)
        toast.success(msg, { id: tLoading })
      } else {
        toast.error(msg, { id: tLoading })
      }
    } catch (e) {
      toast.error(e.message, { id: tLoading })
    }
  }

  const unListAll = async () => {
    const tLoading = toast.loading('Unlisting your license')
    try {
      const { data, success, msg } = await unlistLicenseAll(
        licenseData.listedId,
      )
      if (success) {
        navigate('/')
        toast.success(msg, { id: tLoading })
      } else {
        toast.error(msg, { id: tLoading })
      }
    } catch (e) {
      toast.error(e.message, { id: tLoading })
    }
  }

  const confirmUnlistingHandler = (isConfirmed: boolean) => {
    if (isConfirmed) {
      if (isUnlistAll) {
        unListAll()
      } else {
        unList()
      }
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {loading ? (
        <Box
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          height={'100%'}
          width={'100%'}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Stack width={'100%'} position={'relative'}>
          <Box
            display={'flex'}
            width={'100%'}
            justifyContent={'center'}
            pt={2.5}
            pb={3.5}
            gap={2}
          >
            <Box
              maxWidth={864}
              width={'100%'}
              bgcolor={theme.palette.secondary.main}
              borderRadius={3}
              mt={13}
            >
              {!loading ? (
                <>
                  <Box display={'flex'} flexDirection={'column'} width="100%">
                    <Box
                      display={'flex'}
                      justifyContent={'space-between'}
                      p={2}
                    >
                      <Box display={'flex'} alignItems={'flex-start'} gap={1}>
                        <IconButton onClick={() => navigate(-1)}>
                          <CardMedia
                            component={'img'}
                            image={BackDarkIcon}
                            sx={{ width: 10, objectFit: 'cover' }}
                          />
                        </IconButton>
                        <Box
                          display={'flex'}
                          flexDirection={'column'}
                          gap={0.5}
                        >
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
                            Tell us about the type of license listing you are
                            making and other key details
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        display={'flex'}
                        flexDirection={'row'}
                        alignItems={'center'}
                        gap={1.5}
                      >
                        <PrimaryButton onClick={saveEditing}>
                          Save
                        </PrimaryButton>
                        <PrimaryButton
                          onClick={() => {
                            setIsUnlistAll(false)
                            setOpenConfirmDlg(true)
                          }}
                        >
                          Unlist
                        </PrimaryButton>
                        <PrimaryButton
                          onClick={() => {
                            setIsUnlistAll(true)
                            setOpenConfirmDlg(true)
                          }}
                        >
                          Unlist All
                        </PrimaryButton>
                      </Box>
                    </Box>

                    <Divider />

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: 696,
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                          display: 'none',
                        },
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
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
                </>
              ) : (
                <CircularProgress />
              )}
            </Box>
          </Box>
        </Stack>
      )}

      <ConfirmUnlistingDlg
        open={openConfirmDlg}
        setOpen={setOpenConfirmDlg}
        handler={confirmUnlistingHandler}
      />
    </LocalizationProvider>
  )
}
