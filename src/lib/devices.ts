/*
 * Tablet sizes for the presentation shell (BRIEF §3, "Device sizes for the
 * switcher"). Landscape CSS px. The key goes in the URL: ?device=pro11.
 */

export type DeviceKey = 'air11' | 'pro11' | 'android10' | 'pro13'

export interface Device {
  key: DeviceKey
  label: string
  width: number
  height: number
}

export const DEVICES: Device[] = [
  { key: 'air11', label: 'iPad Air 11"', width: 1180, height: 820 },
  { key: 'pro11', label: 'iPad Pro 11"', width: 1194, height: 834 },
  { key: 'android10', label: 'Android POS 10"', width: 1280, height: 800 },
  { key: 'pro13', label: 'iPad Pro 13"', width: 1366, height: 1024 },
]

export const DEFAULT_DEVICE: DeviceKey = 'pro11'

export function deviceByKey(key: string | null): Device {
  return DEVICES.find((d) => d.key === key) ?? DEVICES.find((d) => d.key === DEFAULT_DEVICE)!
}

/** The largest tablet: device mode never lays the app out bigger than this. */
export const MAX_APP = { width: 1366, height: 1024 }

/** Device mode applies to a touch screen at least this big (a tablet in landscape). */
export const MIN_DEVICE_MODE = { width: 1180, height: 800 }

/**
 * Framed-mode fit: scale = min(1, (w − 64) / dw, (h − 136) / dh).
 * 64 = 32px side margins; 136 = top padding + switcher + gap + bottom margin.
 */
export const FRAME_MARGIN = { x: 64, y: 136 }

/** Below this framed scale the prototype shows the "designed for tablets" message. */
export const MIN_SCALE = 0.5

export function frameScale(viewport: { width: number; height: number }, device: Device) {
  return Math.min(
    1,
    (viewport.width - FRAME_MARGIN.x) / device.width,
    (viewport.height - FRAME_MARGIN.y) / device.height,
  )
}
