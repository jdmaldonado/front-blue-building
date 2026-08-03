import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { Toast, toastRegionVariants, type ToastTone } from '../ui';

export interface ToastOptions {
  tone: ToastTone;
  title: string;
  message?: string;
}

export type ShowToast = (options: ToastOptions) => void;

const SUCCESS_DURATION_MS = 4000;
const ERROR_DURATION_MS = 6000;

const ToastContext = createContext<ShowToast | null>(null);

export function useToast(): ShowToast {
  const show = useContext(ToastContext);
  if (show === null) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return show;
}

type ActiveToast = ToastOptions & { id: number };

// One stack for the whole app. It lives in a popover so it stays on top of the
// native dialogs, which the browser paints above everything else.
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ActiveToast[]>([]);
  const regionRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback<ShowToast>(
    (options) => {
      nextId.current += 1;
      const id = nextId.current;
      setToasts((current) => [...current, { ...options, id }]);

      const duration = options.tone === 'error' ? ERROR_DURATION_MS : SUCCESS_DURATION_MS;
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  // The popover is only open while there is something to show, so it never
  // covers the screen for nothing.
  useEffect(() => {
    const region = regionRef.current;
    if (region === null) {
      return;
    }
    if (toasts.length > 0) {
      region.showPopover();
    } else {
      region.hidePopover();
    }
  }, [toasts.length]);

  return (
    <ToastContext.Provider value={show}>
      {children}

      <div ref={regionRef} popover="manual" role="status" aria-live="polite" className={toastRegionVariants()}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            tone={toast.tone}
            title={toast.title}
            message={toast.message}
            onClose={() => dismiss(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
