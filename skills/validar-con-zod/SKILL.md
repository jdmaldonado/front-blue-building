---
name: validar-con-zod
description: Cuándo validar con zod y cuándo no (bordes del sistema vs interior tipado), y qué método usar en cada borde (parse, safeParse, catch). Usar al traer datos de la red, del socket, de storage, de env o de un formulario.
---

# Validar con zod

Sí, usamos zod. Versión 4, declarada solo en `packages/core` y
`packages/api-client`.

La regla es una sola: **se valida en el borde, una vez, y hacia adentro todo es
TypeScript.**

## Qué es un borde

Un borde es cualquier punto donde entra un dato que el compilador no puede
garantizar. Ahí zod es obligatorio:

| Borde                                  | Dónde se valida                | Método                  |
| -------------------------------------- | ------------------------------ | ----------------------- |
| Respuesta HTTP                         | gateway en `api-client`        | `.parse()`              |
| Evento de socket (stream continuo)     | `SocketClient` en `api-client` | `.safeParse()`          |
| Payload de error de socket             | `SocketClient` en `api-client` | `.catch(fallback)`      |
| Variables de entorno                   | `apps/web/src/config/env.ts`   | `.parse()` al arrancar  |
| Datos persistidos (storage, PWA cache) | adaptador de storage           | `.safeParse()`          |
| Formulario del usuario                 | schema de input en `core`      | resolver del formulario |
| Params de URL no triviales             | ruta en `app/router.tsx`       | `.safeParse()`          |

Todo lo que no está en esa tabla es interior del sistema y **no se valida**.

## Qué NO se valida

- Argumentos de funciones internas. Para eso está el tipo.
- Props de componentes.
- Datos que ya pasaron por un gateway: `logic` y `apps/web` reciben tipos ya
  garantizados. Volver a parsear ahí es ruido y coste.
- Valores que produce el propio front (estado local, derivados de un store).
- El retorno de un hook.

Señal de que algo está mal: un `import { z }` en `packages/logic` o en
`apps/web/src/features`. Zod ni siquiera es dependencia de esos paquetes.

## Qué método usar

**`.parse()` cuando el dato es indispensable y el fallo debe cortar el flujo.**
Es el caso de HTTP: si la respuesta no cumple el contrato, no hay pantalla que
pintar. Va dentro del `try/catch` del gateway y el error sale traducido a error
de dominio (`packages/api-client/src/gateways.ts:36-46`).

**`.safeParse()` cuando el fallo debe degradar, no romper.** Es el caso de un
evento de stream: llega un `door_update` con forma rara, se registra y se ignora;
el resto de eventos sigue funcionando
(`packages/api-client/src/socket.ts:58-70`).

**`.catch(fallback)` cuando siempre hay un valor razonable por defecto.** Es el
caso del payload de error del socket, que se normaliza a `{ error: 'UNKNOWN' }`
antes de mapearlo (`packages/api-client/src/socket.ts:14`).

Nunca `.parse()` dentro de un handler de socket que se dispara en bucle: una
excepción ahí mata el listener.

## Dónde viven los schemas

En `packages/core/src/<dominio>/schemas.ts`, junto al tipo que infieren
(`crear-modelo-dominio`). El gateway los importa; no define los suyos.

Única excepción: el envoltorio puntual de una respuesta, que es forma del
backend y no del dominio, se arma inline en el gateway
(`packages/api-client/src/gateways.ts:64-66`):

```ts
return z.object({ doors: z.array(DoorSchema) }).parse(raw).doors;
```

El envoltorio muere ahí. Hacia arriba sale `Door[]`.

## Contratos de entrada (formularios)

Cuando se agregue validación de formularios, el schema del input va en `core`
junto al resto del dominio, no en el componente:

```ts
// packages/core/src/auth/schemas.ts
export const LoginInputSchema = z.object({
  cedula: z.string().min(1, 'Ingresa tu cédula'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
  mode: LoginModeSchema,
});
export type LoginInput = z.infer<typeof LoginInputSchema>;
```

La vista solo conecta ese schema al resolver del formulario. Así la misma regla
sirve para la web y para la app nativa después.

Esto implica agregar `zod` a `apps/web` el día que entre `react-hook-form`. Es la
única razón aceptada para que zod aparezca fuera de `core` y `api-client`, y solo
para formularios: nunca para revalidar datos del servidor.

Los mensajes de error de validación van en español dentro del schema, porque son
texto que ve el usuario.

## Tipos: siempre inferidos

```ts
export const DoorSchema = z.object({ ... });
export type Door = z.infer<typeof DoorSchema>;
```

Nunca una `interface` escrita a mano en paralelo al schema: se desincronizan sin
que el compilador avise. Si el tipo no tiene borde (no viene de fuera), no
necesita schema: se declara como tipo normal y ya.

## Coste

`parse` recorre el dato completo. En listas grandes eso se nota: no se parsea la
misma colección dos veces ni se parsea dentro de un `map` que ya recibió datos
validados. Un parse por respuesta, en el gateway, y punto.

## Checklist

- [ ] Todo dato externo pasa por un schema antes de entrar al sistema.
- [ ] Ningún `z.` en `packages/logic` ni en `apps/web/src/features`.
- [ ] Método acorde al borde: `parse` corta, `safeParse` degrada, `catch` rellena.
- [ ] Sin `.parse()` en handlers de socket recurrentes.
- [ ] Schemas en `core`; en el gateway solo el envoltorio del backend.
- [ ] Tipos con `z.infer`, sin `interface` duplicada.
- [ ] Errores de parseo traducidos a errores de dominio, no propagados crudos.

## Errores comunes

- Parsear otra vez en el hook "por seguridad".
- Definir el schema en `api-client` porque es donde se usa.
- `as Door[]` en vez de `.parse()` cuando el schema da pereza.
- `.safeParse()` y luego usar `parsed.data` sin comprobar `parsed.success`.
- Un schema que refleja el JSON crudo del backend en vez de la entidad del
  dominio: el trabajo de la capa anticorrupción es justamente que no se parezcan.
