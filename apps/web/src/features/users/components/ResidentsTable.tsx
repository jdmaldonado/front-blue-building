import { RoleType, type ResidentDetails } from '@bb/core';
import type { ColumnDef } from '@tanstack/react-table';
import { Pencil, Power, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ROLE_LABEL } from '../../account/lib';
import { UserCardsDialog } from '../../cards';
import {
  Alert,
  Avatar,
  Badge,
  DataTable,
  DataTableToolbar,
  EmptyState,
  IconButton,
  Text,
  Tooltip,
  useDataTableFilters,
} from '../../../ui';
import { useResidentActions } from '../hooks';
import { residentSearchText } from '../lib';
import { EditResidentDialog } from './EditResidentDialog';
import { ToggleResidentDialog } from './ToggleResidentDialog';

type ResidentsTableProps = {
  residents: ResidentDetails[] | undefined;
  isPending: boolean;
  isError: boolean;
  // Inside a building or an apartment those columns repeat the same value in
  // every row, so the caller hides them.
  showBuilding?: boolean;
  showApartment?: boolean;
  emptyTitle?: string;
};

export function ResidentsTable({
  residents,
  isPending,
  isError,
  showBuilding = true,
  showApartment = true,
  emptyTitle = 'Sin usuarios',
}: ResidentsTableProps) {
  const actions = useResidentActions();
  const filters = useDataTableFilters();
  // Looking at someone's cards is not a change of task, so it does not become a
  // change of screen: no navigation, nothing to come back from.
  const [cardsOf, setCardsOf] = useState<ResidentDetails | null>(null);

  const columns = useMemo<Array<ColumnDef<ResidentDetails, unknown>>>(() => {
    const list: Array<ColumnDef<ResidentDetails, unknown>> = [
      {
        id: 'name',
        accessorFn: residentSearchText,
        header: 'Usuario',
        meta: { primary: true },
        cell: ({ row }) => (
          <div className="flex min-w-0 items-center gap-3">
            <Avatar src={row.original.photo ?? undefined} name={row.original.name} size="sm" />
            <div className="flex min-w-0 flex-col">
              <Text as="span" weight="medium" truncate>
                {row.original.name}
              </Text>
              <Text as="span" size="label" tone="muted" truncate className="font-mono">
                {row.original.cedula}
              </Text>
            </div>
          </div>
        ),
      },
      {
        id: 'role',
        accessorFn: (resident) =>
          resident.roleName === null || resident.roleName === undefined ? '' : ROLE_LABEL[resident.roleName],
        header: 'Rol',
        meta: {
          filter: {
            label: 'Rol',
            options: Object.values(RoleType).map((role) => ({ value: ROLE_LABEL[role], label: ROLE_LABEL[role] })),
          },
        },
        cell: ({ row }) => (
          <Text as="span" size="body-sm" tone="secondary">
            {row.original.roleName === null || row.original.roleName === undefined
              ? '—'
              : ROLE_LABEL[row.original.roleName]}
          </Text>
        ),
      },
    ];

    if (showApartment) {
      list.push({
        id: 'apartment',
        accessorFn: (resident) => resident.apartmentName ?? '',
        header: 'Apartamento',
        cell: ({ row }) => (
          <Text as="span" size="body-sm" tone="secondary">
            {row.original.apartmentName ?? '—'}
          </Text>
        ),
      });
    }

    if (showBuilding) {
      list.push({
        id: 'building',
        accessorFn: (resident) => resident.buildingName ?? '',
        header: 'Edificio',
        cell: ({ row }) => (
          <Text as="span" size="body-sm" tone="secondary">
            {row.original.buildingName ?? '—'}
          </Text>
        ),
      });
    }

    list.push(
      {
        id: 'cards',
        accessorFn: (resident) => resident.tags.length,
        header: 'Tarjetas',
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => setCardsOf(row.original)}
            aria-label={`Ver las tarjetas de ${row.original.name}`}
            className="font-mono text-body-sm text-(--accent) underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-(--border-focus) focus-visible:outline-none"
          >
            {row.original.tags.length}
          </button>
        ),
      },
      {
        id: 'state',
        accessorFn: (resident) => (resident.active === true ? 'activo' : 'inactivo'),
        header: 'Estado',
        meta: {
          filter: {
            label: 'Estado',
            options: [
              { value: 'activo', label: 'Activo' },
              { value: 'inactivo', label: 'Inactivo' },
            ],
          },
        },
        cell: ({ row }) => (
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone={row.original.active === true ? 'success' : 'neutral'} size="sm" dot>
              {row.original.active === true ? 'Activo' : 'Inactivo'}
            </Badge>
            {row.original.verified === true ? null : (
              <Tooltip content="Sin foto ni cédula cargadas. No se le pueden crear tarjetas.">
                <Badge tone="warning" size="sm">
                  Sin validar
                </Badge>
              </Tooltip>
            )}
          </div>
        ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { actions: true },
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <IconButton
              label={`Editar teléfono de ${row.original.name}`}
              onClick={() => actions.startEdit(row.original)}
            >
              <Pencil size={16} />
            </IconButton>
            <IconButton
              label={`${row.original.active === true ? 'Desactivar' : 'Activar'} a ${row.original.name}`}
              tone={row.original.active === true ? 'destructive' : 'accent'}
              onClick={() => actions.startToggle(row.original)}
            >
              <Power size={16} />
            </IconButton>
          </div>
        ),
      },
    );

    return list;
  }, [actions, showApartment, showBuilding]);

  if (isError) {
    return (
      <Alert variant="error" title="No pudimos cargar los usuarios">
        Revisa tu conexión e intenta de nuevo.
      </Alert>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <DataTableToolbar
        columns={columns}
        filters={filters}
        searchPlaceholder="Buscar por nombre, documento, correo, apartamento o tarjeta"
        searchLabel="Buscar usuarios"
      />

      <DataTable
        columns={columns}
        data={residents ?? []}
        isPending={isPending}
        filters={filters}
        getRowId={(resident) => resident.id}
        pageSize={25}
        total={residents === undefined ? undefined : `${residents.length} usuarios`}
        empty={
          <EmptyState icon={Users} title={emptyTitle} description="Prueba con otra búsqueda o revisa más adelante." />
        }
      />

      <UserCardsDialog
        user={cardsOf === null ? null : { cedula: cardsOf.cedula, name: cardsOf.name }}
        onClose={() => setCardsOf(null)}
      />

      <EditResidentDialog
        resident={actions.editing}
        pending={actions.pending}
        onClose={actions.cancelEdit}
        onSave={actions.saveEdit}
      />

      <ToggleResidentDialog
        resident={actions.toggling}
        pending={actions.pending}
        onClose={actions.cancelToggle}
        onConfirm={actions.confirmToggle}
      />
    </div>
  );
}
