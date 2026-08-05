import type { ResidentDetails } from '@bb/core';
import { useEffect, useState } from 'react';
import { Alert, Button, Checkbox, Dialog, Text } from '../../../ui';

type ToggleResidentDialogProps = {
  resident: ResidentDetails | null;
  pending: boolean;
  onClose: () => void;
  onConfirm: (withCards: boolean) => void;
};

export function ToggleResidentDialog({ resident, pending, onClose, onConfirm }: ToggleResidentDialogProps) {
  const [withCards, setWithCards] = useState(true);
  const activating = resident?.active !== true;
  const cardCount = resident?.tags.length ?? 0;

  useEffect(() => {
    setWithCards(true);
  }, [resident]);

  return (
    <Dialog
      open={resident !== null}
      onClose={onClose}
      size="sm"
      title={activating ? 'Activar usuario' : 'Desactivar usuario'}
      description={resident?.name}
      footer={
        <>
          <Button appearance="ghost" intent="neutral" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            intent={activating ? 'primary' : 'destructive'}
            loading={pending}
            onClick={() => onConfirm(withCards)}
          >
            {activating ? 'Activar' : 'Desactivar'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Text size="body-sm" tone="secondary">
          {activating
            ? 'El usuario vuelve a poder entrar con su tarjeta física.'
            : 'El usuario deja de poder entrar con su tarjeta física.'}
        </Text>

        {activating ? null : (
          <Alert variant="warning" title="No bloquea la app">
            Desactivar cierra la puerta física, pero el usuario puede seguir abriendo desde la aplicación.
          </Alert>
        )}

        {cardCount === 0 ? null : (
          <Checkbox
            checked={withCards}
            onChange={setWithCards}
            label={activating ? 'Activar también sus tarjetas' : 'Desactivar también sus tarjetas'}
            description={`Tiene ${cardCount} ${cardCount === 1 ? 'tarjeta' : 'tarjetas'}. No se borran, solo cambian de estado.`}
          />
        )}
      </div>
    </Dialog>
  );
}
