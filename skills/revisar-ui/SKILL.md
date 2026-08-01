---
name: revisar-ui
description: Revisión obligatoria de una pantalla contra su mock, antes de darla por terminada (fidelidad, comportamiento responsive, estados, densidad, accesibilidad). Usar siempre al cerrar una vista o un componente visual, aunque compile y no tenga errores.
---

# Revisar UI

Se corre **después** de implementar una vista o un componente visual y **antes**
de decir que está lista. Que compile no significa que esté bien.

Regla de entrada: si hay mock, se abre el mock y se compara punto por punto. Sin
mock a la vista, esta revisión no sirve.

## 1. El error más común: el contenedor

Antes que nada, decidir qué es la pantalla:

| Tipo                | Se ve así                                      | Cuándo                                      |
| ------------------- | ---------------------------------------------- | ------------------------------------------- |
| Pantalla completa   | El contenido ocupa todo el viewport, sin marco | Móvil, casi siempre. Login, listas, detalle |
| Tarjeta centrada    | Bloque acotado flotando sobre el fondo         | Desktop, para formularios cortos            |
| Contenido en layout | Dentro de un shell con nav/sidebar             | Pantallas internas de la app                |

El mismo diseño suele ser **pantalla completa en móvil y tarjeta en desktop**. Es
un cambio de estructura, no solo de ancho: en móvil desaparecen el borde, el
radio, la sombra y el padding externo.

Errores concretos que hay que buscar:

- Tarjeta con `max-w-*` en móvil: queda un rectángulo flotando con aire muerto
  alrededor. Casi siempre está mal.
- `min-h-screen` en vez de `min-h-dvh`: en móvil la barra del navegador recorta.
- Contenido centrado vertical que en pantallas bajas se corta sin poder hacer
  scroll.
- Ancho máximo inventado en vez del que marca el mock.

## 2. Fidelidad al mock

Comparar en este orden, que es el orden en que se nota un diseño mal copiado:

1. **Estructura**: qué bloques hay, en qué orden, cuáles desaparecen por
   breakpoint.
2. **Jerarquía**: qué es lo más grande y pesado de la pantalla. Si el mock tiene
   un título de 23px bold display y la implementación un `text-xl` normal, ya se
   perdió.
3. **Espaciado**: los gaps del mock son intencionales. Copiar los valores, no
   aproximar "algo parecido".
4. **Tipografía**: familia (display / body / mono), peso y rol por elemento. El
   tamaño sale siempre de la escala (`text-title-lg`, `text-body`...), nunca de un
   valor suelto. Si el mock pide 26px y la escala salta de 23 a 28, se elige el
   paso más cercano o se agrega el paso al sistema; lo que no se hace es escribir
   `text-[26px]`. El mock usa mono para datos (documento, códigos) a propósito.
5. **Detalle de marca**: patrones, gradientes, iconografía. Son lo que hace que
   se vea del producto y no de una plantilla.
6. **Color**: siempre por token. Si el mock usa un color que no existe como
   token, se agrega el token (`agregar-design-token`), no se escribe el literal.

Lo que **no** se copia del mock: datos de ejemplo, estados fabricados que el
backend no soporta, y los adornos del propio mock (marco de navegador, notch del
teléfono, chips para cambiar de estado).

## 3. Responsive

- Se revisa a 390px, 768px y 1280px como mínimo.
- Mobile-first: las clases base son las de móvil, los `sm:` / `md:` suman.
- Nada de scroll horizontal en ninguna de las tres anchuras.
- Objetivos táctiles de 44px o más en móvil (botones, links de acción).
- Texto que no se corta ni se desborda con contenido largo real (nombres,
  mensajes de error, direcciones).

## 4. Estados

Toda pantalla con datos o formulario muestra los cinco:

- Vacío inicial / default.
- Cargando (esqueleto o spinner, sin saltos de layout al terminar).
- Error, con mensaje que dice qué hacer, no el error crudo.
- Éxito o resultado.
- Deshabilitado mientras hay una acción en curso.

Y para formularios: validación por campo con el mensaje junto al campo,
`aria-invalid`, y el foco visible en todo lo interactivo.

## 5. Densidad y ritmo

- Un solo sistema de espaciado en la pantalla: los gaps se repiten, no hay
  quince valores distintos.
- El contenido respira igual arriba y abajo salvo que el mock diga otra cosa.
- Alineación consistente: los bordes de los bloques coinciden entre sí.

## 6. Cómo se revisa de verdad

Compilar no es revisar. En orden de fiabilidad:

1. Abrir la pantalla en el navegador a los tres anchos y compararla contra el
   mock lado a lado.
2. Si no se puede abrir el navegador (agente sin herramientas de browser), decir
   explícitamente que la verificación visual está pendiente. No dar por buena una
   pantalla que nadie ha visto.
3. Revisar el CSS generado solo confirma que las clases existen, no que la
   pantalla se vea bien. No cuenta como revisión visual.

## Checklist

- [ ] Mock abierto y comparado, no de memoria.
- [ ] Contenedor correcto por breakpoint (completa en móvil, tarjeta si aplica).
- [ ] Sin tarjeta flotante en móvil ni anchos inventados.
- [ ] `min-h-dvh` y sin scroll horizontal a 390 / 768 / 1280.
- [ ] Jerarquía tipográfica igual a la del mock (familia, peso, tamaño).
- [ ] Espaciados copiados del mock, con un ritmo consistente.
- [ ] Detalles de marca presentes (patrón, gradiente, logo).
- [ ] Colores solo por token y tamaños de texto solo por escala.
- [ ] Ningún elemento interactivo escrito a mano en la feature: si lo hay, falta
      un primitivo en `ui/` (ver `crear-componente-ui`).
- [ ] Los cinco estados resueltos.
- [ ] Foco visible, `aria-*` en campos con error, targets táctiles suficientes.
- [ ] Verificado en navegador, o declarado como pendiente de revisión visual.

## Errores comunes

- Dar por terminada una pantalla porque `pnpm typecheck` pasa.
- Copiar el marco del mock (ventana del navegador, notch) como si fuera parte del
  diseño.
- Meter datos de ejemplo del mock como si fueran reales.
- Reproducir el desktop y dejar el móvil como una versión estrecha del mismo
  layout.
- Aproximar espaciados y tamaños "a ojo" teniendo el mock delante.
