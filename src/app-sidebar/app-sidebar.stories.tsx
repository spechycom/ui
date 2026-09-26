import { IconHome, IconSettings, IconUsers } from '@tabler/icons-react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AppSidebar } from './app-sidebar'

const meta = {
  title: 'Components/AppSidebar',
  component: AppSidebar,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AppSidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    logo: <IconHome className="text-primary" />,
    productName: 'Spechy',
    items: [
      { href: '/', label: 'Home', icon: IconHome, active: true },
      { href: '/team', label: 'Team', icon: IconUsers },
      { href: '/settings', label: 'Settings', icon: IconSettings },
    ],
    user: { name: 'Ada Lovelace', email: 'ada@example.com' },
    profileActions: [
      { label: 'Edit profile', href: '/profile' },
      { label: 'Log out', variant: 'destructive' },
    ],
  },
}

export const WithLanguageSwitcher: Story = {
  args: {
    ...Default.args,
    languages: [
      { value: 'en', label: 'English' },
      { value: 'tr', label: 'Türkçe' },
      { value: 'de', label: 'Deutsch' },
    ],
    language: 'en',
  },
}
