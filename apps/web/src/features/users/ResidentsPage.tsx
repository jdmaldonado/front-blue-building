import { useResidents } from '@bb/logic';
import { ResidentsTable } from './components';

// Every resident of every building.
export function ResidentsPage() {
  const residents = useResidents();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      <ResidentsTable
        residents={residents.data}
        isPending={residents.isPending}
        isError={residents.isError}
        emptyTitle="Sin residentes registrados"
      />
    </div>
  );
}
