# Plan de migración del front

Estado vivo de la migración de `front` (React 16, viejo) a `front-bluebuilding`.
Se actualiza al cerrar cada fase. Para entender el sistema, leer antes
`../bluebuilding-docs/` (empezar por `CLAUDE.md` y `README.md`).

**Última actualización:** 2026-08-05

## Cómo se trabaja

- Una fase por vez. No se empieza la siguiente sin visto bueno.
- Antes de escribir código: `skills/reglas-generales/SKILL.md`.
- Al cerrar: `pnpm typecheck && pnpm lint && pnpm format`, y `pnpm --filter @bb/web build`.
- Tareas de layout o estructura: proponer y esperar aprobación antes de tocar código.
- Comentarios en el código solo cuando expliquen algo que el código no dice, en
  inglés simple y cortos.

## Decisiones tomadas

| Tema                       | Decisión                                                                          |
| -------------------------- | --------------------------------------------------------------------------------- |
| Acceso al panel            | Guard por ruta en `/admin` (`requireSuperUser`), valida `userType === SUPER_USER` |
| Organización               | Por edificio, no por módulo. Panorama global + secciones dentro del edificio      |
| Secciones del edificio     | En la barra lateral, no sobre el contenido (el plano necesita el alto)            |
| Vista de cámaras del staff | Es la misma pantalla del residente, reutilizada tal cual                          |
| Tema oscuro                | Fuera por ahora. Los tokens ya lo soportan                                        |
| Efecto de escaneo          | Va en la lectura de tarjetas, nunca sobre las cámaras                             |
| Escritorio del residente   | Mantiene el layout actual con barra lateral. La barra inferior es de móvil        |

## Fases cerradas

### Fase 0 — Documentación

- `bluebuilding-docs/03-panel-admin/lectoras.md`: tiempos de la lógica (BB-428),
  límites de 24 h, `alert_auto_silence_timeout_min = 0` significa deshabilitado.
- `bluebuilding-docs/03-panel-admin/camaras-edificio.md`: doc nuevo de la vista de
  cámaras, incluido el botón de recargar.
- `bluebuilding-docs/03-panel-admin/00-overview.md`: qué NO hace el panel (no hay
  alta de edificios, apartamentos, puertas ni cámaras) y estado de dispositivos.
- `bluebuilding-docs/07-abierto/propuestas-panel-admin.md`: propuestas de backend.

### Fase 1 — Base del design system

- Tokens de movimiento en `packages/design-tokens`: `duration`, `easing`,
  animaciones `fade-in`, `scan`, `sweep`, `shimmer`, `breathe`.
- Regla única de `prefers-reduced-motion` en `apps/web/src/styles/app.css`.
- Primitivos nuevos en `apps/web/src/ui`: `DataTable` (TanStack Table, con modo
  tarjetas en móvil y orden desde móvil), `Tabs`, `DropdownMenu`, `Checkbox`,
  `Switch`, `Textarea`, `Tooltip`, `Skeleton`, `StatusDot`, `EmptyState`,
  `Pagination`. `Avatar` acepta foto y `RadioGroup` acepta `hideLabels`.
- Cámaras: `object-contain` en vez de `cover`, botón de recargar, control de
  1/2/3 por fila que se recuerda entre aperturas.
- Socket: se vuelve a mandar `init` y a re-suscribir en cada reconexión, con
  conteo de vistas por sala.

### Fase 2 — Esqueleto del panel

- `requireSuperUser` en `apps/web/src/app/guards.ts`.
- Rutas: `/admin`, `/admin/buildings/$id`, `/admin/buildings/$id/live`.
- Panorama de edificios con DataTable, búsqueda y estado.
- `BuildingActions`: silenciar, mantenimiento, reiniciar equipo. Reutilizado en
  la tabla y en la cabecera del edificio.
- `QuickSearch` (Ctrl+K) para saltar a un edificio.

### Fase 3 — Apartamentos y ajustes

- `/admin/buildings/$id/apartments` con baja de apartamento y refresco real.
- `/admin/buildings/$id/settings` con mantenimiento, silenciar y reiniciar.
- Hallazgos documentados: `Apartment.active` significa "puede recibir llamadas
  del citófono", y el apartamento dado de baja desaparece de la lista.

