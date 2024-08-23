import { Box, CardMedia, Typography, useTheme } from '@mui/material'
import IconView from 'src/assets/view.svg'
import {
  CommonLicenseDataIF,
  EventTypes,
  LicensingTypes,
  OfferTypes,
  TabTypes,
  accessLevels,
} from 'src/interface'
import GeneralOfferIcon from 'src/assets/images/notifications/general-offer.png'
import CounterOfferIcon from 'src/assets/images/notifications/counter-offer.png'
import PurchasedIcon from 'src/assets/images/notifications/purchased.png'
import EditedIcon from 'src/assets/images/notifications/edited.png'
import ListedIcon from 'src/assets/images/notifications/listed.png'
import SongUnlistedIcon from 'src/assets/images/notifications/song-unlisted.png'
import LicenseTypeUnlistedIcon from 'src/assets/images/notifications/licensetype-unlisted.png'
import CollaboratorAcceptedIcon from 'src/assets/images/notifications/collaborator-accepted.png'
import CollaboratorRejectedIcon from 'src/assets/images/notifications/collaborator-rejected.png'
import { licensingTypeList } from 'src/config'
import useUtils from 'src/hooks/useUtils'
import dayjs from 'dayjs'
import React, { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCommonLicenseData, timeAgo } from 'src/utils/utils'
import { styled } from '@mui/material/styles'
import OfferManager from 'src/components/offerManager'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { GlobalDataContext } from 'src/context/globalDataContext'

const StyledTh = styled(Th)(({ theme }) => ({
  textAlign: 'start',
  padding: '0px 12px',
}))

const StyledTd = styled(Td)(({ theme }) => ({
  padding: '16px 12px',
  textAlign: 'start',
}))

const StyledDescription = styled(Td)(({ theme }) => ({
  textAlign: 'start',
  padding: '16px 12px',
  width: 170,
}))

interface Props {
  activities: Array<any>
}

