import { IconArrowLeft } from '@tabler/icons-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { OtpInput } from '@/components/ui/otp-input'

import { AuthLayout } from './auth-layout'

export function VerifyCodePage() {
  const [code, setCode] = useState('')

  return (
    <AuthLayout
      heading="Verify your email"
      subheading="We've sent a 6-digit code to your email address."
    >
      <a
        href="/login"
        className="flex w-fit items-center gap-1.5 text-sm text-text-secondary hover:text-foreground"
      >
        <IconArrowLeft className="size-4" />
        Back
      </a>
      <div className="space-y-2">
        <h2 className="text-h2">Enter verification code</h2>
        <p className="text-body-sm text-text-secondary">
          Enter the 6-digit code we sent to your email
        </p>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
        <OtpInput id="code" value={code} onChange={setCode} />
        <Button type="submit" size="xl" className="w-full font-semibold text-base">
          Verify
        </Button>
        <p className="text-center text-sm text-text-secondary">
          Didn&apos;t receive a code?{' '}
          <button type="button" className="font-medium text-primary hover:underline">
            Resend
          </button>
        </p>
      </form>
    </AuthLayout>
  )
}
