import { Breadcrumb as AntBreadcrumb } from 'antd'
import { NavArrowRight } from 'iconoir-react'
import { cn } from '../../lib/cn'

/*
 * Figma: Components → Navigation & header → Breadcrumb crumb (264:208)
 *   16 Bold, 48px-tall tap target, 8px gaps, nav-arrow-right 20px separator.
 *   Current = text-primary (not tappable); Parent = text-muted, tappable;
 *   Pressed (parent) = text-secondary.
 */

export interface BreadcrumbItem {
  label: string
  /** Omit on the current (last) crumb. */
  onClick?: () => void
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  /** Gallery only: draw parent crumbs in their pressed state. */
  forceState?: 'pressed'
}

export function Breadcrumb({ items, className, forceState }: BreadcrumbProps) {
  return (
    <AntBreadcrumb
      separator={<NavArrowRight width={20} height={20} strokeWidth={2} className="text-muted" />}
      items={items.map((item, i) => {
        const current = i === items.length - 1
        return {
          title: current ? (
            <span aria-current="page" className="flex h-12 items-center text-base leading-6 font-bold text-primary">
              {item.label}
            </span>
          ) : (
            <button
              type="button"
              onClick={item.onClick}
              className={cn(
                'flex h-12 min-w-12 cursor-pointer items-center text-base leading-6 font-bold',
                forceState === 'pressed' ? 'text-secondary' : 'text-muted active:text-secondary',
              )}
            >
              {item.label}
            </button>
          ),
        }
      })}
      className={cn(
        '[&_ol]:flex-nowrap [&_ol]:items-center',
        '[&_li]:flex [&_li]:items-center',
        '[&_.ant-breadcrumb-separator]:flex [&_.ant-breadcrumb-separator]:items-center',
        '[&_.ant-breadcrumb-link]:flex',
        className,
      )}
    />
  )
}
