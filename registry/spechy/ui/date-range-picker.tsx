import { IconCalendar } from '@tabler/icons-react'
import { format, type Locale, parseISO } from 'date-fns'
import { useId, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export type DateRangeValue = { from: string; to: string }

type DateRangePickerProps = {
  value: DateRangeValue
  onChange: (value: DateRangeValue) => void
  fromPlaceholder: string
  toPlaceholder: string
  locale: Locale
  className?: string
}

/** `yyyy-MM-dd` ⇄ `Date` — `parseISO` kullanılır, `new Date(str)` timezone'a göre kaydırabilir. */
function parseDateValue(value: string): Date | undefined {
  if (value === '') return undefined
  const parsed = parseISO(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

/**
 * shadcn'in resmi "Date Picker" reçetesi (`Popover` + `Calendar`) — tek bir
 * ucun seçicisi. `docs/05-design-system.md`e göre bu tür recipe'ler normalde
 * kullanım noktasında kurulur, `shared/ui/`'a taşınmaz; burada istisna:
 * ikinci gerçek tüketici (Reminders'ın toolbar filtresi) çıktığı için
 * `<DataTableWithToolbarFilters>`'ın ihtiyacına göre baştan reusable yazıldı
 * (insan kararı). `variant="chip"` kenarlıksız/dolgusuz render eder — dıştaki
 * kapsayıcı (bkz. `DateRangePicker`) kendi kenarlığını taşıdığında iç içe
 * çift çerçeve oluşmasın diye.
 */
function SingleDatePicker({
  id,
  value,
  onChange,
  placeholder,
  bound,
  locale,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  /** Karşı uçtaki değer — `from`'un seçici olarak `to`'yu, `to`'nun `from`'u sınırlaması için. */
  bound: { side: 'min' | 'max'; value: string }
  locale: Locale
}) {
  const [open, setOpen] = useState(false)
  const selected = parseDateValue(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="ghost"
          className="h-auto min-w-0 justify-start gap-1.5 px-1 py-0 font-normal"
        >
          <span className={cn('truncate', selected === undefined && 'text-muted-foreground')}>
            {selected ? format(selected, 'd MMM yyyy', { locale }) : placeholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selected}
          {...(selected !== undefined ? { defaultMonth: selected } : {})}
          locale={locale}
          disabled={(date) => {
            const day = format(date, 'yyyy-MM-dd')
            return bound.side === 'min' ? day < bound.value : day > bound.value
          }}
          onSelect={(date) => {
            onChange(date ? format(date, 'yyyy-MM-dd') : '')
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

/**
 * İki `SingleDatePicker` yan yana + aralarında en dash — tek bir "aralık"
 * kontrolü gibi okunur, ikisi bağımsız açılır/kapanır popover'lar. Takvim
 * ikonu + kenarlık kendi üzerinde durur; içerideki tetikleyici butonlar
 * kenarlıksız (bkz. `SingleDatePicker`), çift çerçeve olmasın.
 */
export function DateRangePicker({
  value,
  onChange,
  fromPlaceholder,
  toPlaceholder,
  locale,
  className,
}: DateRangePickerProps) {
  const fromId = useId()
  const toId = useId()

  return (
    <div
      // bg-card: gri bir toolbar şeridi üstünde (bkz. DataTableWithToolbarFilters)
      // kendi beyaz/kart zeminini korur — bg-transparent olsaydı arkadaki gri sızardı.
      className={cn(
        'flex h-[var(--control-md)] items-center gap-1.5 rounded-input border border-input bg-card px-3',
        className,
      )}
    >
      <IconCalendar aria-hidden className="size-4.5 shrink-0 text-text-secondary" />
      <Label htmlFor={fromId} className="sr-only">
        {fromPlaceholder}
      </Label>
      <SingleDatePicker
        id={fromId}
        value={value.from}
        onChange={(from) => onChange({ ...value, from })}
        placeholder={fromPlaceholder}
        bound={{ side: 'max', value: value.to === '' ? '9999-12-31' : value.to }}
        locale={locale}
      />
      <span aria-hidden className="text-text-secondary">
        –
      </span>
      <Label htmlFor={toId} className="sr-only">
        {toPlaceholder}
      </Label>
      <SingleDatePicker
        id={toId}
        value={value.to}
        onChange={(to) => onChange({ ...value, to })}
        placeholder={toPlaceholder}
        bound={{ side: 'min', value: value.from === '' ? '0001-01-01' : value.from }}
        locale={locale}
      />
    </div>
  )
}
