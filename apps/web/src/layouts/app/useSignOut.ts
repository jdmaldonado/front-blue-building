import { useConfirm } from '../../app/ConfirmProvider';
import { endSession } from '../../app/session';

// Ends the session after confirming. Shared by every place that offers to sign
// out, so the wording never drifts between them.
export function useSignOut(): () => void {
  const confirm = useConfirm();

  return () => {
    void (async () => {
      const confirmed = await confirm({
        title: '¿Cerrar sesión?',
        description: 'Tendrás que ingresar tu documento y contraseña para volver a entrar.',
        confirmLabel: 'Cerrar sesión',
        intent: 'destructive',
      });
      if (confirmed) {
        endSession();
      }
    })();
  };
}
