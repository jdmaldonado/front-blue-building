import { UserNotFoundError, type Card, type CardsSearch } from '@bb/core';
import { useCardMutations, useCards, useUserByDocument } from '@bb/logic';
import { Plus, Search, UserSearch } from 'lucide-react';
import { useState, type SubmitEvent } from 'react';
import { useConfirm } from '../../app/ConfirmProvider';
import { useToast } from '../../app/ToastProvider';
import { Alert, Badge, Button, Card as Panel, EmptyState, Input, Loading, Text } from '../../ui';
import { CardRegisterDialog, CardsTable, EditCardDialog, UserValidatorForm } from './components';
import { cardErrorMessage } from './lib';

type CardsPageProps = {
  search: CardsSearch;
  // Writes back to the URL, so the screen can be shared and reloaded.
  onSearchChange: (next: CardsSearch) => void;
};

export function CardsPage({ search, onSearchChange }: CardsPageProps) {
  const document = search.document ?? '';
  const [draft, setDraft] = useState(document);
  const [editing, setEditing] = useState<Card | null>(null);
  const [registering, setRegistering] = useState(false);

  const user = useUserByDocument(document === '' ? null : document);
  const cards = useCards(user.data === undefined ? null : document);
  const { update, remove } = useCardMutations();
  const confirm = useConfirm();
  const toast = useToast();

  const handleLookup = (event: SubmitEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSearchChange({ ...search, document: draft.trim() });
  };

  const handleRemove = async (card: Card): Promise<void> => {
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

  const handleSaveEdit = async (input: { tag: string; type: Card['type']; active: boolean }): Promise<void> => {
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

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      <Panel className="flex flex-col gap-3">
        <Text weight="medium">Buscar a la persona</Text>
        <form onSubmit={handleLookup} className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search size={16} aria-hidden className="absolute top-1/2 left-3 -translate-y-1/2 text-(--text-muted)" />
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Documento"
              aria-label="Documento de la persona"
              inputMode="numeric"
              autoComplete="off"
              className="pl-9"
            />
          </div>
          <Button type="submit" disabled={draft.trim() === ''}>
            Buscar
          </Button>
        </form>
      </Panel>

      {document === '' ? (
        <EmptyState
          icon={UserSearch}
          title="Escribe un documento"
          description="Las tarjetas se administran por persona, así que primero hay que saber de quién."
        />
      ) : null}

      {document !== '' && user.isPending ? <Loading label="Buscando a la persona..." /> : null}

      {user.isError ? (
        <Alert
          variant={user.error instanceof UserNotFoundError ? 'warning' : 'error'}
          title={user.error instanceof UserNotFoundError ? 'Sin resultados' : 'No pudimos buscar a la persona'}
        >
          {user.error instanceof UserNotFoundError
            ? `Ningún usuario tiene el documento ${document}.`
            : 'Revisa tu conexión e intenta de nuevo.'}
        </Alert>
      ) : null}

      {user.data === undefined ? null : (
        <>
          <Panel className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-col">
              <Text weight="medium" truncate>
                {user.data.name}
              </Text>
              <Text size="label" tone="muted" className="font-mono">
                {user.data.cedula}
              </Text>
            </div>
            <Badge tone={user.data.verified === true ? 'success' : 'warning'} dot>
              {user.data.verified === true ? 'Validado' : 'Sin validar'}
            </Badge>
          </Panel>

          {user.data.verified === true ? (
            <>
              <div className="flex justify-end">
                <Button onClick={() => setRegistering(true)}>
                  <Plus size={18} />
                  Nueva tarjeta
                </Button>
              </div>

              {cards.isError ? (
                <Alert variant="error" title="No pudimos cargar las tarjetas">
                  Revisa tu conexión e intenta de nuevo.
                </Alert>
              ) : (
                <CardsTable
                  cards={cards.data?.cards}
                  isPending={cards.isPending}
                  onEdit={setEditing}
                  onRemove={(card) => void handleRemove(card)}
                />
              )}

              <CardRegisterDialog
                open={registering}
                user={user.data}
                buildingId={search.buildingId ?? ''}
                doorId={search.doorId ?? ''}
                onBuildingChange={(buildingId) => onSearchChange({ ...search, buildingId, doorId: undefined })}
                onDoorChange={(doorId) => onSearchChange({ ...search, doorId })}
                onClose={() => setRegistering(false)}
              />

              <EditCardDialog
                card={editing}
                pending={update.isPending}
                onClose={() => setEditing(null)}
                onSave={(input) => void handleSaveEdit(input)}
              />
            </>
          ) : (
            <UserValidatorForm user={user.data} />
          )}
        </>
      )}
    </div>
  );
}
