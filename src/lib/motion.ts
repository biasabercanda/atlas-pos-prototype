import type { Transition } from 'motion/react'

/*
 * Motion presets: the one place animation timing is defined.
 * Components import a named preset instead of writing their own numbers,
 * so the whole app moves the same way and can be retuned here.
 *
 * Pressed states are not animated with Motion: they use CSS :active, with
 * the short fade in tokens.css (--motion-press-fade), so they respond on the
 * first frame of a tap.
 */

/** Selection indicators that move between options: active tab, toggle and switcher thumbs. */
export const selectionSlide: Transition = { type: 'spring', bounce: 0, duration: 0.3 }

/** The presentation shell's device frame changing size (BRIEF §3, ~250ms). */
export const frameResize: Transition = { type: 'spring', bounce: 0, duration: 0.25 }
