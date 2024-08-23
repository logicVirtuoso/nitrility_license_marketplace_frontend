import { useEffect, useState, useCallback } from 'react'
import { Box, useTheme, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { getSoldLicenses } from 'src/api'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { LicenseFilterIF } from 'src/interface'
import toast from 'react-hot-toast'
import SecondaryButton from 'src/components/buttons/secondary-button'
import { SellerAccountType, topTimeOptions } from 'src/config'
import PurchasedLicenseDetailsDlg from 'src/components/detailsDlg/purchasedLicenseDetails'
import { useNavigate } from 'react-router-dom'
import ViewModeTools from 'src/components/viewMode/tools'
import { ViewMode } from 'src/interface'
import GridContents from 'src/components/viewMode/gridContents'
import ListContents from 'src/components/viewMode/listContents'
import { ListViewTypes } from 'src/interface'

const SoldLicenses = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [soldLicenses, setSoldLicenses] = useState<Array<any>>([])
  const [sortingTime, setSortingTime] = useState(topTimeOptions[0].label)
  const [keyword, setKeyword] = useState<string>('')
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

  const soldLicensesHandler = (license) => {
    setCurLicense(license)
    setOpenPurchasedDetails(true)
  }

  const filterHandler = useCallback(async () => {
    if (authorization?.currentUser?.sellerId) {
      setIsLoading(true)
      const { success, data, msg } = await getSoldLicenses(
        authorization?.currentUser?.sellerId,
      )
      if (success) {
        setSoldLicenses(data)
      } else {
        toast.error(msg)
      }
      setIsLoading(false)
    }
  }, [authorization?.currentUser?.sellerId])

  useEffect(() => {
    filterHandler()
  }, [filterHandler])

  const sortingByTime = (event) => {
    setSortingTime(event.target.value)
  }

  return (
    <Box>
      <ViewModeTools
        totalAmount={`${soldLicenses.length} licenses`}
        selected={sortingTime}
        handleOptionChange={sortingByTime}
        options={topTimeOptions}
        keyword={keyword}
        handleSearch={searchHandler}
        searchPlaceholder="Search licenses..."
        viewMode={curView}
        setViewMode={setCurView}
      />

      {!isLoading && soldLicenses?.length === 0 ? (
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
            You haven’t sold any licenses yet
          </Typography>
          <Typography
            fontWeight={400}
            fontSize={14}
            color={theme.palette.text.secondary}
          >
            List up more licenses, and stay consistent
          </Typography>
          <SecondaryButton
            sx={{ mt: 1 }}
            onClick={() =>
              navigate('/sell', {
                state: {
                  platformTitle: SellerAccountType.Spotify,
                  sellerId: authorization.currentUser.sellerId,
                },
              })
            }
          >
            Sell Licenses
          </SecondaryButton>
        </Box>
      ) : (
        <>
          {curView === ViewMode.GridView ? (
            <GridContents
              licenses={soldLicenses}
              handleClickLicnese={(license) => soldLicensesHandler(license)}
            />
          ) : (
            <ListContents
              listViewType={ListViewTypes.PROFILE}
              licenses={soldLicenses}
              handler={(license) => soldLicensesHandler(license)}
            />
          )}
        </>
      )}
      {curLicense && (
        <PurchasedLicenseDetailsDlg
          isSeller={true}
          purchasedLicense={curLicense}
          open={openPurchasedDetails}
          setOpen={setOpenPurchasedDetails}
        />
      )}
    </Box>
  )
}

export default SoldLicenses
