import { StyleProvider } from '@ant-design/cssinjs'
import { ConfigProvider } from 'antd'
import { Button } from './components/ui/Button'
import { atlasTheme } from './theme/antd-theme'

/*
 * Phase 0: setup check. AntD (themed, in the `antd` layer) next to Tailwind
 * utilities using the semantic token names. Replaced by the real app in phase 3.
 */
export default function App() {
  return (
    <StyleProvider layer>
      <ConfigProvider theme={atlasTheme} wave={{ disabled: true }}>
        <main className="flex h-full items-center justify-center gap-4 bg-app p-8">
          <Button type="primary" size="large" data-check="antd-primary">
            Charge $51.20
          </Button>
          <Button size="large" data-check="antd-default">
            Hold
          </Button>
          <div
            data-check="tw-surface"
            className="flex h-14 items-center rounded-lg bg-surface px-4 text-sm font-bold text-muted shadow-tile"
          >
            Tailwind bg-surface
          </div>
          <Button type="primary" size="large" className="rounded-full" data-check="tw-override">
            Utility override
          </Button>
        </main>
      </ConfigProvider>
    </StyleProvider>
  )
}
