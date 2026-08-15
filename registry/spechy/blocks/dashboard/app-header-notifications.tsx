'use client'

import {
  IconAlertOctagon,
  IconAlertTriangle,
  IconBell,
  IconChecks,
  IconInfoCircle,
} from '@tabler/icons-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type NotificationLevel = 'info' | 'warning' | 'critical'

type Notification = {
  id: string
  level: NotificationLevel
  title: string
  message: string
  time: string
  unread: boolean
}

// Seviye başına ikon + renk — gerçek uygulamada bir bildirim türü kodundan
// (backend sözleşmesi) türetiliyor, burada doğrudan sabit veriye gömülü.
const LEVEL_ICON: Record<NotificationLevel, typeof IconInfoCircle> = {
  info: IconInfoCircle,
  warning: IconAlertOctagon,
  critical: IconAlertTriangle,
}

const LEVEL_COLOR_CLASS: Record<NotificationLevel, string> = {
  info: 'bg-info-50 text-info-700 dark:bg-info-500/15 dark:text-info-200',
  warning: 'bg-danger-50 text-danger-700 dark:bg-danger-500/15 dark:text-danger-200',
  critical: 'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-200',
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    level: 'info',
    title: 'New message from Alex',
    message: 'Hey, do you have a minute to review the latest proposal?',
    time: '2m ago',
    unread: true,
  },
  {
    id: '2',
    level: 'critical',
    title: 'Payment failed for Acme Inc.',
    message: 'The card on file was declined — the customer has been notified.',
    time: '38m ago',
    unread: true,
  },
  {
    id: '3',
    level: 'warning',
    title: 'Ticket #128 is overdue',
    message: 'SLA response window closes in 15 minutes.',
    time: '1h ago',
    unread: false,
  },
  {
    id: '4',
    level: 'info',
    title: 'Weekly report is ready',
    message: 'Your team’s performance summary for last week is available.',
    time: 'Yesterday',
    unread: false,
  },
]

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const unreadCount = notifications.filter((notification) => notification.unread).length

  function markAsRead(id: string) {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, unread: false } : notification,
      ),
    )
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, unread: false })))
  }

  return (
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
              <IconBell stroke={1.75} />
              {unreadCount > 0 && (
                <Badge className="absolute top-0.5 end-0.5 h-4 min-w-4 justify-center px-1 text-[11px] tabular-nums">
                  {unreadCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Notifications</TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-92 rounded-panel p-0">
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-sm tracking-[var(--tracking-tight)]">
              Notifications
            </span>
            {unreadCount > 0 && (
              <span className="text-[11px] text-text-faint">{unreadCount} unread</span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              type="button"
              variant="outline"
              size="xs"
              className="shrink-0 rounded-full text-text-secondary hover:text-primary"
              onClick={markAllAsRead}
            >
              <IconChecks stroke={1.75} />
              Mark all read
            </Button>
          )}
        </div>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <IconBell className="size-6 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">You&apos;re all caught up</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <ul className="divide-y divide-border">
              {notifications.map((notification) => {
                const Icon = LEVEL_ICON[notification.level]
                return (
                  <li key={notification.id}>
                    <button
                      type="button"
                      onClick={() => markAsRead(notification.id)}
                      className="flex w-full cursor-pointer items-start gap-3 px-4 py-2.5 text-start transition-colors outline-none hover:bg-accent focus-visible:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                      <span
                        className={cn(
                          'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full',
                          LEVEL_COLOR_CLASS[notification.level],
                        )}
                      >
                        <Icon size={16} stroke={1.75} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p
                            className={cn(
                              'truncate text-sm',
                              notification.unread ? 'font-semibold' : 'font-medium',
                            )}
                          >
                            {notification.title}
                          </p>
                          <span className="flex shrink-0 items-center gap-1.5">
                            {notification.unread && (
                              <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
                            )}
                            <span className="whitespace-nowrap text-[11px] text-text-faint">
                              {notification.time}
                            </span>
                          </span>
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-muted-foreground text-xs leading-relaxed">
                          {notification.message}
                        </p>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  )
}
