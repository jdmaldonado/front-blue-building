import type { ResidentDetails } from '@bb/core';
import { useResidentMutations } from '@bb/logic';
import { useCallback, useState } from 'react';
import { useToast } from '../../../app/ToastProvider';

export interface ResidentActionsController {
  editing: ResidentDetails | null;
  toggling: ResidentDetails | null;
  pending: boolean;
  startEdit: (resident: ResidentDetails) => void;
  cancelEdit: () => void;
  saveEdit: (phone: string) => void;
  startToggle: (resident: ResidentDetails) => void;
  cancelToggle: () => void;
  confirmToggle: (withCards: boolean) => void;
}

export function useResidentActions(): ResidentActionsController {
  const toast = useToast();
  const { update, setActive } = useResidentMutations();
  const [editing, setEditing] = useState<ResidentDetails | null>(null);
  const [toggling, setToggling] = useState<ResidentDetails | null>(null);

  const saveEdit = useCallback(
    (phone: string) => {
      if (editing === null) {
        return;
      }

      update.mutate(
        { userId: editing.id, phone },
        {
          onSuccess: () => {
            setEditing(null);
            toast({ tone: 'success', title: 'Teléfono actualizado' });
          },
          onError: () => {
            toast({ tone: 'error', title: 'No pudimos guardar el cambio', message: 'Intenta de nuevo.' });
          },
        },
      );
    },
    [editing, toast, update],
  );

  const confirmToggle = useCallback(
    (withCards: boolean) => {
      if (toggling === null) {
        return;
      }

      const active = toggling.active !== true;
      setActive.mutate(
        { userId: toggling.id, active, withCards },
        {
          onSuccess: () => {
            setToggling(null);
            toast({ tone: 'success', title: active ? 'Usuario activado' : 'Usuario desactivado' });
          },
          onError: () => {
            toast({ tone: 'error', title: 'No pudimos cambiar el estado', message: 'Intenta de nuevo.' });
          },
        },
      );
    },
    [setActive, toast, toggling],
  );

  return {
    editing,
    toggling,
    pending: update.isPending || setActive.isPending,
    startEdit: setEditing,
    cancelEdit: () => setEditing(null),
    saveEdit,
    startToggle: setToggling,
    cancelToggle: () => setToggling(null),
    confirmToggle,
  };
}
