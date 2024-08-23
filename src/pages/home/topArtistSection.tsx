import {
  Box,
  CardMedia,
  Grid,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material'
import React from 'react'
import { artistOptions } from 'src/config'
import { getTopArtist } from '../../api'
import { randomRange } from 'src/utils/utils'
import { TabButton } from 'src/components/buttons'
import './style.css'
import NothingHere from 'src/components/nothing'
import { styled } from '@mui/material/styles'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import SecondaryButton from 'src/components/buttons/secondary-button'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { useNavigate } from 'react-router-dom'
import useUtils from 'src/hooks/useUtils'

const StyledTd = styled(Td)(({ theme }) => ({
  fontFamily: 'var(--font-black)',
  fontSize: '16px',
  color: theme.palette.text.primary,
}))

const RankTd = styled(StyledTd)(({ theme }) => ({
  fontFamily: 'var(--font-bold)',
  fontSize: '16px',
}))

const ArtistTd = styled(StyledTd)(({ theme }) => ({
  fontFamily: 'var(--font-bold)',
  display: 'flex',
  alignItems: 'center',
  gap: 20,
  padding: '8px 0px',
}))

const SongsTd = styled(StyledTd)(({ theme }) => ({
  fontFamily: 'var(--font-bold)',
  fontSize: '16px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}))

const StyledTh = styled(Th)(({ theme }) => ({
  fontFamily: 'var(--font-base)',
  fontWeight: 400,
  fontSize: '14px',
  color: theme.palette.text.secondary,
  textAlign: 'left',
  py: '8px',
}))

const StyledTbody = styled(Tbody)(({ theme }) => ({
  borderTop: `1px solid #ffff`,
  padding: '4px 8px',
  cursor: 'pointer',
}))

const AristCardLoader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px',
      }}
    >
      <Skeleton variant="circular" width={64} height={64} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          marginLeft: '20px',
          justifyContent: 'center',
        }}
      >
        <Skeleton
          variant="rectangular"
          width={100}
          height={20}
          sx={{ marginBottom: '10px' }}
        />
        <Skeleton variant="rectangular" width={100} height={20} />
      </Box>
    </Box>
  )
}

interface TabNameIF {
  label: string
  value: string
}

