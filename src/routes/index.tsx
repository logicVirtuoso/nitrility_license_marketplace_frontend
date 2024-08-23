import { Outlet, useRoutes } from 'react-router-dom'
import MainRoutes from './mainRoutes'
import { lazy } from 'react'
import Loadable from '../components/loadable'

const Home = Loadable(lazy(() => import('../pages/home')))
const Artists = Loadable(lazy(() => import('../pages/artists')))
const TopSellingLicenses = Loadable(
  lazy(() => import('../pages/topSellingLicenses')),
)
const TrendingLicenses = Loadable(
  lazy(() => import('../pages/trendingLicenses')),
)
const Explore = Loadable(lazy(() => import('../pages/explore/index')))
const PageLayout = Loadable(lazy(() => import('../components/layout')))
const PageNotFound = Loadable(lazy(() => import('../pages/pageNotFound')))
const Purchasing = Loadable(lazy(() => import('../pages/purchasing')))
const RecentUploadPage = Loadable(lazy(() => import('../pages/recentUpload')))
const ExploreDetail = Loadable(lazy(() => import('../pages/explore/detail')))
const EditablePublicProfile = Loadable(
  lazy(() => import('../pages/profile/editablePublic')),
)
const CommonLayout = () => {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  )
}

export default function ThemeRoutes() {
  return useRoutes([
    {
      path: '/',
      element: <CommonLayout />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: 'pub-profile/:sellerId',
          element: <EditablePublicProfile />,
        },
        {
          path: '/artists',
          element: <Artists />,
        },
        {
          path: '/selling-linceses',
          element: <TopSellingLicenses />,
        },
        {
          path: '/trending-linceses',
          element: <TrendingLicenses />,
        },
        {
          path: 'purchase/:listedId',
          element: <Purchasing />,
        },
        {
          path: 'explore',
          element: <Explore />,
        },
        {
          path: 'explore/details',
          element: <ExploreDetail />,
        },
        {
          path: 'recent-uploads',
          element: <RecentUploadPage />,
        },
        {
          path: '*',
          element: <PageNotFound />,
        },
      ],
    },
    MainRoutes,
  ])
}
