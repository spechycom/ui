'use client'

import { type ReactNode, useState } from 'react'

import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'

import { AppFooter } from './app-footer'
import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'

type AppLayoutProps = {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="grid h-dvh grid-cols-1 overflow-hidden md:grid-cols-[auto_1fr]">
      <div className="hidden md:block">
        <AppSidebar />
      </div>

      <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Open menu</SheetTitle>
          <AppSidebar />
        </SheetContent>
      </Sheet>

      <div className="grid min-h-0 grid-rows-[auto_1fr_auto]">
        <AppHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="min-h-0 overflow-y-auto p-6">{children}</main>
        <AppFooter />
      </div>
    </div>
  )
}
