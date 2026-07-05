# Temario — Skill html5

> Bootcamp de Programación Web — Nivel: Fundamentos Front-End  
> Esta skill se cursa **antes de CSS3 y antes de JavaScript**.  
> El material generado vive en `guia-html5/`.

Audiencia: principiantes con escalada a nivel intermedio  
Enfoque: HTML moderno, semántico y accesible  
Duración estimada: ~28 horas  
Referencia pedagógica: la premisa del bootcamp es **siempre responder el PORQUÉ** de cada cosa — no alcanza con mostrar cómo se usa una etiqueta; el estudiante necesita entender qué problema resuelve y cuándo elegirla.

---

## Módulo 01 — fundamentos-y-como-funciona-la-web
**Duración estimada:** 2 hs  
**¿Por qué este módulo?** Antes de escribir la primera etiqueta, el estudiante necesita entender en qué capa del stack está HTML y cómo el navegador llega a mostrarlo. Sin este contexto, el código parece magia. Con él, cada decisión tiene sentido.

### Subtemas
- Qué es HTML y qué NO es (no es CSS, no es JS, no es un lenguaje de programación)
- La triada: HTML (estructura) + CSS (presentación) + JS (comportamiento)
- Cómo funciona la web: cliente → servidor → respuesta → renderizado
- SSR, CSR, SSG y RSC: cómo se genera el HTML hoy en día (tabla comparativa)
  - SSR: el servidor arma el HTML completo en cada solicitud
  - CSR: el navegador genera el HTML ejecutando JavaScript (SPAs con React/Vue/Angular)
  - SSG: el HTML se genera en build-time, no en cada solicitud (Next.js, Astro)
  - RSC: Server Components renderizan en servidor sin enviar su JS al cliente; Client Components se hidratan
  - Por qué importa entenderlo desde el inicio aunque se empiece con HTML estático
- Anatomía de una etiqueta: apertura, contenido, cierre, atributos
- Etiquetas void (self-closing): `<img>`, `<input>`, `<br>`, `<hr>`, `<meta>`, `<link>`
  - Por qué no tienen cierre: no envuelven contenido, insertan algo
- Comentarios en HTML: `<!-- -->` y cuándo usarlos

### Proyecto del módulo
Crear un archivo `notes.html` con comentarios que expliquen: qué hace HTML, qué hace CSS, qué hace JS, y dónde "vive" ese archivo cuando alguien lo visita en internet. El objetivo es que el estudiante procese los conceptos escribiendo con sus propias palabras.

### Notas de progresión
- Este módulo NO usa VS Code ni Live Server todavía — el objetivo es conceptual
- El diagrama Mermaid del stack completo del bootcamp va aquí (ver SKILL.md): HTML → CSS → JS → React → Next.js/Node → C#/.NET → SQL → Deploy con Vercel, marcando "estás aquí"
- La tabla SSR/CSR/SSG/RSC no requiere comprensión profunda ahora; se retoma en React/Next.js
- No ver la barra `/` al final de las self-closing tags (`<img />`) como obligatoria — era XHTML, no HTML5

---

## Módulo 02 — tu-primer-documento-html
**Duración estimada:** 2 hs  
**¿Por qué este módulo?** El estudiante ya sabe qué es HTML conceptualmente. Ahora necesita ver su primer archivo funcionando en el navegador. El objetivo es quitarle el miedo al entorno y establecer el ciclo de trabajo (escribir → guardar → ver resultado) que va a usar durante todo el bootcamp.

### Subtemas
- Setup del entorno: VS Code + extensión Live Server + extensión Prettier
- Atajo Emmet: escribir `!` + Tab para generar la estructura base
- Estructura base de un documento HTML5: `<!DOCTYPE html>`, `<html lang>`, `<head>`, `<body>`
- Qué hace cada línea del esqueleto (tabla explicativa):
  - `<!DOCTYPE html>`: le dice al navegador que use HTML5, no modo quirks
  - `<html lang="es">`: el atributo `lang` importa para lectores de pantalla y SEO
  - `<meta charset="UTF-8">`: tildes, ñ, emojis — sin esto se rompe
  - `<meta name="viewport">`: por qué sin esto el sitio es ilegible en mobile
  - `<title>`: qué aparece en la pestaña y en los resultados de Google
