import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const meta = {
  title: 'shared/ui/Label',
  component: Label,
  args: {
    children: 'Email',
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithInput: Story = {
  render: (args) => (
    <div className="flex flex-col gap-1.5">
      <Label {...args} htmlFor="label-input-demo" />
      <Input id="label-input-demo" placeholder="name@spechy.com" />
    </div>
  ),
}

export const Disabled: Story = {
  render: (args) => (
    <div className="group flex flex-col gap-1.5" data-disabled="true">
      <Label {...args} htmlFor="label-disabled-demo" />
      <Input id="label-disabled-demo" disabled placeholder="Read only" />
    </div>
  ),
}
