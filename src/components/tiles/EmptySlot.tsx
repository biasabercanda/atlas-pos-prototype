import { cn } from '../../lib/cn'

/*
 * Figma: Tile / Empty slot (3:26). Renders as empty space: no fill and no
 * visible outline (the dashed 6/4 border-empty-slot outline exists in Figma
 * but is switched off). Not tappable. Kept as a real cell so training mode
 * can highlight a slot.
 */

export function EmptySlot({ highlight }: { highlight?: boolean }) {
  return (
    <div
      aria-hidden
      data-cell="empty"
      className={cn('size-full rounded-lg', highlight && 'outline-2 outline-offset-2 outline-brand')}
    />
  )
}
