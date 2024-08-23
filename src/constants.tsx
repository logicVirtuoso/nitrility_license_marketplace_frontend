import FacebookDarkIcon from 'src/assets/images/settings/facebook_dark.png'
import YoutubeDarkIcon from 'src/assets/images/settings/youtube_dark.png'
import TwitchDarkIcon from 'src/assets/images/settings/twitch_dark.png'
import TwitterDarkIcon from 'src/assets/images/settings/twitter_dark.png'
import InstagramDarkIcon from 'src/assets/images/settings/instagram_dark.png'
import TiktokDarkIcon from 'src/assets/images/settings/tiktok_dark.png'
import SpotifyDarkIcon from 'src/assets/images/settings/spotify_dark.png'
import WebsiteDarkIcon from 'src/assets/images/settings/website_dark.png'

import GenresImage1 from 'src/assets/images/explore/genres/unsplash_BteCp6aq4GI.png'
import GenresImage2 from 'src/assets/images/explore/genres/unsplash_iIWDt0fXa84.png'
import GenresImage3 from 'src/assets/images/explore/genres/image_51.png'
import GenresImage4 from 'src/assets/images/explore/genres/unsplash_C0oRQ_8SxBY.png'
import GenresImage5 from 'src/assets/images/explore/genres/unsplash_Di4Rd8QukTQ.png'
import GenresImage6 from 'src/assets/images/explore/genres/unsplash_Ki7Gx2a-5R8.png'
import GenresImage7 from 'src/assets/images/explore/genres/unsplash_yJsuEsVXbsE.png'
import GenresImage8 from 'src/assets/images/explore/genres/unsplash_SbPUMwGYzLo.png'
import GenresImage9 from 'src/assets/images/explore/genres/unsplash_sHn_DiDFjl4.png'
import GenresImage10 from 'src/assets/images/explore/genres/unsplash_GrKox7RDr8c.png'
import MoodsImage1 from 'src/assets/images/explore/moods/unsplash_3w1XBUGj4ds.png'
import MoodsImage2 from 'src/assets/images/explore/moods/unsplash_3GewRZTNjuY.png'
import MoodsImage3 from 'src/assets/images/explore/moods/unsplash_0MuG2eadOno.png'
import MoodsImage4 from 'src/assets/images/explore/moods/unsplash_KE7GiRTvMqs.png'
import MoodsImage5 from 'src/assets/images/explore/moods/unsplash_bhSNKT5aaMc.png'
import MoodsImage6 from 'src/assets/images/explore/moods/unsplash_wZGOBYMUnOo.png'
import MoodsImage7 from 'src/assets/images/explore/moods/unsplash_7qJtgZcZPX0.png'
import MoodsImage8 from 'src/assets/images/explore/moods/unsplash_A4579vLezz8.png'
import MoodsImage9 from 'src/assets/images/explore/moods/unsplash_zaLRX24My9E.png'
import MoodsImage10 from 'src/assets/images/explore/moods/unsplash_qDM7mdRGrWg.png'
import ActivitiesImage1 from 'src/assets/images/explore/activities/unsplash_4TQrrIFK9Xs.png'
import ActivitiesImage2 from 'src/assets/images/explore/activities/unsplash_evlkOfkQ5rE.png'
import ActivitiesImage3 from 'src/assets/images/explore/activities/unsplash_3IyjBegTXLA.png'
import ActivitiesImage4 from 'src/assets/images/explore/activities/unsplash_GiAaGUimWok.png'
import ActivitiesImage5 from 'src/assets/images/explore/activities/unsplash_TD8uFU0v068.png'
import ActivitiesImage6 from 'src/assets/images/explore/activities/unsplash_2nRydiQgBBo.png'
import ActivitiesImage7 from 'src/assets/images/explore/activities/unsplash_UBhpOIHnazM.png'
import ActivitiesImage8 from 'src/assets/images/explore/activities/unsplash_dNVjtsFA0p4.png'
import ActivitiesImage9 from 'src/assets/images/explore/activities/unsplash_M3XscQcYY1I.png'
import ActivitiesImage10 from 'src/assets/images/explore/activities/unsplash_GaLWM8dX73U.png'
import ImageLicense from 'src/assets/images/license_bg.png'

export const fiveLicenses = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 6,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
}

export const fourLicenses = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
}

export enum SocialAccountType {
  Youtube = 'YouTube',
  TikTok = 'TikTok',
  Facebook = 'Facebook',
  Instagram = 'Instagram',
  Twitch = 'Twitch',
  TwitterX = 'Twitter / X',
  WebSite = 'Website',
  Spotify = 'Spotify',
}

