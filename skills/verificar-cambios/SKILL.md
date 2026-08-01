---
name: verificar-cambios
description: Verificación obligatoria al cerrar cualquier cambio en front-bluebuilding (typecheck, lint, format y revisión de capas). Usar siempre antes de dar por terminada una tarea o de hacer commit.
---

# Verificar cambios

Se corre al terminar cada tarea, no al final de una tanda de tareas.

## Comandos

Desde la raíz del repo (`front-bluebuilding/`):

```
pnpm typecheck    # tsc estricto en los 6 paquetes
pnpm lint         # oxlint
pnpm format       # oxfmt --write .
```

- Con Node 22 (`nvm use`) y pnpm 11. `npm` y `yarn` están bloqueados por
  `engine-strict`.
- Si se tocaron tokens: `pnpm --filter @bb/web gen:tokens` antes del typecheck.
- Nada se da por terminado con typecheck o lint en rojo. Un error de tipos no se
  silencia con `any`, `!` ni `@ts-ignore`: se arregla.

Los git hooks repiten esto (`lefthook.yml`): pre-commit formatea y lintea lo que
está en stage y rechaza `enum`; pre-push corre el typecheck completo. Correrlo
antes evita descubrirlo en el push.

## Revisión antes de cerrar

Capas (`reglas-generales`):

- [ ] Ningún import cruza la dirección `apps -> logic -> api-client -> core`.
- [ ] `packages/logic` sin imports de UI ni de router.
- [ ] `apps/web` sin `fetch`, sin URLs de API, sin parseo de respuestas.
- [ ] Ningún import de un archivo interno de otro paquete: siempre por el barrel.

TypeScript:

- [ ] Sin `any`, sin `as` para forzar tipos, sin `!`, sin `@ts-ignore`.
- [ ] Sin `enum`.
- [ ] `import type` donde corresponde.

Consistencia:

- [ ] Todo lo público exportado en su barrel.
- [ ] Sin `console.*` fuera de `packages/logger`.
- [ ] Sin colores literales en componentes; solo tokens.
- [ ] Sin magic strings ni magic numbers nuevos.
- [ ] Sin código muerto ni archivos viejos que quedaron tras un rename.

## Si el cambio toca UI

Typecheck y lint no dicen nada sobre cómo se ve una pantalla. Cuando el cambio
incluye un componente visual o una vista, `revisar-ui/SKILL.md` es parte de esta
verificación, no un extra opcional. Sin eso, la tarea no está cerrada.

## Qué reportar

Al cerrar, decir en una línea: qué se cambió, qué comandos se corrieron y su
resultado real. Si algo quedó fuera o falló, decirlo explícitamente en vez de
omitirlo.
