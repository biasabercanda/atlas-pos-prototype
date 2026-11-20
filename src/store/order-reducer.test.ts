import { describe, expect, it } from 'vitest'
import { menu } from '../data/menu'
import { breadcrumbFor, cellsFor, qtyByItem, totalsFor } from '../data/selectors'
import { applySurcharge, formatMoney } from '../lib/money'
import { createPosReducer, initialPosState, type PosAction, type PosState } from './order-reducer'

const reduce = createPosReducer(menu)
const run = (state: PosState, ...actions: PosAction[]) => actions.reduce(reduce, state)
const start = () => initialPosState(menu)

describe('money', () => {
  it('formats cents', () => {
    expect(formatMoney(1290)).toBe('$12.90')
    expect(formatMoney(0)).toBe('$0.00')
    expect(formatMoney(-300)).toBe('−$3.00')
  })
  it('adds 20% and rounds to $0.10', () => {
    expect(applySurcharge(4270, 0.2, 10)).toBe(5120) // Figma: $42.70 → $51.20
  })
})

describe('initial state', () => {
  it('matches the Figma final: Kebabs tab, no folder, $42.70 / $51.20', () => {
    const s = start()
    expect(s.activeTabId).toBe('kebabs')
    expect(s.openFolderId).toBeNull()
    expect(s.order.lines).toEqual([
      { itemId: 'chicken-doner', qty: 2 },
      { itemId: 'lamb-doner', qty: 1 },
    ])
    expect(totalsFor(menu, s.order.lines)).toEqual({ subtotalCents: 4270, totalCents: 5120 })
  })
  it('?order=empty starts with no lines and $0.00', () => {
    const s = initialPosState(menu, { emptyOrder: true })
    expect(s.order.lines).toEqual([])
    expect(formatMoney(totalsFor(menu, s.order.lines).totalCents)).toBe('$0.00')
  })
})

describe('addItem', () => {
  it('increments an existing line in place', () => {
    const s = run(start(), { type: 'addItem', itemId: 'chicken-doner' })
    expect(s.order.lines).toEqual([
      { itemId: 'chicken-doner', qty: 3 },
      { itemId: 'lamb-doner', qty: 1 },
    ])
  })
  it('appends a new line at the bottom', () => {
    const s = run(start(), { type: 'addItem', itemId: 'diy-doner' }, { type: 'addItem', itemId: 'lamb-doner' })
    expect(s.order.lines.map((l) => [l.itemId, l.qty])).toEqual([
      ['chicken-doner', 2],
      ['lamb-doner', 2],
      ['diy-doner', 1],
    ])
    expect(qtyByItem(s.order.lines).get('diy-doner')).toBe(1)
  })
  it('ignores sold-out items (state is unchanged)', () => {
    const s0 = start()
    expect(run(s0, { type: 'addItem', itemId: 'falafel-doner' })).toBe(s0)
  })
  it('updates totals live', () => {
    const s = run(start(), { type: 'addItem', itemId: 'diy-doner' }) // +$13.50
    expect(totalsFor(menu, s.order.lines)).toEqual({ subtotalCents: 5620, totalCents: 6740 })
  })
  it('handles a negative-price discount line', () => {
    const s = run(start(), { type: 'addItem', itemId: 'combo-deal' }) // −$3.00
    expect(totalsFor(menu, s.order.lines).subtotalCents).toBe(3970)
  })
})

describe('navigation', () => {
  it('opens a folder: Back + items, padded to 20, breadcrumb Kebabs › Gyros', () => {
    const s = run(start(), { type: 'openFolder', folderId: 'gyros' })
    const cells = cellsFor(menu, s.activeTabId, s.openFolderId)
    expect(cells).toHaveLength(20)
    expect(cells[0].kind).toBe('back')
    expect(cells.filter((c) => c.kind === 'product')).toHaveLength(12)
    expect(cells.slice(13).every((c) => c.kind === 'empty')).toBe(true)
    expect(breadcrumbFor(menu, s.activeTabId, s.openFolderId).map((c) => c.label)).toEqual(['Kebabs', 'Gyros'])
  })
  it('closeFolder returns to the tab view', () => {
    const s = run(start(), { type: 'openFolder', folderId: 'gyros' }, { type: 'closeFolder' })
    expect(s.openFolderId).toBeNull()
    expect(cellsFor(menu, s.activeTabId, null)[0]).toMatchObject({ kind: 'product' })
  })
  it('switching tabs closes any open folder; the order survives', () => {
    const s = run(
      start(),
      { type: 'addItem', itemId: 'diy-doner' },
      { type: 'openFolder', folderId: 'gyros' },
      { type: 'setTab', tabId: 'drinks' },
    )
    expect(s.activeTabId).toBe('drinks')
    expect(s.openFolderId).toBeNull()
    expect(s.order.lines).toHaveLength(3)
  })
  it('Kebabs tab layout matches Figma: 8 products, 8 empty, Open item + 3 folders', () => {
    const kinds = cellsFor(menu, 'kebabs', null).map((c) => c.kind)
    expect(kinds).toEqual([
      ...Array(8).fill('product'),
      ...Array(8).fill('empty'),
      'openItem',
      'folder',
      'folder',
      'folder',
    ])
  })
  it('every tab resolves to 20 cells with no missing items or folders', () => {
    for (const tab of menu.tabs) {
      const cells = cellsFor(menu, tab.id, null)
      expect(cells).toHaveLength(20)
      for (const c of cells) {
        if (c.kind === 'product') expect(c.item).toBeDefined()
        if (c.kind === 'folder') expect(c.folder).toBeDefined()
      }
    }
    for (const id of Object.keys(menu.folders)) {
      for (const c of cellsFor(menu, 'kebabs', id)) if (c.kind === 'product') expect(c.item).toBeDefined()
    }
  })
})
