---
name: new-project
description: Crea un proyecto desde cero en base al perfil técnico/creativo del usuario y a su historial de proyectos. Soporta proyectos de código (web app, API, script, mobile), creativos (video ad, motion piece, social content) e híbridos (web con animación 3D, landing inmersiva). Genera estructura de carpetas, instala stack elegido, crea CLAUDE.md/README.md/TODO.md, y reporta validación final. Usar cuando el usuario quiera arrancar un proyecto nuevo, diga "nuevo proyecto", "armar proyecto", "iniciar proyecto", "scaffold", "boilerplate", "setup inicial", o describa querer empezar algo desde cero. También usar cuando el usuario esté trabajando en un proyecto iniciado con esta skill y diga "continuemos", "retomemos el proyecto", "qué me falta hacer", "qué sigue", "sigamos con el TODO", "próxima tarea", "próximo paso", "en qué estaba", "seguir trabajando", "retomar" — en ese caso la skill busca `.skill-state.json` y reanuda desde donde quedó.
---

# /new-project — Skill de creación de proyectos

Esta skill arma proyectos personalizados según el perfil del usuario (`~/.claude/profile.md`) y su historial (`~/.claude/activity-log.jsonl`). Soporta tres tipos: **código**, **creativo**, **híbrido**. Ejecuta un flujo de 9 pasos (P0–P8) con confirmación del usuario en cada decisión clave.

## Cómo usar esta skill

Cuando se invoca:

1. Lee `~/.claude/profile.md` (perfil técnico + creativo del usuario).
2. Lee `~/.claude/activity-log.jsonl` (últimas 50 líneas para inferir patrones recientes).
3. **Si `profile.md` no tiene la sección de Configuración completa** (`workspace_root` o `github_username`), ejecutar **Paso 0** (workspace detection) antes de P1.
4. Ejecuta el flujo P0 → P1–P8 con el usuario.
5. Al terminar, appendea una línea al activity-log y actualiza contadores en profile.md.

## Reanudación

Antes de empezar P1, busca en el directorio actual un archivo `.skill-state.json`. Si existe, lee el último paso completado y pregunta:

> "Detecté un setup en curso de '<nombre>' que quedó en <paso>. ¿Continuamos desde ahí, o arrancamos de cero?"

Si el usuario continúa, salta directo al paso siguiente. Si arranca de cero, renombra el archivo viejo a `.skill-state.bak.json` y empieza P1.

Al final de cada paso completado, escribir/actualizar `.skill-state.json` con `{step, timestamp, decisions}`.

### Reanudación en modo desarrollo activo

Si la skill se invoca con frases de continuación ("qué sigue", "retomemos", "próxima tarea", etc.) y el proyecto ya está creado (existe `CLAUDE.md`, `TODO.md`, `SPEC.md`), ejecutar este flujo de verificación antes de arrancar:

1. **Leer `SPEC.md`** — ¿el alcance sigue igual o el usuario mencionó algo nuevo?
2. **Leer `TODO.md`** — ¿cuál es la próxima tarea sin hacer? ¿hay tareas pendientes de la sección actual?
3. **Si el usuario menciona una feature nueva o cambio de dominio** → aplicar el flujo Spec-First (ver `CLAUDE.md` del proyecto, sección "Agregar o modificar features") antes de escribir código.
4. **Si es continuación normal** → retomar desde la próxima tarea del TODO, siguiendo el orden: Dominio/DB → API/Backend → Frontend/UI.

## Modo de menús — texto vs interactivo

Esta skill presenta menús al usuario en muchos pasos (tipo de proyecto, stack, modo de install, etc.).

**Modo texto (default)**: el menú se renderiza como texto markdown numerado en el chat. El usuario responde tipeando número o nombre.

**Modo interactivo (opt-in)**: si `~/.claude/profile.md` tiene `prefer_interactive_menus: true`, en vez de renderizar el menú en chat, **invocar bash** con el helper `choose.js`:

```bash
node ~/.claude/skills/_helpers/choose.js "<pregunta>" "<opcion 1>" "<opcion 2>" "<opcion 3>"
```

El helper:
- Renderiza un menú con flechas ↑/↓ en el terminal del usuario (raw mode TTY).
- Devuelve la opción elegida **tal cual** (texto) a stdout.
- Sale con código 0 si eligió, 1 si canceló (Ctrl+C), 2 si no es TTY.

**Cómo leer la respuesta**: tomar la última línea de stdout del bash. Esa es la opción que el usuario eligió. Mapear de vuelta al valor interno que necesites.

**Fallback automático**: si bash falla, sale con código 2 (no-TTY), o el usuario rechaza el permiso → caer **automáticamente al modo texto** sin pedir nada. No molestar al usuario si el helper no anda.

**Cuándo usar cada uno**:
- Modo texto: menús cortos (≤3 opciones), respuesta de texto libre, default seguro.
- Modo interactivo: menús largos (4+ opciones), donde elegir con flechas es más cómodo que tipear un número.

Ejemplo de invocación para P5 (modo de install):

```bash
node ~/.claude/skills/_helpers/choose.js \
  "¿Cómo querés que ejecutemos los comandos?" \
  "Auto — los ejecuto todos, te aviso si algo falla" \
  "Paso a paso — confirmás con Enter antes de cada comando" \
  "Manual — los pegás vos en tu terminal"
```

Claude lee el stdout y mapea: si la respuesta empieza con "Auto" → modo A, "Paso" → modo B, "Manual" → modo C.

## Flujo P0 → P1–P8

### P0 · Detectar workspace y popular perfil (primera ejecución)

**Cuándo ejecutar este paso:** solo si `profile.md` no tiene la sección **Configuración** completa (ni `workspace_root` ni `github_username`). Si ya están, saltar directo a P1.

El objetivo es popular el perfil del usuario sin pedirle 20 preguntas. Se prefiere SIEMPRE el método más automático posible.

**Diálogo del Paso 0:**

```
Antes de arrancar, necesito conocer tu background técnico.
Estás corriendo Claude Code desde: <cwd>

¿Cómo prefieres que arme tu perfil?
  1) Scaneá <cwd> (asumo que esta es tu carpeta de proyectos)
  2) Scaneá otra carpeta (la indico)
  3) Scaneá mi GitHub (sin proyectos locales)
  4) Hagamos entrevista manual (no scanear nada)
```

**Según la elección, ejecutar:**

- **Opción 1 / 2** → ver `references/scan-strategies.md` sección "Estrategia A — Scan local".
  - Si la opción 1 detecta un proyecto único (cwd con `package.json`/`.git`), preguntar: *"Detecté que estás dentro de un proyecto. ¿Querés que suba un nivel y scanee `<parent>`?"*
