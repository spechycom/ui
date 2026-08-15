'use client'

import {
  type Icon,
  IconAddressBook,
  IconAdjustments,
  IconBell,
  IconBuilding,
  IconBuildingStore,
  IconChevronRight,
  IconHome,
  IconPackage,
  IconSettings,
  IconTicket,
} from '@tabler/icons-react'
import { type ReactElement, useState } from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type LeafNavItem = { href: string; icon: Icon; label: string }
type GroupNavItem = { icon: Icon; label: string; children: NavItem[] }
type NavItem = LeafNavItem | GroupNavItem

function isGroup(item: NavItem): item is GroupNavItem {
  return 'children' in item
}

// Menü backend izin listesinden üretilene kadar burada sabit — block'ta
// zaten hep sabit kalır, kendi projenizde kendi route'larınızla değiştirin.
const NAV_ITEMS: NavItem[] = [
  { href: '#', icon: IconHome, label: 'Home' },
  { href: '#', icon: IconAddressBook, label: 'Contacts' },
  { href: '#', icon: IconBuilding, label: 'Companies' },
  { href: '#', icon: IconBell, label: 'Reminders' },
  { href: '#', icon: IconTicket, label: 'Tickets' },
  { href: '#', icon: IconPackage, label: 'Products' },
  { href: '#', icon: IconBuildingStore, label: 'Marketplace' },
  {
    icon: IconSettings,
    label: 'Settings',
    children: [{ href: '#', icon: IconAdjustments, label: 'Customization' }],
  },
]

const ACTIVE_HREF = '#home'

/** Daraltılmış (icon-rail) modda tooltip'e sarar, aksi halde olduğu gibi döner. */
function MaybeTooltip({
  collapsed,
  label,
  children,
}: {
  collapsed: boolean
  label: string
  children: ReactElement
}) {
  if (!collapsed) return children

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}

function NavLink({
  item,
  collapsed,
  depth,
  onNavigate,
}: {
  item: LeafNavItem
  collapsed: boolean
  depth: number
  onNavigate?: (() => void) | undefined
}) {
  const active = item.href === ACTIVE_HREF
  const Icon = item.icon

  return (
    <MaybeTooltip collapsed={collapsed} label={item.label}>
      <a
        href={item.href}
        onClick={onNavigate}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex items-center rounded-control text-sm tracking-[var(--tracking-tight)] transition-colors',
          collapsed
            ? 'mx-auto size-10 justify-center'
            : cn('h-10 gap-2.5 px-2.5', depth > 0 && 'ps-8'),
          active
            ? 'bg-surface-brand-subtle font-semibold text-primary'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground',
        )}
      >
        <Icon size={18} stroke={1.75} />
        <span className={cn('truncate', collapsed && 'sr-only')}>{item.label}</span>
      </a>
    </MaybeTooltip>
  )
}

function NavGroup({
  item,
  collapsed,
  depth,
  onNavigate,
}: {
  item: GroupNavItem
  collapsed: boolean
  depth: number
  onNavigate?: (() => void) | undefined
}) {
  // Grup, içinde aktif bir route varsa varsayılan olarak açık başlar.
  const [open, setOpen] = useState(() =>
    item.children.some((child) => !isGroup(child) && child.href === ACTIVE_HREF),
  )
  const Icon = item.icon

  // Daraltılmış rail modda accordion anlamsız — sadece ikon + tooltip, tıklanamaz.
  if (collapsed) {
    return (
      <MaybeTooltip collapsed={collapsed} label={item.label}>
        <div className="mx-auto flex size-10 items-center justify-center rounded-control text-sm tracking-[var(--tracking-tight)] text-muted-foreground">
          <Icon size={18} stroke={1.75} />
          <span className="sr-only">{item.label}</span>
        </div>
      </MaybeTooltip>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className={cn(
          'flex h-10 w-full cursor-pointer items-center gap-2.5 rounded-control px-2.5 text-sm tracking-[var(--tracking-tight)] text-muted-foreground hover:bg-accent hover:text-foreground',
          depth > 0 && 'ps-8',
        )}
      >
        <Icon size={18} stroke={1.75} />
        <span className="truncate">{item.label}</span>
        <IconChevronRight
          size={16}
          stroke={1.75}
          className={cn('ms-auto shrink-0 transition-transform', open && 'rotate-90')}
        />
      </button>
      {open && (
        <ul className="space-y-0.5">
          {item.children.map((child) => (
            <li key={child.label}>
              <NavItemRow item={child} collapsed={collapsed} depth={depth + 1} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function NavItemRow({
  item,
  collapsed,
  depth,
  onNavigate,
}: {
  item: NavItem
  collapsed: boolean
  depth: number
  onNavigate?: (() => void) | undefined
}) {
  return isGroup(item) ? (
    <NavGroup item={item} collapsed={collapsed} depth={depth} onNavigate={onNavigate} />
  ) : (
    <NavLink item={item} collapsed={collapsed} depth={depth} onNavigate={onNavigate} />
  )
}

type SidebarNavProps = {
  collapsed: boolean
  onNavigate?: (() => void) | undefined
}

export function SidebarNav({ collapsed, onNavigate }: SidebarNavProps) {
  return (
    <nav className={cn('min-h-0 flex-1 overflow-y-auto px-3 pb-2', collapsed ? 'pt-1.5' : 'pt-1')}>
      {!collapsed && (
        <p className="px-2.5 pt-2 pb-1.5 text-eyebrow text-text-faint">Menu</p>
      )}
      <ul className="space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <li key={item.label}>
            <NavItemRow item={item} collapsed={collapsed} depth={0} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
    </nav>
  )
}
