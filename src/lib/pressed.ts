/*
 * Instant press feedback in every browser.
 *
 * CSS :active is unreliable on touch (Firefox applies it ~100ms late and can
 * keep it on the last-tapped element until something else is tapped). So the
 * pressed look is driven only by a `data-pressed` attribute: set on
 * pointerdown (or Space/Enter), cleared when the press ends. The `pressed:` /
 * `group-pressed:` Tailwind variants (index.css) match it, so every press
 * style, easing and the 1px sink start on the first frame and end on release.
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
  // Only the window itself losing focus ends a press. (A capture-phase blur
  // listener would also catch the previously focused button blurring as the
  // new press starts, and wipe that press immediately.)
  window.addEventListener('blur', (event) => {
    if (event.target === window) release()
  })

  // Keyboard: Space / Enter on a focused control shows the same press.
  document.addEventListener(
    'keydown',
    (event) => {
      if ((event.key !== ' ' && event.key !== 'Enter') || event.repeat) return
      const target = event.target instanceof Element ? event.target.closest(PRESSABLE) : null
      if (!target || (target instanceof HTMLButtonElement && target.disabled)) return
      release()
      current = target
      target.setAttribute('data-pressed', '')
      safety = setTimeout(release, MAX_PRESS_MS)
    },
    { capture: true },
  )
  document.addEventListener('keyup', release, { capture: true })
}