- **Opción 3** → cascada de GitHub: `references/scan-strategies.md` sección "Estrategia B — Cascada de GitHub".
  - Probar en orden: MCP de GitHub en sesión → `gh` CLI → API pública (sin auth) → entrevista manual.
- **Opción 4** → entrevista manual: 8 preguntas guiadas (ver `scan-strategies.md` sección "Nivel 4").

**Después del scan, guardar en `profile.md` la sección Configuración:**

```markdown
## Configuración

- **workspace_root**: /home/charly/code/
- **github_username**: charly18
- **scan_method**: local | github-mcp | gh-cli | github-api | manual
- **last_scan_date**: 2026-05-30
```

Y popular las secciones "Stacks dominantes" con lo encontrado.

**Mostrar el resumen antes de escribir el archivo** y pedir confirmación al usuario. El usuario debe poder corregir cualquier inferencia equivocada antes de que se persista.

**Tip importante para el usuario en la opción 1:** si el cwd parece ser el home (`~/`) o una carpeta genérica, sugerir paths comunes (`~/Documents/projects/`, `~/dev/`, `~/code/`, `D:\dev\`) en vez de scanear el home entero (que sería lento y ruidoso).

### P1 · Describe el proyecto

Pregunta libre: "¿De qué trata el proyecto?". Después, una pregunta cerrada de tipo:

- **Código** → web app, API, fullstack, script/CLI, mobile, librería
- **Creativo** → video ad, motion piece, social content (Reels/TikTok/Shorts), storyboard, branding visual
- **Híbrido** → landing con 3D, web inmersiva, portfolio con motion, instalación interactiva

Si el usuario duda, hacer 2–3 preguntas para inferir el tipo. Guardar tipo en `.skill-state.json`.

#### P1.5 · Pattern matching (chequeo automático)

**Después de capturar la descripción y el tipo**, antes de pasar a P2, evaluar si la descripción matchea algún patrón pre-armado:

1. Leer `references/project-patterns/README.md`.
2. Para cada patrón listado, contar cuántas **match criteria** matchean contra la descripción del usuario (palabras clave o sinónimos cercanos).
3. Si **2 o más señales** matchean para algún patrón → ofrecerlo:

   ```
   Tu descripción matchea con el patrón **<nombre del patrón>**.
   Este patrón ya tiene stack, arquitectura, templates y prompts pre-armados específicos
   para este caso de uso, así te ahorrás varias decisiones.

   ¿Lo usamos?
   > 1) Sí, cargá el patrón
     2) No, seguimos con el flujo genérico (yo decido stack y arquitectura)
     3) Mostrame qué incluye el patrón antes de decidir
   ```

4. Si el usuario elige **1**: cargar el archivo del patrón completo (`<pattern-id>.md`) y seguir las "Notas para Claude al cargar este patrón" del propio archivo. Eso típicamente significa:
   - P2 → anuncio del stack del patrón, no pregunta abierta.
   - P3 → confirmá *"¿OK o cambiamos algo?"* pero con la tabla del patrón pre-llenada.
   - P4 → arquitectura del patrón directamente.
   - P5 → comandos del patrón.
   - P6 → templates del patrón.
   - P7 → TODO base del patrón como semilla del modo C.

5. Si el usuario elige **2**: seguir flujo genérico P2 normal.

6. Si el usuario elige **3**: mostrar el resumen del patrón (su sección "Stack recomendado" + "Arquitectura de carpetas" + qué templates incluye), después volver a preguntar 1/2.

**Si 0 o 1 señales matchean** para todos los patrones → no ofrecer nada, pasar directo a P1.7.

**Si más de un patrón matchea con 2+ señales** → ofrecer los dos con sus scores y dejar elegir.

**Si el usuario cargó un patrón y después en P3 decide cambiar algo fundamental** (ej. pide otro framework distinto al del patrón) → avisar *"Eso sale del patrón. ¿Querés salir del patrón y volver al flujo genérico, o ajustamos solo esa pieza?"*.

### P1.7 · SDD + DDD — Generar Project Spec

**Metodologías combinadas:**
- **SDD (Specification-Driven Development)**: definir qué se va a construir antes de tocar código. Genera `SPEC.md` como contrato del proyecto.
- **DDD (Domain-Driven Design)**: para proyectos con lógica de negocio (fullstack, backend, API), pensar desde el dominio hacia afuera — primero las entidades y reglas, luego la DB, luego la API, luego el frontend. El orden importa porque todo lo demás se deriva del dominio.

Ver referencia completa de ambas metodologías en `references/methodologies.md`.

#### Paso A — Determinar si aplica DDD

DDD aplica cuando el proyecto tiene **lógica de negocio + persistencia**:

| Tipo de proyecto           | ¿DDD aplica? | Qué analizar                        |
|----------------------------|:------------:|-------------------------------------|
| Fullstack (frontend + API + DB) | ✅ Sí    | Dominio → DB → API → Frontend       |
| Backend / API pura          | ✅ Sí        | Dominio → DB → API                  |
| Frontend puro (SPA/landing) | ❌ No        | Solo features + user stories        |
| Script / CLI                | ❌ No        | Solo features + flujo de uso        |
| Creativo / motion           | ❌ No        | Solo brief + deliverables           |

Si DDD aplica → ejecutar el análisis de dominio **antes** de generar el SPEC.md completo.

#### Paso B — Análisis de dominio (solo si DDD aplica)

Guiar al usuario con preguntas breves para identificar las entidades del dominio:

> "Antes de armar el spec completo, necesito entender el dominio del negocio. Voy a hacerte 3 preguntas rápidas."

**Pregunta 1 — Entidades principales:**
> "¿Cuáles son los 'objetos' principales de tu app? Por ejemplo para un e-commerce serían Producto, Pedido, Usuario, Carrito. Para un blog: Post, Autor, Categoría, Comentario. ¿Cuáles son los tuyos?"

**Pregunta 2 — Relaciones:**
> "¿Cómo se relacionan? Por ejemplo: 'un Usuario tiene muchos Pedidos', 'un Pedido tiene muchos Productos'. Dame las relaciones más importantes."

**Pregunta 3 — Reglas de negocio críticas:**
> "¿Hay alguna regla de negocio importante? Por ejemplo: 'un Pedido no puede tener stock negativo', 'solo usuarios verificados pueden comprar', 'los Posts necesitan aprobación antes de publicarse'."

Con esas 3 respuestas, generar automáticamente:

**Diagrama de entidades (formato texto):**
```
[Usuario] 1 ──── N [Pedido] N ──── N [Producto]
   |                  |
   └── tiene roles     └── tiene estados (pendiente/pagado/enviado)
