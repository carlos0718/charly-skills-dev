---
name: ats-resume
description: Genera un resume optimizado para ATS (en inglés, español o ambos idiomas) adaptado a una oferta de trabajo específica. Soporta dos modos: CV con experiencia laboral (tailored, Harvard Career Services, 1 página) y CV sin experiencia / primer empleo (Perfil + Formación + Experiencias no laborales + Habilidades). Elimina red/yellow flags, reescribe bullets con métricas, inyecta keywords del JD, y produce un .docx listo para descargar. Usar cuando el usuario quiera adaptar su CV a una oferta, mejorar su resume, preparar su CV para el mercado de EE.UU., o diga "generar resume", "optimizar CV", "adaptar CV", "resume ATS", "tailored resume", "resume para esta oferta", "no tengo experiencia", "primer empleo", "nunca trabajé".
---

# /ats-resume — ATS Resume Generator

Genera un resume de 1 página en inglés, tailored a una Job Description específica, siguiendo las guías de Harvard Career Services y eliminando todos los red/yellow flags del mercado US.

---

## Inputs — pedir antes de empezar (OBLIGATORIO, en este orden)

### Pregunta 1 — ¿Modo de trabajo?

Preguntar primero, antes de pedir ningún documento:

> "¿Tenés un CV de referencia o es la primera vez que vas a armar el tuyo?
> - **Tengo un CV** — lo adjunto o pego como texto
> - **Es mi primer CV** — nunca trabajé formalmente o no tengo nada armado todavía"

- Si responde **"Tengo un CV"** → pedir también la Job Description → continuar con el flujo estándar (Paso 1 → Paso 1.5 → Paso 2 → Paso 3).
- Si responde **"Es mi primer CV"** → ir directamente al **Paso 1.6 — Modo primer empleo** (sin pedir CV ni exigir JD).

---

### Pregunta 2 — Idioma (siempre, en ambos modos)

**Nunca asumir inglés por default.** Una vez que sabemos el modo, preguntar:

> "¿En qué idioma querés el resume?
> - **Inglés** — recomendado para el mercado US y empresas internacionales
> - **Español** — si la oferta es para un mercado hispanohablante
> - **Ambos** — genero dos versiones, una en cada idioma
>
> Si no estás seguro, te recomiendo inglés para esta oferta."

**Guardar la preferencia de idioma** y aplicarla en todo el contenido generado: summary/perfil, bullets, headers de sección, títulos de roles, y nombre del archivo de salida (`resume_EN.docx`, `resume_ES.docx`, o ambos). Nunca cambiar de idioma a mitad del proceso sin confirmación del usuario.

---

### Pregunta 3 — Documentos (solo para flujo estándar)

Si el modo es **"Tengo un CV"** y el usuario no adjuntó los documentos todavía:

> "Para continuar necesito:
> 1. **Tu CV** — adjuntalo como PDF o DOCX, o pegalo como texto
> 2. **La Job Description** — pegala directo o adjuntala
>
> ¿Cuál tenés listo para empezar?"

No avanzar con el flujo estándar hasta tener ambos.

---

## Paso 1 — Parsear los documentos (solo flujo estándar)

> Este paso solo aplica si el usuario respondió **"Tengo un CV"** en la Pregunta 1.
> Si eligió **"Es mi primer CV"**, saltar directamente al Paso 1.6.

**Del CV extraer:**
- Datos de contacto: nombre, ciudad, email, LinkedIn, GitHub
- Experiencia laboral: título, empresa, ubicación, fechas, bullets actuales
- Educación: institución, título, campo, fechas
- Skills listados
- Proyectos (si hay): nombre, descripción, fecha
- Cursos / certificaciones

**Del JD extraer:**
- Job title
- Nombre de la empresa
- Skills requeridos (hard skills, herramientas, lenguajes)
- Skills deseados / nice-to-have
- Responsabilidades clave (son los targets de los bullets)
- Top 10–15 keywords ATS — las frases exactas que usa el JD

