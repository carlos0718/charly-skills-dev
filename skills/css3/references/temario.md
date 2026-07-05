# Temario CSS3 — Bootcamp de Programación Web

**Nivel:** CSS3 (después de HTML5, antes de JavaScript/React)
**Prerequisito:** HTML5 completo (el alumno sabe construir páginas semánticas)
**Total:** 10 módulos

---

## Notas de progresión

- **NO usar JavaScript en ningún módulo.** Si un efecto requiere JS, reemplazarlo por CSS puro.
- Los **módulos 01–04** son base obligatoria antes de continuar.
- Los **módulos 05 (Flexbox) y 06 (Grid)** son el corazón del skill — merecen más tiempo y ejemplos.
- El **módulo 07 (responsive)** asume dominio de Flexbox y Grid — no avanzar sin completarlos.
- El **módulo 10 (proyecto integrador)** conecta explícitamente con el skill HTML5: el alumno estiliza el mini-sitio que construyó allí. Mencionar esto al inicio de la lección 10.

---

## Módulo 01 — selectores-y-sintaxis

**Carpeta:** `01-selectores-y-sintaxis/`
**Duración estimada:** 3 horas

### Subtemas

- Qué es CSS y cómo se vincula a HTML:
  - Externo con `<link rel="stylesheet">` — forma preferida en proyectos reales
  - Interno con `<style>` en el `<head>` — útil para prototipado rápido
  - Inline con el atributo `style=""` — y por qué casi nunca usarlo
- Anatomía de una regla CSS: selector + bloque de declaraciones + propiedad + valor
- Tipos de selectores:
  - Elemento (tipo): `p`, `h1`, `div`
  - Clase: `.mi-clase`
  - ID: `#mi-id`
  - Universal: `*`
  - Descendiente: `div p` (selecciona todo p dentro de div)
  - Hijo directo: `div > p` (solo p hijo inmediato)
  - Atributo: `[type="text"]`, `[href^="https"]`
  - Múltiple (agrupado): `h1, h2, h3`
- Especificidad: qué selector "gana" cuando hay conflicto
  - Tabla de pesos: inline style (1000) > ID (100) > clase/pseudo-clase/atributo (10) > elemento/pseudo-elemento (1)
  - `!important` — cuándo existe y por qué evitarlo
- Herencia: qué propiedades se heredan (`color`, `font-family`) y cuáles no (`margin`, `padding`, `border`)
- La cascada: el origen de "Cascading" — orden de declaración cuando especificidad es igual

### Proyecto del módulo

**"Estilizar un párrafo"** — Se provee una página HTML con varios elementos (párrafos, headings, listas, un div). El alumno debe aplicar al menos 6 tipos de selectores diferentes, observando en Live Server cómo cada selector afecta solo los elementos correctos.

---

## Módulo 02 — modelo-de-caja

**Carpeta:** `02-modelo-de-caja/`
**Duración estimada:** 4 horas

### Subtemas

- Qué es el box model: todo elemento HTML es una caja con 4 capas
  - `content` → el contenido real (texto, imagen)
  - `padding` → espacio interno entre content y border
  - `border` → el borde visible
  - `margin` → espacio externo entre este elemento y los demás
- `box-sizing: content-box` (default del navegador) vs `border-box` (estándar en proyectos reales)
  - Por qué `border-box` facilita los cálculos: el `width` incluye padding y border
  - El reset universal: `*, *::before, *::after { box-sizing: border-box; }`
- `width` y `height`: valores fijos, porcentajes, `min-width/max-width`, `min-height/max-height`
- Margin collapse: cuando dos márgenes verticales se "fusionan" (el mayor gana)
  - Por qué ocurre y en qué situaciones (solo entre bloques hermanos y padre-hijo verticales)
  - Cómo evitarlo: `overflow: hidden` en el padre, `padding` en el padre, `display: flex`
- `overflow`: qué pasa cuando el contenido supera el tamaño del elemento
  - `visible` (default), `hidden`, `scroll`, `auto`
- `display: block` vs `inline` vs `inline-block`
  - `block`: ocupa toda la línea, acepta width/height/margin vertical
  - `inline`: fluye con el texto, ignora width/height/margin vertical
  - `inline-block`: fluye como inline pero acepta width/height/margin completo

### Proyecto del módulo

