import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

const meta = {
  title: 'shared/ui/Field',
  component: Field,
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal', 'responsive'],
    },
  },
} satisfies Meta<typeof Field>

export default meta
type Story = StoryObj<typeof meta>

export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <Field {...args} className="w-80">
      <FieldContent>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" type="email" placeholder="name@example.com" />
        <FieldDescription>Notifications are sent to this address.</FieldDescription>
      </FieldContent>
    </Field>
  ),
}

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => (
    <Field {...args} className="w-80">
      <FieldTitle>Notifications</FieldTitle>
      <Switch defaultChecked />
    </Field>
  ),
}

export const Responsive: Story = {
  args: { orientation: 'responsive' },
  render: (args) => (
    <Field {...args} className="w-80">
      <FieldContent>
        <FieldLabel htmlFor="name-responsive">Full name</FieldLabel>
        <FieldDescription>The name shown on invoices.</FieldDescription>
      </FieldContent>
      <Input id="name-responsive" placeholder="Ada Lovelace" />
    </Field>
  ),
}

export const WithError: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <Field {...args} data-invalid="true" className="w-80">
      <FieldContent>
        <FieldLabel htmlFor="email-error">Email</FieldLabel>
        <Input id="email-error" type="email" aria-invalid defaultValue="invalid-address" />
        <FieldError errors={[{ message: 'Enter a valid email address.' }]} />
      </FieldContent>
    </Field>
  ),
}

export const WithLegendAndSeparator: Story = {
  render: () => (
    <FieldSet className="w-80">
      <FieldLegend>Contact preferences</FieldLegend>
      <FieldGroup>
        <Field orientation="vertical">
          <FieldContent>
            <FieldLabel htmlFor="phone">Phone</FieldLabel>
            <Input id="phone" placeholder="+1 555 010 0100" />
          </FieldContent>
        </Field>
        <FieldSeparator>or</FieldSeparator>
        <Field orientation="vertical">
          <FieldContent>
            <FieldLabel htmlFor="email-group">Email</FieldLabel>
            <Input id="email-group" type="email" placeholder="name@example.com" />
          </FieldContent>
        </Field>
      </FieldGroup>
    </FieldSet>
  ),
}
