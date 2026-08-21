---
name: escribir-comentarios
description: Cuándo escribir un comentario en front-bluebuilding y de qué tamaño (dos líneas como máximo, inglés simple). Usar siempre que se vaya a escribir o revisar un comentario en el código.
---

# Escribir comentarios

Casi todo el código va sin comentario. Se escribe uno solo cuando algo sorprende
y el código no lo puede decir por sí mismo.

## Las dos reglas

1. **Dos líneas como máximo.** Si no cabe, no es un comentario: es una decisión
   de diseño y va al `PLAN.md`, o es código que hay que aclarar con mejores
   nombres.
2. **Inglés simple.** Frases cortas, presente, palabras comunes. Quien mantiene
   esto no es nativo.

## Cuándo sí

| Caso                                | Ejemplo                                             |
| ----------------------------------- | --------------------------------------------------- |
| Rareza del backend                  | `// The API answers 204 for unknown users too.`     |
| Algo que parece un error y no lo es | `// We ignore the first frame: it is always empty.` |
| Un límite conocido                  | `// Only the last 60 photos are kept.`              |
| TODO con la condición para quitarlo | `// TODO: remove when every API sends doorId.`      |

Cuando la rareza está en otro repo, se cita el archivo y la línea:
`(api/src/hardware/index.ts:593)`. Sin la cita, en seis meses nadie sabe si sigue
siendo verdad.

## Cuándo no

- Para repetir lo que el código dice.
- Para contar por qué se eligió una solución: eso va al `PLAN.md`.
- Para explicar un nombre malo: se arregla el nombre.
- Para dejar código viejo apagado: se borra, está en git.

## Antes y después

```ts
// Mal: cuatro líneas, cuenta una historia y usa palabras raras.
// The same value under two names: the API renamed it to `origin` for the old
// panel and then put `eventOrigin` back, so today it sends both
// (api/src/2.0/cameras/controller/EventOpenDoorController.ts:20-21). We read
// whichever arrives.

// Bien: una línea, el dato que importa.
// The API sends the same value twice, as `origin` and as `eventOrigin`.
```

```ts
// Mal: repite el código.
// Parse the response and return the doors.

// Bien: no lleva comentario.
```

## Palabras

Se escribe con palabras que se entienden a la primera:

| En vez de                               | Se escribe                     |
| --------------------------------------- | ------------------------------ |
| `cry wolf on every heartbeat`           | `it would warn too often`      |
| `the DTO invents what it does not know` | `the API fills missing values` |
| `travels`, `lands`, `pilfers`           | `is sent`, `arrives`, `takes`  |

## Checklist

- [ ] Ningún comentario pasa de dos líneas.
- [ ] Cada uno dice algo que el código no puede decir.
- [ ] Las rarezas de otro repo llevan `archivo:línea`.
- [ ] Inglés simple, sin metáforas ni palabras poco comunes.
