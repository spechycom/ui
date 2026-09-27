import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const meta = {
  title: 'shared/ui/Select',
  component: Select,
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Closed: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="open">Open</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="closed">Closed</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const Open: Story = {
  render: () => (
    <Select defaultOpen>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="open">Open</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="closed">Closed</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithValue: Story = {
  render: () => (
    <Select defaultValue="pending">
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="open">Open</SelectItem>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="closed">Closed</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="open">Open</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const WithGroupsAndLabels: Story = {
  render: () => (
    <Select defaultOpen>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select channel" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Messaging</SelectLabel>
          <SelectItem value="whatsapp">WhatsApp</SelectItem>
          <SelectItem value="instagram">Instagram</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Email</SelectLabel>
          <SelectItem value="gmail">Gmail</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
}

export const SmallSize: Story = {
  render: () => (
    <Select>
      <SelectTrigger size="sm" className="w-40">
        <SelectValue placeholder="Page size" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="10">10</SelectItem>
        <SelectItem value="20">20</SelectItem>
        <SelectItem value="50">50</SelectItem>
      </SelectContent>
    </Select>
  ),
}
