# Skills de front-bluebuilding

Reglas ejecutables para escribir código en este repo. Están en Markdown plano y
sin dependencias de ninguna herramienta, para que sirvan igual con Claude Code,
Gemini CLI, Cursor, Copilot o una persona.

## Cómo se usan

1. Siempre se lee primero `reglas-generales/SKILL.md`. Aplica a todo el repo.
2. Después se lee la skill de la tarea concreta (una sola, la que corresponda).
3. Al terminar, se corre `verificar-cambios/SKILL.md`.

Cada skill dice: cuándo aplica, las reglas, una plantilla copiable, el checklist
de salida y los errores comunes.

## Índice

| Skill                                                 | Cuándo                                                      |
| ----------------------------------------------------- | ----------------------------------------------------------- |
| [reglas-generales](reglas-generales/SKILL.md)         | Siempre, antes que cualquier otra                           |
| [crear-componente-ui](crear-componente-ui/SKILL.md)   | Primitivo visual en `apps/web/src/ui`                       |
| [crear-vista](crear-vista/SKILL.md)                   | Pantalla o feature en `apps/web/src/features` + ruta        |
| [crear-hook-logica](crear-hook-logica/SKILL.md)       | Query, mutación o store en `packages/logic`                 |
| [crear-gateway-api](crear-gateway-api/SKILL.md)       | Llamada nueva al backend en `packages/api-client`           |
| [crear-modelo-dominio](crear-modelo-dominio/SKILL.md) | Tipos, schemas zod, constantes o errores en `packages/core` |
| [validar-con-zod](validar-con-zod/SKILL.md)           | Duda sobre si un dato hay que validar y con qué método      |
| [revisar-ui](revisar-ui/SKILL.md)                     | Cerrar cualquier pantalla o componente visual               |
| [agregar-design-token](agregar-design-token/SKILL.md) | Color, radio, sombra o token de componente                  |
| [verificar-cambios](verificar-cambios/SKILL.md)       | Al cerrar cualquier cambio                                  |

## Feature completa: orden de trabajo

Una feature nueva casi siempre toca cuatro capas. El orden importa porque cada
capa depende de la anterior:

```
core (tipos + schemas)  ->  api-client (gateway)  ->  logic (hook)  ->  web (vista + UI)
```

Si al llegar a la vista falta un primitivo visual, se abre `crear-componente-ui`
antes de seguir.

## Puntos de entrada por herramienta

- `AGENTS.md` en la raíz: índice que leen la mayoría de agentes.
- `CLAUDE.md` y `GEMINI.md`: apuntan a `AGENTS.md`, no duplican contenido.
- `.claude/skills`: enlace simbólico a esta carpeta, para que Claude Code las
  descubra como skills invocables.

Regla: el contenido vive solo aquí. Los archivos por herramienta son punteros.
