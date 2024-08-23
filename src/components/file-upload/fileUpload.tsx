import React from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { toast } from 'react-hot-toast'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import clsx from 'clsx'

const useStyles = makeStyles({
  root: {
    cursor: 'pointer',
    textAlign: 'center',
    display: 'flex',
    '&:hover p, &:hover svg, & img': {
      opacity: 0.8,
    },
    '& p, svg': {
      opacity: 1,
    },
    '&:hover img': {
      opacity: 0.3,
    },
    borderRadius: '10px',
  },
  noMouseEvent: {
    pointerEvents: 'none',
    borderRadius: '6px',
  },
  iconText: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  hidden: {
    display: 'none',
  },
  onDragOver: {
    '& img': {
      opacity: 0.3,
    },
    '& p, svg': {
      opacity: 1,
    },
  },
})

export enum UploadedFileType {
  Image = 0,
  Csv = 1,
}

export type FileUploadProps = {
  accept: string
  hoverLabel?: string
  dropLabel?: string
  width?: string
  height?: string
  backgroundColor?: string
  image?: {
    url: string
    imageStyle?: {
      width?: string
      height?: string
    }
  }
  fileType?: UploadedFileType
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onDrop: (event: React.DragEvent<HTMLElement>) => void
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  hoverLabel = 'Click or drag to upload file',
  dropLabel = 'Drop file here',
  width = '100%',
  height = '100px',
  backgroundColor = '#f5f5f5',
  image: {
    imageStyle = {
      height: 'inherit',
    },
  } = {},
  fileType = UploadedFileType.Image,
  onChange,
  onDrop,
}) => {
  const theme = useTheme()
  const classes = useStyles()
  const [imageUrl, setImageUrl] = React.useState<string>()
  const [labelText, setLabelText] = React.useState<string>(hoverLabel)
  const [isDragOver, setIsDragOver] = React.useState<boolean>(false)
  const [isMouseOver, setIsMouseOver] = React.useState<boolean>(false)
  const stopDefaults = (e: React.DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }
  const dragEvents = {
    onMouseEnter: () => {
      setIsMouseOver(true)
    },
    onMouseLeave: () => {
      setIsMouseOver(false)
    },
    onDragEnter: (e: React.DragEvent) => {
      stopDefaults(e)
      setIsDragOver(true)
      setLabelText(dropLabel)
    },
    onDragLeave: (e: React.DragEvent) => {
      stopDefaults(e)
      setIsDragOver(false)
      setLabelText(hoverLabel)
    },
    onDragOver: stopDefaults,
    onDrop: (e: React.DragEvent<HTMLElement>) => {
      if (e.dataTransfer.files[0].type !== 'text/csv') {
        toast.error('Please upload csv file')
      } else {
        stopDefaults(e)
        setIsDragOver(false)
        if (fileType === UploadedFileType.Image && e.dataTransfer.files[0]) {
          setImageUrl(URL.createObjectURL(e.dataTransfer.files[0]))
        }
        setLabelText(e.dataTransfer.files[0].name)
        onDrop(e)
      }
    },
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null && event.target?.files?.length > 0) {
      if (
        fileType === UploadedFileType.Csv &&
        event.target.files[0].type !== 'text/csv'
      ) {
        toast.error('Please upload csv file')
      } else {
        if (fileType === UploadedFileType.Image && event.target.files[0]) {
          setImageUrl(URL.createObjectURL(event.target.files[0]))
        }

        setLabelText(event.target.files[0].name)
        onChange(event)
      }
    }
  }

  return (
    <>
      <input
        onChange={handleChange}
        accept={accept}
        className={classes.hidden}
        id="file-upload"
        type="file"
        multiple={false}
      />

      <label
        htmlFor="file-upload"
        {...dragEvents}
        className={clsx(classes.root, isDragOver && classes.onDragOver)}
      >
        <Box
          width={width}
          height={height}
          bgcolor={theme.palette.secondary.light}
          className={classes.noMouseEvent}
        >
          <Box height={height} width={width} className={classes.iconText}>
            <FileUploadIcon fontSize="large" sx={{ color: '#000' }} />
            <Typography component={'span'} color="black">
              {labelText}
            </Typography>
          </Box>
        </Box>
      </label>
    </>
  )
}
