import { useState } from 'react'
import type { HTMLMotionProps } from 'motion/react'

/*
 * Press feedback for TILES: scale 0.97 with a quick
 * spring, plus a `pressed` flag so the component can swap to shadow-pressed
 * and add the bg-overlay-pressed layer. Motion's tap gesture handles mouse,
 * touch and keyboard (Enter/Space), and cancels when the pointer leaves.
 *
 * Buttons don't scale (design decision): ui/Button uses CSS :active for its
 * pressed shadow + overlay. FLAT controls (tabs, icon buttons, toggle
 * segments, crumbs) use :active too (`active:bg-raised`).
 */
export const PRESS_SCALE = 0.97
export const pressSpring = { type: 'spring', stiffness: 900, damping: 45, mass: 0.6 } as const // ≈120ms

type TapProps = Pick<HTMLMotionProps<'button'>, 'whileTap' | 'onTapStart' | 'onTap' | 'onTapCancel' | 'transition'>

export function usePress(disabled = false): { pressed: boolean; tapProps: TapProps } {
  const [pressed, setPressed] = useState(false)
  if (disabled) return { pressed: false, tapProps: {} }
  return {
    pressed,
    tapProps: {
      whileTap: { scale: PRESS_SCALE },
      transition: pressSpring,
      onTapStart: () => setPressed(true),
      onTap: () => setPressed(false),
      onTapCancel: () => setPressed(false),
    },
  }
}
