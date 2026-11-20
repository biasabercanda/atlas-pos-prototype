import { Segmented as AntSegmented } from 'antd'
import { LayoutGroup, motion } from 'motion/react'
import { useId, type ReactNode } from 'react'
import { cn, tv } from '../../lib/cn'
import { selectionSlide } from '../../lib/motion'

/*
 * Figma: Components → Navigation & header → View toggle / Segment (17:240)
 *   icon:  48×48 segments, radius 10, on a bg-inset track (radius 8, no padding).
 *          Active = bg-brand + text-on-accent icon; Inactive = text-secondary;
 *          Pressed = bg-raised.
 *   text:  same rules with labels, used by the presentation shell's device
 *          switcher (BRIEF §3): bg-raised track, text-secondary labels.
 *
 * The brand-coloured thumb is one shared Motion element (`layoutId`), so it
 * slides to the newly selected option. AntD's own selected background and
 * thumb are switched off; AntD still supplies the radio-group semantics and
 * keyboard arrows.
 */

const segmented = tv({
  slots: {
    root: [
      'rounded-sm',
      '[&_.ant-segmented-group]:gap-0',
      '[&_.ant-segmented-thumb]:hidden',
      '[&_.ant-segmented-item]:rounded-md [&_.ant-segmented-item]:transition-none',
      '[&_.ant-segmented-item]:text-secondary [&_.ant-segmented-item-selected]:text-on-accent',
      '[&_.ant-segmented-item-selected]:bg-transparent',
      '[&_.ant-segmented-item-label]:p-0 [&_.ant-segmented-item-label]:min-h-0',
    ],
    face: 'relative flex items-center justify-center',
    thumb: 'absolute inset-0 rounded-md bg-brand',
    press: [
      'absolute inset-0 rounded-md opacity-0',
      'transition-opacity duration-(--motion-press-fade)',
      'group-active/seg:opacity-100 group-active/seg:duration-0',
    ],
  },
  variants: {
    size: {
      icon: { face: 'size-12 [&_svg]:size-5' },
      text: { face: 'h-10 px-4 text-sm leading-5 font-semibold' },
    },
    track: {
      inset: { root: 'bg-inset p-0', press: 'bg-raised' },
      raised: { root: 'bg-raised p-1', press: 'bg-surface' },
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
  const groupId = useId()
  const s = segmented({ size, track })
  return (
    <LayoutGroup id={groupId}>
      <AntSegmented<V>
        value={value}
        onChange={onChange}
        options={options.map((o) => {
          const selected = o.value === value
          return {
            value: o.value,
            title: o.title,
            label: (
              <span className={cn('group/seg', s.face())}>
                {selected ? (
                  <motion.span layoutId="segmented-thumb" transition={selectionSlide} aria-hidden className={s.thumb()} />
                ) : (
                  <span aria-hidden className={s.press()} />
                )}
                <span className="relative flex items-center justify-center">{o.content}</span>
              </span>
            ),
          }
        })}
        className={cn(s.root(), className)}
      />
    </LayoutGroup>
  )
}
