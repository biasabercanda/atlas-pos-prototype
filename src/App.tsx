import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd'
import { Button } from './components/ui/Button'
import { menu } from './data/menu'
import { totalsFor } from './data/selectors'
import { formatMoney } from './lib/money'
import { OrderStoreProvider } from './store/OrderStoreProvider'
import { usePosDispatch, usePosState } from './store/context'
import { atlasTheme } from './theme/antd-theme'

/*
 * Phase 1: setup check wired to the store. Tapping "Add DIY Döner" updates
 * the Charge label live. Replaced by the real app in phase 3.
 */
function SetupCheck() {
  const { order } = usePosState()
  const dispatch = usePosDispatch()
  const { totalCents } = totalsFor(menu, order.lines)
  return (
    <main className="flex h-full items-center justify-center gap-4 bg-app p-8">
      <Button type="primary" size="large" data-check="charge" disabled={order.lines.length === 0}>
        Charge {formatMoney(totalCents)}
      </Button>
      <Button size="large" data-check="add" onClick={() => dispatch({ type: 'addItem', itemId: 'diy-doner' })}>
        Add DIY Döner
      </Button>
      <div
        data-check="lines"
        className="flex h-14 items-center rounded-lg bg-surface px-4 text-sm font-bold text-muted shadow-tile"
      >
        {order.lines.map((l) => `${l.qty}× ${menu.items[l.itemId].name}`).join(' · ') || 'Empty order'}
      </div>
    </main>
  )
}

export default function App() {
  return (
    <StyleProvider layer>
      <ConfigProvider theme={atlasTheme} wave={{ disabled: true }}>
        <OrderStoreProvider>
          <SetupCheck />
        </OrderStoreProvider>
      </ConfigProvider>
    </StyleProvider>
  )
}
