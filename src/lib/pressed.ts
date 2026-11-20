/*
 * Instant press feedback in every browser.
 *
 * CSS :active is late on touch in some browsers (Firefox waits ~100ms to rule
 * out a scroll before applying it). This sets a `data-pressed` attribute on
 * the pressed control on pointerdown and clears it when the press ends. The
 * `pressed:` / `group-pressed:` Tailwind variants (index.css) match either, so
 * every press style, easing and the 1px sink start on the first frame.
 *
 * A press can end in several ways depending on browser and input (pointerup,
 * pointercancel when a scroll takes over, touchend, contextmenu on long-press,
 * the window losing focus...), so every one of them releases. A safety timer
 * also releases if none arrive, so a press can never stay stuck.
 *
 * Pressable = a <button> or anything marked [data-pressable] (e.g. toggle
 * segments). Disabled buttons are skipped. Tabs track their own press in
 * React state (see ui/Tabs).
 */

const PRESSABLE = 'button, [data-pressable]'
const END_EVENTS = [
  'pointerup',
  'pointercancel',
  'lostpointercapture',
  'touchend',
  'touchcancel',
  'mouseup',
  'click',
  'contextmenu',
  'dragstart',
  'blur',
] as const
/** Longest a single press can stay shown without an end event. */
const MAX_PRESS_MS = 10_000

let current: Element | null = null
let safety: ReturnType<typeof setTimeout> | undefined

function release() {
  clearTimeout(safety)
  current?.removeAttribute('data-pressed')
  current = null
}

declare global {
  interface Window {
    __pressedStateInstalled?: boolean
  }
}

export function installPressedState() {
  // Hot reload re-runs main.tsx; install the listeners only once.
  if (window.__pressedStateInstalled) return
  window.__pressedStateInstalled = true

  document.addEventListener(
    'pointerdown',
    (event) => {
      release()
      const target = event.target instanceof Element ? event.target.closest(PRESSABLE) : null
      if (!target || (target instanceof HTMLButtonElement && target.disabled)) return
      current = target
      target.setAttribute('data-pressed', '')
      safety = setTimeout(release, MAX_PRESS_MS)
    },
    { capture: true, passive: true },
  )
  for (const type of END_EVENTS) {
    window.addEventListener(type, release, { capture: true, passive: true })
  }
  document.addEventListener('visibilitychange', release)
}
