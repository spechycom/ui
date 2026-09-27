import { useCallback, useEffect, useRef, useState } from 'react'

/** Returns scroll state for an edge fade that signals "more content" on a horizontally-scrolling bar. */
export function useHorizontalScrollFade<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    update()
    const resizeObserver = new ResizeObserver(update)
    resizeObserver.observe(el)
    // The content container is observed too: the container's own width can stay fixed
    // while its content grows (a screen where tab count/labels change later) — otherwise
    // the fade would go stale.
    if (el.firstElementChild) resizeObserver.observe(el.firstElementChild)
    return () => resizeObserver.disconnect()
  }, [update])

  return { ref, canScrollLeft, canScrollRight, onScroll: update }
}