**"Tarjetas de producto"** — Replicar un layout de 3 tarjetas alineadas horizontalmente usando solo box model (`display: inline-block`), sin Flexbox ni Grid. Cada tarjeta tiene imagen (placeholder), título, descripción y precio. El alumno debe manejar padding, border, margin y box-sizing para lograr el espaciado correcto.

---

## Módulo 03 — colores-tipografia-y-unidades

**Carpeta:** `03-colores-tipografia-y-unidades/`
**Duración estimada:** 4 horas

### Subtemas

**Colores:**
- Nombres de color (`red`, `blue`) — útiles para prototipos, no para producción
- Hexadecimal: `#rrggbb` y formato corto `#rgb`
- `rgb(r, g, b)` — más legible para colores calculados
- `rgba(r, g, b, a)` — con canal alfa para transparencia
- `hsl(h, s%, l%)` — más intuitivo para ajustar brillo/saturación
- `hsla(h, s%, l%, a)` — con transparencia
- Cuándo usar cada formato: hex para paletas fijas, hsl para variaciones temáticas

**Tipografía:**
- `font-family`: stack de fuentes, `serif`, `sans-serif`, `monospace`
- Google Fonts: cómo vincular con `<link>` en el HTML
- `font-size`: px (absoluto), rem (relativo a :root)
- `font-weight`: valores numéricos (100–900) vs palabras clave
- `font-style`: `normal`, `italic`, `oblique`
- `line-height`: sin unidad (multiplicador) vs con unidad — cuál es mejor y por qué
- `letter-spacing` y `word-spacing`
- `text-align`: `left`, `right`, `center`, `justify`
- `text-decoration`: `none`, `underline`, `line-through`
- `text-transform`: `uppercase`, `lowercase`, `capitalize`

**Unidades:**
- `px` — píxeles físicos, absolutos
- `%` — relativo al elemento padre
- `em` — relativo al `font-size` del elemento padre (se acumula en nesting)
- `rem` — relativo al `font-size` del `:root` (html) — preferido para accesibilidad
- `vh` / `vw` — porcentaje del viewport
- `ch` — ancho del carácter "0" — útil para anchos de columnas de texto
- `min()`, `max()`, `clamp()` — introducción: `clamp(min, preferido, max)` para tipografía fluida

### Proyecto del módulo

**"Artículo con tipografía profesional"** — Maquetar un artículo de blog con jerarquía tipográfica completa (h1–h3, párrafos, blockquote, código inline) usando escala de 1.25 basada en rem y una fuente de Google Fonts. Sin layout complejo — solo tipografía y colores.

---

## Módulo 04 — display-y-posicionamiento

**Carpeta:** `04-display-y-posicionamiento/`
**Duración estimada:** 4 horas

### Subtemas

- `display` extendido: `block`, `inline`, `inline-block`, `none`
  - `none` vs `visibility: hidden` — diferencia en flujo del documento
- `position`: el eje conceptual más importante de este módulo
  - `static` (default) — el elemento sigue el flujo normal del documento
  - `relative` — se desplaza relativo a su posición original; crea contexto para `absolute`
  - `absolute` — se saca del flujo; se posiciona relativo al ancestro `position: relative` más cercano (o al viewport si no hay ninguno)
  - `fixed` — se saca del flujo; siempre relativo al viewport; no hace scroll
  - `sticky` — mezcla de `relative` y `fixed`; se pega al viewport al llegar a un umbral
- Propiedades de offset: `top`, `right`, `bottom`, `left`
- `z-index`: capas de apilamiento — solo funciona en elementos con position distinto de static
  - Contexto de apilamiento: cuándo un z-index alto no sirve porque está atrapado en un contexto
- Historia de `float`: por qué existió (texto que rodea imágenes), cómo se usó para layouts, por qué está en desuso para layouts
  - `clear`: `left`, `right`, `both` — para que el siguiente elemento no flote
  - `overflow: hidden` como clearfix (técnica legacy — conocerla pero no usarla para layouts nuevos)

### Proyecto del módulo

**"Header fijo + sidebar"** — Construir un layout de 3 secciones: header fijo al top con `position: fixed`, sidebar con `position: absolute` o `sticky`, y área de contenido principal. Solo con `position` y `display` — sin Flexbox ni Grid.

---

## Módulo 05 — flexbox

**Carpeta:** `05-flexbox/`
**Duración estimada:** 5 horas