```

**Schema de DB inferido:**
```sql
-- users
id, email, password_hash, role, created_at, verified_at

-- products
id, name, description, price, stock, category_id, created_at

-- orders
id, user_id, status, total, created_at, updated_at

-- order_items
id, order_id, product_id, quantity, unit_price
```

Mostrar el diagrama + schema al usuario:
> "Basado en lo que me dijiste, este sería el modelo de dominio y el schema de DB inicial. ¿Lo ajustamos o seguimos?"

Si el usuario aprueba → guardar en SPEC.md. Si pide ajustes → incorporarlos.

#### Paso C — Generar SPEC.md

Basado en la descripción del usuario (P1) + el análisis de dominio (si aplica), generar automáticamente un borrador de `SPEC.md`:

```markdown
# Project Spec — [Nombre del proyecto]

## Descripción
[2-3 líneas del objetivo principal]

## Usuarios objetivo
[Quién lo usa y para qué]

## Features — MVP
| Prioridad | Feature | Descripción breve |
|-----------|---------|-------------------|
| P0 (must) | ...     | ...               |
| P1 (should)| ...    | ...               |
| P2 (nice)  | ...    | ...               |

## User Stories clave
- Como [usuario], quiero [acción], para [beneficio]
- (3-5 stories críticas del MVP)

## Dominio — Entidades y relaciones  ← solo para proyectos con DDD
[Diagrama de entidades en texto]
[Reglas de negocio críticas listadas]

## Schema de DB  ← solo para proyectos con DDD
[Tablas con columnas, tipos y relaciones — SQL o descripción]

## API Contracts  ← solo para proyectos con backend
[Endpoints principales: método, path, request/response shape]

## Criterios de aceptación — MVP listo cuando:
- [ ] ...
- [ ] ...

## Fuera del alcance (v1)
- ...
```

**Mostrar el SPEC al usuario antes de guardar:**
> "Generé el spec del proyecto siguiendo SDD + DDD. Revisalo — si querés ajustar entidades, schema, features o alcance, decime antes de arrancar."

Si el usuario aprueba, guardar como `SPEC.md` en el directorio del proyecto (se creará en P5 junto con la carpeta). Guardar el contenido aprobado en `.skill-state.json` para usarlo en P6.

Si el usuario pide cambios, incorporarlos y mostrar la versión actualizada una vez. No entrar en loop — si pide una segunda ronda, aplicarla y seguir.

#### Impacto en el TODO.md — orden de desarrollo para fullstack

Si el proyecto es fullstack o backend, el TODO generado en P7 debe reflejar el orden correcto de construcción según DDD: **dominio primero, presentación al final**.

El TODO para fullstack tendrá una sección extra entre Setup y Features:

```markdown
## Dominio / Base de datos
<!-- 📄 README sync → agregar sección de arquitectura/schema cuando se complete -->
- [ ] Crear migraciones de DB (tablas definidas en SPEC.md)
- [ ] Implementar modelos / entidades del dominio
- [ ] Configurar conexión a DB y ORM
- [ ] Seed de datos básicos para desarrollo

## API / Backend
<!-- 📄 README sync → actualizar sección de API con endpoints reales -->
- [ ] Implementar repositorios / data access layer
- [ ] Implementar servicios / lógica de negocio
- [ ] Implementar endpoints (según API Contracts del SPEC.md)
- [ ] Tests de integración de endpoints críticos

## Frontend / UI
<!-- 📄 README sync → agregar capturas o descripción de pantallas -->
- [ ] Configurar routing
- [ ] Implementar páginas/vistas principales
- [ ] Conectar con la API
- [ ] Estados de loading, error y empty
```

Para **frontend puro**: el TODO mantiene solo `Setup → Features iniciales → Calidad → Documentación → Deploy` (sin las secciones de dominio/API).

Continuar a P2.

### P2 · Sugiere stack

Basado en el tipo elegido + las preferencias del perfil:

- **Código**: consultar `references/stacks-code.md` y proponer el stack que el usuario más usa según el log. Formato: "Veo que en tus últimos 5 proyectos usaste React + Express + Tailwind + Vitest. ¿Mantenemos esa base?".
- **Creativo**: consultar `references/stacks-creative.md`. Para video ads, sugerir el pipeline: AI image gen → AI video gen → editor.
- **Híbrido**: combinar. Vite + React + R3F + drei + GSAP por default. Si el usuario es principiante en 3D según el perfil, sugerir Spline + React como entrada amigable.

### P3 · Confirma, edita o ampliá el stack (loop interactivo)

Mostrar la sugerencia como tabla:

```
Stack sugerido para tu proyecto:

  Capa       | Elección
  -----------+----------------------------
  Frontend   | React + Vite (TS)
  Backend    | Express
  Estilos    | Tailwind
  Testing    | Vitest
```

Después ofrecer el menú principal:

```
¿Qué hacés con este stack?
> 1) Acepto todo — seguimos a P4
  2) Cambiar una capa
  3) Agregar una herramienta extra (animación, ORM, auth, state, etc.)
  4) Usar un comando libre (algo no listado)
  5) Ver alternativas para todo el stack

(Tipeá el número, o respondé "acepto" / "cambiar X" / "agregar Y" en lenguaje natural)
```

**Loop**: ejecutar la opción elegida, mostrar la tabla actualizada, y volver al menú hasta que el usuario elija 1.

#### Opción 2 — Cambiar una capa

```
¿Qué capa querés cambiar?
> 1) Frontend  (actual: React + Vite TS)
  2) Backend   (actual: Express)
  3) Estilos   (actual: Tailwind)
  4) Testing   (actual: Vitest)
  5) Lenguaje  (actual: TypeScript)
```

Cuando elige una capa, mostrar el listado completo de esa capa desde `references/stacks-code.md`. Por ejemplo si elige "Estilos":

```
Opciones de estilos:
> 1) Tailwind CSS         (actual)
  2) shadcn/ui            (Tailwind + componentes prearmados)
  3) MUI (Material UI)
  4) Bootstrap (CSS puro)
  5) React-Bootstrap
  6) Chakra UI
  7) Mantine
  8) Ant Design
  9) styled-components
  10) Emotion
  11) Sass / SCSS
  12) CSS Modules
  13) Otra (la indico)
```

Aceptar número o nombre. Volver a la tabla y al menú principal.

#### Opción 3 — Agregar herramienta extra

Pedir la categoría:

```
¿Qué tipo de herramienta agregamos?
> 1) Animación / motion (Framer Motion, GSAP, Lottie, Three.js, R3F)
  2) State management (Zustand, Redux Toolkit, Jotai, TanStack Query)
  3) Forms + validación (React Hook Form, Zod, Yup)
  4) ORM / DB (Prisma, Drizzle, Mongoose)
  5) Auth (Better Auth, Auth.js, Clerk, Lucia)
  6) i18n
  7) Otra
