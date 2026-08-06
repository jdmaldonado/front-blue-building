import { useCards } from '@bb/logic';
import { Link } from '@tanstack/react-router';
import { ExternalLink } from 'lucide-react';
import { AppRoute } from '../../../app/navigation';
import { Alert, Button, Dialog, buttonVariants } from '../../../ui';
import { useCardActions } from '../hooks';
import { CardsTable } from './CardsTable';
import { EditCardDialog } from './EditCardDialog';

type UserCardsDialogProps = {
  // Null closes it. Name and document are all the dialog needs.
  user: { cedula: string; name: string } | null;
  onClose: () => void;
};

// Opened from the users table. Looking at someone's cards is not a change of
// task, so it does not become a change of screen either: there is nothing to
// navigate back from.
export function UserCardsDialog({ user, onClose }: UserCardsDialogProps) {
  const cards = useCards(user === null ? null : user.cedula);
  const actions = useCardActions();

  return (
    <>
      <Dialog
        open={user !== null}
        onClose={onClose}
        size="lg"
        title="Tarjetas"
        description={user?.name}
        footer={
          <>
            <Button appearance="ghost" intent="neutral" onClick={onClose}>
              Cerrar
            </Button>
            {/* Creating one needs a reader and a door, which does not fit in a
                dialog on top of a dialog. */}
            {user === null ? null : (
              <Link
                to={AppRoute.AdminCards}
                search={{ document: user.cedula }}
                className={buttonVariants({ intent: 'primary' })}
              >
                <ExternalLink size={18} />
                Administrar tarjetas
              </Link>
            )}
          </>
        }
      >
        {cards.isError ? (
          <Alert variant="error" title="No pudimos cargar las tarjetas">
            Revisa tu conexión e intenta de nuevo.
          </Alert>
        ) : (
          <CardsTable
            cards={cards.data?.cards}
            skipped={cards.data?.skipped}
            isPending={cards.isPending}
            onEdit={actions.startEdit}
            onRemove={actions.remove}
          />
        )}
      </Dialog>

      <EditCardDialog
        card={actions.editing}
        pending={actions.pending}
        onClose={actions.cancelEdit}
        onSave={actions.saveEdit}
      />
    </>
  );
}