---

## Paso 1.5 — Fase de entrevista: enriquecer el CV antes de construir

Antes de diagnosticar o reescribir, analizar cada sección del CV en busca de contenido flojo. Si se detectan debilidades, hacer preguntas **de a una** para extraer más información del usuario.

### Qué detectar como "contenido flojo"

**En experiencia laboral:**
- Bullets sin ninguna métrica (sin %, $, nro de usuarios, tiempo, tamaño de equipo)
- Bullets con lenguaje vago: "helped with", "worked on", "was involved in", "participated in"
- Roles con solo 1–2 bullets cuando el período fue de 6+ meses
- Responsabilidades descritas pero sin resultado: "built X" sin "which resulted in Y"

**En proyectos:**
- Sin métricas de impacto (usuarios, descargas, visitas, ahorro de tiempo)
- Descripción solo técnica sin contexto de negocio

**En el summary:**
- Sin ningún número o logro concreto
- No menciona industria o dominio específico

### Cómo hacer las preguntas

1. **Avisarle al usuario primero:**
> "Antes de generar tu resume, detecté algunas secciones donde podría faltarle detalle — especialmente en la parte de experiencia. Voy a hacerte algunas preguntas rápidas para poder escribir bullets más fuertes. ¿Arrancamos?"

2. **Hacer una pregunta a la vez**, esperando la respuesta antes de pasar a la siguiente.

3. **Formato de pregunta:** Ser específico, mencionar el rol y el contexto exacto.

**Ejemplos de preguntas bien formuladas:**

Para bullet sin métrica:
> "En tu rol en [Empresa], mencionás que 'implemented responsive design' — ¿tenés alguna idea de cuánto mejoró el tiempo de carga, la tasa de rebote, o el engagement en mobile? Aunque sea un estimado está bien."

Para rol con poco detalle:
> "En [Empresa] estuviste [X meses] — ¿había algún proyecto específico del que te sentís más orgulloso o que tuvo mayor impacto? Por ejemplo, algo que redujera costos, ahorrara tiempo al equipo, o mejorara la experiencia del usuario."

Para proyecto sin contexto:
> "En el proyecto [Nombre], ¿cuántas personas lo usaban o cuántas visitas tenía? ¿Resolvía algún problema de negocio concreto?"

Para summary sin industria:
> "¿En qué tipo de industrias o clientes trabajaste más — ecommerce, fintech, salud, agencias creativas? Eso me ayuda a posicionarte mejor en el summary."

4. **Si el usuario no sabe o no tiene el dato:**
> "Sin problema — voy a escribirlo de la mejor manera posible con lo que tenemos. Pasamos a la siguiente."

5. **Continuar hasta cubrir los 3–5 puntos más débiles** (no más de 7 preguntas en total para no agotar al usuario).

6. **Al terminar la fase de entrevista**, resumir brevemente:
> "Perfecto, tengo todo lo que necesito. Ahora sí voy a generar tu resume tailored para [Empresa] — dame un momento."

### Guardar las respuestas
Incorporar cada respuesta como contexto adicional al construir los bullets del Paso 3. Las métricas y detalles que el usuario provea tienen prioridad sobre cualquier estimado o inferencia.

---

## Paso 1.6 — Modo primer empleo / sin experiencia laboral

> Entrar acá cuando el usuario respondió **"Es mi primer CV"** en la Pregunta 1.

Este modo produce un CV diferente al estándar. No se aplica el Paso 2 (diagnóstico de red/yellow flags de experiencia), ni el estándar de "cada bullet necesita métricas", porque el usuario no tiene bullets de trabajo. En su lugar se sigue la estructura de CV sin experiencia.
Ver referencia completa en: `references/no-experience-guide.md`

### JD en modo primer empleo — opcional

La Job Description **no es obligatoria** en este modo. Preguntar:

> "¿Tenés en mente alguna oferta de trabajo puntual para la que quieras preparar el CV, o preferís armar uno genérico que puedas adaptar después?"

