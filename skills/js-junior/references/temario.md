# Temario Nivel Junior — JavaScript moderno y asincronía

**Perfil de entrada:** completó el nivel Trainee (o equivalente): domina variables, condicionales, bucles, funciones, arrays, objetos y DOM básico.
**Objetivo de salida:** escribir JS moderno (ES6+), construir apps que consumen APIs, persisten datos y manejan el DOM con solvencia.

| # | Módulo | Subtemas | Proyecto desafío sugerido |
|---|--------|----------|---------------------------|
| 01 | funciones-avanzadas | Arrow functions, expresiones vs declaraciones, hoisting, scope y closures, parámetros default y rest, callbacks | "Fábrica de saludos/contadores" con closures |
| 02 | metodos-de-array | `forEach`, `map`, `filter`, `find`/`findIndex`, `some/every`, `reduce`, `sort` (y por qué muta), `flat`/`flatMap`, encadenamiento | "Dashboard de ventas en consola": estadísticas sobre un array de órdenes |
| 03 | es6-objetos-modernos | Destructuring (objetos y arrays), spread/rest, shorthand properties, optional chaining `?.`, nullish `??`, `Object.assign`, `Object.freeze`, `Object.fromEntries` | "Normalizador de datos": limpiar y transformar datos sucios |
| 04 | dom-avanzado | `createElement` + `append` patterns, render de listas desde arrays de datos, `dataset`, delegación de eventos, fragmentos | "Galería de productos con filtros" |
| 05 | formularios-y-validacion | FormData, validación en JS, mensajes de error en el DOM, regex básico para validación, UX de errores | "Formulario de registro con validación en vivo" |
| 06 | json-y-localstorage | JSON.parse/stringify, localStorage/sessionStorage, serializar estado, patrones de guardar/cargar | "Lista de tareas v2 con persistencia" |
| 07 | asincronia-callbacks-promesas | Sincronía vs asincronía, `setTimeout/setInterval`, callbacks y callback hell, Promesas: `then/catch/finally`, `Promise.all` (intro) | "Simulador de pedidos de pizzería" con tiempos |
| 08 | fetch-y-apis | `fetch`, métodos HTTP, status codes, manejo de errores de red, render de datos de API en el DOM, loading states | "Buscador de clima" o "Galería de Pokémon" (API pública) |
| 09 | async-await | `async/await`, try/catch, funciones async en eventos, secuencial vs paralelo, refactor de `.then` a await | Refactor del proyecto 08 + "App de noticias" |
| 10 | manejo-de-errores | `throw`, `Error` y subclases, errores personalizados, dónde atrapar errores, errores en código async | "Validador robusto": librería de validación con errores propios |
| 11 | modulos-es | `import`/`export`, default vs named, organizar una app en módulos, `type="module"` | Refactor de un proyecto previo a módulos |

**Proyecto integrador del nivel:** "CRUD App completa" (p. ej. gestor de gastos o de películas): consume una API pública o simula una con datos locales, persiste en localStorage, formularios validados, render dinámico, código en módulos.

**Notas de progresión:**
- Clases, prototipos y patrones de diseño son de Semi-Senior; si un proyecto tienta a usar clases, usar factory functions con closures.
- A partir del módulo 02, preferir métodos de array sobre bucles `for` en las soluciones, explicando cuándo un `for` sigue siendo razonable.
- Desde el módulo 09, todo código async nuevo usa `async/await`; las promesas con `.then` quedan como conocimiento de lectura.
