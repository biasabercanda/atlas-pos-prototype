import { useState, type ReactNode } from 'react'
import {
  DEFAULT_DEVICE,
  deviceByKey,
  frameScale,
  MAX_APP,
  MIN_DEVICE_MODE,
  MIN_SCALE,
  type DeviceKey,
} from '../../lib/devices'
import { useViewport } from '../../lib/useViewport'
import { DeviceFrame } from './DeviceFrame'
import { DeviceSwitcher } from './DeviceSwitcher'

/*
 * BRIEF §3 "Presentation in the browser". The app is a tablet app shown in a
 * web page; it never stretches to desktop sizes. Two modes, chosen
 * automatically from the browser window:
 *
 *   Device  pointer: coarse and the window ≥ 1180 × 800 (a real tablet in
 *           landscape). The app fills the screen, capped at 1366 × 1024 and
 *           centred. No frame, no switcher.
 *   Framed  everything else (desktop and laptop browsers). The app at an exact
 *           device size inside a frame, scaled to fit, never up, with a device
 *           switcher above it. The choice is kept in ?device= (air11 · pro11 ·
 *           android10 · pro13), so a link opens a specific device.
 *
 * If the framed scale would drop below 0.5 (phones, tiny windows), a message
 * shows instead. This component only arranges the page: the order store sits
 * above it, so switching devices keeps the order, tab and open folder.
 */

function readDeviceParam(): DeviceKey {
  return deviceByKey(new URLSearchParams(window.location.search).get('device')).key
}

/** Writes ?device= without reloading; keeps any other params (e.g. ?order=empty). */
function writeDeviceParam(key: DeviceKey) {
  const url = new URL(window.location.href)
  if (key === DEFAULT_DEVICE) url.searchParams.delete('device')
  else url.searchParams.set('device', key)
  window.history.replaceState(null, '', url)
}

export function PresentationShell({ children }: { children: ReactNode }) {
  const viewport = useViewport()
  const [deviceKey, setDeviceKey] = useState<DeviceKey>(readDeviceParam)

  const deviceMode =
    viewport.coarse && viewport.width >= MIN_DEVICE_MODE.width && viewport.height >= MIN_DEVICE_MODE.height

  if (deviceMode) {
    return (
      <div data-shell="device" className="flex h-full items-center justify-center bg-presentation">
        <div
          style={{ width: Math.min(viewport.width, MAX_APP.width), height: Math.min(viewport.height, MAX_APP.height) }}
        >
          {children}
        </div>
      </div>
    )
  }

  const device = deviceByKey(deviceKey)
  const scale = frameScale(viewport, device)

  if (scale < MIN_SCALE) {
    return (
      <div data-shell="too-small" className="flex h-full items-center justify-center bg-presentation p-6">
        <p className="max-w-sm text-center text-base leading-6 text-secondary">
          This prototype is designed for tablets. Open it on a tablet, or on a laptop or desktop browser.
        </p>
      </div>
    )
  }

  const selectDevice = (key: DeviceKey) => {
    setDeviceKey(key)
    writeDeviceParam(key)
  }

  // Vertical budget matches FRAME_MARGIN.y = 136: 32 top + 48 switcher + 24 gap + 32 bottom.
  return (
    <div data-shell="framed" className="flex h-full flex-col items-center gap-6 overflow-hidden bg-presentation px-8 py-8">
      <DeviceSwitcher device={device} scale={scale} onChange={selectDevice} />
      <div className="flex min-h-0 w-full flex-1 justify-center">
        <DeviceFrame device={device} scale={scale}>
          {children}
        </DeviceFrame>
      </div>
    </div>
  )
}
