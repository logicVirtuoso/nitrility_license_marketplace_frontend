import { useEffect, useState, useCallback } from 'react'
import { Box, useTheme, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { getOwnedLicense } from 'src/api'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { LicenseFilterIF, ListViewTypes } from 'src/interface'
import toast from 'react-hot-toast'
import SecondaryButton from 'src/components/buttons/secondary-button'
import { topTimeOptions } from 'src/config'
import ViewModeTools from 'src/components/viewMode/tools'
import { ViewMode } from 'src/interface'
import PurchasedLicenseDetailsDlg from 'src/components/detailsDlg/purchasedLicenseDetails'
import GridContents from 'src/components/viewMode/gridContents'
import ListContents from 'src/components/viewMode/listContents'

const OwnedPage = () => {
  const theme = useTheme()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [ownedLicenses, setOwnedLicenses] = useState<Array<any>>([])
  const [sortingTime, setSortingTime] = useState(topTimeOptions[0].label)
  const [keyword, setKeyword] = useState<string>('')
  const [seeAll, setSeeAll] = useState<boolean>(false)
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const [openPurchasedDetails, setOpenPurchasedDetails] =
    useState<boolean>(false)
  const [curLicense, setCurLicense] = useState<any>()
  const [curView, setCurView] = useState<ViewMode>(ViewMode.GridView)
  const [searchFilter, setSearchFilter] = useState<LicenseFilterIF>({
    keyword: '',
  })

  const searchHandler = (keyVal: string) => {
    setKeyword(keyVal)
    setSearchFilter((prevState) => ({
      ...prevState,
      keyword: keyVal,
    }))
  }

  const ownedLicensesHandler = (license) => {
    setCurLicense(license)
    setOpenPurchasedDetails(true)
  }

  const filterHandler = useCallback(async () => {
    if (authorization?.currentUser?.accountAddress) {
      setIsLoading(true)
      const { success, data, msg } = await getOwnedLicense(
        authorization?.currentUser?.accountAddress,
        searchFilter,
      )
      if (success) {
        setOwnedLicenses(data)
      } else {
        toast.error(msg)
      }
      setIsLoading(false)
    }
  }, [authorization?.currentUser?.accountAddress, searchFilter])

  useEffect(() => {
    filterHandler()
  }, [filterHandler])

  const sortingByTime = (event) => {
    setSortingTime(event.target.value)
  }

  return (
    <Box>
      <Box mt={2} mb={1} gap={2} color={theme.palette.text.primary}>
        <ViewModeTools
          totalAmount={`${ownedLicenses.length} licenses`}
          selected={sortingTime}
          handleOptionChange={sortingByTime}
          options={topTimeOptions}
          keyword={keyword}
          handleSearch={searchHandler}
          searchPlaceholder="Search licenses..."
          viewMode={curView}
          setViewMode={setCurView}
        />
      </Box>
      {!isLoading && ownedLicenses?.length === 0 ? (
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          gap={2}
          mt={12.5}
        >
          <Typography
            fontWeight={600}
            fontSize={24}
            color={theme.palette.text.primary}
          >
            You don’t own any licenses
          </Typography>
          <Typography
            fontWeight={400}
            fontSize={14}
            color={theme.palette.text.secondary}
          >
            Purchase licenses for music on the marketplace.
          </Typography>
          <SecondaryButton sx={{ mt: 1 }}>Explore licenses</SecondaryButton>
        </Box>
      ) : (
        <>
          {curView === ViewMode.GridView ? (
            <GridContents
              licenses={ownedLicenses}
              handleClickLicnese={(license) => ownedLicensesHandler(license)}
            />
          ) : (
            <ListContents
              listViewType={ListViewTypes.PROFILE}
              licenses={ownedLicenses}
              handler={(license) => ownedLicensesHandler(license)}
            />
          )}
        </>
      )}
      {curLicense && (
        <PurchasedLicenseDetailsDlg
          isSeller={false}
          purchasedLicense={curLicense}
          open={openPurchasedDetails}
          setOpen={setOpenPurchasedDetails}
        />
      )}
    </Box>
  )
}

export default OwnedPage
