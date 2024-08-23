import twitchSvg from './assets/twitch.svg'
import spotifySvg from './assets/spotify.svg'
import { CardMedia } from '@mui/material'
import { LicensingTypes } from 'src/interface'

export const API_URL = process.env.REACT_APP_SERVER
export const APP_UI_URL = process.env.REACT_APP_UI_URL
export const AUTH_REDIRECTED_URL = `${process.env.REACT_APP_UI_URL}/register`
export const ACCOUNT_SETTING_REDIRECTED_URL = `${process.env.REACT_APP_UI_URL}/settings`
export const WITHDRAW_REDIRECTED_URL = `${process.env.REACT_APP_UI_URL}/private`
export const PROFILE_REDIRECTED_URL = `${process.env.REACT_APP_UI_URL}/pub-profile`
export const CLIENT_URL = `${process.env.REACT_APP_UI_URL}`
export const FACTORY_ADDR = process.env.REACT_APP_FACTORY_ADDRESS
export const AUCTION_ADDR = process.env.REACT_APP_AUCTION_ADDRESS
export const IPFS_METADATA_API_URL = process.env.REACT_APP_IPFS_METADATA
export const THEGRAPH_URL = process.env.REACT_APP_THEGRAPH_URL

export const MAGIC_API_KEY = process.env.REACT_APP_MAGIC_API_KEY
export const SPOTIFY_CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID
export const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID
export const ACCESS_TOKEN = 'nitrility-access-token'
export const LOGGED_ID = 'logged_id'
export const ADD_TO_CART = 'add-to-cart'
export const REPORT_KEY = 'wallet-address:report'
export const TAB_KEY = 'profile-tab'
export const OFFER_TAB_KEY = 'offer-tab'
export const SPOTIFY_TOKEN = 'spoity-access-token'
export const MAGIC_USER_INFO = 'magic-user-info'
export const THEME_MODE = 'theme_type'
export const TIME_OUT = 30 * 60 * 1000 //30 mins
export const EXPIRATION_TIME = 24 * 60 * 60 * 1000 // 24hours
export const GOOGLE_MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY
export const S3_BUCKET = process.env.REACT_APP_S3_BUCKET
export const RPC_URL = process.env.REACT_APP_RPC_URL
export const CHAIN_ID = process.env.REACT_APP_CHAIN_ID
export const PRICE_FEED_ADDRESS = process.env.REACT_APP_PRICE_FEED_ADDRESS

export const SOCIAL_MEDIA_PLATFORMS = [
  'All',
  'Youtube',
  'Twitter',
  'Twitch',
  'Instagram',
]

export const RECORDLABEL_OPTIONS = [
  'Sony Music',
  'Warner Music',
  'Universal Music',
]

export enum SectionTypes {
  None = -1,
  AddLicenseShowcaseSection,
  AddImageSection,
  AddMusicPreviewSection,
  AddDescriptionSection,
  AddVideoSection,
  AddAccountSection,
}

export enum SizeTypes {
  None = -1,
  Large = 0,
  Medium,
  Small,
}

export enum LicenseChangeTypes {
  Listing = 0,
  Adjust = 1,
  Approved = 2,
  Rejected = 3,
  Unlisted = 4,
}

export enum LicenseStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

export enum SellerAccountType {
  Spotify = 'Spotify',
}

export const SellerAccountTypeList = [SellerAccountType.Spotify]

export const totalPlatforms = [
  'Spotify',
  'USPTO',
  'Apple Music',
  'CruncyRoll',
  'Twitter',
  'YouTube',
  'Instagram',
  'Twitch',
  'Linkedin',
  'TikTok',
  'Facebook',
  'Roblox',
]

export const listingFormatTypes = {
  bid: 0,
  price: 1,
  bidAndPrice: 2,
}

export enum AccountTypes {
  Instagram = 0,
  Twitter,
  Website,
  YouTube,
  Spotify,
  Twitch,
}

export enum EthereumMsg {
  onlyOwner = 'Only Artist',
  balance = 'Balance should be larger than 0',
  rejected = 'user rejected transaction',
}

export const trendingTimeOptions = [
  { label: 'All time', value: 1 },
  { label: '1h', value: 1 },
  { label: '6h', value: 6 },
  { label: '24h', value: 24 },
  { label: '7d', value: 7 * 24 },
]

