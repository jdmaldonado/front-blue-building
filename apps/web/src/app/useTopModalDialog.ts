import { useEffect, useState } from 'react';

// The modal dialog the browser keeps interactive: the last one opened. Anything
// outside it, even if painted on top, ignores clicks and lets them fall through.
export function useTopModalDialog(): HTMLDialogElement | null {
  const [top, setTop] = useState<HTMLDialogElement | null>(null);

  useEffect(() => {
    let stack: HTMLDialogElement[] = [];

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === 'attributes' && record.target instanceof HTMLDialogElement) {
          const dialog = record.target;
          stack = stack.filter((item) => item !== dialog);
          if (dialog.matches(':modal')) {
            stack.push(dialog);
          }
        }
      }
      stack = stack.filter((dialog) => dialog.isConnected && dialog.matches(':modal'));
      setTop(stack.at(-1) ?? null);
    });

    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['open'] });
    return () => observer.disconnect();
  }, []);

  return top;
}
