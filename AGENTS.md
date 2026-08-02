# Guía para agentes y desarrolladores

Este archivo es el punto de entrada. Vale igual para una persona, para Claude,
para Gemini o para cualquier otro modelo.

## Cómo trabajar en este repo

1. Leer `skills/reglas-generales/SKILL.md`. Siempre, antes de escribir código.
2. Leer la skill de la tarea concreta (índice en `skills/README.md`).
3. Escribir el código siguiendo la plantilla y el checklist de esa skill.
4. Si el cambio toca UI, pasar `skills/revisar-ui/SKILL.md` con el mock delante.
5. Cerrar con `skills/verificar-cambios/SKILL.md`.

Las skills mandan sobre cualquier costumbre traída de otro proyecto. Si algo no
está cubierto, se sigue el patrón del código existente en la misma capa.

## Skills

| Skill                                                        | Cuándo                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------- |
| [reglas-generales](skills/reglas-generales/SKILL.md)         | Siempre, antes que cualquier otra                       |
| [crear-componente-ui](skills/crear-componente-ui/SKILL.md)   | Primitivo visual en `apps/web/src/ui`                   |
| [crear-vista](skills/crear-vista/SKILL.md)                   | Pantalla o feature en `apps/web/src/features` + ruta    |
| [crear-hook-logica](skills/crear-hook-logica/SKILL.md)       | Query, mutación o store en `packages/logic`             |
| [crear-gateway-api](skills/crear-gateway-api/SKILL.md)       | Llamada nueva al backend en `packages/api-client`       |
| [crear-modelo-dominio](skills/crear-modelo-dominio/SKILL.md) | Tipos, schemas, constantes o errores en `packages/core` |
| [validar-con-zod](skills/validar-con-zod/SKILL.md)           | Duda sobre si un dato hay que validar y con qué método  |
| [revisar-ui](skills/revisar-ui/SKILL.md)                     | Cerrar cualquier pantalla o componente visual           |
| [agregar-design-token](skills/agregar-design-token/SKILL.md) | Color, radio, sombra o token de componente              |
| [verificar-cambios](skills/verificar-cambios/SKILL.md)       | Al cerrar cualquier cambio                              |

## Reglas que nunca se negocian

- Dependencias en un solo sentido: `apps -> logic -> api-client -> core`.
- Prohibido `any`. Lo externo entra como `unknown` y se valida con zod en el
  borde, una sola vez (`skills/validar-con-zod/SKILL.md`).
- Prohibido `enum`. Objeto `as const` + tipo derivado.
- Lógica separada de interfaz: `packages/logic` no importa UI; `apps/web` no
  hace fetch.
- Componentes de UI en carpeta propia con barrel y `Componente-variants.ts`.
- `ui/` primitivos sin dominio, `layouts/` marcos de ruta, `features/` pantallas
  con `components/`, `hooks/` y `lib/` internos.
- Colores solo por design tokens y tamaños de texto solo por la escala del
  sistema (`text-body`, `text-title`...). Nada de `text-[23px]` ni `text-sm`.
- `console.*` solo dentro de `packages/logger`.
- Se cierra con `pnpm typecheck && pnpm lint && pnpm format` en verde.

## Contexto rápido

Monorepo pnpm + Turborepo. Web en Vite + React 19 + TanStack Router/Query +
Tailwind v4, entregada como PWA. Más adelante, React Native reutilizando
`logic`, `api-client`, `core`, `logger` y `design-tokens`.

Detalles de instalación, estructura y tooling: `README.md`.
