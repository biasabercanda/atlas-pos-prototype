import { NavArrowLeft, PlusCircle } from 'iconoir-react'
import { TileShell } from './TileShell'

/*
 * Figma: Tile / Open item (40:1348) and Tile / Back (277:207). Same shell:
 * bg-tile-base, no tint, shadow-tile, radius 12. A 32px Iconoir icon
 * (stroke 2, text-primary) above a Tile/Action label (14/20 Bold), gap 6.
 * Back is the first cell inside a folder and returns to the tab view.
 * Open item's flow is out of scope (press state only).
 */

export function ActionTile({
  kind,
  onClick,
  highlight,
}: {
  kind: 'openItem' | 'back'
  onClick?: () => void
  highlight?: boolean
}) {
  const Icon = kind === 'back' ? NavArrowLeft : PlusCircle
  const label = kind === 'back' ? 'Back' : 'Open item'
  return (
    <TileShell label={label} onClick={onClick} highlight={highlight}>
      <span className="flex flex-col items-center gap-1.5">
        <Icon width={32} height={32} className="text-primary" />
        <span className="text-sm leading-5 font-bold text-primary">{label}</span>
      </span>
    </TileShell>
  )
}
