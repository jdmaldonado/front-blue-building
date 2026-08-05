import type { Card } from '@bb/core';
import { useCardMutations } from '@bb/logic';
import { useState } from 'react';
import { useConfirm } from '../../../app/ConfirmProvider';
import { useToast } from '../../../app/ToastProvider';
import { cardErrorMessage } from '../lib';

export interface CardEditInput {
  tag: string;
  type: Card['type'];
  active: boolean;
}

export interface CardActionsController {
  editing: Card | null;
  pending: boolean;
  startEdit: (card: Card) => void;
  cancelEdit: () => void;
  saveEdit: (input: CardEditInput) => void;
  remove: (card: Card) => void;
}

// Edit and delete of a card, with their confirmations and their messages. The
// full screen and the dialog opened from the users table share it, so the two
// can never drift apart.
export function useCardActions(): CardActionsController {
  const [editing, setEditing] = useState<Card | null>(null);
  const { update, remove } = useCardMutations();
  const confirm = useConfirm();
  const toast = useToast();

  const requestRemove = async (card: Card): Promise<void> => {
    const confirmed = await confirm({
      title: '¿Borrar la tarjeta?',
      description: `La tarjeta ${card.tag} se borra para siempre: no hay forma de recuperarla.`,
      confirmLabel: 'Borrar',
      intent: 'destructive',
    });
    if (!confirmed) {
      return;
    }

    remove.mutate(card.id, {
      onSuccess: () => toast({ tone: 'success', title: 'Tarjeta borrada', message: `Se eliminó ${card.tag}.` }),
      onError: (error) =>
        toast({ tone: 'error', title: 'No pudimos borrar la tarjeta', message: cardErrorMessage(error) }),
    });
  };

  const requestSave = async (input: CardEditInput): Promise<void> => {
    if (editing === null || input.type === null || input.type === undefined) {
      return;
    }

    const confirmed = await confirm({
      title: '¿Guardar los cambios?',
      description: 'Cambiar el número o desactivar la tarjeta cambia a qué puertas abre desde ya.',
      confirmLabel: 'Guardar',
    });
    if (!confirmed) {
      return;
    }

    update.mutate(
      { cardId: editing.id, tag: input.tag, type: input.type, active: input.active },
      {
        onSuccess: () => {
          setEditing(null);
          toast({ tone: 'success', title: 'Tarjeta actualizada' });
        },
        onError: (error) =>
          toast({ tone: 'error', title: 'No pudimos actualizar la tarjeta', message: cardErrorMessage(error) }),
      },
    );
  };

  return {
    editing,
    pending: update.isPending,
    startEdit: setEditing,
    cancelEdit: () => setEditing(null),
    saveEdit: (input) => void requestSave(input),
    remove: (card) => void requestRemove(card),
  };
}
