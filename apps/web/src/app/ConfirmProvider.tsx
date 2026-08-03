import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { ConfirmDialog, type ButtonIntent } from '../ui';

export interface ConfirmOptions {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  intent?: ButtonIntent;
}

// Returns true when the user accepts, false when they cancel or press Escape.
export type ConfirmRequest = (options: ConfirmOptions) => Promise<boolean>;

const DEFAULT_CONFIRM_LABEL = 'Confirmar';
const DEFAULT_CANCEL_LABEL = 'Cancelar';

const ConfirmContext = createContext<ConfirmRequest | null>(null);

export function useConfirm(): ConfirmRequest {
  const confirm = useContext(ConfirmContext);
  if (confirm === null) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return confirm;
}

type PendingConfirm = ConfirmOptions & {
  resolve: (confirmed: boolean) => void;
};

// One dialog for the whole app. Any screen can ask a question from an event
// handler and wait for the answer, instead of keeping its own dialog state.
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback<ConfirmRequest>((options) => {
    return new Promise<boolean>((resolve) => {
      setPending({ ...options, resolve });
    });
  }, []);

  const settle = useCallback(
    (confirmed: boolean) => {
      pending?.resolve(confirmed);
      setPending(null);
    },
    [pending],
  );

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      <ConfirmDialog
        open={pending !== null}
        title={pending?.title ?? ''}
        description={pending?.description}
        confirmLabel={pending?.confirmLabel ?? DEFAULT_CONFIRM_LABEL}
        cancelLabel={pending?.cancelLabel ?? DEFAULT_CANCEL_LABEL}
        intent={pending?.intent}
        onConfirm={() => settle(true)}
        onCancel={() => settle(false)}
      />
    </ConfirmContext.Provider>
  );
}
