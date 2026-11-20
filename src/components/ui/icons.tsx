import type { SVGProps } from 'react'

/*
 * Filled icons that Iconoir doesn't ship (no official solid version).
 * Paths are exported from Figma (Components → Icons), built from the Iconoir
 * regular icons. Colours are tokenised instead of the export's hex:
 *   - the shape uses currentColor (set it with a text-* class);
 *   - "Cut" layers use --icon-cutout, which defaults to the button surface,
 *     so the cut-outs take the colour of whatever the icon sits on.
 * Pause (solid) does exist in Iconoir: import it from "iconoir-react/solid".
 */

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 20, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

const shape = { fill: 'currentColor', stroke: 'currentColor', strokeWidth: 2, strokeLinejoin: 'round' } as const
const cut = 'var(--icon-cutout, var(--bg-surface))'

/** iconoir/map (filled, custom) — Figma 118:10177 */
export function MapFilled(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...shape} d="M3 5.43V20.17C3 20.58 3.4 20.87 3.79 20.74L7.6 19.47V3.47L3.41 4.86C3.17 4.94 3 5.17 3 5.43Z" />
      <path {...shape} d="M10.4 3.47V19.47L13.6 20.53V4.53L10.4 3.47Z" />
      <path {...shape} d="M16.4 4.53V20.53L20.59 19.14C20.83 19.06 21 18.83 21 18.57V3.83C21 3.42 20.6 3.13 20.21 3.26L16.4 4.53Z" />
    </Svg>
  )
}

/** iconoir/view-grid (filled, custom) — Figma 118:10183 */
export function ViewGridFilled(props: IconProps) {
  const sq = { fill: 'currentColor', stroke: 'currentColor', strokeWidth: 2 } as const
  return (
    <Svg {...props}>
      <path {...sq} d="M14 20.4V14.6C14 14.27 14.27 14 14.6 14H20.4C20.73 14 21 14.27 21 14.6V20.4C21 20.73 20.73 21 20.4 21H14.6C14.27 21 14 20.73 14 20.4Z" />
      <path {...sq} d="M3 20.4V14.6C3 14.27 3.27 14 3.6 14H9.4C9.73 14 10 14.27 10 14.6V20.4C10 20.73 9.73 21 9.4 21H3.6C3.27 21 3 20.73 3 20.4Z" />
      <path {...sq} d="M14 9.4V3.6C14 3.27 14.27 3 14.6 3H20.4C20.73 3 21 3.27 21 3.6V9.4C21 9.73 20.73 10 20.4 10H14.6C14.27 10 14 9.73 14 9.4Z" />
      <path {...sq} d="M3 9.4V3.6C3 3.27 3.27 3 3.6 3H9.4C9.73 3 10 3.27 10 3.6V9.4C10 9.73 9.73 10 9.4 10H3.6C3.27 10 3 9.73 3 9.4Z" />
    </Svg>
  )
}

/** iconoir/fire-flame (filled, custom) — Figma 154:16807 */
export function FireFlameFilled(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...shape} d="M12 21C17.05 21 20 18.1 20 13.13C20 8.15 12 3 12 3C12 3 4 8.15 4 13.13C4 18.1 6.95 21 12 21Z" />
      <path
        fill={cut}
        stroke={cut}
        strokeWidth={0.5}
        strokeLinejoin="round"
        d="M8 18C8 20.41 9.79 21 12 21C15.76 21 17 18.5 14.5 13.5C11 18 10.5 11 11 9C9.5 12 8 14.82 8 18Z"
      />
    </Svg>
  )
}

/** iconoir/printer (filled, custom) — Figma 154:16813 */
export function PrinterFilled(props: IconProps) {
  return (
    <Svg {...props}>
      <path {...shape} d="M6 10V3.6C6 3.27 6.27 3 6.6 3H17.4C17.73 3 18 3.27 18 3.6V10" />
      <path {...shape} d="M21 20.4V14C21 11.79 19.21 10 17 10H7C4.79 10 3 11.79 3 14V20.4C3 20.73 3.27 21 3.6 21H20.4C20.73 21 21 20.73 21 20.4Z" />
      <path stroke={cut} strokeWidth={2} strokeLinecap="round" d="M7 17H17" />
      <path stroke={cut} strokeWidth={2} strokeLinecap="round" d="M17 13.01L17.01 13" />
    </Svg>
  )
}
