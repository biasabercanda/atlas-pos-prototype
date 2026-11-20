import { ClockRotateRight, LogOut, MoreVert, Search } from 'iconoir-react'
import { menu } from '../../../data/menu'
import { breadcrumbFor } from '../../../data/selectors'
import { usePosDispatch, usePosState } from '../../../store/context'
import { Breadcrumb } from '../../ui/Breadcrumb'
import { IconButton } from '../../ui/IconButton'
import { MapFilled, ViewGridFilled } from '../../ui/icons'
import { Segmented } from '../../ui/Segmented'
import { CashierPill } from './CashierPill'

/*
 * BRIEF §2 Header · Figma 257:21147
 * 56 tall, items centred, gap 24: view toggle · breadcrumb · spacer · actions.
 * Actions (gap 8): log-out · cashier pill · [history, search, more] with 0 gap.
 * The view toggle stays on grid (map view is out of scope).
 */

export function Header() {
  const { activeTabId, openFolderId } = usePosState()
  const dispatch = usePosDispatch()
  const crumbs = breadcrumbFor(menu, activeTabId, openFolderId)

  return (
    <header className="flex h-14 shrink-0 items-center gap-6">
      <Segmented
        value="grid"
        onChange={() => {}}
        options={[
          { value: 'map', content: <MapFilled />, title: 'Map view' },
          { value: 'grid', content: <ViewGridFilled />, title: 'Grid view' },
        ]}
        className="shrink-0"
      />
      <Breadcrumb
        items={crumbs.map((c) => ({
          label: c.label,
          onClick: c.current ? undefined : () => dispatch({ type: 'closeFolder' }),
        }))}
      />
      {/* Spacer grows; when the breadcrumb is long it collapses and the crumbs truncate. */}
      <div className="min-w-0 flex-1" />
      <div className="flex shrink-0 items-center gap-2">
        <IconButton label="Log out" icon={<LogOut />} />
        <CashierPill name="Cashier 2" />
        <div className="flex">
          <IconButton label="Order history" icon={<ClockRotateRight />} />
          <IconButton label="Search" icon={<Search />} />
          <IconButton label="More" icon={<MoreVert />} />
        </div>
      </div>
    </header>
  )
}
