import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ComponentType } from 'react'
import { useState } from 'react'
import { DataTable, type DataTableProps } from './data-table'

type Person = { id: string; name: string; email: string; role: string }

// `DataTable` is generic; Storybook's CSF typing needs one concrete instantiation to
// check `args` against. Purely a typing convenience — same component at runtime.
const PersonDataTable = DataTable as ComponentType<DataTableProps<Person>>

const PEOPLE: Person[] = Array.from({ length: 42 }, (_, index) => ({
  id: String(index + 1),
  name: `Person ${index + 1}`,
  email: `person${index + 1}@example.com`,
  role: index % 3 === 0 ? 'Admin' : 'Member',
}))

const columns: DataTableProps<Person>['columns'] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'role', header: 'Role' },
]

const meta = {
  title: 'Components/DataTable',
  component: PersonDataTable,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof PersonDataTable>

export default meta
type Story = StoryObj<typeof meta>

function ServerPaginatedExample() {
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 10
  const start = pageIndex * pageSize
  const page = PEOPLE.slice(start, start + pageSize)

  return (
    <DataTable
      columns={columns}
      data={page}
      pageIndex={pageIndex}
      pageSize={pageSize}
      pageCount={Math.ceil(PEOPLE.length / pageSize)}
      rowCount={PEOPLE.length}
      onPageChange={(next) => setPageIndex(next.pageIndex)}
      getRowHref={(row) => `#${row.id}`}
    />
  )
}

export const ServerPaginated: StoryObj = {
  render: () => <ServerPaginatedExample />,
}

export const Loading: Story = {
  args: {
    columns,
    data: [],
    pageIndex: 0,
    pageSize: 10,
    pageCount: 0,
    loading: true,
    onPageChange: () => {},
  },
}

export const Empty: Story = {
  args: {
    columns,
    data: [],
    pageIndex: 0,
    pageSize: 10,
    pageCount: 0,
    onPageChange: () => {},
  },
}

export const ClientOnly: Story = {
  args: {
    columns,
    data: PEOPLE.slice(0, 5),
  },
}

export const CustomLabels: Story = {
  args: {
    columns,
    data: PEOPLE.slice(0, 5),
    pageIndex: 0,
    pageSize: 5,
    pageCount: 1,
    onPageChange: () => {},
    labels: {
      noResults: 'No teammates yet',
      previousPage: 'Older',
      nextPage: 'Newer',
      pageSizeLabel: 'Per page',
    },
  },
}
