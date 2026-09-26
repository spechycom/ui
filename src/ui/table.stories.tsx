import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const meta = {
  title: 'shared/ui/Table',
  component: Table,
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

const customers = [
  { name: 'Ada Lovelace', email: 'ada@spechy.com', status: 'Active' },
  { name: 'Grace Hopper', email: 'grace@spechy.com', status: 'Inactive' },
  { name: 'Alan Turing', email: 'alan@spechy.com', status: 'Active' },
]

export const Populated: Story = {
  render: () => (
    <Table>
      <TableCaption>Customer list</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Full name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.email}>
            <TableCell>{customer.name}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>
              <Badge variant={customer.status === 'Active' ? 'success' : 'secondary'}>
                {customer.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

export const WithFooter: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>License</TableCell>
          <TableCell>2</TableCell>
          <TableCell>$400</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Extra seat</TableCell>
          <TableCell>3</TableCell>
          <TableCell>$150</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Total</TableCell>
          <TableCell>$550</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  ),
}

export const Empty: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Full name</TableHead>
          <TableHead>Email</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
            No records found.
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
}
