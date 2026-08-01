---
name: crear-hook-logica
description: Crear un hook de negocio en packages/logic con TanStack Query o Zustand (queries, mutaciones, query keys, invalidación, stores). Usar cuando la tarea pide leer o escribir datos del backend, o manejar estado de cliente compartido.
---

# Crear un hook de lógica

Aplica a `packages/logic/src/<dominio>/`.

Lee primero `reglas-generales/SKILL.md`.

## Límites del paquete

- Sin UI: ni componentes, ni iconos, ni toasts, ni router. El hook devuelve datos
  y callbacks; la vista decide qué mostrar.
- Sin `fetch` ni URLs: eso es de `api-client`. El hook obtiene su gateway de
  `useServices()` (`packages/logic/src/services/context.ts:16-22`).
- Sin parsear respuestas: llegan ya validadas y tipadas desde el gateway.
- Los tipos de entrada y salida vienen de `@bb/core` (o del gateway para inputs).

Esto es lo que permite reusar el paquete tal cual en React Native más adelante.

## Estado del servidor: TanStack Query

Query:

```ts
export function useAccessibleDoors(buildingId: string | null): UseQueryResult<Door[]> {
  const { accessGateway } = useServices();

  return useQuery({
    queryKey: accessKeys.doors(buildingId),
    queryFn: () => {
      if (buildingId === null) throw new Error('buildingId is required');
      return accessGateway.getAccessibleDoors(buildingId);
    },
    enabled: buildingId !== null,
  });
}
```

Referencia: `packages/logic/src/access/useAccessibleDoors.ts:7-22`.

Reglas:

- Tipo de retorno anotado (`UseQueryResult<T>`, `UseMutationResult<...>`).
- Parámetro opcional o dependiente: `enabled` + guard dentro de `queryFn`. Nunca
  se llama al gateway con `null`.
- El parámetro variable siempre forma parte de la `queryKey`.
- Nada de `select` que reformatee para una pantalla concreta: eso es de la vista.

## Query keys

Una fábrica por dominio, en `keys.ts`, con `as const` en cada nivel:

```ts
export const accessKeys = {
  all: ['access'] as const,
  doors: (buildingId: string | null) => [...accessKeys.all, 'doors', buildingId] as const,
};
```

Referencia: `packages/logic/src/access/keys.ts:1-6`.

- Prohibido escribir un array de key a mano en un `useQuery` o en un
  `invalidateQueries`.
- Para invalidar todo un dominio: `queryClient.invalidateQueries({ queryKey: accessKeys.all })`.

## Mutaciones

```ts
export interface UseLoginCallbacks {
  onSuccess?: (session: LoginResponse) => void;
  onError?: (error: unknown) => void;
}

export function useLogin(callbacks?: UseLoginCallbacks): UseMutationResult<LoginResponse, unknown, LoginInput> {
  const { authGateway } = useServices();
  const setSession = useSessionStore((state) => state.setSession);

  return useMutation({
    mutationFn: (input: LoginInput) => authGateway.login(input),
    onSuccess: (session) => {
      setSession(session);
      callbacks?.onSuccess?.(session);
    },
    onError: (error) => callbacks?.onError?.(error),
  });
}
```

Referencia: `packages/logic/src/auth/useLogin.ts:7-26`.

Reglas:

- El efecto de negocio (guardar sesión, invalidar cachés) va dentro del hook.
- El efecto de interfaz (navegar, mostrar toast) se delega vía callbacks
  opcionales que recibe el llamador.
- Tras una mutación que cambia datos del servidor, se invalidan las keys
  afectadas dentro del hook.

## Estado de cliente: Zustand

Solo para lo que no es del servidor: sesión, selección actual, preferencias.

- Un store por dominio en `<dominio>/store.ts`
  (`packages/logic/src/session/store.ts:15-38`).
- La interfaz del store declara estado y acciones juntos.
- Los derivados se exponen como selectores puros exportados
  (`selectCurrentSpace`, `store.ts:40-42`), no se recalculan en cada vista.
- Fuera de React se lee con `useSessionStore.getState()` (guards de ruta,
  proveedor de token en `apps/web/src/app/services.ts:10`).
- Nunca se duplica en el store algo que ya vive en la caché de Query.

## Servicios nuevos

Si el hook necesita un gateway que aún no existe en `Services`, se agrega la
propiedad en `packages/logic/src/services/context.ts:5-10` y se construye en
`apps/web/src/app/services.ts:13-18`. Se inyecta por contexto; nunca se instancia
un gateway dentro del hook.

## Checklist

- [ ] Archivo en `packages/logic/src/<dominio>/` y exportado en `src/index.ts`.
- [ ] Gateway obtenido con `useServices()`, no instanciado.
- [ ] `queryKey` desde la fábrica del dominio, con todos los parámetros.
- [ ] Tipo de retorno anotado explícitamente.
- [ ] Cero imports de UI, router o `fetch`.
- [ ] Invalidaciones hechas tras mutaciones que cambian datos.
- [ ] `pnpm typecheck && pnpm lint && pnpm format`.

## Errores comunes

- Navegar o mostrar un toast dentro del hook.
- Guardar la respuesta de una query en un store de Zustand.
- Key inline: `queryKey: ['doors', buildingId]`.
- Olvidar el parámetro en la key: dos edificios comparten caché.
- `enabled` sin guard en `queryFn` (TypeScript deja de proteger el `null`).