### Fase 4 — Usuarios

- `ResidentsTable` compartida por tres pantallas: `/admin/users`,
  `/admin/buildings/$id/users`, `.../apartments/$apartmentId/users`.
- Editar teléfono y activar/desactivar con arrastre de tarjetas.
- Hallazgos documentados: la edición de `alias` nunca funcionó, la respuesta
  viene envuelta en `{ user: ... }`, y el DTO no trae ids de apartamento ni de
  edificio.

### Fase 5 — Interfaz del residente

El layout nuevo es solo del residente. Los cambios de la pantalla de puertas los
hereda también el staff: es la misma pantalla y así se queda.

- Tokens semánticos `brand-border` y `brand-hover`, y la familia `menu-panel-*`
  del panel del residente. El menú habla el mismo idioma que el panel del login:
  superficie oscura, panal y cian solo como acento.
- `Drawer` gana la variante `size: 'panel' | 'full'` y pasa a duraciones por
  token en vez de `300ms` literal.
- `AppShell` acepta `mobileNav`: sustituye la hamburguesa y el panel lateral de
  móvil, esconde `headerActions` en móvil y reserva sitio abajo. Escritorio igual.
- `layouts/resident/`: barra inferior fija (inicio, alerta, menú) y menú diagonal
  con logo, bloque de identidad, Perfil y Salir. También en `/account`, que es a
  donde lleva el menú.
- `useSignOut` extraído de `AppUserCard`, compartido con el menú del residente.
- Carrusel de pisos con `Tabs` en vez del `Select`; los pisos sin puertas ya no
  se listan. `Tabs` gana `snap-x`.
- Navegación entre puertas en el diálogo: anterior a la izquierda y siguiente a
  la derecha, flechas del teclado y deslizar con el dedo (`useSwipe`, que exige
  `touch-pan-y` en su área). `Dialog` acepta `description` como nodo y `onKeyDown`.
- Abrir una puerta ya da señales: botón en curso, error con motivo, éxito cuando
  llega el evento de la puerta y aviso si en 8 s no contestó nadie.
- Arreglado: `Dialog` usaba `id="dialog-title"` fijo, así que dos diálogos
  abiertos a la vez compartían el id.
- Arreglado: el plano usaba `--surface-inverse` y dejaba franjas negras.

### Fase 5.5 — Esquinas marcadas

Decisión del dueño: fuera los bordes redondeados, para que la app se lea técnica
y no como cualquier dashboard. Afecta a toda la app, panel de admin incluido.

- `radius` 1/2/3 pasan a 0. `round` se queda, reservado a lo que es círculo por
  naturaleza: puntos de estado, pomo del switch, el radio y su punto, y los
  extremos de la barra de la pestaña activa.
- Ocho componentes consumían `--radius-round` directo, saltándose la capa 3. Se
  crearon `badge-radius`, `icon-button-radius`, `tab-radius`,
  `toggle-track-radius`, `radio-track-radius` y `avatar-radius`, y ahora sí se
  gobierna el radio desde los tokens.
- Primitivo `CornerBrackets`: cuatro marcas en L en las esquinas del marco.
  Aplicado a la tarjeta de cámara (cian en vivo, gris sin señal) y al plano.
  Tokens `corner-bracket-line` y `corner-bracket-line-muted`.
- `ink[75]`: el fondo de la app deja de ser casi blanco y pasa a un gris azulado,
  para que las tarjetas se apoyen en algo.
- Trazo de los iconos a 1.5 en toda la app, con `LucideProvider` en `main.tsx`.
- La esquina cortada con `clip-path` solo se usa en decoración que no recibe
  clics, como el bloque del logo del diálogo: en algo pulsable recortaría también
  el anillo de foco y la sombra.
- Abierto: encender el tema oscuro. Los tokens ya están completos; es lo que de
  verdad cambiaría el carácter de un producto de monitoreo.

### Filtros de tabla y detalles de móvil