```

Mostrar opciones de esa categoría desde `references/stacks-code.md` o `stacks-web-animation.md`, agregar al stack. La tabla muestra ahora la fila nueva como "Extra: animación / Framer Motion".

#### Opción 4 — Comando libre

```
¿Qué herramienta querés agregar que no esté en la lista?
- Nombre: <input>
- Comando exacto de instalación: <input>
```

Se agrega al stack como ítem custom. La skill confía en el comando que pegues sin validarlo.

#### Opción 5 — Ver alternativas para todo el stack

Útil cuando el usuario quiere comparar antes de elegir. Mostrar un combo alternativo basado en otro perfil común (ej. si la sugerencia era React+Tailwind, mostrar Vue+Pinia como alternativa).

#### Caso especial: Vite

Cuando el frontend elegido es Vite-based (React, Vue, Svelte, Solid, vanilla), preguntar explícitamente:

```
¿Versión del template?
> 1) TypeScript  (recomendado, default de tu perfil)
  2) JavaScript
```

Y elegir el template correcto: `react` vs `react-ts`, `vue` vs `vue-ts`, etc. Ver `references/stacks-code.md` sección "Vite templates".

### P4 · Recomendar y decidir arquitectura

> Referencia completa de tipos, criterios y estructuras de carpetas: `references/architectures.md`.

Para **creativo** e **híbrido**, la estructura está predefinida en `references/architectures.md`. Mostrarla y confirmar directamente.

Para **código** (y la parte código de proyectos híbridos), ejecutar el flujo completo de recomendación:

#### Paso 1 — Evaluar el proyecto en 5 dimensiones

Basado en todo lo relevado hasta ahora (descripción de P1, análisis de dominio de P1.7, stack de P2-P3), puntuar en cada dimensión:

| Dimensión | Baja (1) | Media (2) | Alta (3) |
|---|---|---|---|
| **Complejidad de dominio** | 1-3 entidades simples, sin reglas | 4-8 entidades, algunas reglas | 9+ entidades, reglas complejas, estados |
| **Tamaño del equipo** | 1 persona | 2-3 personas | 4+ personas |
| **Horizonte de mantenimiento** | Semanas / prototipo | Meses | Años |
| **Escalabilidad** | Sin necesidad | Crecimiento moderado esperado | Alta carga, escala independiente |
| **Testabilidad requerida** | Tests básicos | TDD en partes críticas | TDD estricto, lógica aislada del framework |

**Score total (5–15):**
- 5–7 → arquitectura simple
- 8–11 → arquitectura mediana
- 12–15 → arquitectura compleja

#### Paso 2 — Recomendar arquitectura con explicación

Según el score y el tipo de proyecto, elegir de la lista completa en `references/architectures.md` y mostrar la recomendación en este formato:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Arquitectura recomendada: [NOMBRE]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

¿Qué es?
[Explicación en 2-3 líneas, sin jerga. Como si le explicaras a alguien
que acaba de empezar a programar. Usar analogías si ayuda.]

¿Por qué para este proyecto?
→ [Razón 1 específica del análisis que hicimos]
→ [Razón 2 específica]
→ [Razón 3 si aplica]

¿Qué ventajas concretas te da?
✅ [Beneficio 1]
✅ [Beneficio 2]
✅ [Beneficio 3]

¿Qué sacrificás?
⚠️ [Trade-off 1 — ser honesto]
⚠️ [Trade-off 2 si aplica]

Estructura de carpetas resultante:
[árbol del proyecto según esta arquitectura]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Tono de la explicación según el perfil del usuario:**

- Si el perfil muestra poca experiencia o el usuario nunca mencionó estas arquitecturas → explicar desde cero con analogías simples. Ejemplo: *"Clean Architecture es como una empresa bien organizada: hay un CEO (el dominio) que toma decisiones de negocio, y hay empleados (la infraestructura) que ejecutan. El CEO no sabe cómo se usan las computadoras — eso es trabajo de los empleados. Así el dominio es independiente del framework."*

- Si el usuario ya mencionó términos técnicos o el perfil muestra experiencia → ser más conciso y técnico, ir directo a los trade-offs.

#### Paso 3 — Interacción y feedback

Después de mostrar la recomendación, ofrecer:

```
¿Qué hacés con esta propuesta?
> 1) La acepto — seguimos con esta estructura
  2) Quiero ver otra opción (decime cuál o qué cambiar)
  3) Tengo una pregunta sobre esta arquitectura
  4) Ya sé lo que quiero — la describo yo
```

**Si el usuario elige 2** → mostrarle las alternativas cercanas con sus trade-offs, y dejar que elija. No cambiar sin explicar por qué la alternativa podría ser mejor o peor para SU caso.

**Si el usuario elige 3** → responder la pregunta con ejemplos concretos del proyecto actual, no ejemplos genéricos.

**Si el usuario elige 4** → modo libre: el usuario describe la estructura, la skill la implementa sin opinar.

**Si el usuario ya sabe de arquitecturas y da feedback** (ej: "prefiero Hexagonal porque vamos a tener múltiples adapters") → incorporar su razonamiento, confirmar que aplica, y documentar la decisión en el CLAUDE.md del proyecto con el razonamiento del usuario:
```
## Decisiones del setup
- Arquitectura: Hexagonal — elegida porque el proyecto necesita múltiples
  adapters de entrada (API REST + CLI + webhooks). El dominio define los
  ports y cada canal implementa su adapter.
```

#### Principios activos del perfil que influyen en la arquitectura

Leer `references/coding-principles.md` + sección "Principios de código" de `profile.md`:

- **Repository activo + DB** → separar `domain/repositories/` (interfaces) de `infrastructure/persistence/` (implementaciones), aunque la arquitectura base sea feature-based.
- **SOLID activo + mediano+** → separar interfaces de implementaciones en general.
- **YAGNI activo + proyecto chico** → NO sobre-estructurar. Una landing no necesita `domain/` aunque Repository esté activo.
- **MVC/MVVM activo + framework que lo espera** (Rails, Django, NestJS, Angular) → respetar la convención nativa del framework.

Mencionar qué principios influyeron: *"Como tenés Repository y SOLID activos, separé `domain/` de `infrastructure/` aunque la arquitectura base sea feature-based."*

### P4.5 · UI/UX Design System (solo proyectos con interfaz visual)

**Saltear si:** el proyecto es una API pura, CLI, script, o librería sin UI.

El objetivo es generar un design system real antes de escribir código, para evitar el patrón genérico de IA (hero con gradiente azul-violeta, grid de 3 cards, footer de 4 columnas con íconos emoji).

Consultar `references/ui-design-guidelines.md` para todos los valores recomendados.

#### Paso 1 — Tipo de producto

```
¿Qué tipo de producto es?
> 1) SaaS / herramienta de productividad
  2) E-commerce / tienda online
  3) Landing page / marketing
  4) Dashboard / admin panel
  5) Portfolio / marca personal
  6) Blog / contenido editorial
  7) Startup / consumer app
  8) Otro
