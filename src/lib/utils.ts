import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Initials for an avatar fallback: first letter of the first two words.
 * Empty/missing input returns an empty string — callers fall back to an icon.
 */
export function initials(value: string | null | undefined): string {
  if (!value) return ''

  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase()
}
