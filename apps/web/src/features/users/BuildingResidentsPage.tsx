import { useResidents } from '@bb/logic';
import { useBuilding } from '../../app/BuildingContext';
import { ResidentsTable, SkippedResidentsAlert } from './components';

export function BuildingResidentsPage() {
  const building = useBuilding();
  const residents = useResidents(building.id);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <SkippedResidentsAlert count={residents.data?.skipped} />

      <ResidentsTable
        residents={residents.data?.residents}
        isPending={residents.isPending}
        isError={residents.isError}
        showBuilding={false}
        emptyTitle="Sin residentes en este edificio"
      />
    </div>
  );
}
