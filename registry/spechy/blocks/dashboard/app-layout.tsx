'use client'

import { type ReactNode, useState } from 'react'

import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/hooks/use-theme'

import { AppFooter } from './app-footer'
import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'

type AppLayoutProps = {
  children: ReactNode
}

// Sıfır iş mantığı: yönlendirme, veri çekme yok — sayfa içeriği `children`
// olarak geçilir. Kendi router'ınıza bağlamak (aktif nav linki, sayfa geçiş
// animasyonu tetikleyicisi vb.) size kalır.
export function AppLayout({ children }: AppLayoutProps) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [pinned, setPinned] = useState(true)

  return (
    // ThemeProvider burada sarılıyor ki blok kurulur kurulmaz profil
    // menüsündeki tema seçici gerçekten çalışsın (dark mode kurulum sonrası
    // "hazır" gelsin). Uygulamanızda dashboard dışında sayfalar da varsa
    // (ör. auth block'undaki login sayfası) ve onlarda da tema senkron
    // olsun istiyorsanız ThemeProvider'ı buradan çıkarıp app kökünüze taşıyın.
    //
    // Tooltip primitifi kendi provider'ını sarmıyor — sidebar ve header'daki
    // tüm tooltip'ler bu tek provider'ı paylaşır.
    <ThemeProvider>
      <TooltipProvider>
        <div className="grid h-dvh grid-cols-1 overflow-hidden md:grid-cols-[auto_1fr]">
          <div className="hidden md:block">
            <AppSidebar pinned={pinned} onPinnedChange={setPinned} />
          </div>

          <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent side="left" className="w-[264px] p-0">
              <SheetTitle className="sr-only">Open menu</SheetTitle>
              <AppSidebar
                pinned={true}
                onNavigate={() => setMobileMenuOpen(false)}
                showToggle={false}
              />
            </SheetContent>
          </Sheet>

          <div className="grid min-h-0 grid-rows-[auto_1fr_auto]">
            <AppHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />
            <main className="min-h-0 overflow-y-auto p-6">
              <div className="animate-rise">{children}</div>
            </main>
            <AppFooter />
          </div>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  )
}
