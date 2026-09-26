import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type PaginationState,
  type Row,
  type Updater,
  useReactTable,
} from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { getPaginationRange } from './pagination-range'

const SKELETON_ROW_COUNT = 5

export type DataTableLabels = {
  /** Shown in the body when `data` is empty. */
  noResults?: string
  /** aria-label for the background loading spinner and skeleton rows. */
  loading?: string
  previousPage?: string
  nextPage?: string
  goToPage?: (page: number) => string
  pageSizeLabel?: string
  /** Defaults to "{from}-{to} of {total}". */
  range?: (range: { from: number; to: number; total: number }) => string
}

export const DEFAULT_DATA_TABLE_LABELS: Required<DataTableLabels> = {
  noResults: 'No results.',
  loading: 'Loading…',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  goToPage: (page) => `Go to page ${page}`,
  pageSizeLabel: 'Rows per page',
  range: ({ from, to, total }) => `${from}-${to} of ${total}`,
}

export type DataTableProps<TData> = {
  columns: ColumnDef<TData>[]
  data: TData[]
  getRowId?: (row: TData) => string
  /**
   * Makes each row a real link: rendered as a stretched `<a href>` overlay in the
   * first cell so the whole row is clickable while staying valid, keyboard-focusable
   * HTML inside a `<table>` — Cmd/Ctrl-click and middle-click open a new tab.
   * Return `undefined` to leave a specific row non-navigable.
   */
  getRowHref?: (row: TData) => string | undefined
  pageIndex: number
  pageSize: number
  pageCount: number
  /** Total row count across all pages, used for the "x-y of z" range label. Defaults to `pageCount * pageSize`. */
  rowCount?: number
  onPageChange: (pagination: { pageIndex: number; pageSize: number }) => void
  pageSizeOptions?: number[]
  /** Shows skeleton rows instead of `data` (first load). */
  loading?: boolean
  emptyState?: ReactNode
  labels?: DataTableLabels
  className?: string
}

/** Server-paginated data grid with an optional per-row link. See `DataTableProps`. */
export function DataTable<TData>({
  columns,
  data,
  getRowId,
  getRowHref,
  pageIndex,
  pageSize,
  pageCount,
  rowCount,
  onPageChange,
  pageSizeOptions = [10, 25, 50],
  loading = false,
  emptyState,
  labels,
  className,
}: DataTableProps<TData>) {
  const resolvedLabels = { ...DEFAULT_DATA_TABLE_LABELS, ...labels }
  const totalRowCount = rowCount ?? pageCount * pageSize

  const table = useReactTable({
    data,
    columns,
    ...(getRowId ? { getRowId } : {}),
    state: { pagination: { pageIndex, pageSize } },
    manualPagination: true,
    pageCount,
    onPaginationChange: (updater: Updater<PaginationState>) => {
      const current = { pageIndex, pageSize }
      onPageChange(typeof updater === 'function' ? updater(current) : updater)
    },
    getCoreRowModel: getCoreRowModel(),
  })

  const rows = table.getRowModel().rows
  const isEmpty = !loading && rows.length === 0
  const from = totalRowCount === 0 ? 0 : pageIndex * pageSize + 1
  const to = Math.min(totalRowCount, (pageIndex + 1) * pageSize)

  return (
    <div className={cn('flex flex-col rounded-lg border bg-card', className)}>
      {isEmpty ? (
        <div className="flex min-h-32 items-center justify-center px-4 py-6 text-muted-foreground">
          {emptyState ?? resolvedLabels.noResults}
        </div>
      ) : (
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ minWidth: header.getSize() }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: fixed number of placeholder rows, no real data
                  <TableRow key={`skeleton-row-${index}`} aria-label={resolvedLabels.loading}>
                    {columns.map((_, columnIndex) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: same fixed placeholder set
                      <TableCell key={columnIndex}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : rows.map((row) => <DataTableRow key={row.id} row={row} getRowHref={getRowHref} />)}
          </TableBody>
        </Table>
      )}

      <DataTablePagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={pageCount}
        pageSizeOptions={pageSizeOptions}
        range={resolvedLabels.range({ from, to, total: totalRowCount })}
        labels={resolvedLabels}
        onPageIndexChange={(next) => onPageChange({ pageIndex: next, pageSize })}
        onPageSizeChange={(next) => onPageChange({ pageIndex: 0, pageSize: next })}
      />
    </div>
  )
}

function DataTableRow<TData>({
  row,
  getRowHref,
}: {
  row: Row<TData>
  getRowHref?: ((row: TData) => string | undefined) | undefined
}) {
  const href = getRowHref?.(row.original)
  const cells = row.getVisibleCells()

  return (
    <TableRow className={href ? 'relative' : undefined}>
      {cells.map((cell, index) => {
        const content = flexRender(cell.column.columnDef.cell, cell.getContext())
        // Stretched link (Bootstrap's `.stretched-link` technique): the first cell's real
        // content is wrapped in a real, keyboard-focusable `<a>` so Cmd/Ctrl-click and
        // middle-click work. Its `::after` is absolutely positioned against the row (which has
        // `position: relative`, set above) and escapes the `<td>` box to cover the whole row —
        // one valid, singly-focusable anchor per row, no `<a>` wrapping `<tr>`. Interactive
        // elements in other cells (e.g. an action button) need their own `relative` class so
        // they paint above the overlay and stay clickable.
        return (
          <TableCell key={cell.id}>
            {index === 0 && href ? (
              <a href={href} className="after:absolute after:inset-0">
                {content}
              </a>
            ) : (
              content
            )}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

function DataTablePagination({
  pageIndex,
  pageSize,
  pageCount,
  pageSizeOptions,
  range,
  labels,
  onPageIndexChange,
  onPageSizeChange,
}: {
  pageIndex: number
  pageSize: number
  pageCount: number
  pageSizeOptions: number[]
  range: string
  labels: Required<DataTableLabels>
  onPageIndexChange: (pageIndex: number) => void
  onPageSizeChange: (pageSize: number) => void
}) {
  return (
    <div className="flex flex-col-reverse items-center justify-between gap-3 border-t px-4 py-3 sm:flex-row">
      <p className="text-sm text-text-secondary">{range}</p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">{labels.pageSizeLabel}</span>
          <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger size="sm" className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={labels.previousPage}
            disabled={pageIndex <= 0}
            onClick={() => onPageIndexChange(pageIndex - 1)}
          >
            <IconChevronLeft />
          </Button>

          {getPaginationRange(pageIndex + 1, pageCount).map((page, index) =>
            page === 'ellipsis' ? (
              // biome-ignore lint/suspicious/noArrayIndexKey: static array, fixed position, no id
              <span key={`ellipsis-${index}`} aria-hidden className="px-1.5 text-text-secondary">
                …
              </span>
            ) : (
              <Button
                key={page}
                type="button"
                variant="ghost"
                size="icon-sm"
                className={cn(page === pageIndex + 1 && 'bg-accent font-semibold text-foreground')}
                aria-label={labels.goToPage(page)}
                aria-current={page === pageIndex + 1 ? 'page' : undefined}
                onClick={() => onPageIndexChange(page - 1)}
              >
                {page}
              </Button>
            ),
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={labels.nextPage}
            disabled={pageIndex + 1 >= pageCount}
            onClick={() => onPageIndexChange(pageIndex + 1)}
          >
            <IconChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
