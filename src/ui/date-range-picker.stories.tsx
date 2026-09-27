import type { Meta, StoryObj } from '@storybook/react-vite'
import { enUS } from 'date-fns/locale'
import { useState } from 'react'
import { DateRangePicker, type DateRangeValue } from '@/components/ui/date-range-picker'

const meta = {
  title: 'shared/ui/DateRangePicker',
  component: DateRangePicker,
  // meta.args only satisfies StoryObj's required `args` field — each story sets up its own state in `render`.
  args: {
    value: { from: '', to: '' },
    onChange: () => {},
    fromPlaceholder: '',
    toPlaceholder: '',
    locale: enUS,
  },
} satisfies Meta<typeof DateRangePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState<DateRangeValue>({ from: '', to: '' })
    return (
      <DateRangePicker
        value={value}
        onChange={setValue}
        fromPlaceholder="Start"
        toPlaceholder="End"
        locale={enUS}
      />
    )
  },
}

export const WithValue: Story = {
  render: function Render() {
    const [value, setValue] = useState<DateRangeValue>({ from: '2026-08-01', to: '2026-08-15' })
    return (
      <DateRangePicker
        value={value}
        onChange={setValue}
        fromPlaceholder="Start"
        toPlaceholder="End"
        locale={enUS}
      />
    )
  },
}
