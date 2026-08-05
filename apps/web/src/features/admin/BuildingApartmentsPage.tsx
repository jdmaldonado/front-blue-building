import type { Apartment } from '@bb/core';
import { useApartments } from '@bb/logic';
import { Link } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { Home, Search, Trash2, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useBuilding } from '../../app/BuildingContext';
import { AppRoute } from '../../app/navigation';
import { Alert, Badge, DataTable, EmptyState, IconButton, Input, Text, Tooltip } from '../../ui';
import { useApartmentActions } from './hooks';

export function BuildingApartmentsPage() {
  const building = useBuilding();
  const buildingId = building.id;
  const apartments = useApartments(buildingId);
  const actions = useApartmentActions(buildingId);
  const [search, setSearch] = useState('');

  const columns = useMemo<Array<ColumnDef<Apartment, unknown>>>(
    () => [
      {
        id: 'name',
        accessorFn: (apartment) => apartment.name ?? '',
        header: 'Apartamento',
        meta: { primary: true },
        cell: ({ row }) => (
          <Text as="span" weight="medium">
            {row.original.name ?? 'Sin nombre'}
          </Text>
        ),
      },
      {
        id: 'type',
        accessorFn: (apartment) => apartment.apartmentType ?? '',
        header: 'Tipo',
        cell: ({ row }) => (
          <Text as="span" size="body-sm" tone="secondary">
            {row.original.apartmentType ?? '—'}
          </Text>
        ),
      },
      {
        id: 'active',
        accessorFn: (apartment) => (apartment.active === true ? 'activo' : 'inactivo'),
        header: 'Citófono',
        cell: ({ row }) => (
          <Tooltip content="Un apartamento se activa cuando se aprueba la solicitud del propietario. Solo los activos reciben llamadas desde portería.">
            <Badge tone={row.original.active === true ? 'success' : 'neutral'} size="sm" dot>
              {row.original.active === true ? 'Activo' : 'Inactivo'}
            </Badge>
          </Tooltip>
        ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { actions: true },
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Link to={AppRoute.AdminBuildingApartmentUsers} params={{ buildingId, apartmentId: row.original.id }}>
              <IconButton label={`Ver residentes de ${row.original.name ?? 'apartamento'}`}>
                <Users size={16} />
              </IconButton>
            </Link>
            <IconButton
              label={`Dar de baja ${row.original.name ?? 'apartamento'}`}
              tone="destructive"
              disabled={actions.pending}
              onClick={() => actions.retire(row.original)}
            >
              <Trash2 size={16} />
            </IconButton>
          </div>
        ),
      },
    ],
    [actions, buildingId],
  );

  if (apartments.isError) {
    return (
      <Alert variant="error" title="No pudimos cargar los apartamentos">
        Revisa tu conexión e intenta de nuevo.
      </Alert>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <div className="relative">
        <Search size={16} aria-hidden className="absolute top-1/2 left-3 -translate-y-1/2 text-(--text-muted)" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar apartamento"
          aria-label="Buscar apartamentos"
          className="pl-9"
        />
      </div>

      <DataTable
        columns={columns}
        data={apartments.data ?? []}
        isPending={apartments.isPending}
        globalFilter={search}
        getRowId={(apartment) => apartment.id}
        total={apartments.data === undefined ? undefined : `${apartments.data.length} apartamentos`}
        empty={
          <EmptyState
            icon={Home}
            title="Sin apartamentos"
            description="Este edificio no tiene apartamentos registrados, o ninguno coincide con la búsqueda."
          />
        }
      />
    </div>
  );
}
