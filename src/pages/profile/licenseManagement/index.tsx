import { useEffect, useState, useCallback } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { useSelector } from 'react-redux'
import { getPendingListings } from 'src/api'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { ListViewTypes } from 'src/interface'
import { topTimeOptions } from 'src/config'
import toast from 'react-hot-toast'
import SecondaryButton from 'src/components/buttons/secondary-button'
import InvitationDlg from './invitationDlg'
import ViewModeTools from 'src/components/viewMode/tools'
import { ViewMode } from 'src/interface'
import GridContents from 'src/components/viewMode/gridContents'
import ListContents from 'src/components/viewMode/listContents'

const LicenseManagementTab = () => {
  const theme = useTheme()
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  const [searchFilter, setSearchFilter] = useState({
    keyword: '',
  })

  const [pendingLicenses, setPendingLicenses] = useState<Array<any>>([])
  const [curLicense, setCurLicense] = useState<any>()
  const [sortingTime, setSortingTime] = useState(topTimeOptions[0].label)
  const [curView, setCurView] = useState<ViewMode>(ViewMode.GridView)
  const [keyword, setKeyword] = useState<string>('')
  const [openInvitationDlg, setOpenInvitationDlg] = useState<boolean>(false)
  const filterHandler = useCallback(async () => {
    if (authorization?.currentUser?.sellerId) {
      const { success, data, msg } = await getPendingListings(
        authorization?.currentUser?.sellerId,
        searchFilter,
      )
      if (success) {
        setPendingLicenses(data)
      } else {
        toast.error(msg)
      }
    }
  }, [authorization?.currentUser?.sellerId, searchFilter])

  useEffect(() => {
    filterHandler()
  }, [filterHandler])

  const searchHandler = (keyVal: string) => {
    setKeyword(keyVal)
    setSearchFilter((prevState) => ({
      ...prevState,
      keyword: keyVal,
    }))
  }

  const sortingByTime = (event) => {
    setSortingTime(event.target.value)
  }

  return (
    <Box>
      <ViewModeTools
        totalAmount={`${pendingLicenses.length} licenses`}
        selected={sortingTime}
        handleOptionChange={sortingByTime}
        options={topTimeOptions}
        keyword={keyword}
        handleSearch={searchHandler}
        searchPlaceholder="Search licenses..."
        viewMode={curView}
        setViewMode={setCurView}
      />
      <>
        {pendingLicenses.length == 0 ? (
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
              You don’t have any pending listings
            </Typography>
            <Typography
              fontWeight={400}
              fontSize={14}
              color={theme.palette.text.secondary}
            >
              Listings that require collaboration will be shown here while they
              are being approved.
            </Typography>
            <SecondaryButton sx={{ mt: 1 }}>Sell Licenses</SecondaryButton>
          </Box>
        ) : (
          <>
            {curView === ViewMode.GridView ? (
              <GridContents
                isPending={true}
                licenses={pendingLicenses}
                handleClickLicnese={(license) => {
                  setCurLicense(license)
                  setOpenInvitationDlg(true)
                }}
              />
            ) : (
              <ListContents
                isPending={true}
                listViewType={ListViewTypes.PROFILE}
                licenses={pendingLicenses}
                handler={(license) => {
                  setCurLicense(license)
                  setOpenInvitationDlg(true)
                }}
              />
            )}
          </>
        )}
      </>

      {curLicense && openInvitationDlg && (
        <InvitationDlg
          listedId={curLicense.listedId}
          imagePath={curLicense.imagePath}
          licenseName={curLicense.licenseName}
          sellerName={curLicense.sellerName}
          albumName={curLicense.albumName}
          sellerId={curLicense.sellerId}
          signingData={curLicense.signingData}
          open={openInvitationDlg}
          setOpen={setOpenInvitationDlg}
        />
      )}
    </Box>
  )
}

export default LicenseManagementTab
