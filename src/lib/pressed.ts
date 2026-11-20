/*
 * Instant press feedback in every browser.
 *
 * CSS :active is late on touch in some browsers (Firefox waits ~100ms to rule
 * out a scroll before applying it). This sets a `data-pressed` attribute on
 * the pressed control on pointerdown and clears it on release or cancel. The
 * `pressed:` / `group-pressed:` Tailwind variants (index.css) match either, so
 * every press style, easing and the 1px sink start on the first frame.
 *
 * Pressable = a <button> or anything marked [data-pressable] (e.g. toggle
 * segments). Disabled buttons are skipped. Tabs track their own press in
 * React state (see ui/Tabs).
 */

const PRESSABLE = 'button, [data-pressable]'

let current: Element | null = null

function release() {
  current?.removeAttribute('data-pressed')
  current = null
}

export function installPressedState() {
  document.addEventListener(
    'pointerdown',
    (event) => {
      release()
      const target = event.target instanceof Element ? event.target.closest(PRESSABLE) : null
      if (!target || (target instanceof HTMLButtonElement && target.disabled)) return
      current = target
      target.setAttribute('data-pressed', '')
    },
    { capture: true, passive: true },
  )
  for (const type of ['pointerup', 'pointercancel', 'blur'] as const) {
    window.addEventListener(type, release, { capture: true, passive: true })
  }
}
