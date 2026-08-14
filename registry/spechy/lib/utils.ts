import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Avatar fallback'i için baş harfler: ilk iki kelimenin ilk harfi.
 * Boş/eksik girdide boş string döner — çağıran tarafta ikon fallback'i olur.
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
