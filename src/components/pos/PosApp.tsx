import { menu } from '../../data/menu'
import { cn } from '../../lib/cn'
import { usePosState } from '../../store/context'
import { CategoryTabs } from './CategoryTabs'
import { Header } from './Header/Header'
import { MenuGrid } from './MenuGrid'
import { OrderPanel } from './OrderPanel/OrderPanel'

/*
 * BRIEF §2 Layout · Figma 257:21144 (1194 × 834)
 *
 *   Left column (fills)                         │ Order panel (344 / 400)
 *   ├ Surface: bg-surface, padding 16, gap 16   │
 *   │  ├ Header 56                              │
 *   │  └ Menu grid (absorbs all extra space)    │
 *   └ Category tabs 80                          │
 *
 * The root is a size container named "app". Every responsive rule queries the
 * app's own size (never the browser viewport), so the presentation shell can
 * render any tablet size inside a desktop browser. It fills its parent.
 *
 * The surface's bottom-right corner is rounded, except while the last tab is
 * active: that tab sits flush under the corner, so the corner goes square and
 * the tab's right side continues the surface edge straight down.
 * The radius animates instead of flipping:
 *   arriving: 12 → 0 over the tab's own slide (--motion-select) with an ease-in
 *             (--motion-ease-arrive), so it stays rounded while the tab travels
 *             and squares off as the tab arrives underneath;
 *   leaving:  0 → 12 quickly (--motion-feedback, ease-out), as the tab pulls away.
 */

const lastTabId = menu.tabs[menu.tabs.length - 1].id

export function PosApp() {
  const { activeTabId } = usePosState()
  const lastTabActive = activeTabId === lastTabId
  return (
    <div
      data-pos-app
      style={{ containerType: 'size', containerName: 'app' }}
      className="flex size-full overflow-hidden bg-app text-primary"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <main
          className={cn(
            'flex min-h-0 flex-1 flex-col gap-4 bg-surface p-4',
            'transition-[border-bottom-right-radius] motion-reduce:transition-none',
            lastTabActive
              ? 'rounded-br-none duration-(--motion-select) ease-(--motion-ease-arrive)'
              : 'rounded-br-lg duration-(--motion-feedback) ease-(--motion-ease)',
          )}
        >
          <Header />
          <MenuGrid />
        </main>
        <CategoryTabs />
      </div>
      <OrderPanel />
    </div>
  )
}
