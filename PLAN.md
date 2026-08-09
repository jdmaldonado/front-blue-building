# Plan de migración del front

Estado vivo de la migración de `front` (React 16, viejo) a `front-bluebuilding`.
Se actualiza al cerrar cada fase. Para entender el sistema, leer antes
`../bluebuilding-docs/` (empezar por `CLAUDE.md` y `README.md`).

**Última actualización:** 2026-08-10

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

- Arreglado: los estados de puerta se guardaban **reemplazando** la entrada, y un
  evento normal de apertura borraba la telemetría de esa puerta. Ahora se
  mezclan, porque las dos cosas viajan en el mismo evento.
- La tabla muestra maestra y esclava por separado, cada una con su estado y su
  SPI, en columnas de ancho fijo: si no, el texto salta con cada frame.
- Del `readerState` de la telemetría se leen wifi, device id y versiones de
  firmware. Las secciones de Red e Identidad arrancan con lo que la lectora
  reporta, no en blanco.

**Avisos que vienen del backend, no nuestros**: el éxito significa "la API lo
reenvió", no "la lectora lo aplicó"; el hardware y los tiempos **no se pueden
leer** —solo existe el evento de escritura—, así que esas dos secciones parten
de los valores por defecto; y `alert_auto_silence_timeout_min = 0` significa
deshabilitado.

### Navegación y arreglos de rutas

- Arreglado: el botón de ver residentes de un apartamento era un `<button>`
  dentro de un `<a>`. HTML inválido, y el botón se comía el clic. Pasaba lo mismo
  con la flecha de volver. Ahora el enlace lleva puesta la apariencia de botón.
- Arreglado: `apartments.tsx` era la ruta padre de los residentes de un
  apartamento y pintaba la tabla sin `<Outlet />`, así que la hija coincidía pero
  no se renderizaba. Separado en capa (`apartments.tsx`) y lista
  (`apartments.index.tsx`); las URLs no cambian.
- `Breadcrumb` en `ui` y `BuildingBreadcrumb` en admin: sustituye la flecha fija
  que siempre volvía a Edificios. En escritorio la ruta completa, en móvil solo
  el paso atrás. El título de la página es el último nivel, así que no se repite.
- Los nombres de las secciones del edificio viven en `BUILDING_SECTIONS`, que
  leen la barra lateral y el breadcrumb.
- Las tarjetas de un usuario se ven en un diálogo sobre la tabla, no navegando a
  `/admin/cards`. Ese salto cruzaba de sección y dejaba sin ruta de vuelta: solo
  se salía con el botón del navegador. `useCardActions` comparte editar y borrar
  entre el diálogo y la pantalla completa. Crear sigue solo en la pantalla,
  porque necesita elegir edificio y puerta para la lectora.

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

### Fase 8 — Monitoreo de eventos

Una pantalla con tres lentes en vez de las tres pantallas sueltas del panel
viejo. Dos entradas: `/admin/monitor` global y
`/admin/buildings/$id/events` con el edificio fijo.

- Dominio en `packages/core/src/events`: `EVENT_META` traduce **los 31 tipos** de
  evento con su gravedad; el panel viejo traducía 7 y el resto salía como
  "Evento desconocido". Más `EventOrigin`, `IncidentStatus` y los schemas.
- Estos tres endpoints devuelven objetos **planos**, sin el envoltorio
  `{ user: … }` / `{ card: … }` del resto de la API. Tercera convención distinta
  en el mismo backend; queda anotado en el schema.
- `EventsGateway` con las tres lecturas y el ciclo de incidente. Lectura fila a
  fila con conteo de descartadas, como residentes y tarjetas.
- Una sola función de fecha, con zona horaria fija. Había tres formatos y dos
  usaban la hora local del navegador.
- `useNewEventsSignal`: avisa de novedades sin mover la lista bajo el cursor.
  Escucha la sala de puertas, que es la única viva, e ignora la telemetría.
- El ciclo de incidente toma el usuario de la sesión, no de `localStorage`, y el
  comentario de solución es por evento. En el panel viejo hay una sola caja
  compartida: escribir en una tarjeta lo replica en todas.
- Contactar residente y abrir incidente van separados. Iban en el mismo clic.
- Arreglado de paso: la columna de origen de puertas abiertas. El DTO manda
  `eventOrigin` y el panel viejo lee `origin`, así que sale siempre vacía.

**Filtros solo donde no mienten**: críticos filtra en cliente porque los 15
registros están en pantalla. Intrusiones y puertas abiertas paginan en servidor y
no aceptan filtros por tipo ni fecha, así que solo se ofrece el de edificio, que
el endpoint sí entiende.

**Del evento a la cámara.** Un evento crítico ya no deja solo en el edificio:

