---
name: agregar-design-token
description: Agregar o cambiar un token en packages/design-tokens (primitivas, semánticas, componente) y regenerar tokens.css. Usar cuando un componente necesita un color, radio o sombra que todavía no existe como variable CSS.
---

# Agregar un design token

Aplica a `packages/design-tokens/src/`.

Lee primero `reglas-generales/SKILL.md`.

## Las tres capas

```
primitives  ->  semantic  ->  components
valor crudo     intención     uso concreto
oklch(...)      --accent      --button-primary-bg
```

- **Primitivas** (`src/primitives/index.ts`): paleta, `space`, `radius`,
  `fontSize`. Valores crudos sin significado. Ningún componente las consume.
- **Semánticas** (`src/semantic/index.ts`): el rol. Es la única capa con
  theming: existe `semanticLight` y `semanticDark` con exactamente las mismas
  claves.
- **Componente** (`src/components/index.ts`): alias por uso. Cada entrada apunta a
  una semántica o a un `radius-*`, nunca a un color literal. Está tipada con
  `satisfies Record<string, ComponentRef>`, así que un alias inválido no compila.

Regla dura: un componente de UI solo consume tokens de la capa 3 (o semánticas
cuando es layout general, como `--surface-base` o `--text-primary`). Nunca una
primitiva, nunca un color literal.

## Tipografía

La escala vive en `typeScale` (`packages/design-tokens/src/primitives/index.ts`)
y se nombra por rol, no por tamaño: `caption`, `label`, `body-sm`, `body`,
`body-lg`, `title-sm`, `title`, `title-lg`, `display`, `display-lg`. Cada paso
lleva su `lineHeight`.

Se emite dentro de `@theme`, y ahí mismo se borra la escala por defecto de
Tailwind con `--text-*: initial` (`packages/design-tokens/src/css.ts:30-47`). Por
eso `text-sm`, `text-2xl` o `text-[23px]` no existen en este proyecto.

Un tamaño que el diseño necesita y la escala no tiene se agrega como paso nuevo,
con nombre de rol. Nunca se resuelve con un valor arbitrario en el componente.

## Cómo elegir capa

| Situación                                            | Dónde va                                |
| ---------------------------------------------------- | --------------------------------------- |
| Tono nuevo que no existe en la paleta                | primitiva, y luego semántica que lo use |
| Rol nuevo del sistema (p. ej. `info`, `door-locked`) | semántica, en `light` **y** `dark`      |
| Un componente necesita nombrar su color              | componente, apuntando a una semántica   |

Si la respuesta es "solo lo usa este componente", casi siempre es capa 3
apuntando a una semántica existente.

## Pasos

1. Si falta el valor crudo, agregarlo a la paleta en `primitives/index.ts`.
2. Si falta el rol, agregarlo a `semanticLight` **y** a `semanticDark`
   (`semantic/index.ts`). Las claves deben coincidir: `SemanticToken` se deriva de
   `semanticLight` y el tipo rompe si falta en dark.
3. Agregar el token de componente en `components/index.ts`, con el nombre
   `componente-parte-estado`: `button-primary-bg-hover`, `card-border`,
   `table-row-hover`.
4. Regenerar el CSS: `pnpm --filter @bb/web gen:tokens`. También corre solo en
   `dev` y `build` (`apps/web/package.json:7-8`).
5. Consumirlo en el componente como `bg-(--button-primary-bg)`.

`apps/web/src/styles/tokens.css` es **generado**. No se edita a mano.

## Convención de nombres

- Todo en kebab-case y plano: `alert-error-title`, no `alert.error.title`.
- Estructura del nombre de componente: `<componente>-<variante>-<propiedad>[-estado]`.
  - `button-destructive-bg-hover`
  - `input-border-focus`
  - `menu-selected-foreground`
- `foreground` es el color del contenido sobre ese fondo; `text` es el color del
  texto cuando el fondo es transparente. Esa distinción ya está en uso en el botón
  (`packages/design-tokens/src/components/index.ts`).

## Modo oscuro

No se escribe `dark:` en los componentes. El CSS generado resuelve el tema por
`prefers-color-scheme` y por `data-theme` en `:root`
(`packages/design-tokens/src/css.ts:32-55`). Si un componente necesita un `dark:`,
falta un token.

## Checklist

- [ ] Valor crudo solo en primitivas.
- [ ] Rol nuevo presente en `semanticLight` y `semanticDark`.
- [ ] Token de componente apunta a una semántica o a `radius-*`, no a un literal.
- [ ] Nombre en kebab-case siguiendo `componente-variante-propiedad-estado`.
- [ ] `pnpm --filter @bb/web gen:tokens` ejecutado.
- [ ] `tokens.css` no editado a mano.
- [ ] `pnpm typecheck && pnpm lint && pnpm format`.

## Errores comunes

- Escribir un `oklch(...)` directo en la capa de componente.
- Agregar la clave solo en `semanticLight` (el typecheck lo detecta).
- Usar la primitiva desde el componente: `bg-(--cyan-500)` no existe a propósito.
- Editar `apps/web/src/styles/tokens.css` y perder el cambio en la próxima build.