- **Si tiene JD** → parsear keywords y responsabilidades clave → inyectarlas en el Perfil Profesional y en la sección de Habilidades → personalizar el CV para esa oferta.
- **Si no tiene JD** → armar el CV basado en su formación y experiencias no laborales → hacer el Perfil Profesional orientado al área de interés que mencione → entregarlo como base adaptable.

---

### Fase de entrevista adaptada

Antes de construir, hacer preguntas de a una para extraer material:

1. **Avisar primero:**
> "Como es tu primera búsqueda laboral, vamos a construir tu CV desde lo que ya sabés hacer y lo que viviste, aunque no haya sido un empleo formal. Te voy a hacer algunas preguntas rápidas. ¿Arrancamos?"

2. **Preguntas guía (de a una, esperando respuesta):**

- "¿Estás estudiando o estudiaste algo relacionado con este puesto? Si sí, ¿en qué etapa estás?"
- "¿Participaste en algún proyecto universitario, escolar o personal que tenga que ver con esta área? Aunque sea pequeño."
- "¿Hiciste algún voluntariado, ayudaste en un negocio familiar, organizaste eventos, o cualquier actividad donde hayas demostrado responsabilidad?"
- "¿Tenés cursos, certificaciones o sabés usar herramientas digitales relevantes para este puesto (Excel, Photoshop, idiomas, etc.)?"
- "¿Quién podría dar una referencia tuya — un profesor, tutor, o alguien que conozca tu trabajo aunque no sea laboral?"

3. **Si el usuario no tiene nada en alguna categoría:** "Sin problema, lo dejamos en blanco o lo omitimos."

4. **Al terminar:** "Perfecto, con esto ya tenemos suficiente para armar un CV sólido. Dame un momento."

### Estructura del CV — primer empleo

```
[NOMBRE COMPLETO]
[Ciudad, País] | [email] | [LinkedIn si tiene] | [Portfolio/GitHub si aplica]

PERFIL PROFESIONAL (3–4 líneas)
  Quién sos + qué buscás + qué habilidades podés aportar desde el día 1.
  Incluir keywords relevantes del JD.

FORMACIÓN ACADÉMICA
  [Carrera/Título] — [Institución] (año inicio – año fin o "en curso")
  Logros académicos relevantes si los hay.

CURSOS Y CERTIFICACIONES (si tiene)
  [Curso/Certificación] — [Plataforma/Institución] (año)

EXPERIENCIAS (voluntariados, proyectos, trabajo informal, actividades escolares)
  [Nombre del proyecto/actividad] — [Contexto] (año)
  • Qué hacías + qué habilidad demostrabas
  → No exigir métricas, pero incluirlas si las hay

HABILIDADES
  [Técnicas]: herramientas, idiomas, software
  [Blandas — máximo 3–4, solo las demostrables]: comunicación, organización, etc.

REFERENCIAS (opcional)
  Disponibles a solicitud / listar si el usuario las provee
```

### Checklist ATS pre-generación — modo primer empleo

- [ ] El perfil profesional menciona keywords del JD
- [ ] Formación académica lista lo más reciente primero
- [ ] Experiencias no laborales tienen al menos 1 bullet descriptivo cada una
- [ ] No hay habilidades inventadas o no demostrables
- [ ] Sin pronombres personales (yo, mi, nosotros)
- [ ] Todo el texto en el idioma elegido (EN / ES / ambos)
- [ ] Cabe en 1 página

### Debrief — modo primer empleo

Después de presentar el .docx:
> "✅ CV de primer empleo listo para [Empresa]
> 📄 Secciones incluidas: [lista]
> 🔑 Keywords del JD incorporadas: [top 5]
>
> Tip: si en los próximos meses sumás algún curso o proyecto, actualizamos el CV y se va a ver aún más sólido. ¿Querés ajustar algo?"

---

## Paso 2 — Diagnosticar el CV

Verificar silenciosamente y registrar cada problema:

