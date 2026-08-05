import { useApartmentResidents } from '@bb/logic';
import { ResidentsTable, SkippedResidentsAlert } from './components';

type ApartmentResidentsPageProps = {
  apartmentId: string;
};

export function ApartmentResidentsPage({ apartmentId }: ApartmentResidentsPageProps) {
  const residents = useApartmentResidents(apartmentId);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <SkippedResidentsAlert count={residents.data?.skipped} />

      <ResidentsTable
        residents={residents.data?.residents}
        isPending={residents.isPending}
        isError={residents.isError}
        showBuilding={false}
        showApartment={false}
        emptyTitle="Sin residentes en este apartamento"
      />
    </div>
  );
}
