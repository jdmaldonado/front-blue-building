import { CardType, type Card } from '@bb/core';
import { useEffect, useState, type SubmitEvent } from 'react';
import { Button, Dialog, Field, Input, Select, Switch, Text } from '../../../ui';
import { CARD_TYPE_OPTIONS } from '../lib';

type EditCardDialogProps = {
  card: Card | null;
  pending: boolean;
  onClose: () => void;
  onSave: (input: { tag: string; type: CardType; active: boolean }) => void;
};

export function EditCardDialog({ card, pending, onClose, onSave }: EditCardDialogProps) {
  const [tag, setTag] = useState('');
  const [type, setType] = useState<CardType>(CardType.Person);
  const [active, setActive] = useState(true);

  useEffect(() => {
    setTag(card?.tag ?? '');
    setType(card?.type ?? CardType.Person);
    setActive(card?.active ?? true);
  }, [card]);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSave({ tag: tag.trim(), type, active });
  };

  return (
    <Dialog
      open={card !== null}
      onClose={onClose}
      size="sm"
      title="Editar tarjeta"
      footer={
        <>
          <Button appearance="ghost" intent="neutral" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="edit-card" loading={pending} disabled={tag.trim() === ''}>
            Guardar
          </Button>
        </>
      }
    >
      <form id="edit-card" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Número de la tarjeta" htmlFor="edit-card-tag">
          <Input
            id="edit-card-tag"
            value={tag}
            onChange={(event) => setTag(event.target.value)}
            className="font-mono"
            autoComplete="off"
          />
        </Field>

        <Field label="Tipo" htmlFor="edit-card-type">
          <Select id="edit-card-type" options={CARD_TYPE_OPTIONS} value={type} onChange={setType} />
        </Field>

        <Switch checked={active} onChange={setActive} label="Tarjeta activa" />
        <Text size="body-sm" tone="secondary">
          Una tarjeta inactiva no abre puertas, pero sigue registrada.
        </Text>
      </form>
    </Dialog>
  );
}
