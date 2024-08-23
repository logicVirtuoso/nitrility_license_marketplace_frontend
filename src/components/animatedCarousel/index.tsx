import * as React from 'react'
import { Box } from '@mui/material'
import LicenseCard from '../licenseCard'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { useKeenSlider } from 'keen-slider/react'
import NothingHere from '../nothing'
import 'keen-slider/keen-slider.min.css'
import './style.css'
import { CommonLicenseDataIF } from 'src/interface'

interface AnimatedCarouselProps {
  previewCount?: number
  spacing?: number
  licenses: Array<any>
  autoScroll?: boolean
  handler?: (any) => void
}

function Arrow(props: {
  disabled: boolean
  left?: boolean
  onClick: (e: any) => void
}) {
  const disabeld = props.disabled ? ' arrow--disabled' : ''
  return (
    <Box
      onClick={props.onClick}
      className={`arrow ${
        props.left ? 'arrow--left' : 'arrow--right'
      } ${disabeld}`}
    >
      {props.left && <KeyboardArrowLeftIcon />}
      {!props.left && <KeyboardArrowRightIcon />}
    </Box>
  )
}

export default function AnimatedCarousel({
  previewCount = 5,
  spacing = 12,
  licenses,
  autoScroll = false,
  handler = null,
}: AnimatedCarouselProps) {
  const [reRender, setRerender] = React.useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [created, setCreated] = React.useState(false)
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      initial: 0,
      created() {
        setCreated(true)
      },
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel)
      },
      slides: {
        perView: previewCount,
        spacing: spacing,
      },
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>
        let mouseOver = false
        function clearNextTimeout() {
          clearTimeout(timeout)
        }
        function nextTimeout() {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 2000)
        }

        if (autoScroll) {
          slider.on('created', () => {
            slider.container.addEventListener('mouseover', () => {
              mouseOver = true
              clearNextTimeout()
            })
            slider.container.addEventListener('mouseout', () => {
              mouseOver = false
              nextTimeout()
            })
            nextTimeout()
          })
          slider.on('dragStarted', clearNextTimeout)
          slider.on('animationEnded', nextTimeout)
          slider.on('updated', nextTimeout)
        }
      },
    ],
  )

  React.useEffect(() => {
    if (licenses?.length > 0) {
      setRerender(true)
    }
  }, [licenses])

  React.useEffect(() => {
    if (reRender) {
      setRerender(false)
    }
  }, [reRender])

  return (
    <React.Fragment>
      {reRender || (
        <div className="animated-carousel-block">
          <div className="navigation-wrapper">
            <div className="keenslider-wrapper">
              {licenses.length > 0 ? (
                <div ref={sliderRef} className="keen-slider">
                  {licenses?.map((license, idx) => {
                    const commonLicenseData: CommonLicenseDataIF = license
                    return (
                      <div
                        className="keen-slider__slide number-slide"
                        key={idx}
                      >
                        <LicenseCard
                          commonLicenseData={commonLicenseData}
                          handler={handler && (() => handler(license))}
                        />
                      </div>
                    )
                  })}
                </div>
              ) : (
                <NothingHere />
              )}
            </div>
          </div>
          {created && instanceRef.current && licenses.length >= 5 && (
            <>
              <Arrow
                left
                onClick={(e: any) =>
                  e.stopPropagation() || instanceRef.current?.prev()
                }
                disabled={currentSlide === 0}
              />

              <Arrow
                onClick={(e: any) =>
                  e.stopPropagation() || instanceRef.current?.next()
                }
                disabled={
                  currentSlide ===
                  instanceRef.current.track.details.slides.length - 1
                }
              />
            </>
          )}
        </div>
      )}
    </React.Fragment>
  )
}
