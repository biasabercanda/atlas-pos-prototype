import { Tabs as AntTabs } from 'antd'
import { cn } from '../../lib/cn'

/*
 * Figma: Components → Navigation & header → Tab (40:1361), BRIEF §5
 *   Inactive: 14 Semi Bold text-muted, transparent; 1×24 divider on its left
 *             edge, except the first tab and the tab right after the active one.
 *   Active:   14 Extra Bold text-primary, bg-surface (joins the surface above),
 *             radius 0 0 12 12, 12px concave curves at both top corners,
 *             5px bg-brand strip inset 16, flush with the bottom.
 *   Pressed:  bg-raised, radius 10.
 * Tabs fill the width equally; long labels truncate.
 *
 * AntD supplies the tablist semantics, roving focus and arrow-key navigation.
 * Its own visuals (ink bar, nav border, overflow menu, panes) are switched off
 * and each tab's visuals are drawn by <TabFace>.
 */

export interface TabItem {
  key: string
  label: string
}

export interface TabsProps {
  items: TabItem[]
  activeKey: string
  onChange: (key: string) => void
  className?: string
  /** Gallery only: draw this tab in its pressed state. */
  forcePressedKey?: string
}

/** 12×12 concave corner that blends the active tab into the surface above. */
function Curve({ side }: { side: 'left' | 'right' }) {
  const d =
    side === 'left'
      ? 'M0 0H12V12C12 8.82 10.74 5.77 8.49 3.51C6.23 1.26 3.18 0 0 0Z'
      : 'M0 0H12C8.82 0 5.77 1.26 3.51 3.51C1.26 5.77 0 8.82 0 12V0Z'
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className={cn('absolute top-0 size-3 text-surface', side === 'left' ? '-left-3' : '-right-3')}
    >
      <path d={d} fill="currentColor" />
    </svg>
  )
}

function TabFace({
  label,
  active,
  divider,
  pressed,
}: {
  label: string
  active: boolean
  divider: boolean
  pressed: boolean
}) {
  return (
    <span
      className={cn(
        'relative flex h-16 w-full min-w-0 items-center px-4',
        active ? 'rounded-b-lg bg-surface' : pressed ? 'rounded-md bg-raised' : 'rounded-md active:bg-raised',
      )}
    >
      <span
        className={cn(
          'min-w-0 flex-1 truncate text-center text-sm leading-5',
          active ? 'font-extrabold text-primary' : 'font-semibold text-muted',
        )}
      >
        {label}
      </span>
      {active && (
        <>
          <span aria-hidden className="absolute inset-x-4 bottom-0 h-[5px] rounded-t-[3px] bg-brand" />
          <Curve side="left" />
          <Curve side="right" />
        </>
      )}
      {divider && <span aria-hidden className="absolute top-1/2 -left-[3px] h-6 w-px -translate-y-1/2 bg-divider" />}
    </span>
  )
}

export function Tabs({ items, activeKey, onChange, className, forcePressedKey }: TabsProps) {
  const activeIndex = items.findIndex((i) => i.key === activeKey)
  return (
    <AntTabs
      activeKey={activeKey}
      onChange={onChange}
      animated={false}
      items={items.map((item, i) => ({
        key: item.key,
        label: (
          <TabFace
            label={item.label}
            active={i === activeIndex}
            divider={i !== activeIndex && i !== 0 && i !== activeIndex + 1}
            pressed={item.key === forcePressedKey}
          />
        ),
      }))}
      className={cn(
        'w-full',
        '[&_.ant-tabs-nav]:m-0 [&_.ant-tabs-nav]:before:border-0',
        '[&_.ant-tabs-nav-wrap]:overflow-visible',
        '[&_.ant-tabs-nav-list]:w-full',
        '[&_.ant-tabs-tab]:min-w-0 [&_.ant-tabs-tab]:flex-1 [&_.ant-tabs-tab]:p-0',
        '[&_.ant-tabs-tab-btn]:w-full [&_.ant-tabs-tab-btn]:min-w-0',
        '[&_.ant-tabs-ink-bar]:hidden [&_.ant-tabs-nav-operations]:hidden [&_.ant-tabs-content-holder]:hidden',
        className,
      )}
    />
  )
}
