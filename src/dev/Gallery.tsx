import { ClockRotateRight, MoreVert, Search } from 'iconoir-react'
import { Pause } from 'iconoir-react/solid'
import { useState, type ReactNode } from 'react'
import { Breadcrumb } from '../components/ui/Breadcrumb'
import { Button } from '../components/ui/Button'
import { IconButton } from '../components/ui/IconButton'
import { FireFlameFilled, MapFilled, PrinterFilled, ViewGridFilled } from '../components/ui/icons'
import { Segmented } from '../components/ui/Segmented'
import { Tabs } from '../components/ui/Tabs'
import { Tag } from '../components/ui/Tag'

/*
 * Component gallery (?view=gallery): every ui/ wrapper in every state, laid
 * out like the Figma Components page, for side-by-side review.
 */

function Section({ title, figma, children }: { title: string; figma: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-sm leading-5 font-semibold text-muted">
        {title} <span className="font-normal text-faint">· Figma {figma}</span>
      </h2>
      <div className="flex flex-wrap items-center gap-6">{children}</div>
    </section>
  )
}

function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2">
      {children}
      <span className="text-xs leading-4 text-faint">{label}</span>
    </div>
  )
}

const tabItems = [
  { key: 'kebabs', label: 'Kebabs' },
  { key: 'bowls-sides', label: 'Bowls & Sides' },
  { key: 'gyros-shawarma-rolls', label: 'Gyros, Shawarma and Kathi Rolls' },
  { key: 'drinks', label: 'Drinks' },
  { key: 'discounts', label: 'Discounts' },
]

const deviceOptions = [
  { value: 'air11', content: 'iPad Air 11"', title: 'iPad Air 11"' },
  { value: 'pro11', content: 'iPad Pro 11"', title: 'iPad Pro 11"' },
  { value: 'android10', content: 'Android POS 10"', title: 'Android POS 10"' },
  { value: 'pro13', content: 'iPad Pro 13"', title: 'iPad Pro 13"' },
]

export function Gallery() {
  const [tab, setTab] = useState('kebabs')
  const [view, setView] = useState<'map' | 'grid'>('grid')
  const [device, setDevice] = useState('pro11')
  const [taps, setTaps] = useState(0)

  const actions = [
    { label: 'Hold', icon: <Pause width={20} height={20} className="text-hold" /> },
    { label: 'Fire', icon: <FireFlameFilled className="text-fire" /> },
    { label: 'Print', icon: <PrinterFilled className="text-print" /> },
  ]

  return (
    <main className="min-h-full bg-app p-10">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10">
        <header>
          <h1 className="text-2xl leading-8 font-extrabold text-primary">Atlas POS · ui/ components</h1>
          <p className="text-sm leading-5 text-muted">
            AntD wrappers in every state. Interactive ones respond to taps; "Pressed" columns are forced.
          </p>
        </header>

        <Section title="Button · Primary" figma="17:250">
          <Labeled label="Default (tap me)">
            <Button className="w-[180px]" onClick={() => setTaps((n) => n + 1)} data-check="btn-primary">
              Charge $42.70
            </Button>
          </Labeled>
          <Labeled label="Pressed">
            <Button className="w-[180px]" forceState="pressed">
              Charge $42.70
            </Button>
          </Labeled>
          <Labeled label="Disabled">
            <Button className="w-[180px]" disabled data-check="btn-primary-disabled">
              Charge $0.00
            </Button>
          </Labeled>
          <span className="text-xs text-faint" data-check="taps">
            taps: {taps}
          </span>
        </Section>

        <Section title="Button · Secondary" figma="17:250">
          <Labeled label="Default">
            <Button variant="secondary" className="w-[246.67px]" icon={<PrinterFilled className="text-print" />} data-check="btn-secondary">
              Print
            </Button>
          </Labeled>
          <Labeled label="Pressed">
            <Button variant="secondary" className="w-[246.67px]" icon={<PrinterFilled className="text-print" />} forceState="pressed">
              Print
            </Button>
          </Labeled>
          <Labeled label="Disabled">
            <Button variant="secondary" className="w-[246.67px]" icon={<PrinterFilled className="text-print" />} disabled>
              Print
            </Button>
          </Labeled>
        </Section>

        <Section title="Order actions (as in the order panel, 312 wide)" figma="257:21144">
          <div className="flex w-[312px] flex-col gap-2 bg-app">
            <div className="grid grid-cols-3 gap-2">
              {actions.map((a) => (
                <Button key={a.label} variant="secondary" icon={a.icon}>
                  {a.label}
                </Button>
              ))}
            </div>
            <Button className="w-full">Charge $51.20</Button>
          </div>
          <div className="flex w-[312px] flex-col gap-2 bg-app">
            <div className="grid grid-cols-3 gap-2">
              {actions.map((a) => (
                <Button key={a.label} variant="secondary" icon={a.icon} disabled>
                  {a.label}
                </Button>
              ))}
            </div>
            <Button className="w-full" disabled>
              Charge $0.00
            </Button>
          </div>
        </Section>

        <Section title="Tabs (interactive; on a surface so the active tab joins it)" figma="40:1361">
          <div className="w-[834px]" data-check="tabs">
            <div className="h-6 bg-surface" />
            <div className="bg-app pb-4 pl-4">
              <Tabs items={tabItems} activeKey={tab} onChange={setTab} />
            </div>
          </div>
          <div className="w-[834px]">
            <div className="h-6 bg-surface" />
            <div className="bg-app pb-4 pl-4">
              <Tabs items={tabItems} activeKey="kebabs" onChange={() => {}} forcePressedKey="drinks" />
            </div>
            <span className="text-xs text-faint">Pressed: Drinks</span>
          </div>
        </Section>

        <Section title="View toggle (Segmented, icon)" figma="17:240">
          <Labeled label="Interactive">
            <Segmented
              value={view}
              onChange={setView}
              options={[
                { value: 'map', content: <MapFilled />, title: 'Map view' },
                { value: 'grid', content: <ViewGridFilled />, title: 'Grid view' },
              ]}
            />
          </Labeled>
        </Section>

        <Section title="Device switcher (Segmented, text, raised track)" figma="BRIEF §3">
          <Segmented size="text" track="raised" value={device} onChange={setDevice} options={deviceOptions} />
        </Section>

        <Section title="Icon button" figma="40:1351">
          <Labeled label="Default">
            <IconButton label="Search" icon={<Search />} />
          </Labeled>
          <Labeled label="Pressed">
            <IconButton label="Search" icon={<Search />} forceState="pressed" />
          </Labeled>
          <Labeled label="Group (0 gap)">
            <div className="flex">
              <IconButton label="History" icon={<ClockRotateRight />} />
              <IconButton label="Search" icon={<Search />} />
              <IconButton label="More" icon={<MoreVert />} />
            </div>
          </Labeled>
        </Section>

        <Section title="Breadcrumb" figma="264:208">
          <Labeled label="Tab root">
            <Breadcrumb items={[{ label: 'Kebabs' }]} />
          </Labeled>
          <Labeled label="In a folder (parent tappable)">
            <Breadcrumb items={[{ label: 'Kebabs', onClick: () => {} }, { label: 'Gyros' }]} />
          </Labeled>
          <Labeled label="Parent pressed">
            <Breadcrumb items={[{ label: 'Kebabs', onClick: () => {} }, { label: 'Gyros' }]} forceState="pressed" />
          </Labeled>
        </Section>

        <Section title="Table pill (Tag)" figma="17:255">
          <Tag>T1</Tag>
        </Section>
      </div>
    </main>
  )
}
