import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { ThemeProvider, useTheme } from './use-theme'

function Consumer() {
  const { theme, setTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button type="button" onClick={() => setTheme('dark')}>
        dark
      </button>
      <button type="button" onClick={() => setTheme('light')}>
        light
      </button>
    </div>
  )
}

describe('ThemeProvider / useTheme', () => {
  beforeEach(() => {
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('applies the dark class when the theme is set to dark', async () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'dark' }))

    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(window.localStorage.getItem('spechy-ui-theme')).toBe('dark')
  })

  it('removes the dark class when switching back to light', async () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'dark' }))
    await userEvent.click(screen.getByRole('button', { name: 'light' }))

    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(window.localStorage.getItem('spechy-ui-theme')).toBe('light')
  })

  it('throws when used outside a ThemeProvider', () => {
    // Swallow the expected React error-boundary console noise for this one assertion.
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Consumer />)).toThrow('useTheme must be used within a ThemeProvider')
    consoleError.mockRestore()
  })
})
