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
 * Same overlay, only while :active. Written out in full (not built from the
 * string above) because Tailwind only generates classes it finds literally.
 */
export const overlayPressedActive =
  'active:bg-[image:linear-gradient(var(--bg-overlay-pressed),var(--bg-overlay-pressed))]'
