import { cn } from '../../../lib/cn'

/*
 * Figma: Components → Navigation & header → Cashier pill (277:220) + Status dot (277:224)
 * 48 tall, radius full, bg-raised, padding-right 16. A 48×48 cell holds a 16px
 * dot with a 4px ring; the −4 gap between dot cell and label is intentional.
 * Label 14 Semi Bold text-muted. Pressed = bg-surface. No action (out of scope).
 * Note: the brief lists shadow-soft, but the Figma component has no shadow.
 */

export function CashierPill({ name, online = true }: { name: string; online?: boolean }) {
  return (
    <button
      type="button"
      aria-label={`${name}, ${online ? 'online' : 'offline'}`}
      className="flex h-12 shrink-0 cursor-pointer items-center rounded-full bg-raised pr-4 pressed:bg-surface"
    >
      <span aria-hidden className="-mr-1 flex size-12 items-center justify-center">
        <span className={cn('size-4 rounded-full ring-4 ring-online-ring', online ? 'bg-online' : 'bg-disabled')} />
      </span>
      <span className="text-sm leading-5 font-semibold whitespace-nowrap text-muted">{name}</span>
    </button>
  )
}
