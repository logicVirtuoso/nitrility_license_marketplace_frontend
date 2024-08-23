import {
  Box,
  CardMedia,
  Divider,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import {
  AvatarImage,
  Container,
  PublicAvatarImageContainer,
  UploadImage,
  UploadImageContainer,
} from '../style'
import defaultSrc from 'src/assets/images/profile/profile_banner_dark.png'
import { useNavigate, useParams } from 'react-router-dom'
import {
  deleteCollection,
  getCollectionData,
  getListedLicensesByIds,
} from 'src/api'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import BrokenAvatar from 'src/assets/images/profile_broken_avatar.png'
import OpenBrowserDarkIcon from 'src/assets/images/open_browser_dark.png'
import LinkDarkIcon from 'src/assets/images/link_dark.png'
import ShareDarkIcon from 'src/assets/images/share_dark.png'
import ThreeDotDarkIcon from 'src/assets/images/three_dot_dark.png'
import SecondaryButton from 'src/components/buttons/secondary-button'
import PrimaryButton from 'src/components/buttons/primary-button'
import EditCollectionDlg from './editColllectionDlg'
import CollectionMenu from './collectionMenu'
import DeleteCollectionDlg from './deleteCollectionDlg'
import toast from 'react-hot-toast'
import ViewModeTools from 'src/components/viewMode/tools'
import { ListViewTypes, ViewMode } from 'src/interface'
import { topTimeOptions } from 'src/config'
import GridContents from 'src/components/viewMode/gridContents'
import ListContents from 'src/components/viewMode/listContents'
import SharingMenu from 'src/pages/purchasing/sharingMenu'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { PublicProfileContext } from 'src/context/publicProfileContext'

export default function CollectionDetails() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { publicProfileData, setPublicProfileData } =
    useContext(PublicProfileContext)
  const { collections } = publicProfileData

  const { collectionId, sellerId } = useParams()
  const [collectionData, setCollectionData] = useState<any>(null)
  const [sellerName, setArtistName] = useState<string>('')
  const [licenses, setLicenses] = useState<Array<any>>([])
  const [searchedLicenses, setSearchedLicenses] = useState<Array<any>>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [curView, setCurView] = useState<ViewMode>(ViewMode.GridView)
  const [keyword, setKeyword] = useState<string>('')
  const [sortingTime, setSortingTime] = useState(topTimeOptions[0].label)
  const [openEditCollectionDlg, setOpenEditCollectionDlg] =
    useState<boolean>(false)
  const [openDeleteCollectionDlg, setOpenDeleteCollectionDlg] =
    useState<boolean>(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const openActionMenu = Boolean(anchorEl)

  const [anchorE2, setAnchorE2] = React.useState<null | HTMLElement>(null)
  const openSharingMenu = Boolean(anchorE2)
  const [copyLinkClicked, setCopyLinkClicked] = useState(false)

  const actionMenuHandler = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const sharingMenuHandler = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorE2(event.currentTarget)
  }

  const sortingByTime = (event) => {
    setSortingTime(event.target.value)
  }

  const searchHandler = (value) => {
    setKeyword(value)
    if (value !== '') {
      const tmp = licenses.filter((license) => {
        if (license.licenseName.toLowerCase().includes(value.toLowerCase())) {
          return true
        } else {
          return false
        }
      })
      setSearchedLicenses(tmp)
    } else {
      setSearchedLicenses(licenses)
    }
  }

  useEffect(() => {
    setLoading(true)
    const curCollection = collections.find(
      (collection) => collection.collectionId == Number(collectionId),
    )
    if (curCollection) {
      setCollectionData(curCollection)
    } else {
      navigate(`/pub-profile/${sellerId}`)
    }
    setLoading(false)
  }, [collectionId, collections, navigate, sellerId])

  const deleteCollectionHandler = async () => {
    setPublicProfileData((prev) => ({
      ...prev,
      collections: prev.collections.filter(
        (collection) => collection.collectionId !== Number(collectionId),
      ),
    }))
    navigate(`/pub-profile/${sellerId}`)
  }

  const updateCollection = (
    description: string,
    collectionName: string,
    selectedLicenses: number[],
    imagePath: string,
    updatedLicenses: any[],
  ) => {
    // Update collectionData state
    setCollectionData({
      ...collectionData,
      description,
      collectionName,
      selectedLicenses,
      imagePath,
    })

    // Update collections state (assuming collections is an array of collections)
    setPublicProfileData((prev) => ({
      ...prev,
      collections: prev.collections.map((collection) => {
        if (collection.collectionId === collectionData.collectionId) {
          return {
            ...collection,
            description,
            collectionName,
            selectedLicenses,
            imagePath,
          }
        }
        return collection
      }),
    }))

    setLicenses(updatedLicenses)
    setSearchedLicenses(updatedLicenses)
  }

  const fetchLicenses = useCallback(async () => {
    if (collectionData?.selectedLicenses?.length > 0) {
      const { success, data } = await getListedLicensesByIds(
        collectionData.selectedLicenses,
      )
      if (success) {
        setLicenses(data)
        setSearchedLicenses(data)
      } else {
        setLicenses([])
      }
    } else {
      setLicenses([])
    }
  }, [collectionData])

  useEffect(() => {
    fetchLicenses()
  }, [fetchLicenses])

  return (
    <Box display={'flex'} justifyContent={'center'}>
      <Container>
        {collectionData?.imagePath ? (
          <Box
            position={'relative'}
            display={'flex'}
            justifyContent={'center'}
            height={250}
          >
            <CardMedia
              component={'img'}
              image={collectionData?.imagePath}
              sx={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                inset: '0px',
                color: 'transparent',
                visibility: 'visible',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                height: '100%',
                width: '100%',
                top: '0px',
                left: '0px',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(50px)',
                transform: 'translate3d(0px, 0px, 0px)',
                zIndex: 1,
              }}
            />

            <Box
              sx={{
                zIndex: 2,
                width: '100%',
                height: 104,
                background:
                  'linear-gradient(180deg, rgba(17, 17, 17, 0.8) 0%, rgba(17, 17, 17, 0) 100%), linear-gradient(180deg, rgba(0, 0, 0, 0.2) -115.98%, rgba(0, 0, 0, 0) 100%)',
              }}
            ></Box>
          </Box>
        ) : (
          <UploadImageContainer>
            <UploadImage
              sx={{
                height: '100%',
                width: '100%',
                borderRadius: '10px',
              }}
              src={defaultSrc}
            />
          </UploadImageContainer>
        )}

        <Box sx={{ marginLeft: '100px', borderRadius: '12px' }}>
          <PublicAvatarImageContainer sx={{ borderRadius: 'inherit' }}>
            {!loading && (
              <AvatarImage
                src={`${collectionData.imagePath}`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = BrokenAvatar
                }}
                sx={{
                  width: '100%',
                  height: '100%',
                  padding: '0px',
                  border: `8px solid #111111`,
                  borderRadius: '12px',
                }}
              />
            )}
          </PublicAvatarImageContainer>
        </Box>

        <Box sx={{ padding: '0px 100px', mb: 4 }}>
          <Box display={'flex'} justifyContent={'space-between'}>
            {!loading && (
              <Box display={'flex'} flexDirection={'column'} gap={1} pt={2}>
                <Typography
                  variant="h2"
                  sx={{
                    maxWidth: '300px',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textAlign: 'left',
                    color: theme.palette.text.primary,
                  }}
                >
                  {collectionData.collectionName}
                </Typography>

                <Box
                  display={'flex'}
                  alignItems={'center'}
                  sx={{ cursor: 'pointer' }}
                  onClick={() =>
                    window.open(
                      `https://open.spotify.com/artist/${sellerId}`,
                      '_blank',
                      'noreferrer',
                    )
                  }
                >
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: '300px',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textAlign: 'left',
                      color: theme.palette.text.secondary,
                    }}
                  >
                    Created{' '}
                    {new Date(collectionData.createdAt).toLocaleDateString(
                      'en-US',
                      {
                        month: 'long',
                        year: 'numeric',
                      },
                    )}
                    {' . Listings by'}&nbsp;
                  </Typography>
                  <Typography
                    variant="body2"
                    color={theme.palette.success.light}
                  >
                    {sellerName}
                  </Typography>

                  <CardMedia
                    component={'img'}
                    image={OpenBrowserDarkIcon}
                    sx={{ width: 16, height: 16 }}
                  />
                </Box>

                <Typography
                  sx={{
                    fontSize: 14,
                    maxWidth: '300px',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textAlign: 'left',
                    color: theme.palette.text.secondary,
                  }}
                >
                  {collectionData.description}
                </Typography>
              </Box>
            )}

            <Box display="flex" alignItems={'center'} gap={1}>
              <CopyToClipboard
                text={window.location.href}
                onCopy={() => setCopyLinkClicked(true)}
              >
                <Tooltip title={copyLinkClicked ? 'Link Copied' : 'Copy Link'}>
                  <SecondaryButton>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        borderRadius: 2,
                        p: '6px 8px',
                      }}
                    >
                      <CardMedia
                        component={'img'}
                        image={LinkDarkIcon}
                        sx={{ width: 18, height: 18 }}
                      />
                    </Box>
                  </SecondaryButton>
                </Tooltip>
              </CopyToClipboard>

              <SecondaryButton onClick={sharingMenuHandler}>
                <Box
                  display={'flex'}
                  alignItems={'center'}
                  gap={1}
                  sx={{
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  <CardMedia
                    component={'img'}
                    image={ShareDarkIcon}
                    sx={{ width: 18, height: 18 }}
                  />
                  Share
                </Box>
              </SecondaryButton>

              <SharingMenu
                sharedURL={window.location.href}
                open={openSharingMenu}
                anchorEl={anchorE2}
                setAnchorEl={setAnchorE2}
              />

              <SecondaryButton
                onClick={() => setOpenEditCollectionDlg(true)}
                sx={{
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Edit collection
              </SecondaryButton>

              <PrimaryButton onClick={actionMenuHandler}>
                <CardMedia
                  component={'img'}
                  image={ThreeDotDarkIcon}
                  sx={{
                    width: 17,
                    objectFit: 'cover',
                  }}
                />
              </PrimaryButton>

              <CollectionMenu
                open={openActionMenu}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                handler={() => setOpenDeleteCollectionDlg(true)}
              />
            </Box>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ padding: '0px 100px' }}>
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
          {curView === ViewMode.GridView && !loading && (
            <GridContents
              licenses={searchedLicenses}
              handleClickLicnese={(license) => {
                console.log(license)
              }}
            />
          )}
          {curView === ViewMode.ListView && !loading && (
            <ListContents
              listViewType={ListViewTypes.COLLECTIONS_DETAIL}
              licenses={searchedLicenses}
              handler={(license) => console.log(license)}
            />
          )}
        </Box>
      </Container>

      {collectionData && openEditCollectionDlg && (
        <EditCollectionDlg
          collectionId={Number(collectionId)}
          collection={collectionData}
          update={updateCollection}
          open={openEditCollectionDlg}
          setOpen={setOpenEditCollectionDlg}
        />
      )}

      <DeleteCollectionDlg
        open={openDeleteCollectionDlg}
        setOpen={setOpenDeleteCollectionDlg}
        handler={deleteCollectionHandler}
      />
    </Box>
  )
}
