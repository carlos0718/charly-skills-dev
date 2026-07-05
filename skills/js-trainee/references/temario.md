# Temario Nivel Trainee — Fundamentos de JavaScript

**Perfil de entrada:** persona sin experiencia previa en programación (o casi). Sabe usar la computadora y un navegador.
**Objetivo de salida:** escribir programas pequeños en JS, manipular el DOM de forma básica y construir mini-apps interactivas simples.
**Conocimiento asumido por módulo:** solo los módulos anteriores de esta lista.
**Alineado con:** la franja "Beginner" del JavaScript Roadmap de roadmap.sh (adaptada: lo que requiere asincronía queda en Junior).

| # | Módulo | Subtemas | Proyecto desafío sugerido |
|---|--------|----------|---------------------------|
| 01 | introduccion-js | Qué es JS, breve historia y versiones (ES5 → ES6+), dónde corre (navegador/Node), **instalación de Node.js** (ver sección "Setup del entorno"), la terminal: **rutas relativas vs absolutas** y cómo ejecutar archivos desde la carpeta del módulo (p. ej. `node ejemplos/01-hola.js`), **métodos de `console`**: `console.log`, `console.error`, `console.warn`, `console.info`, `console.table` (para arrays/objetos), `console.clear`, `console.assert` (mención breve) — explicar cuándo usar cada uno y cómo se ven diferente en la terminal/navegador, comentarios de línea (`//`) y bloque (`/* */`). **Sin HTML**: en este módulo todo es JS puro por terminal; el HTML aparece recién en el módulo 09 | "Mi presentación en consola": script corrido con `node` que imprime una presentación formateada usando al menos 3 tipos de console distintos |
| 02 | variables-y-tipos-de-datos | `let`, `const`, `var` como legado + hoisting básico, reglas de nombrado de variables, scopes (global/función/bloque, intro). **Tipos primitivos** (cada uno con ejemplo y uso): `string`, `number`, `boolean`, `undefined`, `null` (y su diferencia en detalle), `bigint` (mención), `symbol` (solo mención). **Sección aparte — tipos NO primitivos (de referencia)**, cada uno con ejemplo y uso: `object` (intro), array y function presentados como objetos (mención breve; se profundizan en los módulos 05-07). Cerrar con **tabla comparativa primitivos vs no primitivos** (valor vs referencia, mutabilidad, cómo se comparan, qué devuelve `typeof` — incluyendo la rareza `typeof null === "object"`) | "Ficha de personaje": variables que describen un personaje y se imprimen formateadas |
| 03 | operadores-y-condicionales | Operadores aritméticos, de asignación (incl. compuestos `+=`, `-=`), unarios, de string, comparación (`===` vs `==`, `Object.is` como mención), lógicos (`&&`, OR lógico `\|\|`, `!`), conversión vs coerción de tipos (implícita/explícita), `if/else if/else`, ternario, `switch` | "Calculadora de propinas" con reglas según monto |
| 04 | bucles | `while`, `do...while`, `for`, `for...of`, `break`/`continue`, bucles anidados (intro), patrones: acumulador, contador | "Tablas de multiplicar" + "Adivina el número" (con prompt) |
| 05 | funciones | Declaración, parámetros y argumentos, parámetros por defecto, `return`, scope básico (global/local), funciones que llaman funciones, recursión básica, arrow functions: solo sintaxis básica al final (sin `this`; se profundizan en Junior) | "Conversor de unidades" (temperatura, distancia, peso) |
| 06 | arrays | Crear, indexar, `length`, `push/pop/shift/unshift`, `slice` vs `splice`, `concat`, `join`, `reverse`, `at`, recorrer con `for` y `for...of`, `indexOf`/`lastIndexOf`, `includes`, arrays + funciones (`map/filter/reduce`, `find` y `sort` quedan para Junior) | "Lista de compras" en consola: agregar, quitar, listar |
| 07 | objetos | Literales, propiedades y métodos, notación punto vs corchetes, objetos anidados, arrays de objetos, `for...in` (con cuidado), `Object.keys/values/entries` (intro), operador `in`, `delete`, `hasOwnProperty`, objetos built-in (`Math`, `Date` básico), JSON como formato (solo concepto/lectura; su uso real es de Junior). Destructuring, spread y optional chaining quedan para Junior | "Agenda de contactos" en consola |
| 08 | strings | Métodos comunes (`toUpperCase`/`toLowerCase`, `slice`, `split`, `trim`, `replace`/`replaceAll`, `includes`, `indexOf`/`lastIndexOf`, `charAt`/`at`, `startsWith`/`endsWith`, `repeat`, `padStart`/`padEnd`, `concat`), template literals, recorrer strings, inmutabilidad de strings (por qué los métodos devuelven uno nuevo) | "Analizador de texto": contar palabras, vocales, invertir |
| 09 | intro-dom | Primer contacto con HTML: estructura mínima de una página y cómo enlazar un .js con `<script>` (aquí se enseña por primera vez; usar Live Server instalado en el módulo 01), qué es el DOM, reseña de los métodos clásicos de selección (`getElementById`, `getElementsByClassName`, `getElementsByTagName`: siguen usándose y aparecen en mucho código existente, pero son la forma antigua), los modernos `querySelector`/`querySelectorAll` y por qué este curso usa estos, `textContent` vs `innerHTML`, modificar estilos y clases (`classList`), crear/eliminar elementos básico | "Tarjeta de perfil editable" |
| 10 | eventos-basicos | `addEventListener`, click, input, submit (con `preventDefault`), leer valores de inputs, el objeto `event` (intro) | "Contador interactivo" + "Lista de tareas v1" (agregar y marcar) |
| 11 | debugging-y-buenas-practicas | Leer errores de consola, tipos de error comunes (SyntaxError, TypeError, ReferenceError), `console` más allá de log, naming, indentación | Sesión de "arreglar el código roto": 5 mini-programas con bugs |

