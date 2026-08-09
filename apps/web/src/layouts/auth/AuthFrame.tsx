import type { ReactNode } from 'react';
import { Logo } from '../../ui';
import { BrandPanel } from './BrandPanel';

// Split screen from md up. On mobile the brand panel is hidden and the content
// takes the whole viewport.
export function AuthFrame({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-col bg-(--surface-raised) text-(--text-primary) md:flex-row">
      <BrandPanel />

      <div className="flex flex-1 items-center justify-center px-6 py-8 sm:px-10 md:px-12">
        <div className="flex w-full max-w-[420px] flex-col gap-5">
          <Logo size="xl" className="md:hidden" />
          {children}
        </div>
      </div>
    </main>
  );
}
