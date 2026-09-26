import type { Meta, StoryObj } from '@storybook/react-vite'
import { Separator } from '@/components/ui/separator'

const meta = {
  title: 'shared/ui/Separator',
  component: Separator,
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => (
    <div className="w-64">
      <div className="text-sm">Content above</div>
      <Separator {...args} className="my-3" />
      <div className="text-sm">Content below</div>
    </div>
  ),
}

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <div className="flex h-10 items-center gap-3">
      <div className="text-sm">Left</div>
      <Separator {...args} />
      <div className="text-sm">Right</div>
    </div>
  ),
}
