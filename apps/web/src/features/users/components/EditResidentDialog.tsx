import type { ResidentDetails } from '@bb/core';
import { useEffect, useState, type SubmitEvent } from 'react';
import { Button, Dialog, Field, Input, Text } from '../../../ui';

type EditResidentDialogProps = {
  resident: ResidentDetails | null;
  pending: boolean;
  onClose: () => void;
  onSave: (phone: string) => void;
};

// Only the phone can change here. Name, document, email and role are read only
// in this panel, same as in the old one.
export function EditResidentDialog({ resident, pending, onClose, onSave }: EditResidentDialogProps) {
  const [phone, setPhone] = useState('');

  useEffect(() => {
    setPhone(resident?.phone ?? '');
  }, [resident]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSave(phone.trim());
  }

  return (
    <Dialog
      open={resident !== null}
      onClose={onClose}
      size="sm"
      title="Editar teléfono"
      description={resident?.name}
      footer={
        <>
          <Button appearance="ghost" intent="neutral" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="edit-resident" loading={pending} disabled={phone.trim() === ''}>
            Guardar
          </Button>
        </>
      }
    >
      <form id="edit-resident" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Teléfono" htmlFor="resident-phone">
          <Input
            id="resident-phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            inputMode="tel"
            autoComplete="tel"
          />
        </Field>

        <Text size="body-sm" tone="secondary">
          Es el número al que llegan los mensajes y las llamadas de los eventos del edificio.
        </Text>
      </form>
    </Dialog>
  );
}