- Filtros genéricos: se declaran en `meta.filter` de la columna y los pinta
  `DataTableToolbar`, que la vista coloca donde quiera. Estado compartido con la
  tabla vía `useDataTableFilters`. Aplicado a edificios, apartamentos y usuarios.
  El buscador con lupa, que estaba copiado en tres pantallas, vive ahora ahí.
- `Tabs` avisa de que se desliza: degradado en el borde que todavía tiene
  contenido, medido con `ResizeObserver`. Si la tira cabe entera, no hay
  degradado.
- Los items de `DropdownMenu` pasan a `text-body` y 44px de alto en móvil.
- Paso nuevo en la escala, `field` = 16px, para `Input`, `Select` y `Textarea` en
  móvil: por debajo de 16px Safari hace zoom al enfocar el campo.
- El panal tiene una segunda versión con trazo de marca (`honeycomb-brand`), que
  sí se ve sobre superficies claras. Hoy no la usa nadie: se deja porque es la
  pieza que faltaba para texturizar superficies claras.
- La cabecera de `Dialog` se queda **sin marca**. Se probaron tres caminos y se
  descartaron los tres: textura de panal en toda la cabecera (leía como papel
  pintado), bloque cian a la izquierda (robaba ancho al título y en móvil lo
  partía en dos líneas) y cabecera cian completa (dejaba huecos raros). La
  cabecera limpia es la que funciona.
- Los controles del diálogo de puerta —badge de estado, cámaras por fila y
  recargar— van en la cabecera, no en el cuerpo: el cuerpo tiene scroll propio y
  ahí desaparecerían justo al bajar a mirar las cámaras.

### Fase 6 — Tarjetas

`/admin/cards`, con `document`, `buildingId` y `doorId` en la query: se llega
desde el menú, desde una fila de la tabla de usuarios, o desde un edificio.

- Dominio nuevo en `packages/core/src/cards`: `Card`, `CardType`, la ventana de
  60 s de la lectora y los errores. Mismo reparto que residentes: `tag` estricto,
  el resto degrada.
- `CardsGateway` y el alta, edición y baja. `HttpClient` aprende a mandar
  `FormData` sin escribir el `Content-Type`, para la validación con imágenes.
- `AccessGateway.listBuildingDoors`: todas las puertas del edificio, no solo las
  accesibles. Acepta lista pelada o envuelta en `doors`.
- `SocketClient.setupCardReader`: `card:setup` + `read_tag` con limpieza real.
  Ignora lecturas repetidas del mismo tag, porque la API registra su listener con
  `.on` y no lo quita nunca.
- `useCardReader` en `logic`: estados de la lectora y cuenta atrás del minuto.
- El efecto `animate-scan` vive en `CardScanArea`, el área que espera la lectura.
- El borrado pide confirmación: en la API es borrado duro.

**Aviso**: el modo registro es **por puerta**, no por edificio. En el camino
legacy solo una puerta del edificio puede estar en ese modo a la vez.

### Fase 7 — Lectoras

`/admin/buildings/$id/readers`, una sección más del edificio. Entró después de
actualizar `front`, `api` y `RPI-blue-building`, que traían el PR de telemetría.

- Dominio en `packages/core/src/readers`: catálogo de estados de lectora
  reducido a seis niveles de salud, `LOGIC_FIELDS` declarativo (añadir un tiempo
  es añadir una entrada) y los valores por defecto de maestra y esclava.
- La telemetría **viaja en `door_update_${buildingId}`**, el mismo evento del
  estado de puertas. `DoorEventDataSchema` se ensanchó para no descartarla.
- `SocketClient.rebootReader` y `configureReader`, con la espera de 15 s solo en
  el reinicio, que es donde el panel viejo la tiene.
- Tabla de lectoras con estado en vivo, filtro por estado, reinicio con
  confirmación y configuración por secciones: hardware, tiempos, red e identidad.
- Punto de salud en el panorama de edificios, alimentado por la telemetría ya
  cacheada.

- Del `readerState` de la telemetría se leen wifi, device id y versiones de
  firmware. Las secciones de Red e Identidad arrancan con lo que la lectora
  reporta, no en blanco.

