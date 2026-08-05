import type { Apartment } from '@bb/core';
import { useApartments } from '@bb/logic';
import { Link } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { Home, Trash2, Users } from 'lucide-react';
import { useMemo } from 'react';
import { useBuilding } from '../../app/BuildingContext';
import { AppRoute } from '../../app/navigation';
import {
  Alert,
  Badge,
  DataTable,
  DataTableToolbar,
  EmptyState,
  IconButton,
  Text,
  Tooltip,
  useDataTableFilters,
} from '../../ui';
import { useApartmentActions } from './hooks';

export function BuildingApartmentsPage() {
  const building = useBuilding();
  const buildingId = building.id;
  const apartments = useApartments(buildingId);
  const actions = useApartmentActions(buildingId);
  const filters = useDataTableFilters();

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
        meta: {
          filter: {
            label: 'Tipo',
            options: [
              { value: 'APARTAMENT', label: 'Apartamento' },
              { value: 'BUSINESS', label: 'Local' },
              { value: 'INTERNAL', label: 'Interno' },
              { value: 'VISITOR', label: 'Visitante' },
            ],
          },
        },
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
        meta: {
          filter: {
            label: 'Citófono',
            options: [
              { value: 'activo', label: 'Activo' },
              { value: 'inactivo', label: 'Inactivo' },
            ],
          },
        },
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
      <DataTableToolbar
        columns={columns}
        filters={filters}
        searchPlaceholder="Buscar apartamento"
        searchLabel="Buscar apartamentos"
      />

      <DataTable
        columns={columns}
        data={apartments.data ?? []}
        isPending={apartments.isPending}
        filters={filters}
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
