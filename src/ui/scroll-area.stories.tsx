import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScrollArea } from '@/components/ui/scroll-area'

const meta = {
  title: 'shared/ui/ScrollArea',
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

const rows = Array.from({ length: 20 }, (_, i) => i + 1)
const cards = Array.from({ length: 10 }, (_, i) => i + 1)

export const Vertical: Story = {
  render: () => (
    <ScrollArea className="h-48 w-64 rounded-md border p-4">
      <div className="flex flex-col gap-3 text-sm">
        {rows.map((row) => (
          <p key={row}>Row {row} — notification content.</p>
        ))}
      </div>
    </ScrollArea>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-64 rounded-md border p-4">
      <div className="flex w-max gap-3 text-sm">
        {cards.map((card) => (
          <div
            key={card}
            className="flex h-16 w-24 shrink-0 items-center justify-center rounded-md bg-muted"
          >
            Card {card}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}
