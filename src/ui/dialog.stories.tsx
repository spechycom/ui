import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const termsClauses = Array.from({ length: 12 }, (_, i) => i + 1)

const meta = {
  title: 'shared/ui/Dialog',
  component: Dialog,
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Closed: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Update your name, email, and phone number.</DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const Open: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Update your name, email, and phone number.</DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const WithLongContent: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Terms of use</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terms of use</DialogTitle>
          <DialogDescription>Please read before continuing.</DialogDescription>
        </DialogHeader>
        <div className="max-h-64 overflow-y-auto text-sm text-muted-foreground">
          {termsClauses.map((clause) => (
            <p key={clause} className="mb-2">
              Clause {clause}: this service is provided subject to its terms of use.
            </p>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline">Decline</Button>
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}

export const WithoutCloseButton: Story = {
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Confirmation required</Button>
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Confirmation required</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
}
