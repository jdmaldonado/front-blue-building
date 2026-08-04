import type { Building } from '@bb/core';
import { Link } from '@tanstack/react-router';
import { ChevronRight, DoorOpen } from 'lucide-react';
import { AppRoute } from '../../app/navigation';
import { Card, Text } from '../../ui';
import { BuildingStatusBadge } from './components';

type BuildingSummaryPageProps = {
  building: Building;
};

// Landing of a building: what is going on, then where to go. The doors and
// cameras screen is the same one a resident sees, one click away.
export function BuildingSummaryPage({ building }: BuildingSummaryPageProps) {
  const details = [
    { label: 'Ciudad', value: building.city },
    { label: 'Dirección', value: building.address1 },
    { label: 'Tipo', value: building.type },
  ].filter((detail) => detail.value !== null && detail.value !== undefined && detail.value !== '');

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <Card className="flex flex-col gap-3">
        <Text size="label" tone="muted">
          Estado
        </Text>
        <BuildingStatusBadge building={building} />
        <Text size="body-sm" tone="secondary">
          Todavía no sabemos si el equipo del edificio está conectado. Llegará cuando la API lo publique.
        </Text>
      </Card>

      {details.length === 0 ? null : (
        <Card className="flex flex-col gap-3">
          <Text size="label" tone="muted">
            Datos
          </Text>
          <dl className="flex flex-col gap-2">
            {details.map((detail) => (
              <div key={detail.label} className="flex items-start justify-between gap-3">
                <dt className="text-body-sm text-(--text-secondary)">{detail.label}</dt>
                <dd className="text-right text-body-sm text-(--text-primary)">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      )}

      <Link
        to={AppRoute.AdminBuildingLive}
        params={{ buildingId: building.id }}
        className="rounded-(--card-radius) focus-visible:ring-2 focus-visible:ring-(--border-focus) focus-visible:outline-none"
      >
        <Card padding="sm" className="flex items-center gap-3 hover:border-(--border-strong)">
          <DoorOpen size={18} aria-hidden className="shrink-0 text-(--text-secondary)" />
          <div className="flex min-w-0 flex-col">
            <Text as="span" weight="medium">
              Puertas y cámaras
            </Text>
            <Text as="span" size="label" tone="muted">
              Abrir puertas y ver las cámaras en vivo
            </Text>
          </div>
          <ChevronRight size={18} aria-hidden className="ml-auto shrink-0 text-(--text-muted)" />
        </Card>
      </Link>
    </div>
  );
}