- "Ver cámara" abre las cámaras de la puerta del evento en un diálogo sobre la
  lista, sin salir del monitoreo. Es el camino corto, el de mirar y seguir.
- "Ver edificio" lleva al plano con esa puerta ya seleccionada y con un "Volver a
  eventos" que solo aparece si vienes del monitor.
- El evento **no identifica su puerta**: la API manda el nombre y nada más
  (`RecentEventDto.ts:35`), así que se cruza por nombre con las puertas del
  edificio (`findDoorByName`). Si renombran una puerta, los eventos viejos se
  quedan sin cámara. Pedir `doorId` es la propuesta 1d.
- **Hay dos endpoints de puertas y solo uno trae cámaras.** `POST
/api/bluebuilding/doors` devuelve filas peladas: une piso y torre sin
  seleccionarlos y nunca carga `doorCameras` (`DoorServiceV2.ts:12-18`), así que
  `cameras` siempre llega vacío. Las cámaras salen de `GET
/api/buildings/:id/doors`, el mismo que usa la pantalla del edificio. El
  diálogo lee de ahí, y por eso muestra exactamente lo que se ve al pinchar la
  puerta en el plano.
- Los eventos sin puerta —emergencia médica desde la app— no ofrecen cámara. No
  hay ninguna que ofrecer.

### Fase 9 — Registro de propietarios y residentes

Las dos pantallas públicas con las que alguien entra al sistema por primera vez:
`/register/owner` y `/register/resident`. Enlazadas desde el login, solo en modo
residente. Las de visitante se dejan para el bloque de portería, que es su
contexto real.

En el panel viejo son dos archivos de 557 y 554 líneas casi idénticos. Aquí es un
solo formulario con tres diferencias, que salen del rol: el endpoint
(`/owner` contra `/users`), qué apartamentos lista (`active=false` para el
propietario, que reclama uno sin líder; `active=true` para el residente) y quién
aprueba después.

- Dominio en `packages/core/src/registration`: los ocho `DocumentType` que la API
  acepta (`api/src/entity/User.ts:28-37`), `ApartmentRole`, `APARTMENT_LIST_ACTIVE`
  y los schemas del formulario. Los límites son los mismos que valida el backend
  (`register_apartment_user_form.ts:5-31`), así que nada pasa aquí para caer allá.
- `RegistrationGateway` con la cascada y el alta. Las cinco rutas son públicas
  (`api/src/routes/api.ts:83-115`): ninguna lleva `checkJwt`.
- Primitivo `PhotoInput` en `ui`: la foto con vista previa. El `File` no cabe en
  `core`, que no tiene tipos del DOM, así que viaja en el input del gateway, como
  ya hacía `ValidateUserInput`.
- `RegistrationForm` recibe el apartamento como unión: `{ mode: 'pick' }` pinta la
  cascada, `{ mode: 'fixed', apartmentId }` la esconde. La pantalla lee
  `apartmentId` de la query, igual que `/admin/cards`. Es el gancho para que
  mañana un residente inscriba desde dentro: cambia de dónde sale ese id, no el
  formulario.
- Los términos y condiciones se copiaron palabra por palabra a `TermsContent`. Es
  un texto legal: se reformatea, no se reescribe.

Tres arreglos sobre el viejo: hay pantalla de éxito que explica que la solicitud
queda pendiente de aprobación —antes empujaba a `/login` en silencio
(`ownerRegister.js:420`)—, el "ya existe" se marca sobre el campo que lo causó, y
el prefijo `+57` se anuncia en vez de pegarse a escondidas (`ownerRegister.js:379`).

**Avisos que vienen del backend**: `passwordConfirmation` viaja porque la API lo
declara, pero nunca lo compara; la comparación es solo nuestra. Y el registro de
residente **falla si el apartamento no tiene líder**
(`api/src/controllers/apartments/users/controller.ts:52-56`), con un 500 y un
mensaje en español, sin código que distinguirlo: por eso ese caso se explica desde
el apartamento inactivo, no desde el error.

**Pendiente**: el formulario cuelga de `_auth`, que redirige a quien ya tiene
sesión. El día que un residente inscriba desde dentro de la app, esa ruta tendrá
que salir de ahí.

### Refactor de estructura

Antes de seguir migrando pantallas, una pasada para que el código se lea sin
ayuda. Ninguna pantalla cambió de comportamiento.

- **Nombres buscables**: los archivos que se repetían en cada dominio llevan el
  dominio delante (`auth.schemas.ts`, `cards.errors.ts`, `buildings.keys.ts`).
  Eran 10 `schemas.ts`, 9 `errors.ts`, 7 `constants.ts` y 6 `keys.ts`
  indistinguibles al buscar por nombre.
