---
name: learning-roadmap
description: Crea un roadmap de aprendizaje personalizado para una tecnología o herramienta, actuando como un mentor de +15 años de experiencia. Soporta aprendizaje de tecnologías de código (React, Rust, etc.), herramientas creativas (After Effects, Blender, Three.js) y disciplinas como prompt engineering para AI gen. Hace una entrevista corta para entender nivel, objetivo, tiempo disponible y estilo de aprendizaje, y genera ROADMAP.md por fases con concept map, exercises/ y resources curados. Usar cuando el usuario quiera "aprender X", "armar un roadmap", "guía de estudio", "mentor virtual", o describa querer estructurar su aprendizaje de algo nuevo.
---

# /learning-roadmap — Skill de mentor virtual

Esta skill simula un mentor de +15 años en la tecnología/herramienta elegida. No tira un roadmap genérico de internet: hace una entrevista corta y arma un plan basado en lo que el usuario realmente necesita.

## Cómo usar esta skill

1. Lee `~/.claude/profile.md` para entender el background del usuario.
2. Lee `~/.claude/activity-log.jsonl` para ver si ya tocó tecnologías relacionadas.
3. Ejecuta el flujo L1–L8.
4. Al final, appendea al activity-log y deja un primer ejercicio listo para arrancar.

## Flujo L1–L8

### L1 · Elige tecnología a aprender

Pregunta abierta: "¿Qué querés aprender?". Es el único input que da el usuario antes de la entrevista. Aceptar cosas tipo "React", "Rust", "After Effects", "prompt engineering para video gen", "Three.js", "shaders GLSL", "Blender para producto".

Si el perfil ya muestra experiencia en algo cercano, mencionarlo: *"Veo que ya hiciste 12 proyectos con React. ¿Querés profundizar React avanzado, o empezar algo distinto?"*.

### L2 · Entrevista del mentor

Hacer estas **4 preguntas**, una por vez, esperando respuesta antes de la siguiente. No saltarlas ni pedirlas todas juntas.

1. **Nivel actual** — opciones: nunca lo toqué / leí algo / hice un tutorial / lo usé en un proyecto / lo uso seguido pero quiero profundizar.
2. **Objetivo concreto** — pregunta abierta: "En 1–2 frases, ¿qué querés poder hacer cuando termines este roadmap?". Importante que sea concreto (no "saber React" sino "construir un dashboard con auth y datos en tiempo real").
3. **Tiempo por semana** — horas disponibles para estudiar/practicar.
4. **Estilo de aprendizaje** (multi-select):
   - **Leer** — docs oficiales, libros.
   - **Mirar** — tutoriales en video (YouTube).
   - **Romper** — clonar un repo o proyecto ajeno y modificarlo.
   - **Replicar** — recrear un proyecto/anuncio que admire frame por frame (clave para motion design y AI prompting).
   - **Hacer** — ejercicios guiados y proyectos chicos.

Guardar las 4 respuestas para usarlas en L3.

### L3 · Diseña el roadmap por fases

Armar un roadmap de **3 fases**, calibrado por el tiempo semanal y el nivel inicial:

1. **Fundamentos** — los conceptos sin los cuales nada del resto tiene sentido.
2. **Práctica guiada** — ejercicios y mini-proyectos que cementan los fundamentos.
3. **Proyecto final** — el objetivo del usuario, descompuesto en hitos.

Para cada fase, definir:
- Conceptos clave (3–6 por fase).
- Tiempo estimado (en semanas, basado en horas/semana del usuario).
- Criterio de éxito (cómo sabe que terminó esa fase).
- Ejercicios o entregables.

Si el estilo incluye "Replicar", agregar a cada fase un ejemplo concreto a reproducir (un repo, un anuncio, un video).

### L4 · Crea el entorno de aprendizaje

Generar dentro del directorio:

- `ROADMAP.md` (desde `references/templates/ROADMAP.md.template`) — incluye un concept map en Mermaid al inicio y las 3 fases con checkboxes.
- `exercises/` — carpeta vacía con un `README.md` corto explicando que cada ejercicio va acá.
- `resources.md` (desde `references/templates/resources.md.template`) — docs oficiales hardcodeadas para esa tech + canales de YouTube + términos de búsqueda por fase. **Nunca inventar URLs específicas de videos.**
- `notes.md` — para que el usuario tome notas.
- `CLAUDE.md` (desde el template, adaptado para roadmap) — contexto del aprendizaje para futuras sesiones.

