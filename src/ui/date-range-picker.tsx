import { IconCalendar } from '@tabler/icons-react'
import { format, type Locale, parseISO } from 'date-fns'
import { useId, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar, defaultCalendarEndMonth, defaultCalendarStartMonth } from '@/components/ui/calendar'
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

/** `yyyy-MM-dd` ⇄ `Date` — uses `parseISO`; `new Date(str)` can shift by timezone. */
function parseDateValue(value: string): Date | undefined {
  if (value === '') return undefined
  const parsed = parseISO(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

/** shadcn's "Date Picker" recipe (`Popover` + `Calendar`) — a picker for a single end, rendered borderless since the outer `DateRangePicker` carries its own border. */
function SingleDatePicker({
  id,
  value,
  onChange,
  placeholder,
  locale,
  defaultMonth,
}: {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  locale: Locale
  defaultMonth?: Date | undefined
}) {
  const [open, setOpen] = useState(false)
  const selected = parseDateValue(value)
  const month = selected ?? defaultMonth

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
      <PopoverContent align="start" className="w-auto min-w-64 p-0">
        <Calendar
          mode="single"
          selected={selected}
          {...(month !== undefined ? { defaultMonth: month } : {})}
          locale={locale}
          captionLayout="dropdown"
          startMonth={defaultCalendarStartMonth()}
          endMonth={defaultCalendarEndMonth()}
          onSelect={(date) => {
            onChange(date ? format(date, 'yyyy-MM-dd') : '')
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

/** Swaps the two ends when `from > to` — the calendars don't constrain each other (free selection), so an inverted range is normalized here in one place. */
function normalizeRange(value: DateRangeValue): DateRangeValue {
  if (value.from !== '' && value.to !== '' && value.from > value.to) {
    return { from: value.to, to: value.from }
  }
  return value
}

/** Two `SingleDatePicker`s side by side with an en dash between — reads as one "range" control even though they're two independent popovers. */
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
      // bg-card: keeps its own surface over a gray toolbar strip; bg-transparent would let the gray bleed through.
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
        onChange={(from) => onChange(normalizeRange({ ...value, from }))}
        placeholder={fromPlaceholder}
        locale={locale}
        defaultMonth={parseDateValue(value.to)}
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
        onChange={(to) => onChange(normalizeRange({ ...value, to }))}
        placeholder={toPlaceholder}
        locale={locale}
        defaultMonth={parseDateValue(value.from)}
      />
    </div>
  )
}
