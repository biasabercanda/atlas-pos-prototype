import { formatMoney } from '../../../lib/money'

/*
 * BRIEF §2 Totals · Figma 257:21227 — gap 8.
 *   Subtotal: 14/20 Regular text-muted
 *   Total:    label 16/24 Semi Bold, value 16/24 Extra Bold, text-primary
 */

export function Totals({ subtotalCents, totalCents }: { subtotalCents: number; totalCents: number }) {
  return (
    <dl className="flex shrink-0 flex-col gap-2">
      <div className="flex items-center justify-between text-sm leading-5 text-muted">
        <dt>Subtotal</dt>
        <dd data-check="subtotal">{formatMoney(subtotalCents)}</dd>
      </div>
      <div className="flex items-center justify-between text-base leading-6 text-primary">
        <dt className="font-semibold">Total</dt>
        <dd data-check="total" className="font-extrabold">
          {formatMoney(totalCents)}
        </dd>
      </div>
    </dl>
  )
}
