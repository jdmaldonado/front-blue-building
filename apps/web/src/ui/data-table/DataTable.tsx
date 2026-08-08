import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type RowData,
  type SortingState,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { cn } from '../cn';
import type { DataTableFiltersController } from './useDataTableFilters';
import { IconButton } from '../icon-button';
import { Pagination } from '../pagination';
import { Select } from '../select';
import { Skeleton } from '../skeleton';
import {
  dataTableCardLabelVariants,
  dataTableCardRowVariants,
  dataTableCardValueVariants,
  dataTableCardVariants,
  dataTableCellVariants,
  dataTableFrameVariants,
  dataTableHeadCellVariants,
  dataTableRowVariants,
  dataTableScrollVariants,
  dataTableVariants,
  type DataTableDensity,
} from './DataTable-variants';

// Extra information a column can carry, read only by this component.
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    // Shown as the card title on phones, without its header label.
    primary?: boolean;
    // Left out of the card on phones. For secondary data only.
    hideOnMobile?: boolean;
    // Actions column: no label on the card, pinned to the bottom.
    actions?: boolean;
    // Turns the column into a filter in the toolbar. The options are domain
    // knowledge, so they are declared here and not inside the table.
    filter?: {
      label: string;
      options: ReadonlyArray<{ value: string; label: string }>;
    };
  }
}

type DataTableProps<TData> = {
  columns: Array<ColumnDef<TData, unknown>>;
  data: TData[];
  // Stable id. Without it, selection breaks when rows reorder.
  getRowId?: (row: TData) => string;
  onRowClick?: (row: TData) => void;
  isRowSelected?: (row: TData) => boolean;
  isPending?: boolean;
  // Shown when there are no rows. Usually an EmptyState.
  empty?: ReactNode;
  density?: DataTableDensity;
  // Search text and column filters. The view owns them, so the toolbar can sit
  // wherever the screen needs it.
  filters?: DataTableFiltersController;
  pageSize?: number;
  // Counter next to the pager, for example "120 usuarios".
  total?: string;
  className?: string;
};

const SKELETON_ROWS = 5;

// Same array on every render. A fresh `[]` here is a different dependency for
// the table's filtered row model, which recomputes, asks to reset the page
// index, writes state, and renders again: a loop that never lets go of the
// thread.
const NO_COLUMN_FILTERS: ColumnFiltersState = [];