### Subtemas

- Qué problema resuelve Flexbox: alinear elementos en **una dimensión** (fila o columna) — algo que float nunca pudo hacer bien
- Terminología fundamental: flex container vs flex items, eje principal (main axis) vs eje cruzado (cross axis)
- Propiedades del **container**:
  - `display: flex` — activa Flexbox en el container
  - `flex-direction`: `row` (default), `column`, `row-reverse`, `column-reverse`
  - `justify-content`: alinea en el eje principal — `flex-start`, `flex-end`, `center`, `space-between`, `space-around`, `space-evenly`
  - `align-items`: alinea en el eje cruzado — `stretch` (default), `flex-start`, `flex-end`, `center`, `baseline`
  - `flex-wrap`: `nowrap` (default), `wrap`, `wrap-reverse`
  - `gap` (antes `grid-gap`, ahora funciona en flex también): espacio entre items
  - `align-content`: alinea filas cuando hay `flex-wrap` — similar a `justify-content` pero en eje cruzado
- Propiedades del **item**:
  - `flex-grow`: cuánto puede crecer un item para llenar espacio disponible (0 = no crece)
  - `flex-shrink`: cuánto puede encogerse (1 = puede encoger, 0 = no puede)
  - `flex-basis`: tamaño base antes de grow/shrink — `auto`, `0`, o un valor fijo
  - Shorthand `flex`: `flex: grow shrink basis` — `flex: 1` equivale a `flex: 1 1 0`
  - `align-self`: sobreescribe `align-items` para un item específico
  - `order`: reordena visualmente los items sin cambiar el HTML
- Casos de uso clásicos (con ejemplos):
  1. Centrar un elemento perfecta y absolutamente: `display: flex; justify-content: center; align-items: center`
  2. Navbar horizontal con logo a la izquierda y links a la derecha: `justify-content: space-between`
  3. Card con botón siempre al bottom: `flex-direction: column` + `margin-top: auto` en el botón

### Proyecto del módulo

**"Navbar + card layout"** — Construir: (1) menú de navegación horizontal con logo izquierda / links derecha / botón CTA; (2) grilla de tarjetas flexibles con 3 columnas en desktop que wrappean a 1 columna en pantallas pequeñas (sin media queries, solo con `flex-wrap` y `flex-basis`).

---

## Módulo 06 — grid

**Carpeta:** `06-grid/`
**Duración estimada:** 5 horas

### Subtemas

- Qué problema resuelve Grid: layouts **bidimensionales** — filas Y columnas simultáneamente. Algo que Flexbox no puede hacer nativamente.
- Terminología: grid container, grid items, grid lines, grid tracks (filas/columnas), grid cells, grid areas
- Propiedades del **container**:
  - `display: grid`
  - `grid-template-columns` y `grid-template-rows`: definir el tamaño de cada track
  - La unidad `fr` (fracción): `1fr 2fr 1fr` — distribuye espacio disponible proporcionalmente
  - `repeat(n, tamaño)`: `repeat(3, 1fr)` = tres columnas iguales
  - `minmax(min, max)`: `repeat(3, minmax(200px, 1fr))` — columnas flexibles con mínimo
  - `gap` (también `row-gap` y `column-gap`)
  - `grid-template-areas`: nombrar zonas del grid con strings ASCII
  - `auto-placement`: cómo Grid coloca items automáticamente cuando no se especifica posición
- Propiedades del **item**:
  - `grid-column`: `grid-column: 1 / 3` (de línea 1 a línea 3) o `grid-column: span 2` (ocupa 2 columnas)
  - `grid-row`: igual pero para filas
  - `grid-area`: asigna el item a un área nombrada definida en `grid-template-areas`
- Cuándo usar Grid vs Flexbox:
  - **Flexbox** → un componente lineal (navbar, fila de botones, lista de cards en una dimensión)
  - **Grid** → layout de página completo (header/sidebar/content/footer) o grillas bidimensionales
  - Pueden coexistir: Grid para el layout general, Flexbox dentro de cada celda/componente

### Proyecto del módulo

**"Layout de revista/blog"** — Home con: hero de ancho completo, grilla de artículos (3 columnas con 1 destacado más grande usando `grid-column: span 2`), sidebar lateral, y footer. Usando `grid-template-areas` para el layout general.

---

