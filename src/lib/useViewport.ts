import { useEffect, useState } from 'react'

export interface Viewport {
  width: number
  height: number
  /** Primary pointer is a finger (a real tablet or phone). */
  coarse: boolean
}

function read(): Viewport {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
    coarse: window.matchMedia('(pointer: coarse)').matches,
  }
}

/**
 * The browser window's size and pointer type, live. Read synchronously on the
 * first render (this is a client-only SPA), so the right mode shows from the
 * first paint with no flash. Only the presentation shell uses this; the app
 * itself responds to its own container size.
 */
export function useViewport(): Viewport {
  const [viewport, setViewport] = useState(read)
  useEffect(() => {
    const update = () => setViewport(read())
    const coarse = window.matchMedia('(pointer: coarse)')
    window.addEventListener('resize', update)
    coarse.addEventListener('change', update)
    return () => {
      window.removeEventListener('resize', update)
      coarse.removeEventListener('change', update)
    }
  }, [])
  return viewport
}
