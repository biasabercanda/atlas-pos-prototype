import { DEVICES, type Device, type DeviceKey } from '../../lib/devices'
import { Segmented } from '../ui/Segmented'

/*
 * BRIEF §3 "Presentation in the browser": a segmented control with the four
 * tablets plus a readout of the size and scale ("1194 × 834 · 86%").
 * bg-raised track, bg-brand active segment, text-secondary labels. Not scaled.
 */

export function DeviceSwitcher({
  device,
  scale,
  onChange,
}: {
  device: Device
  scale: number
  onChange: (key: DeviceKey) => void
}) {
  return (
    <div className="flex h-12 shrink-0 items-center gap-4">
      <Segmented<DeviceKey>
        size="text"
        track="raised"
        value={device.key}
        onChange={onChange}
        options={DEVICES.map((d) => ({ value: d.key, content: d.label, title: `${d.label} · ${d.width} × ${d.height}` }))}
      />
      <span data-readout className="text-sm leading-5 whitespace-nowrap text-secondary tabular-nums">
        {device.width} × {device.height} · {Math.round(scale * 100)}%
      </span>
    </div>
  )
}