## Módulo 07 — responsive-y-media-queries

**Carpeta:** `07-responsive-y-media-queries/`
**Duración estimada:** 5 horas

### Subtemas

- Qué es responsive design: el mismo HTML se ve bien en cualquier tamaño de pantalla
- Mobile-first vs desktop-first:
  - **Mobile-first** (recomendado): se escribe CSS base para móvil y se usa `min-width` para agregar complejidad en pantallas más grandes
  - **Desktop-first**: se escribe para desktop y se usa `max-width` para simplificar en móvil
  - Por qué mobile-first es la práctica estándar actual
- El viewport meta tag (refuerzo de HTML5): `<meta name="viewport" content="width=device-width, initial-scale=1">`
- Sintaxis de media queries:
  ```css
  @media (min-width: 768px) { /* tablet y más */ }
  @media (min-width: 1024px) { /* desktop */ }
  ```
- Breakpoints comunes (no son reglas absolutas — son guías):
  - Mobile: hasta 767px
  - Tablet: 768px – 1023px
  - Desktop: 1024px+
- `min-width` vs `max-width` en media queries
- Media features de preferencias del usuario:
  - `prefers-color-scheme: dark` — dark mode automático
  - `prefers-reduced-motion: reduce` — respetar accesibilidad en animaciones
- Tipografía fluida con `clamp()`: `font-size: clamp(1rem, 2.5vw, 2rem)`
- Imágenes responsivas con CSS: `max-width: 100%; height: auto`
- `aspect-ratio`: mantener proporciones sin trucos de padding

### Proyecto del módulo

**"Sitio responsive completo"** — Tomar el layout del módulo 06 (blog/revista) y adaptarlo para 3 tamaños: móvil (1 columna), tablet (2 columnas), desktop (layout completo con sidebar). Enfoque mobile-first.

---

## Módulo 08 — pseudo-clases-transiciones-animaciones

**Carpeta:** `08-pseudo-clases-transiciones-animaciones/`
**Duración estimada:** 5 horas

### Subtemas

**Pseudo-clases:**
- De estado de usuario: `:hover`, `:focus`, `:active`, `:visited`
- `:focus-visible` — más accesible que `:focus` para estilos de teclado
- Estructurales: `:nth-child(n)`, `:nth-child(odd/even)`, `:first-child`, `:last-child`, `:only-child`
- Negación: `:not(selector)` — seleccionar todo excepto
- `:checked` — para estilizar checkboxes y radios con CSS puro

**Pseudo-elementos:**
- `::before` y `::after` — insertar contenido visual sin tocar el HTML
  - El truco del `content: ""` — requerido aunque esté vacío
  - Casos de uso: bullets decorativos, overlays, separadores
- `::placeholder` — estilizar el placeholder de inputs
- `::selection` — estilizar el texto seleccionado

**Transiciones:**
- `transition: property duration timing-function delay`
- Propiedades animables vs no animables
- Timing functions: `ease` (default), `linear`, `ease-in`, `ease-out`, `ease-in-out`, `cubic-bezier()`
- `transition: all` — útil pero con riesgo de performance

**Transformaciones:**
- `transform: translate(x, y)` — mover sin afectar el flujo del documento
- `transform: scale(n)` — escalar
- `transform: rotate(ndeg)` — rotar
- `transform: skew(ndeg)` — sesgar
- Combinar: `transform: translateY(-5px) scale(1.02)`

**Animaciones con @keyframes:**
- `@keyframes nombre { from { } to { } }` o con porcentajes `0% 50% 100%`
- `animation`: shorthand completo
- Propiedades principales: `animation-name`, `animation-duration`, `animation-iteration-count`, `animation-fill-mode`
- `will-change: transform` — mención: cuándo usarlo y el riesgo de sobreusar

### Proyecto del módulo

**"Menú interactivo con animaciones"** — Construir: (1) navbar con hover effects suaves (`transition`); (2) card con efecto flip al hover (usando `transform: rotateY()` y `backface-visibility`); (3) spinner de carga con `@keyframes`. Todo CSS puro, sin JavaScript.

---

## Módulo 09 — variables-css-y-organizacion

**Carpeta:** `09-variables-css-y-organizacion/`
**Duración estimada:** 4 horas

### Subtemas

