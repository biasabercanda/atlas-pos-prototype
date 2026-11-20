import { Tabs as AntTabs } from 'antd'
import { animate, motion, useMotionValue } from 'motion/react'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '../../lib/cn'
import { selectionSlide } from '../../lib/motion'

/*
 * Figma: Components → Navigation & header → Tab (40:1361), BRIEF §5
 *   Inactive: 14 Semi Bold text-muted, transparent; 1×24 divider on its left
 *             edge, except the first tab and the tab right after the active one.
 *   Active:   14 Extra Bold text-primary, bg-surface (joins the surface above),
 *             radius 0 0 12 12, 12px concave curves at both top corners,
 *             5px bg-brand strip inset 16, flush with the bottom.
 *   Pressed:  bg-surface (same as the active tab; Figma uses bg-raised), radius 10,
 *             56 tall (Figma) centred in the 64 tab;
 *             the dividers on both sides hide while pressed. The pill grows
 *             in on press (pressPill) and, as the tab becomes active, expands
 *             into the active shape instead of fading out.
 * Tabs fill the width equally; long labels truncate.
 *
 * The active look (surface + curves + strip) is ONE element for the whole bar
 * that slides to the newly selected tab (--motion-select). Its x and width
 * come from layout offsets (offsetLeft/offsetWidth), which ignore CSS
 * transforms, so the slide is correct inside the presentation shell's scaled
 * device frame. (Motion's layoutId measures on screen and broke when scaled.)
 * Stacking: pressed pills < active surface < labels.
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
  /**
   * The last tab touches the right edge of the surface above. When it's
   * active, its right side runs straight down from the surface edge (no curve).
   */
  flushEnd?: boolean
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

/** Surface, curves and strip of the active tab, positioned by <Tabs>. */
function ActiveSurface({ flushRight }: { flushRight: boolean }) {
  return (
    <>
      <Curve side="left" />
      {!flushRight && <Curve side="right" />}
      <span className="absolute inset-x-4 bottom-0 h-[5px] rounded-t-[3px] bg-brand" />
    </>
  )
}

/** Left offset of `el` inside `ancestor`, in layout px (unaffected by CSS transforms). */
function offsetLeftWithin(el: HTMLElement, ancestor: HTMLElement) {
  let x = 0
  let node: HTMLElement | null = el
  while (node && node !== ancestor) {
    x += node.offsetLeft
    node = node.offsetParent as HTMLElement | null
  }
  return x
}

function TabFace({
  label,
  active,
  divider,
  pressed,
  onPressStart,
  onPressCancel,
}: {
  label: string
  active: boolean
  divider: boolean
  pressed: boolean
  onPressStart: () => void
  onPressCancel: () => void
}) {
  return (
    <span
      data-tab-face
      onPointerDown={onPressStart}
      onPointerLeave={onPressCancel}
      onPointerCancel={onPressCancel}
      className="relative flex h-16 w-full min-w-0 items-center px-4"
    >
      {/* Pressed pill, always mounted under the active surface. It's the same
          colour as the active tab, so when a tapped tab becomes active the pill
          EXPANDS into the active shape (56 → 64 tall, radius 10 → square top /
          12 bottom) over the slide's duration while the active surface lands
          on it. When a tab stops being active its pill hides instantly, under
          the departing surface, so two active shapes never show.
          `pressed` comes from React state (pointerdown until the tab becomes
          active), not CSS :active: :active ends on pointerup, a moment before
          the click activates the tab, which made a held pill blink off and on. */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-x-0 bg-surface',
          active
            ? [
                'top-0 bottom-0 rounded-t-none rounded-b-lg opacity-100 scale-100',
                'transition-[top,bottom,border-radius,opacity,scale] duration-(--motion-select) ease-(--motion-ease) motion-reduce:transition-none',
              ]
            : pressed
              ? [
                  'top-1 bottom-1 rounded-md opacity-100 scale-100',
                  'transition-[opacity,scale] duration-(--motion-press-in) ease-(--motion-ease) motion-reduce:transition-none',
                ]
              : 'top-1 bottom-1 rounded-md opacity-0 scale-90',
        )}
      />
      <span
        className={cn(
          'relative z-10 min-w-0 flex-1 truncate text-center text-sm leading-5',
          active ? 'font-extrabold text-primary' : 'font-semibold text-muted',
        )}
      >
        {label}
      </span>
      {divider && (
        <span
          aria-hidden
          data-tab-divider
          className="absolute top-1/2 -left-[3px] h-6 w-px -translate-y-1/2 bg-divider"
        />
      )}
    </span>
  )
}

