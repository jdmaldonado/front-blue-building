import { useBuildings } from '@bb/logic';
import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import { AppRoute } from '../../app/navigation';
import { Alert, Card, Loading, Logo } from '../../ui';

// Temporary list so an admin can reach a building. It will be replaced by the
// real admin panel.
export function AdminBuildingsPage() {
  const buildings = useBuildings();

  return (
    <main className="min-h-dvh bg-(--surface-base) p-4 text-(--text-primary) sm:p-6">
      <header className="mx-auto flex max-w-3xl items-center gap-3 pb-4">
        <Logo size="sm" />
        <div className="flex flex-col">
          <span className="font-display text-title-sm font-bold tracking-tight">Edificios</span>
          <span className="text-label text-(--text-muted)">Elige uno para ver su dashboard</span>
        </div>
      </header>

      <div className="mx-auto flex max-w-3xl flex-col gap-2">
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
                <span className="truncate text-body font-medium">{building.name}</span>
                <span className="truncate text-label text-(--text-muted)">
                  {[building.city, building.address1].filter(Boolean).join(' · ') || building.id}
                </span>
              </div>
              <ChevronRight size={18} className="ml-auto shrink-0 text-(--text-muted)" />
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