**Avisos que vienen del backend, no nuestros**: el éxito significa "la API lo
reenvió", no "la lectora lo aplicó"; el hardware y los tiempos **no se pueden
leer** —solo existe el evento de escritura—, así que esas dos secciones parten
de los valores por defecto; y `alert_auto_silence_timeout_min = 0` significa
deshabilitado.

### Tooltips y confirmaciones

- `IconButton` muestra su `label` como tooltip al pasar el puntero. La burbuja va
  dentro del botón, no en un envoltorio, porque un envoltorio se tragaría las
  clases de layout de quien lo usa. En táctil no aparece: no hay hover.
- Confirmación en todo lo que cambia el mundo físico o es difícil de deshacer:
  configurar lectora, poner una lectora en modo registro, crear tarjeta, validar
  usuario y editar tarjeta, además de las que ya la tenían.
- **A propósito sin confirmación**: abrir puerta, que es la acción diaria del
  residente y ya queda registrada con quién la hizo; editar teléfono, que se
  deshace editando otra vez; y emergencia, por la decisión previa de que
  preguntar dos veces cuesta segundos que importan.

## Fases siguientes

### Barrido visual pendiente

Cada fase se ha ido revisando en el navegador sobre la marcha. Lo que falta es un
barrido por las pantallas que nadie ha vuelto a abrir desde que cambiaron los
radios, y dos cosas que no se pueden comprobar en el emulador.

- Barrido del panel de admin a 390 / 768 / 1280 con `skills/revisar-ui/SKILL.md`:
  esquinas sin redondeo en tablas, badges, pestañas y botones. Ese cambio tocó
  cada pantalla, no solo las que se estaban tocando esos días.
- En un teléfono real: los `<select>` nativos, para decidir si hace falta un
  desplegable propio, y el paso `field` de 16px que evita el zoom de Safari.
- Con una lectora real: el ciclo `card:setup` → `read_tag` de punta a punta, y si
  `POST /api/bluebuilding/doors` responde una lista pelada o envuelta en `doors`
  (hoy se aceptan las dos formas porque no había manera de saberlo).

### Fase 8 — Monitoreo de eventos

Eventos críticos con ciclo de incidente, intrusos con galería y cámara en vivo,
puertas abiertas.
Doc: `bluebuilding-docs/03-panel-admin/monitoreo-eventos.md`.

### Fase 9 — Cierre

Revisión de movimiento reducido, accesibilidad, responsive a 390 / 768 / 1280 y
PWA.

## Pendiente de backend

Detalle y tamaño en `bluebuilding-docs/07-abierto/propuestas-panel-admin.md`.

1. Un `GET` de telemetría de lectoras. Hoy vive solo en memoria en la API y solo
   se empuja por socket, así que al entrar en el panorama no hay nada que mostrar
   hasta que una lectora cambie de estado.
2. `GET /buildings/overview` privado con metadata de estado, separado del listado
   público que llena los selects.
3. Paginación, búsqueda y filtro por edificio en `usersV2/ResidentUserDetails`.
4. Guardar la última configuración enviada a una lectora.
5. `init:success` en el socket, para quitar la espera fija de 600 ms.

## Deuda conocida en la app nueva

- Falta el barrido del panel de admin tras el cambio de radios: se revisó lo que
  se estaba tocando, no las pantallas que quedaron intactas esos días.
- El éxito de abrir una puerta se deduce de que llegue un evento nuevo de esa
  puerta. Si el backend expusiera una confirmación, sobra la espera de 8 s.
- La vista de usuarios de un edificio filtra en el navegador por nombre de
  edificio, porque la API no da otra cosa. Anotado como `TODO` en el código.
- La lista de residentes se lee fila a fila: `id`, `cedula` y `name` son
  obligatorios y el resto degrada a null. Las filas descartadas se cuentan en
  pantalla y se detallan en el log. Falta ver qué usuarios reales fallan.
- El resumen del edificio muestra poco: falta el estado de dispositivos.
- Decisión abierta: el botón de eventos que había en la cabecera del edificio del
  staff se quitó; silenciar ya está en el menú de acciones.