export const likedOptions = [
  { label: 'Date added', value: 'Date added' },
  { label: 'Name', value: 'Name' },
]

export const artistOptions = [
  { label: 'Today', value: 'Today' },
  { label: 'This week', value: 'This week' },
  { label: 'This month', value: 'This month' },
  { label: 'All time', value: 'All time' },
]

export const topTimeOptions = [
  { label: 'All time', value: 1 },
  { label: '1h', value: 1 },
  { label: '6h', value: 6 },
  { label: '24h', value: 24 },
  { label: '7d', value: 7 * 24 },
  { label: '30d', value: 30 * 24 },
]

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
export const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

export const licensingTypeList = [
  {
    key: 'creator',
    type: LicensingTypes.Creator,
    label: 'Creator',
    fLine:
      'Grants license holders permission to synchronize music with their content.',
    sLine:
      'This license will last indefinitely for any buyer and will apply only to the specific content it is licensed for.',
  },
  {
    key: 'advertisement',
    type: LicensingTypes.Advertisement,
    label: 'Advertisement',
    fLine:
      'Grants license holders permission to synchronize music with visual content in an advertisement.',
    sLine:
      'This license will last indefinitely for any buyer and will apply only to the specific AD it is licensed for.',
  },
  {
    key: 'tvSeries',
    type: LicensingTypes.TvSeries,
    label: 'TV Series',
    fLine:
      'Grants license holders permission to synchronize music with visual content in a single episode of a TV Series.',
    sLine:
      'This license will last indefinitely for any buyer and will apply only to the specific episode it is licensed for.',
  },
  {
    key: 'movie',
    type: LicensingTypes.Movie,
    label: 'Movie',
    fLine:
      'Grants license holders permission to synchronize music with visual content in film productions.',
    sLine:
      'This license will last indefinitely for any buyer and will apply only to the specific movie it is licensed for.',
  },
  {
    key: 'videoGame',
    type: LicensingTypes.VideoGame,
    label: 'Video Game',
    fLine:
      'Grants license holders permission to synchronize music with visual content in a video game.',
    sLine:
      ' This license will last indefinitely for any buyer and will apply only to the specific game it is licensed for.',
  },
  {
    key: 'aiTraining',
    type: LicensingTypes.AiTraining,
    label: 'AI Training',
    fLine:
      'Grants license holders permission to use the music for training artificial intelligence models.',
    sLine:
      'This license will last indefinitely for any buyer and will apply only to the specific model it is licensed for.',
  },
]

export const contentLabels = [
  {
    title: '',
    titlePlaceholder: '',
    platforms: '',
    platformsPlaceholder: '',
    description: '',
    descriptionPlaceholder: '',
  },
  {
    title: 'Advertisement Title',
    titlePlaceholder: 'Your content’s title',
    platforms: 'Intended Platforms',
    platformsPlaceholder: 'E.g. TV Ad, Presentation',
    description: 'Content Description',
    descriptionPlaceholder: 'Describe your production',
  },
  {
    title: 'TV Series Title and Episode #',
    titlePlaceholder: 'One Piece Episode 1',
    platforms: 'Intended Use of Song',
    platformsPlaceholder: 'E.g. Opening credits',
    description: 'Content Description',
    descriptionPlaceholder: 'Describe your Tv Series',
  },
  {
    title: 'Movie Title',
    titlePlaceholder: 'One Piece Episode 1',
    platforms: 'Intended Use of Song',
    platformsPlaceholder: 'E.g. Opening credits',
    description: 'Content Description',
    descriptionPlaceholder: 'Describe your movie',
  },
  {
    title: 'Game Title',
    titlePlaceholder: 'Your content’s title',
    platforms: 'Intended Platforms',
    platformsPlaceholder: 'E.g. PC, Console, Mobile',
    description: 'Game Description',
    descriptionPlaceholder: 'Describe your game',
  },
  {
    title: 'Name of AI Model',
    titlePlaceholder: 'Your content’s title',
    platforms: 'Intended Platforms',
    platformsPlaceholder: 'E.g. Chat GPT, Midjourney',
    description: 'Generated Content Description',
    descriptionPlaceholder: 'Describe the content your model will generate',
  },
]