```

#### Paso 2 — Tono visual

```
¿Cuál describe mejor el tono visual?
> 1) Minimalista — limpio, mucho espacio, tipografía como protagonista
  2) Moderno oscuro — dark mode, acentos vibrantes, tech
  3) Orgánico / cálido — terracota, verde, cercano, humano
  4) Profesional / corporativo — azul/gris, confiable, estructurado
  5) Bold / Brutalist — colores llamativos, grids rotos, inesperado
  6) Glassmorphism — translúcido, blur, capas con profundidad
  7) Elegante / premium — mucho whitespace, serif, lujo silencioso
```

#### Paso 3 — Recomendar design system

Basado en tipo+tono, generar la recomendación consultando `references/ui-design-guidelines.md`. Mostrarla en este formato:

```
Design System sugerido:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Estilo:         [nombre del estilo]

Paleta:
  Primary:      #XXXXXX  (uso: CTAs, links, acciones principales)
  Accent:       #XXXXXX  (uso: highlights, badges, iconos activos)
  Background:   #XXXXXX
  Surface:      #XXXXXX  (cards, panels, inputs)
  Text:         #XXXXXX / #XXXXXX (primario / secundario)
  Error:        #EF4444
  Success:      #22C55E

Tipografía:
  Headings:     [Font] — weight 600-700
  Body:         [Font] — weight 400, 16px base
  Mono:         JetBrains Mono (código, badges)

Espaciado:      Sistema base-8 (8/16/24/32/48/64/96px)

Componentes clave para este producto:
  • [componente 1 con patrón recomendado]
  • [componente 2]
  • [componente 3]

Anti-patrones — NO hacer en este proyecto:
  ✗ [anti-patrón específico del tipo+tono elegido]
  ✗ [anti-patrón 2]
  ✗ [anti-patrón 3]
  ✗ Íconos emoji en lugar de SVG (Lucide, Heroicons, Phosphor)
  ✗ Animaciones en todos los elementos al hacer scroll
  ✗ Cards con box-shadow negra opaca (usar sombras tenues con color)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
¿Usamos este sistema? (1 = sí / 2 = cambiar color / 3 = cambiar tipografía / 4 = cambiar estilo)
```

#### Paso 4 — Guardar como design-system/MASTER.md

Una vez aprobado, crear dentro del proyecto (en P5 se creará la carpeta):

```markdown
# Design System — [Nombre del proyecto]
Generado por /new-project · Metodología: SDD + UI/UX Design System

## Style
- **Visual style:** [estilo]
- **Tone:** [tono]

## Color Tokens
| Token               | Value     | Usage                          |
|---------------------|-----------|--------------------------------|
| --color-primary     | #XXXXXX   | CTAs, links, acciones          |
| --color-accent      | #XXXXXX   | Highlights, iconos activos     |
| --color-bg          | #XXXXXX   | Fondo de página                |
| --color-surface     | #XXXXXX   | Cards, panels, inputs          |
| --color-text        | #XXXXXX   | Texto primario                 |
| --color-text-muted  | #XXXXXX   | Texto secundario               |
| --color-border      | #XXXXXX   | Bordes, divisores              |
| --color-error       | #EF4444   | Errores, validaciones          |
| --color-success     | #22C55E   | Confirmaciones, estados OK     |

## Typography
| Role        | Font            | Weight | Size          |
|-------------|-----------------|--------|---------------|
| H1          | [Font]          | 700    | 48–64px       |
| H2          | [Font]          | 600    | 32–40px       |
| H3          | [Font]          | 600    | 24px          |
| Body        | [Font]          | 400    | 16px / lh 1.6 |
| Label / UI  | [Font]          | 500    | 14px          |
| Mono / Code | JetBrains Mono  | 400    | 14px          |

## Spacing Scale (base-8)
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96px

## Component Patterns
[Decisiones de diseño para los componentes clave de este producto]

## Anti-patterns (no hacer en este proyecto)
[Lista de cosas a evitar específicas para este tipo de producto]

## Reglas de accesibilidad aplicadas
- Contraste mínimo: 4.5:1 para texto normal, 3:1 para texto grande
- Touch targets mínimos: 44×44px
- Sin color como único indicador de estado
- Focus rings visibles en todos los elementos interactivos
```

Guardar en `<project-root>/design-system/MASTER.md`.

Avisar al usuario:
> "Guardé el design system en `design-system/MASTER.md`. Claude Code lo va a usar como contexto cada vez que genere componentes en este proyecto — así todos los colores y tipografías quedan consistentes."

### P5 · Comandos a ejecutar (interactivo, paso a paso)

El objetivo de este paso es **evitar que el usuario tipee los comandos a mano** (riesgo de typos) y darle control granular sobre qué se ejecuta.

#### Vista previa primero

Antes de ejecutar nada, mostrar la lista completa para que el usuario vea el alcance:

```
Para armar tu proyecto necesito correr 6 comandos:

  [1] cd /home/charly/code
  [2] npm create vite@latest mi-proyecto -- --template react-ts
  [3] cd mi-proyecto
  [4] npm install
  [5] npm i -D tailwindcss postcss autoprefixer
  [6] npx tailwindcss init -p

¿Cómo querés que avancemos?
> 1) Auto       — los ejecuto todos, te aviso si algo falla
  2) Paso a paso — te muestro cada comando y confirmás con Enter antes de ejecutar
  3) Manual     — los pegás vos en tu terminal, yo solo confirmo al final
```

**Default sugerido**: si el `profile.md` tiene `default_install_mode` seteado, usar eso sin preguntar y avisarle al usuario *"Voy en modo <X> según tu perfil. Si querés cambiar, decime."*.

Si el usuario elige un modo distinto al default, ofrecer al final: *"¿Querés que lo grabe en tu perfil como tu modo default? (s/n)"*.

#### Modo A — Auto

Ejecutar todos los comandos en orden vía bash, reportando cada uno:

```
[1/6] cd /home/charly/code
      OK

