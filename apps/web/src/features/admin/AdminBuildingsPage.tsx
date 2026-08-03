import { useBuildings } from '@bb/logic';
import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { AppRoute } from '../../app/navigation';
import { Alert, Card, Loading, Text } from '../../ui';

// Temporary list so an admin can reach a building. It will be replaced by the
// real admin panel.
export function AdminBuildingsPage() {
  const buildings = useBuildings();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
      {buildings.isPending ? <Loading label="Cargando edificios..." /> : null}

      {buildings.isError ? (
        <Alert variant="error" title="No pudimos cargar los edificios">
          Revisa tu conexión e intenta de nuevo.
        </Alert>
      ) : null}

      {buildings.data?.length === 0 ? (
        <Alert variant="info" title="No hay edificios registrados">
          Crea uno desde el backoffice actual.
        </Alert>
      ) : null}

      {buildings.data?.map((building) => (
        <Link
          key={building.id}
          to={AppRoute.AdminBuilding}
          params={{ buildingId: building.id }}
          className="rounded-(--card-radius) focus-visible:ring-2 focus-visible:ring-(--border-focus) focus-visible:outline-none"
        >
          <Card padding="sm" className="flex items-center gap-3 hover:border-(--border-strong)">
            <div className="flex min-w-0 flex-col">
              <Text as="span" weight="medium" truncate>
                {building.name}
              </Text>
              <Text as="span" size="label" tone="muted" truncate>
                {[building.city, building.address1].filter(Boolean).join(' · ') || building.id}
              </Text>
            </div>
            <ChevronRight size={18} className="ml-auto shrink-0 text-(--text-muted)" />
          </Card>
        </Link>
      ))}
    </div>
  );
}
