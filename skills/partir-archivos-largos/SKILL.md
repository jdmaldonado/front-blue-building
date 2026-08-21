---
name: partir-archivos-largos
description: Límite de tamaño por archivo en front-bluebuilding (250 líneas de código) y cómo partir uno que se pasó, por responsabilidad y no por la mitad. Usar cuando el lint avisa de max-lines o cuando un archivo empieza a costar de leer.
---

# Partir archivos largos

El límite es **250 líneas de código por archivo**. No cuentan los comentarios ni
las líneas en blanco: explicar una rareza del backend no gasta presupuesto.

Lo vigila oxlint con la regla `max-lines` (`.oxlintrc.json`). Es un **aviso**, no
un error: no rompe el build, pero no se deja crecer.

## De dónde sale el número

Del propio repo, no de una guía de internet:

|                 | líneas |
| --------------- | ------ |
| Archivo mediano | 25     |
| Percentil 90    | 99     |
| Percentil 95    | 131    |

Un archivo de 250 líneas ya es casi el doble del 5% más grande. Si uno llega
ahí, no es que sea un poco largo: es que se le fueron metiendo cosas.

## El número es la alarma, no la regla

La regla de verdad es **un archivo, una responsabilidad**. El contador solo avisa
tarde. Estas señales llegan antes:

- Hay que hacer scroll para saber qué exporta.
- El nombre del archivo ya no describe todo lo que hay dentro.
- Para cambiar una cosa hay que leer otras tres que no tienen que ver.
- Dos personas tocan el mismo archivo por motivos distintos.

Con cualquiera de esas, se parte aunque tenga 120 líneas.

## Cómo se parte

Se corta por lo que hace, no por la mitad. Recetas para lo que aparece en este
repo:

| Caso                                                  | Qué se saca               | Adónde                                               |
| ----------------------------------------------------- | ------------------------- | ---------------------------------------------------- |
| Tabla con muchas columnas                             | La definición de columnas | `<Tabla>.columns.tsx`, al lado                       |
| Formulario largo                                      | Cada bloque de campos     | Un componente por sección, en `components/`          |
| Cliente con varios temas (puertas, cámaras, lectoras) | Cada tema                 | Un archivo por dominio; el original queda de fachada |
| Vista con lógica de datos dentro                      | La lógica                 | Un hook en `packages/logic`                          |
| Tipos, constantes y errores juntos                    | Cada grupo                | `<dominio>.constants.ts`, `<dominio>.errors.ts`      |

Los nombres siguen la convención del repo: el archivo lleva el dominio delante
(`cards.errors.ts`, `buildings.keys.ts`), y solo `index.ts` va sin prefijo.

## Cómo NO se parte

- **Sin archivos `utils.ts` o `helpers.ts`.** Un nombre que no dice qué hay
  dentro es el mismo problema en un archivo más.
- **No se saca un trozo solo para bajar el contador.** Si el pedazo no tiene
  nombre propio ni se usa en otro sitio, no se partió nada: se escondió.
- **No se corta un componente en dos si el segundo necesita diez props para
  volver a pegarse.** Eso es señal de que el corte iba por otro lado.

## Cuando no hay nada que partir

Hay archivos largos que son una lista: contenido de texto, catálogos de tokens,
barrels de exports. Ahí no hay responsabilidades que separar y partirlos empeora
la lectura. Se apaga la regla para ese archivo en `.oxlintrc.json`:

```json
{
  "files": ["apps/web/src/features/registration/components/TermsContent.tsx"],
  "rules": { "max-lines": "off" }
}
```

Una excepción se justifica en el PR. Si hay que apagarla dos veces en la misma
semana, el problema es el límite, no los archivos.

## Comprobar

```
pnpm lint                     # avisa de los que se pasaron
```

Para ver el panorama, los veinte más largos:

```
find apps packages -name '*.ts' -o -name '*.tsx' \
  | grep -v node_modules | grep -v routeTree.gen \
  | xargs wc -l | sort -rn | head -20
```

## Checklist

- [ ] Cada archivo nuevo tiene una responsabilidad que cabe en su nombre.
- [ ] `pnpm lint` no suma avisos de `max-lines` que antes no estaban.
- [ ] Ningún archivo nuevo se llama `utils`, `helpers` o `common`.
- [ ] Los imports siguen respetando las capas (`reglas-generales/SKILL.md`).
- [ ] Si se apagó la regla en algún archivo, está dicho por qué.
