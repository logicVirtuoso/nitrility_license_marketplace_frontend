import { useEffect, useState } from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { getAllUnLicensesBySellerId } from 'src/api'
import SecondaryButton from 'src/components/buttons/secondary-button'
import GridContents from 'src/components/viewMode/gridContents'
import { ListViewTypes, ViewMode } from 'src/interface'
import ViewModeTools from 'src/components/viewMode/tools'
import ListContents from 'src/components/viewMode/listContents'
import { topTimeOptions } from 'src/config'
import toast from 'react-hot-toast'

const UnListedPage = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const [listedLicenses, setListedLicenses] = useState<Array<any>>([])
  const [sellerId, setsellerId] = useState<string | null>(null)
  const [searchedLicenses, setSearchedLicenses] = useState<Array<any>>([])
  const [curView, setCurView] = useState<ViewMode>(ViewMode.GridView)
  const [keyword, setKeyword] = useState<string>('')
  const [sortingTime, setSortingTime] = useState(topTimeOptions[0].label)

  const authorization = useSelector(
    (state: { authorization: any }) => state.authorization,
  )

  useEffect(() => {
    const init = async () => {
      if (sellerId) {
        const { success, data, msg } = await getAllUnLicensesBySellerId(
          sellerId,
        )
        if (success) {
          setListedLicenses(data)
          setSearchedLicenses(data)
        } else {
          toast.error(msg)
        }
      }
    }
    init()
  }, [sellerId])

  useEffect(() => {
    setsellerId(authorization?.currentUser?.sellerId)
  }, [authorization?.currentUser?.sellerId])

  const searchHandler = (value) => {
    setKeyword(value)
    if (value !== '') {
      const tmp = listedLicenses.filter((license) => {
        if (license.licenseName.toLowerCase().includes(value.toLowerCase())) {
          return true
        } else {
          return false
        }
      })
      setSearchedLicenses(tmp)
    } else {
      setSearchedLicenses(listedLicenses)
    }
    setKeyword(value)
  }

  const sortingByTime = (event) => {
    setSortingTime(event.target.value)
  }

  return (
    <Box>
      <ViewModeTools
        totalAmount={`${searchedLicenses.length} licenses`}
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
        {searchedLicenses.length == 0 ? (
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
              You don’t have any unlisted licenses
            </Typography>
            <Typography
              fontWeight={400}
              fontSize={14}
              color={theme.palette.text.secondary}
            >
              Licenses that are unlisted after getting sales will be shown here
            </Typography>
            <SecondaryButton sx={{ mt: 1 }}>Sell Licenses</SecondaryButton>
          </Box>
        ) : (
          <>
            {curView === ViewMode.GridView ? (
              <GridContents
                isPending={true}
                licenses={searchedLicenses}
                handleClickLicnese={(license) =>
                  navigate(`/license/history/${license.listedId}`)
                }
              />
            ) : (
              <ListContents
                isPending={true}
                listViewType={ListViewTypes.PROFILE}
                licenses={searchedLicenses}
                handler={(license) =>
                  navigate(`/license/history/${license.listedId}`)
                }
              />
            )}
          </>
        )}
      </>
    </Box>
  )
}

export default UnListedPage
