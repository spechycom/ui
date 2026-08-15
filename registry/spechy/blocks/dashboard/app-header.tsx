'use client'

import {
  IconBell,
  IconLogout,
  IconMenu2,
  IconSearch,
  IconSettings,
  IconUser,
} from '@tabler/icons-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'

type AppHeaderProps = {
  onOpenMobileMenu: () => void
}

export function AppHeader({ onOpenMobileMenu }: AppHeaderProps) {
  return (
    <header className="flex h-[var(--control-xl)] items-center gap-3 border-b bg-card px-4">
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

      <div className="relative max-w-sm flex-1">
        <IconSearch className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-text-faint" />
        <Input type="search" placeholder="Search..." className="ps-9" />
      </div>

      <div className="ms-auto flex items-center gap-2">
        <Button type="button" variant="ghost" size="icon" className="relative">
          <IconBell className="size-4.5" />
          <Badge className="absolute -top-1 -end-1 h-4.5 min-w-4.5 justify-center px-1 text-[10px]">
            3
          </Badge>
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <IconUser />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconSettings />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
