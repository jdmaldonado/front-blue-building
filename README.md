# front-bluebuilding

Monorepo del nuevo front de Blue Building. Web ahora (Vite + React, como **PWA
instalable**); React Native / Expo despues, reutilizando la capa de logica.

La web es responsive y mobile-first, y se entrega como PWA para servir de puente
en movil mientras existe la app nativa. Ver [Conceptos](#conceptos-a-estudiar).

## Requisitos

| Herramienta | Version    | Notas                                                            |
| ----------- | ---------- | ---------------------------------------------------------------- |
| Node        | 22 LTS     | El repo trae `.nvmrc`. Se recomienda instalarlo con nvm.         |
| pnpm        | 11 (min.)  | Forzado por `engines` + `engine-strict`. npm y yarn se rechazan. |
| git         | cualquiera | -                                                                |

- **Node con nvm** (recomendado): `nvm install 22 && nvm use`. `nvm use` toma la
  version del `.nvmrc` automaticamente.
- **pnpm 11**: `corepack use pnpm@11` (o `npm i -g pnpm@11`). Si `corepack` falla
  verificando la firma (bug de versiones viejas), corre antes
  `npm i -g corepack@latest`.

No uses `npm` ni `yarn` para instalar: `engine-strict=true` los rechaza a proposito.
El monorepo depende de `pnpm workspaces`.

## Puesta en marcha

```
nvm use          # Node 22 segun .nvmrc
pnpm install     # instala dependencias y los git hooks (lefthook, via "prepare")
pnpm dev         # levanta la web en modo desarrollo
```

Verificacion:

```
pnpm typecheck   # tsc estricto en todo el monorepo
pnpm lint        # oxlint
pnpm format      # oxfmt
```

## Regla de oro: las capas

Las dependencias van en un solo sentido. Un paquete solo puede importar lo que
declara en su `package.json`, y eso alcanza para forzar la regla:

```
apps  ->  logic  ->  api-client  ->  core
```

`logger` y `design-tokens` no dependen de nadie. La UI (`apps`) nunca contiene
logica de negocio. La logica (`packages/logic`) nunca importa UI (ni toast, ni
modal, ni router): expone estado y callbacks, y quien la usa decide la UI.

## Convenciones de codigo

Las reglas completas, con plantillas y checklists por tipo de tarea, estan en
[`skills/`](skills/README.md); [`AGENTS.md`](AGENTS.md) es el punto de entrada
para cualquier modelo o desarrollador nuevo. Lo de abajo es el resumen.

- **Prohibido `enum`** (forzado en `pre-commit`). Usa un objeto/array `as const` y
  validalo con `z.enum`:

  ```ts
  export const DoorType = { Public: 'PUBLIC', Private: 'PRIVATE' } as const;
  export const DoorTypeSchema = z.enum(DoorType);
  export type DoorType = (typeof DoorType)[keyof typeof DoorType];
  ```

  Pasa el objeto/array directo o con `as const`; si lo declaras como variable sin
  `as const`, zod infiere `string` y pierdes los literales.

- **Sin magic numbers ni magic strings.** Todo valor con significado va a una
  constante nombrada por dominio (codigos de accion de puerta, estados, etc.). No se
  fuerza con lint (`no-magic-numbers` es ruidoso); se cuida en revision.

- **TanStack Query: query keys en constantes.** Cada dominio expone una fabrica de
  keys reutilizable, para invalidar sin repetir strings:

  ```ts
  export const doorKeys = {
    all: ['doors'] as const,
    byBuilding: (buildingId: string) => [...doorKeys.all, 'building', buildingId] as const,
  };
  ```

- **Componentes de UI aislados.** Cada primitivo de `apps/web/src/ui` vive en su
  carpeta con tres archivos: el componente, su `Componente-variants.ts` (clases y
  variantes con `cva`) y un `index.ts`. Se importa siempre desde el barrel raiz.

  ```
  ui/button/{Button.tsx, Button-variants.ts, index.ts}
  ```

## Estructura

| Paquete                  | Que contiene                                                 |
| ------------------------ | ------------------------------------------------------------ |
| `packages/core`          | Tipos, contratos (zod) y errores, organizados por dominio    |
| `packages/api-client`    | HTTP + socket tipado; capa anticorrupcion del backend actual |
| `packages/logic`         | Hooks de negocio (TanStack Query + Zustand), sin UI          |
| `packages/logger`        | Logging estructurado; `console.log` prohibido fuera de aqui  |
| `packages/design-tokens` | Tokens: primitivas -> semanticas -> componente               |
| `apps/web`               | App web (Vite + React + TanStack Router, PWA). Se hace en F2 |

`core` se divide por dominio (`auth`, `access`, `cameras`, `buildings`,
`users`, `shared`). `api-client` y `logic` espejan esos mismos dominios.

## Tooling

oxlint (lint), oxfmt (formato), lefthook (git hooks), Turborepo, TypeScript
estricto.

- `pre-commit`: formatea y lintea solo los archivos en stage.
- `pre-push`: corre `typecheck` de todo el monorepo.

oxlint no valida tipos; la red de seguridad es `tsc` estricto en `pre-push`.

## Conceptos a estudiar

Lo que se maneja en este repo, para saber que aprender antes de tocar codigo.

- **Monorepo y tooling**: pnpm workspaces, Turborepo, TypeScript estricto,
  oxlint / oxfmt, lefthook (git hooks).
- **Arquitectura**: separacion por capas y regla de dependencia unidireccional,
  organizacion por dominio (feature-sliced), Ports & Adapters (para I/O de
  plataforma: storage, transporte, logger), capa anticorrupcion (aislar el
  backend actual), manejo de errores con uniones discriminadas tipadas.
- **Web**: React, Vite, PWA y service workers, TanStack Router (rutas finas:
  guard + params -> PageComponent), TanStack Query (estado de servidor),
  Zustand (estado de cliente).
- **Contratos y datos**: zod (validacion en el borde), socket.io-client tipado.
- **Design system**: design tokens en tres capas (primitivas, semanticas,
  componente), theming claro/oscuro, Tailwind.
- **Futuro**: React Native / Expo, que reutiliza `logic`, `api-client`, `core`,
  `logger` y `design-tokens` (no la UI web).