export default function TopArtistSection() {
  const theme = useTheme()
  const navigate = useNavigate()
  const [topArtists, setTopArtists] = React.useState<Array<any>>([])
  const [loadTopArtist, setLoadTopArtist] = React.useState<boolean>(true)
  const [selectedTopOption, setSelectedTopOption] = React.useState<TabNameIF>(
    artistOptions[3],
  )

  const { goToProfilePage } = useUtils()

  React.useEffect(() => {
    const getTrendingTop = async () => {
      const time = artistOptions.find((item) => item === selectedTopOption)
      setLoadTopArtist(true)
      const { success, data } = await getTopArtist(time.value)
      if (success) setTopArtists(data)
      setLoadTopArtist(false)
    }
    getTrendingTop()
  }, [selectedTopOption])

  return (
    <Box>
      <Box display={'flex'} justifyContent={'space-between'} mb={3}>
        <Box display={'flex'} justifyContent={'flex-start'} height={'100%'}>
          <Box
            mb={2.5}
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography
              variant="h3"
              fontFamily={'var(--font-semi-bold)'}
              color={theme.palette.text.primary}
            >
              Top Artists
            </Typography>
          </Box>
        </Box>
        <Box
          display={'flex'}
          alignItems={'center'}
          ml={'auto'}
          height={'100%'}
          gap={1}
        >
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignItems={'center'}
            height={37}
            overflow={'hidden'}
            borderRadius={'10px'}
            padding={'2px'}
            bgcolor={theme.palette.secondary.main}
          >
            <Box
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              height={'100%'}
              overflow={'hidden'}
              borderRadius={'12px'}
              padding={'2px'}
            >
              {artistOptions.map((item, idx) => {
                return (
                  <TabButton
                    key={idx}
                    selected={selectedTopOption === item}
                    onClick={() => {
                      setSelectedTopOption(item)
                    }}
                    sx={{ width: idx === 2 || idx === 1 ? '97px' : '78px' }}
                  >
                    {item.label}
                  </TabButton>
                )
              })}
            </Box>
          </Box>
          <SecondaryButton
            sx={{
              height: 35,
              border: 'none',
              backgroundColor: theme.palette.secondary.main,
              '&:hover': {
                backgroundColor: theme.palette.containerPrimary.main,
              },
            }}
          >
            <Typography
              fontSize={'14px'}
              color={theme.palette.text.secondary}
              onClick={() => navigate('/artists')}
            >
              View all
            </Typography>
          </SecondaryButton>
        </Box>
      </Box>
      <Box sx={{ width: '100%' }}>
        {!loadTopArtist ? (
          <>
            {topArtists?.length > 0 ? (
              <Grid container spacing={4}>
                <Grid item xs={6}>
                  <Table>
                    <Thead>
                      <Tr>
                        <StyledTh width={'10%'}>Rank</StyledTh>
                        <StyledTh width={'80%'}>Artist</StyledTh>
                        <StyledTh width={'10%'}>Songs</StyledTh>
                      </Tr>
                    </Thead>
                    {topArtists.slice(0, 3).map((item, idx) => {
                      return (
                        <StyledTbody
                          key={idx}
                          onClick={() => goToProfilePage(item.sellerId)}
                        >
                          <Tr>
                            <RankTd width={'10%'}>{idx + 1}</RankTd>
                            <ArtistTd width={'80%'}>
                              <CardMedia
                                component={'img'}
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: '100%',
                                  bgcolor: '#ffffff',
                                }}
                                image={item.sellerData?.avatarPath}
                              />
                              <Typography
                                sx={{
                                  fontFamily: 'var(--font-bold)',
                                  fontSize: '16px',
                                }}
                              >
                                {item.sellerData?.sellerName}
                              </Typography>
                            </ArtistTd>
                            <SongsTd>{item.countOfLicenses}</SongsTd>
                          </Tr>
                        </StyledTbody>
                      )
                    })}
                  </Table>
                </Grid>
                <Grid item xs={6}>
                  <Table>
                    <Thead>
                      <Tr>
                        <StyledTh width={'10%'}>Rank</StyledTh>
                        <StyledTh width={'80%'}>Artist</StyledTh>
                        <StyledTh width={'10%'}>Songs</StyledTh>
                      </Tr>
                    </Thead>
                    {topArtists.slice(4, 7).map((item, idx) => {
                      return (
                        <StyledTbody
                          key={idx}
                          onClick={() => goToProfilePage(item.sellerId)}
                        >
                          <Tr>
                            <RankTd width={'10%'}>{idx + 5}</RankTd>
                            <ArtistTd width={'80%'}>
                              <CardMedia
                                component={'img'}
                                sx={{
                                  width: 48,
                                  height: 48,
                                  borderRadius: '100%',
                                  bgcolor: '#ffffff',
                                }}
                                image={item.sellerData.avatarPath}
                              />
                              <Typography
                                sx={{
                                  fontFamily: 'var(--font-bold)',
                                  fontSize: '16px',
                                }}
                              >
                                {item.sellerData.sellerName}
                              </Typography>
                            </ArtistTd>
                            <SongsTd width={'10%'}>
                              {item.countOfLicenses}
                            </SongsTd>
                          </Tr>
                        </StyledTbody>
                      )
                    })}
                  </Table>
                </Grid>
              </Grid>
            ) : (
              <NothingHere />
            )}
          </>
        ) : (
          <Grid container spacing={2}>
            {[0, 1, 2].map((key) => {
              return (
                <Grid item xs={4} key={key}>
                  {randomRange(4).map((idx) => (
                    <AristCardLoader key={idx} />
                  ))}
                </Grid>
              )
            })}
          </Grid>
        )}
      </Box>
    </Box>
  )
}
