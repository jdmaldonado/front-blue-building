---
name: crear-vista
description: Crear una pantalla o feature en apps/web/src/features y su ruta file-based en TanStack Router (composición, estados de carga y error, guards por rol, sin lógica de negocio). Usar cuando la tarea pide una vista, pantalla, página o flujo de la app web.
---

# Crear una vista

Aplica a `apps/web/src/features/<dominio>/` y a `apps/web/src/routes/`.

Lee primero `reglas-generales/SKILL.md`. Al terminar, `revisar-ui/SKILL.md` es
obligatorio: una vista no está lista solo porque compile.

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
- La feature no escribe `<button>`, `<input>` ni controles con estilos propios:
  eso es un primitivo que falta en `ui/` (ver `crear-componente-ui`). La vista
  solo compone.
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

El routing es **file-based**: la URL sale del nombre del archivo dentro de
`apps/web/src/routes`, y `@tanstack/router-plugin` genera `src/routeTree.gen.ts`
al correr `dev` o `build`.

| Archivo                    | URL              |
| -------------------------- | ---------------- |
| `routes/__root.tsx`        | layout raíz      |
| `routes/index.tsx`         | `/`              |
| `routes/login.tsx`         | `/login`         |
| `routes/admin.tsx`         | `/admin`         |
| `routes/doors.$doorId.tsx` | `/doors/:doorId` |

Reglas:

- El archivo de ruta es fino: guard, params y componente. La pantalla vive en
  `features/` y se importa desde su barrel.

  ```tsx
  export const Route = createFileRoute('/doors')({
    beforeLoad: requireMode(LoginMode.Usuario),
    component: DoorsPage,
  });
  ```

  Referencia: `apps/web/src/routes/admin.tsx`.

- `routeTree.gen.ts` es generado: no se edita a mano y está fuera de lint y
  formato. Se agrega una ruta creando el archivo, no tocando un array.
- El guard lee el store con `.getState()`, no con el hook: `beforeLoad` no es un
  componente.
- Los guards son cosa del **router**, no de TanStack Query. Query es estado de
  servidor; quién eres y a dónde entras es sesión.

### Rutas por rol

Cuando una zona de la app es solo para cierto rol, el guard hace dos preguntas
en este orden: ¿hay sesión? y ¿esta sesión pertenece aquí? Vive en
`apps/web/src/app/guards.ts:9-19`, compartido por todas las rutas:

```ts
export function requireMode(mode: LoginMode) {
  return () => {
    const { session } = useSessionStore.getState();
    if (session === null) throw redirect({ to: AppRoute.Login });
    if (session.mode !== mode) throw redirect({ to: landingPathFor(session) });
  };
}
```

Reglas:

- Un rol que entra donde no le toca **no ve un error**: se le redirige a su
  propia zona.
- El mapa "sesión -> ruta de entrada" vive en un solo sitio
  (`apps/web/src/app/navigation.ts:16-24`) y lo usan tanto el login como los
  guards. Nunca se escribe `navigate({ to: '/' })` a mano después de un login.
- La ruta de login también tiene guard: si ya hay sesión, redirige a su landing.
- Las rutas se declaran como constantes (`AppRoute`), no como strings sueltos.
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
- [ ] Archivo de ruta creado en `src/routes` y con guard si requiere sesión.
- [ ] Barrel `index.ts` de la feature actualizado.
- [ ] Checklist de `revisar-ui` pasado, con el mock delante.
- [ ] `pnpm typecheck && pnpm lint && pnpm format`.

## Errores comunes

- Copiar lógica de un hook dentro de la vista "porque era más rápido".
- `useEffect` para disparar la carga inicial: eso lo hace `useQuery`.
- Mostrar `error.message` crudo del backend al usuario.
- Escribir la pantalla dentro del archivo de ruta en vez de en `features/`.
