import { Pause } from 'iconoir-react/solid'
import { formatMoney } from '../../../lib/money'
import { Button } from '../../ui/Button'
import { FireFlameFilled, PrinterFilled } from '../../ui/icons'

/*
 * BRIEF §2 Actions · Figma 257:21234
 * Hold / Fire / Print: 3 equal secondary buttons, 56 tall, gap 8.
 * Charge: full width primary, label reflects the live total.
 * Gap between the two rows is 8 (Figma frame; the brief's 10 was off-grid).
 * Empty order: all four are Disabled and Charge reads "Charge $0.00".
 * Hold/Fire/Print/Charge actions themselves are out of scope (press state only).
 */

export function OrderActions({ totalCents, empty }: { totalCents: number; empty: boolean }) {
  return (
    <div className="flex shrink-0 flex-col gap-2">
      <div className="grid grid-cols-3 gap-2">
        <Button variant="secondary" disabled={empty} icon={<Pause width={20} height={20} className="text-hold" />}>
          Hold
        </Button>
        <Button variant="secondary" disabled={empty} icon={<FireFlameFilled className="text-fire" />}>
          Fire
        </Button>
        <Button variant="secondary" disabled={empty} icon={<PrinterFilled className="text-print" />}>
          Print
        </Button>
      </div>
      <Button className="w-full" disabled={empty} data-check="charge">
        Charge {formatMoney(empty ? 0 : totalCents)}
      </Button>
    </div>
  )
}
