'use client'

import {
  type Icon,
  IconChartBar,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutDashboard,
  IconMessage,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type NavItem = {
  label: string
  icon: Icon
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: IconLayoutDashboard },
  { label: 'Contacts', icon: IconUsers },
  { label: 'Messages', icon: IconMessage },
  { label: 'Analytics', icon: IconChartBar },
  { label: 'Settings', icon: IconSettings },
]

const ACTIVE_LABEL = 'Dashboard'

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        'flex h-full flex-col border-e bg-card transition-[width]',
        isCollapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex h-[var(--control-xl)] items-center gap-2 border-b px-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-control bg-primary text-sm font-semibold text-primary-foreground">
          D
        </div>
        {!isCollapsed && <span className="truncate text-sm font-semibold">Dashboard</span>}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {NAV_ITEMS.map((item) => {
          const isActive = item.label === ACTIVE_LABEL
          const ItemIcon = item.icon

          const buttonClassName = cn(
            'flex w-full items-center gap-3 rounded-control px-3 py-2 text-sm font-medium transition-colors',
            isCollapsed && 'justify-center px-0',
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'text-text-secondary hover:bg-accent hover:text-accent-foreground',
          )
          const buttonContent = (
            <>
              <ItemIcon className="size-4.5 shrink-0" />
              <span className={cn(isCollapsed && 'sr-only')}>{item.label}</span>
            </>
          )

          if (!isCollapsed) {
            return (
              <button key={item.label} type="button" className={buttonClassName}>
                {buttonContent}
              </button>
            )
          }

          return (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <button type="button" className={buttonClassName}>
                  {buttonContent}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          )
        })}
      </nav>

      <div className="border-t p-2">
        <Button
          type="button"
          variant="ghost"
          className="h-[var(--control-md)] w-full justify-center"
          onClick={() => setIsCollapsed((prev) => !prev)}
        >
          {isCollapsed ? (
            <IconChevronsRight className="size-4.5" />
          ) : (
            <IconChevronsLeft className="size-4.5" />
          )}
          <span className="sr-only">{isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}</span>
        </Button>
      </div>
    </div>
  )
}
