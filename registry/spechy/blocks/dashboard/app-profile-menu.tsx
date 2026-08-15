'use client'

import {
  IconChevronRight,
  IconDeviceDesktop,
  IconLogout,
  IconMoon,
  IconSettings,
  IconSun,
  IconUser,
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
import { cn } from '@/lib/utils'

const THEMES = [
  { value: 'light', label: 'Light', icon: IconSun },
  { value: 'dark', label: 'Dark', icon: IconMoon },
  { value: 'system', label: 'System', icon: IconDeviceDesktop },
] as const

type AppProfileMenuProps = {
  collapsed?: boolean
}

// Sidebar'ın altına sabitlenen hesap menüsü — avatar + isim/e-posta,
// tema seçimi (alt menü) ve çıkış. Sidebar dar (icon-rail) haldeyken
// sadece avatar görünür, isim/e-posta sr-only kalır.
export function AppProfileMenu({ collapsed = false }: AppProfileMenuProps) {
  const [theme, setTheme] = useState<(typeof THEMES)[number]['value']>('system')
  const activeTheme = THEMES.find((option) => option.value === theme) ?? THEMES[2]

  return (
    <div className="shrink-0 border-t p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className={cn(
              'h-auto w-full gap-2.5 p-2',
              collapsed ? 'justify-center' : 'justify-start',
            )}
          >
            <Avatar className="shrink-0">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            {collapsed ? (
              <span className="sr-only">Account menu</span>
            ) : (
              <>
                <span className="flex min-w-0 flex-1 flex-col text-start">
                  <span className="truncate text-sm font-semibold">Jane Doe</span>
                  <span className="truncate text-text-secondary text-xs">jane@company.com</span>
                </span>
                <IconChevronRight className="size-4 shrink-0 text-text-faint" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" side="right" className="w-64">
          <DropdownMenuLabel className="flex items-center gap-2.5 px-2 pt-2 pb-3 font-normal">
            <Avatar size="lg" className="shrink-0">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-sm font-semibold">Jane Doe</span>
              <span className="truncate text-text-secondary text-xs">jane@company.com</span>
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <IconUser />
            Edit profile
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <IconSettings />
              <span className="flex-1">Theme</span>
              <span className="text-text-secondary text-xs">{activeTheme.label}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-40">
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) => setTheme(value as (typeof THEMES)[number]['value'])}
              >
                {THEMES.map((option) => {
                  const OptionIcon = option.icon
                  return (
                    <DropdownMenuRadioItem key={option.value} value={option.value}>
                      <OptionIcon />
                      <span className="flex-1">{option.label}</span>
                    </DropdownMenuRadioItem>
                  )
                })}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <IconLogout />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
