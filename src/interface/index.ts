import { SocialAccountType } from 'src/constants'

export * from './publicProfile'

export enum RoleTypes {
  None = -1,
  Buyer = 0,
  Seller = 1,
  Mixed = 2,
}

export enum ReviewStatus {
  Pending = 0,
  Approved = 1,
  Rejected,
  Deleted,
}

export enum LicensingTypes {
  None = -1,
  Creator = 0,
  Advertisement,
  TvSeries,
  Movie,
  VideoGame,
  AiTraining,
  All,
}

export enum EventTypes {
  Purchased,
  OfferPlaced,
  OfferAccepted,
  OfferRejected,
  OfferWithdrawn,
  OfferEdited,
  OfferExpired,
  Listed,
  PendingListed,
  Edited,
  SongUnlisted,
  LicenseTypeUnlisted,
  CollaboratorAccepted,
  CollaboratorRejected,
}

export enum OfferTypes {
  GeneralOffer,
  CounterOffer,
}

export enum AccessLevel {
  NonExclusive = 0,
  Exclusive,
  Both,
  None,
}

export enum HistoryFilters {
  Listing = 0,
  ReListings,
  UnListings,
  Changes,
  Sales,
  Offers,
  Gifting,
}

export enum WalletTypes {
  none = 'none',
  metamask = 'metamask',
  magic = 'magic',
  coinbase_wallet = 'coinbase_wallet',
}

export interface ArtistRevenueType {
  sellerName: string
  sellerId: string
  percentage: number
  isAdmin: boolean
  status: number
  avatarPath: string
}

export enum DiscountTypeEN {
  PercentageOff = 0,
  FixedAmountOff = 1,
}

export interface DiscountCodeIF {
  name: string
  code: string
  discountType: DiscountTypeEN
  percentage: number
  fixedAmount: number
  infinite: boolean
  endTime: number
  actived: boolean
}

export interface GoverningLaw {
  country: string
  state: string
}

export interface BaseDataIF extends GoverningLaw {
  fPrice: number
  sPrice: number
  tPrice: number
  totalSupply: number
  listingStartTime: number
  listingEndTime: number
  exclusiveEndTime: number
  revenues: ArtistRevenueType[]
  listingFormatValue: number
  accessLevel: AccessLevel
  discountCode: DiscountCodeIF
  usageNotes: string
  signature?: string
}

export interface TemplateDataIF extends BaseDataIF {
  infiniteSupply: boolean | string
  infiniteListingDuration: boolean | string
  infiniteExclusiveDuration: boolean | string
  listed: ListingStatusType
}

export interface CommonLicenseDataIF {
  listedId?: number
  tokenURI?: string
  albumName: string
  albumId: string
  sellerName: string
  sellerId: string
  avatarPath: string
  licenseName: string
  imagePath: string
  previewUrl: string
  trackId: string
  genres: Array<string>
  artists: Array<any>
  sellerAddress: string
  length?: number
}

export interface SigningDataIF {
  sellerId?: string
  tokenURI?: string
  creator?: TemplateDataIF
  movie?: TemplateDataIF
  advertisement?: TemplateDataIF
  videoGame?: TemplateDataIF
  tvSeries?: TemplateDataIF
  aiTraining?: TemplateDataIF
}

export interface LicenseDataIF extends CommonLicenseDataIF {
  signingData: SigningDataIF
}

export interface UsageDetailIF {
  projectType: string
  releaseDate: number
  contentTitle: string
  contentDescription: string
  productionDescription?: string
  aiModelDescription?: string
  previewFiles: Array<string>
  intendedPlatforms: string
  licenseUsage: string
  submit?: null
}

export interface ContactInfoIF {
  phoneNumber: string
  showPhoneNumber: boolean
  contactEmail: string
  showContactEmail: boolean
  address: string
  showAddress: boolean
}

export interface OfferDataIF {
  offerId: number
  listedId: number
  buyerAddr: string
  offerPrice: number
  offerDuration: number
  tokenURI: string
  eventType: EventTypes
  licensingType: LicensingTypes
  accessLevel: AccessLevel
  transactionHash?: string
  createdAt: number
}

export interface CartLocalStorageIF {
  accountAddress: string
  trackId: string
  accessLevel: AccessLevel
  licensingType: LicensingTypes
  counts: number
  label: string
  id: number
}

export enum ListingStatusType {
  NonListed = 0,
  Listed = 1,
  UnListed = 2,
  Expired = 3,
  Exclusived = 4,
}

export enum SortOption {
  Newest = 'Date: Newest',
  Oldest = 'Date: Oldest',
}

export enum SortLinceseOption {
  AlphabeticalHighToLow = 'Alphabetical: A -> Z',
  AlphabeticalLowToHigh = 'Alphabetical: Z -> A',
}

export const sortOptions = [SortOption.Newest, SortOption.Oldest]

interface SongProperty {
  label: string
  value: boolean
}

