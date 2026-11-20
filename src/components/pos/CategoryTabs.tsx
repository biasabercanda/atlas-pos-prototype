import { menu } from '../../data/menu'
import { usePosDispatch, usePosState } from '../../store/context'
import { Tabs } from '../ui/Tabs'

/*
 * BRIEF §2 Category tabs bar · Figma 257:21209
 * 80 tall: 64 tabs + 16 bottom padding, 16 left padding, tabs fill the width.
 * Tapping any tab (including the active one) returns to that tab's root.
 */

const items = menu.tabs.map((t) => ({ key: t.id, label: t.name }))

export function CategoryTabs() {
  const { activeTabId } = usePosState()
  const dispatch = usePosDispatch()
  return (
    <nav aria-label="Menu categories" className="h-20 shrink-0 pb-4 pl-4">
      <Tabs items={items} activeKey={activeTabId} onChange={(tabId) => dispatch({ type: 'setTab', tabId })} />
    </nav>
  )
}
