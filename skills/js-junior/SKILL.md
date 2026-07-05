---
name: js-junior
description: "Genera material del nivel JUNIOR del bootcamp de JavaScript vanilla (JS moderno y asincronía). Produce lecciones en Markdown con ejemplos guiados, ejercicios con starter code y soluciones, y un proyecto desafío por tema. Usar siempre que el usuario escriba js-junior, mencione el nivel junior del curso de JS, o pida lecciones, ejercicios o proyectos sobre: arrow functions, closures, map/filter/reduce, destructuring, spread, ES6, DOM avanzado, formularios y validación, JSON, localStorage, callbacks, promesas, fetch, APIs, async/await, manejo de errores o módulos ES. Para fundamentos de principiante usar js-trainee; para patrones, testing o arquitectura usar js-semisenior."
---

# JS Junior — Material de JavaScript moderno y asincronía

Genera material didáctico del nivel Junior del bootcamp de JS vanilla. El estudiante **completó el nivel Trainee**: domina variables, condicionales, bucles, funciones, arrays, objetos y DOM básico. El material puede asumir todo eso, pero nada más.

## Paso 0: Preguntas iniciales (obligatorio)

Antes de generar, confirma con el usuario (usa AskUserQuestion si está disponible):

1. **Idioma del contenido** (p. ej., español, inglés, bilingüe). El código, nombres de variables y términos técnicos van siempre en inglés; solo cambia el idioma de las explicaciones.
2. **Tema/módulo**, si no lo especificó. Si pide todo el nivel, confirma y genera módulo por módulo.
3. **Carpeta de destino**: pregunta dónde guardar el material. Si hay una carpeta del usuario conectada, propón guardarlo ahí (en la carpeta raíz del nivel, p. ej. `guia-js-junior/08-fetch-y-apis/`). Si no hay ninguna conectada, ofrece conectar una (en Cowork, solicítala con la herramienta `request_cowork_directory`) o usar la carpeta de salida por defecto.

Si el usuario ya dio esta información, no la vuelvas a preguntar.

## Paso 1: Ubicar el tema en el temario

Lee `references/temario.md` antes de generar: define los 11 módulos del nivel, sus subtemas, el proyecto desafío de cada uno y las notas de progresión.

**Regla más importante:** respeta el orden del temario. En particular: `async/await` se enseña recién en el módulo 09 — todo material de los módulos 07-08 usa `.then/.catch`; desde el 09, el código async nuevo usa `async/await`. Clases, prototipos y patrones de diseño son de Semi-Senior: si un proyecto lo tienta, usa factory functions con closures. Desde el módulo 02, prefiere métodos de array sobre bucles `for` en las soluciones, explicando cuándo un `for` sigue siendo razonable.

Si el usuario pide un tema de otro nivel, dile que corresponde a `js-trainee` o `js-semisenior`. Para el índice completo del curso, usa `references/panorama-curso.md`.

## Paso 2: Generar la estructura de archivos (un módulo por vez)

Todo el material del nivel vive en una carpeta raíz `guia-js-junior/` dentro de la carpeta de destino elegida. **La generación es incremental:** la primera vez crea la carpeta raíz solo con el primer módulo pedido; cuando el usuario indique que el alumno terminó un módulo, genera el siguiente del temario. No generes módulos por adelantado salvo pedido explícito. Al final de cada lección, indica al alumno que su espacio de trabajo es la carpeta de ese módulo (los archivos de `practica/starter/` y `proyecto/starter/`) y que avise al terminar para recibir el siguiente módulo.

Cada módulo es una subcarpeta:

