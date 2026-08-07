import { eventMeta, type CriticalEvent } from '@bb/core';
import { useEffect, useState, type SubmitEvent } from 'react';
import { Button, Dialog, Field, Textarea } from '../../../ui';

type ResolveIncidentDialogProps = {
  event: CriticalEvent | null;
  pending: boolean;
  onClose: () => void;
  onConfirm: (comment: string) => void;
};

// One box per event. The old panel kept a single `solutionComment` in the page
// state, so typing in one card wrote it into every other open one.
export function ResolveIncidentDialog({ event, pending, onClose, onConfirm }: ResolveIncidentDialogProps) {
  const [comment, setComment] = useState('');

  useEffect(() => {
    setComment('');
  }, [event]);

  const handleSubmit = (submit: SubmitEvent<HTMLFormElement>): void => {
    submit.preventDefault();
    onConfirm(comment.trim());
  };

  return (
    <Dialog
      open={event !== null}
      onClose={onClose}
      size="sm"
      title="Cerrar el evento"
      description={event === null ? undefined : eventMeta(event.type).label}
      footer={
        <>
          <Button appearance="ghost" intent="neutral" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" form="resolve-incident" loading={pending} disabled={comment.trim() === ''}>
            Cerrar evento
          </Button>
        </>
      }
    >
      <form id="resolve-incident" onSubmit={handleSubmit}>
        <Field label="¿Qué se hizo?" htmlFor="incident-solution" hint="Queda guardado en el historial del evento.">
          <Textarea
            id="incident-solution"
            value={comment}
            onChange={(change) => setComment(change.target.value)}
            rows={4}
          />
        </Field>
      </form>
    </Dialog>
  );
}
