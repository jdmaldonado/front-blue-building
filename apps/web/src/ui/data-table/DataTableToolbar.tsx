import type { ColumnDef, RowData } from '@tanstack/react-table';
import { Search, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../button';
import { cn } from '../cn';
import { Input } from '../input';
import { Select } from '../select';
import type { DataTableFiltersController } from './useDataTableFilters';

type DataTableToolbarProps<TData extends RowData> = {
  // The same columns the table gets: the filters are declared there, next to
  // the data they filter.
  columns: Array<ColumnDef<TData, unknown>>;
  filters: DataTableFiltersController;
  searchPlaceholder: string;
  searchLabel: string;
  // Anything the screen wants next to the filters.
  children?: ReactNode;
  className?: string;
};

export function DataTableToolbar<TData extends RowData>({
  columns,
  filters,
  searchPlaceholder,
  searchLabel,
  children,
  className,
}: DataTableToolbarProps<TData>) {
  const filterable = columns.flatMap((column) => {
    const filter = column.meta?.filter;
    return filter === undefined || column.id === undefined ? [] : [{ columnId: column.id, filter }];
  });

  return (
    <div className={cn('flex flex-col gap-2 sm:flex-row sm:items-center', className)}>
      <div className="relative min-w-0 flex-1">
        <Search size={16} aria-hidden className="absolute top-1/2 left-3 -translate-y-1/2 text-(--text-muted)" />
        <Input
          value={filters.search}
          onChange={(event) => filters.setSearch(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchLabel}
          className="pl-9"
        />
      </div>

      {filterable.map(({ columnId, filter }) => (
        <Select
          key={columnId}
          aria-label={filter.label}
          value={filters.valueOf(columnId)}
          onChange={(value) => filters.setValue(columnId, value)}
          options={[{ value: '', label: `${filter.label}: todos` }, ...filter.options]}
          className="sm:w-auto"
        />
      ))}

      {filters.isActive ? (
        <Button intent="neutral" appearance="ghost" onClick={filters.clear}>
          <X size={16} />
          Limpiar
        </Button>
      ) : null}

      {children}
    </div>
  );
}
