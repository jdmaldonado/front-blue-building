---
name: crear-componente-ui
description: Crear o modificar un primitivo visual en apps/web/src/ui (carpeta aislada, barrel, Componente-variants.ts con cva, tokens CSS). Usar cuando la tarea pide un botón, input, card, badge, tabs, modal, toast o cualquier pieza reutilizable de interfaz.
---

# Crear un componente de UI

Aplica a `apps/web/src/ui`. Un primitivo es reutilizable, sin dominio y sin datos:
no sabe qué es una puerta ni un residente. Si necesita saberlo, es una vista y va
en `features` (ver `crear-vista`).

Lee primero `reglas-generales/SKILL.md`.

## Estructura obligatoria

Una carpeta por componente, tres archivos:

```
apps/web/src/ui/
  cn.ts                      # utilidad compartida
  index.ts                   # barrel raíz de la librería
  button/
    Button.tsx               # markup, props y accesibilidad
    Button-variants.ts       # clases y variantes (sin JSX)
    index.ts                 # barrel del componente
```

Reglas de la estructura:

- El JSX nunca contiene strings largos de clases: viven en `-variants.ts`.
- El `-variants.ts` no importa React ni JSX.
- El barrel del componente exporta el componente, las variantes y los tipos.
- El barrel raíz (`ui/index.ts`) reexporta desde la carpeta, no desde el archivo.
- Fuera de `ui` siempre se importa del barrel raíz: `import { Button } from '../../ui'`.

## Reglas de estilo

- **Solo tokens.** Colores, radios y sombras se consumen como variables CSS:
  `bg-(--button-primary-bg)`, `rounded-(--card-radius)`. Prohibido `bg-blue-500`,
  hex o `rgb()` en un componente. Si falta el token, se agrega primero
  (`agregar-design-token`).
- **Clases literales.** Nada de `` `bg-${color}-500` ``: Tailwind escanea texto y
  no ve las clases construidas en runtime.
- **`cn` para combinar.** Siempre `cn(variantes(...), className)`, con el
  `className` del llamador al final para que `tailwind-merge` lo deje ganar
  (`apps/web/src/ui/cn.ts:6-8`).
- **Iconos de `lucide-react`**, tipados como `LucideIcon`
  (`apps/web/src/ui/alert/Alert.tsx:6-11`).
- Modo claro/oscuro no se maneja en el componente: lo resuelven los tokens.

## Reglas de API del componente

- Props = props nativas + variantes:
  `ComponentProps<'button'> & ButtonVariants`.
- Las variantes se derivan con `VariantProps<typeof xVariants>`, no se escriben
  dos veces.
- Los defaults van en `defaultVariants` de cva, no en la firma de la función.
- `ref` es una prop normal (React 19): `ref?: Ref<HTMLButtonElement>`.
- Se hace spread de `...props` al elemento raíz, para no bloquear `id`,
  `aria-*` ni handlers.
- Si el nombre choca con un atributo nativo, se renombra la variante
  (`inputSize` en vez de `size`: `apps/web/src/ui/input/Input.tsx:7-10`).
- Accesibilidad desde el primer commit: `type="button"` por defecto,
  `aria-busy` en carga, `role="alert"`, `focus-visible` visible, `disabled`
  coherente con `loading`.
- Sin estado de negocio y sin `useQuery`. Estado local solo si es de interfaz
  (abierto/cerrado, hover controlado).

## Plantilla

`Badge-variants.ts`:

```ts
import { cva, type VariantProps } from 'class-variance-authority';

export const badgeTones = ['neutral', 'success', 'danger'] as const;
export type BadgeTone = (typeof badgeTones)[number];

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-(--badge-radius) px-2 py-0.5 text-xs font-medium',
  {
    variants: {
      tone: {
        neutral: 'bg-(--badge-neutral-bg) text-(--badge-neutral-text)',
        success: 'bg-(--badge-success-bg) text-(--badge-success-text)',
        danger: 'bg-(--badge-danger-bg) text-(--badge-danger-text)',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;
```

`Badge.tsx`:

```tsx
import type { ComponentProps } from 'react';
import { cn } from '../cn';
import { badgeVariants, type BadgeVariants } from './Badge-variants';

type BadgeProps = ComponentProps<'span'> & BadgeVariants;

export function Badge({ tone, className, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
```

`index.ts`:

```ts
export { Badge } from './Badge';
export { badgeTones, badgeVariants } from './Badge-variants';
export type { BadgeTone, BadgeVariants } from './Badge-variants';
```

Y en `ui/index.ts`:

```ts
export { Badge, badgeTones, badgeVariants } from './badge';
export type { BadgeTone, BadgeVariants } from './badge';
```

## Casos con más de un eje de variación

Cuando dos ejes se combinan (intent x appearance), cada eje se declara en
`variants` y la combinación va en `compoundVariants`, no en un `Record` anidado.
Referencia: `apps/web/src/ui/button/Button-variants.ts:14-109`.

## Subpartes

Si el componente tiene partes con estilo propio (título, mensaje, item), se
exporta una función de variantes por parte desde el mismo `-variants.ts`
(`alertVariants`, `alertTitleVariants`, `alertTextVariants` en
`apps/web/src/ui/alert/Alert-variants.ts`). No se crea otra carpeta.

## Checklist

- [ ] Carpeta propia con `Componente.tsx`, `Componente-variants.ts`, `index.ts`.
- [ ] Reexportado en `apps/web/src/ui/index.ts`.
- [ ] Cero colores crudos: solo `var(--token)` vía `bg-(--token)`.
- [ ] Clases literales, sin plantillas dinámicas.
- [ ] Tipos derivados con `VariantProps`, sin duplicar uniones.
- [ ] `cn(variantes(), className)` con el `className` externo al final.
- [ ] `...props` al elemento raíz y `ref` como prop.
- [ ] Foco visible y roles/aria correctos.
- [ ] Sin datos, sin fetch, sin dominio.
- [ ] `pnpm typecheck && pnpm lint && pnpm format` (ver `verificar-cambios`).

## Errores comunes

- Reexportar en el barrel raíz desde `./button/Button` en vez de `./button`.
- Poner el `className` del llamador antes de las variantes: deja de sobrescribir.
- Usar `size` como nombre de variante en `input`, `select` o `textarea`.
- Meter `useState` de datos del servidor en el primitivo.
- Crear una carpeta nueva para una subparte que solo se usa dentro del componente.
