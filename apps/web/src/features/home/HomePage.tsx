import { selectCurrentSpace, useSessionStore } from '@bb/logic';

export function HomePage() {
  const user = useSessionStore((state) => state.user);
  const space = useSessionStore(selectCurrentSpace);

  return (
    <main className="min-h-screen bg-[var(--surface-base)] p-6 text-[var(--text-primary)]">
      <h1 className="text-xl font-semibold">Hola{user ? `, ${user.name}` : ''}</h1>
      <p className="text-[var(--text-muted)]">
        {space ? `Edificio: ${space.building.name}` : 'Sin espacio seleccionado'}
      </p>
    </main>
  );
}
