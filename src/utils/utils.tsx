import { BigNumber } from 'bignumber.js'
import dayjs from 'dayjs'
import jwtDecode from 'jwt-decode'
import { ACCESS_TOKEN } from 'src/config'
import {
  EventTypes,
  LicensingTypes,
  AccessLevel,
  SigningDataIF,
  OfferTypes,
} from 'src/interface'
import { store } from 'src/store'

interface ExternalAuth {
  client_id: string
  client_secret: string
  callback_url: string
}

export const Google: ExternalAuth = {
  client_id:
    '752159418316-1p9qaetpv55qkt3obvm17j1s8efmpnbr.apps.googleusercontent.com',
  client_secret: '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',
  callback_url: `https://nitrility-ui.vercel.app/google-auth`,
}

export const truncateAddress = (address) => {
  const length = address.length
  return address.substr(0, 6) + '...' + address.substr(length - 4, length)
}

export const randomRange = (lg: number) => {
  const results = []
  const possibleValues = Array.from({ length: lg }, (value, i) => i)

  for (let i = 0; i < lg; i += 1) {
    const possibleValuesRange = lg - (lg - possibleValues.length)
    const randomNumber = Math.floor(Math.random() * possibleValuesRange)
    const normalizedRandomNumber =
      randomNumber !== possibleValuesRange ? randomNumber : possibleValuesRange

    const [nextNumber] = possibleValues.splice(normalizedRandomNumber, 1)

    results.push(nextNumber)
  }

  return results
}

export const truncateVal = (val: string) => {
  const length = val?.length
  if (length >= 20) {
    return val.substr(0, 4) + '...' + val.substr(length - 4, length)
  } else {
    return val?.toLocaleString()
  }
}

export const checkIfOfferEvent = (eventType: EventTypes) => {
  let bValid = true
  switch (eventType) {
    case EventTypes.OfferPlaced:
    case EventTypes.OfferAccepted:
    case EventTypes.OfferRejected:
    case EventTypes.OfferWithdrawn:
      bValid = true
      break
    default:
      bValid = false
      break
  }
  return bValid
}

export const convertHistoryTypeToAction = (history, licenseName, price) => {
  let action = ''
  const { licensingType, eventType, accessLevel } = history

  switch (eventType) {
    case EventTypes.Listed:
      action = action + 'listed a'
      break
    case EventTypes.Edited:
      action = action + 'edited a'
      break
    case EventTypes.SongUnlisted:
      action = action + 'unlisted a'
      break
    case EventTypes.OfferPlaced:
      action = `made a bid offer of $${price} for a`
      break
    case EventTypes.OfferAccepted:
      action = action + 'accepted offer for a'
      break
    case EventTypes.OfferRejected:
      action = action + 'declined offer for a'
      break
    case EventTypes.OfferWithdrawn:
      action = action + 'deleted offer for a'
      break
    default:
      break
  }

  switch (accessLevel) {
    case AccessLevel.NonExclusive:
      action = action + 'Non Exclusive'
      break
    case AccessLevel.Exclusive:
      action = action + 'Exclusive'
      break
    default:
      action = action
      break
  }

  switch (licensingType) {
    case LicensingTypes.Creator:
      action += ` Creator license ${licenseName}`
      break
    case LicensingTypes.Movie:
      action += ` Movie license ${licenseName}`
      break
    case LicensingTypes.Advertisement:
      action += ` Advertisement license ${licenseName}`
      break
    case LicensingTypes.VideoGame:
      action += ` Video Game license ${licenseName}`
      break
    case LicensingTypes.TvSeries:
      action += ` Tv Series license ${licenseName}`
      break
    default:
      break
  }
  return action
}

export function formatMilliseconds(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  const formattedMinutes = minutes.toString().padStart(2, '0')
  const formattedSeconds = seconds.toString().padStart(2, '0')

  return `${formattedMinutes}:${formattedSeconds}`
}

export function calculateRemainedMonths(milliseconds: number) {
  const exclusiveEndTime = dayjs(milliseconds)
  const now = dayjs()
  const monthsRemaining = exclusiveEndTime.diff(now, 'month')
  return monthsRemaining
}