- Anidamiento correcto: el que se abre último, se cierra primero
  - Visualización de cajas dentro de cajas
- Indentación: por qué importa para la legibilidad aunque no afecte el funcionamiento

### Proyecto del módulo
Crear `mi-primera-pagina/index.html` con la estructura completa. Cambiar el `<title>`, agregar un `<h1>` con el nombre del estudiante y un `<p>` de presentación. Abrir con Live Server y verificar que el navegador se actualiza al guardar con Ctrl+S.

### Notas de progresión
- Desde este módulo en adelante, todo se trabaja con Live Server
- La apertura correcta de carpeta en VS Code (File → Open Folder, no Open File) afecta cómo funcionan las rutas relativas

---

## Módulo 03 — etiquetas-esenciales
**Duración estimada:** 4 hs  
**¿Por qué este módulo?** El 80% del HTML que se escribe en el trabajo usa solo un conjunto acotado de etiquetas. Este módulo cubre exactamente ese 80% — el que aparece en todos los proyectos reales, sin importar el stack o framework que se use después.

### Subtemas
- Encabezados `<h1>` a `<h6>`: jerarquía de contenido, regla del único `<h1>`, por qué no saltar niveles (SEO + a11y)
- Párrafos `<p>`: por qué HTML ignora los saltos de línea del código fuente
- `<br>`: cuándo SÍ (dirección postal, poema) y cuándo NO (separar párrafos — para eso existe CSS)
- `<hr>`: separador temático, no solo visual
- Entidades HTML: `&lt;`, `&gt;`, `&amp;`, `&copy;`, `&nbsp;` — cuándo son necesarias
- Listas:
  - `<ul>`: viñetas; el tipo se controla con CSS `list-style-type`, no con atributos
  - `<ol>` con atributos `type` (1, A, a, I, i), `start`, `reversed`; `<li value>`
    - `type` vs CSS: cuándo el número tiene valor semántico (referenciable) vs puramente visual
  - `<dl>`, `<dt>`, `<dd>`: para glosarios, FAQs, término-descripción; un `<dt>` puede tener varios `<dd>`
- Énfasis semántico: `<strong>` vs `<b>`, `<em>` vs `<i>` — diferencia entre significado y estilo
- Enlaces `<a>`:
  - `href` absoluto vs relativo vs ancla interna `#id`
  - `target="_blank"` con `rel="noopener noreferrer"` — qué es tabnabbing y por qué importa
  - `download`: enlace de descarga
- Imágenes `<img>`:
  - `src` relativo vs absoluto, `alt` obligatorio y por qué (a11y, SEO, fallback)
  - Imagen decorativa: `alt=""` vacío — no omitir el atributo, dejar vacío
  - `width` y `height` en HTML: reservan espacio y evitan layout shift
- `<div>`: contenedor de bloque genérico — para layout en CSS, no para semántica
- `<span>`: contenedor inline genérico — para marcar parte de un texto con CSS o JS
- `<code>`, `<pre>`, `<kbd>`: mostrar código, bloques preformateados, teclas del teclado

### Proyecto del módulo
Mini biografía: `<h1>` con el nombre, `<p>` de presentación, `<ul>` de habilidades, `<ol>` de 3 pasos para contactar, foto con `<img>` y `alt` descriptivo, enlace externo con `target="_blank"` y `rel` correcto.

### Notas de progresión
- `<div>` se presenta como contenedor genérico; la alternativa semántica viene en módulo 04
- `<img>` solo con `src`, `alt`, `width`, `height`; `srcset` y `<picture>` se ven en módulo 07

---

## Módulo 04 — html-semantico
**Duración estimada:** 3 hs  
**¿Por qué este módulo?** Muchos tutoriales enseñan a estructurar páginas con `<div>` para todo. Eso funciona visualmente, pero es código amateur: Google no puede leer la estructura, los lectores de pantalla no pueden navegar por secciones, y el código es difícil de mantener. Este módulo es la diferencia entre un desarrollador que "hace que funcione" y uno que escribe código profesional.

