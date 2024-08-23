import React from 'react'
import {
  Box,
  CardMedia,
  Grid,
  MenuItem,
  OutlinedInput,
  Typography,
  useTheme,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import { ArtistRevenueType } from 'interface'
import StrokeDarkIcon from 'src/assets/images/stroke_dark.svg'
import BrokenAvatar from 'src/assets/avatar.png'

const StyledOutlinedInputFC = styled(OutlinedInput)(({ theme }) => ({
  borderRadius: 8,
  height: 42,
  color: theme.palette.grey[200],
  backgroundColor: theme.palette.grey[600],
  '& fieldset': { border: 'none' },
}))

const StyledSelectFC = styled(TextField)(({ theme }) => ({
  borderRadius: 8,
  color: theme.palette.grey[200],
  backgroundColor: theme.palette.grey[600],
  fontSize: '16px',
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    height: 42,
  },
  width: '100%',
  '& fieldset': { border: 'none' },
  '&::placeholder': {
    fontSize: '16px',
    color: theme.palette.grey[500],
  },
}))

const permissions = ['Admin', 'View']

export type RevenueSplitsProps = {
  editable?: boolean
  readOnly?: boolean
  artistRevenues: Array<any>
  revenuesHandler?: (revenues: ArtistRevenueType[]) => void
}

export const RevenueSplits: React.FC<RevenueSplitsProps> = ({
  editable = true,
  readOnly,
  artistRevenues,
  revenuesHandler,
}) => {
  const theme = useTheme()
  const artistRevenueHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    index: number,
  ) => {
    const newRevenues = [...artistRevenues]
    newRevenues[index].percentage = Number(event.target.value)
    revenuesHandler(newRevenues)
  }

  const artistSwitchHandler = (event, curRevenue: ArtistRevenueType) => {
    const tmp = artistRevenues.map((revenue) => {
      if (revenue.sellerId === curRevenue.sellerId) {
        return {
          ...revenue,
          isAdmin: event.target.value === 'Admin' ? true : false,
        }
      } else {
        return { ...revenue, isAdmin: false }
      }
    })
    revenuesHandler(tmp)
  }

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'flex-start'}
      p={2}
    >
      <Box display={'flex'} flexDirection={'column'} alignItems={'flex-start'}>
        <Typography
          sx={{
            fontFamily: 'var(--font-semi-bold)',
            fontSize: '16px',
            color: theme.palette.text.primary,
          }}
        >
          Set Revenue Split & Permissions
        </Typography>

        <Box display={'flex'} alignItems={'center'} gap={0.5}>
          <Typography fontSize={'12px'} color={theme.palette.text.secondary}>
            To successfully list a song all collaborators must agree to the
            license terms and ownership split
          </Typography>
          <CardMedia
            component={'img'}
            image={StrokeDarkIcon}
            sx={{ width: 12, objectFit: 'cover' }}
          />
        </Box>
      </Box>
      <Box
        display={'flex'}
        flexDirection={'column'}
        width={'100%'}
        gap={1}
        pt={1.5}
      >
        {artistRevenues?.map((revenue, idx) => {
          return (
            <Box
              key={idx}
              sx={{
                p: 1.5,
                borderRadius: 3,
                border: `1px solid ${theme.palette.grey[600]}`,
                width: '100%',
              }}
            >
              <Box display={'flex'} alignItems={'center'} gap={1.5}>
                <CardMedia
                  component={'img'}
                  image={revenue.avatarPath ?? BrokenAvatar}
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: theme.palette.containerSecondary.main,
                    borderRadius: '100%',
                  }}
                />

                <Typography variant="subtitle2" sx={{ mt: 1 }} gutterBottom>
                  {revenue?.sellerName}
                </Typography>
              </Box>

              <Box
                sx={{
                  ml: 4.5,
                }}
              >
                <Grid container spacing={4.5}>
                  <Grid item xs={12} md={6}>
                    <Box display={'flex'} flexDirection={'column'} gap={1}>
                      <Box display={'flex'} alignItems={'center'} gap={0.5}>
                        <Typography
                          variant="subtitle1"
                          color={theme.palette.text.secondary}
                        >
                          Profits from License Sales
                        </Typography>
                        <CardMedia
                          component={'img'}
                          image={StrokeDarkIcon}
                          sx={{ width: 12, objectFit: 'cover' }}
                        />
                      </Box>

                      <StyledOutlinedInputFC
                        fullWidth
                        type="number"
                        value={revenue.percentage}
                        onChange={(e) => artistRevenueHandler(e, idx)}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box display={'flex'} flexDirection={'column'} gap={1}>
                      <Box display={'flex'} alignItems={'center'} gap={0.5}>
                        <Typography
                          variant="subtitle1"
                          color={theme.palette.text.secondary}
                        >
                          Set permissions
                        </Typography>
                        <CardMedia
                          component={'img'}
                          image={StrokeDarkIcon}
                          sx={{ width: 12, objectFit: 'cover' }}
                        />
                      </Box>

                      <StyledSelectFC
                        select
                        value={revenue.isAdmin ? 'Admin' : 'View'}
                        onChange={(event) =>
                          artistSwitchHandler(event, revenue)
                        }
                      >
                        {permissions.map((label, index) => (
                          <MenuItem key={index} value={label}>
                            {label}
                          </MenuItem>
                        ))}
                      </StyledSelectFC>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
