---
name: crear-modelo-dominio
description: Definir tipos, schemas zod, constantes as const y errores de dominio en packages/core. Usar cuando la tarea introduce una entidad, un estado, un catálogo de valores o un error nuevo del negocio.
---

# Crear un modelo de dominio

Aplica a `packages/core/src/<dominio>/`.

Lee primero `reglas-generales/SKILL.md`. Para saber si un tipo necesita schema o
basta con declararlo: `validar-con-zod/SKILL.md`.

## Organización

Cada dominio (`auth`, `access`, `cameras`, `buildings`, `users`, `shared`) tiene
hasta cuatro archivos y un barrel:

```
packages/core/src/access/
  constants.ts   # catálogos de valores as const
  schemas.ts     # schemas zod + tipos inferidos
  errors.ts      # errores de dominio
  index.ts       # barrel
```

`core` no importa nada del repo fuera de `core`. Es la base de la pirámide.

## Constantes: nunca `enum`

```ts
export const DoorType = {
  Public: 'PUBLIC',
  Private: 'PRIVATE',
  Reserved: 'RESERVED',
} as const;
export type DoorType = (typeof DoorType)[keyof typeof DoorType];
```

Referencia: `packages/core/src/access/constants.ts:1-6`.

- Clave en PascalCase (uso en código), valor tal como lo manda el backend.
- El tipo se llama igual que la constante: se puede usar como valor
  (`LoginMode.Usuario`) y como tipo (`mode: LoginMode`).
- Si el valor es numérico y viene del backend, se comenta por qué
  (`constants.ts:8-13`).
- El `as const` es obligatorio; sin él `z.enum` infiere `string`.

## Schemas

```ts
export const UserTypeSchema = z.enum(UserType);

export const UserSchema = z.object({
  id: IdSchema,
  cedula: z.string(),
  email: z.string().nullish(),
  userType: UserTypeSchema,
});
export type User = z.infer<typeof UserSchema>;
```

Referencia: `packages/core/src/auth/schemas.ts:6-18`.

- Un schema por entidad, con el tipo inferido justo debajo. Nunca se escribe la
  `interface` a mano en paralelo: se deriva con `z.infer`.
- Nombres: `XSchema` para el schema, `X` para el tipo.
- Campos que el backend puede omitir o mandar `null`: `.nullish()`.
- Ids: se usa `IdSchema`, que normaliza número o string a string
  (`packages/core/src/shared/schemas.ts:3`). No se inventa otro tipo de id.
- Schemas que se componen se importan del barrel del otro dominio
  (`schemas.ts:2-3`), no del archivo interno.

## Errores

```ts
export class InvalidCredentialsError extends DomainError {
  readonly code = 'AUTH/INVALID_CREDENTIALS';
}
```

Referencia: `packages/core/src/auth/errors.ts:3-5`, base en
`packages/core/src/shared/errors.ts:1-8`.

- Extienden `DomainError` y declaran `code` como `DOMINIO/CAUSA`.
- Un error por causa distinguible por la UI. Si la UI muestra el mismo mensaje
  para dos casos, sobra uno.
- Cada dominio incluye su caso `UnknownXError`.

## Registro

Todo lo público se exporta en el `index.ts` del dominio, y el dominio en
`packages/core/src/index.ts:1-6`.

## Checklist

- [ ] Sin `enum`; catálogos con objeto `as const` + tipo derivado.
- [ ] Tipos inferidos con `z.infer`, no escritos dos veces.
- [ ] Ids con `IdSchema`.
- [ ] Errores nuevos extienden `DomainError` y tienen `code`.
- [ ] Exportado en el barrel del dominio y en el barrel de `core`.
- [ ] `core` no importa `api-client`, `logic` ni nada de `apps`.
- [ ] `pnpm typecheck && pnpm lint && pnpm format`.

## Errores comunes

- Declarar `interface User` a mano además del schema: se desincronizan.
- Modelar la respuesta cruda del backend (con envoltorios) en vez de la entidad.
- Poner un valor de UI (color, etiqueta en español) dentro del modelo de dominio.
- Olvidar el `as const` y perder los literales en `z.enum`.