### Subtemas
- El problema del `<div>` en todos lados: tres impactos reales (SEO, a11y, mantenibilidad)
- Cuándo sí usar `<div>`: contenedor genérico para agrupar elementos con fines de layout CSS
- Etiquetas estructurales HTML5 (tabla: etiqueta → cuándo usarla):
  - `<header>`: encabezado de página o sección (logo, título, nav)
  - `<nav>`: bloque de navegación (menú, breadcrumbs, paginación)
  - `<main>`: contenido principal único de la página — solo uno por documento
  - `<section>`: agrupación temática — siempre debe tener un encabezado h2/h3
  - `<article>`: contenido autónomo con sentido propio (post, noticia, comentario)
  - `<aside>`: contenido tangencialmente relacionado (sidebar, notas al margen)
  - `<footer>`: pie de página o sección (copyright, links legales, contacto)
- `<section>` vs `<article>`: la regla práctica — "¿tendría sentido publicado de forma independiente (RSS, redes)?"
- Etiquetas de contenido semántico:
  - `<figure>` + `<figcaption>`: imagen con pie de foto
  - `<time datetime="YYYY-MM-DD">`: fecha legible por máquinas (buscadores, calendarios)
  - `<mark>`: resaltado contextual (resultado de búsqueda, término relevante)
  - `<abbr title="...">`: abreviatura con expansión al hover
  - `<cite>`: título de obra (libro, película, canción)
  - `<blockquote cite="url">`: cita larga de otra fuente
  - `<address>`: información de contacto del autor/dueño del documento
- Inspección con DevTools (F12): árbol de elementos y estructura semántica

### Proyecto del módulo
Refactorizar la mini biografía del módulo 03 con estructura semántica completa: `<header>`, `<main>`, `<article>`, `<figure>` + `<figcaption>`, `<footer>`. Verificar en DevTools → Accessibility que los landmarks son detectados correctamente.

### Notas de progresión
- Las etiquetas estructurales crean landmarks automáticos (para lectores de pantalla) que se explican en módulo 05
- `<nav>` con `<ul>/<li>/<a>` es el patrón canónico de menú de navegación

---

## Módulo 05 — accesibilidad-web
**Duración estimada:** 3 hs  
**¿Por qué este módulo?** 1 de cada 6 personas tiene algún tipo de discapacidad. En muchos países la accesibilidad web es obligación legal (Argentina Ley 26.653, España RD 1112/2018, ADA en EE.UU.). Y hay un beneficio inesperado que casi nadie menciona: una página accesible es mejor para el SEO porque Google es, en esencia, un usuario ciego que navega el sitio.

### Subtemas
- WCAG 2.1: los 4 principios en tabla (Perceptible, Operable, Comprensible, Robusto) — niveles A, AA, AAA
- Texto alternativo en imágenes: cómo escribirlo bien, qué NO escribir ("imagen de...", nombre del archivo)
- Atributo `lang` en `<html>` y en fragmentos de otro idioma dentro del documento
- ARIA — Accessible Rich Internet Applications:
  - Regla de oro: "No ARIA es mejor que mal ARIA" — HTML nativo siempre primero
  - `aria-label`: etiqueta para elementos sin texto visible (ícono de cerrar, hamburger menu)
  - `aria-labelledby`: apunta al `id` del elemento que lo etiqueta
  - `aria-describedby`: apunta al `id` del elemento que lo describe (mensaje de ayuda, error)
  - `aria-hidden="true"`: ocultar emojis o íconos decorativos a lectores de pantalla
  - `role="alert"`: anunciar mensajes de error dinámicos
- Landmarks automáticos: qué crea cada etiqueta estructural (banner, navigation, main, complementary, contentinfo)
- Navegación por teclado: `tabindex="0"`, `tabindex="-1"`, por qué nunca usar `tabindex > 0`
- Skip links: el enlace oculto "Saltar al contenido principal" — cómo implementarlo con CSS
- Labels en formularios: `for/id`, label envolvente, por qué el `placeholder` no reemplaza al `<label>`
- Auditoría práctica con Lighthouse (DevTools → Lighthouse → Accessibility)

