import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

// 40 options on purpose — enough to exceed `CommandList`'s `max-h-[300px]` and require real scrolling.
const MANY_OPTIONS = Array.from({ length: 40 }, (_, i) => ({
  value: String(i),
  label: `Option ${i}`,
}))
function OwnerComboboxField() {
  const [value, setValue] = useState<string | null>(null)
  return (
    <Combobox
      value={value}
      onChange={setValue}
      options={MANY_OPTIONS}
      placeholder="Choose an owner"
      searchPlaceholder="Search"
      emptyLabel="No results"
    />
  )
}

const meta = {
  title: 'shared/ui/Sheet',
  component: Sheet,
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

export const Closed: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open filters</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Filter the list by status and date.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button>Apply</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const RightSide: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button variant="outline">Open filters</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Filter the list by status and date.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button>Apply</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const LeftSide: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Switch between modules.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
}

export const TopSide: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button variant="outline">Show announcement</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>New feature</SheetTitle>
          <SheetDescription>Bulk archiving is now available.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
}

export const BottomSide: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button variant="outline">Show shortcuts</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Keyboard shortcuts</SheetTitle>
          <SheetDescription>Use shortcuts for quick actions.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
}

/** Long create/edit form — `SheetBody` scrolls while the header/footer stay fixed, so the save button is always visible. */
export const LongFormWithFixedFooter: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button variant="outline">Add company</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>New company</SheetTitle>
          <SheetDescription>Enter the company details.</SheetDescription>
        </SheetHeader>
        <SheetBody className="flex flex-col gap-4">
          {['Company name', 'Email', 'Phone'].map((label) => (
            <div key={label} className="rounded-control border p-3 text-muted-foreground text-sm">
              {label}
            </div>
          ))}
          <OwnerComboboxField />
          {[
            'Website',
            'Tax office',
            'Tax number',
            'Address',
            'City',
            'District',
            'Social media',
            'Notes',
          ].map((label) => (
            <div key={label} className="rounded-control border p-3 text-muted-foreground text-sm">
              {label}
            </div>
          ))}
        </SheetBody>
        <SheetFooter className="flex-row justify-end border-t">
          <Button variant="outline">Cancel</Button>
          <Button>Create</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}

export const WithoutCloseButton: Story = {
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger asChild>
        <Button variant="outline">Required step</Button>
      </SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>Complete your profile</SheetTitle>
          <SheetDescription>Fill in the required fields before continuing.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button>Finish</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
}