**Proyecto integrador del nivel:** "To-Do List completa" — agregar, marcar como completada, eliminar, contador de pendientes. Solo conceptos de los módulos 01-11.

## Setup del entorno (obligatorio en el módulo 01)

La lección del módulo 01 debe incluir una sección "Prepara tu entorno" que guíe al estudiante a instalar Node.js paso a paso:

1. **Link de descarga:** https://nodejs.org/es — indicar descargar la versión **LTS** (recomendada para la mayoría).
2. **Instrucciones por sistema operativo:**
   - **Windows:** descargar el instalador `.msi`, ejecutarlo y avanzar con las opciones por defecto (Next → Next → Install).
   - **macOS:** descargar el instalador `.pkg` y seguir el asistente.
   - **Linux:** instalar desde el gestor de paquetes de la distribución o con `nvm`.
3. **Verificación:** abrir la terminal y ejecutar `node -v` y `npm -v`; deben mostrar números de versión.
4. **Primer script:** crear `hola.js` con un `console.log` y ejecutarlo con `node hola.js`.
5. Recomendar también **Visual Studio Code** (https://code.visualstudio.com) como editor.
6. **Extensiones de VS Code recomendadas** (instalar desde la pestaña Extensions):
   - **Live Server** — recarga la página automáticamente al guardar cambios; se empezará a usar en el módulo 09 cuando aparezca HTML.
   - **Markdown Preview Mermaid Support** — permite ver las lecciones .md con mejor formato y visualizar los diagramas Mermaid incluidos en las lecciones.
   - **Better Comments** (Aaron Bond) — colorea los comentarios según su tipo: `!` para alertas (rojo), `?` para preguntas (azul), `TODO` para pendientes (naranja), `*` para destacados (verde). Ayuda a leer y escribir código con comentarios más expresivos.
   - **Bracket Pair Colorization Toggler** (Dzhavat Ushev) — colorea cada par de llaves, corchetes y paréntesis con un color distinto para identificar fácilmente los bloques de código anidados.
7. **Rutas relativas y absolutas:** esta sección debe incluir:
   - Explicar que al abrir la terminal se está "parado" en una carpeta (se ve en el prompt), qué es una ruta absoluta vs relativa, y `cd` para moverse.
   - Un **diagrama Mermaid de árbol de carpetas** de un proyecto de ejemplo (algo como `mi-proyecto/` con subcarpetas `css/`, `js/`, `imagenes/` y un `index.html` en la raíz), para que el alumno entienda la estructura visualmente antes de ver las rutas.
   - **5 ejemplos numerados** de rutas, cada uno con su contexto ("estás parado en X, quieres llegar a Y"):
     1. Desde `mi-proyecto/` apuntar a `css/estilos.css` (subir a una subcarpeta)
     2. Desde `mi-proyecto/js/` apuntar a `../css/estilos.css` (salir de una carpeta y entrar a otra)
     3. Desde `mi-proyecto/js/` apuntar a `../../otro-proyecto/index.html` (subir dos niveles)
     4. Ruta absoluta equivalente al ejemplo 1 (mostrar la diferencia: `/Users/ana/Documentos/mi-proyecto/css/estilos.css` o `C:\Users\ana\Documentos\mi-proyecto\css\estilos.css`)
     5. Desde `mi-proyecto/` correr un script con Node: `node js/hola.js` (aplicación directa de lo aprendido)
   - Explicar por qué las rutas relativas son preferibles en proyectos: si mueves la carpeta, siguen funcionando.
   - Cerrar con la regla del curso: siempre correr los ejemplos desde la carpeta del módulo con `node ejemplos/NN-nombre.js`.

Los módulos siguientes pueden asumir que el estudiante ya tiene Node instalado; si un ejercicio se corre con `node`, basta recordar el comando.

**Notas de progresión:**
- Nada de `map/filter/reduce`, rest/spread, destructuring, `fetch`, `setTimeout` ni `try/catch` en este nivel — son de Junior (`try/catch` se enseña en el módulo de manejo de errores de Junior).
- Arrow functions: solo la sintaxis básica al final del módulo 05, sin `this` ni usos avanzados.
- Template literals recién desde el módulo 08 (strings); antes, concatenación con `+`.
- Los módulos 01-08 no usan HTML en absoluto: ni en lecciones, ni en ejemplos, ni en enunciados de proyectos — todo corre con `node` en la terminal. El HTML y `<script>` se presentan por primera vez en el módulo 09.
