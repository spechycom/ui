import type { Meta, StoryObj } from '@storybook/react-vite'
import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'

const meta = {
  title: 'shared/ui/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'xl', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    children: 'Buton',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { variant: 'default' },
}

export const Destructive: Story = {
  args: { variant: 'destructive' },
}

export const Outline: Story = {
  args: { variant: 'outline' },
}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const Ghost: Story = {
  args: { variant: 'ghost' },
}

export const Link: Story = {
  args: { variant: 'link' },
}

export const ExtraSmall: Story = {
  args: { size: 'xs' },
}

export const Small: Story = {
  args: { size: 'sm' },
}

export const Large: Story = {
  args: { size: 'lg' },
}

export const ExtraLarge: Story = {
  args: { size: 'xl' },
}

export const Icon: Story = {
  args: { size: 'icon', children: <IconPlus /> },
}

export const IconExtraSmall: Story = {
  args: { size: 'icon-xs', children: <IconPlus /> },
}

export const IconSmall: Story = {
  args: { size: 'icon-sm', children: <IconPlus /> },
}

export const IconLarge: Story = {
  args: { size: 'icon-lg', children: <IconPlus /> },
}

export const Disabled: Story = {
  args: { disabled: true },
}
