import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const meta = {
  title: 'shared/ui/Tabs',
  component: Tabs,
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const LineVariant: Story = {
  args: { defaultValue: 'account' },
  render: (args) => (
    <Tabs {...args} className="w-80">
      <TabsList variant="line">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account settings content.</TabsContent>
      <TabsContent value="password">Password settings content.</TabsContent>
    </Tabs>
  ),
}

export const DefaultVariant: Story = {
  args: { defaultValue: 'account' },
  render: (args) => (
    <Tabs {...args} className="w-80">
      <TabsList variant="default">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account settings content.</TabsContent>
      <TabsContent value="password">Password settings content.</TabsContent>
    </Tabs>
  ),
}

export const Vertical: Story = {
  args: { defaultValue: 'account', orientation: 'vertical' },
  render: (args) => (
    <Tabs {...args} className="w-80">
      <TabsList variant="line">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account settings content.</TabsContent>
      <TabsContent value="password">Password settings content.</TabsContent>
      <TabsContent value="team">Team settings content.</TabsContent>
    </Tabs>
  ),
}

export const DisabledTab: Story = {
  args: { defaultValue: 'account' },
  render: (args) => (
    <Tabs {...args} className="w-80">
      <TabsList variant="line">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password" disabled>
          Password
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account settings content.</TabsContent>
      <TabsContent value="password">Password settings content.</TabsContent>
    </Tabs>
  ),
}

const MANY_TABS = [
  'General',
  'Configuration',
  'Working Hours',
  'Online',
  'Offline Form',
  'Feedback',
  'FAQ',
  'Chatbot',
  'Video Call',
  'ChatGPT',
  'Theme',
] as const

const FIRST_TAB = MANY_TABS[0]
const LAST_TAB = MANY_TABS[MANY_TABS.length - 1] as (typeof MANY_TABS)[number]

const renderManyTabs: Story['render'] = (args) => (
  <div className="w-96 rounded-lg border p-3">
    <Tabs {...args}>
      <TabsList>
        {MANY_TABS.map((label) => (
          <TabsTrigger key={label} value={label}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {MANY_TABS.map((label) => (
        <TabsContent key={label} value={label}>
          {label} content.
        </TabsContent>
      ))}
    </Tabs>
  </div>
)

/** The strip doesn't fit a narrow container: instead of wrapping, it scrolls horizontally with faded edges. */
export const ManyTabsOverflow: Story = {
  args: { defaultValue: FIRST_TAB },
  render: renderManyTabs,
}

/** When the overflowing strip's saved tab is at the end, it scrolls into view on open. */
export const ManyTabsActiveAtEnd: Story = {
  args: { defaultValue: LAST_TAB },
  render: renderManyTabs,
}
