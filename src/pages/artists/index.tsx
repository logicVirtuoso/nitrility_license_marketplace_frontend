import { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Typography,
  useTheme,
  styled,
  CardMedia,
} from '@mui/material'
import { artistOptions } from 'src/config'
import { getTopArtist } from 'src/api'
import { TabButton } from 'src/components/buttons'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

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
}))

const Artists = () => {
  const theme = useTheme()
  const [selOption, setSelOption] = useState(artistOptions[3])
  const [artists, setArtists] = useState<Array<any>>([])

  useEffect(() => {
    const fetchArtists = async () => {
      const time = artistOptions.find((item) => item === selOption)
      const { success, data } = await getTopArtist(time.value)
      console.log(data)
      if (success) setArtists(data)
    }
    fetchArtists()
  }, [selOption])

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Box className="container" mt={15}>
        <Box display={'flex'} flexDirection={'column'} mb={2} gap={2}>
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
          >
            <Typography
              sx={{
                fontSize: '32px',
                fontWeight: '600',
                fontFamily: 'var(--font-semi-bold)',
              }}
            >
              All Top Aritsts
            </Typography>

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
                        selected={selOption === item}
                        onClick={() => {
                          setSelOption(item)
                        }}
                        sx={{ width: idx === 2 || idx === 1 ? '97px' : '78px' }}
                      >
                        {item.label}
                      </TabButton>
                    )
                  })}
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              width: '100%',
            }}
          >
            <Grid container>
              <Grid item xs={12}>
                <Table>
                  <Thead>
                    <Tr>
                      <StyledTh width={'10%'}>Rank</StyledTh>
                      <StyledTh width={'80%'}>Artist</StyledTh>
                      <StyledTh width={'10%'}>Songs</StyledTh>
                    </Tr>
                  </Thead>
                  {artists.length > 0 &&
                    artists.map((item, idx) => {
                      return (
                        <StyledTbody key={idx}>
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
                                image={item.avatarPath}
                              />
                              <Typography
                                sx={{
                                  fontFamily: 'var(--font-bold)',
                                  fontSize: '16px',
                                }}
                              >
                                {item.sellerName}
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
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Artists
