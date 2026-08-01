---
name: reglas-generales
description: Reglas base del repo front-bluebuilding (capas, TypeScript sin any, prohibido enum, imports, naming). Leer antes de escribir o modificar cualquier archivo del monorepo.
---

# Reglas generales

Aplican a todo el monorepo. Ninguna otra skill las contradice.

## 1. Capas y dirección de dependencias

```
apps/web  ->  packages/logic  ->  packages/api-client  ->  packages/core
```

`packages/logger` y `packages/design-tokens` no dependen de nadie.

- Una capa solo importa lo que declara en su `package.json`. Si el import no está
  declarado, no se agrega el import: se replantea dónde va el código.
- `apps/web` no contiene lógica de negocio: llama hooks de `@bb/logic`.
- `packages/logic` no importa UI. Ni componentes, ni toast, ni modal, ni router.
  Expone estado y callbacks; quien lo usa decide qué pinta.
- `packages/api-client` es la capa anticorrupción: absorbe la forma real del
  backend actual y entrega tipos de `@bb/core`.
- `packages/core` no importa nada del repo salvo a sí mismo.

Prueba rápida: si un archivo de `logic` importa algo de `react-dom`, `lucide-react`
o `@tanstack/react-router`, está mal ubicado.

## 2. TypeScript

- **`any` prohibido.** Lo desconocido entra como `unknown` y se valida con zod en
  el borde (`packages/api-client/src/gateways.ts:42`). Tampoco `as unknown as X`.
  Qué es un borde y qué método usar: `validar-con-zod/SKILL.md`.
- **`enum` prohibido**, forzado en pre-commit (`lefthook.yml:11-17`). Se usa
  objeto `as const` + tipo derivado:

  ```ts
  export const DoorType = { Public: 'PUBLIC', Private: 'PRIVATE' } as const;
  export type DoorType = (typeof DoorType)[keyof typeof DoorType];
  export const DoorTypeSchema = z.enum(DoorType);
  ```

  Ejemplo real: `packages/core/src/access/constants.ts:1-5`.
  El `as const` es obligatorio: sin él zod infiere `string` y se pierden los literales.

- **`import type` para tipos.** `verbatimModuleSyntax` está activo, un import de
  tipo sin `type` rompe el build.
- **`noUncheckedIndexedAccess` activo**: `array[i]` es `T | undefined`. Se resuelve
  con `?? null` o un guard, nunca con `!`.
- **Sin `!` (non-null assertion)** ni `@ts-ignore`. Si el tipo no cuadra, se
  arregla el tipo o se valida en runtime (`apps/web/src/main.tsx:13-16`).
- Retornos públicos anotados explícitamente en `packages/*` (los hooks declaran
  `UseQueryResult<Door[]>`, ver `packages/logic/src/access/useAccessibleDoors.ts:7`).
- Uniones discriminadas en lugar de booleanos sueltos cuando hay estados excluyentes.

## 3. Valores y constantes

- **Sin magic strings ni magic numbers.** Todo valor con significado va a una
  constante nombrada en el dominio que le corresponde
  (`packages/core/src/access/constants.ts:9-13` para los códigos de puerta).
- Rutas de API, códigos de acción, nombres de eventos de socket: constantes, no
  literales repartidos.
- Excepción: clases de Tailwind, que deben quedar literales para que el compilador
  las detecte.

## 4. Errores

- Los errores de dominio extienden `DomainError` y declaran `code`
  (`packages/core/src/shared/errors.ts:1`, `packages/core/src/auth/errors.ts:3-5`).
- La traducción de error de transporte a error de dominio ocurre en el gateway
  (`packages/api-client/src/gateways.ts:49-59`), nunca en la UI.
- La UI decide el mensaje visible a partir del error de dominio; no lee `status`
  HTTP ni cuerpos crudos.

## 5. Logging

- `console.*` prohibido fuera de `packages/logger` (regla `no-console` en
  `.oxlintrc.json`). Se usa el `Logger` inyectado por `Services`
  (`packages/logic/src/services/context.ts:5-10`).

## 6. Naming y archivos

| Cosa                        | Convención             | Ejemplo                   |
| --------------------------- | ---------------------- | ------------------------- |
| Componente React            | PascalCase             | `Button.tsx`              |
| Carpeta de componente UI    | kebab-case             | `ui/button/`              |
| Hook                        | `use` + PascalCase     | `useAccessibleDoors.ts`   |
| Archivo de variantes        | `Componente-variants`  | `Button-variants.ts`      |
| Constantes / schemas / keys | descriptivo, minúscula | `constants.ts`, `keys.ts` |
| Tipo o interfaz             | PascalCase, sin `I`    | `LoginResponse`           |

- Un componente por archivo. Nada de `utils.ts` genéricos: la utilidad vive donde
  se usa o en el paquete que le corresponde.
- Barrel (`index.ts`) por dominio y por componente. Se importa del barrel, no del
  archivo interno: `import { Button } from '../../ui'`.
- Código, identificadores y comentarios en inglés. Documentación y textos de UI en
  español.
- El inglés del código es el estándar y simple: nombres que un equipo no nativo
  reconoce sin buscarlos. `RadioGroup`, no `SegmentedControl`; `Modal`, no
  `Overlay`. La variación visual se expresa con variantes, no inventando nombres
  (ver `crear-componente-ui`).

## 7. React

- Componentes como `function Component(props)`. Sin `React.FC`, sin `forwardRef`
  (React 19 pasa `ref` como prop normal: `apps/web/src/ui/button/Button.tsx:6-10`).
- Sin lógica de negocio en el componente: solo lectura de hooks, estado local de
  interfaz y render.
- Efectos solo para sincronizar con algo externo (socket, DOM, storage). Datos del
  servidor van por TanStack Query, no por `useEffect`.

## 8. Configuración

- Toda la configuración de la app vive en un solo módulo:
  `apps/web/src/config/app.config.ts`. Es el único archivo que conoce las
  variables `VITE_*`.
- Se valida con zod al arrancar, antes de crear los servicios
  (`apps/web/src/main.tsx:15-38`). Si falta algo, la app no monta y muestra qué
  falta en vez de fallar más tarde con un error confuso.
- Se consume con `getAppConfig()`, que devuelve un objeto congelado. Prohibido
  `import.meta.env` fuera de `src/config`, y prohibido exportar constantes de
  entorno sueltas.
- Los hooks y componentes no importan la config: reciben lo que necesitan a
  través de `Services`.
- Variable nueva: se agrega al schema y a `apps/web/.env.example` en el mismo
  cambio.

## 9. Antes de escribir código nuevo

1. Buscar si ya existe: schema en `core`, gateway en `api-client`, hook en `logic`,
   primitivo en `ui`.
2. Ubicar la capa correcta según la sección 1.
3. Abrir la skill específica de esa capa.
4. Cerrar con `verificar-cambios`.
