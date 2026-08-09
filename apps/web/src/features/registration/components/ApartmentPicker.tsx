import { APARTMENT_LIST_ACTIVE, type ApartmentRole } from '@bb/core';
import {
  useRegistrationApartments,
  useRegistrationBuildings,
  useRegistrationFloors,
  useRegistrationTowers,
} from '@bb/logic';
import { useEffect } from 'react';
import { Alert, Field, Loading, Select, Text, type SelectOption } from '../../../ui';
import { sortByLabel } from '../lib';

// The four ids the picker walks through. Only `apartmentId` reaches the API;
// the other three are how it gets there.
export type ApartmentSelection = {
  buildingId: string;
  towerId: string;
  floorId: string;
  apartmentId: string;
};

export const EMPTY_SELECTION: ApartmentSelection = {
  buildingId: '',
  towerId: '',
  floorId: '',
  apartmentId: '',
};

type ApartmentPickerProps = {
  role: ApartmentRole;
  value: ApartmentSelection;
  onChange: (next: ApartmentSelection) => void;
  disabled?: boolean;
  error?: string;
};

export function ApartmentPicker({ role, value, onChange, disabled = false, error }: ApartmentPickerProps) {
  const active = APARTMENT_LIST_ACTIVE[role];

  const buildings = useRegistrationBuildings();
  const towers = useRegistrationTowers(value.buildingId === '' ? null : value.buildingId);
  const floors = useRegistrationFloors(value.towerId === '' ? null : value.towerId);
  const apartments = useRegistrationApartments(value.floorId === '' ? null : value.floorId, active);

  // A building alone is not a choice. The old form did the same
  // (front/src/views/Apartment/ownerRegister.js:56-62).
  const onlyBuilding = buildings.data?.length === 1 ? buildings.data[0] : undefined;
  useEffect(() => {
    if (onlyBuilding !== undefined && value.buildingId === '') {
      onChange({ ...EMPTY_SELECTION, buildingId: onlyBuilding.id });
    }
  }, [onlyBuilding, value.buildingId, onChange]);

  if (buildings.isPending) {
    return <Loading label="Cargando edificios..." />;
  }

  if (buildings.isError) {
    return (
      <Alert variant="error" title="No pudimos cargar los edificios">
        Revisa tu conexión y recarga la página.
      </Alert>
    );
  }

  const emptyApartments = apartments.isSuccess && apartments.data.length === 0;

  return (
    <div className="flex flex-col gap-3.5">
      <Field label="Edificio" htmlFor="buildingId" required>
        <Select
          id="buildingId"
          options={toOptions(buildings.data, 'Selecciona el edificio')}
          value={value.buildingId}
          disabled={disabled}
          onChange={(buildingId) => onChange({ ...EMPTY_SELECTION, buildingId })}
        />
      </Field>

      <Field label="Torre" htmlFor="towerId" required>
        <Select
          id="towerId"
          options={toOptions(towers.data ?? [], 'Selecciona la torre')}
          value={value.towerId}
          disabled={disabled || value.buildingId === '' || towers.isPending}
          onChange={(towerId) => onChange({ ...value, towerId, floorId: '', apartmentId: '' })}
        />
      </Field>

      <Field label="Piso" htmlFor="floorId" required>
        <Select
          id="floorId"
          options={toOptions(floors.data ?? [], 'Selecciona el piso')}
          value={value.floorId}
          disabled={disabled || value.towerId === '' || floors.isPending}
          onChange={(floorId) => onChange({ ...value, floorId, apartmentId: '' })}
        />
      </Field>

      <Field label="Apartamento" htmlFor="apartmentId" required error={error}>
        <Select
          id="apartmentId"
          options={toOptions(apartments.data ?? [], 'Selecciona el apartamento')}
          value={value.apartmentId}
          disabled={disabled || value.floorId === '' || apartments.isPending}
          aria-invalid={error !== undefined}
          aria-describedby={error ? 'apartmentId-error' : undefined}
          onChange={(apartmentId) => onChange({ ...value, apartmentId })}
        />
      </Field>

      {emptyApartments ? (
        <Text as="span" size="body-sm" tone="secondary">
          {active
            ? 'Este piso no tiene apartamentos activos. Elige otro piso o habla con la administración.'
            : 'En este piso no queda ningún apartamento por reclamar. Si el tuyo ya está registrado, entra como residente.'}
        </Text>
      ) : null}
    </div>
  );
}

type Named = { id: string; name?: string | null };

// A row without a name still has to be pickable: the id is what the API needs.
// The placeholder stays first; only the real options get sorted.
function toOptions(items: readonly Named[], placeholder: string): ReadonlyArray<SelectOption<string>> {
  const options = items.map((item) => ({ value: item.id, label: item.name ?? `Sin nombre (${item.id})` }));
  return [{ value: '', label: placeholder }, ...sortByLabel(options)];
}
