import { IconCalendar, IconChevronDown, IconChevronUp, IconClock } from '@tabler/icons-react'
import { format, type Locale } from 'date-fns'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

type DateTimePickerProps = {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  datePlaceholder: string
  id?: string
  disabled?: boolean
  locale: Locale
  /**
   * Saat girişinin sr-only etiketi — 05-design-system.md'nin a11y asgari
   * şartı ("form alanı ↔ etiket ilişkisi") iki ayrı kontrol (tarih butonu +
   * saat girişi) için ayrı bir isim ister; bu prop listede yoktu ama
   * gerekliliği pazarlık konusu değil. Verilmezse `datePlaceholder`'a düşer
   * (screen reader'da tekrar eder ama etiketsiz kalmaz).
   */
  timeLabel?: string
}

const DEFAULT_TIME = '09:00'
type TimeSegment = 'hour' | 'minute'

function mergeDateAndTime(datePart: Date, timeValue: string): Date {
  const [hours, minutes] = timeValue.split(':').map(Number)
  const merged = new Date(datePart)
  merged.setHours(hours ?? 0, minutes ?? 0, 0, 0)
  return merged
}

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

type DigitBuffer = { text: string; lastAt: number }

type TimeSegmentInputProps = {
  value: number | undefined
  max: number
  disabled?: boolean
  elRef: React.RefObject<HTMLInputElement | null>
  onCommit: (next: number) => void
  onFocusSegment: () => void
  onOverflow: () => void
  onUnderflow: () => void
}

/**
 * Saat/dakika hanesi — native `<input type="time">`'ın tarayıcıya göre
 * değişen spinner/dropdown görünümü yerine, `otp-input.tsx`'teki hane
 * deseninin (her karakter kendi kutusunda, ok tuşu/backspace ile gezinme)
 * iki haneli sayısal sürümü. `type="text"` kullanıldığı için tarayıcı hiç
 * özel bir widget enjekte etmiyor — görünüm tamamen bizim class'larımızdan,
 * artı/eksi tuşları da (aşağıda `DateTimePicker` içinde) kendi ok
 * ikonlarımızla çiziliyor.
 *
 * Bir hane tek rakamla, o rakamın ikinci bir rakamla geçerli bir değer
 * kurup kuramayacağına göre anında ("6" dakika için 60-69 hep >59 olduğundan
 * hemen "06" olur) ya da ikinci rakamı bekleyerek ("2" saat için 20-23 geçerli
 * olduğundan bekler) kapanır — sonraki haneye otomatik geçiş bu kapanma anında olur.
 */
