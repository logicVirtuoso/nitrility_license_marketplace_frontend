import { API_URL } from '../config'
import axios from 'axios'

export const reportAppealByUser = async (_claim) => {
  const res = await axios.post(`${API_URL}/report/appeal/user`, _claim)
  return res
}

export const reportBurnedLicenseByUser = async (licenseReportId) => {
  const res = await axios.post(`${API_URL}/report/burnedlicense/user`, {
    licenseReportId,
  })
  return res
}

export const getLicenseReport = async (accountAddress) => {
  const res = await axios.get(`${API_URL}/report/license/${accountAddress}`)
  return res
}

export const reportProfile = async (data) => {
  const res = await axios.post(`${API_URL}/report/report-profile`, data)
  return res
}
