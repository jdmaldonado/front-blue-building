---
name: crear-gateway-api
description: Agregar o modificar una llamada al backend en packages/api-client (gateway, rutas, validación zod, traducción de errores, eventos de socket). Usar cuando la tarea necesita un endpoint nuevo o cambiar la forma en que se habla con la API.
---

# Crear un gateway o método de API

Aplica a `packages/api-client/src/`.

Lee primero `reglas-generales/SKILL.md`. Para elegir entre `parse`, `safeParse` y
`catch`: `validar-con-zod/SKILL.md`.

## Responsabilidad

`api-client` es la única capa que conoce cómo habla el backend de verdad. Entra
JSON sin tipo, sale un tipo de `@bb/core`. Los nombres raros, los envoltorios y
los códigos HTTP mueren aquí: ni `logic` ni la UI los ven nunca.

Tres obligaciones, siempre las tres:

1. Construir la petición con el `HttpClient` inyectado.
2. Validar la respuesta con un schema de `@bb/core`.
3. Traducir los fallos a errores de dominio.

## Estructura

Una carpeta por dominio, con tres archivos. Ninguno pasa de 120 líneas.

```
packages/api-client/src/
  http/          cliente fetch y HttpError
  shared/        lo que usan todos: mapeo de errores, lector de filas, status
  cards/
    cards.gateway.ts    la clase y sus métodos
    cards.paths.ts      las URLs, ninguna suelta en el gateway
    cards.errors.ts     la traducción de fallos de este dominio
    index.ts            barrel: la clase y sus tipos de entrada
```

Referencia completa: `packages/api-client/src/cards/`.

## El gateway

```ts
export class CardsGateway {
  constructor(
    private readonly http: HttpClient,
    private readonly logger: Logger,
  ) {}

  async remove(cardId: string): Promise<void> {
    try {
      await this.http.delete({ path: cardPath(cardId) });
    } catch (error) {
      throw toCardsError(error);
    }
  }
}
```

- Un gateway por dominio, con el `HttpClient` por constructor. Nunca `fetch`
  directo ni URL base a mano: el cliente ya la resuelve
  (`packages/api-client/src/http/http.client.ts:30-40`).
- Las URLs viven en `<dominio>.paths.ts`, como constante o como función que
  recibe el id. En el gateway no se escriben strings de ruta.
- El método devuelve el tipo de dominio ya desenvuelto (`Door[]`, no
  `{ doors: Door[] }`).
- La respuesta cruda entra como `unknown` y solo se convierte en tipo tras
  `.parse()`. Prohibido `as Door[]`.
- Si el endpoint cambia según un modo o rol, se resuelve con un `switch`
  exhaustivo sobre la constante del dominio, dentro de `paths`
  (`packages/api-client/src/registration/registration.paths.ts:23-31`).
- Un input con `File` no cabe en `core` (no tiene tipos del DOM): se declara
  junto al gateway y se exporta desde su barrel
  (`packages/api-client/src/users/users.gateway.ts:16-22`).

## Errores

Los fallos de transporte llegan como `HttpError` con `status` y cuerpo
(`packages/api-client/src/http/http.errors.ts:1-9`).

Todos los dominios repiten los mismos cuatro casos: sin red, respuesta con forma
rara, sesión caída y desconocido. Eso lo resuelve `createErrorMapper`
(`packages/api-client/src/shared/error-mapper.ts:28`), así que cada dominio solo
escribe lo suyo:

```ts
export const toCardsError = createErrorMapper({
  network: (cause) => new CardsNetworkError('Network error while reading cards', { cause }),
  badResponse: (cause) => new CardsBadResponseError('The cards answer has an unexpected shape', { cause }),
  unknown: (cause) => new UnknownCardsError('Unexpected error while working with cards', { cause }),
  byStatus: {
    [HttpStatus.NotFound]: (error) => new CardNotFoundError('Card no longer exists', { cause: error }),
  },
});
```

Referencia: `packages/api-client/src/cards/cards.errors.ts`.

- `byStatus` se prueba antes que las reglas comunes. Devolver `null` desde un
  caso significa "no era esto": siguen las comunes.
- `sessionCanExpire: false` en endpoints públicos (login, registro): ahí un 401
  no es una sesión muerta.
- Nunca se escribe el número del status a mano: `HttpStatus`
  (`packages/api-client/src/shared/http-status.ts`).
- Si un método necesita un caso que los demás no tienen, se declara un segundo
  mapeador en el mismo archivo, no un `if` dentro del gateway
  (`packages/api-client/src/users/users.errors.ts:13`).
- `cause` conserva el error original para el log.
- Si falta un error de dominio, se agrega primero en `core`
  (`crear-modelo-dominio`).

## Listas que pueden traer basura

Cuando una fila rota no debe tumbar la pantalla, se lee fila a fila con
`readRows` (`packages/api-client/src/shared/row-reader.ts:21`). Devuelve los
items y cuántos se descartaron, y deja el motivo en el log:

```ts
const rows = CardsResponseSchema.parse(raw);
const { items, skipped } = readRows(rows, CardRowSchema, { logger: this.logger, path, label: 'Card' });
return { cards: items, skipped };
```

El `skipped` viaja hasta la vista, que dice cuántos registros faltan en vez de
fingir que la lista está completa.

## Socket

Los eventos se declaran tipados y se validan igual que HTTP antes de emitirlos
hacia arriba (`packages/api-client/src/socket/socket.client.ts`). El nombre del
evento es una constante, no un literal repetido.

## Registro

Un gateway nuevo se exporta en su `index.ts` y en
`packages/api-client/src/index.ts`, se agrega a `Services`
(`packages/logic/src/services/context.ts`) y se instancia en
`apps/web/src/app/services.ts`.

## Checklist

- [ ] Carpeta del dominio con `gateway`, `paths` y `errors` separados.
- [ ] Respuesta validada con schema de `@bb/core`; sin `as`, sin `any`.
- [ ] Envoltorio del backend desarmado antes de devolver.
- [ ] Errores traducidos con `createErrorMapper`, con caso final desconocido.
- [ ] Sin números de status sueltos: `HttpStatus`.
- [ ] Listas frágiles leídas con `readRows`.
- [ ] Exportado en los dos barrels y registrado en `Services` si es nuevo.
- [ ] `pnpm typecheck && pnpm lint && pnpm format`.

## Errores comunes

- Devolver la respuesta sin parsear porque "el backend siempre manda eso".
- Escribir la URL dentro del método en vez de en `paths`.
- Copiar el `if (error instanceof HttpError)` en vez de usar el mapeador.
- Definir el schema dentro de `api-client`: los contratos viven en `core`, salvo
  el envoltorio puntual de una respuesta.
- Propagar `HttpError` hacia `logic`.
