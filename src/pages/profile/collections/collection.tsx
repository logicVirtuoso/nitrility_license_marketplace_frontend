import { Box, CardMedia, Typography, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  sellerId: string
  collectionId: number
  imagePath: string
  collectionName: string
  sellerName: string
  createdAt: number
  totalSongs: number
  published: boolean
}

const Collection = ({
  sellerId,
  collectionId,
  imagePath,
  collectionName,
  sellerName,
  createdAt,
  totalSongs,
  published,
}: Props) => {
  const navigate = useNavigate()
  const theme = useTheme()
  const [time, setTime] = useState<string>('')

  useEffect(() => {
    const created = new Date(createdAt).toISOString()

    const remainedTime =
      Date.parse(new Date().toISOString()) - Date.parse(created)
    const days = Math.floor(remainedTime / (1000 * 60 * 60 * 24))
    const hours = Math.floor(
      (remainedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    )
    const minutes = Math.floor((remainedTime % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((remainedTime % (1000 * 60)) / 1000)

    let countedTime
    if (days > 0) {
      countedTime = `${days}d ${hours}h ${minutes}m ${seconds}s`
    } else {
      if (hours > 0) {
        countedTime = `${hours}h ${minutes}m ${seconds}s`
      } else {
        if (minutes > 0) {
          countedTime = `${minutes}m ${seconds}s`
        } else {
          countedTime = `${seconds}s`
        }
      }
    }

    setTime(countedTime)
  }, [createdAt])

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        bgcolor: theme.palette.secondary.main,
        p: 1,
        borderRadius: 3,
        cursor: 'pointer',
        height: '100%',
      }}
      onClick={() =>
        navigate(`/collection-details/${sellerId}/${collectionId}`)
      }
    >
      {!published && (
        <Typography
          fontWeight={600}
          fontSize={12}
          sx={{
            bgcolor: '#FFFFFF0D',
            position: 'absolute',
            top: 16,
            right: 16,
            padding: '4px 8px',
            zIndex: 2,
            borderRadius: 1,
          }}
        >
          Hidden from profile
        </Typography>
      )}
      <CardMedia
        image={imagePath}
        component={'img'}
        sx={{
          width: '100%',
          objectFit: 'cover',
          borderRadius: 2,
          height: 'calc(100% - 86px)',
          filter: !published ? 'grayscale(1)' : 'inherit',
        }}
      />

      <Typography
        mt={1.5}
        fontFamily={'var(--font-bold)'}
        fontSize={16}
        color={theme.palette.containerSecondary.contrastText}
        align="left"
      >
        {collectionName}
      </Typography>

      <Typography
        variant="subtitle1"
        color={theme.palette.text.secondary}
        align="left"
      >
        By {sellerName}
      </Typography>

      <Typography
        variant="subtitle1"
        color={theme.palette.text.secondary}
        mt={1.5}
        mb={0.5}
        align="left"
      >
        {`${totalSongs} songs · ${time}`}
      </Typography>
    </Box>
  )
}

export default Collection
