import { ACCESS_TOKEN, API_URL } from '../config'
import axios from 'axios'
import apiInstance from './interceptors'

export const getPlayLists = async (
  mediaName: string,
  accountAddress: string,
) => {
  const res = await axios.get(
    `${API_URL}/user/${mediaName.toLowerCase()}/${accountAddress}`,
  )
  return res
}

export const getAlbumsOfArtist = async (
  accountAddress: string,
  pageNumber: number,
) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)

  const resData: any = await apiInstance.post(
    `${API_URL}/spotify/artist-album`,
    {
      accountAddress,
      pageNumber,
    },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const getSongsOfAlbum = async (albumId: string, pageNumber: number) => {
  const ls = window.localStorage.getItem(ACCESS_TOKEN)

  const resData: any = await apiInstance.post(
    `${API_URL}/spotify/album-song`,
    {
      albumId,
      pageNumber,
    },
    {
      headers: {
        authorization: 'Bearer ' + ls,
      },
    },
  )
  return resData
}

export const searchTracks = async (albumId, trackName) => {
  const res = await axios.get(
    `${API_URL}/spotify/search-track/${albumId}/${encodeURIComponent(
      trackName,
    )}`,
  )
  return res
}

export const searchAlbums = async (sellerId, albumName) => {
  const res = await axios.get(
    `${API_URL}/spotify/search-album/${sellerId}/${encodeURIComponent(
      albumName,
    )}`,
  )
  return res
}

export const getMusicFromSpotify = async (trackId) => {
  const res = await axios.get(`${API_URL}/spotify/download/${trackId}`)
  return res
}

export const getPlaylistsByOrg = async (orgName, page, licenseName) => {
  const res = await axios.get(
    `${API_URL}/spotify/org/playlists/${orgName}/${page}/${licenseName}`,
  )
  return res?.data
}

export const searchByMulti = async (data) => {
  const res = await axios.post(`${API_URL}/spotify/filter`, data)
  if (res.status === 200) {
    return res.data
  } else {
    return []
  }
}

export const getGenresList = async () => {
  try {
    const res = await axios.get(
      `https://raw.githubusercontent.com/jamesVectorspace/spotify_genres/1d6e3ae79e323d381d0d28fea36a7a2c0335e7e5/gernes.json`,
    )
    return res.data
  } catch (e) {
    console.log('error in fetching genres list', e)
    return []
  }
}

export const getGenresOfArtists = async (artistsQuery) => {
  const res = await axios.get(`${API_URL}/spotify/get-genres/${artistsQuery}`)
  return res
}

export const getAvatarPathByDisplayname = async (
  displayName: string,
  sellerId: string,
) => {
  try {
    const res = await axios.post(`${API_URL}/spotify/get-avatarpath`, {
      displayName,
      sellerId,
    })
    return res.data.data
  } catch (e) {
    return null
  }
}
