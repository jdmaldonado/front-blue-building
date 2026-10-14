import type { ReactNode } from 'react';
import { Logo, cn } from '../../ui';
import { BrandPanel } from './BrandPanel';

type AuthFrameProps = {
  // The resident door: brand gradient, slanted fields, diagonal marks. The
  // staff door keeps the plain surface and the dark panel beside it.
  branded?: boolean;
  children: ReactNode;
};

// Split screen from md up, except on the resident door: there the gradient is
// already a brand surface, and a dark panel next to it makes two of them.
export function AuthFrame({ branded = false, children }: AuthFrameProps) {
  return (
    <main
      className={cn(
        'flex min-h-dvh flex-col text-(--text-primary) md:flex-row',
        branded ? 'on-brand-vivid bg-[image:var(--brand-vivid-surface)]' : 'bg-(--surface-raised)',
      )}
    >
      {branded ? null : <BrandPanel />}

      <div className="flex flex-1 items-center justify-center px-6 py-8 sm:px-10 md:px-12">
        <div className={cn('flex w-full flex-col', branded ? 'max-w-[460px] gap-9' : 'max-w-[420px] gap-5')}>
          {/* On the resident door the lettering is the headline, centred and on
              its own, the way the current app opens. */}
          {branded ? (
            <Logo size="3xl" parts="wordmark" className="mb-4 justify-center" wordmarkClassName="max-w-full" />
          ) : (
            <Logo size="xl" className="md:hidden" />
          )}
          {children}
        </div>
      </div>
    </main>
  );
}
