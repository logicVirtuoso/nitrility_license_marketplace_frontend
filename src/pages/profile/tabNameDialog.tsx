import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import OutlinedInput from '@mui/material/OutlinedInput'
import { Theme, useTheme } from '@mui/material/styles'
import { Grid, Typography } from '@mui/material'
import SecondaryButton from 'src/components/buttons/secondary-button'
import { makeStyles } from '@mui/styles'
import FormHelperText from '@mui/material/FormHelperText'
const useStyles = makeStyles(() => ({
  addButton: {
    width: '100% !important',
    margin: '20px 0px 0px 0px !important',
  },
  txt: { width: '100%', padding: '10px 0px' },
}))

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    backgroundColor: '#fff',
    boxShadow: 'none',
    width: 300,
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
  open: boolean
  setOpen: (open: boolean) => void
  handler: (newTab: string) => void
}

export default function TabNameDialog({ open, setOpen, handler }: DialogProps) {
  const classes = useStyles()
  const theme = useTheme()
  const [tabName, setTabName] = useState<string>('')
  const [addTabClicked, setAddTabClicked] = useState<boolean>(false)
  const handleClose = () => {
    setOpen(false)
    setAddTabClicked(false)
  }

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogContent dividers>
        <OutlinedInput
          placeholder="Enter the tab name"
          sx={{
            color: theme.palette.secondary.dark,
            width: '100%',
          }}
          value={tabName}
          onChange={(
            e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
          ) => setTabName(e.target.value)}
          type="text"
          required
        />
        {(!tabName || tabName === '') && addTabClicked && (
          <FormHelperText sx={{ color: theme.palette.error.dark }}>
            Please enter the valid name
          </FormHelperText>
        )}
        <SecondaryButton
          className={classes.addButton}
          onClick={() => {
            setAddTabClicked(true)
            if (!tabName || tabName === '') return
            else handler(tabName)
          }}
        >
          Add Tab
        </SecondaryButton>
      </DialogContent>
    </BootstrapDialog>
  )
}
