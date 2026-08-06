import { ReaderHealth, readerHealthFromState, type Door, type ReaderConfig } from '@bb/core';
import { selectDoorStatus, useBuildingDoors, useDoorStatuses, useReaderControl } from '@bb/logic';
import type { ColumnDef } from '@tanstack/react-table';
import { Cpu, RotateCw, Settings2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useBuilding } from '../../app/BuildingContext';
import { useConfirm } from '../../app/ConfirmProvider';
import { useToast } from '../../app/ToastProvider';
import { Alert, DataTable, DataTableToolbar, EmptyState, IconButton, Text, useDataTableFilters } from '../../ui';
import { ReaderBoardStatus, ReaderConfigDialog } from './components';
import { READER_HEALTH_META, READER_SENT_MESSAGE, readerErrorMessage } from './lib';

export function ReadersPage() {
  const building = useBuilding();
  const doors = useBuildingDoors(building.id);
  const statuses = useDoorStatuses(building.id);
  const filters = useDataTableFilters();
  const confirm = useConfirm();
  const toast = useToast();
  const [configuring, setConfiguring] = useState<Door | null>(null);

  const control = useReaderControl(building.id, {
    onSuccess: () => {
      setConfiguring(null);
      toast({ tone: 'info', title: 'Orden enviada', message: READER_SENT_MESSAGE });
    },
    onError: (_command, error) => {
      toast({ tone: 'error', title: 'La lectora no respondió', message: readerErrorMessage(error) });
    },
  });

  // A reader is a door wired to hardware. A door without `localId` has none.
  const readers = useMemo(
    () => (doors.data ?? []).filter((door) => door.localId !== null && door.localId !== undefined),
    [doors.data],
  );

  const healthOf = (door: Door): ReaderHealth => {
    const status = selectDoorStatus(statuses.data, door.id);
    const event = statuses.data?.[door.id];
    // The reader reports its own state; the door status is the fallback.
    return readerHealthFromState(event?.masterStatus ?? (event === undefined ? null : status));
  };

  const requestReboot = async (door: Door): Promise<void> => {
    const confirmed = await confirm({
      title: '¿Reiniciar la lectora?',
      description: `${door.name ?? 'La lectora'} deja de leer tarjetas mientras arranca.`,
      confirmLabel: 'Reiniciar',
      intent: 'destructive',
    });
    if (confirmed && door.localId !== null && door.localId !== undefined) {
      control.reboot(door.localId);
    }
  };

  const requestConfig = async (config: ReaderConfig): Promise<void> => {
    const localId = configuring?.localId;
    if (localId === null || localId === undefined) {
      return;
    }
    const confirmed = await confirm({
      title: '¿Enviar la configuración?',
      description: `Cambia el comportamiento físico de ${configuring?.name ?? 'la lectora'}. No se puede leer lo que tiene puesto ahora, así que no hay a qué volver.`,
      confirmLabel: 'Enviar',
      intent: 'destructive',
    });
    if (confirmed) {
      control.configure(localId, config);
    }
  };

  const columns = useMemo<Array<ColumnDef<Door, unknown>>>(
    () => [
      {
        id: 'name',
        accessorFn: (door) => door.name ?? '',
        header: 'Lectora',
        meta: { primary: true },
        cell: ({ row }) => (
          <div className="flex min-w-0 flex-col">
            <Text as="span" weight="medium" truncate>
              {row.original.name ?? 'Sin nombre'}
            </Text>
            <Text as="span" size="label" className="font-mono text-(--accent)">
              {row.original.localId}
            </Text>
          </div>
        ),
      },
      {
        id: 'health',
        accessorFn: (door) => READER_HEALTH_META[healthOf(door)].label,
        header: 'Estado',
        meta: {
          filter: {
            label: 'Estado',
            options: Object.values(ReaderHealth).map((health) => ({
              value: READER_HEALTH_META[health].label,
              label: READER_HEALTH_META[health].label,
            })),
          },
        },
        // Both boards, each with its own state and its own SPI: a reader can be
        // online and still not read a card if its chip bus is down.
        cell: ({ row }) => {
          const event = statuses.data?.[row.original.id];
          const boards = event?.readerState?.readers;
          return (
            <div className="flex flex-col gap-1.5">
              <ReaderBoardStatus
                title="Maestra"
                state={event?.masterStatus ?? boards?.master?.state}
                spiOk={event?.masterSpiOk ?? boards?.master?.spi_ok}
              />
              <ReaderBoardStatus
                title="Esclava"
                state={event?.slaveStatus ?? boards?.slave?.state}
                spiOk={event?.slaveSpiOk ?? boards?.slave?.spi_ok}
              />
            </div>
          );
        },
      },
      {
        id: 'firmware',
        accessorFn: (door) => statuses.data?.[door.id]?.readerState?.readers?.master?.firmware_version ?? '',
        header: 'Firmware',
        meta: { hideOnMobile: true },
        cell: ({ row }) => (
          <Text as="span" size="body-sm" tone="muted" className="font-mono">
            {statuses.data?.[row.original.id]?.readerState?.readers?.master?.firmware_version ?? '—'}
          </Text>
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
              label={`Configurar ${row.original.name ?? 'la lectora'}`}
              onClick={() => setConfiguring(row.original)}
              disabled={control.pending !== null}
            >
              <Settings2 size={16} />
            </IconButton>
            <IconButton
              label={`Reiniciar ${row.original.name ?? 'la lectora'}`}
              tone="destructive"
              onClick={() => void requestReboot(row.original)}
              disabled={control.pending !== null}
            >
              <RotateCw size={16} />
            </IconButton>
          </div>
        ),
      },
    ],
    // The status map changes with every frame and the cells read it directly.
    [statuses.data, control.pending],
  );

  if (doors.isError) {
    return (
      <Alert variant="error" title="No pudimos cargar las lectoras">
        Revisa tu conexión e intenta de nuevo.
      </Alert>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <DataTableToolbar
        columns={columns}
        filters={filters}
        searchPlaceholder="Buscar lectora"
        searchLabel="Buscar lectoras"
      />

      <DataTable
        columns={columns}
        data={readers}
        isPending={doors.isPending}
        filters={filters}
        getRowId={(door) => door.id}
        total={`${readers.length} lectoras`}
        empty={
          <EmptyState
            icon={Cpu}
            title="Sin lectoras"
            description="Este edificio no tiene puertas conectadas a una lectora."
          />
        }
      />

      <ReaderConfigDialog
        door={configuring}
        reported={configuring === null ? null : (statuses.data?.[configuring.id]?.readerState ?? null)}
        pending={control.pending !== null}
        onClose={() => setConfiguring(null)}
        onSend={(config: ReaderConfig) => void requestConfig(config)}
      />
    </div>
  );
}
