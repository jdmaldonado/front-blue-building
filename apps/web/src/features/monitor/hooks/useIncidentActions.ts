import { EventOrigin, IncidentStatus, eventMeta, type CriticalEvent } from '@bb/core';
import { useIncidentMutations, useSessionStore } from '@bb/logic';
import { useState } from 'react';
import { useConfirm } from '../../../app/ConfirmProvider';
import { useToast } from '../../../app/ToastProvider';
import { eventsErrorMessage } from '../lib';

export interface IncidentActionsController {
  // Which event is being written a solution for.
  resolving: CriticalEvent | null;
  pending: boolean;
  start: (event: CriticalEvent) => void;
  startResolve: (event: CriticalEvent) => void;
  cancelResolve: () => void;
  confirmResolve: (comment: string) => void;
}

// The reason the API stores for an incident. Built here and not on the server,
// same as the old panel, but without its `Por undefined del apartamento
// undefined` when the event came from the hardware.
function supportReason(event: CriticalEvent): string {
  const what = eventMeta(event.type).label;
  const where = event.buildingName ?? 'Edificio sin nombre';
  if (event.origin === EventOrigin.App && event.userName !== null && event.userName !== undefined) {
    const apartment =
      event.apartment === null || event.apartment === undefined ? '' : ` del apartamento ${event.apartment}`;
    return `${where}: ${what}. Reportado por ${event.userName}${apartment}.`;
  }
  return `${where}: ${what}. Reportado por el equipo del edificio.`;
}

export function useIncidentActions(): IncidentActionsController {
  const [resolving, setResolving] = useState<CriticalEvent | null>(null);
  const { start, resolve } = useIncidentMutations();
  const session = useSessionStore((state) => state.session);
  const confirm = useConfirm();
  const toast = useToast();

  const requestStart = async (event: CriticalEvent): Promise<void> => {
    // The user who attends comes from the session, not from localStorage as in
    // the old panel, where anyone could sign an incident with another name.
    if (session === null) {
      return;
    }

    const confirmed = await confirm({
      title: '¿Atender este evento?',
      description: `Quedará a tu nombre como responsable de ${eventMeta(event.type).label.toLowerCase()} en ${event.buildingName ?? 'el edificio'}.`,
      confirmLabel: 'Atender',
    });
    if (!confirmed) {
      return;
    }

    start.mutate(
      {
        eventId: event.id,
        supportUserId: session.user.id,
        supportUserName: session.user.name,
        supportReason: supportReason(event),
      },
      {
        onSuccess: () => toast({ tone: 'success', title: 'Evento en curso', message: 'Queda a tu nombre.' }),
        onError: (error) =>
          toast({ tone: 'error', title: 'No pudimos abrir el incidente', message: eventsErrorMessage(error) }),
      },
    );
  };

  const confirmResolve = (comment: string): void => {
    if (resolving === null) {
      return;
    }

    resolve.mutate(
      { eventId: resolving.id, solutionComment: comment },
      {
        onSuccess: () => {
          setResolving(null);
          toast({ tone: 'success', title: 'Evento resuelto' });
        },
        onError: (error) =>
          toast({ tone: 'error', title: 'No pudimos cerrar el incidente', message: eventsErrorMessage(error) }),
      },
    );
  };

  return {
    resolving,
    pending: start.isPending || resolve.isPending,
    start: (event) => void requestStart(event),
    startResolve: (event) => {
      if (event.status === IncidentStatus.InProgress) {
        setResolving(event);
      }
    },
    cancelResolve: () => setResolving(null),
    confirmResolve,
  };
}
