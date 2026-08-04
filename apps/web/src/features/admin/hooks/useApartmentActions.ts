import type { Apartment } from '@bb/core';
import { useRetireApartment } from '@bb/logic';
import { useCallback } from 'react';
import { useConfirm } from '../../../app/ConfirmProvider';
import { useToast } from '../../../app/ToastProvider';

export interface ApartmentActionsController {
  retire: (apartment: Apartment) => void;
  pending: boolean;
}

export function useApartmentActions(buildingId: string): ApartmentActionsController {
  const confirm = useConfirm();
  const toast = useToast();
  const retireApartment = useRetireApartment();

  const retire = useCallback(
    (apartment: Apartment) => {
      void (async () => {
        const confirmed = await confirm({
          title: `¿Dar de baja ${apartment.name ?? 'el apartamento'}?`,
          description:
            'Se borran las tarjetas de sus residentes, quedan como ex residentes y se crea un apartamento vacío con el mismo nombre. No se puede deshacer.',
          confirmLabel: 'Dar de baja',
          intent: 'destructive',
        });
        if (!confirmed) {
          return;
        }

        retireApartment.mutate(
          { buildingId, apartmentId: apartment.id },
          {
            onSuccess: () => {
              toast({
                tone: 'success',
                title: 'Apartamento dado de baja',
                message: 'Sus residentes quedaron como ex residentes.',
              });
            },
            onError: () => {
              toast({ tone: 'error', title: 'No pudimos dar de baja el apartamento', message: 'Intenta de nuevo.' });
            },
          },
        );
      })();
    },
    [buildingId, confirm, retireApartment, toast],
  );

  return { retire, pending: retireApartment.isPending };
}
