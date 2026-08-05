import { useResidents } from '@bb/logic';
import { useMemo } from 'react';
import { useBuilding } from '../../app/BuildingContext';
import { ResidentsTable, SkippedResidentsAlert } from './components';

// TODO: the API has no "residents of a building" endpoint, so we read every
// resident of every building and match by name. Name is the only link the DTO
// gives us: it carries no building id. With enough users this gets slow.
// Proposal filed in docs 07-abierto/propuestas-panel-admin.md.
export function BuildingResidentsPage() {
  const building = useBuilding();
  const residents = useResidents();

  const ofBuilding = useMemo(
    () => residents.data?.residents.filter((resident) => resident.buildingName === building.name),
    [residents.data, building.name],
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <SkippedResidentsAlert count={residents.data?.skipped} />

      <ResidentsTable
        residents={ofBuilding}
        isPending={residents.isPending}
        isError={residents.isError}
        showBuilding={false}
        emptyTitle="Sin residentes en este edificio"
      />
    </div>
  );
}
