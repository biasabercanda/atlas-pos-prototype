import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd'
import { Gallery } from './dev/Gallery'
import { OrderStoreProvider } from './store/OrderStoreProvider'
import { atlasTheme } from './theme/antd-theme'

/*
 * ?view=gallery shows the ui/ component gallery.
 * Until phase 3 builds the POS screen, the gallery is also the default view.
 */
export default function App() {
  return (
    <StyleProvider layer>
      <ConfigProvider theme={atlasTheme} wave={{ disabled: true }}>
        <OrderStoreProvider>
          <Gallery />
        </OrderStoreProvider>
      </ConfigProvider>
    </StyleProvider>
  )
}
