import { cn } from '../../lib/cn'

/*
 * Figma: Badge / Count (3:27), Badge / Best seller (3:29), as used on the
 * final screen (257:21167/8): 24 tall, min 26 wide, radius full, 12 Extra Bold,
 * shadow-badge, and a 2px bg-surface border so the pill reads as cut out of
 * the surface where it overlaps the tile. Not tappable.
 */

const pill =
  'flex h-6 min-w-[26px] items-center justify-center rounded-full border-2 border-surface px-[7px] text-xs leading-4 font-extrabold shadow-badge'

export function CountBadge({ count }: { count: number }) {
  return (
    <span data-badge="count" className={cn(pill, 'bg-badge text-badge-text')}>
      {count}
    </span>
  )
}

export function BestSellerBadge() {
  return (
    // Fixed 27 wide as in Figma (257:21168): the ★ glyph is wider than the 7px padding allows
    <span data-badge="best-seller" aria-label="Best seller" className={cn(pill, 'w-[27px] px-0 bg-best-seller text-best-seller-text')}>
      ★
    </span>
  )
}

/**
 * Badge row: its top-right corner sits 8px outside the tile's top-right corner.
 * Best seller sits to the left of the count, 4px apart.
 */
export function TileBadges({ count, bestSeller }: { count: number; bestSeller: boolean }) {
  if (!count && !bestSeller) return null
  return (
    <span aria-hidden className="pointer-events-none absolute -top-2 -right-2 z-10 flex gap-1">
      {bestSeller && <BestSellerBadge />}
      {count > 0 && <CountBadge count={count} />}
    </span>
  )
}
