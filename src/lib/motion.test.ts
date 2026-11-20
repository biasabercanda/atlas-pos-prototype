import { describe, expect, it } from 'vitest'
import css from '../theme/tokens.css?raw'
import { duration, easeOutQuint, motionTokens } from './motion'

/* motion.ts mirrors the motion tokens in tokens.css; this keeps them in sync. */

function cssVar(name: string): string {
  const match = css.match(new RegExp(`--${name}:\\s*([^;]+);`))
  if (!match) throw new Error(`--${name} not found in tokens.css`)
  return match[1].trim()
}

/** Follows var(--x) references until it reaches a raw value. */
function resolve(name: string): string {
  const value = cssVar(name)
  const ref = value.match(/^var\(--([\w-]+)\)$/)
  return ref ? resolve(ref[1]) : value
}

describe('motion tokens', () => {
  it('duration primitives match', () => {
    for (const [step, value] of Object.entries(duration)) {
      expect(cssVar(`duration-${step}`)).toBe(`${value}ms`)
    }
  })

  it('easing matches', () => {
    expect(cssVar('ease-out-quint')).toBe(`cubic-bezier(${easeOutQuint.join(', ')})`)
  })

  it('semantic tokens resolve to the same values', () => {
    expect(resolve('motion-press-in')).toBe(`${motionTokens.pressIn}ms`)
    expect(resolve('motion-press-out')).toBe(`${motionTokens.pressOut}ms`)
    expect(resolve('motion-select')).toBe(`${motionTokens.select}ms`)
    expect(resolve('motion-feedback')).toBe(`${motionTokens.feedback}ms`)
    expect(resolve('motion-frame')).toBe(`${motionTokens.frame}ms`)
    expect(resolve('motion-ease')).toBe(`cubic-bezier(${motionTokens.ease.join(', ')})`)
  })
})
