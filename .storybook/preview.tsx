import type { Decorator, Preview } from '@storybook/react-vite'
import { useEffect } from 'react'
import { ThemeProvider } from '@/hooks/use-theme'
import './preview.css'

type ThemeGlobal = 'light' | 'dark'

function toTheme(value: unknown): ThemeGlobal {
  return value === 'dark' ? 'dark' : 'light'
}

const WithTheme: Decorator = (Story, context) => {
  const theme = toTheme(context.globals.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  )
}

const preview: Preview = {
  tags: ['autodocs'],
  initialGlobals: {
    theme: 'light',
  },
  globalTypes: {
    theme: {
      description: 'Theme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [WithTheme],
}

export default preview
