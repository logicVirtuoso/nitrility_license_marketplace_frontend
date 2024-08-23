import {
  Box,
  CardMedia,
  Divider,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { StyledSelectFC } from 'src/components/styledInput'
import { licensingTypeList, topTimeOptions } from 'src/config'
import Grid from '@mui/material/Unstable_Grid2'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import 'chart.js/auto'
import BrokenAvatar from 'src/assets/images/profile_broken_avatar.png'
import { randomRange } from 'src/utils/utils'
import SaleState from 'src/components/SaleState'
import { useSelector } from 'react-redux'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import {
  getMostPopularLicenses,
  getOrdersByLicenseType,
  getSaleStats,
  getSaleVolumeByMonth,
  getTotalOffers,
} from 'src/api'
import useUtils from 'src/hooks/useUtils'
import StatsCard from './statsCard'
import { GlobalDataContext } from 'src/context/globalDataContext'
import { TabTypes } from 'src/interface'

const BarChart = ({ totalOffers }) => {
  const theme = useTheme()
  const { etherToUsd } = useUtils()
  const offers = totalOffers.map((item) => {
    return etherToUsd(item.totalPrice).toLocaleString()
  })
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        backgroundColor: theme.palette.success.light,
        borderColor: theme.palette.success.light,
        borderWidth: 1,
        data: offers, //[33, 53, 85, 41, 44, 65, 33, 53, 85, 41, 44, 50],
        barThickness: 4, // set the bar thickness here
      },
      // {
      //   backgroundColor: theme.palette.pink[200],
      //   borderColor: theme.palette.pink[200],
      //   borderWidth: 1,
      //   data: [44, 65, 33, 53, 81, 44, 65, 33, 53, 85],
      //   barThickness: 4, // set the bar thickness here
      // },
    ],
  }
  const options = {
    scales: {
      x: {
        grid: {
          color: 'transparent', // No gridlines will be shown on the x-axis
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.grey[600], // Dark gridlines for the y-axis
        },
        ticks: {
          stepSize: 25,
          font: {
            size: 12, // Font size for y-axis labels
          },
          // Display a dollar sign for all y-axis labels except for zero
          callback: function (value, index, ticks) {
            return value === 0 ? value : `$${value}`
          },
        },
      },
    },
    maintainAspectRatio: true,
    height: '360px',
    plugins: {
      legend: {
        display: false,
      },
    },
  }
  return <Bar data={data} options={options} height={'360px'} />
}

