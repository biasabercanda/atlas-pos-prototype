import { AnimatePresence, motion } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { cn } from '../../lib/cn'
import { tapFeedback } from '../../lib/motion'

/*
 * Figma: Badge / Count (3:27), Badge / Best seller (3:29), as used on the
 * final screen (257:21167/8): 24 tall, min 26 wide, radius full, 12 Extra Bold,
 * shadow-badge, and a 2px bg-surface border so the pill reads as cut out of
 * the surface where it overlaps the tile. Not tappable.
 *
 * Motion (--motion-feedback):
 *   - the count pops in (scale from 60%, anchored at its right edge) the first
 *     time the item is added, and its number ticks on every add;
 *   - the ★ slides left to make room, by the count's measured width + 4px gap,
 *     and eases again when the count widens (9 → 10).
 * The ★'s offset is animated as a CSS `right` value from a layout measurement
 * (offsetWidth), not with Motion's layout projection, so it stays correct when
 * the presentation shell scales the whole app.
 */

const pill =
  'flex h-6 min-w-[26px] items-center justify-center rounded-full border-2 border-surface px-[7px] text-xs leading-4 font-extrabold shadow-badge'

const GAP = 4
const MIN_COUNT_WIDTH = 26

function CountBadge({ count, onWidth }: { count: number; onWidth: (w: number) => void }) {
  const ref = useRef<HTMLSpanElement>(null)
  // The number ticks only when the count changes after mount, not on page load.
  const [mountCount] = useState(count)
  const tick = count !== mountCount
  useLayoutEffect(() => {
    if (ref.current) onWidth(ref.current.offsetWidth)
  }, [count, onWidth])

  return (
    <motion.span
      ref={ref}
      data-badge="count"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.6, opacity: 0 }}
      transition={tapFeedback}
      style={{ originX: 1 }}
      className={cn(pill, 'absolute top-0 right-0 bg-badge text-badge-text')}
    >
      <motion.span
        key={count}
        initial={tick ? { scale: 1.3 } : false}
        animate={{ scale: 1 }}
        transition={tapFeedback}
        className="inline-block"
      >
        {count}
      </motion.span>
    </motion.span>
  )
}

/**
 * Badge row: its top-right corner sits 8px outside the tile's top-right corner.
 * Best seller sits to the left of the count, 4px apart.
 */
export function TileBadges({ count, bestSeller }: { count: number; bestSeller: boolean }) {
  const [countWidth, setCountWidth] = useState(MIN_COUNT_WIDTH)
  // Always mounted (even with no badges), so a first add can animate the count in.
  return (
    <span aria-hidden className="pointer-events-none absolute -top-2 -right-2 z-10 h-6">
      {bestSeller && (
        <motion.span
          data-badge="best-seller"
          initial={false}
          animate={{ right: count ? countWidth + GAP : 0 }}
          transition={tapFeedback}
          // Fixed 27 wide as in Figma (257:21168): the ★ glyph is wider than the 7px padding allows
          className={cn(pill, 'absolute top-0 w-[27px] px-0 bg-best-seller text-best-seller-text')}
        >
          ★
        </motion.span>
      )}
      <AnimatePresence initial={false}>
        {count > 0 && <CountBadge key="count" count={count} onWidth={setCountWidth} />}
      </AnimatePresence>
    </span>
  )
}