export function DataTable<TData>({
  columns,
  data,
  getRowId,
  onRowClick,
  isRowSelected,
  isPending = false,
  empty,
  density = 'comfortable',
  filters,
  pageSize,
  total,
  className,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const paginated = pageSize !== undefined;

  // A declared filter is a pick from a list, so it matches the whole value. The
  // default guess would treat "activo" as a substring and match too much.
  const filterableColumns = useMemo(
    () =>
      columns.map((column) =>
        column.meta?.filter === undefined || column.filterFn !== undefined
          ? column
          : { ...column, filterFn: 'equalsString' as const },
      ),
    [columns],
  );

  const table = useReactTable({
    data,
    columns: filterableColumns,
    state: {
      sorting,
      globalFilter: filters?.search,
      columnFilters: filters?.columnFilters ?? NO_COLUMN_FILTERS,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: filters?.setColumnFilters,
    getRowId: getRowId === undefined ? undefined : (row) => getRowId(row),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: paginated ? getPaginationRowModel() : undefined,
    initialState: paginated ? { pagination: { pageIndex: 0, pageSize } } : undefined,
    // Without `pageSize` the caller pages on the server and owns the page
    // number. Saying so stops the table from resetting a page index that is not
    // its own after every change to the rows.
    manualPagination: !paginated,
  });

  const rows = table.getRowModel().rows;

  if (isPending) {
    return (
      <div className={cn(dataTableFrameVariants(), 'flex flex-col gap-3 p-4', className)}>
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <Skeleton key={index} className="h-9" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) {
    return <div className={cn(dataTableFrameVariants(), className)}>{empty}</div>;
  }

  // On a phone there is no header row to click, so sorting needs its own
  // control. Only columns with a plain text header can be offered here.
  const sortableColumns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanSort() && typeof column.columnDef.header === 'string');
  const sortedBy = sorting[0];

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {sortableColumns.length === 0 ? null : (
        <div className="flex items-center gap-2 md:hidden">
          <Select
            selectSize="sm"
            aria-label="Ordenar por"
            value={sortedBy?.id ?? ''}
            onChange={(columnId) => setSorting(columnId === '' ? [] : [{ id: columnId, desc: false }])}
            options={[
              { value: '', label: 'Sin orden' },
              ...sortableColumns.map((column) => ({
                value: column.id,
                label: String(column.columnDef.header),
              })),
            ]}
          />

          {sortedBy === undefined ? null : (
            <IconButton
              label={sortedBy.desc ? 'Orden descendente' : 'Orden ascendente'}
              onClick={() => setSorting([{ id: sortedBy.id, desc: !sortedBy.desc }])}
            >
              {sortedBy.desc ? <ArrowDown size={18} /> : <ArrowUp size={18} />}
            </IconButton>
          )}
        </div>
      )}

      {/* Phones: one card per row. */}
      <div className="flex flex-col gap-2 md:hidden">
        {rows.map((row) => (
          <div
            key={row.id}
            onClick={onRowClick === undefined ? undefined : () => onRowClick(row.original)}
            className={dataTableCardVariants({
              clickable: onRowClick !== undefined,
              selected: isRowSelected?.(row.original) ?? false,
            })}
          >
            {row
              .getVisibleCells()
              .filter((cell) => cell.column.columnDef.meta?.hideOnMobile !== true)
              .map((cell) => {
                const meta = cell.column.columnDef.meta;
                const content = flexRender(cell.column.columnDef.cell, cell.getContext());

                if (meta?.primary === true || meta?.actions === true) {
                  return (
                    <div key={cell.id} className={meta.actions === true ? 'mt-1 flex justify-end' : ''}>
                      {content}
                    </div>
                  );
                }

                // The card label needs plain text, so a JSX header falls back
                // to the column id.
                const header = cell.column.columnDef.header;

                return (
                  <div key={cell.id} className={dataTableCardRowVariants()}>
                    <span className={dataTableCardLabelVariants()}>
                      {typeof header === 'string' ? header : cell.column.id}
                    </span>
                    <span className={dataTableCardValueVariants()}>{content}</span>
                  </div>
                );
              })}
          </div>
        ))}
      </div>

      {/* Tablet and up: the real table. */}
      <div className={cn(dataTableFrameVariants(), 'hidden md:block')}>
        <div className={dataTableScrollVariants()}>
          <table className={dataTableVariants()}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const sortable = header.column.getCanSort();
                    const direction = header.column.getIsSorted();

                    return (
                      <th
                        key={header.id}
                        scope="col"
                        aria-sort={direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : undefined}
                        onClick={sortable ? header.column.getToggleSortingHandler() : undefined}
                        className={dataTableHeadCellVariants({ density, sortable })}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sortable ? (
                            direction === 'asc' ? (
                              <ArrowUp size={13} aria-hidden />
                            ) : direction === 'desc' ? (
                              <ArrowDown size={13} aria-hidden />
                            ) : (
                              <ChevronsUpDown size={13} aria-hidden className="opacity-40" />
                            )
                          ) : null}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={onRowClick === undefined ? undefined : () => onRowClick(row.original)}
                  className={dataTableRowVariants({
                    clickable: onRowClick !== undefined,
                    selected: isRowSelected?.(row.original) ?? false,
                  })}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={dataTableCellVariants({ density })}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {paginated ? (
        <Pagination
          pageIndex={table.getState().pagination.pageIndex}
          pageCount={table.getPageCount()}
          onPageChange={(pageIndex) => table.setPageIndex(pageIndex)}
          total={total}
        />
      ) : null}
    </div>
  );
}
