import { useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { menu } from '../../data/menu'
import { cn } from '../../lib/cn'
import { motionTokens } from '../../lib/motion'
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
 * active: that tab sits flush under the corner, so the corner goes square
 * (once the tab has slid into place) and the tab's right side continues the
 * surface edge straight down.
 */

const lastTabId = menu.tabs[menu.tabs.length - 1].id

/**
 * Whether the surface's bottom-right corner should be square. It squares only
 * after the active tab has finished sliding under it (--motion-select), so the
 * user never sees a square corner with nothing beneath it. Leaving the last tab
 * rounds it again straight away.
 */
function useSquareCorner(lastTabActive: boolean) {
  const reduceMotion = useReducedMotion()
  const [squared, setSquared] = useState(lastTabActive)
  // Leaving the last tab: round immediately (state adjusted during render).
  if (!lastTabActive && squared) setSquared(false)
  useEffect(() => {
    if (!lastTabActive) return
    const timer = setTimeout(() => setSquared(true), reduceMotion ? 0 : motionTokens.select)
    return () => clearTimeout(timer)
  }, [lastTabActive, reduceMotion])
  return lastTabActive && squared
}

export function PosApp() {
  const { activeTabId } = usePosState()
  const lastTabActive = activeTabId === lastTabId
  const squareCorner = useSquareCorner(lastTabActive)
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
            squareCorner ? 'rounded-br-none' : 'rounded-br-lg',
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
