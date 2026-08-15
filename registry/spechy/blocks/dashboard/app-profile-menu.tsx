'use client'

import {
  IconChevronRight,
  IconDeviceDesktop,
  IconLogout,
  IconMoon,
  IconPencil,
  IconSun,
} from '@tabler/icons-react'
import { useState } from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import { cn } from '@/lib/utils'

const THEMES = [
  { value: 'light', label: 'Light', icon: IconSun },
  { value: 'dark', label: 'Dark', icon: IconMoon },
  { value: 'system', label: 'System', icon: IconDeviceDesktop },
] as const

// Bayrak SVG'leri yerine emoji — marka/hukuk gerektiren tam bayrak asseti
// olmadan dil seçiciyi göstermenin en kısa yolu.
const LOCALES = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'tr', label: 'Türkçe', flag: '🇹🇷' },
] as const

const CURRENT_USER = { name: 'Jane Doe', email: 'jane@company.com', initials: 'JD' }

type AppProfileMenuProps = {
  collapsed?: boolean
  onOpenChange?: (open: boolean) => void
}

// Sidebar'ın altına sabitlenen hesap menüsü. Sidebar dar (icon-rail) haldeyken
// sadece avatar görünür, isim/e-posta sr-only kalır. `onOpenChange` menü
// açıkken sidebar'ın daralmasını engellemek için AppSidebar'a iletilir —
// aksi halde açık dropdown, kapanan sidebar'ın altında görsel olarak kopar.
export function ProfileMenu({ collapsed = false, onOpenChange = () => {} }: AppProfileMenuProps) {
  const { theme, setTheme } = useTheme()
  const [locale, setLocale] = useState<(typeof LOCALES)[number]['value']>('en')
  const activeTheme = THEMES.find((option) => option.value === theme) ?? THEMES[2]
  const activeLocale = LOCALES.find((option) => option.value === locale) ?? LOCALES[0]

  return (
    <div className="shrink-0 border-t px-3 py-2.5">
      <DropdownMenu onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className={cn(
              'h-auto w-full gap-2.5 p-2',
              collapsed ? 'justify-center' : 'justify-start',
            )}
          >
            <Avatar className="size-8 shrink-0">
              <AvatarFallback>{CURRENT_USER.initials}</AvatarFallback>
            </Avatar>
            {collapsed ? (
              <span className="sr-only">Account menu</span>
            ) : (
              <>
                <span className="flex min-w-0 flex-1 flex-col text-start">
                  <span className="truncate font-semibold text-[13px] tracking-[var(--tracking-tight)]">
                    {CURRENT_USER.name}
                  </span>
                  <span className="truncate font-normal text-[11.5px] text-text-secondary">
                    {CURRENT_USER.email}
                  </span>
                </span>
                <IconChevronRight size={15} stroke={1.75} className="shrink-0 text-text-faint" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" side="right" className="w-64 p-1.5">
          <DropdownMenuLabel className="flex items-center gap-2.5 px-2 pt-2 pb-3">
            <Avatar className="size-10 shrink-0">
              <AvatarFallback>{CURRENT_USER.initials}</AvatarFallback>
            </Avatar>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate font-semibold text-sm tracking-[var(--tracking-tight)]">
                {CURRENT_USER.name}
              </span>
              <span className="truncate font-normal text-text-secondary text-xs">
                {CURRENT_USER.email}
              </span>
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span className="flex-1 text-start">Theme</span>
              <span className="text-text-secondary text-xs">{activeTheme.label}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-40 p-1.5">
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) => setTheme(value as Theme)}
              >
                {THEMES.map((option) => {
                  const Icon = option.icon
                  return (
                    <DropdownMenuRadioItem key={option.value} value={option.value} className="gap-2.5">
                      <Icon stroke={1.75} className="shrink-0 text-text-secondary" />
                      <span className="flex-1">{option.label}</span>
                    </DropdownMenuRadioItem>
                  )
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <span className="flex-1 text-start">Language</span>
              <span className="text-text-secondary text-xs">{activeLocale.label}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-40 p-1.5">
              <DropdownMenuRadioGroup
                value={locale}
                onValueChange={(value) => setLocale(value as (typeof LOCALES)[number]['value'])}
              >
                {LOCALES.map((option) => (
                  <DropdownMenuRadioItem key={option.value} value={option.value} className="gap-2.5">
                    <span aria-hidden="true">{option.flag}</span>
                    <span className="flex-1">{option.label}</span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <IconPencil size={16} stroke={1.75} />
            Edit profile
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            <IconLogout size={16} stroke={1.75} />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
