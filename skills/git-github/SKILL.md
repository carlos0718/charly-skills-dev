---
name: git-github
description: "Genera material del skill Git y GitHub para el bootcamp de programación. Cubre instalación, configuración, comandos fundamentales (init, add, commit, log, status, push, pull, clone, branch, checkout, merge, stash, revert, reset) y flujos colaborativos (fork, pull request, code review, issues). Usar siempre que el usuario escriba git-github, mencione el skill Git o GitHub, pida lecciones sobre control de versiones, o pregunte sobre cualquiera de estos comandos o conceptos: git init, git add, git commit, git push, git pull, git clone, git branch, git merge, git stash, git revert, git reset, staging area, merge conflict, pull request, fork, GitHub Pages, Conventional Commits, gitignore, SSH keys. También usar cuando el alumno pregunte cómo colaborar en equipo con código, cómo subir su proyecto a GitHub, o cómo prepararse para una entrevista técnica que incluya Git."
---

# Git y GitHub — Material del skill

Genera material didáctico del skill Git y GitHub del bootcamp. El material es para estudiantes que ya saben algo de programación (idealmente JavaScript), pero que nunca usaron control de versiones: cada lección debe explicar el "por qué" antes del "cómo", mostrar el output real de cada comando, y preparar al alumno para trabajar en equipo como se hace en la industria.

## Paso 0: Preguntas iniciales (obligatorio)

Antes de generar, confirma con el usuario (usa AskUserQuestion si está disponible):

1. **Idioma del contenido** (p. ej., español, inglés, bilingüe). Los comandos y términos técnicos de Git van siempre en inglés; solo cambia el idioma de las explicaciones.
2. **Módulo**, si no lo especificó. Si pide todo el skill, confirma y genera módulo por módulo.
3. **Carpeta de destino**: pregunta dónde guardar el material. Si hay una carpeta del usuario conectada, propón guardar ahí (en `guia-git-github/NN-modulo/`). Si no hay ninguna conectada, ofrece conectar una (en Cowork, solicítala con `request_cowork_directory`) o usar la carpeta de salida por defecto.

Si el usuario ya dio esta información, no la vuelvas a preguntar.

## Paso 1: Ubicar el módulo en el temario

Lee `references/temario.md` antes de generar: define los 7 módulos del skill, sus subtemas, el proyecto desafío de cada uno y las notas de progresión.

**Regla fundamental:** el alumno solo conoce lo que ya se vio en módulos anteriores. No uses comandos avanzados antes de haberlos introducido. Los módulos 01-04 son secuenciales; respétalos.

Si el usuario pide un tema de otro skill del bootcamp (JS, HTML, CSS), indícale que corresponde a esa otra skill.

## Paso 2: Generar la estructura de archivos (un módulo por vez)

Todo el material vive en una carpeta raíz `guia-git-github/` dentro de la carpeta de destino elegida. **La generación es incremental:** genera solo el módulo pedido; cuando el alumno avise que terminó, genera el siguiente. No generes módulos por adelantado salvo pedido explícito.

Cada módulo es una subcarpeta:

```
<NN>-<tema>/                        p. ej. 04-branching-y-merging/
├── LECCION.md                      teoría + secuencias de comandos con output real
├── comandos/                       archivos .md con secuencias documentadas de terminal
│   └── NN-nombre.md                cada uno documenta una secuencia completa
├── practica/
│   ├── EJERCICIOS.md               enunciados + pistas y soluciones ocultas (spoiler)
│   └── starter/                    instrucciones para que el alumno cree el entorno de práctica
├── proyecto/
│   ├── PROYECTO.md                 enunciado del proyecto desafío
│   └── solucion/                   secuencia de referencia documentada
└── .vscode/
    └── settings.json               desactiva IA y autocompletado del editor
```

**Diferencia clave con las skills de JS:** en este skill no hay archivos `.js` a ejecutar. Los "ejemplos" son secuencias de comandos de terminal (bash/git) documentadas en archivos `.md` dentro de `comandos/`. Cada archivo muestra: el comando exacto, el output real que aparece en la terminal, y una explicación de qué significa cada línea del output.

**settings.json anti-IA:** copia `references/vscode-settings.json` tal cual a `.vscode/settings.json` dentro de cada módulo, y también a `.vscode/settings.json` en la raíz `guia-git-github/` la primera vez que la crees.

**Cómo crear carpetas:** no uses expansión de llaves (`mkdir carpeta/{a,b,c}`). Crea las carpetas implícitamente escribiendo cada archivo con su ruta completa, o con `mkdir -p` por carpeta. Antes de entregar, lista la estructura y verifica que no haya carpetas vacías ni nombres raros.

