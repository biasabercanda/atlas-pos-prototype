import type { Transition } from 'motion/react'

/*
 * Motion tokens for JS (the Motion library).
 * Mirrors the motion tokens in src/theme/tokens.css, because Motion can't
 * read CSS variables. motion.test.ts checks the two stay identical.
 * Components import the presets below; they never write their own timing.
 */

/** Primitives, in ms (same names as tokens.css). */
export const duration = {
  100: 100,
  150: 150,
  250: 250,
  300: 300,
} as const

/** --ease-out-quint */
export const easeOutQuint = [0.22, 1, 0.36, 1] as const

/** Semantic tokens, in ms (same names as tokens.css, without "--motion-"). */
export const motionTokens = {
  pressIn: duration[100],
  pressOut: duration[150],
  select: duration[300],
  feedback: duration[150],
  frame: duration[250],
  ease: easeOutQuint,
} as const

const ms = (value: number) => value / 1000

/** Selection indicators that move between options: active tab, toggle and switcher thumbs. */
export const selectionSlide: Transition = { duration: ms(motionTokens.select), ease: [...motionTokens.ease] }

/** Confirmation of a tap: count badge pop, ★ making room, new order line, new crumb. */
export const tapFeedback: Transition = { duration: ms(motionTokens.feedback), ease: [...motionTokens.ease] }

/** The presentation shell's device frame changing size (BRIEF §3, ~250ms). */
export const frameResize: Transition = { duration: ms(motionTokens.frame), ease: [...motionTokens.ease] }
