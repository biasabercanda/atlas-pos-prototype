import { cn } from '../../lib/cn'
import type { MenuItem } from '../../data/types'
import { TileBadges } from './TileBadge'
import { TileShell } from './TileShell'

/*
 * Figma: Tile / Product (198:19439), final instances 257:21166 / 257:21170.
 * Padding 12 12 12 20, content centred, gap 4.
 * Name: Tile/Name 14/20 Bold, max 2 lines; 16/24 when the tile is ≥160 wide
 * (container query on the tile, BRIEF §3).
 * Sold out: no shadow, tint kept, strip 40%, name text-disabled, plus
 * "Sold out" 12/16 Semi Bold text-secondary; no press, no tap.
 */

export interface ProductTileProps {
  item: MenuItem
  qty: number
  onAdd: () => void
  highlight?: boolean
}

export function ProductTile({ item, qty, onAdd, highlight }: ProductTileProps) {
  const soldOut = item.soldOut
  return (
    <TileShell
      label={soldOut ? `${item.name}, sold out` : qty ? `${item.name}, ${qty} in order` : item.name}
      onClick={onAdd}
      disabled={soldOut}
      highlight={highlight}
      tint={item.color}
      strip={item.color}
      overlay={<TileBadges count={qty} bestSeller={item.bestSeller} />}
    >
      <span className="flex w-full flex-col items-center gap-1 py-3 pr-3 pl-5 text-center">
        <span
          className={cn(
            'line-clamp-2 text-sm leading-5 font-bold @min-[160px]:text-base @min-[160px]:leading-6',
            soldOut ? 'text-disabled' : 'text-primary',
          )}
        >
          {item.name}
        </span>
        {soldOut && <span className="text-xs leading-4 font-semibold text-secondary">Sold out</span>}
      </span>
    </TileShell>
  )
}
