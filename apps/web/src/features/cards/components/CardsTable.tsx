import { CardType, type Card } from '@bb/core';
import type { ColumnDef } from '@tanstack/react-table';
import { CreditCard, Pencil, Trash2 } from 'lucide-react';
import { useMemo } from 'react';
import {
  Alert,
  Badge,
  DataTable,
  DataTableToolbar,
  EmptyState,
  IconButton,
  Text,
  useDataTableFilters,
} from '../../../ui';
import { CARD_TYPE_LABEL } from '../lib';

type CardsTableProps = {
  cards: Card[] | undefined;
  isPending: boolean;
  // Records the API sent that we could not read. Zero is the normal case.
  skipped?: number;
  onEdit: (card: Card) => void;
  onRemove: (card: Card) => void;
};

export function CardsTable({ cards, isPending, skipped = 0, onEdit, onRemove }: CardsTableProps) {
  const filters = useDataTableFilters();

  const columns = useMemo<Array<ColumnDef<Card, unknown>>>(
    () => [
      {
        id: 'tag',
        accessorFn: (card) => card.tag,
        header: 'Número',
        meta: { primary: true },
        cell: ({ row }) => (
          <Text as="span" weight="medium" className="font-mono">
            {row.original.tag}
          </Text>
        ),
      },
      {
        id: 'type',
        accessorFn: (card) => (card.type === null || card.type === undefined ? '' : CARD_TYPE_LABEL[card.type]),
        header: 'Tipo',
        meta: {
          filter: {
            label: 'Tipo',
            options: [
              { value: CARD_TYPE_LABEL[CardType.Person], label: CARD_TYPE_LABEL[CardType.Person] },
              { value: CARD_TYPE_LABEL[CardType.Car], label: CARD_TYPE_LABEL[CardType.Car] },
            ],
          },
        },
        cell: ({ row }) => (
          <Text as="span" size="body-sm" tone="secondary">
            {row.original.type === null || row.original.type === undefined ? '—' : CARD_TYPE_LABEL[row.original.type]}
          </Text>
        ),
      },
      {
        id: 'lastUse',
        accessorFn: (card) => card.lastTimeUsed ?? '',
        header: 'Último uso',
        meta: { hideOnMobile: true },
        cell: ({ row }) => (
          <Text as="span" size="body-sm" tone="muted">
            {formatLastUse(row.original.lastTimeUsed)}
          </Text>
        ),
      },
      {
        id: 'state',
        accessorFn: (card) => (card.active === true ? 'activa' : 'inactiva'),
        header: 'Estado',
        meta: {
          filter: {
            label: 'Estado',
            options: [
              { value: 'activa', label: 'Activa' },
              { value: 'inactiva', label: 'Inactiva' },
            ],
          },
        },
        cell: ({ row }) => (
          <Badge tone={row.original.active === true ? 'success' : 'neutral'} size="sm" dot>
            {row.original.active === true ? 'Activa' : 'Inactiva'}
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        meta: { actions: true },
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <IconButton label={`Editar la tarjeta ${row.original.tag}`} onClick={() => onEdit(row.original)}>
              <Pencil size={16} />
            </IconButton>
            <IconButton
              label={`Borrar la tarjeta ${row.original.tag}`}
              tone="destructive"
              onClick={() => onRemove(row.original)}
            >
              <Trash2 size={16} />
            </IconButton>
          </div>
        ),
      },
    ],
    [onEdit, onRemove],
  );

  return (
    <div className="flex w-full flex-col gap-4">
      {skipped === 0 ? null : (
        <Alert
          variant="warning"
          title={skipped === 1 ? 'Una tarjeta no se pudo leer' : `${skipped} tarjetas no se pudieron leer`}
        >
          Sus datos no traen número o identificador, así que no aparecen en la lista.
        </Alert>
      )}

      <DataTableToolbar
        columns={columns}
        filters={filters}
        searchPlaceholder="Buscar por número"
        searchLabel="Buscar tarjetas"
      />

      <DataTable
        columns={columns}
        data={cards ?? []}
        isPending={isPending}
        filters={filters}
        getRowId={(card) => card.id}
        total={cards === undefined ? undefined : `${cards.length} tarjetas`}
        empty={
          <EmptyState
            icon={CreditCard}
            title="Sin tarjetas"
            description="Este usuario no tiene tarjetas registradas todavía."
          />
        }
      />
    </div>
  );
}

// The API sends the date in whatever shape it has stored.
function formatLastUse(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') {
    return 'Nunca';
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString('es-CO');
}
