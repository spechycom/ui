'use client'

import { IconBuilding, IconSearch, IconTicket, IconUser } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

// Backend'de 3 karakterin altında arama reddediliyor — burada da aynı eşik
// korunuyor ki davranış birebir örtüşsün.
const MIN_SEARCH_LENGTH = 3

const QUICK_COMMANDS = [
  { key: 'contact', label: 'New contact', icon: IconUser, className: 'bg-info-50 text-info-700' },
  {
    key: 'company',
    label: 'New company',
    icon: IconBuilding,
    className: 'bg-success-50 text-success-700',
  },
  {
    key: 'ticket',
    label: 'New ticket',
    icon: IconTicket,
    className: 'bg-warning-50 text-warning-700',
  },
] as const

// Sonuçlar gerçek bir arama servisinden değil, sabit bir demo listesinden
// istemci tarafında filtreleniyor — block "sıfır iş mantığı" prensibiyle
// gerçek bir müşteri/şirket API'sine bağlanmaz.
const RESULTS = [
  { id: '1', type: 'customer' as const, name: 'Alex Johnson', detail: 'alex@acme.com' },
  { id: '2', type: 'customer' as const, name: 'Maria Garcia', detail: '+1 555 0134' },
  { id: '3', type: 'company' as const, name: 'Acme Inc.', detail: 'acme.com' },
  { id: '4', type: 'company' as const, name: 'Globex Corp.', detail: 'globex.com' },
]

const RESULT_ICON = { customer: IconUser, company: IconBuilding } as const
const RESULT_LABEL = { customer: 'Contact', company: 'Company' } as const

/** Mac'te ⌘K, diğerlerinde Ctrl+K gösterir. */
function useShortcutLabel() {
  const [isMac, setIsMac] = useState(false)
  useEffect(() => {
    setIsMac(navigator.userAgent.includes('Mac'))
  }, [])
  return isMac ? '⌘K' : 'Ctrl+K'
}

export function GlobalSearchTrigger() {
  const [isOpen, setOpen] = useState(false)
  const shortcut = useShortcutLabel()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return
      event.preventDefault()
      setOpen((open) => !open)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-text-secondary"
            onClick={() => setOpen(true)}
          >
            <IconSearch stroke={1.75} />
            <span className="sr-only">Search</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Search ({shortcut})</TooltipContent>
      </Tooltip>

      <GlobalSearchDialog open={isOpen} onOpenChange={setOpen} />
    </>
  )
}

function GlobalSearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [search, setSearch] = useState('')
  const shortcut = useShortcutLabel()

  useEffect(() => {
    if (!open) setSearch('')
  }, [open])

  const query = search.trim()
  const isTooShort = query.length > 0 && query.length < MIN_SEARCH_LENGTH
  const results = RESULTS.filter((result) =>
    result.name.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search"
      description="Search contacts, companies and more"
      className="rounded-panel sm:max-w-155"
      commandProps={{ shouldFilter: false }}
    >
      <CommandInput placeholder="Search..." value={search} onValueChange={setSearch} />
      <CommandList className="max-h-[52vh] p-2">
        {query.length === 0 ? (
          <CommandGroup heading={<span className="text-eyebrow">Quick actions</span>}>
            {QUICK_COMMANDS.map((command) => {
              const Icon = command.icon
              return (
                <CommandItem key={command.key} className="gap-2.5">
                  <span
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-lg',
                      command.className,
                    )}
                  >
                    <Icon stroke={1.75} className="text-current" />
                  </span>
                  <span className="font-medium">{command.label}</span>
                </CommandItem>
              )
            })}
          </CommandGroup>
        ) : isTooShort ? (
          <CommandEmpty>Keep typing — at least {MIN_SEARCH_LENGTH} characters</CommandEmpty>
        ) : results.length === 0 ? (
          <CommandEmpty>No results found.</CommandEmpty>
        ) : (
          results.map((result) => {
            const Icon = RESULT_ICON[result.type]
            return (
              <CommandItem key={`${result.type}-${result.id}`} value={result.name} className="gap-2.5">
                <Icon stroke={1.75} />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate">{result.name}</span>
                  <span className="truncate text-text-secondary text-xs">{result.detail}</span>
                </span>
                <Badge variant="secondary" className="shrink-0">
                  {RESULT_LABEL[result.type]}
                </Badge>
              </CommandItem>
            )
          })
        )}
      </CommandList>
      <div className="flex items-center gap-4 border-t bg-surface-subtle px-4 py-2.5 text-text-faint text-xs">
        <span className="flex items-center gap-1.5">
          <kbd className="rounded-[5px] border bg-card px-1.5 py-0.5 font-mono font-semibold text-[10.5px]">
            ↑↓
          </kbd>
          Navigate
        </span>
        <span className="flex items-center gap-1.5">
          <kbd className="rounded-[5px] border bg-card px-1.5 py-0.5 font-mono font-semibold text-[10.5px]">
            ↵
          </kbd>
          Select
        </span>
        <span className="ms-auto">Press {shortcut} to open</span>
      </div>
    </CommandDialog>
  )
}
