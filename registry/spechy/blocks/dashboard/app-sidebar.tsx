'use client'

import { IconCheck, IconCircleDot, IconSelector } from '@tabler/icons-react'
import { useState } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { ProfileMenu } from './app-profile-menu'
import { SidebarNav } from './app-sidebar-nav'

const WORKSPACE = { name: 'Acme Inc.', initials: 'AI' }

function BrandMark({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <span className="size-2.5 rounded-full bg-primary" />
      </span>
      {collapsed ? null : <span className="truncate font-semibold text-lg tracking-tight">Spechy</span>}
    </div>
  )
}

type AppSidebarProps = {
  pinned: boolean
  onPinnedChange?: (pinned: boolean) => void
  onNavigate?: () => void
  showToggle?: boolean
}

export function AppSidebar({
  pinned,
  onPinnedChange = () => {},
  onNavigate,
  showToggle = true,
}: AppSidebarProps) {
  const [hovering, setHovering] = useState(false)
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)

  // Pin kapalıysa sidebar yalnızca hover'dayken genişler (rail deseni).
  // Workspace ya da profil dropdown'ı açıkken de daralma engellenir — aksi
  // halde portal'da açık kalan menü, daralan layout'un altında görsel
  // olarak kopuk kalır. Mobil Sheet varyantında (showToggle=false) collapse
  // tamamen devre dışı.
  const collapsed = showToggle && !pinned && !hovering && !workspaceMenuOpen && !profileMenuOpen
  const toggleLabel = pinned ? 'Unpin sidebar' : 'Pin sidebar'

  const workspaceAvatar = (
    <Avatar className={cn('rounded-lg', collapsed ? 'size-6.5' : 'size-7')}>
      <AvatarFallback className="rounded-lg bg-primary font-bold text-primary-foreground text-xs">
        {WORKSPACE.initials}
      </AvatarFallback>
    </Avatar>
  )

  // JWT'de tek şirket var — liste her zaman tek öğeli, ama dropdown kabuğu
  // çoklu workspace'e taşınabilecek şekilde bugünden hazır.
  const workspaceMenuContent = (
    <DropdownMenuContent align="start" className="w-59">
      <p className="px-2 pt-1.5 pb-1 text-eyebrow text-text-faint">Select workspace</p>
      <DropdownMenuItem className="gap-2.5">
        {workspaceAvatar}
        <span className="min-w-0 flex-1 truncate">{WORKSPACE.name}</span>
        <IconCheck size={16} stroke={1.75} className="shrink-0 text-primary" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  )

  return (
    <aside
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={cn(
        'flex h-full flex-col border-e bg-card transition-[width] duration-200',
        collapsed ? 'w-16' : 'w-[264px]',
      )}
    >
      <div
        className={cn(
          'flex h-[var(--control-xl)] shrink-0 items-center border-b',
          collapsed ? 'justify-center px-2' : 'justify-between gap-2 ps-4 pe-3',
        )}
      >
        <BrandMark collapsed={collapsed} />
        {collapsed || !showToggle ? null : (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-pressed={pinned}
            onClick={() => onPinnedChange(!pinned)}
          >
            <IconCircleDot
              size={17}
              stroke={1.75}
              className={pinned ? 'text-primary' : 'text-text-secondary'}
            />
            <span className="sr-only">{toggleLabel}</span>
          </Button>
        )}
      </div>

      {collapsed ? (
        <div className="flex shrink-0 flex-col items-center gap-1.5 pt-3 pb-1">
          <DropdownMenu open={workspaceMenuOpen} onOpenChange={setWorkspaceMenuOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button type="button" variant="ghost" size="icon">
                    {workspaceAvatar}
                    <span className="sr-only">{WORKSPACE.name}</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">{WORKSPACE.name}</TooltipContent>
            </Tooltip>
            {workspaceMenuContent}
          </DropdownMenu>
        </div>
      ) : (
        <div className="shrink-0 px-3 pt-3.5 pb-1.5">
          <DropdownMenu open={workspaceMenuOpen} onOpenChange={setWorkspaceMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="h-12 w-full justify-between gap-2.5 rounded-control border bg-card px-2.5 shadow-xs"
              >
                <span className="flex min-w-0 items-center gap-2.5 overflow-hidden">
                  {workspaceAvatar}
                  <span className="flex min-w-0 flex-col items-start">
                    <span className="truncate text-sm tracking-[var(--tracking-tight)]">
                      {WORKSPACE.name}
                    </span>
                    <span className="truncate font-medium text-[11px] text-text-secondary">
                      Workspace
                    </span>
                  </span>
                </span>
                <IconSelector size={16} stroke={1.75} className="shrink-0 text-text-faint" />
              </Button>
            </DropdownMenuTrigger>
            {workspaceMenuContent}
          </DropdownMenu>
        </div>
      )}

      <SidebarNav collapsed={collapsed} onNavigate={onNavigate} />

      <ProfileMenu collapsed={collapsed} onOpenChange={setProfileMenuOpen} />
    </aside>
  )
}
