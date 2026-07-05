# Temario Nivel Semi-Senior — Patrones, arquitectura y profundidad

**Perfil de entrada:** completó el nivel Junior: domina ES6+, asincronía con async/await, fetch, módulos y DOM avanzado. Ha construido al menos una CRUD app.
**Objetivo de salida:** entender cómo funciona JS por dentro, aplicar patrones de diseño, estructurar apps vanilla escalables, testear y optimizar.

| # | Módulo | Subtemas | Proyecto desafío sugerido |
|---|--------|----------|---------------------------|
| 01 | el-motor-de-js | Event loop, call stack, task queue vs microtask queue, cómo se ejecutan promesas y timers, render y bloqueo del hilo | "Visualizador del event loop": predecir y verificar orden de ejecución de snippets |
| 02 | this-y-contexto | `this` en cada contexto, `call/apply/bind`, arrow functions y `this`, pérdida de contexto en callbacks/eventos | "Mini-librería de tracking de eventos" donde el contexto importa |
| 03 | prototipos-y-clases | Cadena de prototipos, `Object.create`, clases ES6 por dentro, herencia, campos privados `#`, getters/setters, static | "Sistema de figuras/empleados" con jerarquía y polimorfismo |
| 04 | programacion-funcional | Funciones puras, inmutabilidad, composición, currying, higher-order functions, side effects controlados | "Pipeline de procesamiento de datos" componible |
| 05 | patrones-de-diseno | Module, Factory, Singleton, Observer/PubSub, Strategy — cuándo usar cada uno en vanilla JS y cuándo no | "Sistema de notificaciones" con Observer + Strategy |
| 06 | asincronia-avanzada | `Promise.all/allSettled/race/any`, concurrencia controlada, AbortController, debounce/throttle, reintentos con backoff | "Buscador con autocomplete": debounce + cancelación de requests |
| 07 | web-apis-modernas | IntersectionObserver, MutationObserver, History API, Web Storage vs IndexedDB (panorama), Custom Events | "Feed con scroll infinito y lazy loading" |
| 08 | spa-vanilla | Routing con History API, render por componentes (funciones), estado centralizado, separación de capas (estado/vista/servicios) | "SPA multi-vista sin framework" (p. ej. mini e-commerce) |
| 09 | testing | Por qué testear, Vitest/Jest básico, AAA pattern, testear funciones puras, mocks de fetch, TDD (intro práctica) | Testear la librería de validación del nivel Junior |
| 10 | performance-y-optimizacion | Reflow/repaint, minimizar manipulación del DOM, memory leaks comunes (listeners, closures), DevTools Performance, lazy loading | Auditar y optimizar una app lenta provista |
| 11 | tooling-y-calidad | npm scripts, ESLint + Prettier, Vite (básico), estructura de proyecto profesional, JSDoc, git hooks (mención) | Montar el entorno profesional para el proyecto final |

**Proyecto integrador del nivel:** "Aplicación SPA completa de nivel profesional" (p. ej. kanban, tracker de hábitos o e-commerce): routing, estado centralizado con Observer, componentes, servicios con AbortController, tests de la lógica core, ESLint, y README profesional.

**Notas de progresión:**
- Este nivel asume todo Junior; las soluciones pueden usar cualquier feature moderna de JS.
- En cada módulo, incluir al menos una sección "cómo funciona por debajo" o "trade-offs" — el objetivo del nivel es criterio, no solo sintaxis.
- En patrones (05), mostrar también el anti-ejemplo: cuándo el patrón es sobre-ingeniería.