### Proyecto del módulo
Auditar la página del módulo 04 con Lighthouse. Corregir todos los issues encontrados: agregar skip link funcional, verificar todos los `alt`, asegurar `lang` correcto. Alcanzar score ≥ 90 en Accessibility.

### Notas de progresión
- Accesibilidad en formularios se refuerza con más detalle en módulo 06
- Accesibilidad en tablas (scope, caption) se cubre en módulo 08
- ARIA avanzado (live regions, roles de widgets) es tema de JS Junior/SemiSenior

---

## Módulo 06 — formularios
**Duración estimada:** 4 hs  
**¿Por qué este módulo?** Los formularios son el principal canal de comunicación entre el usuario y la aplicación. Login, registro, checkout, búsqueda, contacto — todo pasa por un formulario. Entenderlos bien en HTML es la base para que CSS los estilice y JavaScript los valide correctamente después.

### Subtemas
- Estructura base: `<form action method>`, `<fieldset>`, `<legend>`
  - `GET` vs `POST`: diferencia concreta (visible en URL vs en body), cuándo usar cada uno
- Inputs clásicos: `text`, `password`, `email`, `tel`, `number`, `hidden`, `checkbox`, `radio`
  - `hidden`: para qué sirve (tokens, IDs técnicos que el usuario no ve ni edita)
  - `checkbox` vs `radio`: múltiples opciones vs una sola opción del grupo (mismo `name`)
- Inputs modernos (que casi nadie enseña): `date`, `time`, `color`, `range`, `search`, `url`, `file`
- Otros controles:
  - `<textarea rows cols maxlength>`: texto multilínea
  - `<select>` con `<optgroup>`: lista desplegable agrupada
  - `<datalist>`: autocompletado nativo sin JavaScript (conectado con `list` + `id`)
- Validación nativa sin JavaScript: `required`, `minlength/maxlength`, `min/max`, `pattern`, `title`
  - `type="email"` valida formato automáticamente
  - `pattern` con expresión regular: ejemplo de código postal argentino
- `name` vs `id`: para qué sirve cada uno (servidor vs HTML)
- `autocomplete`: valores semánticos (`current-password`, `new-password`, `email`, `given-name`, etc.)
- Accesibilidad en formularios:
  - `<label for>` siempre asociado — nunca dejar un input sin label
  - `aria-describedby` para mensajes de ayuda o error
  - `<button type="submit/reset/button">`: diferencia entre los tres tipos

### Proyecto del módulo
Formulario de contacto completo: nombre, email, asunto (select con optgroup), mensaje (textarea con minlength), checkbox de términos. Validación nativa completa. Sin JavaScript.

### Notas de progresión
- La validación con JS y mensajes de error personalizados es tema de JS Trainee/Junior
- `method="dialog"` dentro de `<dialog>` se ve en módulo 07
- `autocomplete` es fundamental para password managers y para que el navegador ayude al usuario

---

## Módulo 07 — elementos-modernos
**Duración estimada:** 3 hs  
**¿Por qué este módulo?** Muchas funcionalidades que antes requerían decenas de líneas de JavaScript (acordeones, modales, barras de progreso) hoy tienen etiquetas HTML nativas. Usarlas resulta en código más simple, más accesible por defecto, y con mejor rendimiento — el navegador ya sabe cómo manejarlas.

### Subtemas
- Acordeón nativo: `<details>` + `<summary>`, atributo `open` para expandido por defecto
  - Caso de uso: FAQ completa sin JS
- Modal nativo: `<dialog>`
  - `showModal()` vs `show()`: modal con overlay vs popup simple
  - `close()`: cerrar por JS; Escape cierra automáticamente
  - `<form method="dialog">`: cerrar al hacer submit sin JS adicional
  - Por qué `<dialog>` es accesible por defecto: manejo de foco y trap de teclado automático
- Multimedia:
  - `<video controls>`: atributos `poster`, `autoplay` (requiere `muted`), `loop`, `preload`
  - `<audio controls>`: misma lógica
  - Múltiples `<source>`: por qué — compatibilidad de formatos entre navegadores (MP4, WebM, OGG)
  - `<track kind="subtitles" srclang src>`: subtítulos `.vtt` — por qué es accesibilidad, formato del archivo
