import { IconChevronDown, IconChevronUp, IconClock } from '@tabler/icons-react'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

type TimeSegment = 'hour' | 'minute'

function pad2(n: number): string {
  return n.toString().padStart(2, '0')
}

function clamp(n: number, max: number): number {
  return Math.min(max, Math.max(0, n))
}

function wrap(n: number, max: number): number {
  if (n < 0) return max
  if (n > max) return 0
  return n
}

/** `'HH:mm'` ⇄ digit values — an invalid/empty string leaves both digits `undefined` (shown as `--`). */
function parseTimeValue(value: string): { hour: number | undefined; minute: number | undefined } {
  const match = /^(\d{2}):(\d{2})$/.exec(value)
  if (!match) return { hour: undefined, minute: undefined }
  const hour = Number(match[1])
  const minute = Number(match[2])
  if (hour > 23 || minute > 59) return { hour: undefined, minute: undefined }
  return { hour, minute }
}

type DigitBuffer = { text: string; lastAt: number }

type TimeSegmentInputProps = {
  value: number | undefined
  max: number
  disabled?: boolean | undefined
  elRef: React.RefObject<HTMLInputElement | null>
  id?: string | undefined
  onCommit: (next: number) => void
  onFocusSegment: () => void
  onOverflow: () => void
  onUnderflow: () => void
}

/** Hour/minute digit — a two-digit numeric variant of the digit pattern in `otp-input.tsx`, used instead of the browser's native `time` widget. */
function TimeSegmentInput({
  value,
  max,
  disabled,
  elRef,
  id,
  onCommit,
  onFocusSegment,
  onOverflow,
  onUnderflow,
}: TimeSegmentInputProps) {
  const bufferRef = useRef<DigitBuffer>({ text: '', lastAt: 0 })
  const firstDigitMax = Math.floor(max / 10)

  function typeDigit(digit: string) {
    const now = Date.now()
    const fresh = now - bufferRef.current.lastAt > 1000
    const typed = (fresh ? '' : bufferRef.current.text) + digit
    const capped = typed.length > 2 ? digit : typed
    const done = capped.length === 2 || Number(capped) > firstDigitMax
    bufferRef.current = { text: done ? '' : capped, lastAt: now }
    onCommit(clamp(Number(capped), max))
    if (done) onOverflow()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (value === undefined) return
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      onCommit(wrap(value + 1, max))
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      onCommit(wrap(value - 1, max))
      return
    }
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (bufferRef.current.text === '') {
        onUnderflow()
      } else {
        bufferRef.current = { text: '', lastAt: 0 }
        onCommit(0)
      }
      return
    }
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault()
      typeDigit(e.key)
    }
  }

  // Fallback for non-keyboard input paths (mobile virtual keyboard, IME).
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digit = e.target.value.replace(/\D/g, '').slice(-1)
    if (digit) typeDigit(digit)
  }

  return (
    <input
      ref={elRef}
      id={id}
      type="text"
      inputMode="numeric"
      role="spinbutton"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={value === undefined ? undefined : pad2(value)}
      disabled={disabled}
      value={value === undefined ? '--' : pad2(value)}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={(e) => {
        onFocusSegment()
        e.currentTarget.select()
      }}
      className="w-6 bg-transparent text-center text-sm text-foreground outline-none tabular-nums selection:bg-primary selection:text-primary-foreground disabled:cursor-not-allowed"
    />
  )
}

type TimeInputProps = {
  /** `'HH:mm'` — an empty/invalid string shows both digits as blank (`--`). */
  value: string
  onChange: (value: string) => void
  id?: string | undefined
  disabled?: boolean | undefined
  /** sr-only label for the time input. */
  label: string
}

/** Hour/minute digit input, used instead of the browser's native `<input type="time">` (native date/time inputs were deliberately rejected for inconsistent rendering/UX). Same code as `DateTimePicker`'s time segment. */
export function TimeInput({ value, onChange, id, disabled, label }: TimeInputProps) {
  const hourRef = useRef<HTMLInputElement>(null)
  const minuteRef = useRef<HTMLInputElement>(null)
  // Whichever digit was last focused is the one the arrow buttons below apply to.
  const [activeSegment, setActiveSegment] = useState<TimeSegment>('hour')
  const { hour, minute } = parseTimeValue(value)

  function commitHour(nextHour: number) {
    onChange(`${pad2(nextHour)}:${pad2(minute ?? 0)}`)
  }

  function commitMinute(nextMinute: number) {
    onChange(`${pad2(hour ?? 0)}:${pad2(nextMinute)}`)
  }

  function focusAndSelect(ref: React.RefObject<HTMLInputElement | null>) {
    ref.current?.focus()
  }

  function step(direction: 1 | -1) {
    if (activeSegment === 'hour') {
      commitHour(wrap((hour ?? 0) + direction, 23))
      focusAndSelect(hourRef)
    } else {
      commitMinute(wrap((minute ?? 0) + direction, 59))
      focusAndSelect(minuteRef)
    }
  }

  return (
    <div
      className={cn(
        'flex h-[var(--control-md)] items-stretch rounded-input border border-input bg-transparent shadow-xs transition-[color,box-shadow]',
        'has-[:focus-visible]:border-ring has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50',
        disabled && 'opacity-50',
      )}
    >
      <fieldset
        className="m-0 flex flex-1 items-center gap-1.5 border-0 p-0 ps-3"
        disabled={disabled}
      >
        <legend className="sr-only">{label}</legend>
        <IconClock aria-hidden className="size-4.5 shrink-0 text-text-secondary" />
        <div className="flex items-center gap-0.5">
          <TimeSegmentInput
            id={id}
            elRef={hourRef}
            value={hour}
            max={23}
            disabled={disabled}
            onCommit={commitHour}
            onFocusSegment={() => setActiveSegment('hour')}
            onOverflow={() => focusAndSelect(minuteRef)}
            onUnderflow={() => {
              // First digit — there's no previous field to move to.
            }}
          />
          <span aria-hidden className="text-muted-foreground">
            :
          </span>
          <TimeSegmentInput
            elRef={minuteRef}
            value={minute}
            max={59}
            disabled={disabled}
            onCommit={commitMinute}
            onFocusSegment={() => setActiveSegment('minute')}
            onOverflow={() => {
              // Last digit — there's no next field to move to.
            }}
            onUnderflow={() => focusAndSelect(hourRef)}
          />
        </div>
      </fieldset>
      <div className="flex flex-col border-input border-s">
        <button
          type="button"
          aria-hidden
          tabIndex={-1}
          disabled={disabled}
          onClick={() => step(1)}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'h-1/2 w-6 min-h-0 rounded-none rounded-se-[8px] p-0 text-muted-foreground',
          )}
        >
          <IconChevronUp className="size-3" />
        </button>
        <button
          type="button"
          aria-hidden
          tabIndex={-1}
          disabled={disabled}
          onClick={() => step(-1)}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'h-1/2 w-6 min-h-0 rounded-none rounded-ee-[8px] p-0 text-muted-foreground',
          )}
        >
          <IconChevronDown className="size-3" />
        </button>
      </div>
    </div>
  )
}