const ActivityTable = ({ activities }: Props) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const { etherToUsd } = useUtils()
  const [globalData, setGlobalData] = useContext(GlobalDataContext)
  const [offerData, setOfferData] = useState()
  const [commonLicenseData, setCommonLicenseData] =
    useState<CommonLicenseDataIF>()
  const offerRef = useRef<{
    toggleState: () => void
  }>(null)

  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  const rowStyle = {
    border: 'solid 1px #ddd', // Apply border to Td instead of Tr
    borderBottom: 'solid 2px #ddd',
    borderBottomWidth: '2px',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
  }

  const eleStyle = {
    textAlign: 'left',
    padding: '16px',
    borderTop: '1px solid #242424',
  }

  const headerStyle = {
    border: `1px solid ${theme.palette.text.primary}`,
    borderBottom: '2px solid ${theme.palette.text.primary}',
    padding: '5px',
    marginBottom: '10px',
    height: '36px',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    color: theme.palette.text.secondary,
  }

  const viewHandler = (activity) => {
    switch (activity.eventType) {
      case EventTypes.Purchased:
      case EventTypes.OfferPlaced:
      case EventTypes.OfferAccepted:
      case EventTypes.OfferRejected:
      case EventTypes.OfferWithdrawn:
      case EventTypes.OfferEdited:
      case EventTypes.OfferExpired:
        setOfferData({
          listedLicense: activity.listedLicense,
          purchasedTokenURI: activity.offer.tokenURI,
          purchasedSigningData: activity.offer.signingData,
          ...activity.offer,
        })
        setCommonLicenseData(getCommonLicenseData(activity.listedLicense))
        offerRef.current.toggleState()
        break
      case EventTypes.Listed:
      case EventTypes.Edited:
        navigate(`/purchase/${activity.listedId}`)
        break
      case EventTypes.SongUnlisted:
      case EventTypes.LicenseTypeUnlisted:
        break
      case EventTypes.PendingListed:
        break
      case EventTypes.CollaboratorAccepted:
        break
      case EventTypes.CollaboratorRejected:
        break
      default:
        break
    }
  }

  return (
    <Table
      style={{
        marginTop: '24px',
        border: '1px solid #242424',
        borderRadius: '16px',
      }}
    >
      <Thead>
        <Tr style={headerStyle}>
          <StyledTh></StyledTh>
          <StyledTh></StyledTh>
          <StyledTh>License</StyledTh>
          <StyledTh>Price</StyledTh>
          <StyledTh>Expires</StyledTh>
          <StyledTh>From</StyledTh>
          <StyledTh>To</StyledTh>
          <StyledTh>Time</StyledTh>
          <StyledTh>View</StyledTh>
        </Tr>
      </Thead>
      <Tbody>
        {activities.map((activity, idx) => {
          const offerType = activity?.offerType
          const offerName =
            offerType == OfferTypes.GeneralOffer ? 'Offer' : 'Counter Offer'

          const getIcon = (image) => (
            <CardMedia
              component={'img'}
              image={image}
              sx={{
                width: '16px',
              }}
            />
          )

          const getCaption = (licensingTypes) => {
            if (licensingTypes.length > 1) {
              return `${licensingTypes.length} types`
            } else {
              const exl =
                activity.accessLevel != null
                  ? ` · ${accessLevels[activity.accessLevel]}`
                  : ''
              if (activity.licensingTypes[0] === LicensingTypes.All) {
                return 'All Licenses'
              } else {
                return (
                  `${licensingTypeList[activity.licensingTypes[0]].label}` + exl
                )
              }
            }
          }

          const eventTypeToDescriptionAndIcon = {
            [EventTypes.Purchased]: {
              description: 'License Purchased',
              icon: getIcon(PurchasedIcon),
              caption: getCaption(activity.licensingTypes),
            },
            [EventTypes.OfferAccepted]: {
              description: `${offerName} Accepted`,
              icon:
                offerType === OfferTypes.GeneralOffer
                  ? getIcon(GeneralOfferIcon)
                  : getIcon(CounterOfferIcon),
              caption: getCaption(activity.licensingTypes),
            },
            [EventTypes.OfferPlaced]: {
              description: `${offerName} Placed`,
              icon:
                offerType === OfferTypes.GeneralOffer
                  ? getIcon(GeneralOfferIcon)
                  : getIcon(CounterOfferIcon),
              caption: getCaption(activity.licensingTypes),
            },
            [EventTypes.OfferEdited]: {
              description: `${offerName} Edited`,
              icon:
                offerType === OfferTypes.GeneralOffer
                  ? getIcon(GeneralOfferIcon)
                  : getIcon(CounterOfferIcon),
              caption: getCaption(activity.licensingTypes),
            },
            [EventTypes.OfferRejected]: {
              description: `${offerName} Rejected`,
              icon:
                offerType === OfferTypes.GeneralOffer
                  ? getIcon(GeneralOfferIcon)
                  : getIcon(CounterOfferIcon),
              caption: getCaption(activity.licensingTypes),
            },
            [EventTypes.OfferExpired]: {
              description: `${offerName} Expired`,
              icon:
                offerType === OfferTypes.GeneralOffer
                  ? getIcon(GeneralOfferIcon)
                  : getIcon(CounterOfferIcon),
              caption: getCaption(activity.licensingTypes),
            },
            [EventTypes.OfferWithdrawn]: {
              description: `${offerName} Withdrawn`,
              icon:
                offerType === OfferTypes.GeneralOffer
                  ? getIcon(GeneralOfferIcon)
                  : getIcon(CounterOfferIcon),
              caption: getCaption(activity.licensingTypes),
            },
            [EventTypes.Listed]: {
              description: 'License Listed',
              icon: getIcon(ListedIcon),
              caption: getCaption(activity.licensingTypes),
            },
            [EventTypes.PendingListed]: {
              description: 'License Listed (Pending)',
              icon: getIcon(ListedIcon),
              caption: getCaption(activity.licensingTypes),
            },
            [EventTypes.Edited]: {
              description: 'License Edited',
              icon: getIcon(EditedIcon),
              caption: getCaption(activity.licensingTypes),
            },
            [EventTypes.SongUnlisted]: {
              description: 'Song Unlisted',
              icon: getIcon(SongUnlistedIcon),
              caption: getCaption(activity.licensingTypes),
            },
            [EventTypes.LicenseTypeUnlisted]: {
              description: 'License Type Unlisted',
              icon: getIcon(LicenseTypeUnlistedIcon),
              caption: getCaption(activity.licensingTypes),
            },
            [EventTypes.CollaboratorAccepted]: {
              description: 'Collaborator Accepted',
              icon: getIcon(CollaboratorAcceptedIcon),
              caption: getCaption(activity.licensingTypes),
            },
            [EventTypes.CollaboratorRejected]: {
              description: 'Collaborator Rejected',
              icon: getIcon(CollaboratorRejectedIcon),
              caption: getCaption(activity.licensingTypes),
            },
          }

          const { description, icon, caption } =
            eventTypeToDescriptionAndIcon[activity.eventType] || {}
          return (
            <Tr style={rowStyle} key={idx}>
              <StyledTd style={eleStyle}>{icon}</StyledTd>
              <StyledDescription style={eleStyle}>
                {description}
              </StyledDescription>
              <StyledTd style={eleStyle}>
                <Box display={'flex'} alignItems={'center'} gap={'10px'}>
                  <CardMedia
                    component={'img'}
                    image={activity.listedLicense.imagePath}
                    sx={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 1,
                    }}
                  />
                  <Box
                    display={'flex'}
                    flexDirection={'column'}
                    alignItems={'flex-start'}
                    gap={'4px'}
                  >
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontWeight: '600',
                        lineHeight: '13.76px',
                      }}
                    >
                      {activity.listedLicense.licenseName}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: '400',
                        lineHeight: '14.88px',
                        color: theme.palette.text.secondary,
                      }}
                    >
                      {caption}
                    </Typography>
                  </Box>
                </Box>
              </StyledTd>
              <StyledTd style={eleStyle}>
                {activity.offer
                  ? `$${etherToUsd(activity.offer.offerPrice).toLocaleString()}`
                  : '---'}
              </StyledTd>
              <StyledTd style={eleStyle}>
                {activity.offer ? (
                  <>
                    {activity.offer.offerDuration > Date.now()
                      ? `in ${dayjs(activity.offer.offerDuration).diff(
                          dayjs(Date.now()),
                          'day',
                        )} days`
                      : 'Expired'}
                  </>
                ) : (
                  <>---</>
                )}
              </StyledTd>
              <StyledTd style={eleStyle}>
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'flex-start'}
                >
                  {activity.from.map((item, index) => {
                    return (
                      <React.Fragment key={index}>
                        <Box
                          display={'flex'}
                          alignItems={'center'}
                          justifyContent={'flex-end'}
                          gap={0.5}
                          sx={{
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            if (!item.isBuyer) {
                              navigate(`/pub-profile/${item.id}`)
                            } else {
                              navigate(
                                `/info-pub-profile/${item.id}/${activity.listedLicense.sellerId}`,
                              )
                            }
                          }}
                        >
                          <Typography
                            sx={{
                              color: theme.palette.success.light,
                              fontSize: '14px',
                              fontWeight: '400',
                              lineHeight: '20px',
                            }}
                          >
                            {item.userName}
                          </Typography>
                          <CardMedia
                            component={'img'}
                            image={IconView}
                            sx={{
                              width: '12px',
                              height: '12px',
                            }}
                          />
                        </Box>
                      </React.Fragment>
                    )
                  })}
                </Box>
              </StyledTd>
              <StyledTd style={eleStyle}>
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'flex-start'}
                >
                  {activity.to.length == 0 ? (
                    '---'
                  ) : (
                    <>
                      {activity.to.map((item, index) => {
                        return (
                          <React.Fragment key={index}>
                            <Box
                              display={'flex'}
                              alignItems={'center'}
                              justifyContent={'flex-end'}
                              gap={0.5}
                              sx={{ cursor: 'pointer' }}
                              onClick={() => {
                                if (!item.isBuyer) {
                                  navigate(`/pub-profile/${item.id}`)
                                } else {
                                  navigate(
                                    `/info-pub-profile/${item.id}/${activity.listedLicense.sellerId}`,
                                  )
                                }
                              }}
                            >
                              <Typography
                                sx={{
                                  color: theme.palette.success.light,
                                  fontSize: '14px',
                                  fontWeight: '400',
                                  lineHeight: '20px',
                                }}
                              >
                                {item.userName}
                              </Typography>
                              <CardMedia
                                component="img"
                                image={IconView}
                                sx={{
                                  width: '12px',
                                  height: '12px',
                                }}
                              />
                            </Box>
                          </React.Fragment>
                        )
                      })}
                    </>
                  )}
                </Box>
              </StyledTd>
              <StyledTd style={eleStyle}>
                {timeAgo(activity.createdAt)}
              </StyledTd>
              <StyledTd style={eleStyle} onClick={() => viewHandler(activity)}>
                {activity.eventType !== EventTypes.SongUnlisted &&
                  activity.eventType !== EventTypes.LicenseTypeUnlisted && (
                    <CardMedia
                      component={'img'}
                      image={IconView}
                      sx={{
                        width: '12px',
                        height: '12px',
                        cursor: 'pointer',
                      }}
                    />
                  )}
              </StyledTd>
            </Tr>
          )
        })}
        <OfferManager
          ref={offerRef}
          offerData={offerData}
          commonLicenseData={commonLicenseData}
        />
      </Tbody>
    </Table>
  )
}

export default ActivityTable
