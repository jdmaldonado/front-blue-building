import type { IntrusionEvent } from '@bb/core';
import { useIntrusionEvents } from '@bb/logic';
import type { ColumnDef } from '@tanstack/react-table';
import { Images, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Alert, Button, DataTable, EmptyState, Pagination, Text } from '../../../ui';
import { useServerPagination } from '../hooks';
import { formatEventDate } from '../lib';
import { IntrusionSequenceDialog } from './IntrusionSequenceDialog';

type IntrusionsLensProps = {
  buildingId: string | null;
};

// Ten per page: the endpoint loads the whole table into memory before slicing,
// so asking for more only makes it slower.
const PAGE_SIZE = 10;

export function IntrusionsLens({ buildingId }: IntrusionsLensProps) {
  const pagination = useServerPagination(PAGE_SIZE);
  const intrusions = useIntrusionEvents({ buildingId, page: pagination.page, limit: pagination.limit });
  const [selected, setSelected] = useState<IntrusionEvent | null>(null);

  const columns = useMemo<Array<ColumnDef<IntrusionEvent, unknown>>>(
    () => [
      {
        id: 'camera',
        accessorFn: (row) => row.cameraName ?? '',
        header: 'Cámara',
        meta: { primary: true },
        cell: ({ row }) => (
          <Text as="span" weight="medium" truncate>
            {row.original.cameraName ?? 'Cámara sin nombre'}
          </Text>
        ),
      },
      {
        id: 'building',
        accessorFn: (row) => row.buildingName ?? '',
        header: 'Edificio',
        cell: ({ row }) => (
          <Text as="span" size="body-sm" tone="secondary" truncate>
            {row.original.buildingName ?? '—'}
          </Text>
        ),
      },
      {
        id: 'start',
        accessorFn: (row) => row.startTime ?? '',
        header: 'Inicio',
        cell: ({ row }) => (
          <Text as="span" size="body-sm" tone="secondary">
            {formatEventDate(row.original.startTime)}
          </Text>
        ),
      },
      {
        id: 'end',
        accessorFn: (row) => row.endTime ?? '',
        header: 'Fin',
        meta: { hideOnMobile: true },
        cell: ({ row }) => (
          <Text as="span" size="body-sm" tone="muted">
            {formatEventDate(row.original.endTime)}
          </Text>
        ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { actions: true },
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button intent="neutral" appearance="outline" size="sm" onClick={() => setSelected(row.original)}>
              <Images size={16} />
              {row.original.imageUrls.length} fotos
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  if (intrusions.isError) {
    return (
      <Alert variant="error" title="No pudimos cargar las intrusiones">
        Revisa tu conexión e intenta de nuevo.
      </Alert>
    );
  }

  const page = intrusions.data;

  return (
    <div className="flex flex-col gap-4">
      {page !== undefined && page.skipped > 0 ? (
        <Alert variant="warning" title={`${page.skipped} secuencias no se pudieron leer`}>
          Sus datos no traen identificador, así que no aparecen en la lista.
        </Alert>
      ) : null}

      <DataTable
        columns={columns}
        data={page?.items ?? []}
        isPending={intrusions.isPending}
        getRowId={(row) => row.id}
        total={page === undefined ? undefined : `${page.totalRecords} secuencias`}
        empty={
          <EmptyState
            icon={ShieldCheck}
            title="Sin intrusiones"
            description="No hay secuencias de intrusión registradas."
          />
        }
      />

      {page === undefined || page.totalPages <= 1 ? null : (
        <Pagination pageIndex={pagination.pageIndex} pageCount={page.totalPages} onPageChange={pagination.goTo} />
      )}

      <IntrusionSequenceDialog event={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
