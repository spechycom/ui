import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type AuthHighlight = {
  icon: ReactNode
  label: string
}

type AuthLayoutProps = {
  heading: string
  subheading: string
  highlights?: AuthHighlight[]
  /** Width of the content column — single-column forms (login, register) are
   * fine with the default `max-w-md`; multi-field or multi-step forms can
   * override this. */
  contentClassName?: string
  children: ReactNode
}

function BrandMark() {
  return (
    <div className="relative z-10 flex items-center gap-2 self-start text-neutral-0">
      <span className="flex size-7 items-center justify-center rounded-full bg-neutral-0/10">
        <span className="size-2.5 rounded-full bg-neutral-0" />
      </span>
      <span className="font-semibold text-lg tracking-tight">Spechy</span>
    </div>
  )
}

export function AuthLayout({
  heading,
  subheading,
  highlights,
  contentClassName,
  children,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <div className="relative hidden shrink-0 flex-col justify-between overflow-hidden bg-[linear-gradient(160deg,var(--neutral-950)_0%,var(--brand-900)_120%)] p-10 lg:flex lg:w-[380px] lg:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-20 size-64 rounded-full bg-brand-500/30 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-16 size-44 rounded-full bg-brand-300/20 blur-2xl"
        />
        <BrandMark />
        <div className="relative z-10 mt-auto space-y-4">
          <h1 className="text-h2 text-neutral-0">{heading}</h1>
          <p className="max-w-xs text-body-sm text-neutral-0/70">{subheading}</p>
          {highlights && highlights.length > 0 && (
            <ul className="mt-8 flex flex-col gap-3.5">
              {highlights.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2.5 text-ui-sm text-neutral-0/70"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-0/10">
                    {item.icon}
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className={cn('w-full max-w-md animate-rise space-y-7', contentClassName)}>
          {children}
        </div>
      </div>
    </div>
  )
}