[2/6] npm create vite@latest mi-proyecto -- --template react-ts
      corriendo...
      OK (proyecto creado en 12s)

[3/6] cd mi-proyecto
      OK

[4/6] npm install
      corriendo... (esto puede tardar 30-60s)
      OK (245 paquetes instalados)
```

**Si algún comando falla**, pausar y preguntar:

```
[5/6] npm i -D tailwindcss postcss autoprefixer
      ERROR: npm ERR! code ERESOLVE
      <stderr completo>

¿Cómo seguimos?
> 1) Reintentar el mismo comando
  2) Modificar el comando y reintentar (lo edito junto con vos)
  3) Saltarlo y seguir con el próximo
  4) Abortar el setup (deja el proyecto a medias)
```

#### Modo B — Paso a paso

Para cada comando, mostrar y esperar confirmación explícita:

```
[2/6] Próximo comando:

      npm create vite@latest mi-proyecto -- --template react-ts

¿Qué hacés?
> 1) [Enter] / "s" / "ok"   — lo ejecuto yo
  2) "no" / "skip"            — saltarlo
  3) "yo"                     — lo corrés vos, yo espero tu "listo"
  4) <pegar comando custom>   — uso el que pegues en vez del sugerido
```

Después de ejecutar (o de que el usuario confirme su ejecución manual), seguir con el próximo. Si falla, mismo menú de error que en Modo A.

**Atajo útil**: si el usuario tipea "todo" en cualquier paso, switchear a Modo A para los restantes.

#### Modo C — Manual

Mostrar toda la lista en un bloque copiable de una vez:

````
```bash
cd /home/charly/code
npm create vite@latest mi-proyecto -- --template react-ts
cd mi-proyecto
npm install
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Copialos y corrélos en tu terminal. Cuando termines, decime "listo" o pegá lo que haya fallado.
````

Esperar el "listo" antes de seguir.

#### Excepción: acciones seguras siempre las hace la skill

Las siguientes acciones **NO** son parte de P5 y la skill las ejecuta sin preguntar:

- Crear carpetas según la arquitectura de P4 (`mkdir -p src/features/auth/components`, etc.).
- Escribir archivos de configuración generados (`tailwind.config.js`, `vitest.config.ts`, `.eslintrc`).
- Escribir los archivos base de P6 (`CLAUDE.md`, `README.md`, `TODO.md`).

Estas son operaciones de filesystem deterministas y no destructivas, sin riesgo de typo.

#### Si la skill no tiene permisos de Bash en la sesión

Si Claude no puede ejecutar bash en la sesión actual (modo restringido), avisar al usuario y **caer automáticamente a Modo C** sin preguntar. Mostrar:

```
No tengo permisos para ejecutar comandos en esta sesión.
Te voy a mostrar todo para que lo corras vos. Decime "listo" cuando termines.
```

#### Reporte intermedio al final de P5

Antes de pasar a P6, mostrar resumen:

```
=== Resumen de P5 ===
Modo elegido:   Paso a paso
Ejecutados:     5 / 6
Saltados:       1 (npm i -D vitest — usuario eligió omitir)
Fallidos:       0
Tiempo total:   2 min 14 s
```

Si hubo saltos o fallos, ofrecer revisar el TODO.md para registrarlos como pendientes (en P7).

### P6 · Genera archivos base

Crear, dentro del directorio del proyecto, copiando desde `references/templates/`:

**Código / híbrido**:
- `CLAUDE.md` (desde `CLAUDE.md.template`, rellenado con el stack y arquitectura elegidos)
- `README.md` (desde `README.md.template`)
- `TODO.md` (desde `TODO.md.template`, vacío salvo encabezados)

**Creativo**:
- `BRIEF.md` (desde `BRIEF.md.template`)
- `prompts.md` (desde `prompts.md.template`)
- `STORYBOARD.md` (desde `STORYBOARD.md.template`)
- `CLAUDE.md`, `README.md`, `TODO.md` (también)

Además crear las carpetas según la arquitectura de P4.

**Reglas base — siempre activas, no dependen del perfil** (ver `references/coding-principles.md` sección "Reglas base — no son opt-in"). Aplican a cualquier proyecto con interfaz visual (código o híbrido), salvo APIs/CLIs sin UI:

- **Etiquetas semánticas HTML**: usar `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>` en vez de `<div>` genérico cuando la semántica del contenido lo permite. Jerarquía de headings sin saltos (`<h1>`→`<h2>`→`<h3>`). Mejora SEO (los buscadores entienden la estructura) y accesibilidad (landmarks para lectores de pantalla).
- **Sin estilos inline**: orden de prioridad — (1) clases del framework/librería del stack elegido (Tailwind, Bootstrap, etc.), (2) sistema de estilos del framework (CSS Modules, styled-components), (3) si el stack es HTML/CSS/JS vanilla sin sistema de clases, crear un archivo `.css` propio y enlazarlo. Nunca `style="..."` ni `style={{}}`, salvo valores dinámicos calculados en runtime.

Si el usuario pide explícitamente desactivar alguna de estas dos para el proyecto puntual, confirmar antes de aplicar el cambio (ver wording sugerido en `coding-principles.md`).

**Principios de código del perfil** (opt-in, ver `references/coding-principles.md`): cuando la skill genera código de scaffolding (componentes ejemplo, configs, archivos base), respetar los principios activos del perfil:

- Si "Early returns" está activo → el código generado usa early returns en vez de pirámides de `if`.
- Si "Tipado explícito" está activo y es TS → tipos explícitos en props y returns, evitar `any`.
- Si "Funciones < 30 líneas" está activo → no generar funciones largas; partir en helpers.
- Si "Logs estructurados" está activo → usar `logger.info({ key: val })` en vez de `console.log("texto")`.

**Rellenar el CLAUDE.md generado con la sección "Principios de código aplicados a este proyecto"**: copiar de la plantilla y completar:
- `{{ACTIVE_PATTERNS}}` con los patrones marcados en el perfil del usuario.
- `{{ACTIVE_PRINCIPLES}}` con los principios marcados.
- `{{STYLE_TECH}}` con la tecnología de estilos elegida (Tailwind / styled-components / CSS Modules / etc.).
- `{{LOCAL_OVERRIDE_*}}` dejar vacío salvo que el usuario haya pedido alguna excepción.

### P7 · TODO colaborativo

Ofrecer 4 modos al usuario:

- **A · Manual** — el usuario dicta, Claude solo escribe.
- **B · Colaborativo** (default recomendado) — back-and-forth, Claude sugiere si dudás.
- **C · Auto** — Claude propone un TODO completo basado en el tipo de proyecto + arquitectura, el usuario aprueba o edita.
- **D · Skip** — queda vacío, el usuario lo completa después.

