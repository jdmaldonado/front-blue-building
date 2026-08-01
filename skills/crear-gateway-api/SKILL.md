---
name: crear-gateway-api
description: Agregar o modificar una llamada al backend en packages/api-client (gateway, validación zod, mapeo a errores de dominio, eventos de socket). Usar cuando la tarea necesita un endpoint nuevo o cambiar la forma en que se habla con la API.
---

# Crear un gateway o método de API

Aplica a `packages/api-client/src/`.

Lee primero `reglas-generales/SKILL.md`. Para elegir entre `parse`, `safeParse` y
`catch`: `validar-con-zod/SKILL.md`.

## Responsabilidad

`api-client` es la capa anticorrupción del backend actual. Entra JSON sin tipo,
sale un tipo de `@bb/core`. Nada de la forma real del backend (nombres raros,
envoltorios, códigos) debe escaparse hacia `logic` o la UI.

Tres obligaciones, siempre las tres:

1. Construir la petición con el `HttpClient` inyectado.
2. Validar la respuesta con un schema de `@bb/core`.
3. Traducir los fallos a errores de dominio.

## Plantilla

```ts
export class AccessGateway {
  constructor(private readonly http: HttpClient) {}

  async getAccessibleDoors(buildingId: string): Promise<Door[]> {
    const raw = await this.http.get({ path: `/api/buildings/${buildingId}/doors` });
    return z.object({ doors: z.array(DoorSchema) }).parse(raw).doors;
  }
}
```

Referencia: `packages/api-client/src/gateways.ts:61-67`.

Reglas:

- Un gateway por dominio, con el `HttpClient` por constructor. Nunca `fetch`
  directo ni una URL base hardcodeada: el cliente ya la resuelve
  (`packages/api-client/src/http.ts:37-43`).
- El método devuelve el tipo de dominio ya desenvuelto (`Door[]`, no
  `{ doors: Door[] }`). El envoltorio del backend muere aquí.
- La respuesta cruda entra como `unknown` y solo se convierte en tipo tras
  `.parse()`. Prohibido `as Door[]`.
- Si el endpoint recibe un modo o variante, se usa un `switch` exhaustivo sobre la
  constante del dominio, no `if` con strings
  (`packages/api-client/src/gateways.ts:24-31`).

## Errores

Los errores de transporte llegan como `HttpError` con `status` y cuerpo
(`packages/api-client/src/http.ts:12-20`). El gateway los traduce:

```ts
function toAuthError(error: unknown): Error {
  if (error instanceof HttpError) {
    if (error.status === null) return new AuthNetworkError('Network error during login', { cause: error });
    if (error.status === 400 || error.status === 401) return new InvalidCredentialsError('Invalid credentials');
  }
  return new UnknownAuthError('Unexpected login error', { cause: error });
}
```

Referencia: `packages/api-client/src/gateways.ts:49-59`.

- Una función `toXError` por dominio, con un caso por error de dominio declarado
  en `packages/core/src/<dominio>/errors.ts`.
- Siempre hay un caso final "unknown": nunca se deja escapar el error crudo.
- `cause` conserva el error original para el logger; no se pierde información.
- Si falta un error de dominio para el caso nuevo, se agrega primero en `core`
  (`crear-modelo-dominio`).

## Socket

Los eventos se declaran tipados y se validan igual que HTTP antes de emitirlos
hacia arriba (`packages/api-client/src/socket.ts`). El nombre del evento es una
constante, no un literal repetido.

## Registro

Un gateway nuevo se exporta en `packages/api-client/src/index.ts`, se agrega a
`Services` (`packages/logic/src/services/context.ts:5-10`) y se instancia en
`apps/web/src/app/services.ts:13-18`.

## Checklist

- [ ] Método en el gateway del dominio correcto, con `HttpClient` inyectado.
- [ ] Respuesta validada con schema de `@bb/core`; sin `as`, sin `any`.
- [ ] Envoltorio del backend desarmado antes de devolver.
- [ ] Fallos traducidos a errores de dominio, con caso final desconocido.
- [ ] Exportado en el barrel y registrado en `Services` si es un gateway nuevo.
- [ ] `pnpm typecheck && pnpm lint && pnpm format`.

## Errores comunes

- Devolver la respuesta sin parsear porque "el backend siempre manda eso".
- Definir el schema dentro de `api-client`: los contratos viven en `core`
  (salvo el envoltorio puntual de la respuesta, como en el ejemplo).
- Propagar `HttpError` hacia `logic`.
- Poner la URL base en el método.
