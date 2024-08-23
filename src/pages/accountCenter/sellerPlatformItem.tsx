import { useState } from 'react'
import {
  Grid,
  Box,
  Typography,
  useTheme,
  Container,
  OutlinedInput,
  Button,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import AddItem from '../profile/addItem'
import { SectionTypes } from '../../config'
import { updateSellerPlatform } from '../../api/profile'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

interface SellerPlatformItemProps {
  platform: any
  platformGroup: any
  setPlatformGroup: (newPlatforms: any) => void
}

export default function SellerPlatformItem({
  platform,
  platformGroup,
  setPlatformGroup,
}: SellerPlatformItemProps) {
  const theme = useTheme()
  const [accountVal, setAccountVal] = useState('')
  const [isAddAccount, setIsAddAccount] = useState(false)
  const authorization = useSelector(
    (state: { authorization: any }) => state.authorization,
  )
  const handleAddAccount = () => {
    setIsAddAccount(true)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setAccountVal(e.target.value)
  }

  const handleRemoveItem = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    const tmpPlatformGroup = platformGroup.map((item) => {
      if (item.platformTitle === platform.platformTitle) {
        return {
          ...item,
          accountData: {
            ...item.accountData,
            email: null,
          },
        }
      } else {
        return item
      }
    })
    const { success, msg } = await updateSellerPlatform(
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
    setIsAddAccount(false)

    const tmpPlatformGroup = platformGroup.map((item) => {
      if (item.platformTitle === platform.platformTitle) {
        return {
          ...item,
          accountData: { ...platform.accountData, email: accountVal },
        }
      } else {
        return item
      }
    })
    const { success, msg } = await updateSellerPlatform(
      authorization.currentUser.accountAddress,
      tmpPlatformGroup,
    )
    if (success) {
      setPlatformGroup(tmpPlatformGroup)
      setAccountVal('')
    } else {
      toast.error(msg)
    }
  }

  return (
    <Grid container spacing={2} my={2}>
      <Grid item xs={2} md={2} sm={12}>
        <Typography mt={1}>{platform.platformTitle}</Typography>
      </Grid>
      <Grid item xs={10} md={10} sm={12}>
        <Grid container spacing={2}>
          {!isAddAccount ? (
            <Grid
              item
              xs={6}
              md={6}
              sx={{
                borderRadius: theme.spacing(1),
              }}
            >
              {platform?.accountData?.email ? (
                <Box
                  sx={{
                    display: 'flex',
                    padding: '10px',
                    borderRadius: theme.spacing(0.5),
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: theme.palette.secondary.light,
                  }}
                >
                  <Typography>{platform.accountData.email}</Typography>
                  <Box
                    data-name={platform.accountData.email}
                    onClick={(
                      e: React.MouseEvent<HTMLDivElement, MouseEvent>,
                    ) => {
                      handleRemoveItem(e)
                    }}
                    sx={{
                      cursor: 'pointer',
                    }}
                  >
                    <CloseIcon color="error" />
                  </Box>
                </Box>
              ) : (
                <Box maxWidth={theme.spacing(10)}>
                  <AddItem
                    sectionId={0}
                    handleClick={handleAddAccount}
                    sectionType={SectionTypes.AddAccountSection}
                  />
                </Box>
              )}
            </Grid>
          ) : (
            <Grid item xs={6} md={6} sm={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  margin: '4px 4px 4px 0px',
                }}
              >
                <OutlinedInput
                  size="small"
                  placeholder="Twitter Account..."
                  type="text"
                  onChange={(
                    e: React.ChangeEvent<
                      HTMLTextAreaElement | HTMLInputElement
                    >,
                  ) => handleChange(e)}
                  value={accountVal}
                />
                <Box
                  sx={{
                    display: 'flex',
                  }}
                >
                  <Button onClick={() => confirmHandler()}>
                    <CheckIcon />
                  </Button>
                  <Button onClick={() => setIsAddAccount(false)}>
                    <CloseIcon color="error" />
                  </Button>
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  )
}
