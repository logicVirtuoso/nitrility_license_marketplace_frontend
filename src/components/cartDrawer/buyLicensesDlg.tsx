import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { Box, CardMedia, Divider, IconButton, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { licensingTypeList } from 'src/config'
import { useTokenPrice } from 'src/hooks/useTokenPrice'
import { LicensingTypes, accessLevels } from 'src/interface'
import CloseDarkIcon from 'src/assets/images/close_dark.png'
import WhiteBtn from 'src/components/buttons/whiteBtn'
import DotDarkIcon from 'src/assets/images/dot_dark.svg'
import BackDarkIcon from 'src/assets/images/back_dark.svg'
import { getSyncData } from 'src/utils/utils'
import PrimaryButton from '../buttons/primary-button'
import useUtils from 'src/hooks/useUtils'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: 0,
    backgroundColor: theme.palette.secondary.main,
    border: 'none',
    borderRadius: 12,
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    backgroundColor: theme.palette.secondary.main,
    maxWidth: 500,
    borderRadius: 12,
    border: `1px solid ${theme.palette.grey[600]}`,
  },
}))

export interface DialogTitleProps {
  id: string
  children?: React.ReactNode
  onClose: () => void
}

export interface Props {
  addedLicenses: any
  usageDetails: Array<any>
  offerDetails: Array<any>
  open: boolean
  setOpen: (open: boolean) => void
  backForwards: () => void
  handler: () => void
}

export default function BuyLicensesFC({
  open,
  addedLicenses,
  usageDetails,
  offerDetails,
  setOpen,
  backForwards,
  handler,
}: Props) {
  const theme = useTheme()
  const [askingPrice, setAskingPrice] = useState<number>(0)
  const { tokenPrice } = useTokenPrice()
  const [allLicenses, setAllLicenses] = useState<Array<any>>([])
  const { etherToUsd } = useUtils()

  const handleClose = () => {
    setOpen(false)
  }

  useEffect(() => {
    const updatedData = [...addedLicenses].map((addedLicense, idx) => {
      const syncData = getSyncData(
        addedLicense.cartedInfo.licensingType,
        addedLicense.licenseData.signingData,
      )
      return {
        ...addedLicense,
        syncData,
      }
    })
    setAllLicenses(updatedData)
  }, [addedLicenses])

  return (
    <BootstrapDialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogContent sx={{ position: 'relative' }}>
        <Box
          display={'flex'}
          alignItems={'center'}
          px={3}
          py={1.5}
          gap={2}
          mt={3}
        >
          <IconButton onClick={backForwards}>
            <CardMedia
              component={'img'}
              image={BackDarkIcon}
              sx={{ width: 10, objectFit: 'cover' }}
            />
          </IconButton>
          <Typography fontSize={21} color={theme.palette.text.primary}>
            Buy Licenses
          </Typography>
        </Box>

        <IconButton
          sx={{
            position: 'absolute',
            right: 14,
            top: 14,
          }}
          onClick={handleClose}
        >
          <CardMedia image={CloseDarkIcon} component={'img'} />
        </IconButton>

        <Box display={'flex'} flexDirection={'column'} gap={1}>
          {allLicenses.map((data, idx) => {
            const { cartedInfo, licenseData } = data

            return (
              <Box
                display={'flex'}
                flexDirection={'column'}
                gap={1}
                px={3}
                py={2}
                key={idx}
              >
                <Box display={'flex'} alignItems={'center'} gap={2}>
                  <CardMedia
                    component={'img'}
                    image={licenseData.imagePath}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                    }}
                  />

                  <Box display={'flex'} flexDirection={'column'} gap={0.5}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 0.5,
                        maxWidth: 300,
                        overflowX: 'auto',
                        '&::-webkit-scrollbar': {
                          display: 'none',
                        },
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                      }}
                    >
                      <Typography
                        key={idx}
                        sx={{
                          color: theme.palette.success.light,
                          borderRadius: '56px',
                          backgroundColor: theme.palette.grey[600],
                          p: '2px 8px',
                          fontSize: '12px',
                          fontFamily: 'var(--font-medium)',
                          lineHeight: '16px',
                          width: 'fit-content',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {`${
                          licensingTypeList[cartedInfo.licensingType]?.label
                        } ${accessLevels[cartedInfo.accessLevel]}`}
                      </Typography>
                    </Box>

                    <Typography
                      fontSize={'16px'}
                      fontFamily={'var(--font-bold)'}
                      color={theme.palette.containerSecondary.contrastText}
                    >
                      {licenseData.licenseName}
                    </Typography>

                    <Box display={'flex'} alignItems={'center'} gap={1}>
                      {licenseData.artists.map(
                        (artist: { name: string }, index: number) => {
                          return (
                            <Typography
                              sx={{
                                lineHeight: '16px',
                                fontSize: '12px',
                                color: theme.palette.text.secondary,
                                whiteSpace: 'nowrap',
                              }}
                              component={'span'}
                              key={index}
                            >
                              {`${artist.name} ${
                                licenseData.artists?.length == index + 1
                                  ? ''
                                  : ', '
                              }`}
                            </Typography>
                          )
                        },
                      )}

                      <CardMedia
                        component={'img'}
                        image={DotDarkIcon}
                        sx={{ width: 2, height: 2 }}
                      />
                      <Typography
                        component={'span'}
                        fontSize={12}
                        color={theme.palette.text.secondary}
                      >
                        {licenseData.albumName}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                {cartedInfo.licensingType == LicensingTypes.Creator && (
                  <PrimaryButton
                    sx={{ maxWidth: 146, height: 28, borderRadius: 1.5 }}
                  >
                    Add Discount Code
                  </PrimaryButton>
                )}
              </Box>
            )
          })}

          <Divider />

          <Box p={3}>
            <Typography
              color={theme.palette.grey[50]}
              fontSize={16}
              fontWeight={600}
            >
              Song Sale Details
            </Typography>

            <Box display={'flex'} flexDirection={'column'} gap={1} pt={1}>
              {allLicenses.map((addedLicense, idx) => {
                const { cartedInfo, syncData } = addedLicense
                return (
                  <Box
                    display={'flex'}
                    alignItems={'center'}
                    justifyContent={'space-between'}
                    key={idx}
                  >
                    <Typography>{`${cartedInfo.counts}x ${
                      licensingTypeList[cartedInfo.licensingType]?.label
                    } ${
                      accessLevels[cartedInfo.accessLevel]
                    } License`}</Typography>

                    <Typography>
                      $
                      {(
                        offerDetails[idx].offerPrice * cartedInfo.counts
                      ).toLocaleString()}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Box>

        <Divider />

        <WhiteBtn
          m={2}
          sx={{ borderRadius: 11.5 }}
          onClick={() => {
            setOpen(false)
            handler()
          }}
        >
          Proceed To Payment
        </WhiteBtn>
      </DialogContent>
    </BootstrapDialog>
  )
}
