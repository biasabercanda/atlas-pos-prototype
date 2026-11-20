import type { CSSProperties, ReactNode } from 'react'
import { cn, pressFadeFilter, pressFadeOpacity } from '../../lib/cn'
import type { CategoryColor } from '../../data/types'

/*
 * Shared shell for rectangular tiles (Product, Open item, Back). BRIEF §4, §6.
 *
 * Layers, bottom to top (inside a radius-12 shell that clips them):
 *   base  bg-tile
 *   tint  --category-{color}-overlay with mix-blend-mode: overlay (product only)
 *   press bg-overlay-pressed, only while pressed
 *   strip 7px --category-{color}-mark on the left (product only)
 *   edge  shadow-tile (or shadow-pressed), drawn on top so the tint and strip
 *         don't cover its insets, as in Figma; its outer part is clipped
 * The shell itself carries only the outer drop shadow (drop-shadow-tile), so
 * each inset is painted exactly once.
 * Content (name, icons) sits above all layers; badges sit outside the shell,
 * so the wrapper doesn't clip (the shell does).
 *
 * Pressed: CSS :active on the button (no scale): drop shadow off, edge becomes
 * shadow-pressed, overlay on, easing in over --motion-press-in and out over
 * --motion-press-out. Disabled (sold out): no shadows, no press, no tap.
 *
 * Training mode: `highlight` draws a brand outline; `disabled` blocks taps.
 */

export interface TileShellProps {
  label: string
  onClick?: () => void
  disabled?: boolean
  highlight?: boolean
  /** Category colour: adds the tint layer. */
  tint?: CategoryColor
  /** Category colour: adds the left colour strip. */
  strip?: CategoryColor
  /** Things outside the shell, e.g. badges. */
  overlay?: ReactNode
  className?: string
  children: ReactNode
}

export function TileShell({
  label,
  onClick,
  disabled = false,
  highlight = false,
  tint,
  strip,
  overlay,
  className,
  children,
}: TileShellProps) {
  const vars = {
    ...(tint && { '--tint': `var(--category-${tint}-overlay)` }),
    ...(strip && { '--mark': `var(--category-${strip}-mark)` }),
  } as CSSProperties

  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      style={vars}
      className={cn(
        'group/press relative size-full min-h-0 min-w-0 text-primary @container',
        disabled ? 'cursor-default' : 'cursor-pointer',
        highlight && 'rounded-lg outline-2 outline-offset-2 outline-brand',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute inset-0 isolate overflow-hidden rounded-lg bg-tile',
          // Outer drop shadow only. A box-shadow here would also paint shadow-tile's
          // insets, which show through the transparent tint and double up with the
          // edge layer below.
          !disabled && ['drop-shadow-tile group-active/press:drop-shadow-none', pressFadeFilter],
        )}
      >
        {tint && <span className="absolute inset-0 bg-(--tint) mix-blend-overlay" />}
        {!disabled && (
          <span
            className={cn('absolute inset-0 bg-overlay-pressed opacity-0 group-active/press:opacity-100', pressFadeOpacity)}
          />
        )}
        {strip && <span className={cn('absolute inset-y-0 left-0 w-[7px] bg-(--mark)', disabled && 'opacity-40')} />}
        {!disabled && (
          <>
            {/* Default and pressed edges cross-fade: box-shadow lists of different
                shapes can't interpolate, opacity can. */}
            <span
              className={cn(
                'absolute inset-0 rounded-[inherit] shadow-tile group-active/press:opacity-0',
                pressFadeOpacity,
              )}
            />
            <span
              className={cn(
                'absolute inset-0 rounded-[inherit] opacity-0 shadow-pressed group-active/press:opacity-100',
                pressFadeOpacity,
              )}
            />
          </>
        )}
      </span>
      <span className="relative flex size-full flex-col items-center justify-center">{children}</span>
      {overlay}
    </button>
  )
}
