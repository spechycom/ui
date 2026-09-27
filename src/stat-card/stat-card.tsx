import type { ComponentType, ReactNode } from 'react'
import { Card, CardContent } from '@/ui/card'

export type StatCardIcon = ComponentType<{ className?: string; size?: number; stroke?: number }>

export type StatCardProps = {
  label: string
  value: ReactNode
  icon?: StatCardIcon
  hint?: string
  className?: string
}

/** A single KPI tile — label, big number, optional icon and a small hint line underneath (e.g. a
 * percentage of some total). Render a `Skeleton` in its place while loading; this component only
 * covers the loaded state. */
export function StatCard({ label, value, icon: Icon, hint, className }: StatCardProps) {
  return (
    <Card className={className}>
      <CardContent className="space-y-1">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          {Icon ? <Icon className="size-4 shrink-0" /> : null}
          <span>{label}</span>
        </div>
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  )
}
