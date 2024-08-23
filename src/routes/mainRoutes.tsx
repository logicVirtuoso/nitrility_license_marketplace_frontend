import { Outlet } from 'react-router-dom'
import { lazy } from 'react'
import Loadable from '../components/loadable'

const AuthGuard = Loadable(lazy(() => import('../utils/route-guard/authGuard')))
const SellingPage = Loadable(lazy(() => import('../pages/sell')))
const Setting = Loadable(lazy(() => import('../pages/setting')))

const ProfileSecurityPage = Loadable(
  lazy(() => import('../pages/profile/security')),
)
const PageLayout = Loadable(lazy(() => import('../components/layout')))
const LicenseHistory = Loadable(lazy(() => import('../pages/licenseHistory')))
const LicenseSetting = Loadable(
  lazy(() => import('../pages/sell/licenseSetting')),
)

const LicenseChecker = Loadable(
  lazy(() => import('../pages/tools/licenseChecker')),
)
const LicenseCheckingResult = Loadable(
  lazy(() => import('../pages/tools/licenseCheckingResult')),
)
const Profile = Loadable(lazy(() => import('../pages/profile')))
const CollectionDetails = Loadable(
  lazy(() => import('../pages/profile/collectionDetails')),
)

const LikedLicenses = Loadable(lazy(() => import('../pages/likedLicenses')))
const LicensesForYouPage = Loadable(
  lazy(() => import('../pages/licensesForYou')),
)
const ReceiverDetails = Loadable(
  lazy(() => import('src/pages/licenseHistory/receiverDetails')),
)

const InformationPublicProfile = Loadable(
  lazy(() => import('../pages/infoPublicProfile')),
)

const CommonLayout = () => {
  return (
    <AuthGuard>
      <PageLayout>
        <Outlet />
      </PageLayout>
    </AuthGuard>
  )
}

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <CommonLayout />,
      children: [
        {
          path: 'profile/:accountAddress',
          element: <Profile />,
        },
        {
          path: 'collection-details/:sellerId/:collectionId',
          element: <CollectionDetails />,
        },
        {
          path: 'sell',
          element: <SellingPage />,
        },
        {
          path: 'liked-licenses',
          element: <LikedLicenses />,
        },
        {
          path: 'profile-security',
          element: <ProfileSecurityPage />,
        },
        {
          path: 'settings',
          element: <Setting />,
        },
        {
          path: 'license/history/:listedId',
          element: <LicenseHistory />,
        },
        {
          path: 'license/receiver-details/:accountAddress',
          element: <ReceiverDetails />,
        },
        {
          path: 'license/setting/:listedId',
          element: <LicenseSetting />,
        },
        {
          path: 'tools/licensechecker',
          element: <LicenseChecker />,
        },
        {
          path: 'license-checker/result',
          element: <LicenseCheckingResult />,
        },
        {
          path: 'license-for-you',
          element: <LicensesForYouPage />,
        },
        {
          path: 'info-pub-profile/:buyerAddr/:sellerId',
          element: <InformationPublicProfile />,
        },
      ],
    },
  ],
}

export default MainRoutes
