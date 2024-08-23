import Box from '@mui/material/Box'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import {
  UploadedFileType,
  FileUpload,
  FileUploadProps,
} from '../../components/file-upload/fileUpload'
import Typography from '@mui/material/Typography'
import { uploadCSV } from '../../api'
import fileDownload from 'js-file-download'
import { API_URL } from '../../config'
import SecondaryButton from 'src/components/buttons/secondary-button'

const LicenseChecker = () => {
  const navigate = useNavigate()
  const [csvFile, setCsvFile] = useState<any>(null)

  const fileUploadProp: FileUploadProps = {
    fileType: UploadedFileType.Csv,
    accept: '.csv',
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      setCsvFile(event.target.files[0])
    },
    onDrop: (event: React.DragEvent<HTMLElement>) => {
      setCsvFile(event.dataTransfer.files[0])
    },
  }

  const uploadFile = async () => {
    let toastLoading = toast.loading('Uploading csv...')
    try {
      if (!csvFile) {
        toast.error('Please upload csv file', { id: toastLoading })
        return
      }
      const res = await uploadCSV(csvFile)
      if (res.status === 200 && res.data.success) {
        toast.success('Uploaded csv successfully', { id: toastLoading })
        toastLoading = toast.loading('Downloading csv...')
        const downloadRes = await axios.get(`${API_URL}${res.data.data.path}`, {
          responseType: 'blob',
        })

        await fileDownload(downloadRes.data, `unlisted_licenses.csv`)
        toast.success('Successfully Downloaded', {
          id: toastLoading,
        })
        navigate('/license-checker/result', {
          state: res.data.data,
        })
      } else {
        toast.success('Please try again', { id: toastLoading })
      }
    } catch (e) {
      toast.error('Something went wrong', { id: toastLoading })
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          minWidth: '300px',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ paddingBottom: '50px', marginTop: 4 }}
        >
          Upload Database
        </Typography>
        <FileUpload {...fileUploadProp} />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <SecondaryButton
            sx={{
              mt: 2,
              mb: 2,
              width: '100%',
            }}
            onClick={uploadFile}
          >
            Submit Database
          </SecondaryButton>
        </Box>
      </Box>
    </Box>
  )
}

export default LicenseChecker
