import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const meta = {
  title: 'shared/ui/Card',
  component: Card,
  argTypes: {
    tone: {
      control: 'select',
      options: ['default', 'subtle', 'brand', 'ink'],
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

function DemoCard(tone: 'default' | 'subtle' | 'brand' | 'ink') {
  return (
    <Card tone={tone} className="w-80">
      <CardHeader>
        <CardTitle>Plan details</CardTitle>
        <CardDescription>Monthly usage summary</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">1,240 / 2,000 messages used.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Upgrade</Button>
      </CardFooter>
    </Card>
  )
}

export const Default: Story = {
  render: () => DemoCard('default'),
}

export const Subtle: Story = {
  render: () => DemoCard('subtle'),
}

export const Brand: Story = {
  render: () => DemoCard('brand'),
}

export const Ink: Story = {
  render: () => DemoCard('ink'),
}
