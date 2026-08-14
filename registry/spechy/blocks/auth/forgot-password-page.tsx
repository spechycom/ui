import { IconArrowLeft } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { AuthLayout } from './auth-layout'

export function ForgotPasswordPage() {
  return (
    <AuthLayout
      heading="Forgot your password?"
      subheading="No worries, we'll send you reset instructions."
    >
      <a
        href="/login"
        className="flex w-fit items-center gap-1.5 text-sm text-text-secondary hover:text-foreground"
      >
        <IconArrowLeft className="size-4" />
        Back to sign in
      </a>
      <div className="space-y-2">
        <h2 className="text-h2">Reset your password</h2>
        <p className="text-body-sm text-text-secondary">
          Enter the email associated with your account
        </p>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="email" className="font-medium text-sm">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="h-[var(--control-lg)]"
          />
        </div>
        <Button type="submit" size="xl" className="w-full font-semibold text-base">
          Send reset link
        </Button>
      </form>
    </AuthLayout>
  )
}