### Red Flags (corregir sin excepción)
- [ ] CV tiene más de 1 página → comprimir a 1 página
- [ ] CV no está en inglés → traducir todo
- [ ] Summary es genérico (contiene "apasionado", "team player", "results-driven", "I am", "me encanta") → reescribir
- [ ] Sección Skills lista más de 12 items, o incluye herramientas de IA (ChatGPT, Copilot) como skills técnicos → curar
- [ ] Nivel de inglés mencionado en cualquier parte (ej: "English B1", "Intermediate English") → eliminar
- [ ] Usa pronombres personales ("I", "we", "my") en los bullets → reemplazar con verbos de acción
- [ ] Summary escrito en primera persona → reescribir sin pronombres

### Yellow Flags (corregir)
- [ ] Summary no responde "¿Por qué [Empresa] debería contratarme para [Rol]?" → reescribir
- [ ] Bullets usan voz pasiva o lenguaje vago ("helped with", "worked on", "was responsible for") → reescribir con verbos fuertes + métricas
- [ ] Template usa columnas, tablas, text boxes o íconos → aplanar a single-column
- [ ] Sección Education lista más de 3 bootcamps/cursos como entradas separadas → consolidar
- [ ] Bullets del trabajo no reflejan keywords del JD → inyectar keywords naturalmente
- [ ] Fechas en formatos inconsistentes → estandarizar a `YYYY` o `Month YYYY`

---

## Paso 3 — Construir el resume sección por sección

### HEADER
```
[NOMBRE COMPLETO]
[Ciudad, País]  |  [linkedin.com/in/handle]  |  [github.com/handle]  |  [email@dominio.com]
```
Reglas:
- Nombre centrado, sin títulos (sin "Ing.", "Lic.", "Dr." salvo doctorado en investigación)
- Solo ciudad — sin dirección, sin código postal
- Sin teléfono con código de país que revele ubicación no-US (opcional si tiene número US)
- Sin foto, sin fecha de nacimiento, sin nacionalidad, sin estado civil

---

### SUMMARY (2–3 líneas)

Fórmula:
> `[Título del JD] with [X]+ years in [dominio/industria]. Expert in [Skill A] and [Skill B], with a track record of [logro concreto relevante al JD].`

**Ejemplo bueno:**
> "Backend Engineer with 6+ years in fintech and distributed systems. Expert in Go and Python microservices at scale (1,000+ QPS). Proven record of shipping features that drive measurable revenue — including a $1.5M/yr impact at Nutbank."

**Ejemplo malo (nunca escribir esto):**
> "I'm a passionate team player who excels in dynamic environments and loves solving complex problems."

Palabras/frases prohibidas: passionate, enthusiastic, team player, results-driven, dynamic, fast learner, I am, we, my, hard worker, detail-oriented, synergy, leverage (como verbo).

---

### EXPERIENCE
Orden cronológico inverso. Para cada rol:

**Línea de encabezado:**
```
[Título en negrita]                           [Ciudad, País — derecha]
[Empresa en cursiva]                          [Año inicio – Año fin — derecha]
```

**Bullets (3–5 por rol):**

Fórmula: `[Verbo de acción fuerte] [tarea específica + tecnología] [que resultó en] [resultado cuantificado]`

| ✅ Bueno | ❌ Malo |
|---|---|
| "Engineered microservices architecture scaling throughput from 100 to 1,000 QPS while reducing error rate from 1% to 0.01%" | "Worked on backend services with the team" |
| "Led 4-engineer team delivering onboarding feature that increased signup rate 15% (~$1.5M/yr revenue)" | "Was responsible for leading a team to build a feature" |
| "Shipped payment features serving 1M+ DAU on pipeline processing $5M+ daily volume" | "Developed features for financial applications" |

