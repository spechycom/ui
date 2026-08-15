'use client'

import {
  IconBuildingSkyscraper,
  IconChartBar,
  IconChevronDown,
  IconCircleCheck,
  IconCircleMinus,
  IconCoffee,
  IconCreditCard,
  IconGridDots,
  IconLayoutGrid,
  IconMoon,
  IconPhone,
  IconSparkles,
  IconUsers,
} from '@tabler/icons-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

const STATUSES = [
  { value: 'available', label: 'Available', icon: IconCircleCheck, colorClass: 'text-status-online' },
  { value: 'busy', label: 'Busy', icon: IconCircleMinus, colorClass: 'text-status-busy' },
  { value: 'break', label: 'On a break', icon: IconCoffee, colorClass: 'text-text-secondary' },
  { value: 'meeting', label: 'In a meeting', icon: IconUsers, colorClass: 'text-text-secondary' },
  { value: 'offline', label: 'Offline', icon: IconMoon, colorClass: 'text-text-secondary' },
] as const

export function UserStatusControl() {
  const [status, setStatus] = useState<(typeof STATUSES)[number]['value']>('available')
  const active = STATUSES.find((candidate) => candidate.value === status) ?? STATUSES[0]
  const ActiveIcon = active.icon

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 gap-2 rounded-full ps-2.5 pe-2"
        >
          <ActiveIcon stroke={1.75} className={cn('shrink-0', active.colorClass)} />
          <span className="hidden font-semibold text-[13px] text-text-secondary tracking-[var(--tracking-tight)] sm:inline">
            {active.label}
          </span>
          <IconChevronDown size={14} stroke={2} className="text-text-faint" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-53 p-1.5">
        <p className="px-2 pt-1.5 pb-1 text-eyebrow text-text-faint">Set status</p>
        <DropdownMenuRadioGroup value={status} onValueChange={(value) => setStatus(value as (typeof STATUSES)[number]['value'])}>
          {STATUSES.map((option) => {
            const Icon = option.icon
            return (
              <DropdownMenuRadioItem key={option.value} value={option.value} className="gap-2.5">
                <Icon stroke={1.75} className={cn('shrink-0', option.colorClass)} />
                <span className="flex-1">{option.label}</span>
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Hiçbirinin hedefi (route/uygulama) yok — hepsi kasıtlı olarak "yakında"
// durumunda, tıklanamaz. className'ler yalnızca tema token'ı taşır, ham renk yok.
const APPS = [
  { key: 'omni', label: 'Omni', icon: IconLayoutGrid, className: 'bg-brand-50 text-brand-600' },
  {
    key: 'spechy',
    label: 'Spechy',
    icon: IconBuildingSkyscraper,
    className: 'bg-foreground text-background',
  },
  { key: 'crm', label: 'CRM', icon: IconUsers, className: 'bg-info-50 text-info-700' },
  { key: 'voice', label: 'Voice', icon: IconPhone, className: 'bg-warning-50 text-warning-700' },
  { key: 'ai', label: 'AI', icon: IconSparkles, className: 'bg-violet-50 text-violet-700' },
  { key: 'pay', label: 'Pay', icon: IconCreditCard, className: 'bg-success-50 text-success-700' },
  { key: 'bi', label: 'BI', icon: IconChartBar, className: 'bg-teal-50 text-teal-700' },
] as const

export function AppsGridPopover() {
  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="text-text-secondary">
              <IconGridDots stroke={1.75} />
              <span className="sr-only">Apps</span>
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Apps</TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-86 rounded-panel">
        <div className="grid grid-cols-3 gap-2">
          {APPS.map(({ key, label, icon: Icon, className }) => (
            <Tooltip key={key}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={(event) => event.preventDefault()}
                  aria-disabled="true"
                  className="flex flex-col items-center gap-1.5 rounded-control p-2 text-center transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <span
                    className={cn(
                      'flex size-9 items-center justify-center rounded-md',
                      className,
                    )}
                  >
                    <Icon size={20} stroke={1.75} />
                  </span>
                  <span className="text-xs font-medium text-foreground">{label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>Coming soon</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
