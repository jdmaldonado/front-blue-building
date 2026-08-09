import type { AccessRequest } from '@bb/core';
import { Check, X } from 'lucide-react';
import { Avatar, Button, Card, Text } from '../../../ui';

type AccessRequestCardProps = {
  request: AccessRequest;
  disabled: boolean;
  onResolve: (approved: boolean) => void;
};

// The API sends no photo, so the avatar falls back to the initials.
export function AccessRequestCard({ request, disabled, onResolve }: AccessRequestCardProps) {
  const { user, apartment } = request;
  const place = apartment === null || apartment === undefined ? null : apartmentLabel(apartment);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <Avatar name={user.name} size="md" />
        <div className="flex min-w-0 flex-col">
          <Text as="span" weight="semibold" truncate>
            {user.name}
          </Text>
          <Text as="span" size="body-sm" tone="secondary">
            Documento {user.cedula}
          </Text>
          {place === null ? null : (
            <Text as="span" size="body-sm" tone="secondary">
              {place}
            </Text>
          )}
        </div>
      </div>

      <dl className="flex flex-col gap-1">
        <Detail label="Teléfono" value={user.phone} />
        <Detail label="Correo" value={user.email} />
      </dl>

      <div className="flex flex-wrap gap-2">
        <Button intent="success" disabled={disabled} onClick={() => onResolve(true)}>
          <Check size={16} aria-hidden />
          Aprobar
        </Button>
        <Button appearance="outline" intent="destructive" disabled={disabled} onClick={() => onResolve(false)}>
          <X size={16} aria-hidden />
          Rechazar
        </Button>
      </div>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value?: string | null }) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return (
    <div className="flex gap-2">
      <dt className="text-(--text-muted) text-body-sm">{label}</dt>
      <dd className="text-body-sm">{value}</dd>
    </div>
  );
}

function apartmentLabel(apartment: NonNullable<AccessRequest['apartment']>): string {
  const parts = [apartment.floor?.tower?.name, apartment.floor?.name, apartment.name].filter(
    (part): part is string => typeof part === 'string' && part !== '',
  );
  return parts.length === 0 ? 'Apartamento sin nombre' : parts.join(' · ');
}
