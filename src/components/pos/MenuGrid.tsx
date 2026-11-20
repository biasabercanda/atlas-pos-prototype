import { menu } from '../../data/menu'
import { cellsFor } from '../../data/selectors'
import type { GridCell } from '../../data/types'
import { usePosDispatch, usePosState } from '../../store/context'

/*
 * BRIEF §2 Menu grid · Figma 257:21164
 * Always 5 columns × 4 equal rows, gap 16, filling the surface. At 1194 × 834
 * cells come out 150.8 × 150.5; tiles are not forced square.
 *
 * Phase 3: placeholder tiles (layout only). Phase 4 replaces PlaceholderTile
 * with ProductTile / FolderTile / ActionTile / EmptySlot.
 */

function PlaceholderTile({ cell }: { cell: GridCell }) {
  const dispatch = usePosDispatch()
  if (cell.kind === 'empty') return <div aria-hidden />

  const label =
    cell.kind === 'product'
      ? cell.item.name
      : cell.kind === 'folder'
        ? cell.folder.name
        : cell.kind === 'openItem'
          ? 'Open item'
          : 'Back'
  const onClick =
    cell.kind === 'product'
      ? () => dispatch({ type: 'addItem', itemId: cell.item.id })
      : cell.kind === 'folder'
        ? () => dispatch({ type: 'openFolder', folderId: cell.folder.id })
        : cell.kind === 'back'
          ? () => dispatch({ type: 'closeFolder' })
          : undefined

  return (
    <button
      type="button"
      onClick={onClick}
      data-cell={cell.kind}
      className="flex min-h-0 min-w-0 items-center justify-center rounded-lg bg-tile p-3 text-center text-sm leading-5 font-bold text-primary shadow-tile"
    >
      {label}
    </button>
  )
}

export function MenuGrid() {
  const { activeTabId, openFolderId } = usePosState()
  const cells = cellsFor(menu, activeTabId, openFolderId)
  return (
    <div data-grid className="grid min-h-0 flex-1 grid-cols-5 grid-rows-4 gap-4">
      {cells.map((cell) => (
        <PlaceholderTile key={cell.key} cell={cell} />
      ))}
    </div>
  )
}
