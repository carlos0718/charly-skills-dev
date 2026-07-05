# Principios de código — referencia canónica

> Este archivo es la fuente de verdad para los principios y patrones de diseño que la skill `/new-project` aplica al generar código y al armar la arquitectura.
>
> El usuario puede activar/desactivar cada uno en su `~/.claude/profile.md` sección "Principios de código".
> Cada proyecto hereda esa configuración y la guarda en su `CLAUDE.md`.

## Cómo se usa este archivo

- **P4 (Sugiere arquitectura)**: la skill consulta los patrones activos y propone una arquitectura coherente con ellos. Ej. si Repository está activo y el proyecto tiene DB, las carpetas separan `domain/`, `application/`, `infrastructure/`.
- **P6 (Genera archivos base)**: cuando la skill genera código de scaffolding (componentes, configs, etc.), respeta las reglas de estilo activas. Ej. si "no estilos inline" está activo y el stack es React+Tailwind, los componentes ejemplo usan clases Tailwind, no `style={{}}`.
- **CLAUDE.md del proyecto**: hereda los principios para que futuras sesiones de Claude en ese proyecto los respeten también.

---

## Patrones de diseño

### SOLID (los 5 principios)

Conjunto base de principios para código mantenible orientado a objetos (y aplicable a otros paradigmas).

| Letra | Significado | Idea en 1 frase |
|---|---|---|
| **S** | Single Responsibility | Cada clase/módulo tiene una sola razón para cambiar. |
| **O** | Open/Closed | Abierto para extender, cerrado para modificar. |
| **L** | Liskov Substitution | Las subclases deben ser usables donde se usa la clase base sin romper nada. |
| **I** | Interface Segregation | Mejor varias interfaces específicas que una grande con métodos que no se usan. |
| **D** | Dependency Inversion | Dependé de abstracciones, no de implementaciones concretas. |

**Cuándo aplicarlo**: proyectos medianos a grandes. En un script de 50 líneas SOLID es overkill.

**Cómo lo aplica la skill**: si está activo y el proyecto es mediano+, la arquitectura sugerida en P4 separa interfaces de implementaciones (`domain/repositories/UserRepository.ts` como interface, `infrastructure/persistence/UserRepositoryPg.ts` como implementación).

### Repository

Separar el acceso a datos (DB, API, archivos) de la lógica de negocio. La lógica habla con una abstracción, no con la DB directamente.

**Cuándo**: cualquier proyecto con persistencia. Casi siempre vale la pena.

**Cómo lo aplica la skill**: crea `domain/repositories/<Entity>Repository.ts` (interface) + `infrastructure/persistence/<Entity>RepositoryImpl.ts` (implementación concreta). Los servicios reciben la interface, no la implementación.

### MVC / MVVM

Separación clásica: Model (datos), View (UI), Controller (orquesta) o ViewModel (estado de la vista).

**Cuándo**: apps con UI no triviales. Para una landing simple no aporta.

**Cómo lo aplica la skill**: en frameworks que lo nativamente esperan (Rails, Django, NestJS, Angular) lo respeta sin pensarlo. En React/Vue moderno, "MVC" se traduce a separar `components/` (V) de `services/` o `stores/` (M+C).

### Factory

Encapsular la creación de objetos cuando es condicional o compleja.

**Cuándo**: cuando hay 3+ tipos de un mismo objeto que se crean con lógica distinta (ej. crear distintos tipos de notificación: email, SMS, push).

**Cómo lo aplica la skill**: cuando el código generado tiene `if/switch` largo para crear objetos, lo refactoriza en una factory.

### Strategy

Encapsular algoritmos intercambiables detrás de una interface.

**Cuándo**: cuando varios algoritmos hacen "lo mismo" con implementación distinta (ej. distintos métodos de pago, distintos sistemas de descuento).

### Observer / Pub-Sub

Suscriptores reciben notificaciones de cambios sin acoplarse al emisor.

**Cuándo**: events, UI reactiva, integración entre módulos desacoplados.

**En frontend moderno**: ya viene gratis con Redux, Zustand, Pinia, Signals.

### Singleton

Una sola instancia de algo en toda la app.

**Cuándo**: rara vez. Es fácil de abusar y dificulta testing. Solo para casos como conexión a DB, logger global, configuración.

**Regla de la skill**: si está activo, advertir si se está usando "por costumbre" cuando podría inyectarse.

---

## Principios generales (siempre activos por default)

### DRY — Don't Repeat Yourself

No duplicar **conocimiento** (no necesariamente código). Si la misma regla de negocio aparece en 3 lugares, cualquier cambio requiere modificar los 3 — y vas a olvidarte de uno.

