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
import { OptionAvatar } from '@/components/ui/option-avatar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export type ComboboxOption = {
  value: string
  label: string
  icon?: TablerIcon
  /** Initials badge for options representing a person/team — mutually exclusive with `icon`. */
  avatarLabel?: string
}

type ComboboxProps = {
  id?: string
  /** `null` = no selection; numeric fields convert with `String()`/`Number()` at the boundary. */
  value: string | null
  onChange: (value: string) => void
  options: ComboboxOption[]
  /** Text shown in the trigger when nothing is selected. */
  placeholder: string
  /** Search box placeholder. */
  searchPlaceholder: string
  /** Shown in the dropdown when search yields no results. */
  emptyLabel: string
  disabled?: boolean
  /** `Button`'s own `size` variant — `sm` for compact spots like a page-size selector. */
  size?: 'default' | 'sm'
  className?: string
  /** When given and something is selected, an "X" icon replaces the arrow at the end of the trigger and calls `onClear` on click. */
  clearLabel?: string
  onClear?: () => void
}

/** The single-select standard — every consumer wraps this component. */
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
          <span
            className={cn(
              'flex min-w-0 items-center gap-2 truncate',
              !selected && 'text-muted-foreground',
            )}
          >
            {selected?.avatarLabel ? <OptionAvatar label={selected.avatarLabel} /> : null}
            <span className="truncate">{selected ? selected.label : placeholder}</span>
          </span>
          {showClear ? (
            // Without stopPropagation, the click would both clear and open the popover.
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
                  {option.avatarLabel ? (
                    <OptionAvatar label={option.avatarLabel} />
                  ) : option.icon ? (
                    <option.icon className="size-4 shrink-0 text-text-secondary" />
                  ) : null}
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {/* Selected-item mark always sits at the end. */}
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
