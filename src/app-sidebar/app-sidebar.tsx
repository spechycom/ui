import { IconCircleDot } from '@tabler/icons-react'
import type { ComponentType, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { ProfileMenu, type ProfileMenuProps } from './profile-menu'

const PINNED_STORAGE_KEY = 'spechy-ui:sidebar-pinned'

function readStoredPinned(): boolean {
  if (typeof window === 'undefined') return true
  return window.localStorage.getItem(PINNED_STORAGE_KEY) !== 'false'
}

export type AppSidebarIcon = ComponentType<{ className?: string; size?: number; stroke?: number }>

export type AppSidebarNavItem = {
  href: string
  label: string
  icon?: AppSidebarIcon
  active?: boolean
}

export type AppSidebarLinkProps = {
  href: string
  className?: string
  children: ReactNode
  onClick?: (() => void) | undefined
  'aria-current'?: 'page' | undefined
}

export type AppSidebarLabels = {
  pinSidebar?: string
  unpinSidebar?: string
} & ProfileMenuProps['labels']

export const DEFAULT_APP_SIDEBAR_LABELS: Required<
  Pick<AppSidebarLabels, 'pinSidebar' | 'unpinSidebar'>
> = {
  pinSidebar: 'Pin sidebar',
  unpinSidebar: 'Unpin sidebar',
}

export type AppSidebarProps = {
  logo: ReactNode
  productName: string
  items: AppSidebarNavItem[]
  user: ProfileMenuProps['user']
  profileActions?: ProfileMenuProps['profileActions']
  languages?: ProfileMenuProps['languages']
  language?: ProfileMenuProps['language']
  onLanguageChange?: ProfileMenuProps['onLanguageChange']
  labels?: AppSidebarLabels
  /** Defaults to a plain `<a href>` — pass your router's Link to integrate client-side routing. */
  renderLink?: (props: AppSidebarLinkProps) => ReactNode
  onNavigate?: (() => void) | undefined
  className?: string
}

function DefaultLink({ href, className, children, onClick, ...rest }: AppSidebarLinkProps) {
  return (
    <a href={href} className={className} onClick={onClick} {...rest}>
      {children}
    </a>
  )
}

/**
 * Product sidebar: collapsible + pinnable nav rail, logo/product name up top,
 * `ProfileMenu` (theme + language + custom actions) pinned to the bottom.
 * Collapse state persists to `localStorage`. Bring your own `items`, `user`
 * and `renderLink` (for a router Link) — this component owns no routing,
 * i18n, or workspace state.
 */
export function AppSidebar({
  logo,
  productName,
  items,
  user,
  profileActions,
  languages,
  language,
  onLanguageChange,
  labels,
  renderLink = DefaultLink,
  onNavigate,
  className,
}: AppSidebarProps) {
  const resolvedLabels = { ...DEFAULT_APP_SIDEBAR_LABELS, ...labels }
  const [pinned, setPinned] = useState(readStoredPinned)
  const [hovering, setHovering] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const collapsed = !pinned && !hovering && !menuOpen

  useEffect(() => {
    window.localStorage.setItem(PINNED_STORAGE_KEY, String(pinned))
  }, [pinned])

  const toggleLabel = pinned ? resolvedLabels.unpinSidebar : resolvedLabels.pinSidebar

  return (
    <TooltipProvider>
      <aside
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={cn(
          'flex h-full flex-col border-e bg-card transition-[width] duration-200',
          collapsed ? 'w-16' : 'w-64',
          className,
        )}
      >
        <div
          className={cn(
            'flex h-14 shrink-0 items-center border-b',
            collapsed ? 'justify-center px-2' : 'justify-between gap-2 ps-4 pe-3',
          )}
        >
          {collapsed ? (
            <span className="flex size-6 items-center justify-center">{logo}</span>
          ) : (
            <span className="flex items-center gap-2 font-semibold text-sm">
              {logo}
              {productName}
            </span>
          )}
          {collapsed ? null : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={toggleLabel}
                  aria-pressed={pinned}
                  onClick={() => setPinned((prev) => !prev)}
                  className="inline-flex size-8 items-center justify-center rounded-control text-text-secondary hover:bg-accent hover:text-accent-foreground"
                >
                  <IconCircleDot size={17} stroke={1.75} className={pinned ? 'text-primary' : undefined} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">{toggleLabel}</TooltipContent>
            </Tooltip>
          )}
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-2">
          <ul className="space-y-0.5">
            {items.map((item) => (
              <li key={item.href}>
                <NavLink item={item} collapsed={collapsed} onNavigate={onNavigate} renderLink={renderLink} />
              </li>
            ))}
          </ul>
        </nav>

        <ProfileMenu
          collapsed={collapsed}
          user={user}
          profileActions={profileActions}
          languages={languages}
          language={language}
          onLanguageChange={onLanguageChange}
          labels={resolvedLabels}
          onOpenChange={setMenuOpen}
        />
      </aside>
    </TooltipProvider>
  )
}

function NavLink({
  item,
  collapsed,
  onNavigate,
  renderLink,
}: {
  item: AppSidebarNavItem
  collapsed: boolean
  onNavigate: (() => void) | undefined
  renderLink: (props: AppSidebarLinkProps) => ReactNode
}) {
  const Icon = item.icon
  const link = renderLink({
    href: item.href,
    onClick: onNavigate,
    'aria-current': item.active ? 'page' : undefined,
    className: cn(
      'flex h-10 items-center gap-2.5 rounded-control px-2.5 text-sm transition-colors',
      collapsed && 'justify-center px-0',
      item.active
        ? 'bg-accent font-medium text-accent-foreground'
        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
    ),
    children: (
      <>
        {Icon ? <Icon size={18} stroke={1.75} /> : null}
        <span className={cn('truncate', collapsed && 'sr-only')}>{item.label}</span>
      </>
    ),
  })

  if (!collapsed) return link

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  )
}
