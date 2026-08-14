import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/ui/password-input'

import { AuthLayout } from './auth-layout'

export function ResetPasswordPage() {
  return (
    <AuthLayout heading="Set a new password" subheading="Choose a strong password for your account.">
      <div className="space-y-2">
        <h2 className="text-h2">New password</h2>
        <p className="text-body-sm text-text-secondary">
          Your new password must be different from previous passwords
        </p>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="password" className="font-medium text-sm">
            New password
          </label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            placeholder="Enter a new password"
            className="h-[var(--control-lg)]"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="passwordConfirmation" className="font-medium text-sm">
            Confirm new password
          </label>
          <PasswordInput
            id="passwordConfirmation"
            name="passwordConfirmation"
            autoComplete="new-password"
            placeholder="Re-enter your new password"
            className="h-[var(--control-lg)]"
          />
        </div>
        <Button type="submit" size="xl" className="w-full font-semibold text-base">
          Reset password
        </Button>
      </form>
    </AuthLayout>
  )
}