**Anti-patrón**: copy-paste de lógica entre archivos.
**Correcto**: extraer a función/módulo compartido.

**Cuándo NO aplicar**: la duplicación accidental no es real duplicación. Si dos funciones se parecen pero modelan cosas conceptualmente distintas, NO unirlas (acoplamiento prematuro).

### KISS — Keep It Simple, Stupid

La solución más simple que resuelve el problema gana. La complejidad es deuda.

**Aplicación práctica**:
- Preferir funciones planas sobre clases si no se necesita estado/herencia.
- Evitar abstracciones especulativas.
- Si una librería resuelve algo en 1 línea pero suma 5MB al bundle, evaluar si vale.

### YAGNI — You Aren't Gonna Need It

No programes para necesidades futuras hipotéticas. Programá para lo que se necesita HOY.

**Anti-patrón**: "vamos a hacerlo configurable por si en el futuro queremos cambiar X".
**Correcto**: hacelo hardcoded. Cuando el futuro llega (si llega), refactorizás.

**Cuándo NO aplicar**: cosas que son MUY caras de cambiar después (esquema de DB, contrato de API público, identidad visual de marca). Esas sí merecen pensarse de antemano.

### Clean Code (Bob Martin)

Conjunto de hábitos:

- **Nombres descriptivos**: `getUserByEmail(email)` > `getUser(e)` > `getU(e)`.
- **Funciones cortas**: si una función no entra en pantalla, probablemente hace demasiado.
- **Una función, una cosa**: dividir hasta que cada función haga UNA cosa.
- **Comentarios para el "por qué", no para el "qué"**: el qué se entiende del código bien nombrado.
- **No state global mutable**: dificulta el razonamiento.
- **Early returns** en vez de pirámides de `if`.

---

## Reglas de estilo de código

### NO usar estilos inline — regla base, siempre activa

> Esta regla NO es opt-in del perfil: aplica por default a **todo** proyecto con interfaz visual generado por `/new-project`, independientemente de lo que diga `profile.md`. Salvo correcciones puntuales muy menores (un margin específico de 3px, un color override en un caso edge).

**Orden de prioridad para resolver estilos:**

1. **Clases del framework/librería del stack elegido** — si el proyecto usa Tailwind, Bootstrap, Bulma, etc., usar esas clases.
2. **Sistema de estilos del framework** — CSS Modules, styled-components, Emotion, Sass si el stack los incluye.
3. **Archivo `.css` propio** — si el stack es HTML/CSS/JS vanilla o no tiene sistema de clases, crear un archivo `styles.css` (o uno por componente) y enlazarlo. Nunca dejar el estilo flotando inline porque "no hay framework".

**Anti-patrón en React/JSX**:
```jsx
<div style={{ display: 'flex', padding: '20px', backgroundColor: '#fff' }}>
```

**Correcto (Tailwind)**:
```jsx
<div className="flex p-5 bg-white">
```

**Correcto (CSS Modules / styled-components / Sass)**:
```jsx
<div className={styles.container}>
```

**Correcto (HTML/CSS/JS vanilla — sin framework)**:
```html
<!-- index.html -->
<link rel="stylesheet" href="styles.css">
<div class="card">...</div>
```
```css
/* styles.css */
.card {
  display: flex;
  padding: 20px;
  background-color: #fff;
}
```

**Por qué**:
- Los inline styles ignoran el sistema de tokens del proyecto (no respetan dark mode, no usan paleta).
- No se puede reutilizar.
- Mata el caché de CSS del navegador.
- Más pesados que clases.

**Excepción aceptable**: valores dinámicos calculados en runtime (ej. `style={{ width: progress + '%' }}` en una barra de progreso). Para esos casos sí, inline está bien.

### Etiquetas semánticas HTML — regla base, siempre activa (SEO + accesibilidad)

> Tampoco es opt-in: aplica a todo proyecto con HTML generado, sea React/Vue/Astro o HTML plano.

Priorizar etiquetas semánticas sobre `<div>` genérico cuando la semántica del contenido lo permite:

| Usar                | En vez de                          | Para                                  |
|---------------------|-------------------------------------|----------------------------------------|
| `<header>`          | `<div class="header">`              | Cabecera de página o sección          |
| `<nav>`              | `<div class="nav">`                 | Bloques de navegación / menús         |
| `<main>`             | `<div id="main">`                   | Contenido principal (uno por página)  |
| `<article>`          | `<div class="post">`                | Contenido autocontenido (post, card de producto) |
| `<section>`          | `<div class="section">`             | Agrupación temática de contenido      |
| `<aside>`            | `<div class="sidebar">`             | Contenido relacionado/secundario      |
| `<footer>`           | `<div class="footer">`              | Pie de página o sección               |
| `<figure>`+`<figcaption>` | `<div>` con `<img>` + `<span>` | Imágenes con leyenda                  |
| `<button>`           | `<div onClick>`                    | Cualquier elemento clickeable de acción |
| `<a href>`           | `<div onClick>` con navegación      | Cualquier elemento que navega         |