function TimeSegmentInput({
  value,
  max,
  disabled,
  elRef,
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

  // Klavye dışı giriş yolları (mobil sanal klavye, IME) için yedek — yukarıda
  // preventDefault edilen tuşlar DOM değerini hiç değiştirmediği için burada
  // tekrar işlenmez, sadece preventDefault'un yakalayamadığı yollar düşer.
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digit = e.target.value.replace(/\D/g, '').slice(-1)
    if (digit) typeDigit(digit)
  }

  return (
    <input
      ref={elRef}
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

/**
 * shadcn'in bilinen "Date & Time Picker" reçetesi — TEK `Popover` içinde
 * `Calendar` + saat girişi birlikte. `docs/05-design-system.md` bu tür
 * recipe'lerin (Date Picker/Combobox) kullanım noktasında kurulmasını
 * söyler; burada istisna — `date-range-picker.tsx`'teki gibi genel bir
 * altyapı ihtiyacı (insan kararı, ikinci tüketici gerekçesiyle aynı aile),
 * baştan `shared/ui/`'a kondu.
 *
 * `date-range-picker.tsx`'teki `SingleDatePicker` bir gün seçilince popover'ı
 * kapatır; burada YOK — saat de aynı popover içinde olduğu için kullanıcı
 * tarihi seçtikten sonra saati de ayarlayabilir. Kapanma yalnızca Radix'in
 * varsayılan dış tıklama/Esc davranışıyla olur.
 */
export function DateTimePicker({
  value,
  onChange,
  datePlaceholder,
  id,
  disabled,
  locale,
  timeLabel,
}: DateTimePickerProps) {
  const hourRef = useRef<HTMLInputElement>(null)
  const minuteRef = useRef<HTMLInputElement>(null)
  // Native `<input type="time">`'da tek bir yukarı/aşağı ok çifti, hangi
  // hane (saat/dakika) o an odaktaysa onu değiştirir. Aynı davranış burada
  // — hangi hane son odaklanan olduğunu tutuyor, aşağıdaki ok butonları ona uygular.
  const [activeSegment, setActiveSegment] = useState<TimeSegment>('hour')

  function handleDateSelect(date: Date | undefined) {
    if (!date) {
      onChange(undefined)
      return
    }
    onChange(mergeDateAndTime(date, value ? format(value, 'HH:mm') : DEFAULT_TIME))
  }

  function commitHour(nextHour: number) {
    if (!value) return
    onChange(mergeDateAndTime(value, `${pad2(nextHour)}:${pad2(value.getMinutes())}`))
  }

  function commitMinute(nextMinute: number) {
    if (!value) return
    onChange(mergeDateAndTime(value, `${pad2(value.getHours())}:${pad2(nextMinute)}`))
  }

  function focusAndSelect(ref: React.RefObject<HTMLInputElement | null>) {
    ref.current?.focus()
  }

  function step(direction: 1 | -1) {
    if (!value) return
    if (activeSegment === 'hour') {
      commitHour(wrap(value.getHours() + direction, 23))
      focusAndSelect(hourRef)
    } else {
      commitMinute(wrap(value.getMinutes() + direction, 59))
      focusAndSelect(minuteRef)
    }
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
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          {...(value !== undefined ? { defaultMonth: value } : {})}
          locale={locale}
          onSelect={handleDateSelect}
        />
        {/*
         * Tarih seçilmemişken saat alanı devre dışı — henüz bir `Date` yokken
         * saat değişikliğini "hangi güne" uygulayacağımız belirsiz kalırdı.
         * Tarih seçilir seçilmez `DEFAULT_TIME` (09:00) atanır ve alan açılır.
         *
         * Dıştan bakınca üstteki tetikleyici butonla aynı kalıp: tek
         * `h-[var(--control-md)]` kutu, solda ikon. Sağdaki ok çifti native
         * time input'un spinner'ının shadcn'e çevrilmiş hali — `aria-hidden`,
         * çünkü aynı işlev spinbutton hanelerinde ok tuşlarıyla zaten
         * klavyeden erişilebilir; bu butonlar salt fare için ek bir kısayol.
         */}
        <div className="border-t p-3">
          <div
            className={cn(
              'flex h-[var(--control-md)] items-stretch rounded-input border border-input bg-transparent shadow-xs transition-[color,box-shadow]',
              'has-[:focus-visible]:border-ring has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50',
              timeDisabled && 'opacity-50',
            )}
          >
            <fieldset className="m-0 flex flex-1 items-center gap-1.5 border-0 p-0 ps-3">
              <legend className="sr-only">{timeLabel ?? datePlaceholder}</legend>
              <IconClock aria-hidden className="size-4.5 shrink-0 text-text-secondary" />
              <div className="flex items-center gap-0.5">
                <TimeSegmentInput
                  elRef={hourRef}
                  value={value?.getHours()}
                  max={23}
                  disabled={timeDisabled}
                  onCommit={commitHour}
                  onFocusSegment={() => setActiveSegment('hour')}
                  onOverflow={() => focusAndSelect(minuteRef)}
                  onUnderflow={() => {
                    // İlk hane — geçilecek önceki bir alan yok.
                  }}
                />
                <span aria-hidden className="text-muted-foreground">
                  :
                </span>
                <TimeSegmentInput
                  elRef={minuteRef}
                  value={value?.getMinutes()}
                  max={59}
                  disabled={timeDisabled}
                  onCommit={commitMinute}
                  onFocusSegment={() => setActiveSegment('minute')}
                  onOverflow={() => {
                    // Son hane — geçilecek sonraki bir alan yok.
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
                disabled={timeDisabled}
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
                disabled={timeDisabled}
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
        </div>
      </PopoverContent>
    </Popover>
  )
}
