import {
  styled,
  Dialog,
  DialogContent,
  Box,
  Typography,
  useTheme,
  Divider,
  IconButton,
  List,
  ListItem,
  TextareaAutosize,
  CardMedia,
} from '@mui/material'
import IconClose from 'src/assets/close.svg'
import { useState } from 'react'
import PrimaryButton from './buttons/primary-button'
import { reportProfile } from 'src/api'
import toast from 'react-hot-toast'

const Textarea = styled(TextareaAutosize)(
  ({ theme }) => `
  box-sizing: border-box;
  fontFamily: 'var(--font-semi-bold)',
  font-family: var(--font-base);
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 16px,
  font-weight: 400,
  line-height: 24px,
  overflow: 'auto'
  color: ${
    theme.palette.mode === 'dark'
      ? theme.palette.grey[500]
      : theme.palette.grey[900]
  };
  background: ${
    theme.palette.mode === 'dark' ? theme.palette.grey[600] : '#fff'
  };
  border: 1px solid ${
    theme.palette.mode === 'dark'
      ? theme.palette.grey[700]
      : theme.palette.grey[200]
  };
  box-shadow: 0px 1px 2px ${
    theme.palette.mode === 'dark' ? '#101828' : theme.palette.grey[50]
  };
  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
)

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: 0,
    backgroundColor: '#191919',
    border: 'none',
    borderRadius: 12,
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    backgroundColor: '#191919',
    maxWidth: 500,
    borderRadius: 12,
    boxShadow: 'none',
  },
}))

const ProfileReportDialog = (props) => {
  const theme = useTheme()
  const { open, setOpen, currentUser, sellerId } = props
  const [reportReason, setReportReason] = useState('')
  const [report, setReport] = useState('')

  const handleClose = () => {
    setOpen(false)
  }

  const handleClickSubmit = async () => {
    const data = {
      from: currentUser.accountAddress,
      to: sellerId,
      type: reportReason,
      contents: report,
    }
    const res = await reportProfile(data)
    if (res.status === 200 && res.data.success) {
      setReport('')
      setReportReason('')
      setOpen(false)
      toast.success(res.data.msg)
    }
  }

  const handleChnageReport = (e) => {
    setReport(e.target.value)
  }

  return (
    <BootstrapDialog
      onClose={handleClose}
      open={open}
      maxWidth="sm"
      fullWidth={true}
    >
      <DialogContent sx={{ position: 'relative' }}>
        <Box
          sx={{
            padding: '24px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'var(--font-semi-bold)',
              fontSize: 21,
              color: theme.palette.text.primary,
              lineHeight: '26px',
            }}
          >
            Report account for
          </Typography>
          <IconButton onClick={handleClose}>
            <CardMedia component={'img'} image={IconClose} />
          </IconButton>
        </Box>
        <Divider />
        <Box
          sx={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '8px',
          }}
        >
          <List sx={{ listStyleType: 'disc' }}>
            <ListItem onClick={() => setReportReason('Disturbing Content')}>
              <Typography
                sx={{
                  display: 'list-item',
                  color: theme.palette.success.light,
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  borderBottom: `${
                    reportReason === 'Disturbing Content'
                      ? `solid 1px ${theme.palette.success.light}`
                      : `none`
                  }`,
                }}
              >
                Disturbing Content
              </Typography>
            </ListItem>
            <ListItem onClick={() => setReportReason('Impersonation')}>
              <Typography
                sx={{
                  display: 'list-item',
                  color: theme.palette.success.light,
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  borderBottom: `${
                    reportReason === 'Impersonation'
                      ? `solid 1px ${theme.palette.success.light}`
                      : `none`
                  }`,
                }}
              >
                Impersonation
              </Typography>
            </ListItem>
            <ListItem onClick={() => setReportReason('Infringement')}>
              <Typography
                sx={{
                  display: 'list-item',
                  color: theme.palette.success.light,
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  borderBottom: `${
                    reportReason === 'Infringement'
                      ? `solid 1px ${theme.palette.success.light}`
                      : `none`
                  }`,
                }}
              >
                Infringement
              </Typography>
            </ListItem>
            <ListItem onClick={() => setReportReason('Other')}>
              <Typography
                sx={{
                  display: 'list-item',
                  color: theme.palette.success.light,
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  borderBottom: `${
                    reportReason === 'Other'
                      ? `solid 1px ${theme.palette.success.light}`
                      : `none`
                  }`,
                }}
              >
                Other
              </Typography>
            </ListItem>
          </List>
          {reportReason && (
            <Textarea
              placeholder={`Describe your ${reportReason} report`}
              minRows={3}
              maxRows={5}
              value={report}
              onChange={(e) => handleChnageReport(e)}
            />
          )}
          <Typography
            sx={{
              fontSize: '16px',
              fontWeight: '500',
              lineHeight: '22px',
            }}
          >
            Disclaimer
          </Typography>
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: '400',
              lineHeight: '21px',
            }}
          >
            Reported accounts are reviewed by our team who take action if the
            account’s content or activity violates our Terms or Guidelines.
            <br />
            Repeated violation or serious breaches can result in the permanent
            deletion of accounts.
          </Typography>
        </Box>
        {reportReason && <Divider />}

        {reportReason && (
          <Box
            sx={{
              padding: '24px',
            }}
          >
            <PrimaryButton
              sx={{
                width: '100%',
              }}
              onClick={() => handleClickSubmit()}
            >
              Submit
            </PrimaryButton>
          </Box>
        )}
      </DialogContent>
    </BootstrapDialog>
  )
}

export default ProfileReportDialog
