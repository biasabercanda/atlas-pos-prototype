import { Button as AntButton } from 'antd'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

/*
 * Figma: Components → Navigation & header → Icon button (40:1351)
 * 48×48 tap target, 20px Iconoir icon (stroke 2) in text-secondary, radius 10.
 * Flat control: Pressed = bg-raised. Buttons sit with 0 gap in groups.
 */

export interface IconButtonProps {
  /** Accessible name; the icon itself is decorative. */
  label: string
  icon: ReactNode
  onClick?: () => void
  className?: string
  forceState?: 'pressed'
}

export function IconButton({ label, icon, onClick, className, forceState }: IconButtonProps) {
  return (
    <AntButton
      type="text"
      aria-label={label}
      onClick={onClick}
      icon={icon}
      className={cn(
        'size-12 min-w-12 rounded-md border-0 p-0 text-secondary shadow-none transition-none',
        'flex items-center justify-center bg-transparent',
        '[&_svg]:size-5',
        forceState === 'pressed' ? 'bg-raised' : 'active:bg-raised',
        className,
      )}
    />
  )
}
