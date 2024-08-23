import axios from 'axios'
import { API_URL } from '../config'
import { HistoryFilters } from 'src/interface'

export const searchPublicSalesDatabase = async (
  keyword: string,
  filterIndexes: HistoryFilters[],
) => {
  const res = await axios.post(`${API_URL}/public-sales-database/search`, {
    keyword,
    filterIndexes,
  })
  return res
}
