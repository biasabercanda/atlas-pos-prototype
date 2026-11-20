import { applySurcharge } from '../lib/money'
import { GRID_CELLS } from './menu'
import type { Crumb, FolderId, GridCell, ItemId, Menu, MenuItem, OrderLine, TabId } from './types'

/** Pad (or trim) a list of cells to exactly 20, filling with empty slots. */
function padToGrid(cells: GridCell[], keyPrefix: string): GridCell[] {
  const padded = cells.slice(0, GRID_CELLS)
  for (let i = padded.length; i < GRID_CELLS; i++) {
    padded.push({ key: `${keyPrefix}-empty-${i}`, kind: 'empty' })
  }
  return padded
}

/**
 * The 20 cells to show in the menu grid.
 * - Tab view: the tab's authored layout.
 * - Folder view: Back tile, then the folder's items, padded with empty slots.
 */
export function cellsFor(menu: Menu, tabId: TabId, folderId: FolderId | null): GridCell[] {
  if (folderId) {
    const folder = menu.folders[folderId]
    const cells: GridCell[] = [
      { key: `${folderId}-back`, kind: 'back' },
      ...folder.itemIds.map((id): GridCell => ({ key: `${folderId}-${id}`, kind: 'product', item: menu.items[id] })),
    ]
    return padToGrid(cells, folderId)
  }

  const tab = menu.tabs.find((t) => t.id === tabId) ?? menu.tabs[0]
  const cells = tab.layout.map((cell, i): GridCell => {
    const key = `${tab.id}-${i}`
    switch (cell.kind) {
      case 'item':
        return { key, kind: 'product', item: menu.items[cell.itemId] }
      case 'folder':
        return { key, kind: 'folder', folder: menu.folders[cell.folderId] }
      case 'openItem':
        return { key, kind: 'openItem' }
      case 'empty':
        return { key, kind: 'empty' }
    }
  })
  return padToGrid(cells, tab.id)
}

/** ["Kebabs"] at a tab root; ["Kebabs", "Gyros"] inside a folder. */
export function breadcrumbFor(menu: Menu, tabId: TabId, folderId: FolderId | null): Crumb[] {
  const tab = menu.tabs.find((t) => t.id === tabId) ?? menu.tabs[0]
  if (!folderId) return [{ level: 'tab', label: tab.name, current: true }]
  return [
    { level: 'tab', label: tab.name, current: false },
    { level: 'folder', label: menu.folders[folderId].name, current: true },
  ]
}

/** itemId → qty, for tile count badges. */
export function qtyByItem(lines: OrderLine[]): Map<ItemId, number> {
  return new Map(lines.map((l) => [l.itemId, l.qty]))
}

export interface LineView {
  item: MenuItem
  qty: number
  totalCents: number
}

export function lineViews(menu: Menu, lines: OrderLine[]): LineView[] {
  return lines.map((l) => {
    const item = menu.items[l.itemId]
    return { item, qty: l.qty, totalCents: item.priceCents * l.qty }
  })
}

export interface Totals {
  subtotalCents: number
  totalCents: number
}

export function totalsFor(menu: Menu, lines: OrderLine[]): Totals {
  const subtotalCents = lineViews(menu, lines).reduce((sum, l) => sum + l.totalCents, 0)
  const { surchargeRate, roundToCents } = menu.pricing
  return { subtotalCents, totalCents: applySurcharge(subtotalCents, surchargeRate, roundToCents) }
}
