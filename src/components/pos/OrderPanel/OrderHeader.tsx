import { MoreVert, NavArrowRight } from 'iconoir-react'
import { IconButton } from '../../ui/IconButton'
import { Tag } from '../../ui/Tag'

/*
 * BRIEF §2 Order header · Figma 257:21216
 * 56 tall, bg-raised, radius 12, shadow-soft, padding-left 16, gap 12.
 * "Order #1315" 16 Bold · table pill · spacer · ⋮ and › (48×48, 0 gap).
 */

export function OrderHeader({ orderId, table }: { orderId: number; table: string }) {
  return (
    <div className="flex h-14 shrink-0 items-center gap-3 rounded-lg bg-raised pl-4 shadow-soft">
      <h2 className="text-base leading-6 font-bold whitespace-nowrap text-primary">Order #{orderId}</h2>
      <Tag>{table}</Tag>
      <div className="flex-1" />
      <div className="flex">
        <IconButton label="Order options" icon={<MoreVert />} />
        <IconButton label="Order details" icon={<NavArrowRight />} />
      </div>
    </div>
  )
}