**Por qué importa para SEO:**
- Los motores de búsqueda usan la estructura semántica para entender jerarquía y relevancia del contenido (qué es navegación vs contenido principal vs relleno).
- `<h1>`–`<h6>` deben seguir orden jerárquico sin saltos (no pasar de `<h1>` a `<h3>` sin `<h2>`).
- Listas reales (`<ul>`/`<ol>`/`<li>`) en vez de `<div>` repetidos para contenido tipo lista.

**Por qué importa para accesibilidad:**
- Lectores de pantalla anuncian la estructura semántica (landmarks) — un usuario con screen reader puede saltar directo a `<nav>` o `<main>` con un atajo de teclado.
- `<div onClick>` no es focuseable ni anunciado como interactivo sin trabajo extra de ARIA — `<button>` y `<a>` lo traen gratis.

**Excepción aceptable**: `<div>` y `<span>` siguen siendo correctos para agrupar elementos puramente visuales sin significado semántico propio (un wrapper de flexbox, un ícono decorativo).

### Funciones < 30 líneas

Guideline, no regla dura. Si pasa de 30, preguntarse si está haciendo más de una cosa.

### Nombres > Comentarios

Si necesitás un comentario para explicar QUÉ hace el código, probablemente el nombre de la función/variable está mal elegido.

### Early returns

Salir temprano cuando hay condiciones inválidas, en vez de anidar.

```ts
// Anti-patrón
function process(user) {
  if (user) {
    if (user.active) {
      if (user.permissions.includes('read')) {
        // hacer cosas
      }
    }
  }
}

// Correcto
function process(user) {
  if (!user) return;
  if (!user.active) return;
  if (!user.permissions.includes('read')) return;
  // hacer cosas
}
```

### Magic numbers / strings → constantes nombradas

```ts
// Anti-patrón
if (user.age >= 18) { ... }

// Correcto
const LEGAL_AGE = 18;
if (user.age >= LEGAL_AGE) { ... }
```

### Imports ordenados

Por convención: externos → internos → relativos. Configurable con ESLint plugin `import/order` o Biome equivalente.

### Tipado siempre que se pueda

En TS, evitar `any`. Preferir tipos explícitos sobre `unknown` cuando se sabe la forma.

---

## Reglas específicas por tipo de proyecto

### Backend / API

- Validación de input en el borde (middleware o decorador), no esparcida en handlers.
- Manejo de errores centralizado (error middleware, no try/catch en cada handler).
- Logs estructurados (JSON), no `console.log` con strings.

### Frontend / React

- Componentes funcionales con hooks, no clases (salvo legacy).
- Estado local primero, global solo cuando hace falta cruzar componentes lejanos.
- Memoización (`useMemo`, `useCallback`) solo cuando hay problema medido de performance, no preventivamente.
- Props tipadas explícitamente.

### Scripts / CLI

- Argumentos parseados con librería (clap en Rust, yargs/commander en Node, click en Python), no slicing manual de `process.argv`.
- Mensajes de error útiles con código de salida distinto de 0.

---

## Cómo el usuario activa / desactiva

En `~/.claude/profile.md` sección "Principios de código", marcar los checkboxes. Default sugerido para perfiles que no especifican: SOLID, Repository, DRY, KISS, YAGNI, Clean Code, "no inline styles", "early returns", "tipado explícito" → todos activos.

Para proyectos individuales, el usuario puede sobrescribir en el `CLAUDE.md` del proyecto:

```markdown
## Principios aplicados a este proyecto
Heredados del perfil global, con esta excepción:
- KISS desactivado para este proyecto: necesito una arquitectura compleja porque es enterprise.
```

### Reglas base — no son opt-in

A diferencia de los principios de arriba (configurables por perfil), estas dos **siempre se aplican** en cualquier proyecto con interfaz visual, sin importar lo que diga `profile.md`:

- **NO usar estilos inline** (clases del framework → sistema de estilos del framework → archivo `.css` propio, en ese orden de prioridad)
- **Etiquetas semánticas HTML** (header/nav/main/article/section/aside/footer en vez de div genérico)

Si el usuario pide explícitamente desactivarlas para un proyecto puntual, se puede, pero hay que confirmarlo antes:
> "Por default este proyecto va a usar HTML semántico y cero estilos inline (regla base de la skill, no del perfil). ¿Querés que la desactive para este proyecto en particular?"
