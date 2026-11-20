import { useId, type CSSProperties } from 'react'
import { cn, pressFadeFilter, pressFadeOpacity, pressSink } from '../../lib/cn'
import { useElementSize } from '../../lib/useElementSize'
import type { Folder } from '../../data/types'

/*
 * Figma: Tile / Folder (277:177), final instance 257:21204.
 *
 * Shape: radius 10 with a straight 24px diagonal cut on the top-right corner.
 * clip-path would also clip the shadows, so the tile is one SVG drawn at the
 * cell's real (fractional) size, using the same layers and filters Figma exports:
 *   body   bg-tile-base, 1.5px dark inner bottom edge; outer drop shadow (CSS)
 *   tint   --category-{color}-overlay, mix-blend-mode: overlay
 *   press  bg-overlay-pressed + inner shadow, both following the cut
 *   light  2px --effect-top-light at 12% along the top, following the
 *          top-left radius and stopping where the cut starts
 *   flap   24×24 --category-{color}-mark triangle in the cut, rounded inner
 *          corner (r 5), even 4px shadow
 * Content: name 14/20 Bold (16/24 when ≥160 wide) + "N items" 12/16 text-secondary.
 *
 * Pressed (CSS :active, no scale): outer shadow off, pressed layers on.
 */

const RADIUS = 10
const CUT = 24

/** Body outline at w × h. */
function bodyPath(w: number, h: number) {
  const r = RADIUS
  return [
    `M${r} 0`,
    `H${w - CUT}`,
    `L${w} ${CUT}`,
    `V${h - r}`,
    `A${r} ${r} 0 0 1 ${w - r} ${h}`,
    `H${r}`,
    `A${r} ${r} 0 0 1 0 ${h - r}`,
    `V${r}`,
    `A${r} ${r} 0 0 1 ${r} 0`,
    'Z',
  ].join(' ')
}

/** 2px top light: follows the top-left radius, ends where the cut starts. */
function topLightPath(w: number) {
  // Same curves as the Figma export: outer edge on the body's top-left radius,
  // inner edge the same curve 2px lower, ending at y 12 on the left side.
  return `M0 10 C0 4.477 4.477 0 10 0 H${w - CUT} V2 H10 C4.477 2 0 6.477 0 12 Z`
}

/** Fold flap in its own 24×24 box: right angle bottom-left, rounded r 5. */
const FLAP = 'M0 0 L24 24 H5 C3.67 24 2.4 23.47 1.46 22.54 C0.53 21.6 0 20.33 0 19 Z'

export interface FolderTileProps {
  folder: Folder
  onOpen: () => void
  highlight?: boolean
}

export function FolderTile({ folder, onOpen, highlight }: FolderTileProps) {
  const { ref, size } = useElementSize<HTMLButtonElement>()
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const edge = `folder-edge-${uid}`
  const pressed = `folder-pressed-${uid}`

  const vars = {
    '--tint': `var(--category-${folder.color}-overlay)`,
    '--mark': `var(--category-${folder.color}-mark)`,
  } as CSSProperties

  const count = folder.itemIds.length

  return (
    <button
      ref={ref}
      type="button"
      aria-label={`${folder.name} folder, ${count} items`}
      onClick={onOpen}
      style={vars}
      className={cn(
        'group/press relative size-full min-h-0 min-w-0 cursor-pointer text-primary @container',
        highlight && 'rounded-md outline-2 outline-offset-2 outline-brand',
      )}
    >
      {size && (
        <svg
          aria-hidden
          width={size.width}
          height={size.height}
          viewBox={`0 0 ${size.width} ${size.height}`}
          className={cn('absolute inset-0 overflow-visible drop-shadow-tile group-pressed:drop-shadow-none', pressFadeFilter)}
        >
          <defs>
            {/* 1.5px dark inner edge along the bottom (inset part of Shadow/Tile) */}
            <filter id={edge} x="-10%" y="-10%" width="120%" height="120%">
              <feOffset in="SourceAlpha" dy="-1.5" result="off" />
              <feComposite in="SourceAlpha" in2="off" operator="arithmetic" k2="1" k3="-1" result="band" />
              <feFlood style={{ floodColor: 'var(--effect-inner-edge)' }} result="c" />
              <feComposite in="c" in2="band" operator="in" result="shadow" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="shadow" />
              </feMerge>
            </filter>
            {/* Shadow/Pressed as an inner shadow that follows the cut */}
            <filter id={pressed} x="-10%" y="-10%" width="120%" height="120%">
              <feOffset in="SourceAlpha" dy="2" />
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceAlpha" in2="blur" operator="arithmetic" k2="1" k3="-1" result="inner" />
              <feFlood style={{ floodColor: 'var(--effect-inner-pressed)' }} result="c" />
              <feComposite in="c" in2="inner" operator="in" result="shadow" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="shadow" />
              </feMerge>
            </filter>
          </defs>

          <g style={{ isolation: 'isolate' }}>
            <path d={bodyPath(size.width, size.height)} filter={`url(#${edge})`} style={{ fill: 'var(--bg-tile-base)' }} />
            <path
              d={bodyPath(size.width, size.height)}
              filter={`url(#${pressed})`}
              className={cn('opacity-0 group-pressed:opacity-100', pressFadeOpacity)}
              style={{ fill: 'var(--bg-tile-base)' }}
            />
            <path d={bodyPath(size.width, size.height)} style={{ fill: 'var(--tint)', mixBlendMode: 'overlay' }} />
            <path
              d={bodyPath(size.width, size.height)}
              className={cn('opacity-0 group-pressed:opacity-100', pressFadeOpacity)}
              style={{ fill: 'var(--bg-overlay-pressed)' }}
            />
            <path d={topLightPath(size.width)} style={{ fill: 'var(--effect-top-light)', opacity: 0.12 }} />
          </g>
        </svg>
      )}

      {/* Fold flap: its own element so the CSS drop-shadow filter applies reliably */}
      <svg aria-hidden width="24" height="24" viewBox="0 0 24 24" className="absolute top-0 right-0 overflow-visible drop-shadow-flap">
        <path d={FLAP} style={{ fill: 'var(--mark)' }} />
      </svg>

      <span
        className={cn(
          'relative flex size-full flex-col items-center justify-center gap-[3px] py-3 pr-3 pl-5 text-center',
          pressSink,
        )}
      >
        <span className="line-clamp-2 text-sm leading-5 font-bold text-primary @min-[160px]:text-base @min-[160px]:leading-6">
          {folder.name}
        </span>
        <span className="text-xs leading-4 text-secondary">{count} items</span>
      </span>
    </button>
  )
}
