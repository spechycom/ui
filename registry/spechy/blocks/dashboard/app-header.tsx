'use client'

import {
  IconBook,
  IconBuilding,
  IconCalendar,
  IconChevronDown,
  IconInbox,
  IconMail,
  IconMenu2,
  IconMessage,
  IconPlus,
  IconTicket,
  IconUser,
} from '@tabler/icons-react'
import { Fragment, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { AppsGridPopover, UserStatusControl } from './app-header-tools'
import { NotificationsPopover } from './app-header-notifications'
import { GlobalSearchTrigger } from './app-header-search'

// "conversation" gerçek uygulamada canlı bir konuşma panelini aç/kapatır —
// burada sadece basılı görünüm (aria-pressed) ile taklit ediliyor.
const QUICK_ACTIONS = [
  { key: 'conversation', label: 'Conversations', icon: IconMessage, badge: 3 },
  { key: 'calendar', label: 'Calendar', icon: IconCalendar },
  { key: 'inbox', label: 'Inbox', icon: IconInbox },
  { key: 'knowledgeBase', label: 'Knowledge base', icon: IconBook },
] as const

// İlk üçü kayıt oluşturur, e-posta öncesinde ayırıcı var — tasarımdaki gibi.
const QUICK_ADD_ITEMS = [
  { key: 'contact', label: 'New contact', icon: IconUser },
  { key: 'company', label: 'New company', icon: IconBuilding },
  { key: 'ticket', label: 'New ticket', icon: IconTicket },
  { key: 'email', label: 'New email', icon: IconMail, separatorBefore: true },
] as const

function QuickActions() {
  const [activeKey, setActiveKey] = useState<string | null>(null)

  return (
    <div className="flex items-center gap-0.5">
      {QUICK_ACTIONS.map((action) => {
        const isConversation = action.key === 'conversation'
        const isActive = activeKey === action.key
        const Icon = action.icon

        return (
          <Tooltip key={action.key}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-pressed={isConversation ? isActive : undefined}
                onClick={isConversation ? () => setActiveKey(isActive ? null : action.key) : undefined}
                className={cn(
                  'relative text-text-secondary',
                  isConversation && isActive && 'bg-accent text-foreground',
                )}
              >
                <Icon stroke={1.75} />
                {'badge' in action && (
                  <span className="absolute top-1 end-1 flex size-3.5 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground tabular-nums">
                    {action.badge}
                  </span>
                )}
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
            className="h-9 gap-1.5 bg-surface-brand-subtle ps-2 pe-2.5 font-semibold text-[13px] text-primary tracking-[var(--tracking-tight)] hover:bg-primary/15 hover:text-primary"
          >
            <IconPlus stroke={2} />
            Quick add
            <IconChevronDown size={14} stroke={2} className="opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-59">
          {QUICK_ADD_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <Fragment key={item.key}>
                {'separatorBefore' in item ? <DropdownMenuSeparator /> : null}
                <DropdownMenuItem>
                  <Icon stroke={1.75} />
                  {item.label}
                </DropdownMenuItem>
              </Fragment>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function HeaderTools() {
  return (
    <div className="ms-auto flex shrink-0 items-center gap-1.5">
      <NotificationsPopover />
      <UserStatusControl />
      <GlobalSearchTrigger />
      <AppsGridPopover />
    </div>
  )
}

type AppHeaderProps = {
  onOpenMobileMenu: () => void
}

export function AppHeader({ onOpenMobileMenu }: AppHeaderProps) {
  return (
    <header className="flex h-[var(--control-xl)] shrink-0 items-center gap-0.5 border-b bg-card px-3.5">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="me-1 md:hidden"
        onClick={onOpenMobileMenu}
      >
        <IconMenu2 size={18} stroke={1.75} />
        <span className="sr-only">Open menu</span>
      </Button>
      <QuickActions />
      <HeaderTools />
    </header>
  )
}
