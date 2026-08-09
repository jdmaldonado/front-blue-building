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

## Dónde va cada cosa

Tres carpetas en `apps/web/src`, con responsabilidades que no se mezclan:

| Carpeta     | Qué contiene                                             | Conoce el dominio |
| ----------- | -------------------------------------------------------- | ----------------- |
| `ui/`       | Primitivos reutilizables (`Button`, `RadioGroup`)        | No                |
| `layouts/`  | Marcos de ruta: el armazón que envuelve varias pantallas | No                |
| `features/` | Pantallas y sus piezas                                   | Sí                |

El layout **no vive dentro de la feature**: es de la ruta. Lo renderiza un layout
route (`routes/_auth.tsx`) y las pantallas solo llenan el hueco del `Outlet`.
Ejemplo: `apps/web/src/layouts/auth/AuthLayout.tsx`.

## Estructura de una feature

```
apps/web/src/features/access/
  index.ts                    # barrel público: SOLO las pantallas
  DoorsPage.tsx               # una pantalla por archivo, en la raíz
  DoorDetailPage.tsx
  components/                 # piezas visuales de la feature (con dominio)
    DoorList.tsx
    index.ts                  # barrel interno
  hooks/                      # hooks de interfaz propios de la feature
    useDoorFilters.ts
    index.ts
  lib/                        # helpers puros de presentación
    doorErrorMessages.ts
    index.ts
```

Reglas:

- **`index.ts` de la feature exporta solo pantallas.** Es lo único que el router
  necesita. Los `components/`, `hooks/` y `lib/` son internos: nadie los importa
  desde fuera de la feature.
- **`components/`** existe desde la primera pieza. Un componente por archivo; si
  además necesita variantes o subpartes, pasa a carpeta propia:
  `components/DoorList/{DoorList.tsx, DoorList-variants.ts, index.ts}`, igual que
  en `ui/`.
- **Componentes anidados**: si solo lo usa un componente y no llega a 30 líneas,
  se queda en el mismo archivo. En cuanto se reutiliza o crece, sale a
  `components/`. No se anidan carpetas más de un nivel.
- **`hooks/`** es para estado de interfaz (filtros, panel abierto, paginación
  visual). La lógica de negocio nunca vive aquí: va a `packages/logic`.
- **`lib/`** es para funciones puras de presentación: mapear un error de dominio
  a un mensaje, formatear una etiqueta. Nada de `utils.ts` genérico; el archivo
  se llama por lo que hace (`doorErrorMessages.ts`).
- Un componente de la feature puede conocer el dominio (`Door`, `Space`); un
  primitivo de `ui` no.
- La feature no escribe `<button>`, `<input>` ni controles con estilos propios:
  eso es un primitivo que falta en `ui/` (ver `crear-componente-ui`). La vista
  solo compone.
- Si una pieza sirve a dos features, se promueve: a `ui/` si no tiene dominio, a
  `layouts/` si es armazón, o a `features/shared/` si sí lo tiene. Ahí viven, por
  ejemplo, el tipo `AlertMessage` y el aviso de "sin conexión", que son iguales en
  todas las pantallas (`apps/web/src/features/shared/lib/alertMessages.ts`).
  `features/shared/` es la única feature sin pantallas.
- Los textos visibles van en español, junto al componente que los muestra.

## Estados obligatorios

Toda vista que lee datos resuelve los cuatro casos de forma explícita:

```tsx
const doors = useAccessibleDoors(buildingId);

if (doors.isPending) return <Loading label="Cargando puertas..." />;
if (doors.isError) return <Alert variant="error" title="No pudimos cargar las puertas" />;
if (doors.data.length === 0) return <EmptyState />;
return <DoorList doors={doors.data} />;
```

- El estado de carga se pinta con el primitivo `Loading`, nunca con un spinner
  suelto: así un cambio de animación entra en un solo sitio (`ui/loading/`).
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
| `routes/admin.tsx`         | `/admin`         |
| `routes/doors.$doorId.tsx` | `/doors/:doorId` |
| `routes/_auth.tsx`         | layout sin URL   |
| `routes/_auth/login.tsx`   | `/login`         |

### Agrupar rutas sin ensuciar la URL

Un archivo que empieza con `_` es un **layout sin path**: agrupa rutas
relacionadas sin agregar segmento a la URL. `routes/_auth/login.tsx` sigue
siendo `/login`.

Sirve para declarar una sola vez lo que comparten:

```tsx
// routes/_auth.tsx
export const Route = createFileRoute('/_auth')({
  beforeLoad: redirectIfAuthenticated,
  component: AuthLayout, // de layouts/, y adentro lleva el <Outlet />
});
```

Las hijas (`login`, `forgot-password`, `reset-password`) quedan sin
guard propio ni marco propio: solo su contenido. Si el grupo no comparte
interfaz, el componente del layout es `Outlet` pelado.

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
- **Las URLs van siempre en inglés y en kebab-case**: `/forgot-password`,
  `/reset-password`, `/door-access`. Nunca en español, aunque la interfaz sí lo
  esté. El nombre del archivo es la URL, así que la regla aplica al archivo.
- Si un sistema externo impone otra ruta (el enlace de un correo, por ejemplo),
  se crea una ruta de compatibilidad que solo redirige, conservando los search
  params (`apps/web/src/routes/reset_password.tsx`). Esa ruta impuesta se queda
  encerrada en ese archivo y no se propaga al resto del código.
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

- El handler del `onSubmit` se tipa con `SubmitEvent<HTMLFormElement>`.
  `FormEvent` y `FormEventHandler` están deprecados en los tipos de React 19
  (no existían como evento del DOM). Igual: `ChangeEvent` para inputs,
  `SyntheticEvent` como último recurso.
- El estado del formulario es local (`useState`) o de `react-hook-form`; nunca del
  store global.
- Cada control va dentro de `<Field>` con `htmlFor` igual al `id` del control
  (`apps/web/src/ui/field/Field.tsx`).
- El envío llama una mutación de `logic` y reacciona en sus callbacks, no en un
  `useEffect` que observa `isSuccess`.

## Listas de opciones

Un `Select` no se llena mapeando a mano. `toSelectOptions` convierte cualquier
lista de `{ id, name }` en opciones, ordenadas por nombre y con la opción fija
delante (`apps/web/src/ui/select/select-options.ts`):

```tsx
const buildingOptions = useMemo(
  () => toSelectOptions(buildings.data ?? [], { first: { value: '', label: 'Todos los edificios' } }),
  [buildings.data],
);
```

El orden es alfabético natural, así que "Piso 2" va antes que "Piso 10". Se apaga
con `sorted: false` solo si la lista ya viene en un orden que significa algo.

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
- [ ] Barrel de la feature exporta solo pantallas; piezas en `components/`,
      `hooks/` o `lib/` según corresponda.
- [ ] Checklist de `revisar-ui` pasado, con el mock delante.
- [ ] `pnpm typecheck && pnpm lint && pnpm format`.

## Errores comunes

- Copiar lógica de un hook dentro de la vista "porque era más rápido".
- `useEffect` para disparar la carga inicial: eso lo hace `useQuery`.
- Mostrar `error.message` crudo del backend al usuario.
- Escribir la pantalla dentro del archivo de ruta en vez de en `features/`.
- Meter el layout de la ruta dentro de la feature: el marco es de la ruta.
- Un `utils.ts` cajón de sastre dentro de la feature.
- Exportar componentes internos desde el barrel de la feature.
