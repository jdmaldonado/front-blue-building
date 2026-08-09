import { MonitorLens, type MonitorSearch } from '@bb/core';
import { eventKeys, useBuildings, useNewEventsSignal } from '@bb/logic';
import { useQueryClient } from '@tanstack/react-query';
import { RefreshCw } from 'lucide-react';
import { useMemo } from 'react';
import { IconButton, Select, Tabs, toSelectOptions, type TabItem } from '../../ui';
import { CriticalEventsLens, IntrusionsLens, NewEventsBanner, OpenDoorLens } from './components';

type MonitorPageProps = {
  search: MonitorSearch;
  onSearchChange: (next: MonitorSearch) => void;
  // Fixed when the monitor is a section of one building: the picker disappears.
  lockedBuildingId?: string;
};

const LENSES: ReadonlyArray<TabItem<MonitorLens>> = [
  { value: MonitorLens.Critical, label: 'Críticos' },
  { value: MonitorLens.Intrusions, label: 'Intrusiones' },
  { value: MonitorLens.OpenDoor, label: 'Puertas abiertas' },
];

export function MonitorPage({ search, onSearchChange, lockedBuildingId }: MonitorPageProps) {
  const lens = search.lens ?? MonitorLens.Critical;
  const buildingId = lockedBuildingId ?? search.buildingId ?? null;

  const buildings = useBuildings();
  const queryClient = useQueryClient();
  const signal = useNewEventsSignal(buildingId);

  const refresh = (): void => {
    signal.clear();
    void queryClient.invalidateQueries({ queryKey: eventKeys.all });
  };

  // Rebuilt on every render this list looks new to `Select` even when nothing
  // changed, and React re-renders it and every option with it.
  const buildingOptions = useMemo(
    () => toSelectOptions(buildings.data ?? [], { first: { value: '', label: 'Todos los edificios' } }),
    [buildings.data],
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Tabs
          items={LENSES}
          value={lens}
          onChange={(next) => onSearchChange({ ...search, lens: next })}
          label="Tipo de monitoreo"
          appearance="pill"
        />

        <div className="flex items-center gap-2 sm:ml-auto">
          {lockedBuildingId === undefined ? (
            <Select
              aria-label="Edificio"
              options={buildingOptions}
              value={buildingId ?? ''}
              onChange={(next) => onSearchChange({ ...search, buildingId: next === '' ? undefined : next })}
              className="sm:w-auto"
            />
          ) : null}
          <IconButton label="Actualizar" onClick={refresh}>
            <RefreshCw size={16} />
          </IconButton>
        </div>
      </div>

      {/* Only speaks when a building is selected: the live signal comes from
          that building's room. */}
      <NewEventsBanner count={signal.count} onRefresh={refresh} />

      {lens === MonitorLens.Critical ? <CriticalEventsLens buildingId={buildingId} /> : null}
      {lens === MonitorLens.Intrusions ? <IntrusionsLens buildingId={buildingId} /> : null}
      {lens === MonitorLens.OpenDoor ? <OpenDoorLens buildingId={buildingId} /> : null}
    </div>
  );
}
