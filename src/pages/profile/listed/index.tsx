import { useEffect, useState } from 'react'
import { Box, Grid, Typography, useTheme } from '@mui/material'
import { topTimeOptions } from 'src/config'
import ViewModeTools from 'src/components/viewMode/tools'
import { CommonLicenseDataIF, ListViewTypes, ViewMode } from 'src/interface'
import ListContents from 'src/components/viewMode/listContents'
import LicenseCard from 'src/components/licenseCard'
import SecondaryButton from 'src/components/buttons/secondary-button'

const ListedPage = (props) => {
  const theme = useTheme()
  const { listedLicenses } = props
  const [searchedLicenses, setSearchedLicenses] = useState<Array<any>>([])
  const [sortingTime, setSortingTime] = useState(topTimeOptions[0].label)
  const [keyword, setKeyword] = useState<string>('')
  const [curView, setCurView] = useState<ViewMode>(ViewMode.GridView)
  useEffect(() => {
    setSearchedLicenses(listedLicenses)
  }, [listedLicenses])

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
      {curView === ViewMode.GridView ? (
        <>
          {searchedLicenses.length > 0 ? (
            <Grid container spacing={2}>
              {searchedLicenses.map((license: any, index: number) => {
                const commonLicenseData: CommonLicenseDataIF = license
                return (
                  <Grid
                    item
                    sx={{
                      width: '20%',
                      flexBasis: '20%',
                      flexGrow: 0,
                    }}
                    key={index}
                  >
                    <LicenseCard
                      isPending={false}
                      commonLicenseData={commonLicenseData}
                      showControler={true}
                    />
                  </Grid>
                )
              })}
            </Grid>
          ) : (
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
                You haven’t listed any licenses yet
              </Typography>
              <Typography
                fontWeight={400}
                fontSize={14}
                color={theme.palette.text.secondary}
              >
                What are you waiting for!
              </Typography>
              <SecondaryButton sx={{ mt: 1 }}>Sell Licenses</SecondaryButton>
            </Box>
          )}
        </>
      ) : (
        <ListContents
          listViewType={ListViewTypes.PROFILE}
          licenses={searchedLicenses}
          handler={(license) => console.log(license)}
        />
      )}
    </Box>
  )
}

export default ListedPage
