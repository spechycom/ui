import { IconChevronRight, IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react'
import type { ComponentType } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Theme, useTheme } from '@/hooks/use-theme'
import { cn, initials } from '@/lib/utils'

const THEME_OPTIONS: { value: Theme; icon: ComponentType<{ className?: string; stroke?: number }> }[] = [
  { value: 'light', icon: IconSun },
  { value: 'dark', icon: IconMoon },
  { value: 'system', icon: IconDeviceDesktop },
]

export type ProfileMenuUser = {
  /** Omit when the product has no display name for this account (e.g. an email-only admin user)
   * — the email then renders once, on its own line, instead of showing it twice. */
  name?: string
  email: string
  avatarUrl?: string
}

export type ProfileMenuAction = {
  label: string
  onClick?: () => void
  href?: string
  icon?: ComponentType<{ className?: string; size?: number; stroke?: number }>
  variant?: 'default' | 'destructive'
}

export type ProfileMenuLanguageOption = {
  value: string
  label: string
}

export type ProfileMenuLabels = {
  profileMenu?: string
  theme?: string
  themeLight?: string
  themeDark?: string
  themeSystem?: string
  language?: string
}

const DEFAULT_LABELS: Required<ProfileMenuLabels> = {
  profileMenu: 'Profile menu',
  theme: 'Theme',
  themeLight: 'Light',
  themeDark: 'Dark',
  themeSystem: 'System',
  language: 'Language',
}

export type ProfileMenuProps = {
  collapsed: boolean
  user: ProfileMenuUser
  profileActions?: ProfileMenuAction[]
  languages?: ProfileMenuLanguageOption[]
  language?: string
  onLanguageChange?: (value: string) => void
  labels?: ProfileMenuLabels
  onOpenChange?: (open: boolean) => void
}

export function ProfileMenu({
  collapsed,
  user,
  profileActions = [],
  languages = [],
  language,
  onLanguageChange,
  labels,
  onOpenChange,
}: ProfileMenuProps) {
  const resolvedLabels = { ...DEFAULT_LABELS, ...labels }
  const { theme, setTheme } = useTheme()
  const activeLanguage = languages.find((candidate) => candidate.value === language) ?? languages[0]

  return (
    <div className="shrink-0 border-t px-3 py-2.5">
      <DropdownMenu onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            aria-label={resolvedLabels.profileMenu}
            className={cn('h-auto w-full gap-2.5 p-2', collapsed ? 'justify-center' : 'justify-start')}
          >
            <Avatar className="shrink-0">
              {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
              <AvatarFallback>{initials(user.name || user.email)}</AvatarFallback>
            </Avatar>
            {collapsed ? null : (
              <>
                <span className="flex min-w-0 flex-1 flex-col text-start">
                  {user.name ? (
                    <>
                      <span className="truncate font-semibold text-[13px]">{user.name}</span>
                      <span className="truncate text-[11.5px] text-text-secondary">{user.email}</span>
                    </>
                  ) : (
                    <span className="truncate font-semibold text-[13px]">{user.email}</span>
                  )}
                </span>
                <IconChevronRight size={15} stroke={1.75} className="shrink-0 text-text-faint" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" side="right" className="w-64 p-1.5">
          <DropdownMenuLabel className="flex items-center gap-2.5 px-2 pt-2 pb-3">
            <Avatar size="lg" className="shrink-0">
              {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
              <AvatarFallback>{initials(user.name || user.email)}</AvatarFallback>
            </Avatar>
            <span className="flex min-w-0 flex-col gap-0.5">
              {user.name ? (
                <>
                  <span className="truncate font-semibold text-sm">{user.name}</span>
                  <span className="truncate text-text-secondary text-xs">{user.email}</span>
                </>
              ) : (
                <span className="truncate font-semibold text-sm">{user.email}</span>
              )}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span className="flex-1 text-start">{resolvedLabels.theme}</span>
              <span className="text-text-secondary text-xs">
                {resolvedLabels[`theme${capitalize(theme)}` as 'themeLight' | 'themeDark' | 'themeSystem']}
              </span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-40 p-1.5">
              <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)}>
                {THEME_OPTIONS.map((option) => {
                  const Icon = option.icon
                  return (
                    <DropdownMenuRadioItem
                      key={option.value}
                      value={option.value}
                      className="gap-2.5"
                      onSelect={(event) => event.preventDefault()}
                    >
                      <Icon stroke={1.75} className="shrink-0 text-text-secondary" />
                      <span className="flex-1">
                        {resolvedLabels[`theme${capitalize(option.value)}` as 'themeLight' | 'themeDark' | 'themeSystem']}
                      </span>
                    </DropdownMenuRadioItem>
                  )
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {languages.length > 0 ? (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="flex-1 text-start">{resolvedLabels.language}</span>
                <span className="text-text-secondary text-xs">{activeLanguage?.label}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-40 p-1.5">
                <DropdownMenuRadioGroup value={language} onValueChange={(value) => onLanguageChange?.(value)}>
                  {languages.map((option) => (
                    <DropdownMenuRadioItem
                      key={option.value}
                      value={option.value}
                      className="gap-2.5"
                      onSelect={(event) => event.preventDefault()}
                    >
                      <span className="flex-1">{option.label}</span>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ) : null}

          {profileActions.length > 0 ? (
            <>
              <DropdownMenuSeparator />
              {profileActions.map((action) => {
                const Icon = action.icon
                return (
                  <DropdownMenuItem
                    key={action.label}
                    variant={action.variant}
                    onSelect={action.onClick}
                    {...(action.href ? { asChild: true } : {})}
                  >
                    {action.href ? (
                      <a href={action.href}>
                        {Icon ? <Icon size={16} stroke={1.75} /> : null}
                        {action.label}
                      </a>
                    ) : (
                      <>
                        {Icon ? <Icon size={16} stroke={1.75} /> : null}
                        {action.label}
                      </>
                    )}
                  </DropdownMenuItem>
                )
              })}
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function capitalize<T extends string>(value: T): Capitalize<T> {
  return (value.charAt(0).toUpperCase() + value.slice(1)) as Capitalize<T>
}
