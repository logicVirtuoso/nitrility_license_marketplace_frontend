import React, { useEffect, useRef, useState } from 'react'
import Carousel from 'react-multi-carousel'
import { styled } from '@mui/material/styles'
import './style.css'

interface CarouselProps {
  settings: any
  children: any
  size?: any
  infinite?: boolean
  autoPlay?: boolean
  autoPlaySpeed?: number
}

const SlideContainer = styled('div')(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    padding: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    padding: '10px',
  },
}))

const CustomCarousel: React.FC<CarouselProps> = ({
  settings,
  children,
  size,
  infinite = false,
  autoPlay = false,
  autoPlaySpeed = 0,
}) => {
  const currentCarousel = useRef(null)
  const [pending, setPending] = useState(false)

  useEffect(() => {
    if (size > 0) {
      setPending(true)
    }
  }, [size])

  useEffect(() => {
    if (pending) {
      setPending(false)
    }
  }, [pending])

  return (
    <SlideContainer>
      {!pending ? (
        <Carousel
          ref={currentCarousel}
          autoPlay={autoPlay}
          autoPlaySpeed={autoPlaySpeed}
          infinite={infinite}
          dotListClass="custom-dot-list-style"
          responsive={settings}
          ssr={true}
          containerClass="custom-container-style"
          customTransition="all .5"
          transitionDuration={500}
        >
          {children}
        </Carousel>
      ) : null}
    </SlideContainer>
  )
}

export default CustomCarousel
