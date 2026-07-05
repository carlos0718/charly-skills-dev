---
name: js-semisenior
description: "Genera material del nivel SEMI-SENIOR del bootcamp de JavaScript vanilla (patrones, arquitectura y profundidad). Produce lecciones en Markdown con ejemplos guiados, ejercicios con starter code y soluciones, y un proyecto desafío por tema. Usar siempre que el usuario escriba js-semisenior, mencione el nivel semi-senior/semisenior/avanzado del curso de JS, o pida lecciones, ejercicios o proyectos sobre: event loop, this, call/apply/bind, prototipos, clases, programación funcional, patrones de diseño (Observer, Factory, Singleton, Strategy), asincronía avanzada, AbortController, debounce, Web APIs (IntersectionObserver, History API), SPA vanilla, testing (Vitest/Jest), performance o tooling (npm, ESLint, Vite). Para fundamentos usar js-trainee; para ES6/fetch/async básico usar js-junior."
---

# JS Semi-Senior — Patrones, arquitectura y profundidad

Genera material didáctico del nivel Semi-Senior del bootcamp de JS vanilla. El estudiante **completó Trainee y Junior**: domina ES6+, async/await, fetch, módulos y DOM avanzado, y construyó al menos una CRUD app. El objetivo del nivel es **criterio, no solo sintaxis**: que entienda cómo funciona JS por dentro y cuándo aplicar cada herramienta.

## Paso 0: Preguntas iniciales (obligatorio)

Antes de generar, confirma con el usuario (usa AskUserQuestion si está disponible):

1. **Idioma del contenido** (p. ej., español, inglés, bilingüe). El código, nombres de variables y términos técnicos van siempre en inglés; solo cambia el idioma de las explicaciones.
2. **Tema/módulo**, si no lo especificó. Si pide todo el nivel, confirma y genera módulo por módulo.
3. **Carpeta de destino**: pregunta dónde guardar el material. Si hay una carpeta del usuario conectada, propón guardarlo ahí (en la carpeta raíz del nivel, p. ej. `guia-js-semisenior/05-patrones-de-diseno/`). Si no hay ninguna conectada, ofrece conectar una (en Cowork, solicítala con la herramienta `request_cowork_directory`) o usar la carpeta de salida por defecto.

Si el usuario ya dio esta información, no la vuelvas a preguntar.

## Paso 1: Ubicar el tema en el temario

Lee `references/temario.md` antes de generar: define los 11 módulos del nivel, sus subtemas, el proyecto desafío de cada uno y las notas de progresión.

Este nivel asume todo Junior, así que las soluciones pueden usar cualquier feature moderna de JS. Aun así respeta el orden interno del temario (p. ej., no uses patrones de diseño en el módulo 02 si se enseñan en el 05).

Si el usuario pide un tema de otro nivel, dile que corresponde a `js-trainee` o `js-junior`. Para el índice completo del curso, usa `references/panorama-curso.md`.

## Paso 2: Generar la estructura de archivos (un módulo por vez)

Todo el material del nivel vive en una carpeta raíz `guia-js-semisenior/` dentro de la carpeta de destino elegida. **La generación es incremental:** la primera vez crea la carpeta raíz solo con el primer módulo pedido; cuando el usuario indique que el alumno terminó un módulo, genera el siguiente del temario. No generes módulos por adelantado salvo pedido explícito. Al final de cada lección, indica al alumno que su espacio de trabajo es la carpeta de ese módulo (los archivos de `practica/starter/` y `proyecto/starter/`) y que avise al terminar para recibir el siguiente módulo.

Cada módulo es una subcarpeta:

```
<NN>-<tema>/                      p. ej. 05-patrones-de-diseno/
├── LECCION.md                    teoría + ejemplos guiados
├── ejemplos/                     .js ejecutables comentados (+ index.html si usa DOM)
├── practica/
│   ├── EJERCICIOS.md             enunciados + pista y solución ocultas (spoiler)
│   └── starter/                  archivos con TODOs
├── proyecto/
│   ├── PROYECTO.md               enunciado del proyecto desafío
│   ├── starter/                  esqueleto inicial
│   └── solucion/                 implementación de referencia
└── .vscode/
    └── settings.json             desactiva IA y autocompletado del editor
```

**settings.json anti-IA:** copia `references/vscode-settings.json` (tal cual, sin modificar) a `.vscode/settings.json` dentro de cada módulo, y también a `.vscode/settings.json` en la raíz `guia-js-*` la primera vez que la crees. Desactiva Copilot, el autocompletado IA de Cursor y las sugerencias automáticas del editor, para que el alumno escriba y razone cada línea sin ayudas. Funciona al abrir la carpeta en VS Code o Cursor.

Numeración según el temario; carpetas en minúsculas sin acentos.

