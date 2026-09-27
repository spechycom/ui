import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '@/components/ui/badge'

const meta = {
  title: 'shared/ui/Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'destructive',
        'outline',
        'ghost',
        'link',
        'success',
        'warning',
        'danger',
        'info',
      ],
    },
  },
  args: {
    children: 'Etiket',
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { variant: 'default' },
}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const Destructive: Story = {
  args: { variant: 'destructive' },
}

export const Outline: Story = {
  args: { variant: 'outline' },
}

export const Ghost: Story = {
  args: { variant: 'ghost' },
}

export const Link: Story = {
  args: { variant: 'link' },
}

export const Success: Story = {
  args: { variant: 'success' },
}

export const Warning: Story = {
  args: { variant: 'warning' },
}

export const Danger: Story = {
  args: { variant: 'danger' },
}

export const Info: Story = {
  args: { variant: 'info' },
}
