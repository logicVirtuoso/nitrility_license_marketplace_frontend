import React, {
  useState,
  useEffect,
  useContext,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { Box, Typography } from '@mui/material'
import OutlinedInput from '@mui/material/OutlinedInput'
import { makeStyles } from '@mui/styles'
import { Theme, useTheme } from '@mui/material/styles'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import NotificationsTable from './notificationsTable'
import { useSelector } from 'react-redux'
import { SOCIAL_MEDIA_PLATFORMS } from '../../../config'
import { getNotifications } from '../../../api/notification'
import { NotificationTypes } from 'src/actions/actionTypes'
import NothingHere from 'src/components/nothing'
import { AuthType } from 'src/store/reducers/authorizationReducer'

const useStyles = makeStyles(() => ({
  input: {
    height: '50px',
    width: '150px !important',
    marginRight: '20px',
  },
}))

enum LicenseTypes {
  All = -1,
  Music = 0,
  Patent,
  Video,
}

const TypeOfMedia = [
  { label: 'All Licenses', value: LicenseTypes.All },
  { label: 'Music Licenses', value: LicenseTypes.Music },
  { label: 'Patent Licenses', value: LicenseTypes.Patent },
  { label: 'Video Licenses', value: LicenseTypes.Video },
]

const TypeOfSale = [
  { label: 'All', value: NotificationTypes.None },
  { label: 'Sales', value: NotificationTypes.PurchasingOrSale },
  { label: 'Offers', value: NotificationTypes.Offer },
]

interface MediaInterface {
  label: string
  value: LicenseTypes
}

interface SalesInterface {
  label: string
  value: NotificationTypes
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 150,
    },
  },
}

const NotificationsPage = React.forwardRef((props, ref) => {
  const classes = useStyles()
  const [mediaType, setMediaType] = useState<MediaInterface>(TypeOfMedia[0])
  const [saleType, setSaleType] = useState<SalesInterface>(TypeOfSale[0])
  const [accountAddress, setWalletAddress] = useState<string | null>(null)
  const [sellerId, setsellerId] = useState<string | null>(null)
  const [platformType, setPlatformType] = useState<string>(
    SOCIAL_MEDIA_PLATFORMS[0],
  )
  const [notifications, setNotifications] = useState<Array<any>>()
  const [filteredNotifications, setfilteredNotifications] =
    useState<Array<any>>()

  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  const platformHandler = (event: SelectChangeEvent<typeof platformType>) => {
    const {
      target: { value },
    } = event
    setPlatformType(value)
  }

  const mediaHandler = (event: SelectChangeEvent<any>) => {
    const {
      target: { value },
    } = event
    setMediaType(value)
    if (
      event.target.value.value !== LicenseTypes.All &&
      event.target.value.value !== LicenseTypes.Music
    ) {
      const tmpNotification = notifications?.filter(
        (item) => item?.licenseType === event.target.value.value,
      )
      setfilteredNotifications(tmpNotification)
    } else {
      setfilteredNotifications(notifications)
    }
  }

  const saleHandler = (event: SelectChangeEvent<any>) => {
    setSaleType(event.target.value)
    if (event.target.value.value !== NotificationTypes.None) {
      const tmpNotification = notifications?.filter(
        (item) => item.type === event.target.value.value,
      )
      setfilteredNotifications(tmpNotification)
    } else {
      setfilteredNotifications(notifications)
    }
  }

  useEffect(() => {
    setWalletAddress(authorization?.currentUser?.accountAddress)
  }, [authorization?.currentUser?.accountAddress])

  useEffect(() => {
    setsellerId(authorization?.currentUser?.sellerId)
  }, [authorization?.currentUser?.sellerId])

  useEffect(() => {
    const init = async () => {
      if (accountAddress) {
        const notificationRes = await getNotifications(accountAddress, sellerId)
        if (notificationRes?.status === 200 && notificationRes?.data.success) {
          setNotifications(notificationRes.data.data)
          setfilteredNotifications(notificationRes.data.data)
        }
      }
    }
    if (accountAddress && accountAddress !== '') init()
  }, [accountAddress, sellerId])

  const searchHandler = async (value) => {
    if (!value || value === '') {
      setfilteredNotifications(notifications)
    } else {
      const filterd = notifications.filter((notification) => {
        if (
          notification.description.toLowerCase() === value.toLowerCase() ||
          notification.description.toLowerCase().includes(value.toLowerCase())
        ) {
          return true
        } else {
          return false
        }
      })
      setfilteredNotifications(filterd)
    }
  }

  useImperativeHandle(ref, () => ({
    searchHandler,
  }))

  return (
    <Box sx={{ mt: 2 }}>
      {filteredNotifications?.length > 0 ? (
        <>
          <Box sx={{ display: 'flex' }}>
            <Select
              value={mediaType.label}
              onChange={mediaHandler}
              input={
                <OutlinedInput
                  sx={{
                    width: '100%',
                    textAlign: 'left',
                  }}
                />
              }
              renderValue={(selected) => {
                return selected
              }}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
              className={classes.input}
            >
              {(TypeOfMedia as any).map((media, idx) => (
                <MenuItem key={idx} value={media}>
                  {media.label}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={platformType}
              onChange={platformHandler}
              input={
                <OutlinedInput
                  sx={{
                    width: '100%',
                    textAlign: 'left',
                  }}
                />
              }
              renderValue={(selected) => {
                return selected
              }}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
              className={classes.input}
            >
              {SOCIAL_MEDIA_PLATFORMS.map((media, idx) => (
                <MenuItem key={idx} value={media}>
                  {media}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={saleType.label}
              onChange={saleHandler}
              input={
                <OutlinedInput
                  sx={{
                    width: '100%',
                    textAlign: 'left',
                  }}
                />
              }
              renderValue={(selected) => {
                return selected
              }}
              MenuProps={MenuProps}
              inputProps={{ 'aria-label': 'Without label' }}
              className={classes.input}
            >
              {(TypeOfSale as any).map((media, idx) => (
                <MenuItem key={idx} value={media}>
                  {media.label}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <NotificationsTable notifications={filteredNotifications} />
        </>
      ) : (
        <NothingHere />
      )}
    </Box>
  )
})
export default NotificationsPage
