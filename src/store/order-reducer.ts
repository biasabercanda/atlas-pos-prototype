import type { FolderId, ItemId, Menu, Order, TabId } from '../data/types'

/*
 * The single store for the POS screen. Pure reducer, no React, so it can be
 * tested directly and extended for training mode (e.g. a `training` slice).
 */

export interface PosState {
  activeTabId: TabId
  openFolderId: FolderId | null
  order: Order
}

export type PosAction =
  | { type: 'addItem'; itemId: ItemId }
  | { type: 'setTab'; tabId: TabId }
  | { type: 'openFolder'; folderId: FolderId }
  | { type: 'closeFolder' }

export interface InitOptions {
  /** Start with no order lines (`?order=empty`), to show the disabled actions. */
  emptyOrder?: boolean
}

export function initialPosState(menu: Menu, opts: InitOptions = {}): PosState {
  return {
    activeTabId: menu.tabs[0].id,
    openFolderId: null,
    order: {
      ...menu.initialOrder,
      lines: opts.emptyOrder ? [] : menu.initialOrder.lines.map((l) => ({ ...l })),
    },
  }
}

export function createPosReducer(menu: Menu) {
  return function posReducer(state: PosState, action: PosAction): PosState {
    switch (action.type) {
      case 'addItem': {
        const item = menu.items[action.itemId]
        if (!item || item.soldOut) return state // sold out: nothing happens
        const lines = state.order.lines
        const index = lines.findIndex((l) => l.itemId === action.itemId)
        const nextLines =
          index === -1
            ? [...lines, { itemId: action.itemId, qty: 1 }] // new line goes at the bottom
            : lines.map((l, i) => (i === index ? { ...l, qty: l.qty + 1 } : l)) // stays in place
        return { ...state, order: { ...state.order, lines: nextLines } }
      }
      case 'setTab':
        // Tapping any tab (including the active one) returns to that tab's root.
        if (state.activeTabId === action.tabId && state.openFolderId === null) return state
        return { ...state, activeTabId: action.tabId, openFolderId: null }
      case 'openFolder':
        if (!menu.folders[action.folderId]) return state
        return { ...state, openFolderId: action.folderId }
      case 'closeFolder':
        if (state.openFolderId === null) return state
        return { ...state, openFolderId: null }
    }
  }
}
