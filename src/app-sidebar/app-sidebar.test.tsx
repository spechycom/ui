import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeProvider } from '@/hooks/use-theme'
import { AppSidebar, type AppSidebarProps } from './app-sidebar'

function renderSidebar(overrides: Partial<AppSidebarProps> = {}) {
  const props: AppSidebarProps = {
    logo: <span>Logo</span>,
    productName: 'Spechy',
    items: [
      { href: '/', label: 'Home', active: true },
      { href: '/settings', label: 'Settings' },
    ],
    user: { name: 'Ada Lovelace', email: 'ada@example.com' },
    ...overrides,
  }
  return render(
    <ThemeProvider>
      <AppSidebar {...props} />
    </ThemeProvider>,
  )
}

describe('AppSidebar', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('marks the active item with aria-current="page"', () => {
    renderSidebar()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Settings' })).not.toHaveAttribute('aria-current')
  })

  it('persists the pinned/collapse state to localStorage', async () => {
    renderSidebar()

    await userEvent.click(screen.getByRole('button', { name: 'Unpin sidebar' }))

    expect(window.localStorage.getItem('spechy-ui:sidebar-pinned')).toBe('false')
  })

  it('reads a previously persisted collapse state on mount', async () => {
    window.localStorage.setItem('spechy-ui:sidebar-pinned', 'false')
    renderSidebar()

    // Collapsed-and-unpinned only reveals the toggle on hover (same as a mouse
    // passing over the rail) — this asserts the persisted state came back as
    // "unpinned", not that the button is permanently hidden.
    await userEvent.hover(screen.getByRole('complementary'))
    expect(screen.getByRole('button', { name: 'Pin sidebar' })).toBeInTheDocument()
  })

  it('calls onLanguageChange when a language is selected from the profile menu', async () => {
    const onLanguageChange = vi.fn()
    renderSidebar({
      languages: [
        { value: 'en', label: 'English' },
        { value: 'tr', label: 'Türkçe' },
      ],
      language: 'en',
      onLanguageChange,
    })

    await userEvent.click(screen.getByRole('button', { name: 'Profile menu' }))
    await userEvent.click(screen.getByText('Language'))
    await userEvent.click(await screen.findByRole('menuitemradio', { name: 'Türkçe' }))

    expect(onLanguageChange).toHaveBeenCalledWith('tr')
  })

  it('shows the email once, not twice, when the user has no name', () => {
    renderSidebar({ user: { email: 'admin@example.com' } })

    expect(screen.getAllByText('admin@example.com')).toHaveLength(1)
  })
})
