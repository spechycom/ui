import type { Meta, StoryObj } from '@storybook/react-vite'
import { PasswordInput } from '@/components/ui/password-input'

const meta = {
  title: 'shared/ui/PasswordInput',
  component: PasswordInput,
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: {
    placeholder: 'Enter your password',
  },
} satisfies Meta<typeof PasswordInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: { defaultValue: 'secret-password-123' },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'secret-password-123' },
}

export const WithError: Story = {
  args: { 'aria-invalid': true, defaultValue: '123' },
}
