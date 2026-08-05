import { useResidents } from '@bb/logic';
import { useMemo } from 'react';
import { useBuilding } from '../../app/BuildingContext';
import { Alert } from '../../ui';
import { ResidentsTable, SkippedResidentsAlert } from './components';

// The API has no "residents of a building" endpoint, so we read them all and
// match by name. It is the only link the DTO gives us: it carries no building
// id (docs 07-abierto/propuestas-panel-admin.md).
export function BuildingResidentsPage() {
  const building = useBuilding();
  const residents = useResidents();

  const ofBuilding = useMemo(
    () => residents.data?.residents.filter((resident) => resident.buildingName === building.name),
    [residents.data, building.name],
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <Alert variant="info" title="Lista filtrada en el navegador">
        Se cargan todos los residentes y se filtran por nombre del edificio. Con muchos usuarios puede tardar.
      </Alert>

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