**Banco de verbos de acción (Harvard Career Services):**
- Liderazgo: Led, Directed, Spearheaded, Orchestrated, Oversaw, Coordinated
- Técnico: Designed, Engineered, Built, Optimized, Automated, Scaled, Refactored, Deployed
- Impacto: Increased, Reduced, Improved, Accelerated, Generated, Delivered, Drove
- Colaboración: Partnered, Collaborated, Liaised, Aligned
- Análisis: Diagnosed, Evaluated, Identified, Analyzed

**Regla de priorización:** Si un rol tiene 6+ bullets en el CV original, conservar solo los 3–5 que mejor matchean los requisitos del JD. Cortar el resto.

---

### SKILLS

Solo skills que aparecen en el JD o son directamente relevantes. Máximo 10–12 items.

**Formato:**
```
Languages: Go, Python, Java, SQL  |  Frameworks: React  |  Cloud: AWS  |  Tools: Git, Docker
```

Reglas:
- Usar la terminología exacta del JD (si el JD dice "Node.js", no poner "NodeJS")
- NO listar: soft skills (leadership, communication), herramientas de IA chat, herramientas básicas que todos conocen
- NO listar todas las tecnologías que alguna vez se usaron — solo las relevantes para este rol

---

### PROJECTS (incluir solo si es relevante para el JD)
```
[Nombre del Proyecto]                         [Año]
[1–2 líneas: qué hace + impacto medible]
```
Omitir si el proyecto no demuestra skills que el JD necesita.

---

### EDUCATION
```
[Universidad, País]                           [Año inicio – Año fin]
[Título], [Campo de estudio]
```

Si hay bootcamps/cursos:
- Máximo 2–3 más relevantes
- Consolidar en una sola línea: `Additional Training: [Curso 1], [Curso 2] — [Plataforma]`
- NO listar cada bootcamp como entrada completa de educación

---

## Paso 4 — Checklist ATS pre-generación

Verificar cada item antes de generar el archivo:

- [ ] Todo el documento cabe en **exactamente 1 página** — si no cabe, aplicar el algoritmo de compresión del Paso 5 antes de continuar. 2 páginas = rechazar y recomprimir.
- [ ] Todo el texto está en el **idioma elegido por el usuario** (inglés / español / ambos — NO mezclar sin haberlo pedido explícitamente)
- [ ] Cero pronombres personales (I/we/my/our en inglés — yo/mi/nosotros en español) en el cuerpo
- [ ] Sin tablas, columnas, text boxes ni elementos gráficos
- [ ] Headers de sección usan nombres ATS-estándar: SUMMARY, EXPERIENCE, SKILLS, PROJECTS, EDUCATION
- [ ] Los top-10 keywords del JD aparecen al menos una vez en el documento (de forma natural)
- [ ] Cada bullet de experiencia tiene al menos una métrica (%, $, nro de usuarios, QPS, tamaño del equipo, tiempo ahorrado)
- [ ] Fechas consistentes en todo el documento
- [ ] Sin mención del nivel de inglés
- [ ] Info de contacto en texto plano
- [ ] El archivo se guardará como .docx

Si algún item falla, corregirlo antes de continuar.

---

## Paso 5 — Generar el .docx

Usar el skill `docx` para producir el archivo Word con el siguiente formato (basado en el template Victor Vigon):

### Tipografía
- Nombre: 20pt, negrita, centrado — fuente: Garamond o Times New Roman
- Línea de contacto: 9.5pt, centrado, peso normal
- Headers de sección: 10.5pt, MAYÚSCULAS, negrita, alineado izquierda
- Línea horizontal fina bajo cada header de sección
- Texto del cuerpo: 10.5pt, alineado izquierda
- Bullets: • estándar, sangría colgante 0.2"

### Layout
- Tamaño de página: Letter (8.5" × 11")
- Márgenes: **0.4" arriba, 0.5" abajo, 0.55" izquierda/derecha**
- Una sola columna — SIN layouts multi-columna
- Interlineado: 1.0 (simple)

