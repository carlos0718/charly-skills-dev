---
name: js-trainee
description: "Genera material del nivel TRAINEE (principiantes absolutos) del bootcamp de JavaScript vanilla. Produce lecciones en Markdown con ejemplos guiados paso a paso, ejercicios con starter code y soluciones, y un proyecto desafío por tema. Usar siempre que el usuario escriba js-trainee, mencione el nivel trainee/inicial/principiantes del curso de JS, o pida lecciones, ejercicios o proyectos sobre temas fundamentales de JavaScript: variables, tipos, operadores, condicionales, bucles, funciones básicas, arrays, objetos, strings, DOM básico, eventos básicos o debugging para principiantes. Para temas de nivel Junior (ES6, fetch, async) o Semi-Senior (patrones, testing) usar la skill de ese nivel."
---

# JS Trainee — Material del nivel principiante

Genera material didáctico del nivel Trainee del bootcamp de JS vanilla. El material es para estudiantes **sin experiencia previa en programación**: cada lección debe poder seguirse de forma autónoma, con explicaciones detalladas, analogías cotidianas y la salida de cada ejemplo mostrada explícitamente.

## Paso 0: Preguntas iniciales (obligatorio)

Antes de generar, confirma con el usuario (usa AskUserQuestion si está disponible):

1. **Idioma del contenido** (p. ej., español, inglés, bilingüe). El código, nombres de variables y términos técnicos van siempre en inglés; solo cambia el idioma de las explicaciones.
2. **Tema/módulo**, si no lo especificó. Si pide todo el nivel, confirma y genera módulo por módulo.
3. **Carpeta de destino**: pregunta dónde guardar el material. Si hay una carpeta del usuario conectada, propón guardarlo ahí (en la carpeta raíz del nivel, p. ej. `guia-js-trainee/05-funciones/`). Si no hay ninguna conectada, ofrece conectar una (en Cowork, solicítala con la herramienta `request_cowork_directory`) o usar la carpeta de salida por defecto.

Si el usuario ya dio esta información, no la vuelvas a preguntar.

## Paso 1: Ubicar el tema en el temario

Lee `references/temario.md` antes de generar: define los 11 módulos del nivel, sus subtemas, el proyecto desafío de cada uno y las notas de progresión.

**Regla más importante:** el estudiante solo sabe lo que ya se le enseñó en módulos anteriores. En este nivel está vedado usar: arrow functions (solo sintaxis básica al final del módulo 05, sin `this`), `map/filter/reduce`, template literals antes del módulo 08, destructuring, rest/spread, `fetch`, `setTimeout`, `try/catch`, promesas y clases. Si dudas, usa la construcción más básica que resuelva el problema.

El módulo 01 debe incluir la sección "Prepara tu entorno" con la guía de instalación de Node.js (link, pasos por sistema operativo y verificación) tal como la define el temario.

Si el usuario pide un tema de otro nivel, dile que corresponde a la skill de ese nivel (`js-junior` o `js-semisenior`). Para el índice completo del curso, usa `references/panorama-curso.md`.

## Paso 2: Generar la estructura de archivos (un módulo por vez)

Todo el material del nivel vive en una carpeta raíz `guia-js-trainee/` dentro de la carpeta de destino elegida. **La generación es incremental:** la primera vez crea la carpeta raíz solo con el primer módulo pedido; cuando el usuario indique que el alumno terminó un módulo, genera el siguiente del temario. No generes módulos por adelantado salvo pedido explícito. Al final de cada lección, indica al alumno que su espacio de trabajo es la carpeta de ese módulo (los archivos de `practica/starter/` y `proyecto/starter/`) y que avise al terminar para recibir el siguiente módulo.

Cada módulo es una subcarpeta:

