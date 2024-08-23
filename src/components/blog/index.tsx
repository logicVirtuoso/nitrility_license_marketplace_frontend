import { Box, Typography } from '@mui/material'
import Link from '@mui/material/Link'
import CardMedia from '@mui/material/CardMedia'
import { Theme, useTheme } from '@mui/material/styles'

interface BlogCardProps {
  title: string
  image: string
  link: string
}

const BlogCard = ({ image, link, title }: BlogCardProps) => {
  const theme = useTheme()

  return (
    <Link target="_blank" href={link} underline="none">
      <Box sx={{ padding: '10px' }}>
        <Box
          sx={{
            boxShadow: 'rgba(0, 0, 0, 0.08) 0px 4px 16px',
            transition:
              'box-shadow 0.25s ease-in-out 0s, transform 0.25s ease 0s',
            borderRadius: '12px',
            marginTop: '8px',
            '&:hover': {
              boxShadow: 'rgba(0, 0, 0, 0.12) 0px 4px 16px',
              transform: 'translate(0px, -4px)',
            },
          }}
        >
          <CardMedia
            component="img"
            image={image}
            alt="Nitrility Blog"
            sx={{
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              margin: 'auto',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <Typography sx={{ p: '16px', borderRadius: '12px', color: 'black' }}>
            {title}
          </Typography>
        </Box>
      </Box>
    </Link>
  )
}

export default BlogCard