Si el `profile.md` tiene `default_todo_mode` seteado, usarlo sin preguntar.

Si el usuario elige B o C, el TODO debe tener **secciones mínimas**: `Setup`, `Features iniciales`, `Calidad (tests/lint)`, `Documentación`, `Deploy`. Cada ítem en formato `- [ ] Tarea`. Para creativo: `Brief`, `Referencias`, `Prompts`, `Frames`, `Edit`, `Exports`.

#### Convención: README sync al completar secciones

El `TODO.md.template` y el `CLAUDE.md.template` incluyen la tabla de mapeo de secciones a README, pero avisarle al usuario explícitamente al cerrar P7 (salvo modo D):

> "Otra regla que quedó en `CLAUDE.md`: cuando se completa el **último checkbox de cada sección del TODO** (Setup, Features, Calidad, Deploy, Docs), Claude actualiza la sección correspondiente del README e incluye ese cambio en el mismo commit. Así el README siempre refleja el estado real del proyecto — no quedá desactualizado."

#### Convención: 1 tarea completada = 1 commit + push

El `TODO.md.template` y el `CLAUDE.md.template` ya incluyen esta regla, pero avisarle al usuario explícitamente al cerrar P7 (salvo que haya elegido modo D):

> "Una convención que quedó configurada en `CLAUDE.md`: cada vez que completes una tarea del TODO, marcá el checkbox y hacé commit + push **en el mismo paso** — checkbox y código siempre van juntos en el mismo commit, con el formato `tipo: descripción (TODO: texto de la tarea)`. Así cualquier sesión futura de Claude Code en este proyecto va a seguir esa regla automáticamente, tu TODO.md queda siempre sincronizado con lo que realmente está hecho, y el historial de git funciona como registro de qué tarea se resolvió en cada commit."

Si el usuario prefiere no aplicar esta convención (por ejemplo, ya tiene su propio flujo de commits), preguntar:
> "¿Querés que la quite de CLAUDE.md, o la dejamos como sugerencia y vos decidís si la seguís?"

Si pide quitarla, borrar la sección "Workflow de Git" del `CLAUDE.md` generado y la nota del `TODO.md`.

### P8 · Reporte de validación

Imprimir un check tipo tarjeta de salud:

```
=== Reporte de setup ===
Proyecto: <nombre>
Tipo: <código|creativo|híbrido>
Stack: <resumen 1 línea>
Arquitectura: <nombre>

Validación:
  [v] Dependencias instaladas
  [v] Dev server arranca
  [v] Linter configurado y pasa
  [v] Smoke test pasa
  [v] Carpetas creadas
  [v] CLAUDE.md, README.md, TODO.md presentes

Próximos 3 pasos del TODO:
  1. <ítem>
  2. <ítem>
  3. <ítem>

Tiempo total: <X> min
```

Para código: chequear que `npm run dev`, `npm run lint`, y `npm test` ejecutan sin error (la skill pide al usuario que los corra y confirme, o los corre directamente si está en Modo A de P5).

Para creativo: chequear que `BRIEF.md` tiene los campos del template, `prompts.md` tiene la estructura por bloques (STYLE/BACKGROUND/FRAMING/OUTPUT), y las carpetas están creadas.

### P8.5 · Generar SYSTEM_PROMPT.md (opcional, semilla para futuros proyectos)

**Solo si el usuario está conforme con el proyecto** (preguntar explícitamente al cierre de P8):

```
¿Querés que genere un SYSTEM_PROMPT.md de este proyecto?

Un system prompt es un documento con TODAS las decisiones técnicas, de diseño
y de UX/SEO/accesibilidad/performance/gotchas de este proyecto. Sirve para:

  • Que un Claude futuro retome el proyecto sin perder contexto.
  • Reusarlo como base en proyectos similares (te ahorra tokens y setup).
  • Si lo guardás como project-pattern, /new-project lo va a ofrecer
    automáticamente cuando arranques algo parecido.

¿Lo generamos?
> 1) Sí, generar y guardar dentro del proyecto.
  2) Sí, generar Y guardarlo también como project-pattern reusable.
  3) No, saltear.
```

#### Opción 1 y 2 — generar el SYSTEM_PROMPT.md

1. Tomar el template `references/templates/SYSTEM_PROMPT.md.template` y rellenarlo con datos reales del proyecto:
   - **Identidad**: pedir al usuario una descripción breve de la marca / proyecto / tono.
   - **Stack**: ya está en el state, llenar la tabla.
   - **Arquitectura**: árbol de carpetas final (`tree` o `find . -type d`).
   - **Paleta**: extraer de los archivos de tema (`tailwind.config`, `index.css`, `@theme`, variables CSS).
   - **Tipografía**: leer fonts cargadas (next/font, link a Google Fonts, etc.).
   - **Botones**: detectar componentes de botón y sus variantes.
   - **Secciones**: si es web, listar las secciones renderizadas (Hero, Services, etc.) con su decisión clave.
   - **Animaciones**: detectar uso de Framer Motion / GSAP / etc. y resumir reglas.
   - **SEO**: chequear `<title>`, `<meta description>`, `<html lang>`, `robots.txt`, sitemap. Marcar ✅ los presentes y ❌ los pendientes.
   - **Accesibilidad**: scan rápido por `aria-label`, `aria-hidden`, `label htmlFor`, contraste obvio. Marcar checklist.
   - **Performance**: leer build output si está disponible para bundle sizes. Listar optimizaciones aplicadas (lazy loading, preconnect).
   - **Gotchas**: pedir al usuario que dicte 3-5 cosas raras pero intencionales del proyecto. Si dice "no se me ocurre", Claude propone candidatos basados en el stack (ej. para Tailwind v4 sugerir el gotcha de `bg-[--color-x]`).
   - **Match criteria**: inferir 3-5 keywords de la descripción del proyecto para usar en pattern matching futuro.

2. Escribir el archivo en `<project-root>/SYSTEM_PROMPT.md`.

3. Mostrar al usuario el resumen de lo generado y preguntar si quiere editar algo antes de guardarlo definitivamente.

#### Opción 2 adicional — guardarlo también como project-pattern reusable

Si el usuario eligió opción 2 (también guardar como pattern):

1. Pedir un **nombre / ID corto** para el pattern (slug en kebab-case). Ejemplo: `petshop-landing-react-tailwind`, `dashboard-saas-nextjs`, `api-fastify-prisma`.

2. Copiar el `SYSTEM_PROMPT.md` recién generado a:
   ```
   ~/.claude/skills/new-project/references/project-patterns/<slug>.md
   ```

