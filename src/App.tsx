import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd'
import { IconoirProvider } from 'iconoir-react'
import { MotionConfig } from 'motion/react'
import { PosApp } from './components/pos/PosApp'
import { Gallery } from './dev/Gallery'
import { OrderStoreProvider } from './store/OrderStoreProvider'
import { atlasTheme } from './theme/antd-theme'

const view = new URLSearchParams(window.location.search).get('view')

/*
 * ?view=gallery shows the ui/ component gallery; otherwise the POS screen.
 * Phase 3: the POS screen is shown at a fixed 1194 × 834 (iPad Pro 11").
 * Phase 7 replaces this box with the presentation shell (device switcher).
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
                <div className="flex min-h-full items-center justify-center p-8">
                  <div className="h-[834px] w-[1194px] shrink-0">
                    <PosApp />
                  </div>
                </div>
              )}
            </OrderStoreProvider>
          </IconoirProvider>
        </MotionConfig>
      </ConfigProvider>
    </StyleProvider>
  )
}
