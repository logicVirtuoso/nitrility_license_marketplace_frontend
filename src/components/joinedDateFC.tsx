import { Box, Typography, useTheme } from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useState } from 'react'
import Tooltip from '@mui/material/Tooltip'

interface Props {
  accountAddress: string
  joinedDate: string
}

export default function JoinedDateFC({ accountAddress, joinedDate }: Props) {
  const theme = useTheme()
  const [clicked, setClicked] = useState(false)

  return (
    <Box display={'flex'} mt={2} alignItems={'center'}>
      <CopyToClipboard text={accountAddress} onCopy={() => setClicked(true)}>
        <Tooltip title={clicked ? 'Address Copied' : 'Copy Address'}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              borderRadius: 2,
              p: '6px 8px',
            }}
          >
            <ContentCopyIcon
              sx={{
                width: 16,
                height: 16,
                fontWeight: 600,
              }}
            />
            <Typography
              sx={{
                maxWidth: '200px',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                fontSize: '14px',
                marginLeft: '10px',
                fontFamily: 'var(--font-base)',
                borderRadius: '8px',
                color: theme.palette.text.secondary,
              }}
            >
              {accountAddress?.slice(0, 6) +
                '.....' +
                accountAddress?.slice(
                  accountAddress?.length - 6,
                  accountAddress?.length,
                )}
            </Typography>
          </Box>
        </Tooltip>
      </CopyToClipboard>

      <Box display={'flex'} alignItems={'center'} ml={1}>
        <Typography
          sx={{
            maxWidth: '200px',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            fontSize: '14px',
            marginLeft: '10px',
            fontFamily: 'var(--font-base)',
            color: theme.palette.text.secondary,
          }}
        >
          {`Joined ${joinedDate}`}
        </Typography>
      </Box>
    </Box>
  )
}
