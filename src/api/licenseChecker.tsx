import axios from 'axios'
import { API_URL } from '../config'

export const uploadCSV = async (csvFile) => {
  const formData = new FormData()
  formData.append('csvFile', csvFile)

  const resFile = await axios({
    method: 'post',
    url: `${API_URL}/license-checker/upload-csv`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return resFile
}

export const readCSV = async (path, pageNumber, pageStep) => {
  const res = await axios.post(`${API_URL}/license-checker/read-csv`, {
    path,
    pageNumber,
    pageStep,
  })
  return res
}
