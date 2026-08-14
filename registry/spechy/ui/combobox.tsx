import { IconCheck, IconChevronDown, IconX, type TablerIcon } from '@tabler/icons-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export type ComboboxOption = { value: string; label: string; icon?: TablerIcon }

type ComboboxProps = {
  id?: string
  /** `null` = seçim yok. Sayısal değerli alanlar `String()`/`Number()` ile sınırda çevirir — Radix `Select`'in kendi kuralı, burada da aynı. */
  value: string | null
  onChange: (value: string) => void
  options: ComboboxOption[]
  /** Seçim yokken trigger'da görünen metin. */
  placeholder: string
  /** Arama kutusu placeholder'ı. */
  searchPlaceholder: string
  /** Arama sonuç vermeyince dropdown'da gösterilir. */
  emptyLabel: string
  disabled?: boolean
  /** `Button`'ın kendi `size` varyantı — sayfa boyutu seçici gibi kompakt yerler için `sm`. */
  size?: 'default' | 'sm'
  className?: string
  /**
   * Verilirse VE bir seçim varken, trigger'ın sonundaki ok yerine bir "X"
   * ikonu görünür — tıklanınca (dropdown açılmadan) `onClear` çağrılır.
   * Yoksa hiç clear affordance'ı yok — alan zorunlu kalır (native
   * `<select>`'in davranışı, filter-panel'in `ComboboxFilterField`'ı gibi
   * HER ZAMAN temizlenebilir olan filtre alanlarından farklı). Önceki
   * tasarım (dropdown içinde metin satırı "temizle") insan geri bildirimiyle
   * kaldırıldı — bir liste öğesi gibi görünüp asıl "seçimi kaldır" niyetini
   * gizliyordu.
   */
  clearLabel?: string
  onClear?: () => void
}

/**
 * Tek seçim standardı (ADR-0025), filter-panel dışına genelleştirilmiş hali
 * — `filter-panel.tsx`'in `ComboboxField`'ıyla aynı iskelet (Popover + cmdk),
 * ama react-hook-form formlarında (ReminderForm, ReportingTab,
 * SpeechToTextTab, TicketSettingsTab, `DataTablePagination`) doğrudan
 * kullanılabilir — `FieldSection`'a ya da `FilterField` tipine bağlı değil.
 * ADR-0025 bunu "ilk gerçek form tüketicisi çıktığında" ayrıştırmayı
 * öngörmüştü (bkz. o ADR'nin "Alternatifler" bölümü) — bugün 6 tüketici
 * birden çıktı, `ComboboxField` de bunun üzerine ince bir sarmalayıcıya
 * indirgendi (tek kaynak, iki kopya değil).
 */
export function Combobox({
  id,
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
  emptyLabel,
  disabled,
  size = 'default',
  className,
  clearLabel,
  onClear,
}: ComboboxProps) {
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.value === value)
  const showClear = Boolean(selected && onClear)

  function select(next: string) {
    onChange(next)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          size={size}
          className={cn('w-full justify-between font-normal', className)}
        >
          <span className={cn('truncate', !selected && 'text-muted-foreground')}>
            {selected ? selected.label : placeholder}
          </span>
          {showClear ? (
            // Gerçek `<button>` — trigger `Button`'ın içinde iç içe duruyor
            // (görsel olarak kasıtlı), `stopPropagation` olmadan tıklama hem
            // temizler hem popover'ı açardı. Native buton Enter/Space'i
            // kendisi ele alır, ayrı bir `onKeyDown` gerekmez.
            <button
              type="button"
              aria-label={clearLabel}
              onClick={(event) => {
                event.stopPropagation()
                onClear?.()
              }}
              className="-m-1 shrink-0 rounded-full p-1 text-text-secondary hover:bg-accent hover:text-foreground"
            >
              <IconX className="size-4" />
            </button>
          ) : (
            <IconChevronDown className="size-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyLabel}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  keywords={[option.label]}
                  onSelect={() => select(option.value)}
                >
                  {option.icon ? (
                    <option.icon className="size-4 shrink-0 text-text-secondary" />
                  ) : null}
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {/* Memory: seçili öğe işareti her zaman sağda. */}
                  {value === option.value ? (
                    <IconCheck className="size-4 shrink-0 text-primary" />
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
