import { Button as AntButton, type ButtonProps as AntButtonProps } from 'antd'
import type { ReactNode } from 'react'
import { buttonSink, buttonSinkForced, cn, overlayPressed, overlayPressedActive, tv } from '../../lib/cn'

/*
 * Figma: Components → Order panel → Button (17:250)
 *   Primary   (Charge):           bg-brand, 16 Extra Bold, shadow-button
 *   Secondary (Hold/Fire/Print):  bg-surface + 1px divider, 20px icon + 14 Bold
 * States: Default · Pressed (shadow-pressed + overlay, content sinks 1px like
 *         the tiles, no scale) · Disabled
 *   Primary disabled: bg-raised, text-disabled, no shadow
 *   Secondary disabled: text-disabled, icon at 40%, no shadow
 * Pressed uses CSS :active (pointer, touch and Space/Enter), so no JS state.
 * AntD supplies the <button>, focus handling and disabled semantics; the look
 * is set here with utilities, which sit in a later CSS layer than AntD.
 */

const pressedClasses = ['shadow-pressed', overlayPressed]

const button = tv({
  base: ['relative h-14 rounded-sm px-3 gap-2', 'flex items-center justify-center', 'transition-none'],
  variants: {
    variant: {
      primary: 'border-0 bg-brand text-base leading-6 font-extrabold text-on-accent',
      secondary: 'border border-divider bg-surface text-sm leading-5 font-bold text-primary',
    },
    pressed: { true: '', false: '' },
    disabled: { true: 'shadow-none cursor-not-allowed', false: '' },
  },
  compoundVariants: [
    { disabled: false, pressed: false, class: ['shadow-button', 'active:shadow-pressed', overlayPressedActive, buttonSink] },
    { disabled: false, pressed: true, class: [...pressedClasses, buttonSinkForced] },
    { variant: 'primary', disabled: true, class: 'bg-raised text-disabled' },
    { variant: 'secondary', disabled: true, class: 'bg-surface border-divider text-disabled' },
  ],
  defaultVariants: { variant: 'primary', pressed: false, disabled: false },
})

export interface ButtonProps {
  variant?: 'primary' | 'secondary'
  /** 20px icon. Secondary buttons colour it themselves (e.g. text-hold). */
  icon?: ReactNode
  disabled?: boolean
  onClick?: () => void
  className?: string
  children: ReactNode
  /** Forces a visual state for the component gallery. */
  forceState?: 'pressed'
  'data-check'?: string
}

export function Button({
  variant = 'primary',
  icon,
  disabled = false,
  onClick,
  className,
  children,
  forceState,
  ...rest
}: ButtonProps) {
  const antType: AntButtonProps['type'] = variant === 'primary' ? 'primary' : 'default'
  return (
    <AntButton
      type={antType}
      disabled={disabled}
      onClick={onClick}
      icon={
        icon ? (
          <span className={cn('flex size-5 items-center justify-center', disabled && 'opacity-40')}>{icon}</span>
        ) : undefined
      }
      className={cn(button({ variant, pressed: forceState === 'pressed' && !disabled, disabled }), className)}
      {...rest}
    >
      {children}
    </AntButton>
  )
}
