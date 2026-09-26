import type { Meta, StoryObj } from '@storybook/react-vite'
import { enUS } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'

const meta = {
  title: 'shared/ui/Calendar',
  component: Calendar,
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

export const SingleSelection: Story = {
  render: () => <Calendar mode="single" locale={enUS} defaultMonth={new Date(2026, 7, 1)} />,
}

export const RangeSelection: Story = {
  render: () => (
    <Calendar
      mode="range"
      locale={enUS}
      defaultMonth={new Date(2026, 7, 1)}
      selected={{ from: new Date(2026, 7, 5), to: new Date(2026, 7, 12) }}
    />
  ),
}

export const WithSelectedDate: Story = {
  render: () => (
    <Calendar
      mode="single"
      locale={enUS}
      defaultMonth={new Date(2026, 7, 1)}
      selected={new Date(2026, 7, 11)}
    />
  ),
}

export const WithDisabledDates: Story = {
  render: () => (
    <Calendar
      mode="single"
      locale={enUS}
      defaultMonth={new Date(2026, 7, 1)}
      disabled={{ before: new Date(2026, 7, 11) }}
    />
  ),
}

export const WithMonthYearDropdowns: Story = {
  render: () => (
    // Month/year caption uses this package's own Select instead of a native <select> (see calendar.tsx § CalendarDropdown).
    <Calendar
      mode="single"
      locale={enUS}
      captionLayout="dropdown"
      defaultMonth={new Date(2026, 7, 1)}
      selected={new Date(2026, 7, 11)}
    />
  ),
}
