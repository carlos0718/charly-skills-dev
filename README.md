# charly-skills-dev

> Pack de **skills personalizadas para Claude Code** que arman proyectos desde cero y guías de aprendizaje, todo basado en tu perfil técnico real.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E=18-brightgreen)]()
[![Skills](https://img.shields.io/badge/skills-2-blue)]()

## Qué hace

Trae dos slash-commands para Claude Code:

- **`/new-project`** — Scaffolding completo de proyectos (código, creativo o híbrido). Detecta tu workspace, sugiere stack según tus proyectos previos, aplica principios de código, gitflow con commits atómicos, genera SYSTEM_PROMPT.md reusable.
- **`/learning-roadmap`** — Mentor virtual que arma roadmaps personalizados para aprender una tech (frontend, backend, AI, motion design, lo que sea), con entrevista de 4 preguntas y ejercicios por fase.

Todo persistente: tu perfil va creciendo a medida que arrancás proyectos, y la skill aprende de cada uno.

## Instalación (una sola línea)

### Linux / macOS

```bash
curl -fsSL https://raw.githubusercontent.com/carlos0718/charly-skills-dev/main/install.sh | bash
```

### Windows (PowerShell)

```powershell
iwr -useb https://raw.githubusercontent.com/carlos0718/charly-skills-dev/main/install.ps1 | iex
```

Eso es todo. Los scripts:

1. Verifican que tengas `git` y `node 18+` instalados.
2. Clonan el repo a `~/.charly-skills-dev` (o lo actualizan si ya existe).
3. Corren el installer interactivo que te pregunta dónde guardar las skills (default: `~/.claude/skills/`).
4. Inicializan tu `profile.md` y `activity-log.jsonl` si no existen.

Después, abrí Claude Code y tirá `/new-project` o `/learning-roadmap`.

### Modo developer (para contribuir o iterar las skills)

Si vas a editar las skills, usá symlinks así los cambios se reflejan al instante en Claude Code sin reinstalar:

```bash
# Linux/macOS
curl -fsSL https://raw.githubusercontent.com/carlos0718/charly-skills-dev/main/install.sh | bash -s -- --symlink

# Windows
$env:CHARLY_SKILLS_SYMLINK="1"; iwr -useb https://raw.githubusercontent.com/carlos0718/charly-skills-dev/main/install.ps1 | iex
```

## Estructura

```
charly-skills-dev/
├── package.json
├── LICENSE                       ← MIT
├── README.md
├── install.sh                    ← script de install remoto Linux/macOS
├── install.ps1                   ← script de install remoto Windows
├── install.bat                   ← installer local Windows (doble-click)
├── install.command               ← installer local macOS (doble-click)
├── uninstall.bat / .command
├── bin/
│   ├── install.js                ← CLI installer principal
│   └── uninstall.js
└── skills/
    ├── new-project/              ← skill principal
    │   ├── SKILL.md
    │   └── references/
    │       ├── stacks-code.md
    │       ├── stacks-creative.md
    │       ├── stacks-web-animation.md
    │       ├── architectures.md
    │       ├── coding-principles.md
    │       ├── gitflow.md
    │       ├── official-docs.md
    │       ├── scan-strategies.md
    │       ├── project-patterns/
    │       └── templates/
    ├── learning-roadmap/         ← skill mentor
    │   └── (estructura similar)
    ├── shared/
    │   ├── profile.md.template
    │   └── activity-log.jsonl.example
    └── _helpers/
        └── choose.js             ← arrow-menu helper (opcional)
```

## Requisitos

| Tool    | Versión    | Cómo instalar                                                                                                               |
| ------- | ---------- | --------------------------------------------------------------------------------------------------------------------------- |
| Node.js | 18+        | https://nodejs.org/ o `winget install OpenJS.NodeJS.LTS` (Windows), `brew install node` (macOS), tu package manager (Linux) |
| Git     | cualquiera | https://git-scm.com/ o `winget install Git.Git` / `brew install git` / `sudo apt install git`                               |

No requiere `npm install` — el installer es **zero-dep**, solo usa módulos built-in de Node.

## Para usuarios de Claude Code: pre-aprobar bash command (opcional)

Si vas a usar el modo `prefer_interactive_menus: true` en tu perfil (flechas en algunos menús), Claude Code te va a pedir permiso para correr el helper. Para no tener que aprobarlo cada vez, agregalo a tus permitidos:

```
node ~/.claude/skills/_helpers/choose.js *
```

## Para mejor experiencia: configurar GitHub

Las skills pueden scanear tu historial de proyectos de GitHub para personalizar las sugerencias. Tres opciones, cualquiera basta:

### Opción 1 — `gh` CLI (recomendada)

```bash
# Instalación
winget install --id GitHub.cli   # Windows
brew install gh                  # macOS
sudo apt install gh              # Linux

# Auth (una vez)
gh auth login
```

Cobertura: repos públicos + privados.

### Opción 2 — Plugin de GitHub en Claude Code

Si ya tenés el plugin de GitHub instalado y autenticado en Claude Code, la skill lo detecta y lo usa.

### Opción 3 — Sin nada

La skill cae a la API pública (solo repos públicos, 60 calls/hora) o a entrevista manual de 8 preguntas.

## Comandos disponibles después de instalar

Después del install, vas a tener disponible:

```bash
# Las skills en Claude Code:
/new-project quiero armar una landing con animación 3D
/learning-roadmap quiero aprender Three.js

# En tu terminal (desde la carpeta clonada):
node bin/install.js          # re-correr el installer
node bin/uninstall.js        # desinstalar las skills
node bin/install.js --help   # ayuda
node bin/install.js --symlink   # modo dev
```

## Update a la última versión

```bash
# Linux / macOS
curl -fsSL https://raw.githubusercontent.com/carlos0718/charly-skills-dev/main/install.sh | bash

# Windows
iwr -useb https://raw.githubusercontent.com/carlos0718/charly-skills-dev/main/install.ps1 | iex
```

El installer detecta que ya está clonado, hace `git pull` y vuelve a instalar las skills con los cambios.

## Desinstalar

```bash
# Desde la carpeta del proyecto
node bin/uninstall.js
```

El uninstaller:

- Saca las skills de `~/.claude/skills/` (sea copia o symlink).
- **Preserva** tu `profile.md` y `activity-log.jsonl` por default (tienen datos tuyos).
- Te pregunta antes de borrar cada uno.

Para borrar **todo** incluyendo perfil y log:

```bash
node bin/uninstall.js --purge
```

## Multi-AI (próximamente)

El pack está siendo arquitectado para soportar múltiples asistentes de AI:

- ✅ **Claude Code** (`~/.claude/skills/`)
- 🚧 Cursor (`.cursor/rules/`)
- 🚧 Gemini CLI
- 🚧 Codex / OpenAI Codex CLI

El comando `charly-skills install --target <ai>` traduce las skills al formato de cada AI.

## Roadmap

- [x] v1.0 — Installer básico Windows
- [x] v1.5 — Symlink dev mode, uninstall, arrow menus en install
- [x] v2.0 — Gitflow, TECH-DECISIONS, SYSTEM_PROMPT auto-trigger, session warmup
- [ ] v2.1 — Welcome screen con ASCII art branded
- [ ] v2.2 — CLI con subcomandos (`install`, `uninstall`, `update`, `status`, `doctor`)
- [ ] v3.0 — Multi-AI support (Cursor primero)

## Contribuir

PRs bienvenidos. Para iterar:

```bash
git clone https://github.com/carlos0718/charly-skills-dev
cd charly-skills-dev
node bin/install.js --symlink   # instala en modo dev — cambios al instante
```

Después editás los archivos del pack y los probás en tu Claude Code sin reinstalar.

## Licencia

[MIT](LICENSE) © 2026 Carlos Jesus

Hecho con cariño desde Argentina 🧉
