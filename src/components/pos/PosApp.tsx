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
            lastTabActive ? 'rounded-br-none' : 'rounded-br-lg',
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
