/** Category colours; each maps to --category-{color}-mark and -overlay tokens. */
export type CategoryColor = 'blue' | 'orange' | 'amber' | 'teal' | 'violet'

export type ItemId = string
export type FolderId = string
export type TabId = string

export interface MenuItem {
  id: ItemId
  name: string
  /** Money is always integer cents. Can be negative (e.g. "Combo Deal −$3"). */
  priceCents: number
  color: CategoryColor
  bestSeller: boolean
  soldOut: boolean
}

export interface Folder {
  id: FolderId
  name: string
  color: CategoryColor
  itemIds: ItemId[]
}

/** A cell in a tab's 5×4 layout, as authored in menu.json. */
export type LayoutCell =
  | { kind: 'item'; itemId: ItemId }
  | { kind: 'folder'; folderId: FolderId }
  | { kind: 'openItem' }
  | { kind: 'empty' }

export interface Tab {
  id: TabId
  name: string
  layout: LayoutCell[]
}

export interface Pricing {
  /** 0.2 = +20% (tax + service) */
  surchargeRate: number
  /** Round the total to this many cents (10 = nearest $0.10). */
  roundToCents: number
}

export interface OrderLine {
  itemId: ItemId
  qty: number
}

export interface Order {
  id: number
  table: string
  /** In the order they were first added. */
  lines: OrderLine[]
}

export interface Menu {
  items: Record<ItemId, MenuItem>
  folders: Record<FolderId, Folder>
  tabs: Tab[]
  pricing: Pricing
  initialOrder: Order
}

/** A resolved grid cell, ready to render. */
export type GridCell =
  | { key: string; kind: 'product'; item: MenuItem }
  | { key: string; kind: 'folder'; folder: Folder }
  | { key: string; kind: 'openItem' }
  | { key: string; kind: 'back' }
  | { key: string; kind: 'empty' }

export interface Crumb {
  /** 'tab' returns to the tab root; 'folder' is the open folder (always current). */
  level: 'tab' | 'folder'
  label: string
  current: boolean
}
