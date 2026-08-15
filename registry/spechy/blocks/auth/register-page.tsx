import { IconBolt, IconShield, IconUsers } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'

import { AuthLayout } from './auth-layout'
import { FacebookIcon, GoogleIcon, MicrosoftIcon, TiktokIcon } from './social-icons'

export function RegisterPage() {
  return (
    <AuthLayout
      heading="Create your account"
      subheading="Set up your workspace in minutes and start collaborating with your team."
      highlights={[
        { icon: <IconBolt className="size-4" />, label: 'Get up and running instantly' },
        { icon: <IconUsers className="size-4" />, label: 'Invite your whole team' },
        { icon: <IconShield className="size-4" />, label: 'Bank-level data protection' },
      ]}
    >
      <div className="space-y-2">
        <h2 className="text-h2">Sign up</h2>
        <p className="text-body-sm text-text-secondary">Fill in your details to get started</p>
      </div>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="namesurname" className="font-medium text-sm">
            Full name
          </label>
          <Input
            id="namesurname"
            name="namesurname"
            autoComplete="name"
            placeholder="Jane Doe"
            className="h-[var(--control-lg)]"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <div className="space-y-1.5">
            <label htmlFor="phone" className="font-medium text-sm">
              Phone
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+1 555 000 0000"
              className="h-[var(--control-lg)]"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="password" className="font-medium text-sm">
              Password
            </label>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              placeholder="Create a password"
              className="h-[var(--control-lg)]"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="passwordConfirmation" className="font-medium text-sm">
              Confirm password
            </label>
            <PasswordInput
              id="passwordConfirmation"
              name="passwordConfirmation"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              className="h-[var(--control-lg)]"
            />
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Checkbox id="acceptedTerms" name="acceptedTerms" className="mt-0.5" />
          <label htmlFor="acceptedTerms" className="text-sm">
            I agree to the{' '}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>
        <Button type="submit" size="xl" className="w-full font-semibold text-base">
          Create account
        </Button>
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-text-secondary text-xs">Or continue with</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1 px-0"
            aria-label="Continue with Google"
          >
            <GoogleIcon className="size-[18px]" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1 px-0"
            aria-label="Continue with Facebook"
          >
            <FacebookIcon className="size-[18px]" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1 px-0"
            aria-label="Continue with Microsoft"
          >
            <MicrosoftIcon className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1 px-0"
            aria-label="Continue with TikTok"
          >
            <TiktokIcon className="size-[18px]" />
          </Button>
        </div>
        <p className="text-center text-text-secondary text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-primary hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </AuthLayout>
  )
}
