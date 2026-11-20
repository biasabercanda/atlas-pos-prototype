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

/** The pressed pill held in its pressed look (gallery "Pressed" columns). */
export const pressPillForced = 'opacity-100 scale-100'

/**
 * Same overlay, only while :active. Written out in full (not built from the
 * string above) because Tailwind only generates classes it finds literally.
 */
export const overlayPressedActive =
  'active:bg-[image:linear-gradient(var(--bg-overlay-pressed),var(--bg-overlay-pressed))]'
