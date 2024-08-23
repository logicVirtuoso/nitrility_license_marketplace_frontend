import { styled } from '@mui/material/styles'

interface StyledImageProps {
  width?: string
  height?: string
  borderRadius?: string
}

export const StyledImage = styled('img')<StyledImageProps>(
  ({ width, height, borderRadius, ...rest }) => ({
    objectFit: 'cover',
    width: width || '80px',
    height: height || '80px',
    borderRadius: borderRadius || '10px',
  }),
)
