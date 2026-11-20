import raw from './menu.json'
import { toCents } from '../lib/money'
import type { CategoryColor, Folder, LayoutCell, Menu, MenuItem, Tab } from './types'

/*
 * Normalises menu.json once at load: prices → cents, layout cells → tagged
 * unions, optional flags → booleans. The rest of the app only sees `menu`.
 */

type RawItem = {
  name: string
  price: number
  color: string
  bestSeller?: boolean
  soldOut?: boolean
}
type RawCell = { item: string } | { folder: string } | { openItem: boolean } | null

const items: Record<string, MenuItem> = Object.fromEntries(
  Object.entries(raw.items as Record<string, RawItem>).map(([id, it]) => [
    id,
    {
      id,
      name: it.name,
      priceCents: toCents(it.price),
      color: it.color as CategoryColor,
      bestSeller: it.bestSeller ?? false,
      soldOut: it.soldOut ?? false,
    },
  ]),
)

const folders: Record<string, Folder> = Object.fromEntries(
  Object.entries(raw.folders).map(([id, f]) => [
    id,
    { id, name: f.name, color: f.color as CategoryColor, itemIds: f.items },
  ]),
)

function toCell(cell: RawCell): LayoutCell {
  if (cell === null) return { kind: 'empty' }
  if ('item' in cell) return { kind: 'item', itemId: cell.item }
  if ('folder' in cell) return { kind: 'folder', folderId: cell.folder }
  return { kind: 'openItem' }
}

const tabs: Tab[] = raw.tabs.map((t) => ({
  id: t.id,
  name: t.name,
  layout: (t.layout as RawCell[]).map(toCell),
}))

export const menu: Menu = {
  items,
  folders,
  tabs,
  pricing: {
    surchargeRate: raw.pricing.surchargeRate,
    roundToCents: toCents(raw.pricing.roundTo),
  },
  initialOrder: {
    id: raw.initialOrder.id,
    table: raw.initialOrder.table,
    lines: raw.initialOrder.lines.map((l) => ({ itemId: l.itemId, qty: l.qty })),
  },
}

export const GRID_CELLS = 20 // 5 columns × 4 rows, on every device