export const SocialAccountList = {
  [SocialAccountType.Youtube]: {
    placeHolder: 'YouTube channel',
    icon: YoutubeDarkIcon,
    url: '',
  },
  [SocialAccountType.TikTok]: {
    placeHolder: 'TikTok handle',
    icon: TiktokDarkIcon,
    url: '',
  },
  [SocialAccountType.Facebook]: {
    placeHolder: 'Facebook handle',
    icon: FacebookDarkIcon,
    url: '',
  },
  [SocialAccountType.Instagram]: {
    placeHolder: 'Instagram handle',
    icon: InstagramDarkIcon,
    url: '',
  },
  [SocialAccountType.Twitch]: {
    placeHolder: 'Twitch channel',
    icon: TwitchDarkIcon,
    url: '',
  },
  [SocialAccountType.TwitterX]: {
    placeHolder: 'Twitter handle',
    icon: TwitterDarkIcon,
    url: '',
  },
  [SocialAccountType.WebSite]: {
    placeHolder: 'Website URL',
    icon: WebsiteDarkIcon,
    url: '',
  },
  [SocialAccountType.Spotify]: {
    placeHolder: 'Profile Link',
    icon: SpotifyDarkIcon,
    url: '',
  },
}

export const topGenresItems = [
  {
    name: 'Pop',
    imageUrl: GenresImage1,
  },
  {
    name: 'Rock',
    imageUrl: GenresImage2,
  },
  {
    name: 'Hip Hop',
    imageUrl: GenresImage3,
  },
  {
    name: 'R&B',
    imageUrl: GenresImage4,
  },
  {
    name: 'Dance & EDM',
    imageUrl: GenresImage5,
  },
  {
    name: 'Indie',
    imageUrl: GenresImage6,
  },
  {
    name: 'Ambient',
    imageUrl: GenresImage7,
  },
  {
    name: 'Techno',
    imageUrl: GenresImage8,
  },
  {
    name: 'Drum & Bass',
    imageUrl: GenresImage9,
  },
  {
    name: 'Electronic',
    imageUrl: GenresImage10,
  },
]

export const topMoodsItems = [
  {
    name: 'Relaxing',
    imageUrl: MoodsImage1,
  },
  {
    name: 'Sentimental',
    imageUrl: MoodsImage2,
  },
  {
    name: 'Euphoric',
    imageUrl: MoodsImage3,
  },
  {
    name: 'Dreamy',
    imageUrl: MoodsImage4,
  },
  {
    name: 'Epic',
    imageUrl: MoodsImage5,
  },
  {
    name: 'Retro',
    imageUrl: MoodsImage6,
  },
  {
    name: 'Mysterious',
    imageUrl: MoodsImage7,
  },
  {
    name: 'Running',
    imageUrl: MoodsImage8,
  },
  {
    name: 'Sensual',
    imageUrl: MoodsImage9,
  },
  {
    name: 'Suspense',
    imageUrl: MoodsImage10,
  },
]

export const topActivitiesItems = [
  {
    name: 'Advertising',
    imageUrl: ActivitiesImage1,
  },
  {
    name: 'Movie',
    imageUrl: ActivitiesImage2,
  },
  {
    name: 'Short Films',
    imageUrl: ActivitiesImage3,
  },
  {
    name: 'Vlogs',
    imageUrl: ActivitiesImage4,
  },
  {
    name: 'Travel Videos',
    imageUrl: ActivitiesImage5,
  },
  {
    name: 'Party',
    imageUrl: ActivitiesImage6,
  },
  {
    name: 'TV Shows',
    imageUrl: ActivitiesImage7,
  },
  {
    name: 'Streaming',
    imageUrl: ActivitiesImage8,
  },
  {
    name: 'Documentary',
    imageUrl: ActivitiesImage9,
  },
  {
    name: 'Cooking',
    imageUrl: ActivitiesImage10,
  },
]

export const allGenresItems = [
  {
    name: 'Acoustic',
    imageUrl: ImageLicense,
  },
  {
    name: 'Alternative',
    imageUrl: ImageLicense,
  },
  {
    name: 'Ambient',
    imageUrl: ImageLicense,
  },
  {
    name: 'Blues',
    imageUrl: ImageLicense,
  },
  {
    name: 'Classical',
    imageUrl: ImageLicense,
  },
  {
    name: 'Country',
    imageUrl: ImageLicense,
  },
  {
    name: 'Disco',
    imageUrl: ImageLicense,
  },
  {
    name: 'Dubstep',
    imageUrl: ImageLicense,
  },
  {
    name: 'Electronic',
    imageUrl: ImageLicense,
  },
  {
    name: 'EDM',
    imageUrl: ImageLicense,
  },
]
