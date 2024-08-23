import { Box, Typography, useTheme } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import SecondaryButton from 'src/components/buttons/secondary-button'
import CollectionCreationDlg from './collectionCreationDlg'
import Grid from '@mui/material/Unstable_Grid2'
import Collection from './collection'
import AddCollection from './addCollection'
import { topTimeOptions } from 'src/config'
import ViewModeTools from 'src/components/viewMode/tools'
import { CollectionIF, SellerDataIF, ViewMode } from 'src/interface'
import { PublicProfileContext } from 'src/context/publicProfileContext'

interface Props {
  isOwner: boolean
  sellerData: SellerDataIF
}

const CollectionTab = ({ isOwner, sellerData }: Props) => {
  const { publicProfileData } = useContext(PublicProfileContext)
  const { collections } = publicProfileData
  const [curView, setCurView] = useState<ViewMode>(ViewMode.GridView)
  const theme = useTheme()
  const [openCollectionCreationDlg, setOpenCollectionCreationDlg] =
    useState<boolean>(false)
  const [latestId, setLatestId] = useState<number>(0)
  const [sortingTime, setSortingTime] = useState(topTimeOptions[0].label)
  const [keyword, setKeyword] = useState<string>('')
  const [searchedCollections, setSearchedCollections] = useState<Array<any>>([])

  useEffect(() => {
    if (!isOwner) {
      setSearchedCollections(
        collections.filter((collection) => collection.published),
      )
    } else {
      setSearchedCollections(collections)
    }
  }, [collections, isOwner])

  useEffect(() => {
    if (collections?.length === 0) {
      setLatestId(0)
    } else {
      setLatestId(collections[collections.length - 1].collectionId + 1)
    }
  }, [collections])

  const sortingByTime = (event) => {
    setSortingTime(event.target.value)
  }

  const searchHandler = (value) => {
    setKeyword(value)
    if (value !== '') {
      const tmp = collections.filter((collection) => {
        if (
          collection.collectionName.toLowerCase().includes(value.toLowerCase())
        ) {
          return true
        } else {
          return false
        }
      })
      setSearchedCollections(tmp)
    } else {
      setSearchedCollections(collections)
    }
  }

  return (
    <Box display={'flex'} flexDirection={'column'}>
      {!isOwner && collections.length == 0 ? (
        <></>
      ) : (
        <>
          <ViewModeTools
            totalAmount={`${searchedCollections.length} Collections`}
            selected={sortingTime}
            handleOptionChange={sortingByTime}
            options={topTimeOptions}
            keyword={keyword}
            handleSearch={searchHandler}
            searchPlaceholder="Search licenses..."
            viewMode={curView}
            setViewMode={setCurView}
          />
          {collections?.length == 0 ? (
            <Box
              display={'flex'}
              flexDirection={'column'}
              alignItems={'center'}
              gap={2}
              py={9}
            >
              <Typography
                variant="h3"
                color={theme.palette.containerPrimary.contrastText}
              >
                You don’t have any collections yet
              </Typography>

              <Typography
                variant="body2"
                color={theme.palette.text.secondary}
                sx={{
                  whiteSpace: 'pre-wrap',
                  maxWidth: 350,
                  textAlign: 'center',
                }}
              >
                Organise your licenses into collections or playlists for people
                that view your profile.
              </Typography>

              <SecondaryButton
                sx={{
                  backgroundColor: theme.palette.secondary.main,
                  borderRadius: 2,
                }}
                onClick={() => setOpenCollectionCreationDlg(true)}
              >
                Create collection
              </SecondaryButton>
            </Box>
          ) : (
            <Grid container spacing={2} columns={40}>
              {searchedCollections?.map((collection, idx) => {
                return (
                  <Grid xs={8} key={idx}>
                    <Collection
                      sellerId={sellerData.sellerId}
                      collectionId={collection.collectionId}
                      imagePath={collection.imagePath}
                      collectionName={collection.collectionName}
                      sellerName={sellerData.sellerName}
                      totalSongs={collection.selectedLicenses.length}
                      createdAt={collection.createdAt}
                      published={collection.published}
                    />
                  </Grid>
                )
              })}
              {isOwner && (
                <Grid xs={8}>
                  <AddCollection
                    handler={() => setOpenCollectionCreationDlg(true)}
                  />
                </Grid>
              )}
            </Grid>
          )}
          {isOwner && (
            <CollectionCreationDlg
              collectionId={latestId}
              open={openCollectionCreationDlg}
              setOpen={setOpenCollectionCreationDlg}
            />
          )}
        </>
      )}
    </Box>
  )
}

export default CollectionTab
