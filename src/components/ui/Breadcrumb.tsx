import { Breadcrumb as AntBreadcrumb } from 'antd'
import { NavArrowRight } from 'iconoir-react'
import { motion } from 'motion/react'
import { cn } from '../../lib/cn'
import { tapFeedback } from '../../lib/motion'

/*
 * Figma: Components → Navigation & header → Breadcrumb crumb (264:208)
 *   16 Bold, 48px-tall tap target, 8px gaps, nav-arrow-right 20px separator.
 *   Current = text-primary (not tappable); Parent = text-muted, tappable;
 *   Pressed (parent) = text-secondary.
 *
 * Motion (--motion-feedback): a new deeper crumb and its › fade in and slide
 * 8px in from the left, as if the path extends; the old current crumb eases
 * from text-primary to text-muted as it becomes the parent (every crumb is the
 * same <button>, so React keeps the element and CSS can transition its colour).
 * Going back is instant: no exit animation, the next tap is never delayed.
 */

const slideIn = { initial: { opacity: 0, x: -8 }, animate: { opacity: 1, x: 0 }, transition: tapFeedback }

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
      separator={
        <motion.span {...slideIn} className="flex">
          <NavArrowRight width={20} height={20} strokeWidth={2} className="text-muted" />
        </motion.span>
      }
      items={items.map((item, i) => {
        const current = i === items.length - 1
        const crumb = (
          <button
            type="button"
            aria-current={current ? 'page' : undefined}
            tabIndex={current ? -1 : undefined}
            onClick={current ? undefined : item.onClick}
            className={cn(
              'flex h-12 min-w-12 items-center text-base leading-6 font-bold whitespace-nowrap',
              'transition-colors duration-(--motion-feedback) ease-(--motion-ease) motion-reduce:transition-none',
              current
                ? 'pointer-events-none text-primary'
                : forceState === 'pressed'
                  ? 'cursor-pointer text-secondary'
                  : 'cursor-pointer text-muted active:text-secondary active:duration-(--motion-press-in)',
            )}
          >
            {item.label}
          </button>
        )
        return {
          // The first crumb never animates (it's the tab itself); deeper ones slide in.
          title: i === 0 ? crumb : <motion.span {...slideIn} className="flex">{crumb}</motion.span>,
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
