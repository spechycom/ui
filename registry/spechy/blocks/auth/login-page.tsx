import { IconLifebuoy, IconRefresh, IconShieldCheck } from '@tabler/icons-react'
import type * as React from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { AuthLayout } from './auth-layout'

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" {...props}>
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 16.3 3 9.7 7.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 45c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 36.6 26.7 37.5 24 37.5c-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.5 40.6 16.2 45 24 45z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-1 3-3.1 5.5-5.8 7.1l6.2 5.2C39.9 37.5 45 31.4 45 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  )
}

function MicrosoftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 23 23" aria-hidden="true" {...props}>
      <rect x="1" y="1" width="10" height="10" fill="#F35325" />
      <rect x="12" y="1" width="10" height="10" fill="#81BC06" />
      <rect x="1" y="12" width="10" height="10" fill="#05A6F0" />
      <rect x="12" y="12" width="10" height="10" fill="#FFBA08" />
    </svg>
  )
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07z"
      />
    </svg>
  )
}

function TiktokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#000000"
        d="M16.6 5.82c-.9-.98-1.4-2.26-1.4-3.6h-3.14v13.44c0 1.53-1.24 2.77-2.77 2.77a2.77 2.77 0 1 1 0-5.54c.28 0 .55.04.8.12V9.9a6 6 0 0 0-.8-.05 6 6 0 1 0 6 6V9.13a8.16 8.16 0 0 0 4.76 1.53V7.5c-1.2 0-2.3-.4-3.2-1.13z"
      />
    </svg>
  )
}

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
