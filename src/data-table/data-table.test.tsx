import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DataTable, type DataTableProps } from './data-table'

type Row = { id: string; name: string }

const columns: DataTableProps<Row>['columns'] = [{ accessorKey: 'name', header: 'Name' }]
const data: Row[] = [
  { id: '1', name: 'Ada Lovelace' },
  { id: '2', name: 'Grace Hopper' },
]

function baseProps(overrides: Partial<DataTableProps<Row>> = {}): DataTableProps<Row> {
  return {
    columns,
    data,
    pageIndex: 0,
    pageSize: 10,
    pageCount: 3,
    onPageChange: vi.fn(),
    ...overrides,
  }
}

describe('DataTable', () => {
  it('uses English label defaults when no data is present', () => {
    render(<DataTable {...baseProps({ data: [], pageCount: 0 })} />)
    expect(screen.getByText('No results.')).toBeInTheDocument()
  })

  it('lets an explicit label override the default', () => {
    render(<DataTable {...baseProps({ data: [], pageCount: 0, labels: { noResults: 'Nothing here yet' } })} />)
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument()
  })

  it('calls onPageChange with the next page index when "Next page" is clicked', async () => {
    const onPageChange = vi.fn()
    render(<DataTable {...baseProps({ pageIndex: 0, pageCount: 3, onPageChange })} />)

    await userEvent.click(screen.getByRole('button', { name: 'Next page' }))

    expect(onPageChange).toHaveBeenCalledWith({ pageIndex: 1, pageSize: 10 })
  })

  it('disables "Next page" on the last page', () => {
    render(<DataTable {...baseProps({ pageIndex: 2, pageCount: 3 })} />)
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
  })

  it('renders each row as a real link when getRowHref is given', () => {
    render(<DataTable {...baseProps({ getRowHref: (row) => `/people/${row.id}` })} />)

    const link = screen.getByRole('link', { name: 'Ada Lovelace' })
    expect(link).toHaveAttribute('href', '/people/1')
  })

  it('leaves a row without a link when getRowHref returns undefined', () => {
    render(<DataTable {...baseProps({ getRowHref: (row) => (row.id === '1' ? undefined : `/people/${row.id}`) })} />)

    expect(screen.queryByRole('link', { name: 'Ada Lovelace' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Grace Hopper' })).toHaveAttribute('href', '/people/2')
  })

  it('renders no pagination footer for a client-only list (no pageCount/onPageChange)', () => {
    render(<DataTable columns={columns} data={data} />)

    expect(screen.queryByRole('button', { name: 'Next page' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Previous page' })).not.toBeInTheDocument()
    expect(screen.queryByText('Rows per page')).not.toBeInTheDocument()
  })

  it('renders the pagination footer once pageCount and onPageChange are both given', () => {
    render(<DataTable {...baseProps()} />)
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument()
  })

  it('never shows the page-size select unless pageSizeOptions is passed, even when paginated', () => {
    render(<DataTable {...baseProps({ pageSizeOptions: undefined })} />)
    expect(screen.queryByText('Rows per page')).not.toBeInTheDocument()
  })

  it('shows the page-size select when pageSizeOptions is passed', () => {
    render(<DataTable {...baseProps({ pageSizeOptions: [10, 25, 50] })} />)
    expect(screen.getByText('Rows per page')).toBeInTheDocument()
  })

  it('associates the page-size label with its Select via aria-labelledby', () => {
    render(<DataTable {...baseProps({ pageSizeOptions: [10, 25, 50] })} />)
    expect(screen.getByRole('combobox', { name: 'Rows per page' })).toBeInTheDocument()
  })

  it('uses getRowLabel for the row link accessible name when given', () => {
    render(
      <DataTable
        {...baseProps({
          getRowHref: (row) => `/people/${row.id}`,
          getRowLabel: (row) => `${row.name} (${row.id})`,
        })}
      />,
    )
    expect(screen.getByRole('link', { name: 'Ada Lovelace (1)' })).toBeInTheDocument()
  })
})