const DoughnutChart = ({ orders }) => {
  const theme = useTheme()
  const percentages = orders.map((item) => item.percentage)
  const data = {
    labels: ['TV Series', 'Creator', 'Advertisement', 'Movie'],
    datasets: [
      {
        data: percentages,
        backgroundColor: [
          theme.palette.pink[200],
          theme.palette.pink[300],
          theme.palette.pink[900],
          theme.palette.pink[100],
        ],
        borderColor: [
          theme.palette.pink[200],
          theme.palette.pink[300],
          theme.palette.pink[900],
          theme.palette.pink[100],
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    cutout: '90%', // Adjust this value to change the circle size,
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  return (
    <Box width={120} height={120}>
      <Doughnut data={data} options={options} />
    </Box>
  )
}

const LineChart = ({ totalSaleVolumes }) => {
  const theme = useTheme()
  const { etherToUsd } = useUtils()
  const volumes = totalSaleVolumes.map((item) => {
    return etherToUsd(item.totalSalesVolume)
  })
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: volumes,
        fill: false,
        backgroundColor: theme.palette.background.paper,
        borderColor: theme.palette.success.light,
      },
      // {
      //   data: [51, 54, 76, 33, 53, 85],
      //   fill: false,
      //   backgroundColor: theme.palette.background.paper,
      //   borderColor: theme.palette.pink[200],
      // },
    ],
  }

  const options = {
    scales: {
      x: {
        grid: {
          color: 'transparent', // No gridlines will be shown on the x-axis
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: theme.palette.grey[600], // Dark gridlines for the y-axis
        },
        ticks: {
          font: {
            size: 12, // Font size for y-axis labels
          },
          // Display a dollar sign for all y-axis labels except for zero
          callback: function (value, index, ticks) {
            return value === 0 ? value : `$${value}`
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  }

  return <Line data={data} options={options} />
}

export default function StatsTab() {
  const theme = useTheme()
  const { etherToUsd } = useUtils()
  const [globalData, setGlobalData] = useContext(GlobalDataContext)
  const [period, setPeriod] = useState<number>(topTimeOptions[0].value)
  const [saleStats, setSaleStats] = useState({
    totalSales: 0,
    payouts: 0,
    totalOffers: 0,
    totalVisitors: 0,
    listings: 0,
    pendingOfferCounts: 0,
    pendingOfferPrice: 0,
    pendingListings: 0,
  })
  const [mostPopularLicenses, setMostPopularLicenses] = useState<Array<any>>([])
  const [orders, setOrders] = useState<Array<any>>([])
  const [totalSaleVolumes, setTotalSaleVolumes] = useState<Array<any>>([])
  const [totalOffers, setTotalOffers] = useState<Array<any>>([])
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  const periodHandler = (event) => {
    const {
      target: { value },
    } = event
    setPeriod(value)
  }

  useEffect(() => {
    getSaleStats(authorization.currentUser.sellerId).then(({ data }) => {
      setSaleStats(data)
    })

    getMostPopularLicenses(authorization.currentUser.sellerId).then(
      ({ data }) => {
        setMostPopularLicenses(data)
      },
    )

    getOrdersByLicenseType(authorization.currentUser.sellerId).then(
      ({ data }) => {
        setOrders(data)
      },
    )

    getSaleVolumeByMonth(authorization.currentUser.sellerId).then(
      ({ data }) => {
        setTotalSaleVolumes(data)
      },
    )

    getTotalOffers(authorization.currentUser.sellerId).then(({ data }) => {
      setTotalOffers(data)
    })
  }, [authorization.currentUser.sellerId])

  const getCustomMonthRange = (originalDate) => {
    try {
      const { day, month, year } = originalDate
      const date1 = new Date(Date.UTC(year, month - 1, day))

      const startMonth =
        date1.getUTCDate() >= 21 ? date1.getUTCMonth() : date1.getUTCMonth() - 1
      const startYear =
        date1.getUTCMonth() === 0 && date1.getUTCDate() < 21
          ? date1.getUTCFullYear() - 1
          : date1.getUTCFullYear()

      const endMonth = (startMonth + 1) % 12
      const endYear = endMonth === 0 ? startYear + 1 : startYear

      const startDate = new Date(Date.UTC(startYear, startMonth, 21))
      const endDate = new Date(Date.UTC(endYear, endMonth, 20))

      const formatDate = (date) => {
        const month1 = date.toLocaleString('default', { month: 'short' })
        const day1 = date.getUTCDate()
        const year1 = date.getUTCFullYear()
        return `${month1} ${day1}, ${year1}`
      }

      return `${formatDate(startDate)} - ${formatDate(endDate)}`
    } catch {
      return ''
    }
  }

  return (
    <Box display={'flex'} flexDirection={'column'} mt={2} mb={1} gap={2}>
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
        width={'100%'}
      >
        <Typography variant="h3" color={theme.palette.text.primary}>
          Dashboard
        </Typography>
        <StyledSelectFC
          select
          value={period}
          onChange={periodHandler}
          sx={{ width: 90 }}
        >
          {topTimeOptions.map((item, idx) => (
            <MenuItem key={idx} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </StyledSelectFC>
      </Box>

      <Box
        display={'flex'}
        alignItems={'center'}
        width={'100%'}
        border={`1px solid ${theme.palette.grey[600]}`}
        borderRadius={3}
      >
        <SaleState
          title="Total Sales"
          totalAmount={`${saleStats.totalSales}`}
          percent={Math.random() * 10}
          isRaiseup={true}
        />
        <Divider orientation="vertical" flexItem />
        <SaleState
          title="Payouts"
          totalAmount={`$${etherToUsd(saleStats.payouts).toLocaleString()}`}
          percent={Math.random() * 10}
          isRaiseup={true}
        />
        <Divider orientation="vertical" flexItem />
        <SaleState
          title="Total Offers"
          totalAmount={`${saleStats.totalOffers}`}
          percent={Math.random() * 10}
          isRaiseup={true}
        />
        <Divider orientation="vertical" flexItem />
        <SaleState
          title="Profile Visits"
          totalAmount={`${saleStats.totalVisitors}`}
          percent={Math.random() * 10}
          isRaiseup={true}
        />
      </Box>

      <Grid container spacing={2} columns={10}>
        <Grid xs={7}>
          <Box
            border={`1px solid ${theme.palette.grey[600]}`}
            borderRadius={3}
            padding={'20px'}
          >
            <Typography
              fontSize={16}
              color={theme.palette.text.secondary}
              align={'left'}
            >
              Total Sales
            </Typography>
            <LineChart totalSaleVolumes={totalSaleVolumes} />
            <Box display="flex" gap="20px">
              <Box display="flex" alignItems="center" gap="10px">
                <Box
                  height={10}
                  width={10}
                  borderRadius={'50%'}
                  bgcolor={theme.palette.success.light}
                />
                <Typography fontSize={12} color={theme.palette.grey[500]}>
                  {getCustomMonthRange(totalSaleVolumes[0]?._id)}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap="10px">
                <Box
                  height={10}
                  width={10}
                  borderRadius={'50%'}
                  bgcolor={theme.palette.pink[200]}
                />
                <Typography fontSize={12} color={theme.palette.grey[500]}>
                  {getCustomMonthRange(
                    totalSaleVolumes[totalSaleVolumes.length - 1]?._id,
                  )}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid xs={3}>
          <Box
            border={`1px solid ${theme.palette.grey[600]}`}
            borderRadius={3}
            height={'100%'}
            padding={'20px'}
          >
            <Typography
              fontSize={16}
              color={theme.palette.text.secondary}
              align={'left'}
            >
              Total Offers
            </Typography>
            <BarChart totalOffers={totalOffers} />
            <Box display="flex" flexDirection="column">
              <Box display="flex" alignItems="center" gap="10px">
                <Box
                  height={10}
                  width={10}
                  borderRadius={'50%'}
                  bgcolor={theme.palette.success.light}
                />
                <Typography fontSize={12} color={theme.palette.grey[500]}>
                  {getCustomMonthRange(totalOffers[0]?._id)}
                </Typography>
              </Box>
              {totalOffers.length > 1 && (
                <Box display="flex" alignItems="center" gap="10px">
                  <Box
                    height={10}
                    width={10}
                    borderRadius={'50%'}
                    bgcolor={theme.palette.pink[200]}
                  />
                  <Typography fontSize={12} color={theme.palette.grey[500]}>
                    {getCustomMonthRange(
                      totalOffers[totalOffers.length - 1]?._id,
                    )}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2} columns={10}>
        <Grid xs={5}>
          <Box
            border={`1px solid ${theme.palette.grey[600]}`}
            borderRadius={3}
            height={'100%'}
            p={2}
          >
            <Typography
              fontSize={16}
              color={theme.palette.text.secondary}
              align={'left'}
            >
              Orders by License Type
            </Typography>
            <Box
              display={'flex'}
              alignItems="center"
              gap="30px"
              padding="10px 0px"
            >
              <DoughnutChart orders={orders} />
              <Box display={'flex'} flexDirection="column" width="100%">
                {orders.map((order, idx) => {
                  return (
                    <Box
                      key={idx}
                      display={'flex'}
                      justifyContent="space-between"
                    >
                      <Box display="flex" alignItems="center" gap="10px">
                        <Box
                          height={10}
                          width={10}
                          borderRadius={'50%'}
                          bgcolor={theme.palette.pink[100]}
                        />
                        <Typography
                          fontSize={12}
                          color={theme.palette.grey[500]}
                        >
                          {licensingTypeList[order.licensingType].label}
                        </Typography>
                      </Box>
                      <Typography fontSize={12} color={theme.palette.grey[500]}>
                        {order.percentage.toLocaleString()}%
                      </Typography>
                    </Box>
                  )
                })}
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid xs={5}>
          <Box
            border={`1px solid ${theme.palette.grey[600]}`}
            borderRadius={3}
            height={'100%'}
            p={2}
          >
            <Typography
              fontSize={16}
              color={theme.palette.text.secondary}
              align={'left'}
            >
              Most Popular Licenses
            </Typography>

            {mostPopularLicenses.length > 0 ? (
              <Box
                display={'flex'}
                justifyContent={'space-between'}
                pt={1.5}
                gap={'82px'}
              >
                <Box display={'flex'}>
                  <Typography
                    color={theme.palette.grey[500]}
                    fontSize={14}
                    align="left"
                  >
                    1
                  </Typography>
                  <Box ml={2}>
                    <CardMedia
                      image={mostPopularLicenses[0].imagePath}
                      component={'img'}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '100%',
                      }}
                    />
                    <Typography
                      fontFamily={'var(--font-semi-bold)'}
                      fontSize={16}
                      color={theme.palette.text.primary}
                      sx={{
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        maxWidth: 86,
                      }}
                    >
                      {mostPopularLicenses[0].licenseName}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color={theme.palette.grey[500]}
                    >
                      {`${mostPopularLicenses[0].countOfLicenses} orders`}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  width={'100%'}
                  maxWidth={600}
                  gap={1}
                >
                  {mostPopularLicenses.slice(1, 4).map((item, idx) => (
                    <Box
                      key={idx}
                      display={'flex'}
                      alignItems={'center'}
                      gap={1.5}
                    >
                      <Typography
                        color={theme.palette.grey[500]}
                        fontSize={14}
                        align="left"
                      >
                        {idx + 2}
                      </Typography>

                      <Box
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                        borderBottom={`1px solid ${theme.palette.grey[600]}`}
                        width={'100%'}
                      >
                        <Typography
                          fontFamily={'var(--font-semi-bold)'}
                          fontSize={14}
                          color={theme.palette.text.primary}
                        >
                          {item.licenseName}
                        </Typography>

                        <Typography
                          color={theme.palette.grey[500]}
                          fontSize={14}
                          align="left"
                        >
                          {`${item.countOfLicenses} orders`}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : (
              <Box
                display={'flex'}
                justifyContent={'center'}
                alignItems={'center'}
                pt={1.5}
              >
                <Typography>Nothing here yet</Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      <Box mt={5} mb={6}>
        <Typography
          variant="h3"
          color={theme.palette.text.primary}
          pb={2}
          align="left"
        >
          License Stats
        </Typography>
        <Box
          display={'flex'}
          alignItems={'center'}
          width={'100%'}
          border={`1px solid ${theme.palette.grey[600]}`}
          borderRadius={3}
        >
          <StatsCard
            title={'License listings'}
            value={saleStats.listings}
            isViewed={false}
          />

          <Divider orientation="vertical" flexItem />
          <StatsCard
            title={'Pending Offers'}
            value={saleStats.pendingOfferCounts}
            isViewed={true}
            viewerTitle="View offers"
            onClick={() =>
              setGlobalData((prev) => ({
                ...prev,
                profileTabValue: TabTypes.OfferReceived,
              }))
            }
          />
          <Divider orientation="vertical" flexItem />
          <StatsCard
            title={'Pending Offer Value'}
            value={`$${etherToUsd(
              saleStats.pendingOfferPrice,
            ).toLocaleString()}`}
            isViewed={true}
            viewerTitle="View offers"
            onClick={() =>
              setGlobalData((prev) => ({
                ...prev,
                profileTabValue: TabTypes.OfferReceived,
              }))
            }
          />
          <Divider orientation="vertical" flexItem />
          <StatsCard
            title={'Pending Listings'}
            value={saleStats.pendingListings}
            isViewed={true}
            viewerTitle="View pending listings"
            onClick={() =>
              setGlobalData((prev) => ({
                ...prev,
                profileTabValue: TabTypes.PendingListings,
              }))
            }
          />
        </Box>
      </Box>
    </Box>
  )
}
