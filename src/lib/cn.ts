import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'
import { createTV } from 'tailwind-variants'

/*
 * tailwind-merge must know our custom shadow names (shadow-tile, shadow-pressed…),
 * otherwise it reads them as shadow *colours* and won't treat
 * "shadow-tile shadow-pressed" as a conflict.
 */
const twMergeConfig = {
  extend: {
    theme: {
      shadow: ['tile', 'button', 'soft', 'pressed', 'badge'],
      'drop-shadow': ['tile', 'flap'],
    },
  },
}

const twMerge = extendTailwindMerge(twMergeConfig)

/** Join class names; later Tailwind classes win over conflicting earlier ones. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** tailwind-variants with the same merge rules. */
export const tv = createTV({ twMerge })

/**
 * Raised pressed overlay as a background-image layer: paints above the
 * background colour and below the content, with no extra element.
 */
export const overlayPressed = 'bg-[image:linear-gradient(var(--bg-overlay-pressed),var(--bg-overlay-pressed))]'

/**
 * Pressed pill for flat controls (tabs, toggle segments). Put `group/press` on
 * the tappable parent and this on an absolutely positioned layer behind the
 * content. On press it grows from 90% and fades in (--motion-press-in); on
 * release it fades out (--motion-press-out). Written out in full for Tailwind.
 */
export const pressPill =
  'opacity-0 scale-90 transition-[opacity,scale] duration-(--motion-press-out) ease-(--motion-ease) motion-reduce:transition-none group-active/press:opacity-100 group-active/press:scale-100 group-active/press:duration-(--motion-press-in)'

/**
 * Raised press easing (tiles, folders): add to a layer whose opacity or filter
 * changes under `group-active/press`. Eases in over --motion-press-in, out over
 * --motion-press-out. Written out in full for Tailwind.
 */
export const pressFadeOpacity =
  'transition-opacity duration-(--motion-press-out) ease-(--motion-ease) group-active/press:duration-(--motion-press-in) motion-reduce:transition-none'
export const pressFadeFilter =
  'transition-[filter] duration-(--motion-press-out) ease-(--motion-ease) group-active/press:duration-(--motion-press-in) motion-reduce:transition-none'

/**
 * Tile press "sink": the tile's content (name, icon) moves down 1px while
 * pressed, like a key going down, and comes back on release. CSS only, so it
 * never delays the next tap. Written out in full for Tailwind.
 */
export const pressSink =
  'transition-transform duration-(--motion-press-out) ease-(--motion-ease) group-active/press:translate-y-px group-active/press:duration-(--motion-press-in) motion-reduce:transition-none'

/**
 * The same 1px sink for buttons, whose content is AntD's icon and label
 * <span>s (direct children of the <button>), driven by the button's own
 * :active. Written out in full for Tailwind.
 */
export const buttonSink =
  '[&>span]:transition-transform [&>span]:duration-(--motion-press-out) [&>span]:ease-(--motion-ease) active:[&>span]:translate-y-px active:[&>span]:duration-(--motion-press-in) motion-reduce:[&>span]:transition-none'

/** Button content held in its sunk position (gallery "Pressed" columns). */
export const buttonSinkForced = '[&>span]:translate-y-px'

/** The pressed pill held in its pressed look (gallery "Pressed" columns). */
export const pressPillForced = 'opacity-100 scale-100'

/**
 * Same overlay, only while :active. Written out in full (not built from the
 * string above) because Tailwind only generates classes it finds literally.
 */
export const overlayPressedActive =
  'active:bg-[image:linear-gradient(var(--bg-overlay-pressed),var(--bg-overlay-pressed))]'