- **`api-client` partido**: `gateways.ts` tenía 853 líneas con siete gateways,
  sus rutas, sus errores y sus tipos mezclados. Ahora es una carpeta por dominio
  con `gateway`, `paths` y `errors` separados; el archivo más largo tiene 102
  líneas.
- **Lo repetido, en un sitio**: las siete funciones `toXError` casi calcadas
  pasan a `createErrorMapper`, que resuelve los cuatro casos comunes y deja que
  cada dominio declare solo los suyos; los tres bucles de lectura fila a fila
  pasan a `readRows`; los cinco sitios que armaban opciones de `Select` a mano
  pasan a `toSelectOptions`, que además ordena; el aviso de "sin conexión" y el
  tipo `AlertMessage` viven en `features/shared/`.
- **Vocabulario llano**: `ContractError` pasa a `BadResponseError`, y las skills
  dejan de hablar de "capa anticorrupción".
- **Menos comentarios**: los archivos del registro eran los más comentados del
  repo (31% y 27% de líneas). Se quedaron los que citan una rareza del backend
  con `archivo:línea`; el resto se fue al plan, que es donde se busca.

Las skills recogen todo esto: `crear-gateway-api` se reescribió con la
estructura nueva, y `reglas-generales` y `verificar-cambios` ganaron la
convención de nombres y una regla de comentarios más dura.

### Fase 10 — Aprobar solicitudes de acceso

La salida de los registros de la fase 9: quien ya está dentro decide quién entra.
`/access-requests`, en la app del residente. Sustituye las dos pantallas del panel
del edificio viejo (`EmployeesApartmentRequests`, `OwnersApartmentRequests`).

- Dominio en `packages/core/src/access-requests`: `ApprovalScope` (apartamento o
  edificio), los schemas de la solicitud y `listApprovalPlaces`, que saca de los
  espacios de la sesión dónde puede aprobar esta persona. El panel viejo leía el
  apartamento y el edificio de `localStorage`.
- Una sola pantalla para los dos casos, con pestañas si alguien lidera un
  apartamento y además administra el edificio.
- Aprobar y rechazar piden confirmación: las dos son difíciles de deshacer, porque
  la API marca la solicitud como borrada en ambos casos.
- Entrada desde la barra lateral y desde el menú del residente, con el número de
  pendientes. `usePendingApprovals` comparte las claves de caché con la pantalla,
  así que abrirla no cuesta una petición extra.
- El guard `requireApprover` deja fuera a quien no aprueba nada, redirigiendo a su
  propia pantalla en vez de mostrar un error.

**Del backend, no nuestro**: la lista del edificio **ignora el `buildingId` de la
URL** y filtra solo por el usuario (`buildings/access/controller.ts:107-110`), así
que quien administre dos edificios ve lo mismo en los dos; el `apartmentId` que el
front viejo mandaba al aprobar se descarta en el formulario
(`apartment_access_form.ts:6-10`); aprobar exige que **el aprobador** esté
verificado, no el solicitante (`apartments/access/controller.ts:23-26`); y el
apartamento lleno sale como 500 con el motivo solo en el texto (`:52-54`), así que
el mensaje nombra la causa probable sin leer ese texto.

**Arreglado de paso**: el aterrizaje del administrador del panel viejo nunca
funcionó. `hasAccessRequests('owners')` pasa `user.apartment.id` al endpoint que
espera un `buildingId` (`front/src/utils/services/authService.js:71`), la llamada
falla y el `catch` devuelve `false`. Aquí no hay aterrizaje automático: hay un
enlace con el contador.

### Dos puertas de entrada

El selector "Residente / Administrador" del login confundía a los residentes, que
no tienen por qué saber que existe un panel de staff. Ahora hay dos puertas:

- `/login` es la del residente y ya no menciona la otra. `/admin/login` es la del
  equipo, con el modo fijo. `LoginPage` recibe el modo por prop en vez de
  preguntarlo.
- Quien pide una pantalla de `/admin` sin sesión aterriza en `/admin/login`, no en
  la puerta del residente.
- El guard del panel hace una excepción con su propio login, que si no sería
  inalcanzable: la ruta padre `/admin` protege todo lo que cuelga de ella.
- `AuthFrame` sale de `AuthLayout` para que el login del staff use el mismo marco
  sin colgar del árbol de rutas de auth.

