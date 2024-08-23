import React, { useRef, useEffect } from 'react'

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideDetector(
  ref: React.RefObject<HTMLElement>,
  handler: (show: boolean) => void,
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        handler(false)
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, handler])
}

/**
 * Component that alerts if you click outside of it
 */

interface Props {
  children: React.ReactNode
  handler: (show: boolean) => void
}

function OutsideDetector({ children, handler }: Props) {
  const wrapperRef = useRef(null)
  useOutsideDetector(wrapperRef, handler)

  return <div ref={wrapperRef}>{children}</div>
}

export default OutsideDetector