export function Tabs({ items, activeKey, onChange, className, forcePressedKey, flushEnd = false }: TabsProps) {
  // The tab being pressed: set on pointerdown, cleared when the press is
  // cancelled or the tab becomes active (in the same render, so the pill goes
  // straight from pressed to expanding).
  const [pressedKey, setPressedKey] = useState<string | null>(null)
  const shownPressedKey = forcePressedKey ?? pressedKey
  const activeIndex = items.findIndex((i) => i.key === activeKey)
  const pressedIndex = items.findIndex((i) => i.key === shownPressedKey && i.key !== activeKey)
  const handleChange = (key: string) => {
    setPressedKey(null)
    onChange(key)
  }

  // ── Active surface position (layout px, transform-proof) ──
  const wrapRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const width = useMotionValue(0)
  const opacity = useMotionValue(0) // hidden until first measured
  const activeKeyRef = useRef(activeKey)
  const placedKeyRef = useRef<string | null>(null)

  // Moves the surface onto the active tab: slide (tab change) or jump (first
  // paint, resize). Stable, so the resize observer below is created once.
  const place = useCallback(
    (slide: boolean) => {
      const wrap = wrapRef.current
      if (!wrap) return
      const tab = wrap.querySelector<HTMLElement>(`.ant-tabs-tab[data-node-key="${CSS.escape(activeKeyRef.current)}"]`)
      if (!tab) return
      const toX = offsetLeftWithin(tab, wrap)
      const toW = tab.offsetWidth
      if (slide) {
        animate(x, toX, selectionSlide)
        animate(width, toW, selectionSlide)
      } else {
        x.jump(toX)
        width.jump(toW)
      }
      opacity.jump(1)
    },
    [x, width, opacity],
  )

  // Tab changes slide; the very first placement jumps.
  useLayoutEffect(() => {
    activeKeyRef.current = activeKey
    const slide = placedKeyRef.current !== null && placedKeyRef.current !== activeKey
    placedKeyRef.current = activeKey
    place(slide)
  }, [activeKey, place])

  // Device-frame resizes change tab widths: follow them instantly.
  useLayoutEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const observer = new ResizeObserver(() => place(false))
    observer.observe(wrap)
    return () => observer.disconnect()
  }, [place])

  const lastActive = flushEnd && activeIndex === items.length - 1

  return (
    <div ref={wrapRef} className={cn('relative w-full', className)}>
      <motion.span
        aria-hidden
        data-active-surface
        style={{ x, width, opacity }}
        className="pointer-events-none absolute top-0 left-0 z-[1] h-16 rounded-b-lg bg-surface"
      >
        <ActiveSurface flushRight={lastActive} />
      </motion.span>
      <AntTabs
        activeKey={activeKey}
        onChange={handleChange}
        animated={false}
        items={items.map((item, i) => ({
          key: item.key,
          label: (
            <TabFace
              label={item.label}
              active={i === activeIndex}
              divider={
                i !== 0 &&
                i !== activeIndex &&
                i !== activeIndex + 1 &&
                i !== pressedIndex &&
                (pressedIndex === -1 || i !== pressedIndex + 1)
              }
              pressed={i === pressedIndex}
              onPressStart={() => setPressedKey(item.key)}
              onPressCancel={() => setPressedKey((k) => (k === item.key ? null : k))}
            />
          ),
        }))}
        className={cn(
          'w-full',
          '[&_.ant-tabs-nav]:m-0 [&_.ant-tabs-nav]:before:border-0',
          // AntD puts transforms on the nav wrap and list (for scrolling, unused
          // here). Each creates a stacking layer, which would put the active
          // surface (z-1) above the labels (z-10). Switched off.
          '[&_.ant-tabs-nav-wrap]:overflow-visible [&_.ant-tabs-nav-wrap]:transform-none!',
          '[&_.ant-tabs-nav-list]:w-full [&_.ant-tabs-nav-list]:transform-none!',
          '[&_.ant-tabs-tab]:min-w-0 [&_.ant-tabs-tab]:flex-1 [&_.ant-tabs-tab]:p-0',
          '[&_.ant-tabs-tab-btn]:w-full [&_.ant-tabs-tab-btn]:min-w-0',
          '[&_.ant-tabs-ink-bar]:hidden [&_.ant-tabs-nav-operations]:hidden [&_.ant-tabs-content-holder]:hidden',
        )}
      />
    </div>
  )
}
