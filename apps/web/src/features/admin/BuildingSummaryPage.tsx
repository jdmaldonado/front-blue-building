import type { Building } from '@bb/core';
import { Link } from '@tanstack/react-router';
import { ChevronRight, DoorOpen, Home, Settings, type LucideIcon } from 'lucide-react';
import { AppRoute } from '../../app/navigation';
import { Card, Text } from '../../ui';
import { BuildingStatusBadge } from './components';

type BuildingSummaryPageProps = {
  building: Building;
};

// Landing of a building: what is going on, then where to go. The doors and
// cameras screen is the same one a resident sees, one click away.
export function BuildingSummaryPage({ building }: BuildingSummaryPageProps) {
  const sections: Array<{ to: AppRoute; icon: LucideIcon; title: string; description: string }> = [
    {
      to: AppRoute.AdminBuildingLive,
      icon: DoorOpen,
      title: 'Puertas y cámaras',
      description: 'Abrir puertas y ver las cámaras en vivo',
    },
    {
      to: AppRoute.AdminBuildingApartments,
      icon: Home,
      title: 'Apartamentos',
      description: 'Ver los apartamentos y darlos de baja',
    },
    {
      to: AppRoute.AdminBuildingSettings,
      icon: Settings,
      title: 'Ajustes',
      description: 'Mantenimiento, alarma y reinicio del equipo',
    },
  ];

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
        {/* TODO: show whether the building box is online. The API does not
            publish device status yet; a PR for reader status is on the way.
            Proposal filed in docs 07-abierto/propuestas-panel-admin.md. */}
        <BuildingStatusBadge building={building} />
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

      <div className="flex flex-col gap-2">
        {sections.map((section) => (
          <Link
            key={section.to}
            to={section.to}
            params={{ buildingId: building.id }}
            className="rounded-(--card-radius) focus-visible:ring-2 focus-visible:ring-(--border-focus) focus-visible:outline-none"
          >
            <Card padding="sm" className="flex items-center gap-3 hover:border-(--border-strong)">
              <section.icon size={18} aria-hidden className="shrink-0 text-(--text-secondary)" />
              <div className="flex min-w-0 flex-col">
                <Text as="span" weight="medium">
                  {section.title}
                </Text>
                <Text as="span" size="label" tone="muted">
                  {section.description}
                </Text>
              </div>
              <ChevronRight size={18} aria-hidden className="ml-auto shrink-0 text-(--text-muted)" />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
