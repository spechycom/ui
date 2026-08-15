'use client'

import {
  IconBell,
  IconBook,
  IconBuilding,
  IconCalendar,
  IconChevronDown,
  IconMenu2,
  IconPlus,
  IconSearch,
  IconTicket,
  IconUser,
} from '@tabler/icons-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

type AppHeaderProps = {
  onOpenMobileMenu: () => void
}

const QUICK_ACTIONS = [
  { label: 'Calendar', icon: IconCalendar },
  { label: 'Knowledge base', icon: IconBook },
] as const

const QUICK_ADD_ITEMS = [
  { label: 'New contact', icon: IconUser },
  { label: 'New company', icon: IconBuilding },
  { label: 'New ticket', icon: IconTicket },
] as const

const NOTIFICATIONS = [
  { title: 'New message from Alex', time: '2m ago' },
  { title: 'Ticket #128 was closed', time: '1h ago' },
  { title: 'Weekly report is ready', time: 'Yesterday' },
] as const

export function AppHeader({ onOpenMobileMenu }: AppHeaderProps) {
  return (
    <header className="flex h-[var(--control-xl)] items-center gap-1 border-b bg-card px-3.5">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onOpenMobileMenu}
      >
        <IconMenu2 className="size-4.5" />
        <span className="sr-only">Open menu</span>
      </Button>

      <div className="hidden items-center gap-0.5 sm:flex">
        {QUICK_ACTIONS.map((action) => {
          const ActionIcon = action.icon
          return (
            <Tooltip key={action.label}>
              <TooltipTrigger asChild>
                <Button type="button" variant="ghost" size="icon" className="text-text-secondary">
                  <ActionIcon className="size-4.5" />
                  <span className="sr-only">{action.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{action.label}</TooltipContent>
            </Tooltip>
          )
        })}

        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-6" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5 bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
            >
              <IconPlus className="size-4" />
              Quick add
              <IconChevronDown className="size-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            {QUICK_ADD_ITEMS.map((item) => {
              const ItemIcon = item.icon
              return (
                <DropdownMenuItem key={item.label}>
                  <ItemIcon />
                  {item.label}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative ms-2 max-w-sm flex-1">
        <IconSearch className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-text-faint" />
        <Input type="search" placeholder="Search..." className="ps-9" />
      </div>

      <div className="ms-auto flex items-center gap-1">
        <Popover>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="relative text-text-secondary"
                >
                  <IconBell className="size-4.5" />
                  <Badge className="absolute top-0.5 end-0.5 h-4 min-w-4 justify-center px-1 text-[10px]">
                    {NOTIFICATIONS.length}
                  </Badge>
                  <span className="sr-only">Notifications</span>
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="border-b px-4 py-3">
              <span className="font-semibold text-sm">Notifications</span>
            </div>
            <ul className="divide-y divide-border">
              {NOTIFICATIONS.map((notification) => (
                <li key={notification.title} className="flex items-start gap-3 px-4 py-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{notification.title}</p>
                    <p className="text-text-faint text-xs">{notification.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}
