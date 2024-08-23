import Typography from '@mui/material/Typography'
import { Box, Divider, Grid, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { TabButton } from 'src/components/buttons'
import BuyerInformationSetting from './buyerInformation'
import SellerProfileSetting from './sellerInformation'
import SecuritySetting from './security'
import PayoutsSetting from './payouts'
import UserInformationSetting from './userInformation'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { RoleTypes } from 'src/interface'

enum SettingsValues {
  UserInformation,
  BuyerInformation,
  SellerProfile,
  Security,
  Payouts,
}

const settingItems = [
  { label: 'User Information', value: SettingsValues.UserInformation },
  { label: 'Buyer Information', value: SettingsValues.BuyerInformation },
  { label: 'Seller Information', value: SettingsValues.SellerProfile },
  { label: 'Security', value: SettingsValues.Security },
  { label: 'Payouts', value: SettingsValues.Payouts },
]

export interface NotificationSettings {
  follower: boolean
  sales: boolean
  announcements: boolean
}

const Settings = () => {
  const theme = useTheme()
  const [curTab, setCurTab] = useState(settingItems[0])
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )
  return (
    <Box mt={'104px'} mx={'100px'}>
      <Typography variant="h2" color={theme.palette.text.primary}>
        Settings
      </Typography>
      <Grid container spacing={1} mt={3}>
        <Grid item xs={3}>
          <Box
            display={'flex'}
            flexDirection={'column'}
            bgcolor={theme.palette.secondary.main}
            height={'100%'}
            borderRadius={3}
            maxHeight={473}
            p={2}
            gap={2}
          >
            <Box display={'flex'} flexDirection={'column'} gap={2}>
              <Typography
                color={theme.palette.text.primary}
                fontFamily={'var(--font-semi-bold)'}
                fontSize={'18px'}
              >
                {`${authorization.currentUser.firstName ?? ''} ${
                  authorization.currentUser.lastName ?? ''
                }`}
              </Typography>
              <Divider />
            </Box>
            <Box display={'flex'} flexDirection={'column'}>
              {settingItems.map((item, idx) => {
                const showTab =
                  item.value === SettingsValues.Payouts
                    ? authorization.currentUser.role == RoleTypes.Seller
                    : true
                return (
                  <React.Fragment key={idx}>
                    {showTab && (
                      <TabButton
                        sx={{
                          height: '37px',
                          width: '100%',
                          justifyContent: 'flex-start',
                          fontSize: '14px',
                        }}
                        selected={item.label === curTab.label}
                        onClick={() => setCurTab(item)}
                      >
                        {item.label}
                      </TabButton>
                    )}
                  </React.Fragment>
                )
              })}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={9}>
          {curTab.value === SettingsValues.UserInformation && (
            <UserInformationSetting />
          )}
          {curTab.value === SettingsValues.BuyerInformation && (
            <BuyerInformationSetting />
          )}
          {curTab.value === SettingsValues.SellerProfile && (
            <SellerProfileSetting />
          )}
          {curTab.value === SettingsValues.Security && <SecuritySetting />}
          {curTab.value === SettingsValues.Payouts && <PayoutsSetting />}
        </Grid>
      </Grid>
    </Box>
  )
}

export default Settings