- iframes: `title` obligatorio para a11y, `loading="lazy"`, `sandbox`, `referrerpolicy`
- Carga diferida nativa: `loading="lazy"` en `<img>` e `<iframe>` — rendimiento gratis, cuándo NO usarlo (imagen above the fold: usar `loading="eager"`)
- Imágenes responsivas: `<picture>` con `<source media>` (art direction) y `srcset` con `sizes` (density)
  - Por qué `<img srcset>` no es lo mismo que CSS `background-image` (el parser de HTML puede pre-cargarla)
- `<progress>` vs `<meter>`: diferencia conceptual y visual
  - `<progress>`: avance hacia completitud (descarga, wizard) — puede cambiar en el tiempo
  - `<meter low high optimum>`: valor en rango conocido (batería, espacio en disco) — estado actual

### Proyecto del módulo
Sección FAQ con `<details>/<summary>` + modal de suscripción con `<dialog>`. Video con controles, `poster`, archivo `.vtt` de ejemplo. Todas las imágenes de la página con `loading="lazy"`.

### Notas de progresión
- El control avanzado de `<dialog>` (focus trap manual, animaciones) es tema de JS Junior
- `IntersectionObserver` para lazy loading personalizado es Semi-Senior

---

## Módulo 08 — tablas
**Duración estimada:** 2 hs  
**¿Por qué este módulo?** Las tablas tienen mala fama porque en los años 90 se usaban para maquetar el layout de páginas — una práctica completamente incorrecta. Pero para datos tabulares reales (horarios, precios, comparativas) son la herramienta correcta. Saber cuándo usarlas y cuándo no es lo que diferencia al desarrollador que entiende semántica del que solo copia código.

### Subtemas
- Regla de oro: tablas solo para datos tabulares, nunca para layout visual (anti-ejemplo explícito)
- `<th>` vs `<td>`: encabezado vs dato — diferencia visual (negrita/centrado) y semántica (lectores de pantalla)
- Estructura completa: `<caption>`, `<thead>`, `<tbody>`, `<tfoot>`
  - Por qué `<caption>` es accesibilidad, no decoración: los lectores de pantalla la anuncian primero
- `scope="col"` y `scope="row"` en `<th>`: cómo los lectores de pantalla asocian encabezado con dato
- Celdas combinadas: `colspan` (ocupa columnas) y `rowspan` (ocupa filas) — cuándo tienen sentido real
- Anti-ejemplo: misma información con layout de tabla vs HTML semántico correcto

### Proyecto del módulo
Tabla de comparación de planes (Básico / Pro / Business) con `<caption>`, `<thead>/<tbody>/<tfoot>`, `scope` en todos los `<th>`, y `colspan` en el `<tfoot>` para la nota al pie.

### Notas de progresión
- Estilos de tabla (zebra striping, hover, tabla responsiva) son tema de CSS3
- Tablas complejas con `headers` y `id` encadenados son edge cases avanzados — no se cubren aquí

---

## Módulo 09 — meta-tags-seo-y-open-graph
**Duración estimada:** 2 hs  
**¿Por qué este módulo?** Un sitio puede estar perfectamente estructurado en HTML y ser invisible para Google o mostrar una previsualización vacía cuando alguien lo comparte en WhatsApp. Las meta tags son el "pasaporte" del documento — le dicen a buscadores y redes sociales de qué trata la página y cómo mostrarla.

### Subtemas
- Meta tags esenciales: `charset`, `viewport`, `description`, `author`
  - Por qué `meta keywords` no sirve (Google la ignoró desde 1998 — mito persistente)
  - `description` no afecta el ranking pero sí el CTR (click-through rate): cuándo Google la usa
- `<title>`: la más importante para SEO — fórmula recomendada: "Keyword principal | Nombre del sitio"
- Open Graph: cómo se ve el link al compartir en WhatsApp, LinkedIn, Discord, Slack
  - `og:title`, `og:description`, `og:image`, `og:url`, `og:type`, `og:locale`
  - Imagen OG: 1200×630 px, menos de 1 MB, JPG o PNG
