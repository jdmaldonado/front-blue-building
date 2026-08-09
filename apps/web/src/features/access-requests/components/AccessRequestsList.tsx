import { ApprovalScope, type ApprovalPlace } from '@bb/core';
import { useAccessRequests, useResolveAccessRequest } from '@bb/logic';
import { Inbox } from 'lucide-react';
import { useConfirm } from '../../../app/ConfirmProvider';
import { useToast } from '../../../app/ToastProvider';
import { Alert, EmptyState, Loading, Text } from '../../../ui';
import { accessRequestErrorMessage } from '../lib';
import { AccessRequestCard } from './AccessRequestCard';

type AccessRequestsListProps = {
  place: ApprovalPlace;
};

export function AccessRequestsList({ place }: AccessRequestsListProps) {
  const confirm = useConfirm();
  const toast = useToast();
  const requests = useAccessRequests(place.scope, place.spaceId);

  const resolve = useResolveAccessRequest({
    onSuccess: (input) => {
      toast({
        tone: input.approved ? 'success' : 'info',
        title: input.approved ? 'Solicitud aprobada' : 'Solicitud rechazada',
        message: input.approved ? 'La persona ya puede entrar y recibe un correo.' : 'La persona recibe un correo.',
      });
    },
    onError: (error) => {
      const message = accessRequestErrorMessage(error);
      toast({ tone: 'error', title: message.title, message: message.description });
    },
  });

  const handleResolve = async (requestId: string, name: string, approved: boolean) => {
    const confirmed = await confirm(
      approved
        ? {
            title: `¿Aprobar a ${name}?`,
            description: approvedDescription(place.scope),
            confirmLabel: 'Aprobar',
            intent: 'success',
          }
        : {
            title: `¿Rechazar a ${name}?`,
            description:
              'La solicitud desaparece de la lista y no se puede recuperar. Tendría que registrarse otra vez.',
            confirmLabel: 'Rechazar',
            intent: 'destructive',
          },
    );

    if (confirmed) {
      resolve.mutate({ scope: place.scope, spaceId: place.spaceId, requestId, approved });
    }
  };

  if (requests.isPending) {
    return <Loading label="Cargando solicitudes..." />;
  }

  if (requests.isError) {
    const message = accessRequestErrorMessage(requests.error);
    return (
      <Alert variant={message.variant} title={message.title}>
        {message.description}
      </Alert>
    );
  }

  if (requests.data.requests.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No hay solicitudes pendientes"
        description="Cuando alguien se registre en este espacio, aparecerá aquí para que la apruebes."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {requests.data.skipped > 0 ? (
        <Text as="span" size="body-sm" tone="secondary">
          {requests.data.skipped === 1
            ? 'Una solicitud no se pudo leer y no se muestra.'
            : `${requests.data.skipped} solicitudes no se pudieron leer y no se muestran.`}
        </Text>
      ) : null}

      {requests.data.requests.map((request) => (
        <AccessRequestCard
          key={request.id}
          request={request}
          disabled={resolve.isPending}
          onResolve={(approved) => void handleResolve(request.id, request.user.name, approved)}
        />
      ))}
    </div>
  );
}

function approvedDescription(scope: ApprovalScope): string {
  switch (scope) {
    case ApprovalScope.Apartment:
      return 'Queda como residente del apartamento y podrá abrir las puertas a las que tenga acceso.';
    case ApprovalScope.Building:
      return 'Queda como líder del apartamento, el apartamento se activa y esa persona podrá aprobar a sus residentes.';
  }
}
