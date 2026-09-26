import { IconCalendar } from '@tabler/icons-react'
import { format, type Locale } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar, defaultCalendarEndMonth, defaultCalendarStartMonth } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { TimeInput } from '@/components/ui/time-input'

type DateTimePickerProps = {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  datePlaceholder: string
  id?: string | undefined
  disabled?: boolean | undefined
  locale: Locale
  /** sr-only label for the time input — falls back to `datePlaceholder` when omitted. */
  timeLabel?: string | undefined
  /** When given, dates before it can't be picked in the calendar (e.g. an end-date
   * picker's lower bound is the start date) — a field-level guard, not a substitute for schema validation. */
  minDate?: Date | undefined
}

const DEFAULT_TIME = '09:00'

function mergeDateAndTime(datePart: Date, timeValue: string): Date {
  const [hours, minutes] = timeValue.split(':').map(Number)
  const merged = new Date(datePart)
  merged.setHours(hours ?? 0, minutes ?? 0, 0, 0)
  return merged
}

/** shadcn's "Date & Time Picker" recipe — `Calendar` + `TimeInput` in one `Popover`; picking a date doesn't close the popover, so the user can also set the time. */
export function DateTimePicker({
  value,
  onChange,
  datePlaceholder,
  id,
  disabled,
  locale,
  timeLabel,
  minDate,
}: DateTimePickerProps) {
  function handleDateSelect(date: Date | undefined) {
    if (!date) {
      onChange(undefined)
      return
    }
    onChange(mergeDateAndTime(date, value ? format(value, 'HH:mm') : DEFAULT_TIME))
  }

  function handleTimeChange(nextTime: string) {
    if (!value) return
    onChange(mergeDateAndTime(value, nextTime))
  }

  const timeDisabled = disabled || !value

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="ghost"
          disabled={disabled}
          className="h-[var(--control-md)] w-full justify-start gap-1.5 rounded-input border border-input bg-card px-3 font-normal"
        >
          <IconCalendar aria-hidden className="size-4.5 shrink-0 text-text-secondary" />
          <span className={cn('truncate', !value && 'text-muted-foreground')}>
            {value ? format(value, 'd MMM yyyy HH:mm', { locale }) : datePlaceholder}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto min-w-64 p-0">
        <Calendar
          mode="single"
          selected={value}
          {...(value !== undefined ? { defaultMonth: value } : {})}
          locale={locale}
          captionLayout="dropdown"
          startMonth={defaultCalendarStartMonth()}
          endMonth={defaultCalendarEndMonth()}
          onSelect={handleDateSelect}
          {...(minDate !== undefined ? { disabled: { before: minDate } } : {})}
        />
        {/* Time field is disabled until a date is picked; picking one assigns `DEFAULT_TIME` (09:00). */}
        <div className="border-t p-3">
          <TimeInput
            value={value ? format(value, 'HH:mm') : ''}
            onChange={handleTimeChange}
            disabled={timeDisabled}
            label={timeLabel ?? datePlaceholder}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
