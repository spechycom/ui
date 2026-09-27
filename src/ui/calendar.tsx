import { IconChevronDown, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import * as React from 'react'
import {
  type DayButton,
  DayPicker,
  type DropdownProps,
  getDefaultClassNames,
} from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Shared default window for every caller with a month/year dropdown (DatePicker,
// DateTimePicker, DateRangePicker): 100 years back (so a distant date like a birthday
// is a few clicks away) to 10 years forward. Callers can narrow it via startMonth/endMonth.
const DEFAULT_YEARS_BACK = 100
const DEFAULT_YEARS_FORWARD = 10

function defaultCalendarStartMonth(): Date {
  const now = new Date()
  return new Date(now.getFullYear() - DEFAULT_YEARS_BACK, 0, 1)
}

function defaultCalendarEndMonth(): Date {
  const now = new Date()
  return new Date(now.getFullYear() + DEFAULT_YEARS_FORWARD, 11, 31)
}

// Uses this package's own Select (Radix-based) instead of a native <select> for
// react-day-picker's month/year caption — native selects render inconsistently across
// browsers inside a Popover. The year list has 100+ items but doesn't need search:
// Radix's `position="item-aligned"` default already scrolls the selected year into view
// on open, so a combobox search box would be unnecessary complexity here.
function CalendarDropdown({ options, value, onChange, disabled, ...props }: DropdownProps) {
  const selected = options?.find((option) => option.value === value)

  function handleValueChange(nextValue: string) {
    onChange?.({
      target: { value: nextValue },
    } as React.ChangeEvent<HTMLSelectElement>)
  }

  return (
    <Select
      onValueChange={handleValueChange}
      {...(value !== undefined ? { value: value.toString() } : {})}
      {...(disabled !== undefined ? { disabled } : {})}
    >
      <SelectTrigger size="sm" aria-label={props['aria-label']} className="h-8 text-sm">
        <SelectValue>{selected?.label}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options?.map((option) => (
          <SelectItem key={option.value} value={option.value.toString()} disabled={option.disabled}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant']
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'group/calendar bg-background p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
        // Nav arrow RTL mirroring is left to the global `tabler-icon-*` rule in
        // theme.css — mirroring it again here would cancel that out.
        className,
      )}
      captionLayout={captionLayout}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn('relative flex flex-col gap-4 md:flex-row', defaultClassNames.months),
        month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
        nav: cn(
          'absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1',
          defaultClassNames.nav,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) p-0 select-none aria-disabled:opacity-50',
          defaultClassNames.button_previous,
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) p-0 select-none aria-disabled:opacity-50',
          defaultClassNames.button_next,
        ),
        month_caption: cn(
          'flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)',
          defaultClassNames.month_caption,
        ),
        // `relative z-10` is required: `nav` (prev/next month buttons) spans the whole
        // caption row with `absolute inset-x-0` and, being positioned, paints on top of
        // the static caption — its transparent area was swallowing clicks meant for the
        // month/year triggers. react-day-picker's own native <select> didn't have this
        // problem (it's `absolute inset-0`); swapping it for a real `Select` left the
        // triggers stuck underneath `nav`.
        dropdowns: cn(
          'relative z-10 flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium',
          defaultClassNames.dropdowns,
        ),
        // dropdown_root/dropdown: where react-day-picker's default Dropdown hides its
        // native <select> and paints a fake control over it — unused now that
        // `CalendarDropdown` renders a real `Select` instead.
        caption_label: cn('text-sm font-medium select-none', defaultClassNames.caption_label),
        month_grid: cn('w-full border-collapse', defaultClassNames.month_grid),
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'flex-1 rounded-md text-[0.8rem] font-normal text-muted-foreground select-none',
          defaultClassNames.weekday,
        ),
        week: cn('mt-2 flex w-full', defaultClassNames.week),
        week_number_header: cn('w-(--cell-size) select-none', defaultClassNames.week_number_header),
        week_number: cn(
          'text-[0.8rem] text-muted-foreground select-none',
          defaultClassNames.week_number,
        ),
        day: cn(
          'group/day relative aspect-square h-full w-full p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-e-md',
          props.showWeekNumber
            ? '[&:nth-child(2)[data-selected=true]_button]:rounded-s-md'
            : '[&:first-child[data-selected=true]_button]:rounded-s-md',
          defaultClassNames.day,
        ),
        range_start: cn('rounded-s-md bg-accent', defaultClassNames.range_start),
        range_middle: cn('rounded-none', defaultClassNames.range_middle),
        range_end: cn('rounded-e-md bg-accent', defaultClassNames.range_end),
        today: cn(
          'rounded-md bg-accent text-accent-foreground data-[selected=true]:rounded-none',
          defaultClassNames.today,
        ),
        outside: cn(
          'text-muted-foreground aria-selected:text-muted-foreground',
          defaultClassNames.outside,
        ),
        disabled: cn('text-muted-foreground opacity-50', defaultClassNames.disabled),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return <IconChevronLeft className={cn('size-4', className)} {...props} />
          }

          if (orientation === 'right') {
            return <IconChevronRight className={cn('size-4', className)} {...props} />
          }

          return <IconChevronDown className={cn('size-4', className)} {...props} />
        },
        DayButton: CalendarDayButton,
        Dropdown: CalendarDropdown,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 data-[range-end=true]:rounded-md data-[range-end=true]:rounded-e-md data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:rounded-md data-[range-start=true]:rounded-s-md data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground dark:hover:text-accent-foreground [&>span]:text-xs [&>span]:opacity-70',
        defaultClassNames.day,
        className,
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton, defaultCalendarEndMonth, defaultCalendarStartMonth }