export interface SearchFilterIF {
  showSearchFilter: boolean
  keyword: string
  songProperties: Array<SongProperty>
  length: Array<number>
  tempo: Array<number>
  genre: string
  sortOption: SortOption
}

export enum IdenfyReviewTypes {
  None = null || undefined,
  Pending = 0,
  Business = 1,
  NoBusiness = 2,
  Deleted = 3,
}

export enum ListingFormat {
  ForBid = 'For Bid',
  ForPrice = 'Flat Price',
  ForPriceAndBids = 'Flat Price and Bids',
}

export const listingTypes = [
  ListingFormat.ForBid,
  ListingFormat.ForPrice,
  ListingFormat.ForPriceAndBids,
]

export enum SupplyFormat {
  Infinite = 'Infinite',
  CertainSupply = 'Set the supply',
}

export const supplyTypes = [SupplyFormat.Infinite, SupplyFormat.CertainSupply]

export enum ProjectTypeLabels {
  Business = 'Business',
  Personal = 'Personal',
}

export const projectTypes = [
  ProjectTypeLabels.Business,
  ProjectTypeLabels.Personal,
]

export enum AccessLevelLabels {
  NonExclusive = 'Nonexclusive',
  Exclusive = 'Exclusive',
  Both = 'Nonexclusive and Exclusives',
}

export const accessLevels = [
  AccessLevelLabels.NonExclusive,
  AccessLevelLabels.Exclusive,
  AccessLevelLabels.Both,
]

export enum BidDaysFormat {
  HalfDay = '12 hours',
  OneDay = '1 day',
  ThreeDay = '3 days',
  SevenDay = '7 days',
  OneMonth = '1 month',
  CustomDate = 'Custom date',
}

export const bidDaysOptions = [
  BidDaysFormat.HalfDay,
  BidDaysFormat.OneDay,
  BidDaysFormat.ThreeDay,
  BidDaysFormat.SevenDay,
  BidDaysFormat.OneMonth,
  BidDaysFormat.CustomDate,
]

export enum DaysFormat {
  Infinite = 'Infinite',
  OneHour = '1 hour',
  SixHours = '6 hours',
  OneDay = '1 day',
  ThreeDays = '3 days',
  SevenDays = '7 days',
  OneMonth = '1 month',
  ThreeMonths = '3 months',
  SixMonths = '6 months',
  CustomDate = 'Custom',
}

export const daysTypes = [
  DaysFormat.Infinite,
  DaysFormat.OneHour,
  DaysFormat.SixHours,
  DaysFormat.OneDay,
  DaysFormat.ThreeDays,
  DaysFormat.SevenDays,
  DaysFormat.OneMonth,
  DaysFormat.ThreeMonths,
  DaysFormat.SixMonths,
  DaysFormat.CustomDate,
]

export interface LicenseFilterIF {
  keyword: string
}

export interface CustomResponseIF {
  data: any
  msg?: string
  success?: boolean
}

export enum LicenseHistoryTabTypes {
  AllActivity = 'All Activity',
  LicenseOffers = 'License Offers',
}

export enum Activities {
  Listings = 'Listings',
  Collaborations = 'Collaborations',
  Sales = 'Sales',
  Offers = 'Offers',
}

export enum EnSubmitting {
  Switched,
  NewLicensing,
  CreateListing,
}

export enum ViewMode {
  GridView = 0,
  ListView = 1,
}

export enum ListViewTypes {
  LIKED = 0,
  PROFILE,
  COLLECTIONS_DETAIL,
  EXPLORE,
}

export interface PayloadIF {
  id: string
  firstName: string
  lastName: string
  accountAddress: string
  sellerId: string
  sellerName: string
  role: RoleTypes
  idenfies: {
    seller: Array<any>
    buyer: any
  }
  loggedTime: number
}

export interface MailingIF {
  mail: string
  mailingAddress: string
}

export enum TabTypes {
  Listed,
  Sold,
  Collections,
  Owned,
  OfferReceived,
  OfferMade,
  UnListed,
  Notifications,
  PendingListings,
  SellerStats,
  Activity,
}

export interface SellerDataIF {
  sellerName: string
  email: string
  sellerId: string | null
  avatarPath: string
  createdAt: number
}

export interface CollectionIF {
  description: string
  collectionName: string
  selectedLicenses: number[]
  imagePath: string
  collectionId: number
  createdAt: number
  published: boolean
}

export interface PublicProfileDataIF {
  collections: CollectionIF[]
  bio: string
  contacts: {
    email: string
    phone: string
  }
  socials: {
    [SocialAccountType.WebSite]: string
    [SocialAccountType.Instagram]: string
    [SocialAccountType.Youtube]: string
    [SocialAccountType.TikTok]: string
    [SocialAccountType.TwitterX]: string
    [SocialAccountType.Twitch]: string
    [SocialAccountType.Spotify]: string
  }
}

export interface DeviceInfoIF {
  appName: string
  appVersion: string
  userAgent: string
  platform: string
}
