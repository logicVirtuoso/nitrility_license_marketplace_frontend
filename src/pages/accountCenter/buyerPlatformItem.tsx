import { useState } from 'react'
import {
  Grid,
  Box,
  Typography,
  useTheme,
  CardMedia,
  IconButton,
} from '@mui/material'
import { updateBuyerPlatform } from '../../api'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import SecondaryButton from 'src/components/buttons/secondary-button'
import PlusDarkIcon from 'src/assets/images/settings/plus_dark.png'
import { StyledInput } from '../profile/style'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import CloseDarkIcon from 'src/assets/images/close_dark.png'
import { SocialAccountList } from 'src/constants'

interface BuyerPlatformItemProps {
  platform: any
  platformGroup: any
  setPlatformGroup: (newPlatforms: any) => void
}

export default function BuyerPlatformItem({
  platform,
  platformGroup,
  setPlatformGroup,
}: BuyerPlatformItemProps) {
  const theme = useTheme()
  const [accountVal, setAccountVal] = useState('')
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setAccountVal(e.target.value)
  }

  const handleRemoveItem = async (removedAccount) => {
    const tmpPlatformGroup = platformGroup.map((item) => {
      if (item.platformTitle === platform.platformTitle) {
        return {
          ...item,
          accounts: platform.accounts.filter(
            (account) => account !== removedAccount,
          ),
        }
      } else {
        return item
      }
    })
    const { success, msg } = await updateBuyerPlatform(
      authorization.currentUser.accountAddress,
      tmpPlatformGroup,
    )
    if (success) {
      setPlatformGroup(tmpPlatformGroup)
    } else {
      toast.error(msg)
    }
  }

  const confirmHandler = async () => {
    if (accountVal && accountVal !== '') {
      const tmpPlatformGroup = platformGroup.map((item) => {
        if (item.platformTitle === platform.platformTitle) {
          return {
            ...item,
            accounts: [...item.accounts, accountVal],
          }
        } else {
          return item
        }
      })
      const { success, msg } = await updateBuyerPlatform(
        authorization.currentUser.accountAddress,
        tmpPlatformGroup,
      )
      if (success) {
        setPlatformGroup(tmpPlatformGroup)
      } else {
        toast.error(msg)
      }
      setAccountVal('')
    } else {
      toast.error('Invalid Email')
    }
  }

  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Typography color={theme.palette.text.secondary} fontSize={'12px'}>
        {platform.platformTitle}
      </Typography>

      <Box display={'flex'} flexDirection={'column'} gap={0.5}>
        <Box display={'flex'} alignItems={'center'} gap={1}>
          <Box display={'flex'} alignItems={'center'} gap={0.5} width={'100%'}>
            <Box
              sx={{
                backgroundColor: theme.palette.grey[600],
                padding: '12px 9px',
                borderRadius: '8px 0px 0px 8px',
                width: 42,
                height: 42,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <CardMedia
                component={'img'}
                image={SocialAccountList[platform.platformTitle].icon}
                sx={{
                  objectFit: 'cover',
                }}
              />
            </Box>

            <StyledInput
              placeholder={
                SocialAccountList[platform.platformTitle].placeHolder
              }
              value={accountVal}
              type="text"
              disableUnderline={true}
              sx={{
                backgroundColor: theme.palette.grey[600],
                height: 42,
                display: 'flex',
                alignItems: 'center',
                pl: 1.5,
                py: 1,
                borderRadius: '0px 8px 8px 0px',
                width: '100%',
                color: theme.palette.text.secondary,
                fontSize: '18px',
              }}
              onChange={handleChange}
            />
          </Box>

          <SecondaryButton
            sx={{
              width: '72px',
              backgroundColor: theme.palette.grey[600],
              gap: '0px',
            }}
            onClick={confirmHandler}
          >
            <CardMedia component={'img'} image={PlusDarkIcon} />
            <Typography
              align="center"
              component={'span'}
              sx={{
                fontSize: '14px',
                fontWeight: '400',
                color: theme.palette.text.secondary,
              }}
            >
              Add
            </Typography>
          </SecondaryButton>
        </Box>

        {platform?.accounts?.map((account, idx) => {
          return (
            <Box display={'flex'} alignItems={'center'} key={idx} gap={1}>
              <Box
                display={'flex'}
                alignItems={'center'}
                gap={0.5}
                width={'100%'}
              >
                <Box
                  sx={{
                    backgroundColor: theme.palette.grey[600],
                    padding: '12px 10px',
                    borderRadius: '8px',
                    width: 42,
                    height: 42,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <CardMedia
                    component={'img'}
                    image={SocialAccountList[platform.platformTitle].icon}
                    sx={{
                      objectFit: 'cover',
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    backgroundColor: theme.palette.grey[600],
                    height: 42,
                    display: 'flex',
                    alignItems: 'center',
                    pl: 1.5,
                    py: 1,
                    borderRadius: '4px',
                    width: '100%',
                    color: theme.palette.text.secondary,
                    fontSize: '18px',
                  }}
                >
                  {account}
                </Box>
              </Box>

              <IconButton
                sx={{ width: 34, height: 34, mr: 4 }}
                onClick={() => handleRemoveItem(account)}
              >
                <CardMedia
                  image={CloseDarkIcon}
                  component={'img'}
                  sx={{
                    width: 18,
                    height: 18,
                  }}
                />
              </IconButton>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
