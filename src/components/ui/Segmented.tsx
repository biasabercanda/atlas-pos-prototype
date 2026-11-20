import { Segmented as AntSegmented } from 'antd'
import type { ReactNode } from 'react'
import { cn, tv } from '../../lib/cn'

/*
 * Figma: Components → Navigation & header → View toggle / Segment (17:240)
 *   icon:  48×48 segments, radius 10, on a bg-inset track (radius 8, no padding).
 *          Active = bg-brand + text-on-accent icon; Inactive = text-secondary;
 *          Pressed = bg-raised.
 *   text:  same rules with labels, used by the presentation shell's device
 *          switcher (BRIEF §3): bg-raised track, text-secondary labels.
 * AntD supplies the radio-group semantics, keyboard arrows and the moving thumb.
 */

const segmented = tv({
  base: [
    'rounded-sm p-0',
    '[&_.ant-segmented-group]:gap-0',
    '[&_.ant-segmented-item]:rounded-md [&_.ant-segmented-thumb]:rounded-md',
    '[&_.ant-segmented-item]:text-secondary [&_.ant-segmented-item]:transition-none',
    '[&_.ant-segmented-item-selected]:bg-brand [&_.ant-segmented-item-selected]:text-on-accent',
    '[&_.ant-segmented-thumb]:bg-brand',
    '[&_.ant-segmented-item:not(.ant-segmented-item-selected):active]:bg-raised',
    '[&_.ant-segmented-item-label]:flex [&_.ant-segmented-item-label]:items-center [&_.ant-segmented-item-label]:justify-center',
  ],
  variants: {
    size: {
      icon: [
        '[&_.ant-segmented-item-label]:size-12 [&_.ant-segmented-item-label]:min-h-12 [&_.ant-segmented-item-label]:p-0',
        '[&_svg]:size-5',
      ],
      text: [
        '[&_.ant-segmented-item-label]:h-10 [&_.ant-segmented-item-label]:min-h-10 [&_.ant-segmented-item-label]:px-4',
        '[&_.ant-segmented-item-label]:text-sm [&_.ant-segmented-item-label]:leading-5 [&_.ant-segmented-item-label]:font-semibold',
      ],
    },
    track: {
      inset: 'bg-inset',
      raised: 'bg-raised p-1 [&_.ant-segmented-item:not(.ant-segmented-item-selected):active]:bg-surface',
    },
  },
  defaultVariants: { size: 'icon', track: 'inset' },
})

export interface SegmentedOption<V extends string> {
  value: V
  /** Icon (size="icon") or text (size="text"). */
  content: ReactNode
  /** Accessible name / tooltip, required for icon-only options. */
  title: string
}

export interface SegmentedProps<V extends string> {
  options: SegmentedOption<V>[]
  value: V
  onChange: (value: V) => void
  size?: 'icon' | 'text'
  track?: 'inset' | 'raised'
  className?: string
}

export function Segmented<V extends string>({
  options,
  value,
  onChange,
  size = 'icon',
  track = 'inset',
  className,
}: SegmentedProps<V>) {
  return (
    <AntSegmented<V>
      value={value}
      onChange={onChange}
      options={options.map((o) => ({ value: o.value, label: o.content, title: o.title }))}
      className={cn(segmented({ size, track }), className)}
    />
  )
}
