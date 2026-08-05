import type { ColumnFiltersState, OnChangeFn } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';

export interface DataTableFiltersController {
  search: string;
  setSearch: (value: string) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  // Empty string means "no filter on this column".
  valueOf: (columnId: string) => string;
  setValue: (columnId: string, value: string) => void;
  isActive: boolean;
  clear: () => void;
}

// The state of the toolbar and the state of the table are the same thing, so it
// lives in one place and both read it. The view owns it and decides where the
// toolbar goes.
export function useDataTableFilters(): DataTableFiltersController {
  const [search, setSearch] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const valueOf = useCallback(
    (columnId: string) => {
      const found = columnFilters.find((filter) => filter.id === columnId);
      return typeof found?.value === 'string' ? found.value : '';
    },
    [columnFilters],
  );

  const setValue = useCallback((columnId: string, value: string) => {
    setColumnFilters((current) => {
      const rest = current.filter((filter) => filter.id !== columnId);
      return value === '' ? rest : [...rest, { id: columnId, value }];
    });
  }, []);

  const clear = useCallback(() => {
    setSearch('');
    setColumnFilters([]);
  }, []);

  return useMemo(
    () => ({
      search,
      setSearch,
      columnFilters,
      setColumnFilters,
      valueOf,
      setValue,
      isActive: search !== '' || columnFilters.length > 0,
      clear,
    }),
    [search, columnFilters, valueOf, setValue, clear],
  );
}
