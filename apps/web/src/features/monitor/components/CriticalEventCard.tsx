import { EventOrigin, IncidentStatus, LiveOrigin, type CriticalEvent } from '@bb/core';
import { Link } from '@tanstack/react-router';
import { CheckCircle2, DoorOpen, MessageCircle, Building2, Video } from 'lucide-react';
import { AppRoute } from '../../../app/navigation';
import { Badge, Button, Card, Text, buttonVariants } from '../../../ui';
import { eventBadge, formatEventDate, incidentLabel, incidentTone } from '../lib';

type CriticalEventCardProps = {
  event: CriticalEvent;
  pending: boolean;
  onStart: (event: CriticalEvent) => void;
  onResolve: (event: CriticalEvent) => void;
  onViewCamera: (event: CriticalEvent) => void;
};

export function CriticalEventCard({ event, pending, onStart, onResolve, onViewCamera }: CriticalEventCardProps) {
  const badge = eventBadge(event.type);
  const isOpen = event.status === IncidentStatus.InProgress;
  const isDone = event.status === IncidentStatus.Done;
  const fromApp = event.origin === EventOrigin.App;
  const hasBuilding = event.buildingId !== null && event.buildingId !== undefined;
  // Events with no door — a medical emergency from the app — have no camera to
  // offer. The door is also what the live screen needs to open the right one.
  const hasDoor = event.door !== null && event.door !== undefined && event.door !== '';

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={badge.tone} dot pulse={!isDone && badge.tone === 'danger'}>
              {badge.label}
            </Badge>
            <Badge tone={incidentTone(event.status)}>{incidentLabel(event.status)}</Badge>
          </div>
          <Text size="body-sm" tone="secondary">
            {formatEventDate(event.createdAt)}
          </Text>
        </div>

        {hasBuilding && event.buildingId !== null && event.buildingId !== undefined ? (
          <div className="flex flex-wrap gap-2">
            {hasDoor ? (
              <Button size="sm" appearance="outline" intent="neutral" onClick={() => onViewCamera(event)}>
                <Video size={16} />
                Ver cámara
              </Button>
            ) : null}

            <Link
              to={AppRoute.AdminBuildingLive}
              params={{ buildingId: event.buildingId }}
              search={{ doorName: event.door ?? undefined, from: LiveOrigin.Monitor }}
              className={buttonVariants({ intent: 'neutral', appearance: 'outline', size: 'sm' })}
            >
              <Building2 size={16} />
              Ver edificio
            </Link>
          </div>
        ) : null}
      </div>

      <dl className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
        <Detail label="Edificio" value={event.buildingName} />
        <Detail label="Puerta" value={event.door} icon />
        {fromApp ? <Detail label="Reportado por" value={event.userName} /> : null}
        {fromApp ? <Detail label="Apartamento" value={event.apartment} /> : null}
      </dl>

      {event.supportUserName === null || event.supportUserName === undefined ? null : (
        <Text size="body-sm" tone="secondary">
          Atiende {event.supportUserName} · {formatEventDate(event.incidentUpdatedAt)}
        </Text>
      )}

      {isDone && event.solutionComment !== null && event.solutionComment !== undefined ? (
        <div className="border border-(--card-border) bg-(--surface-sunken) px-3 py-2">
          <Text size="body-sm">{event.solutionComment}</Text>
        </div>
      ) : null}

      {isDone ? null : (
        <div className="flex flex-wrap gap-2">
          {isOpen ? (
            <Button size="sm" onClick={() => onResolve(event)} disabled={pending}>
              <CheckCircle2 size={16} />
              Cerrar evento
            </Button>
          ) : (
            <Button size="sm" onClick={() => onStart(event)} disabled={pending}>
              Atender
            </Button>
          )}

          {/* Separate from opening the incident. In the old panel the same click
              did both, so a resident who never answered still left one open. */}
          {fromApp && event.userPhone !== null && event.userPhone !== undefined ? (
            <a
              href={`https://wa.me/${event.userPhone}`}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ intent: 'neutral', appearance: 'outline', size: 'sm' })}
            >
              <MessageCircle size={16} />
              Contactar residente
            </a>
          ) : null}
        </div>
      )}
    </Card>
  );
}

function Detail({ label, value, icon = false }: { label: string; value: string | null | undefined; icon?: boolean }) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return (
    <div className="flex min-w-0 flex-col">
      <dt className="text-caption text-(--text-muted)">{label}</dt>
      <dd className="flex min-w-0 items-center gap-1.5 truncate text-body-sm">
        {icon ? <DoorOpen size={14} aria-hidden className="flex-none text-(--text-muted)" /> : null}
        {value}
      </dd>
    </div>
  );
}