**Cómo crear las carpetas:** no uses expansión de llaves (`mkdir carpeta/{a,b,c}`) — en algunos entornos no se expande y crea una carpeta basura literal llamada `{a,b`. Crea las carpetas implícitamente escribiendo cada archivo con su ruta completa (la herramienta de escritura crea las carpetas padre), o con un `mkdir -p` por carpeta. Antes de entregar, lista la estructura final y verifica que no haya carpetas vacías ni con nombres raros.

## Paso 3: Escribir la lección

Sigue `references/plantilla-leccion.md`. Claves para Semi-Senior:

- **"¿Por qué este módulo?" — apertura obligatoria**: cada lección comienza con la sección `## 🌍 ¿Por qué este módulo?` (ver plantilla). 2-3 líneas que responden qué problema real resuelve en el contexto de código profesional, qué tipo de decisión de arquitectura o debugging habilita, y cómo conecta con lo anterior. El alumno debe entender el criterio antes de ver el código.
- **Responde siempre el "¿por qué?" a nivel de concepto**: cada tópico tiene la sección `🤔 ¿Por qué?` obligatoria. En este nivel incluye también "cómo funciona por debajo" — motor, event loop, memoria — para que el alumno entienda el mecanismo, no solo el comportamiento observable.
- **Mayor densidad técnica**: cada módulo incluye al menos una sección "cómo funciona por debajo" o "trade-offs" — la diferencia entre un Junior y un Semi-Senior es saber cuándo y por qué, no solo cómo.
- **"Preguntas de entrevista técnica" — cierre obligatorio**: cada lección cierra con la sección `## 💼 Preguntas de entrevista técnica` (ver plantilla). 5 preguntas de nivel Semi-Senior/Senior: profundidad técnica, trade-offs, debugging/performance, arquitectura y código con comportamiento no obvio. Las respuestas orientativas van en `<details>` con el razonamiento completo, no solo el resultado.
- **Ejemplos guiados** que primero muestran el problema real y luego la solución — el estudiante debe entender qué dolor resuelve la técnica.
- **Anti-ejemplos**: en patrones de diseño y abstracciones, mostrar también cuándo aplicarlos es sobre-ingeniería.
- **Errores comunes** de nivel profesional (memory leaks por listeners, race conditions, this perdido en callbacks, tests frágiles).
- **Diagramas Mermaid**: incluye diagramas ` ```mermaid ``` ` en la lección siempre que un visual ayude a la comprensión. Úsalos para: event loop y call stack/task queue/microtask queue (módulo de event loop), cadena de prototipos (módulo de prototipos), relaciones entre patrones de diseño (Observer, Factory, etc.), flujo de un test (arrange/act/assert), ciclo de vida de un componente SPA. Son especialmente valiosos en este nivel para mostrar lo que ocurre "por debajo".

## Paso 4: Ejercicios y proyecto

**Ejercicios:** 4-8 por módulo, dificultad creciente (⭐ a ⭐⭐⭐), cada uno con enunciado, ejemplo de entrada/salida, pista en `<details>` y archivo starter con TODOs. La solución comentada va al final de cada ejercicio dentro de EJERCICIOS.md, oculta en un bloque `<details>` (spoiler) para que el alumno la abra solo después de intentarlo; NO crees carpeta `practica/soluciones/`.

**Proyecto desafío:** el que sugiere el temario para el módulo. Enunciado con contexto realista, requisitos funcionales numerados, criterios de aceptación verificables y extras opcionales. En módulos de testing/tooling, el proyecto puede partir de código existente provisto en el starter (auditar, testear, optimizar).

## Paso 5: Verificación antes de entregar

1. Ejecuta cada ejemplo y solución con `node` (los de orden de ejecución/event loop deben producir exactamente la salida que la lección predice); para DOM/navegador, revisa la lógica manualmente. Las soluciones embebidas en EJERCICIOS.md: extráelas a archivos temporales para correrlas; nunca publiques una solución sin haberla verificado.
2. Confirma coherencia con el orden del temario.
3. Explicaciones en el idioma elegido; código e identificadores en inglés.

## Paso 6: Entrega

La forma de entrega depende de dónde se guardó:

- **Carpeta del usuario conectada:** escribe los archivos directamente ahí; el usuario ya los tiene, no necesita descargar nada. Muestra la estructura generada.
- **Sin carpeta conectada (carpeta de salida por defecto):** los archivos presentados se descargan de a uno y las carpetas no se pueden descargar. Por eso, comprime la carpeta del módulo en un único `.zip` (p. ej. `guia-js-semisenior-05-patrones-de-diseno.zip`) y presenta SOLO ese zip. Nunca presentes archivos sueltos del módulo como entrega: el usuario no podría descargar el resto.

Cierra ofreciendo continuar con el siguiente módulo cuando el alumno termine.
