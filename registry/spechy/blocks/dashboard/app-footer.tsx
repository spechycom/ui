'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

// Gerçek uygulamada build-time inject edilen sürüm/commit bilgisi — block'ta
// sabit demo değerleri.
const APP_VERSION = '1.4.0'
const GIT_SHA = 'a1b2c3d'
const CURRENT_USER = { id: 128, companyId: 42 }

const CONNECTION_STATUS = 'connected' as 'connected' | 'connecting' | 'disconnected'

const CONNECTION_DOT_CLASS = {
  connected: 'bg-status-online',
  connecting: 'bg-status-away',
  disconnected: 'bg-status-offline',
} as const

const CONNECTION_LABEL = {
  connected: 'Connected',
  connecting: 'Connecting…',
  disconnected: 'Disconnected',
} as const

/** Alanlar arası ince ayırıcı — tasarımdaki soluk nokta yerine 11px mono'da aynı işi gören bir çizgi. */
function Dot() {
  return <span aria-hidden="true" className="h-2.5 w-px shrink-0 bg-current opacity-30" />
}

export function AppFooter() {
  const [now, setNow] = useState<Date | null>(null)

  // Saniyelik saat — yalnızca görüntü amaçlı, sunucu/istemci ilk render
  // uyuşmazlığı olmasın diye mount sonrası set edilir.
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <footer className="flex h-[30px] shrink-0 items-center gap-2.5 overflow-hidden border-t bg-card px-3.5 font-medium font-mono text-[11px] text-text-faint whitespace-nowrap">
      <span className="flex min-w-0 items-center gap-2.5 overflow-hidden">
        <span>
          v{APP_VERSION} ({GIT_SHA})
        </span>
        <Dot />
        <span className="truncate">uid: {CURRENT_USER.id}</span>
        <Dot />
        <span className="truncate">cid: {CURRENT_USER.companyId}</span>
      </span>
      <span className="ms-auto flex shrink-0 items-center gap-2">
        <span className="flex items-center gap-1.5">
          <span className={cn('size-1.5 rounded-full', CONNECTION_DOT_CLASS[CONNECTION_STATUS])} />
          {CONNECTION_LABEL[CONNECTION_STATUS]}
        </span>
        <Dot />
        <span suppressHydrationWarning>
          {now?.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) ??
            '—'}
        </span>
        <Dot />
        <span className="text-text-secondary" suppressHydrationWarning>
          {now?.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }) ??
            '—'}
        </span>
      </span>
    </footer>
  )
}