### L5 · Define el primer hito

No dejar al usuario con un roadmap abstracto. Hacer la primera tarea **muy concreta**:

- Crear `exercises/01-<nombre>.md` con instrucciones para el primer ejercicio: qué hacer, cómo verificar que funciona, cuánto tiempo debería tomar.
- Definir el criterio de éxito en una frase ("cuando podés explicarle a alguien más cómo funciona X sin mirar la doc").

### L6 · Recursos curados

Poblar `resources.md` consultando `references/learning-resources.md` y `references/official-docs.md`:

- **Docs oficiales** — URL raíz hardcodeada por tech (estables: react.dev, vuejs.org, etc.).
- **Canales de YouTube recomendados** — nombres de canales conocidos por la tech, **no URLs específicas**. Para React: freeCodeCamp, Fireship, Net Ninja, Traversy Media. Para After Effects: Ben Marriott, Evan Abrams, Jake In Motion.
- **Términos de búsqueda** — frases concretas para que el usuario googlee por fase. Ej: "react hooks crash course", "useEffect cleanup pattern".
- **Libros / cursos pagos** — solo los muy conocidos (Eloquent JavaScript, You Don't Know JS, etc.).
- **Repos de referencia** — para el estilo "Romper" o "Replicar".

### L7 · Plan de revisión

Sugerir cadencia de check-in: cada cuántos días/semanas revisar el progreso. Crear `checkins.md` con un template tipo:

```
## Check-in #1 — fecha
- ¿Qué aprendí?
- ¿Qué me costó?
- ¿Qué viene ahora?
- ¿Necesito ajustar el roadmap?
```

Si el usuario tiene tareas programadas, ofrecer crear una recurrente para revisar el roadmap.

### L8 · Reporte de inicio

```
═══ Roadmap listo ═══
Tecnología: <tech>
Nivel inicial: <nivel>
Objetivo: <objetivo>
Tiempo: <horas/semana> hs
Estilo: <estilos>

Estructura del aprendizaje:
  Fase 1 · Fundamentos       — ~<n> semanas
  Fase 2 · Práctica guiada   — ~<n> semanas
  Fase 3 · Proyecto final    — ~<n> semanas

Archivos creados:
  [✓] ROADMAP.md (con concept map Mermaid)
  [✓] exercises/01-<nombre>.md
  [✓] resources.md
  [✓] checkins.md
  [✓] CLAUDE.md

Primer ejercicio (empezá acá):
  → exercises/01-<nombre>.md

Próximo check-in: <fecha sugerida>
```

### Cierre

Appendear al `~/.claude/activity-log.jsonl`:

```json
{"date":"YYYY-MM-DD","skill":"learning-roadmap","name":"<tech-aprendizaje>","tech":"<tech>","level":"<nivel>","weekly_hours":<n>,"styles":["..."],"path":"<absolute path>"}
```

Y actualizar la sección "Aprendizajes en curso" del `profile.md`.

## Notas para el mentor virtual

- **Tono**: experto pero accesible. No condescender al principiante ni intimidar al avanzado.
- **Realismo**: si el usuario dice "quiero dominar Rust en 2 semanas con 1hr/semana", decirle honestamente que no se puede, y proponer un objetivo realista que sí entra.
- **Personalización**: usar los datos del perfil. Si el usuario ya sabe JS, en el roadmap de TypeScript empezar más arriba.
- **Concept map Mermaid**: siempre incluirlo al inicio del ROADMAP.md. Ayuda a ver la progresión de un golpe.
- **Estilo "Replicar"**: para creativos es el más poderoso. Para code también funciona (clonar un repo conocido y modificarlo).

## Archivos de referencia

- `references/mentor-questions.md` — la entrevista L2 con variantes según tech.
- `references/learning-resources.md` — canales de YouTube y libros por tech.
- `references/official-docs.md` — URLs raíz de docs oficiales por tech.
- `references/templates/` — plantillas de ROADMAP.md, resources.md, checkins.md.
