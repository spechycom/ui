import { IconEye, IconEyeOff } from '@tabler/icons-react'
import type * as React from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

interface PasswordInputProps extends React.ComponentProps<'input'> {
  /** Görünür/gizle butonunun aria-label'ı. Projenizde i18n varsa t('...') ile geçin. */
  showLabel?: string
  hideLabel?: string
}

function PasswordInput({
  className,
  showLabel = 'Show password',
  hideLabel = 'Hide password',
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input type={visible ? 'text' : 'password'} className={cn('pe-10', className)} {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? hideLabel : showLabel}
        className="absolute inset-y-0 end-0 flex w-10 items-center justify-center text-muted-foreground hover:text-foreground"
      >
        {visible ? <IconEyeOff className="size-[18px]" /> : <IconEye className="size-[18px]" />}
      </button>
    </div>
  )
}

export { PasswordInput, type PasswordInputProps }
