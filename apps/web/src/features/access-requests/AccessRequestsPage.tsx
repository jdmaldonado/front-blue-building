import { ApprovalScope } from '@bb/core';
import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { EmptyState, Tabs, Text, type TabItem } from '../../ui';
import { AccessRequestsList } from './components';
import { useApprovalPlaces } from './hooks';

// One screen for the two approvals of the old panel: the leader of an apartment
// answering its residents, and the administrator of a building answering the
// leaders. Whoever is both sees one tab per place.
export function AccessRequestsPage() {
  const places = useApprovalPlaces();
  const [selected, setSelected] = useState(0);

  if (places.length === 0) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="No apruebas solicitudes"
        description="Solo el líder de un apartamento y el administrador del edificio responden solicitudes de acceso."
      />
    );
  }

  const place = places[selected] ?? places[0];
  if (place === undefined) {
    return null;
  }

  const tabs: ReadonlyArray<TabItem<string>> = places.map((item, index) => ({
    value: String(index),
    label: item.label,
  }));

  return (
    <div className="flex flex-col gap-4">
      <Text as="p" tone="secondary">
        {scopeHint(place.scope)}
      </Text>

      {places.length > 1 ? (
        <Tabs items={tabs} value={String(selected)} onChange={(value) => setSelected(Number(value))} label="Espacios" />
      ) : null}

      <AccessRequestsList place={place} />
    </div>
  );
}

function scopeHint(scope: ApprovalScope): string {
  switch (scope) {
    case ApprovalScope.Apartment:
      return 'Personas que pidieron entrar a tu apartamento. Al aprobar, quedan como residentes.';
    case ApprovalScope.Building:
      return 'Personas que pidieron quedar como líder de un apartamento de tu edificio.';
  }
}
