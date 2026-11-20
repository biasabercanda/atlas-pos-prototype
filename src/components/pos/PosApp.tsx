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
 */

export function PosApp() {
  return (
    <div
      data-pos-app
      style={{ containerType: 'size', containerName: 'app' }}
      className="flex size-full overflow-hidden bg-app text-primary"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex min-h-0 flex-1 flex-col gap-4 bg-surface p-4">
          <Header />
          <MenuGrid />
        </main>
        <CategoryTabs />
      </div>
      <OrderPanel />
    </div>
  )
}
