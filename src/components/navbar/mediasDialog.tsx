import React, { useState, useEffect, useCallback, useContext } from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import OutlinedInput from '@mui/material/OutlinedInput'
import { useTheme } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { SellerAccountDataContext } from 'src/context/sellerData'
import { MenuProps } from 'src/config'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    width: '100%',
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    boxShadow: 'none',
    width: 400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

export interface DialogProps {
  href: string
  open: boolean
  setOpen: (open: boolean) => void
}

export default function MediasDialog({ href, open, setOpen }: DialogProps) {
  const navigate = useNavigate()
  const [sellerAccountData, setSellerAccountData] = useContext(
    SellerAccountDataContext,
  )
  const [platformTitle, setPlatformTitle] = useState<string>()
  const [labelName, setLabelName] = useState<string>('Please select an option.')

  const handleClose = () => {
    setOpen(false)
  }

  const mediaHandler = (event: SelectChangeEvent<any>) => {
    const platform = event.target.value.platformTitle
    setPlatformTitle(platform)
    setLabelName(`${platform} (${event.target.value?.accountData?.sellerName})`)
    setOpen(false)
    const seller = sellerAccountData.find(
      (sellerData) => sellerData.platformTitle === platform,
    )

    navigate(href, {
      state: {
        platformTitle: platform,
        sellerId: seller.sellerId,
      },
    })
  }

  return (
    <BootstrapDialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogContent dividers sx={{ padding: 80 }}>
        <Typography align="center" variant="h4">
          Select IP Type
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '20px',
          }}
        >
          <Select
            value={labelName}
            onChange={mediaHandler}
            input={
              <OutlinedInput
                sx={{ width: '80%', marginLeft: 'auto' }}
                placeholder="Please select an option."
              />
            }
            renderValue={(selected) => {
              return selected
            }}
            MenuProps={MenuProps}
            inputProps={{
              'aria-label': 'Without label',
            }}
            sx={{
              width: '100%',
            }}
          >
            {sellerAccountData
              .filter((item) => item?.associatedEmail)
              .map((account, idx) => {
                return (
                  <MenuItem key={idx} value={account} sx={{ color: 'black' }}>
                    {`${account.platformTitle} (${account?.accountData?.sellerName})`}
                  </MenuItem>
                )
              })}
          </Select>
        </Box>
      </DialogContent>
    </BootstrapDialog>
  )
}
