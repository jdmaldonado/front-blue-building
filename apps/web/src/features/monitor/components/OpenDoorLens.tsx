import { EventOrigin, type OpenDoorEvent } from '@bb/core';
import { useOpenDoorEvents } from '@bb/logic';
import type { ColumnDef } from '@tanstack/react-table';
import { DoorOpen, Image as ImageIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Alert, Badge, Button, DataTable, Dialog, EmptyState, Pagination, Text } from '../../../ui';
import { useServerPagination } from '../hooks';
import { formatEventDate } from '../lib';

type OpenDoorLensProps = {
  buildingId: string | null;
};

const PAGE_SIZE = 40;

export function OpenDoorLens({ buildingId }: OpenDoorLensProps) {
  const pagination = useServerPagination(PAGE_SIZE);
  const events = useOpenDoorEvents({ buildingId, page: pagination.page, limit: pagination.limit });
  const [photo, setPhoto] = useState<OpenDoorEvent | null>(null);

  const columns = useMemo<Array<ColumnDef<OpenDoorEvent, unknown>>>(
    () => [
      {
        id: 'door',
        accessorFn: (row) => row.doorName ?? '',
        header: 'Puerta',
        meta: { primary: true },
        cell: ({ row }) => (
          <div className="flex min-w-0 flex-col">
            <Text as="span" weight="medium" truncate>
              {row.original.doorName ?? 'Puerta sin nombre'}
            </Text>
            <Text as="span" size="label" tone="muted" truncate>
              {formatEventDate(row.original.timestampEvent ?? row.original.createdAt)}
            </Text>
          </div>
        ),
      },
      {
        id: 'user',
        accessorFn: (row) => row.userName ?? '',
        header: 'Residente',
        cell: ({ row }) => (
          <Text as="span" size="body-sm" tone="secondary" truncate>
            {row.original.userName ?? '—'}
          </Text>
        ),
      },
      {
        id: 'origin',
        // The API sends it as `eventOrigin`. The old panel reads `origin`, which
        // is why that column is always empty there.
        accessorFn: (row) => row.eventOrigin ?? '',
        header: 'Origen',
        cell: ({ row }) => (
          <Badge tone={row.original.eventOrigin === EventOrigin.App ? 'accent' : 'neutral'} size="sm">
            {row.original.eventOrigin === EventOrigin.App ? 'App' : 'Lectora'}
          </Badge>
        ),
      },
      {
        id: 'apartment',
        accessorFn: (row) => row.apartment ?? '',
        header: 'Apartamento',
        meta: { hideOnMobile: true },
        cell: ({ row }) => (
          <Text as="span" size="body-sm" tone="muted">
            {row.original.apartment ?? '—'}
          </Text>
        ),
      },
      {
        id: 'building',
        accessorFn: (row) => row.buildingName ?? '',
        header: 'Edificio',
        meta: { hideOnMobile: true },
        cell: ({ row }) => (
          <Text as="span" size="body-sm" tone="muted" truncate>
            {row.original.buildingName ?? '—'}
          </Text>
        ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { actions: true },
        cell: ({ row }) =>
          row.original.imageUrl === null || row.original.imageUrl === undefined ? (
            <Text as="span" size="label" tone="muted">
              Sin foto
            </Text>
          ) : (
            <div className="flex justify-end">
              <Button intent="neutral" appearance="outline" size="sm" onClick={() => setPhoto(row.original)}>
                <ImageIcon size={16} />
                Ver foto
              </Button>
            </div>
          ),
      },
    ],
    [],
  );

  if (events.isError) {
    return (
      <Alert variant="error" title="No pudimos cargar las aperturas">
        Revisa tu conexión e intenta de nuevo.
      </Alert>
    );
  }

  const page = events.data;

  return (
    <div className="flex flex-col gap-4">
      {page !== undefined && page.skipped > 0 ? (
        <Alert variant="warning" title={`${page.skipped} aperturas no se pudieron leer`}>
          Sus datos no traen identificador, así que no aparecen en la lista.
        </Alert>
      ) : null}

      <DataTable
        columns={columns}
        data={page?.items ?? []}
        isPending={events.isPending}
        total={page === undefined ? undefined : `${page.totalRecords} aperturas`}
        empty={
          <EmptyState icon={DoorOpen} title="Sin aperturas" description="No hay aperturas de puerta registradas." />
        }
      />

      {page === undefined || page.totalPages <= 1 ? null : (
        <Pagination pageIndex={pagination.pageIndex} pageCount={page.totalPages} onPageChange={pagination.goTo} />
      )}

      <Dialog
        open={photo !== null}
        onClose={() => setPhoto(null)}
        size="md"
        title="Captura de la apertura"
        description={photo?.doorName ?? undefined}
      >
        {photo?.imageUrl === null || photo?.imageUrl === undefined ? null : (
          <img src={photo.imageUrl} alt="" className="w-full border border-(--card-border) object-contain" />
        )}
      </Dialog>
    </div>
  );
}
