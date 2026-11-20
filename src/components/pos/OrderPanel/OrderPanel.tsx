import { menu } from '../../../data/menu'
import { lineViews, totalsFor } from '../../../data/selectors'
import { usePosState } from '../../../store/context'
import { OrderActions } from './OrderActions'
import { OrderHeader } from './OrderHeader'
import { OrderLine } from './OrderLine'
import { Totals } from './Totals'

/*
 * BRIEF §2 Order panel · Figma 257:21215
 * bg-app, padding 16, gap 16. Header 56 · lines (fill, scroll) · totals · actions.
 * Fixed 344 wide; 400 when the app is at least 1366 wide (container query on
 * the app root, never the browser viewport).
 */

export function OrderPanel() {
  const { order } = usePosState()
  const lines = lineViews(menu, order.lines)
  const { subtotalCents, totalCents } = totalsFor(menu, order.lines)

  return (
    <aside
      aria-label="Current order"
      data-order-panel
      className="flex w-[344px] shrink-0 flex-col gap-4 bg-app p-4 @min-[1366px]/app:w-[400px]"
    >
      <OrderHeader orderId={order.id} table={order.table} />
      <ul data-order-lines className="min-h-0 flex-1 overflow-y-auto">
        {lines.map((l) => (
          <OrderLine key={l.item.id} qty={l.qty} name={l.item.name} totalCents={l.totalCents} />
        ))}
      </ul>
      <Totals subtotalCents={subtotalCents} totalCents={totalCents} />
      <OrderActions totalCents={totalCents} empty={lines.length === 0} />
    </aside>
  )
}
