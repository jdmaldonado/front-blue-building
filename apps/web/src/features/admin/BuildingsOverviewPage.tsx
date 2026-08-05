import { isBuildingInMaintenance, type Building } from '@bb/core';
import { useBuildings, useBuildingsHealth } from '@bb/logic';
import { useNavigate } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { Building2 } from 'lucide-react';
import { useMemo } from 'react';
import { AppRoute } from '../../app/navigation';
import { Alert, DataTable, DataTableToolbar, EmptyState, Text, useDataTableFilters } from '../../ui';
import { ReaderHealthDot } from '../readers';
import { BuildingActions, BuildingStatusBadge } from './components';

export function BuildingsOverviewPage() {
  const buildings = useBuildings();
  const navigate = useNavigate();
  const filters = useDataTableFilters();
  const healthOf = useBuildingsHealth();

  const columns = useMemo<Array<ColumnDef<Building, unknown>>>(
    () => [
      {
        id: 'name',
        accessorFn: (building) => building.name,
        header: 'Edificio',
        meta: { primary: true },
        cell: ({ row }) => (
          <div className="flex min-w-0 flex-col">
            <Text as="span" weight="medium" truncate>
              {row.original.name}
            </Text>
            <Text as="span" size="label" tone="muted" truncate>
              {[row.original.city, row.original.address1].filter(Boolean).join(' · ') || row.original.id}
            </Text>
          </div>
        ),
      },
      {
        id: 'status',
        accessorFn: (building) => (isBuildingInMaintenance(building) ? 'mantenimiento' : 'activo'),
        header: 'Estado',
        meta: {
          filter: {
            label: 'Estado',
            options: [
              { value: 'activo', label: 'Activo' },
              { value: 'mantenimiento', label: 'En mantenimiento' },
            ],
          },
        },
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <BuildingStatusBadge building={row.original} />
            <ReaderHealthDot health={healthOf(row.original.id)} />
          </div>
        ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { actions: true },
        cell: ({ row }) => (
          // Stops the click from opening the building underneath.
          <div className="flex justify-end" onClick={(event) => event.stopPropagation()}>
            <BuildingActions building={row.original} />
          </div>
        ),
      },
    ],
    [],
  );

  if (buildings.isError) {
    return (
      <Alert variant="error" title="No pudimos cargar los edificios">
        Revisa tu conexión e intenta de nuevo.
      </Alert>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <DataTableToolbar
        columns={columns}
        filters={filters}
        searchPlaceholder="Buscar por nombre o ciudad"
        searchLabel="Buscar edificios"
      />

      <DataTable
        columns={columns}
        data={buildings.data ?? []}
        isPending={buildings.isPending}
        filters={filters}
        getRowId={(building) => building.id}
        onRowClick={(building) => {
          void navigate({ to: AppRoute.AdminBuilding, params: { buildingId: building.id } });
        }}
        total={buildings.data === undefined ? undefined : `${buildings.data.length} edificios`}
        empty={
          <EmptyState
            icon={Building2}
            title="No hay edificios que coincidan"
            description="Prueba con otro nombre o borra la búsqueda."
          />
        }
      />
    </div>
  );
}
