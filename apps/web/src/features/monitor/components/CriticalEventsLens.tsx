import { IncidentStatus, eventMeta, type CriticalEvent } from '@bb/core';
import { useCriticalEvents } from '@bb/logic';
import { ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Alert, EmptyState, Loading, Select, Text } from '../../../ui';
import { useIncidentActions } from '../hooks';
import { CriticalEventCard } from './CriticalEventCard';
import { EventCameraDialog } from './EventCameraDialog';
import { ResolveIncidentDialog } from './ResolveIncidentDialog';

type CriticalEventsLensProps = {
  // Set when the monitor is opened from inside a building.
  buildingId: string | null;
};

const STATE_OPTIONS = [
  { value: '', label: 'Estado: todos' },
  { value: 'pending', label: 'Pendientes' },
  { value: IncidentStatus.InProgress, label: 'En curso' },
  { value: IncidentStatus.Done, label: 'Resueltos' },
];

// Fifteen most recent, no paging: filtering here is honest because the whole
// list is on screen.
export function CriticalEventsLens({ buildingId }: CriticalEventsLensProps) {
  const events = useCriticalEvents();
  const actions = useIncidentActions();
  const [state, setState] = useState('');
  const [watching, setWatching] = useState<CriticalEvent | null>(null);

  const visible = useMemo(() => {
    const all = events.data?.events ?? [];
    const ofBuilding = buildingId === null ? all : all.filter((event) => event.buildingId === buildingId);

    if (state === '') {
      return ofBuilding;
    }
    if (state === 'pending') {
      return ofBuilding.filter((event) => event.status === null || event.status === undefined);
    }
    return ofBuilding.filter((event) => event.status === state);
  }, [events.data, buildingId, state]);

  if (events.isPending) {
    return <Loading label="Cargando eventos..." />;
  }

  if (events.isError) {
    return (
      <Alert variant="error" title="No pudimos cargar los eventos">
        Revisa tu conexión e intenta de nuevo.
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          aria-label="Estado del evento"
          options={STATE_OPTIONS}
          value={state}
          onChange={setState}
          className="sm:w-auto"
        />
        <Text as="span" size="label" tone="muted">
          {visible.length} de {events.data?.events.length ?? 0} eventos
        </Text>
      </div>

      {events.data !== undefined && events.data.skipped > 0 ? (
        <Alert variant="warning" title={`${events.data.skipped} eventos no se pudieron leer`}>
          Sus datos no traen identificador ni tipo, así que no aparecen en la lista.
        </Alert>
      ) : null}

      {visible.length === 0 ? (
        <EmptyState
          icon={ShieldCheck}
          title="Nada que atender"
          description="No hay eventos críticos que coincidan con este filtro."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((event) => (
            <CriticalEventCard
              key={`${event.id}-${eventMeta(event.type).label}`}
              event={event}
              pending={actions.pending}
              onStart={actions.start}
              onResolve={actions.startResolve}
              onViewCamera={setWatching}
            />
          ))}
        </div>
      )}

      <EventCameraDialog event={watching} onClose={() => setWatching(null)} />

      <ResolveIncidentDialog
        event={actions.resolving}
        pending={actions.pending}
        onClose={actions.cancelResolve}
        onConfirm={actions.confirmResolve}
      />
    </div>
  );
}
