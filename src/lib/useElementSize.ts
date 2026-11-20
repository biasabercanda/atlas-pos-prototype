import { useLayoutEffect, useRef, useState } from 'react'

/**
 * Live layout width/height of an element, fractional (e.g. 150.8 × 150.5).
 * Uses ResizeObserver's border box, which ignores CSS transforms, so sizes
 * stay true when the presentation shell scales the whole app down.
 */
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [size, setSize] = useState<{ width: number; height: number } | null>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    // First paint: integer size, refined by the observer's first callback.
    setSize({ width: el.offsetWidth, height: el.offsetHeight })
    const observer = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize?.[0]
      setSize(
        box
          ? { width: box.inlineSize, height: box.blockSize }
          : { width: entry.contentRect.width, height: entry.contentRect.height },
      )
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, size }
}