export const getSyncData = (
  licensingType: LicensingTypes,
  signingData: SigningDataIF,
) => {
  let data
  switch (Number(licensingType)) {
    case LicensingTypes.Creator:
      data = signingData.creator
      break
    case LicensingTypes.Movie:
      data = signingData.movie
      break
    case LicensingTypes.Advertisement:
      data = signingData.advertisement
      break
    case LicensingTypes.VideoGame:
      data = signingData.videoGame
      break
    case LicensingTypes.TvSeries:
      data = signingData.tvSeries
      break
    case LicensingTypes.AiTraining:
      data = signingData.aiTraining
      break
    default:
      break
  }
  return data
}

export function roundAt18thDecimal(num: number) {
  const decimals = 18
  let smallestUnit = num * Math.pow(10, decimals)
  smallestUnit = Math.floor(smallestUnit)
  const number = new BigNumber(smallestUnit.toString())
  return number
}

export function timeAgo(timestamp: number): string {
  const now = new Date()
  const time = new Date(timestamp + new Date().getTimezoneOffset())

  // Calculate the difference in milliseconds
  const diff = now.getTime() - time.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`
  }
}

export function convertUtcToLocalTime(utcTime: number) {
  // Create a Date object with the UTC time
  const date = new Date(utcTime)

  // Format the date using toLocaleString() with options
  const formattedDate = date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    // hour: 'numeric',
    // minute: 'numeric',
    // hour12: true,
    // timeZoneName: 'short',
  })

  // Extract the timezone abbreviation from the formatted date
  const timeZoneAbbreviation = formattedDate.split(' ').pop()

  // Remove the timezone abbreviation from the formatted date
  const dateWithoutTimeZone = formattedDate.replace(
    ` ${timeZoneAbbreviation}`,
    '',
  )

  // Combine date and timezone abbreviation
  const finalFormattedDate = `${dateWithoutTimeZone} ${timeZoneAbbreviation}`

  return finalFormattedDate
}

export const updateStore = async (
  type: string,
  accessToken: string,
  updateLocalStorage = true,
) => {
  const decodedToken: any = jwtDecode(accessToken)
  const payload = decodedToken.payload
  if (updateLocalStorage) {
    window.localStorage.setItem(ACCESS_TOKEN, accessToken)
  }
  store.dispatch({
    type,
    payload: {
      id: payload.id,
      firstName: payload.firstName,
      lastName: payload.lastName,
      accountAddress: payload.accountAddress,
      sellerId: payload.sellerId,
      sellerName: payload.sellerName,
      role: payload.role,
      idenfies: payload.idenfies,
      loggedTime: payload.loggedTime,
    },
  })
}

export const getCommonLicenseData = (licenseData) => {
  return {
    listedId: licenseData.listedId,
    tokenURI: licenseData.tokenURI,
    albumName: licenseData.albumName,
    albumId: licenseData.albumId,
    sellerName: licenseData.sellerName,
    sellerId: licenseData.sellerId,
    avatarPath: licenseData.avatarPath,
    licenseName: licenseData.licenseName,
    imagePath: licenseData.imagePath,
    previewUrl: licenseData.previewUrl,
    trackId: licenseData.trackId,
    genres: licenseData.genres,
    artists: licenseData.artists,
    sellerAddress: licenseData.sellerAddress,
  }
}

export const generateRGBValue = (idx: number) => {
  const tIndex = idx + 300
  const red = (tIndex * 37) % 256 // Adjust red component based on index
  const green = (tIndex * 73) % 256 // Adjust green component based on index
  const blue = (tIndex * 97) % 256 // Adjust blue component based on index

  const rgbColor = `rgb(${red}, ${green}, ${blue})`
  return rgbColor
}

export const getDeviceInfo = () => {
  const deviceInfo = {
    appName: navigator.appName,
    appVersion: navigator.appVersion,
    userAgent: navigator.userAgent,
    platform: navigator.platform,
  }

  return deviceInfo
}
