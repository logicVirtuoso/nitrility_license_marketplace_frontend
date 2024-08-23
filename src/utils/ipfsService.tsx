import axios from 'axios'
import { IPFS_METADATA_API_URL, API_URL, ACCESS_TOKEN } from '../config'

type PostResponse = {
  data: any
  success: boolean
  msg: string
}

export const uploadJSONToServer = async (metadata) => {
  const res = await axios.post<PostResponse>(
    `${IPFS_METADATA_API_URL}/upload`,
    { metadata },
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    },
  )

  return res.data.data
}

export const uploadBulkJSONToServer = async (bulkMetadata) => {
  const resFile = await axios.post<PostResponse>(
    `${IPFS_METADATA_API_URL}/bulk/upload`,
    { bulkMetadata },
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    },
  )
  if (resFile.status === 200 && resFile.data.success) return resFile.data.data
  else return null
}

export const updateMetadataByYoutube = async (_data) => {
  const resFile = await axios.post<PostResponse>(
    `${IPFS_METADATA_API_URL}/update/youtube`,
    _data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  if (resFile.status === 200) return resFile.data
  else return null
}

export const updateMetadataByID = async (_data) => {
  const resFile = await axios.post(
    `${IPFS_METADATA_API_URL}/update/id`,
    _data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  if (resFile.status === 200) return resFile.data
  else return null
}

export const uploadImageToServer = async (image) => {
  const accessToken = JSON.parse(localStorage.getItem(ACCESS_TOKEN))
  const formData = new FormData()
  formData.append('photo', image)
  const resFile = await axios({
    method: 'post',
    url: `${API_URL}/user/images/upload`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-auth-token': accessToken,
    },
  })
  return resFile.data
}
