import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd'
import { IconoirProvider } from 'iconoir-react'
import { MotionConfig } from 'motion/react'
import { PosApp } from './components/pos/PosApp'
import { PresentationShell } from './components/shell/PresentationShell'
import { Gallery } from './dev/Gallery'
import { OrderStoreProvider } from './store/OrderStoreProvider'
import { atlasTheme } from './theme/antd-theme'

const view = new URLSearchParams(window.location.search).get('view')

/*
 * ?view=gallery shows the ui/ component gallery; otherwise the POS screen
 * inside the presentation shell (device mode on a tablet, framed with a device
 * switcher on desktop). The order store wraps the shell, so switching devices
 * keeps the order, tab and open folder.
 */
export default function App() {
  return (
    <StyleProvider layer>
      <ConfigProvider theme={atlasTheme} wave={{ disabled: true }}>
        <MotionConfig reducedMotion="user">
          {/* Iconoir defaults: 20px, stroke 2 (BRIEF §8) */}
          <IconoirProvider iconProps={{ width: 20, height: 20, strokeWidth: 2 }}>
            <OrderStoreProvider>
              {view === 'gallery' ? (
                <Gallery />
              ) : (
                <PresentationShell>
                  <PosApp />
                </PresentationShell>
              )}
            </OrderStoreProvider>
          </IconoirProvider>
        </MotionConfig>
      </ConfigProvider>
    </StyleProvider>
  )
}
