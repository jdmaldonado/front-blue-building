---
name: crear-vista
description: Crear una pantalla o feature en apps/web/src/features y su ruta en TanStack Router (composición, estados de carga y error, sin lógica de negocio). Usar cuando la tarea pide una vista, pantalla, página o flujo de la app web.
---

# Crear una vista

Aplica a `apps/web/src/features/<dominio>/` y a `apps/web/src/app/router.tsx`.

Lee primero `reglas-generales/SKILL.md`.

## Qué es una vista

Compone tres cosas y nada más:

1. Hooks de `@bb/logic` (datos y acciones).
2. Primitivos de `../../ui` (interfaz).
3. Estado local de interfaz (campo de formulario, panel abierto, filtro visual).

Lo que **no** hace: llamar `fetch`, construir URLs, parsear respuestas, mapear
códigos HTTP, guardar caché propia. Todo eso vive en `api-client` y `logic`.

## Estructura

```
apps/web/src/features/access/
  DoorsPage.tsx          # vista de ruta
  DoorList.tsx           # subcomponente de la feature
  DoorList-variants.ts   # opcional, si tiene clases propias no triviales
  index.ts               # barrel: export { DoorsPage }
```

- Un componente de la feature puede conocer el dominio (`Door`, `Space`); un
  primitivo de `ui` no.
- Si el subcomponente sirve a dos features, se promueve a `ui` como primitivo
  (`crear-componente-ui`) o a un componente de dominio compartido.
- Los textos visibles van en español, junto al componente que los muestra.

## Estados obligatorios

Toda vista que lee datos resuelve los cuatro casos de forma explícita:

```tsx
const doors = useAccessibleDoors(buildingId);

if (doors.isPending) return <DoorsSkeleton />;
if (doors.isError) return <Alert variant="error" title="No pudimos cargar las puertas" />;
if (doors.data.length === 0) return <EmptyState />;
return <DoorList doors={doors.data} />;
```

- Nunca `doors.data!` ni `doors.data?.map` para tapar el estado de carga.
- El mensaje de error se decide en la vista a partir del error de dominio, no del
  `status` HTTP.
- Las mutaciones deshabilitan el control mientras corren: `loading={login.isPending}`
  (`apps/web/src/features/auth/LoginPage.tsx:50`).

## Rutas

Rutas finas: guard, params y componente. Sin lógica dentro.

```tsx
const doorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/doors',
  beforeLoad: () => {
    if (!useSessionStore.getState().isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
  component: DoorsPage,
});
```

Referencia: `apps/web/src/app/router.tsx:14-23`. Toda ruta nueva se agrega a
`routeTree` (`router.tsx:25`).

- El guard lee el store con `.getState()`, no con el hook: `beforeLoad` no es un
  componente.
- La navegación se hace con `useNavigate()`; `void navigate({ to: '/' })` porque
  devuelve una promesa (`apps/web/src/features/auth/LoginPage.tsx:12-16`).

## Formularios

- El estado del formulario es local (`useState`) o de `react-hook-form`; nunca del
  store global.
- Cada control va dentro de `<Field>` con `htmlFor` igual al `id` del control
  (`apps/web/src/ui/field/Field.tsx`).
- El envío llama una mutación de `logic` y reacciona en sus callbacks, no en un
  `useEffect` que observa `isSuccess`.

## Layout

- Mobile-first: se escribe el layout base para móvil y se agregan `sm:` / `md:`
  hacia arriba.
- Contenedores usan tokens de superficie: `bg-(--surface-base)`,
  `text-(--text-primary)` (`apps/web/src/features/auth/LoginPage.tsx:24`).

## Checklist

- [ ] La vista no importa `@bb/api-client` ni hace `fetch`.
- [ ] Datos y acciones vienen de hooks de `@bb/logic`.
- [ ] Interfaz construida con primitivos de `../../ui`, sin clases de color crudas.
- [ ] Estados pending, error, vacío y con datos resueltos.
- [ ] Ruta registrada en `routeTree` y con guard si requiere sesión.
- [ ] Barrel `index.ts` de la feature actualizado.
- [ ] `pnpm typecheck && pnpm lint && pnpm format`.

## Errores comunes

- Copiar lógica de un hook dentro de la vista "porque era más rápido".
- `useEffect` para disparar la carga inicial: eso lo hace `useQuery`.
- Mostrar `error.message` crudo del backend al usuario.
- Definir el componente de ruta dentro de `router.tsx`.
