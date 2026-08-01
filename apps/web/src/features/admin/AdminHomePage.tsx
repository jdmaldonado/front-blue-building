import { useSessionStore } from '@bb/logic';
import { Card } from '../../ui';

export function AdminHomePage() {
  const user = useSessionStore((state) => state.session?.user ?? null);

  return (
    <main className="min-h-dvh bg-(--surface-base) p-6 text-(--text-primary)">
      <Card padding="md" className="mx-auto max-w-3xl">
        <h1 className="font-display text-title font-bold tracking-tight">
          Panel de administración{user ? `, ${user.name}` : ''}
        </h1>
        <p className="mt-2 text-body text-(--text-secondary)">
          Sesión de super administrador. Las vistas del panel se implementan más adelante.
        </p>
      </Card>
    </main>
  );
}