```
<NN>-<tema>/                      p. ej. 08-fetch-y-apis/
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

Numeración según el temario; carpetas en minúsculas sin acentos. Para módulos con APIs, usa APIs públicas sin API key (PokeAPI, JSONPlaceholder, Dog CEO, Open-Meteo).

**Cómo crear las carpetas:** no uses expansión de llaves (`mkdir carpeta/{a,b,c}`) — en algunos entornos no se expande y crea una carpeta basura literal llamada `{a,b`. Crea las carpetas implícitamente escribiendo cada archivo con su ruta completa (la herramienta de escritura crea las carpetas padre), o con un `mkdir -p` por carpeta. Antes de entregar, lista la estructura final y verifica que no haya carpetas vacías ni con nombres raros.

## Paso 3: Escribir la lección

Sigue `references/plantilla-leccion.md`. Claves para Junior:

- **"¿Por qué este módulo?" — apertura obligatoria**: cada lección comienza con la sección `## 🌍 ¿Por qué este módulo?` (ver plantilla). 2-3 líneas que responden qué problema real resuelve, en qué tarea laboral concreta se usa, y cómo conecta con el módulo anterior. El alumno debe entender el contexto antes de la primera línea de código.
- **Responde siempre el "¿por qué?" a nivel de concepto**: cada tópico dentro de la lección tiene la sección `🤔 ¿Por qué?` obligatoria. No alcanza con mostrar cómo se usa — el alumno necesita entender el mecanismo y el razonamiento de diseño.
- **Ejemplos guiados paso a paso** con la salida esperada mostrada; explica el porqué, no solo el cómo.
- **Conectar con lo que ya sabe**: mostrar el "antes" (cómo lo haría con herramientas Trainee) y el "después" (la herramienta nueva), p. ej. bucle `for` → `map`.
- **"Preguntas de entrevista técnica" — cierre obligatorio**: cada lección cierra con la sección `## 💼 Preguntas de entrevista técnica` (ver plantilla). 5 preguntas del tipo real que se hace en entrevistas para puestos Junior: conceptual, diferencia, código/snippet, aplicación y gotcha. Las respuestas orientativas van ocultas en `<details>`. El alumno las practica antes de ver la solución.
- **Errores comunes** del tema (olvidar `return` en `.then`, no chequear `response.ok`, mutar el array original, etc.).
- En código con DOM y red: estados de carga y de error visibles para el usuario, siempre.
- **Diagramas Mermaid**: incluye diagramas ` ```mermaid ``` ` en la lección siempre que un visual ayude a la comprensión. Úsalos para: cadena de `.then/.catch` vs `async/await` (módulos 08-09), flujo de una petición fetch (request → response → parse → render), ciclo de vida de una Promesa (pending/fulfilled/rejected), diagrama de scope de closures, flujo de `map/filter/reduce` encadenados (módulo 02). No los fuerces donde no aporten.

## Paso 4: Ejercicios y proyecto

**Ejercicios:** 4-8 por módulo, dificultad creciente (⭐ a ⭐⭐⭐), cada uno con enunciado, ejemplo de entrada/salida, pista en `<details>` y archivo starter con TODOs. La solución comentada va al final de cada ejercicio dentro de EJERCICIOS.md, oculta en un bloque `<details>` (spoiler) para que el alumno la abra solo después de intentarlo; NO crees carpeta `practica/soluciones/`.

**Proyecto desafío:** el que sugiere el temario para el módulo. Enunciado con contexto breve, requisitos funcionales numerados, criterios de aceptación verificables y extras opcionales. El starter da el HTML/estructura para que el estudiante se concentre en el JS del tema.

## Paso 5: Verificación antes de entregar

1. Ejecuta cada ejemplo y solución con `node` (para código de red sin acceso a internet, valida con `node --check` y revisión de lógica; para DOM, revisa la lógica manualmente). Las soluciones embebidas en EJERCICIOS.md: extráelas a archivos temporales para correrlas; nunca publiques una solución sin haberla verificado.
2. Confirma que ningún código usa conceptos de módulos posteriores ni de Semi-Senior.
3. Explicaciones en el idioma elegido; código e identificadores en inglés.

## Paso 6: Entrega

La forma de entrega depende de dónde se guardó:

- **Carpeta del usuario conectada:** escribe los archivos directamente ahí; el usuario ya los tiene, no necesita descargar nada. Muestra la estructura generada.
- **Sin carpeta conectada (carpeta de salida por defecto):** los archivos presentados se descargan de a uno y las carpetas no se pueden descargar. Por eso, comprime la carpeta del módulo en un único `.zip` (p. ej. `guia-js-junior-08-fetch-y-apis.zip`) y presenta SOLO ese zip. Nunca presentes archivos sueltos del módulo como entrega: el usuario no podría descargar el resto.

Cierra ofreciendo continuar con el siguiente módulo cuando el alumno termine.
