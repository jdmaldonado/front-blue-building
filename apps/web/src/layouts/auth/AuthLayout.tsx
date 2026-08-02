import { Outlet } from '@tanstack/react-router';
import { Logo } from '../../ui';
import { BrandPanel } from './BrandPanel';

// Route-level layout for the public auth screens. Full-bleed split: brand panel
// on the left from md up, content column filling the rest. On mobile the panel
// disappears and the content owns the viewport.
export function AuthLayout() {
  return (
    <main className="flex min-h-dvh flex-col bg-(--surface-raised) text-(--text-primary) md:flex-row">
      <BrandPanel />

      <div className="flex flex-1 items-center justify-center px-6 py-8 sm:px-10 md:px-12">
        <div className="flex w-full max-w-[420px] flex-col gap-5">
          <Logo className="md:hidden" />
          <Outlet />
        </div>
      </div>
    </main>
  );
}
