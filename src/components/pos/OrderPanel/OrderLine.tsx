import { motion } from 'motion/react'
import { cn, pressPill } from '../../../lib/cn'
import { tapFeedback } from '../../../lib/motion'
import { formatMoney } from '../../../lib/money'

/*
 * Figma: Components → Order panel → Order line (40:1356)
 * 48 tall, padding 0 4, gap 12.
 *   qty   "2×"  14/24 Regular text-muted, 26 wide
 *   name        14/24 Semi Bold text-primary, fills and truncates
 *   price       14/24 Regular text-secondary, right-aligned
 * Pressed = bg-raised, radius 10 (flat press pill). Line editing is out of scope.
 */

export interface OrderLineProps {
  qty: number
  name: string
  totalCents: number
}

export function OrderLine({ qty, name, totalCents }: OrderLineProps) {
  // A new line slides up into place at the bottom (--motion-feedback);
  // lines already in the order on load don't animate (AnimatePresence initial={false}).
  return (
    <motion.li initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={tapFeedback}>
      <button
        type="button"
        className="group/press relative flex h-12 w-full cursor-pointer items-center gap-3 px-1 text-left text-sm leading-6"
      >
        <span aria-hidden className={cn('absolute inset-0 rounded-md bg-raised', pressPill)} />
        <span className="relative w-[26px] shrink-0 text-muted">{qty}×</span>
        <span className="relative min-w-0 flex-1 truncate font-semibold text-primary">{name}</span>
        <span className="relative shrink-0 text-right whitespace-nowrap text-secondary">{formatMoney(totalCents)}</span>
      </button>
    </motion.li>
  )
}
