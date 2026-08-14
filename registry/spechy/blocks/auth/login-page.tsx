import { IconLifebuoy, IconRefresh, IconShieldCheck } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'

import { AuthLayout } from './auth-layout'
import { FacebookIcon, GoogleIcon, MicrosoftIcon, TiktokIcon } from './social-icons'

export function LoginPage() {
  return (
    <AuthLayout
      heading="Welcome back"
      subheading="Sign in to your account to continue where you left off."
      highlights={[
        { icon: <IconShieldCheck className="size-4" />, label: 'Enterprise-grade security' },
        { icon: <IconRefresh className="size-4" />, label: 'Real-time sync across devices' },
        { icon: <IconLifebuoy className="size-4" />, label: '24/7 support when you need it' },
      ]}
    >
      <div className="space-y-2">
        <h2 className="text-h2">Sign in</h2>
        <p className="text-body-sm text-text-secondary">
          Enter your email and password to access your account
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
        <div className="space-y-1.5">
          <label htmlFor="password" className="font-medium text-sm">
            Password
          </label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            className="h-[var(--control-lg)]"
          />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Checkbox id="rememberMe" name="rememberMe" />
            <label htmlFor="rememberMe" className="text-sm">
              Remember me
            </label>
          </div>
          <a
            href="/forgot-password"
            className="whitespace-nowrap font-medium text-primary text-sm hover:underline"
          >
            Forgot password?
          </a>
        </div>
        <Button type="submit" size="xl" className="w-full font-semibold text-base">
          Sign in
        </Button>
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-text-secondary text-xs">Or continue with</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" size="lg" className="flex-1 px-0" aria-label="Continue with Google">
            <GoogleIcon className="size-[18px]" />
          </Button>
          <Button type="button" variant="outline" size="lg" className="flex-1 px-0" aria-label="Continue with Facebook">
            <FacebookIcon className="size-[18px]" />
          </Button>
          <Button type="button" variant="outline" size="lg" className="flex-1 px-0" aria-label="Continue with Microsoft">
            <MicrosoftIcon className="size-4" />
          </Button>
          <Button type="button" variant="outline" size="lg" className="flex-1 px-0" aria-label="Continue with TikTok">
            <TiktokIcon className="size-[18px]" />
          </Button>
        </div>
        <p className="text-center text-text-secondary text-sm">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-primary hover:underline">
            Sign up
          </a>
        </p>
        <p className="text-center text-text-secondary text-xs">
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
          {' · '}
          <a href="/terms" className="hover:underline">
            Terms of Service
          </a>
        </p>
      </form>
    </AuthLayout>
  )
}
