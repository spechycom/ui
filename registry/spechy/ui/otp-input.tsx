import type * as React from 'react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

type OtpInputProps = {
  id?: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  length?: number
  disabled?: boolean
  className?: string
}

function OtpInput({ id, value, onChange, onBlur, length = 6, disabled, className }: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])

  function updateDigit(index: number, raw: string) {
    const digit = raw.replace(/\D/g, '').slice(-1)
    const chars = value.split('')
    chars[index] = digit
    onChange(chars.join('').slice(0, length))
    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    onChange(pasted)
    inputsRef.current[Math.min(pasted.length, length - 1)]?.focus()
  }

  return (
    <div className={cn('flex gap-2.5', className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          // biome-ignore lint/suspicious/noArrayIndexKey: OTP kutuları sabit uzunlukta, sıra hiç değişmez
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el
          }}
          id={index === 0 ? id : undefined}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          disabled={disabled}
          value={value[index] ?? ''}
          onChange={(e) => updateDigit(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onBlur={onBlur}
          className="h-12 w-12 rounded-input border border-input bg-transparent text-center font-medium text-foreground text-lg shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </div>
  )
}

export { OtpInput }