## Paso 3: Escribir la lección

Sigue `references/plantilla-leccion.md`. Claves para este skill:

- **"¿Por qué este módulo?" — apertura obligatoria**: cada lección empieza con `## 🌍 ¿Por qué este módulo?` — 2-3 líneas de contexto real: qué problema resuelve, qué catástrofe evita, cómo se usa en el trabajo diario. Sin ese contexto, Git parece burocracia sin sentido.

- **Responde siempre el "¿por qué?" a nivel de cada comando**: no basta con mostrar `git add .` — hay que explicar por qué existe el staging area, qué problema resuelve, cómo funcionaría el flujo sin él. Los alumnos que entienden el "por qué" recuerdan los comandos; los que solo los memorizan los olvidan al día siguiente.

- **Mostrar comandos con su output real**: cada comando en la lección va seguido del output exacto que aparece en la terminal. No hay nada más frustrante que ejecutar un comando y no saber si el resultado es correcto porque la lección no lo muestra.

  ```bash
  $ git status
  On branch main
  Changes to be committed:
    (use "git restore --staged <file>..." to unstage)
          new file:   index.html
  ```

- **Analogías**: Git es difícil de visualizar. Usá analogías consistentes a lo largo del material:
  - El **staging area** = un "borrador" o "mesa de preparación" antes de comprometerse
  - Un **commit** = una "foto instantánea" del proyecto en ese momento
  - Una **branch** = un "universo paralelo" donde experimentar sin romper el principal
  - El **repositorio remoto** = una "copia de seguridad en la nube compartida"
  - Un **merge** = "fusionar dos universos paralelos"
  Introducí la analogía la primera vez que aparece el concepto y referenciala brevemente después.

- **Errores comunes**: cada módulo incluye los errores más frecuentes con su mensaje real de error, la causa y la solución. Git tiene mensajes de error crípticos; anticiparlos vale oro:
  - "detached HEAD state"
  - "CONFLICT (content): Merge conflict in..."
  - "error: failed to push some refs" (cuando hay commits remotos que no tenemos)
  - "fatal: not a git repository"
  - "Please tell me who you are" (falta configuración user.email)

- **Diagramas Mermaid**: Git es inherentemente visual — usá diagramas para lo que no se puede explicar bien con texto:
  - `gitgraph` para mostrar el historial de commits y branches
  - `flowchart` para el ciclo de vida de un archivo (untracked → staged → committed)
  - `flowchart` para el flujo de trabajo en equipo (fork → branch → PR → merge)
  Usá diagramas donde aporten; no los fuerces donde no son necesarios.

- **"Preguntas de entrevista técnica" — cierre obligatorio**: cada lección cierra con 5 preguntas reales del tipo que se hacen en entrevistas técnicas sobre Git, con respuestas orientativas en `<details>`. Git es uno de los temas más frecuentes en entrevistas para desarrolladores junior — esta sección prepara al alumno directamente para ese contexto.

## Paso 4: Ejercicios y proyecto

**Ejercicios:** 4-6 por módulo, dificultad creciente (⭐ a ⭐⭐⭐). Los ejercicios de Git son secuencias de acciones en la terminal, no código a escribir: "crea un repo, agrega estos archivos, haz tres commits con estos mensajes...". Cada ejercicio incluye la secuencia de comandos esperada en la solución oculta.

**Proyecto desafío:** el que define el temario para el módulo. Debe simular una situación laboral real (no un ejercicio académico vacío). La carpeta `proyecto/solucion/` contiene la secuencia completa de comandos documentada, no código de aplicación.

## Paso 5: Verificación antes de entregar

1. Verifica que cada comando mostrado sea sintácticamente correcto.
2. Verifica que el output mostrado sea el output real que produce Git (no inventado).
3. Confirma que no aparecen comandos de módulos posteriores.
4. Los módulos 06+ pueden asumir que el alumno tiene Git instalado y configurado, y tiene cuenta de GitHub.

## Paso 6: Entrega

La forma de entrega depende de dónde se guardó:

- **Carpeta del usuario conectada:** escribe los archivos directamente ahí. Muestra la estructura generada con un árbol de carpetas.
- **Sin carpeta conectada (carpeta de salida por defecto):** comprime la carpeta del módulo en un único `.zip` (p. ej. `guia-git-github-02-fundamentos.zip`) y presenta SOLO ese zip. Nunca presentes archivos sueltos como entrega.

Cierra ofreciendo continuar con el siguiente módulo cuando el alumno termine el proyecto.
