import { isBuildingInMaintenance, type Building } from '@bb/core';
import { useBuildings } from '@bb/logic';
import { useNavigate } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { Building2, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AppRoute } from '../../app/navigation';
import { Alert, DataTable, EmptyState, Input, Text } from '../../ui';
import { BuildingActions, BuildingStatusBadge } from './components';

export function BuildingsOverviewPage() {
  const buildings = useBuildings();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

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
        cell: ({ row }) => <BuildingStatusBadge building={row.original} />,
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
      <div className="relative">
        <Search size={16} aria-hidden className="absolute top-1/2 left-3 -translate-y-1/2 text-(--text-muted)" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por nombre o ciudad"
          aria-label="Buscar edificios"
          className="pl-9"
        />
      </div>

      <DataTable
        columns={columns}
        data={buildings.data ?? []}
        isPending={buildings.isPending}
        globalFilter={search}
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
