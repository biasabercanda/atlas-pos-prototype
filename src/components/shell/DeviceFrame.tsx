import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import type { Device } from '../../lib/devices'
import { frameResize } from '../../lib/motion'

/*
 * BRIEF §3 Framed mode: the app laid out at the device's true size (e.g.
 * 1194 × 834), radius 24, 1px border-divider outline and a large soft shadow,
 * then scaled to fit with transform: scale() from the top centre. Only the
 * visual is scaled; the app's container queries see the real device size.
 *
 * Switching devices animates width, height and scale (--motion-frame), so
 * reviewers see the grid and the order panel adapt as the frame resizes.
 */

export function DeviceFrame({ device, scale, children }: { device: Device; scale: number; children: ReactNode }) {
  return (
    <motion.div
      data-device-frame
      // A layout node, so Motion's layout animations inside (the sliding active
      // tab) account for this frame's scale; without it they measure on screen
      // and overshoot. "position" keeps Motion from also animating our size.
      layout="position"
      initial={false}
      animate={{ width: device.width, height: device.height, scale }}
      transition={frameResize}
      style={{ originX: 0.5, originY: 0 }}
      className="shrink-0 overflow-hidden rounded-device shadow-device outline outline-divider"
    >
      {children}
    </motion.div>
  )
}
