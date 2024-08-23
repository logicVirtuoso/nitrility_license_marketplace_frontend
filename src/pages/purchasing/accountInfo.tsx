import React, { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CardMedia,
  Divider,
  Typography,
  useTheme,
} from '@mui/material'
import DescriptionDarkIcon from 'src/assets/images/purchasing/description_dark.png'
import TagDarkIcon from 'src/assets/images/purchasing/tag_dark.png'
import UpArrowDarkIcon from 'src/assets/images/purchasing/up_arrow_dark.png'
import SecondaryButton from 'src/components/buttons/secondary-button'
import { LicensingTypes, TemplateDataIF } from 'src/interface'
import { useNavigate } from 'react-router-dom'
import { getSocialAccounts } from 'src/api'
import { SocialAccountList } from 'src/constants'

interface Props {
  license: any
  licensingType: LicensingTypes
}

export default function AccountInfo({ license, licensingType }: Props) {
  const theme = useTheme()
  const navigate = useNavigate()

  const [syncData, setSyncData] = useState<TemplateDataIF>()
  const [socials, setSocials] = useState<any>(null)

  useEffect(() => {
    const fetchSocialAccounts = async () => {
      getSocialAccounts(license.sellerId).then(({ data }) => setSocials(data))
    }
    fetchSocialAccounts()
  }, [license])

  useEffect(() => {
    if (licensingType !== LicensingTypes.None) {
      switch (licensingType) {
        case LicensingTypes.Creator:
          setSyncData(license.signingData.creator)
          break
        case LicensingTypes.Movie:
          setSyncData(license.signingData.movie)
          break
        case LicensingTypes.Advertisement:
          setSyncData(license.signingData.advertisement)
          break
        case LicensingTypes.VideoGame:
          setSyncData(license.signingData.videoGame)
          break
        case LicensingTypes.TvSeries:
          setSyncData(license.signingData.tvSeries)
          break
        case LicensingTypes.AiTraining:
          setSyncData(license.signingData.aiTraining)
          break
        default:
          navigate('/')
          break
      }
    }
  }, [license, licensingType, navigate])

  return (
    <Box bgcolor={theme.palette.secondary.main} borderRadius={3}>
      {syncData && (
        <>
          <Box display={'flex'} alignItems={'center'} gap={1} p={2}>
            <CardMedia
              component={'img'}
              image={DescriptionDarkIcon}
              sx={{
                width: 18,
                objectFit: 'cover',
              }}
            />
            <Typography variant="h5" color={theme.palette.text.primary}>
              Usage Details
            </Typography>
          </Box>
          <Divider />
          <Typography
            color={theme.palette.text.secondary}
            variant="subtitle1"
            p={2}
          >
            {syncData.usageNotes}
          </Typography>
          <Divider />
        </>
      )}

      {license.genres.length > 0 && (
        <>
          <Accordion
            sx={{
              marginBottom: '1px',
              bgcolor: theme.palette.secondary.main,
              backgroundImage: 'inherit',
              '&::before': {
                display: 'none',
              },
              '&::after': {
                display: 'none',
              },
              '&.Mui-expanded': {
                margin: '0px 0px 1px 0px',
              },
              '&.MuiAccordion-root': {
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
              },
            }}
          >
            <AccordionSummary
              expandIcon={
                <CardMedia
                  component={'img'}
                  image={UpArrowDarkIcon}
                  sx={{
                    width: 15,
                    objectFit: 'cover',
                    transform: 'rotate(180deg)',
                  }}
                />
              }
              aria-controls="tag-content"
              id="tag-header"
              sx={{
                height: 54,
                minHeight: '54px !important',
                '& .MuiAccordionSummary-content.Mui-expanded': {
                  margin: '16px 0px',
                },
              }}
            >
              <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Box display={'flex'} alignItems={'center'} gap={1}>
                  <CardMedia
                    component={'img'}
                    image={TagDarkIcon}
                    sx={{
                      width: 15,
                      objectFit: 'cover',
                    }}
                  />

                  <Typography variant="h5" color={theme.palette.text.primary}>
                    Tags
                  </Typography>
                </Box>
              </Box>
            </AccordionSummary>
            <Divider />
            <AccordionDetails
              sx={{
                height: 54,
                minHeight: '54px !important',
                display: 'flex',
                alignItems: 'center',
                p: 2,
              }}
            >
              <Box display={'flex'} alignItems={'center'} gap={1}>
                {license.genres.map((genre, idx) => (
                  <Typography
                    key={idx}
                    variant="subtitle1"
                    sx={{
                      p: '4px 8px',
                      backgroundColor: theme.palette.grey[600],
                      color: theme.palette.text.secondary,
                      borderRadius: 1.5,
                    }}
                  >
                    {genre}
                  </Typography>
                ))}
                <Typography
                  variant="subtitle1"
                  sx={{
                    p: '4px 8px',
                    backgroundColor: theme.palette.grey[600],
                    color: theme.palette.text.secondary,
                    borderRadius: 1.5,
                  }}
                >
                  Edgy
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        </>
      )}

      {(syncData || license.genres.length > 0) && <Divider />}

      <Accordion
        sx={{
          marginBottom: '1px',
          bgcolor: theme.palette.secondary.main,
          backgroundImage: 'inherit',
          '&::before': {
            display: 'none',
          },
          '&::after': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '0px 0px 1px 0px',
          },
          '&.MuiAccordion-root': {
            borderRadius: '12px',
          },
        }}
      >
        <AccordionSummary
          expandIcon={
            <CardMedia
              component={'img'}
              image={UpArrowDarkIcon}
              sx={{
                width: 15,
                objectFit: 'cover',
                transform: 'rotate(180deg)',
              }}
            />
          }
          aria-controls="accountInfo-content"
          id="accountInfo-header"
          sx={{
            height: 54,
            minHeight: '54px !important',
            '& .MuiAccordionSummary-content.Mui-expanded': {
              margin: '16px 0px',
            },
          }}
        >
          <Box display={'flex'} alignItems={'center'} gap={1}>
            <CardMedia
              component={'img'}
              image={license.avatarPath}
              sx={{
                width: 18,
                borderRadius: '100%',
                objectFit: 'cover',
              }}
            />
            <Typography>{`About ${license.sellerName}`}</Typography>
          </Box>
        </AccordionSummary>
        <Divider />
        <AccordionDetails
          sx={{
            height: 74,
            display: 'flex',
            alignItems: 'center',
            p: 0,
          }}
        >
          <Box display={'flex'} alignItems={'center'} gap={1} p={2}>
            {socials &&
              Object.entries(socials).map(([platform, url], idx) => {
                if (url && url != '') {
                  return (
                    <SecondaryButton
                      key={idx}
                      sx={{
                        width: 42,
                        height: 42,
                        backgroundColor: theme.palette.grey[600],
                      }}
                      onClick={() => window.open(url as unknown as string)}
                    >
                      <CardMedia
                        component={'img'}
                        image={SocialAccountList[platform].icon}
                        sx={{
                          width: 18,
                          objectFit: 'cover',
                        }}
                      />
                    </SecondaryButton>
                  )
                } else {
                  return <React.Fragment key={idx}></React.Fragment>
                }
              })}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}
