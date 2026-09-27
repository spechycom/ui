import { IconClock, IconUsers, IconVideo } from '@tabler/icons-react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatCard } from './stat-card'

const meta = {
  title: 'Components/StatCard',
  component: StatCard,
} satisfies Meta<typeof StatCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'Total meetings', value: 128 },
}

export const WithIcon: Story = {
  args: { label: 'Total meetings', value: 128, icon: IconUsers },
}

export const WithHint: Story = {
  args: {
    label: 'Recordings ready',
    value: 110,
    icon: IconVideo,
    hint: '86% of meetings',
  },
}

export const Row: Story = {
  args: { label: 'Total meetings', value: 128 },
  render: () => (
    <div className="grid grid-cols-4 gap-3">
      <StatCard label="Total meetings" value={128} icon={IconUsers} />
      <StatCard label="Average duration" value="4m 12s" icon={IconClock} />
      <StatCard label="Total talk time" value="12h 5m" icon={IconClock} />
      <StatCard label="Recordings ready" value={110} icon={IconVideo} hint="86% of meetings" />
    </div>
  ),
}