**No se partió la app**, que era la otra opción sobre la mesa. El código del panel
ya viaja en trozos aparte (`autoCodeSplitting` en `vite.config.ts:12`): `admin`,
`monitor` y `readers` solo se descargan al entrar en `/admin`, así que separar en
dos aplicaciones no le ahorraría nada a un residente. Lo que sí costaría son los
109 archivos de `ui`, importados desde 82 sitios, y `layouts` y `app`, importados
desde 45: eso es lo que hoy amarra las dos mitades. Si algún día hay una razón de
verdad —equipos o despliegues separados—, el primer paso es sacar `ui` a un
paquete propio, y ese paso vale la pena por sí solo.

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
- Las pantallas de registro y la de solicitudes: se cerraron con typecheck, lint
  y build, pero nadie las ha abierto todavía en el navegador, ni se ha enviado un
  registro ni aprobado una solicitud de verdad.
- Con una lectora real: el ciclo `card:setup` → `read_tag` de punta a punta, y si
  `POST /api/bluebuilding/doors` responde una lista pelada o envuelta en `doors`
  (hoy se aceptan las dos formas porque no había manera de saberlo).

### Lo que queda del front viejo

Con el registro dentro, lo que sigue sin migrar son las pantallas que no son ni
del panel de admin ni del residente:

- Registro de visitante y visitante express (`/apartment/visitor/register`,
  `.../express/register`), junto a la portería.
- Códigos de visita (`/visits/code`, `/building/visits/code/confirm`).
- Portería: `/acceso` y `/acceso-visitante`.
- Citófono y WebRTC (`/llamada`, `/llamada-visitante/...`, `components/Call/`).
  Antes de tocarlo hay que decidir qué pasa con el proveedor externo que hoy lo
  reemplaza (`bluebuilding-docs/02-flujos/llamadas-citofono.md:11`).
- `landingPathFor` solo reparte Admin y Usuario. El viejo `getLoggedPath`
  (`front/src/utils/services/authService.js:87`) reparte doce roles, y sin esa
  rama las cuatro primeras no tienen entrada.

### Fase 11 — Cierre

Revisión de movimiento reducido, accesibilidad, responsive a 390 / 768 / 1280 y
PWA.

## Pendiente de backend

Detalle y tamaño en `bluebuilding-docs/07-abierto/propuestas-panel-admin.md`.

1. **La sala `.events` no recibe a nadie.** La API emite `new_event_${buildingId}`
   a `${buildingId}.events` (`api/src/hardware/index.ts:394`, `:907`), pero
   `subscribe:building_events` une el socket a `${buildingId}.doors`, porque
   `getBuildingDoorsEventsRoomId` devuelve `.doors`. Esos emits se pierden. Es
   una línea, y sin ella no hay monitoreo en vivo de verdad: los eventos sin
   puerta —edificio desconectado, emergencia médica— no llegan nunca. Ojo: el
   camino de la app (`:900`) carga `door.doorCameras` sin `doorCameras.camera` y
   el DTO accede a `dc.camera.name`, así que arreglar solo la suscripción
   destaparía ese fallo.
2. **El endpoint de intrusiones carga la tabla entera en memoria** y pagina con
   `slice`, sin ordenar en servidor: la paginación devuelve grupos arbitrarios.
3. **El incidente toma el usuario del cuerpo, no del token.** Cualquiera puede
   atribuir un incidente a otra persona.
4. **`createEventIncident` no comprueba duplicados** pese a ser `OneToOne`.
5. **Filtros de servidor por tipo y por fecha** en intrusiones y puertas
   abiertas. Hoy solo se puede acotar por edificio.
6. **`doorId` en el DTO de eventos** (propuesta 1d): hoy el evento solo nombra su
   puerta, y sin id hay que cruzar por nombre para llegar a su cámara.
7. **Telemetría en `GET .../doors/statuses`.** El arranque en frío ya está
   resuelto por otro lado: `POST /api/bluebuilding/doors` devuelve la telemetría
   mezclada en cada puerta (`DoorControllerV2.ts:17-28`). El endpoint que suena a
   estado, en cambio, solo trae eventos de puerta. Falta también que
   `subscribe:door_status` conteste algo al suscribirse, hoy solo une a la sala.
8. `GET /buildings/overview` privado con metadata de estado, separado del listado
   público que llena los selects.
9. Paginación, búsqueda y filtro por edificio en `usersV2/ResidentUserDetails`.
10. Guardar la última configuración enviada a una lectora.
11. `init:success` en el socket, para quitar la espera fija de 600 ms.
12. **Foto en el DTO de solicitudes de acceso.** El registro obliga a subir una
    foto y la guarda en S3, pero quien aprueba solo ve nombre, cédula, teléfono y
    correo (`apartments/access/list_access_requests_dto.ts:8-16`). Se aprueba a
    alguien a quien no se puede mirar.
13. **`buildingId` en la lista de solicitudes del edificio**, que hoy se ignora.
14. **Código propio para el apartamento lleno**, que hoy viaja como 500 con el
    motivo en el texto.

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
