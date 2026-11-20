import { menu } from '../../data/menu'
import { cellsFor, qtyByItem } from '../../data/selectors'
import type { GridCell } from '../../data/types'
import { usePosDispatch, usePosState } from '../../store/context'
import { ActionTile } from '../tiles/ActionTile'
import { EmptySlot } from '../tiles/EmptySlot'
import { FolderTile } from '../tiles/FolderTile'
import { ProductTile } from '../tiles/ProductTile'

/*
 * BRIEF §2 Menu grid · Figma 257:21164
 * Always 5 columns × 4 equal rows, gap 16, filling the surface. At 1194 × 834
 * cells come out 150.8 × 150.5; tiles are not forced square.
 */

function Cell({ cell, qty }: { cell: GridCell; qty: Map<string, number> }) {
  const dispatch = usePosDispatch()
  switch (cell.kind) {
    case 'product':
      return (
        <ProductTile
          item={cell.item}
          qty={qty.get(cell.item.id) ?? 0}
          onAdd={() => dispatch({ type: 'addItem', itemId: cell.item.id })}
        />
      )
    case 'folder':
      return <FolderTile folder={cell.folder} onOpen={() => dispatch({ type: 'openFolder', folderId: cell.folder.id })} />
    case 'openItem':
      return <ActionTile kind="openItem" />
    case 'back':
      return <ActionTile kind="back" onClick={() => dispatch({ type: 'closeFolder' })} />
    case 'empty':
      return <EmptySlot />
  }
}

export function MenuGrid() {
  const { activeTabId, openFolderId, order } = usePosState()
  const cells = cellsFor(menu, activeTabId, openFolderId)
  const qty = qtyByItem(order.lines)
  return (
    <div data-grid className="grid min-h-0 flex-1 grid-cols-5 grid-rows-4 gap-4">
      {cells.map((cell) => (
        <Cell key={cell.key} cell={cell} qty={qty} />
      ))}
    </div>
  )
}