### Espaciado interno — valores exactos
| Elemento | Espacio ANTES | Espacio DESPUÉS |
|---|---|---|
| Nombre (header) | **0pt** | 1pt |
| Línea de contacto | 0pt | 6pt |
| Header de sección | 6pt | 2pt |
| Línea horizontal bajo header | 0pt | 3pt |
| Línea de rol (título + empresa) | 0pt | 1pt |
| Bullet de experiencia | 0pt | **2pt** |
| Último bullet de un rol | 0pt | 5pt |
| Línea de skills | 0pt | 2pt |
| Línea de educación | 0pt | 2pt |

> El nombre a 0pt de margen superior hace que el header quede pegado al borde de la hoja, ganando 2-3 líneas extra de espacio útil sin sacrificar legibilidad.

### Formato entrada de experiencia
```
[Título en negrita]                 [Ubicación en cursiva, derecha]
[Empresa en cursiva]                [Fechas, derecha]
• Bullet uno
• Bullet dos
```
Usar tabs o texto alineado a la derecha (no tablas) para posicionar ubicación/fechas.

### Algoritmo de compresión — 1 página ESTRICTA

**Antes de finalizar el documento**, estimar si el contenido cabe en 1 página con el layout definido. Si no cabe, aplicar las siguientes compresiones **en orden**, de menor a mayor impacto, hasta que entre:

| Paso | Acción | Impacto esperado |
|---|---|---|
| 1 | Reducir bullets del rol más antiguo de 4-5 a 2-3 | ~2-3 líneas |
| 2 | Reducir el summary de 3 líneas a 2 líneas | ~1 línea |
| 3 | Consolidar cursos/bootcamps en 1 sola línea | ~2-3 líneas |
| 4 | Eliminar sección PROJECTS si no es crítica para el JD | ~3-4 líneas |
| 5 | Reducir bullets del segundo rol más antiguo a 2 | ~1-2 líneas |
| 6 | Bajar font del cuerpo de 10.5pt a **10pt** | ~1-2 líneas |
| 7 | Reducir espacio después de bullets a 1pt | ~1 línea |
| 8 | Reducir márgenes laterales a 0.5" | ~1-2 caracteres por línea |

**Nunca:** bajar el font por debajo de 10pt (ilegible impreso), ni los márgenes laterales por debajo de 0.5" (riesgo de que ATS parser recorte el texto).

Después de aplicar compresiones, verificar que el contenido no quedó cortado semánticamente (un bullet que termina con "—" o una línea huérfana sola en segunda página).

Si después de aplicar todos los pasos el contenido sigue sin entrar → notificar al usuario:
> "Con el contenido actual y las compresiones aplicadas, el CV sigue siendo de 1 página y X líneas. Para ajustarlo perfecto necesito reducir un poco más — ¿querés que quite el rol de [empresa más antigua] o que acorte algún bullet específico?"

---

## Paso 6 — Entregar con debrief

Después de presentar el archivo .docx, mostrar este resumen:

```
✅ Red flags corregidos: [lista]
🟡 Yellow flags resueltos: [lista]
🔑 Keywords del JD inyectados: [top 5]
📄 Páginas: 1
```

Luego ofrecer:
> "¿Querés ajustar el tono del summary, cambiar algún bullet, o probar una agrupación diferente de skills? También puedo generarte la cover letter si la necesitás."

---

## Estándares de calidad
- Cada bullet debe tener un resultado concreto y medible — sin métrica = reescribir o eliminar
- El summary debe responder "¿Por qué [Empresa] debería contratarte para [Rol]?" — si es genérico = reescribir
- El resume debe leerse como escrito por un humano reflexivo, no por IA
- La lista de skills debe usar la terminología exacta del JD
- Output final: **1 página estricta** (el algoritmo de compresión del Paso 5 garantiza esto), layout single-column, formato .docx — nunca entregar un documento de 2 páginas

---

## Fuentes
- Harvard FAS Mignone Center for Career Success — "Create a Strong Resume": https://careerservices.fas.harvard.edu/resources/create-a-strong-resume/
- Template de referencia: Victor Vigon single-column clean resume
