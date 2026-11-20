import { Tag as AntTag } from 'antd'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

/*
 * Figma: Components → Order panel → Table pill (17:255)
 * bg-badge / text-badge-text, 12 Extra Bold (16 line), padding 4/12 (24 tall,
 * as on the final screen; the component sheet shows 3/22), radius full.
 * Not tappable, no states.
 */

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <AntTag
      bordered={false}
      className={cn(
        'm-0 rounded-full border-0 bg-badge px-3 py-1 text-xs leading-4 font-extrabold text-badge-text',
        className,
      )}
    >
      {children}
    </AntTag>
  )
}