- Twitter Cards: `twitter:card`, `twitter:title`, `twitter:image`
- Favicons modernos: `.ico` (compatibilidad), `.svg` (moderno, escalable), Apple Touch Icon (iOS)
- `<meta name="theme-color">`: color de la barra del navegador en mobile
- Documento `<head>` completo y profesional (plantilla de referencia para todos los proyectos)
- Herramientas de validación: Open Graph Debugger (Facebook), Card Validator (Twitter/X), W3C Validator

### Proyecto del módulo
Completar el `<head>` de la página del módulo 04 con todas las meta tags, Open Graph completo con imagen, favicon en tres formatos. Validar con el Open Graph Debugger y el W3C Validator.

### Notas de progresión
- Schema.org / JSON-LD es SEO estructurado avanzado — se menciona como "existe esto" pero no se implementa aquí
- Canonical URLs y hreflang son temas de SEO técnico avanzado

---

## Módulo 10 — proyecto-integrador
**Duración estimada:** 5 hs  
**¿Por qué este módulo?** Los módulos anteriores enseñaron las piezas por separado. Este módulo las ensambla en un producto real: un mini-sitio de 3 páginas que aplica semántica, accesibilidad, formularios, multimedia y SEO al mismo tiempo. El resultado es el punto de partida del skill CSS3.

### Descripción del proyecto
Mini-sitio estático de 3 páginas para un negocio ficticio (el estudiante elige el tema):

**Páginas:**
1. `index.html` — Home: hero con `<header>` semántico, sección de servicios, testimonios con `<blockquote>`, CTA
2. `blog.html` — Blog: lista de artículos con `<article>`, uso de `<time datetime>`, paginación semántica
3. `contacto.html` — Contacto: formulario completo con validación nativa, mapa con `<iframe>` seguro

**Requisitos transversales (todas las páginas):**
- `<header>` con `<nav>` y enlaces entre las 3 páginas con rutas relativas
- `<footer>` consistente con `<address>`, copyright con `&copy;` y `<time>`
- Skip link funcional
- Todas las imágenes con `alt` correcto (imagen informativa vs decorativa)
- `<head>` completo: charset, viewport, title, description, Open Graph básico
- Favicon configurado
- Sin ninguna línea de CSS en los archivos HTML (solo en atributos de forma mínima) — la estructura debe ser sólida antes del estilo

**Criterios de aceptación:**
- Lighthouse Accessibility ≥ 90 en las 3 páginas
- W3C Validator sin errores en las 3 páginas
- Navegación funcional entre las 3 páginas
- Formulario de contacto con validación nativa funcionando

**Extras opcionales:**
- Sección FAQ en el Home con `<details>/<summary>`
- Modal de newsletter con `<dialog>`
- Video de presentación del negocio con subtítulos `.vtt`
- Tabla de precios o comparativa con `colspan`
- `<picture>` con fuentes responsivas para el hero

### Nota de conexión con CSS3
Este mini-sitio SIN estilos es exactamente el punto de partida del skill `css3`. El módulo integrador de CSS3 toma este proyecto y lo estiliza completamente — flexbox, grid, colores, tipografía y responsive design. Es fundamental que el HTML esté limpio y semántico antes de agregar CSS; la estructura correcta hace que el CSS sea más fácil y predecible.

---

## Recursos recomendados

| Recurso | Para qué |
|---|---|
| [MDN Web Docs](https://developer.mozilla.org) | Documentación oficial de referencia, siempre actualizada |
| [Can I Use](https://caniuse.com) | Compatibilidad de etiquetas con navegadores |
| [WAVE](https://wave.webaim.org) | Auditoría de accesibilidad visual y gratuita |
| [Lighthouse](https://developer.chrome.com/docs/lighthouse/) | Auditoría integrada en DevTools de Chrome |
| [W3C Validator](https://validator.w3.org) | Validar que el HTML no tenga errores de sintaxis |
| [NVDA](https://www.nvaccess.org) | Lector de pantalla gratuito para Windows — para probar accesibilidad |
| [Open Graph Debugger](https://developers.facebook.com/tools/debug/) | Previsualizar cómo se ve el link en redes sociales |
| [Twitter/X Card Validator](https://cards-dev.twitter.com/validator) | Previsualizar Twitter Cards |
