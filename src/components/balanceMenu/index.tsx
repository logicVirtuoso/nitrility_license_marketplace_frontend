import { Box, Divider, useTheme } from '@mui/material'
import { useSelector } from 'react-redux'
import useListingLicense from 'src/hooks/useListingLicense'
import { AuthType } from 'src/store/reducers/authorizationReducer'
import { truncateVal } from 'src/utils/utils'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import { useTokenPrice } from 'src/hooks/useTokenPrice'

export default function BalanceMenu() {
  const theme = useTheme()
  const authorization = useSelector(
    (state: { authorization: AuthType }) => state.authorization,
  )

  const { balance } = useListingLicense()
  const { tokenPrice } = useTokenPrice()

  return (
    <Box
      sx={{
        position: 'absolute',
        borderRadius: '8px',
        right: '0px',
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.containerSecondary.main,
          borderRadius: '6px',
          marginTop: '10px',
          boxShadow: `${theme.palette.background.default} 0px 0px 0px 0px, rgba(0, 0, 0, 0.95) 0px 0px 0px 1px, rgba(0, 0, 0, 9) 0px 10px 15px -3px, rgba(0, 0, 0, 95) 0px 4px 6px -2px`,
        }}
      >
        <Box display={'flex'} alignItems={'center'} gap={2}>
          <CopyToClipboard
            text={`${authorization?.currentUser?.accountAddress}`}
          >
            <Box
              p={2}
              sx={{ cursor: 'pointer' }}
              onClick={() =>
                toast.success('address was copied to the clipboard')
              }
            >
              {truncateVal(authorization?.currentUser?.accountAddress)}
            </Box>
          </CopyToClipboard>
          <Divider orientation="vertical" variant="middle" flexItem />
          <Box p={2}>${(tokenPrice * balance).toLocaleString()}</Box>
        </Box>
      </Box>
    </Box>
  )
}
