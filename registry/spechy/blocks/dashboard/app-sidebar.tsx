'use client'

import {
  type Icon,
  IconChartBar,
  IconCheck,
  IconChevronDown,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutDashboard,
  IconMessage,
  IconSelector,
  IconSettings,
  IconSettings2,
  IconUserCog,
  IconUsers,
} from '@tabler/icons-react'
import { useState } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

import { AppProfileMenu } from './app-profile-menu'

type NavLeaf = { label: string; icon: Icon; href: string }
type NavGroup = { label: string; icon: Icon; children: NavLeaf[] }
type NavItem = NavLeaf | NavGroup

function isGroup(item: NavItem): item is NavGroup {
  return 'children' in item
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: IconLayoutDashboard, href: '#' },
  { label: 'Contacts', icon: IconUsers, href: '#' },
  { label: 'Messages', icon: IconMessage, href: '#' },
  { label: 'Analytics', icon: IconChartBar, href: '#' },
  {
    label: 'Settings',
    icon: IconSettings,
    children: [
      { label: 'General', icon: IconSettings2, href: '#' },
      { label: 'Team', icon: IconUserCog, href: '#' },
    ],
  },
]

const ACTIVE_LABEL = 'Dashboard'

const WORKSPACES = [
  { name: 'Acme Inc.', initials: 'AI' },
  { name: 'Globex Corp.', initials: 'GC' },
] as const

function NavIcon({ icon: IconComponent }: { icon: Icon }) {
  return <IconComponent className="size-4.5 shrink-0" />
}

function NavLink({
  item,
  collapsed,
  active,
}: {
  item: NavLeaf
  collapsed: boolean
  active: boolean
}) {
  const link = (
    <a
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-2.5 rounded-control px-2.5 text-sm font-medium transition-colors',
        collapsed ? 'size-10 justify-center px-0' : 'h-10',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-text-secondary hover:bg-accent hover:text-accent-foreground',
      )}
    >
      <NavIcon icon={item.icon} />
      <span className={cn('truncate', collapsed && 'sr-only')}>{item.label}</span>
    </a>
  )

  if (!collapsed) return link

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  )
}

function NavGroupRow({ item, collapsed }: { item: NavGroup; collapsed: boolean }) {
  const [open, setOpen] = useState(false)

  // Daraltılmış (icon-rail) modda alt menüyü açacak yer yok — grup başlığı
  // sadece ikon + tooltip olarak görünür, tıklanamaz.
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="mx-auto flex size-10 items-center justify-center rounded-control text-text-secondary">
            <NavIcon icon={item.icon} />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex h-10 w-full items-center gap-2.5 rounded-control px-2.5 text-sm font-medium text-text-secondary hover:bg-accent hover:text-accent-foreground">
        <NavIcon icon={item.icon} />
        <span className="flex-1 truncate text-start">{item.label}</span>
        <IconChevronDown
          className={cn('size-4 shrink-0 transition-transform', open && 'rotate-180')}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-0.5 py-0.5 ps-8">
        {item.children.map((child) => (
          <a
            key={child.label}
            href={child.href}
            className="flex h-9 items-center gap-2.5 rounded-control px-2.5 text-sm text-text-secondary hover:bg-accent hover:text-accent-foreground"
          >
            <NavIcon icon={child.icon} />
            <span className="truncate">{child.label}</span>
          </a>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

function WorkspaceSwitcher({ collapsed }: { collapsed: boolean }) {
  const [activeName, setActiveName] = useState<string>(WORKSPACES[0].name)
  const active = WORKSPACES.find((workspace) => workspace.name === activeName) ?? WORKSPACES[0]

  return (
    <div className={cn('shrink-0 p-3', collapsed && 'flex justify-center px-2')}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className={cn(
              'h-12 w-full gap-2.5 rounded-control border bg-card px-2.5 shadow-xs',
              collapsed ? 'justify-center' : 'justify-between',
            )}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              <Avatar size="sm" className="rounded-lg">
                <AvatarFallback className="rounded-lg bg-primary font-bold text-primary-foreground">
                  {active.initials}
                </AvatarFallback>
              </Avatar>
              {collapsed ? (
                <span className="sr-only">{active.name}</span>
              ) : (
                <span className="truncate text-sm font-medium">{active.name}</span>
              )}
            </span>
            {collapsed ? null : (
              <IconSelector className="size-4 shrink-0 text-text-faint" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-60">
          <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
          {WORKSPACES.map((workspace) => (
            <DropdownMenuItem key={workspace.name} onSelect={() => setActiveName(workspace.name)}>
              <Avatar size="sm" className="rounded-lg">
                <AvatarFallback className="rounded-lg bg-primary font-bold text-primary-foreground">
                  {workspace.initials}
                </AvatarFallback>
              </Avatar>
              <span className="min-w-0 flex-1 truncate">{workspace.name}</span>
              {workspace.name === active.name && (
                <IconCheck className="size-4 shrink-0 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        'flex h-full flex-col border-e bg-card transition-[width]',
        isCollapsed ? 'w-16' : 'w-64',
      )}
    >
      <div
        className={cn(
          'flex h-[var(--control-xl)] shrink-0 items-center border-b',
          isCollapsed ? 'justify-center px-2' : 'gap-2 px-4',
        )}
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-control bg-primary text-sm font-semibold text-primary-foreground">
          D
        </div>
        {isCollapsed ? null : <span className="truncate text-sm font-semibold">Dashboard</span>}
      </div>

      <WorkspaceSwitcher collapsed={isCollapsed} />

      <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 pb-2">
        {NAV_ITEMS.map((item) =>
          isGroup(item) ? (
            <NavGroupRow key={item.label} item={item} collapsed={isCollapsed} />
          ) : (
            <NavLink
              key={item.label}
              item={item}
              collapsed={isCollapsed}
              active={item.label === ACTIVE_LABEL}
            />
          ),
        )}
      </nav>

      <div className="flex shrink-0 justify-center border-t p-2">
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

      <AppProfileMenu collapsed={isCollapsed} />
    </div>
  )
}