```
<NN>-<tema>/                      p. ej. 05-funciones/
├── LECCION.md                    teoría + ejemplos guiados
├── ejemplos/                     .js ejecutables comentados (+ index.html solo si usa DOM)
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

Numeración según el temario; carpetas en minúsculas sin acentos. Los módulos 01-08 corren en consola sin HTML.

**Cómo crear las carpetas:** no uses expansión de llaves (`mkdir carpeta/{a,b,c}`) — en algunos entornos no se expande y crea una carpeta basura literal llamada `{a,b`. Crea las carpetas implícitamente escribiendo cada archivo con su ruta completa (la herramienta de escritura crea las carpetas padre), o con un `mkdir -p` por carpeta. Antes de entregar, lista la estructura final y verifica que no haya carpetas vacías ni con nombres raros.

## Paso 3: Escribir la lección

Sigue `references/plantilla-leccion.md`. Claves para Trainee:

- **"¿Por qué este módulo?" — apertura obligatoria**: cada lección debe comenzar con la sección `## 🌍 ¿Por qué este módulo?` (ver plantilla). 2-3 líneas que respondan qué problema real resuelve, en qué tarea laboral concreta se usa, y cómo conecta con el módulo anterior. En el **módulo 01**: incluir además un diagrama Mermaid del stack completo del bootcamp (HTML → CSS → JS → React → Next.js/Node → C#/.NET → SQL → Deploy con Vercel) marcando "estás aquí", para que el alumno vea adónde va a llegar.
- **Responde siempre el "¿por qué?" a nivel de concepto**: cada tópico dentro de la lección debe responder por qué existe, por qué se hace así y no de otra forma, y qué problema resuelve (la plantilla tiene la sección `🤔 ¿Por qué?` obligatoria para esto). No alcanza con mostrar cómo se usa — el alumno necesita entender el mecanismo.
- **Ejemplos guiados paso a paso**: cada concepto se construye línea por línea, explicando qué hace y por qué, con la salida esperada mostrada.
- **Analogías cotidianas** para cada concepto nuevo.
- **Errores comunes** del tema (confundir `=` con `==`, olvidar `return`, etc.) — esto diferencia material de bootcamp de documentación.
- Sección "Pruébalo tú" tras cada ejemplo: una variación mínima para que el estudiante experimente.
- **Diagramas Mermaid**: incluye diagramas ` ```mermaid ``` ` en la lección siempre que un visual ayude a la comprensión. Úsalos para: árbol de carpetas del proyecto (módulo 01 — rutas), diagrama de flujo de condicionales o bucles (módulos 03-04), ciclo de vida de una variable/scope (módulo 02), estructura de un array u objeto (módulos 06-07), árbol del DOM (módulo 09). No los uses donde no aporten: la mitad de las lecciones no los necesitan.

## Paso 4: Ejercicios y proyecto

**Ejercicios:** 4-8 por módulo, dificultad creciente (⭐ a ⭐⭐⭐), cada uno con enunciado, ejemplo de entrada/salida, pista en `<details>` y archivo starter con TODOs. La solución comentada va al final de cada ejercicio dentro de EJERCICIOS.md, oculta en un bloque `<details>` (spoiler) para que el alumno la abra solo después de intentarlo; NO crees carpeta `practica/soluciones/`.

**Proyecto desafío:** el que sugiere el temario para el módulo. Enunciado con contexto breve, requisitos funcionales numerados, criterios de aceptación verificables y extras opcionales. El starter da la estructura para que el estudiante se concentre en el JS del tema.

## Paso 5: Verificación antes de entregar

1. Ejecuta cada ejemplo y solución con `node` (o verifica la lógica DOM manualmente). Las soluciones embebidas en EJERCICIOS.md: extráelas a archivos temporales para correrlas; nunca publiques una solución sin haberla ejecutado.
2. Confirma que ningún código usa conceptos vedados o de módulos posteriores.
3. Explicaciones en el idioma elegido; código e identificadores en inglés.

## Paso 6: Entrega

La forma de entrega depende de dónde se guardó:

- **Carpeta del usuario conectada:** escribe los archivos directamente ahí; el usuario ya los tiene, no necesita descargar nada. Muestra la estructura generada.
- **Sin carpeta conectada (carpeta de salida por defecto):** los archivos presentados se descargan de a uno y las carpetas no se pueden descargar. Por eso, comprime la carpeta del módulo en un único `.zip` (p. ej. `guia-js-trainee-01-introduccion-js.zip`) y presenta SOLO ese zip. Nunca presentes archivos sueltos del módulo como entrega: el usuario no podría descargar el resto.

Cierra ofreciendo continuar con el siguiente módulo cuando el alumno termine.