3. Agregar entrada al `project-patterns/README.md` (índice) con:
   - Nombre del patrón
   - Descripción 1-línea
   - Match criteria detectadas (las mismas keywords del SYSTEM_PROMPT)
   - Origen: `user-generated`, fecha, nombre del proyecto fuente

4. Confirmar: *"Listo. La próxima vez que tu descripción matchee con estas keywords, te voy a ofrecer este patrón en P1.5."*

#### Comportamiento en futuros proyectos

Cuando en una próxima ejecución de `/new-project` el P1.5 pattern-matching evalúe, va a considerar **TODOS** los patterns: tanto los que vienen con la skill (`cinematic-product-landing`) como los **user-generated** que se acumularon.

Si el usuario describe algo vagamente ("hace una landing para una marca de gatos") y hay 0 patterns con match 2+ → ofrecer el último user-generated como **default sugerido**, con el caveat *"este es el último que generaste, ¿lo usamos de base o arrancamos genérico?"*.

### Cierre

#### 1) Appendear al activity log

```json
{"date":"YYYY-MM-DD","skill":"new-project","name":"<nombre>","type":"<tipo>","stack":{...},"architecture":"<arq>","path":"<absolute path>"}
```

#### 2) Actualizar `profile.md` (auto-update orgánico)

**Para CADA tecnología del stack final del proyecto** (frontend, backend, estilos, UI primitives, animación, state, data fetching, forms, auth, ORM, testing, etc., incluyendo los items "Extra" agregados en P3 opción 3 y los comandos libres de P3 opción 4):

1. **Detectar la categoría correcta** del profile.md según el tipo de herramienta:

   | Tecnología | Sección de profile.md |
   |---|---|
   | React, Vue, Svelte, Angular, Astro, Next, Nuxt, vanilla | Frontend (frameworks / libs base) |
   | Express, NestJS, Fastify, FastAPI, Django, etc. | Backend |
   | TypeScript, JavaScript, Python, Go, Rust | Lenguaje default |
   | Tailwind, Sass, CSS Modules, styled-components, Emotion | Estilos |
   | shadcn/ui, Radix, Headless UI, MUI, Chakra, Mantine, Ant Design | UI primitives |
   | Framer Motion, GSAP, Anime.js, Lottie, Auto-Animate | Animación / motion |
   | Zustand, Redux Toolkit, Jotai, Valtio, Context API, Pinia | State management |
   | TanStack Query, SWR, axios, ky, RTK Query | Data fetching / HTTP client |
   | React Hook Form, Formik, Zod, Yup, TanStack Form | Forms / validación |
   | Better Auth, NextAuth, Clerk, Lucia, Supabase Auth | Auth |
   | Prisma, Drizzle, Mongoose, TypeORM, Knex | ORM / DB clients |
   | Vitest, Jest, Playwright, Cypress, Testing Library | Testing |
   | Vercel, Netlify, Fly.io, Railway, AWS | Infra / Deploy |
   | otras (date-fns, lodash, lucide-react, etc.) | Otros / utilidades |

   Si la tecnología no encaja en ninguna categoría conocida → preguntar al usuario en qué sección guardarla, o crear sección nueva si no existe.

2. **Para cada tech**, chequear si YA está en su sección del perfil:
   - **Si ya está** → incrementar el contador y actualizar `último uso` a la fecha de hoy.
   - **Si NO está** → agregar como línea nueva: `- <nombre>: 1 proyecto, último uso YYYY-MM-DD`.

3. **Mostrar el diff al usuario antes de escribir** el `profile.md`:

   ```
   Actualizaciones al perfil:
     • Frontend          React: 12 → 13 proyectos
     • Estilos           Tailwind: 9 → 10 proyectos
     • UI primitives     shadcn/ui: + agregar (primera vez)
     • State management  Zustand: + agregar (primera vez)
     • Data fetching     TanStack Query: 2 → 3 proyectos
     • Forms             Zod: + agregar (primera vez)

   ¿Confirmás? (S/n)
   ```

4. Si el usuario confirma → escribir `profile.md`. Si rechaza → no escribir (solo se appendea al log).

5. **Actualizar también la fecha** `last_scan_date` en la sección Configuración si tiene sentido (solo si hubo cambios significativos, no para cada proyecto).

#### Notas

- **No tocar las secciones Configuración, Principios de código, ni Convenciones** salvo que el usuario lo pida explícitamente. Esas son del usuario.
- **No remover tecnologías del perfil** automáticamente — solo agregar e incrementar. La poda manual la hace el usuario.
- **Para proyectos creativos** (no código), actualizar las secciones "Stacks dominantes — Creativo" con la misma lógica (AI image gen, AI video gen, editor, etc.).
- Si el usuario eligió un **patrón** en P1.5 (ej. `cinematic-product-landing`), también registrar el `pattern_used` en la línea del activity-log.

## Scan inicial

El scan inicial se ejecuta como **Paso 0** del flujo (ver arriba). La estrategia completa — qué archivos buscar, cómo usar GitHub MCP / `gh` CLI / API pública, y la entrevista manual de fallback — está documentada en `references/scan-strategies.md`.

## Archivos de referencia

- `references/scan-strategies.md` — estrategias del Paso 0: scan local + cascada de GitHub + entrevista manual.
- `references/stacks-code.md` — mapa stack→comando para código.
- `references/stacks-creative.md` — tools y AI gen para video/motion/3D.
- `references/stacks-web-animation.md` — Three.js, R3F, GSAP, Lottie, Rive, etc.
- `references/architectures.md` — árboles de carpetas por tipo y tamaño.
- `references/project-patterns/` — templates opinados para casos específicos (cinematic-product-landing, etc.) + user-generated patterns acumulados al cerrar proyectos. Consultados en P1.5 para acelerar setups que matchean.
- `references/coding-principles.md` — SOLID, DRY, KISS, YAGNI, Clean Code, patrones (Repository, MVC, Factory) y reglas de estilo (no inline, early returns, etc.). Consultado en P4 (arquitectura) y P6 (generación de código).
- `references/templates/` — plantillas para archivos generados (`CLAUDE.md`, `README.md`, `TODO.md`, `BRIEF.md`, `prompts.md`, `STORYBOARD.md`, **`SYSTEM_PROMPT.md`** este último se genera en P8.5).
- `references/methodologies.md` — SDD, TDD, BDD: descripción, ejemplos de código, y cómo aplicar BDD en iteraciones futuras del proyecto.
- `references/ui-design-guidelines.md` — estilos visuales, paletas por tipo de producto, pares tipográficos, anti-patrones de diseño IA, y reglas de accesibilidad. Consultado en P4.5.
