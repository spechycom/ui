import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '@/components/ui/input'

const meta = {
  title: 'shared/ui/Input',
  component: Input,
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'number', 'search', 'tel', 'url'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    placeholder: 'Enter text...',
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: { defaultValue: 'Ada Lovelace' },
}

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Read only' },
}

export const WithError: Story = {
  args: { 'aria-invalid': true, defaultValue: 'invalid-value' },
}

export const Email: Story = {
  args: { type: 'email', placeholder: 'name@example.com' },
}

export const NumberType: Story = {
  args: { type: 'number', placeholder: '0' },
}
