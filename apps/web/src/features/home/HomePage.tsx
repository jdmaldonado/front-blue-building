import { selectCurrentSpace, selectIsSuperAdmin, useSessionStore } from '@bb/logic';

export function HomePage() {
  const user = useSessionStore((state) => state.session?.user ?? null);
  const space = useSessionStore(selectCurrentSpace);
  const isSuperAdmin = useSessionStore(selectIsSuperAdmin);

  return (
    <main className="min-h-dvh bg-(--surface-base) p-6 text-(--text-primary)">
      <h1 className="text-title font-semibold">Hola{user ? `, ${user.name}` : ''}</h1>
      <p className="text-(--text-muted)">
        {isSuperAdmin
          ? 'Sesión de super administrador'
          : space
            ? `Edificio: ${space.building.name}`
            : 'Sin espacio seleccionado'}
      </p>
    </main>
  );
}