**CSS Custom Properties (variables CSS):**
- Sintaxis: `--nombre-variable: valor` para declarar, `var(--nombre-variable)` para usar
- Scope: las variables declaradas en `:root` son globales; las declaradas en un selector son locales a ese elemento y sus descendientes
- Fallback: `var(--color-primario, #0066cc)` — valor por defecto si la variable no existe
- Por qué CSS Variables superan a variables de Sass/Less en muchos casos:
  - Son en tiempo de ejecución (pueden cambiar con media queries, JS, o herencia)
  - No requieren compilación
  - Se pueden sobreescribir en componentes específicos

**Dark mode con CSS Variables:**
```css
:root {
  --bg: #ffffff;
  --text: #333333;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1a1a1a;
    --text: #f0f0f0;
  }
}
```

**Organización del CSS:**
- Reset vs Normalize:
  - Reset (ej: Meyer Reset): elimina todos los estilos del navegador — parte de cero
  - Normalize.css: preserva estilos útiles del navegador, corrige inconsistencias
  - Modern CSS Reset (Andy Bell): minimalista y moderno — recomendado para proyectos nuevos
- Metodología BEM (Block__Element--Modifier):
  - Bloque: componente independiente → `.card`
  - Elemento: parte del bloque → `.card__title`, `.card__image`
  - Modificador: variación → `.card--featured`, `.card__button--disabled`
  - Por qué BEM resuelve el problema de especificidad en proyectos grandes
- Orden de propiedades CSS (convención Airbnb/SMACSS):
  1. Posicionamiento (`position`, `top`, `z-index`)
  2. Box model (`display`, `width`, `padding`, `margin`)
  3. Tipografía (`font`, `color`, `text-align`)
  4. Visual (`background`, `border`, `box-shadow`)
  5. Misceláneos (`transition`, `animation`, `cursor`)
- Comentarios útiles: secciones, componentes, notas de intención (no de implementación)

### Proyecto del módulo

**"Design system básico"** — Crear un archivo `variables.css` con paleta de colores completa (primarios, secundarios, neutros, semánticos: success/warning/error), escala tipográfica (tamaños, pesos, familias) y escala de espaciado (4px, 8px, 16px, 24px, 32px, 48px, 64px). Luego refactorizar uno de los proyectos anteriores para usar estas variables.

---

## Módulo 10 — proyecto-integrador

**Carpeta:** `10-proyecto-integrador/`
**Duración estimada:** 8 horas

### Subtemas

**Repaso de la cascada de decisiones para un proyecto real:**
1. HTML semántico → la estructura ya existe (viene del skill HTML5)
2. Reset / normalize → limpiar estilos del navegador
3. Variables CSS → paleta, tipografía, espaciado en `:root`
4. Layout general → Grid para la estructura de página
5. Componentes → Flexbox para componentes internos
6. Responsive → Mobile-first con media queries
7. Estados y micro-interacciones → transiciones y pseudo-clases

**Cómo debuggear CSS con DevTools:**
- Inspector de estilos: ver qué reglas aplican, cuáles están tachadas (sobreescritas)
- Panel "Computed": ver el valor final de cada propiedad después de la cascada
- Box model visual: ver las medidas exactas de content/padding/border/margin
- Modo responsive: simular diferentes tamaños y dispositivos
- Forzar estados: simular `:hover`, `:focus`, `:active` sin interacción real

### Proyecto del módulo

**"Estilizar el mini-sitio de HTML5"**

Tomar el **proyecto integrador del módulo 08 del skill HTML5** (mini-sitio de 3 páginas: index, about, contact con formulario) y darle estilo completo:

1. **Variables CSS**: paleta de colores, tipografía y espaciado en `:root`
2. **Reset moderno**: aplicar CSS reset antes de los estilos propios
3. **Layout con Grid**: estructura de página (header / main / footer), con sidebar en las páginas interiores
4. **Componentes con Flexbox**: navbar, tarjetas, formulario, footer con columnas
5. **Responsive**: 3 breakpoints (mobile 375px / tablet 768px / desktop 1280px), enfoque mobile-first
6. **Micro-interacciones**: transiciones suaves en hover de links, botones y cards
7. **Dark mode** (opcional): usando `prefers-color-scheme` + variables CSS

**Entregable:** Las mismas 3 páginas HTML del proyecto de HTML5, ahora con estilos CSS completos que demuestran dominio de todos los módulos del skill.
