# Claude Skills Installer

Instalador Node autocontenido para las skills `/new-project` y `/learning-roadmap` de Claude Code.

Trae los 21 archivos del pack adentro, te pregunta dónde guardarlos, y los copia + inicializa `profile.md` y `activity-log.jsonl` si no existen.

## Estructura del proyecto

```
claude-skills-installer/
├── package.json              ← config Node + scripts npm
├── README.md                 ← este archivo
├── install.bat               ← doble-click en Windows
├── install.command           ← doble-click en macOS
├── .gitignore
├── bin/
│   └── install.js            ← el CLI interactivo
└── skills/                   ← los 21 archivos del pack (origen)
    ├── new-project/
    ├── learning-roadmap/
    └── shared/
```

## Requisitos

- **Node.js 18+** (LTS recomendado). Verificá con `node --version`.
- No requiere `npm install` — el installer no tiene dependencias externas, usa solo módulos built-in.

## Cómo correrlo

### Opción 1 — Doble-click (más fácil)

- **Windows**: doble-click en `install.bat`. Si no tenés Node instalado, te lo va a decir y te pasa el link.
- **macOS / Linux**: doble-click en `install.command` (en macOS la primera vez puede pedirte permitirlo en *System Settings → Privacy & Security*).

### Opción 2 — Terminal

```bash
cd claude-skills-installer
node bin/install.js
```

O con npm:

```bash
npm start
```

### Opción 3 — Instalar global (npm link)

Si querés tener el comando disponible desde cualquier carpeta:

```bash
cd claude-skills-installer
npm link
# Después podés correr desde cualquier lado:
claude-skills-install
```

## El flujo interactivo

Al correr, el installer te muestra algo así:

```
════════════════════════════════════════════════
  Claude Skills Pack — Installer v1.0
════════════════════════════════════════════════

Vamos a instalar 2 skills personalizadas para Claude Code:
  • /new-project       — armar proyectos de código / creativo / híbrido
  • /learning-roadmap  — armar roadmaps de aprendizaje guiados

  Origen: /path/al/proyecto/skills (21 archivos a instalar)

¿Dónde querés instalar las skills?
  1) /Users/charly/.claude/skills  (default de Claude Code — recomendado)
  2) Otro path  (lo escribís en el próximo paso)
  >
```

Después:

1. Confirmás (o cancelás) el destino.
2. `[1/4]` Crea las carpetas si no existen.
3. `[2/4]` Copia las skills. Si alguna ya existía, te pregunta si querés sobrescribirla.
4. `[3/4]` Crea `profile.md` desde el template — **solo si no existe** (regla de seguridad: el perfil nunca se sobrescribe automáticamente para no perder tus ediciones).
5. `[4/4]` Crea `activity-log.jsonl` vacío si no existe.
6. Muestra un resumen con los paths y los dos comandos de prueba.

## Compilar a un .exe puro (opcional)

Si querés un `.exe` standalone que no necesite Node instalado:

```bash
# Una sola vez, instalar pkg
npm install --save-dev @yao-pkg/pkg

# Compilar para Windows
npx pkg . --targets node18-win-x64 --output dist/claude-skills-install.exe

# O para los 3 sistemas operativos
npm run build:exe:all
```

Esto produce un binario de ~40 MB que incluye Node + el código + los 21 archivos de skills. Lo podés mandar por mail/USB y el receptor solo lo ejecuta.

**Nota**: `pkg` original (`vercel/pkg`) está deprecated. Usar el fork mantenido `@yao-pkg/pkg`.

## Arrow-menus en chat (opt-in)

Por default, los menús de la skill se renderizan como texto numerado en el chat: vos respondés tipeando `1`, `2` o el nombre de la opción. Si preferís un menú interactivo con flechas (como el del `install.bat`), podés activar el modo interactivo.

### Cómo activar

1. Editá `~/.claude/profile.md` y cambiá esta línea:
   ```
   - **prefer_interactive_menus**: `true`
   ```
2. La próxima vez que la skill necesite mostrar un menú, en vez de texto va a invocar bash con:
   ```bash
   node ~/.claude/skills/_helpers/choose.js "pregunta" "opcion1" "opcion2" ...
   ```
3. Claude Code te va a pedir permiso la primera vez. Para no tener que aprobar cada vez, pre-aprobalo como bash command permitido (`node ~/.claude/skills/_helpers/choose.js *`).

### Trade-offs

| Pro | Contra |
|---|---|
| UX más linda con flechas reales | Cada pregunta de menú dispara un bash command extra |
| Menos chance de typo en respuestas | Tenés que aprobar permisos bash en Claude Code |
| Consistente con el installer | Si el helper falla, cae a modo texto automáticamente |

### Fallback automático

Si el helper falla por cualquier razón (no es TTY, sin permisos, etc.) la skill **cae al modo texto sin molestarte**. No vas a quedar bloqueado.

### Desactivar

Cambiar de vuelta `prefer_interactive_menus: false` en el perfil.

## Desinstalar

Si querés sacar las skills (porque vas a reinstalar limpio, o ya no las usás):

```bash
# Linux/macOS
./uninstall.command

# Windows
.\uninstall.bat

# O directamente con Node
node bin/uninstall.js
```

El uninstaller:
- Detecta si las skills están instaladas como copia o como symlink, y las saca apropiadamente.
- **Preserva tu `profile.md` y `activity-log.jsonl` por default** (tienen datos tuyos). Te pregunta antes de borrar cada uno.
- Si la carpeta `skills/` quedó vacía, ofrece borrarla.

Para borrar **TODO** sin preguntar (incluyendo perfil y log):

```bash
node bin/uninstall.js --purge
```

## Modo desarrollo: `--symlink`

Si vas a iterar las skills (editarlas, mejorar prompts, agregar referencias), usar el flag `--symlink` ahorra reinstalar después de cada cambio. En vez de copiar los archivos, el installer crea **enlaces simbólicos** desde `~/.claude/skills/<skill>` hacia tu carpeta de desarrollo.

```bash
# Linux/macOS
./install.sh --symlink
# o
node bin/install.js --symlink

# Windows (PowerShell o cmd)
.\install.bat --symlink
# o
node bin\install.js --symlink
```

Después de eso, cualquier cambio que hagas en `claude-skills-installer/skills/...` se ve **al instante** en Claude Code sin reinstalar.

**Notas Windows**: el installer usa **junctions** (no symlinks tradicionales), así que NO necesitás Developer Mode ni admin. Funciona out of the box.

**Notas Linux/macOS**: usa symlinks normales. Sin requisitos extra.

**Cuándo NO usar `--symlink`**:
- Cuando movés la carpeta del pack a otro lado o la borrás → los links quedan rotos.
- Cuando querés que la versión instalada sea inmutable (snapshot estable).

Para volver al modo copia: borrá manualmente los symlinks (`rm ~/.claude/skills/new-project ~/.claude/skills/learning-roadmap`) y corré el installer sin `--symlink`.

## Para mejor experiencia: scaneo de GitHub

Las skills `/new-project` y `/learning-roadmap` se vuelven mucho más útiles cuando pueden ver tu historial de proyectos (tanto local como en GitHub) para personalizar las sugerencias. El installer ya lo deja todo listo para el scan local, pero si querés que también lea tus repos de GitHub (incluyendo privados), elegí **una** de estas tres opciones:

### Opción 1 — `gh` CLI (recomendada)

La más liviana y segura. La skill detecta `gh` automáticamente y lo usa sin pedirte nada.

```bash
# Windows (con winget)
winget install --id GitHub.cli

# macOS
brew install gh

# Linux
sudo apt install gh   # Ubuntu/Debian

# Después, una vez:
gh auth login
```

Cobertura: repos públicos + privados. Sin tokens manuales.

### Opción 2 — Plugin de GitHub en Claude Code

Si ya tenés Claude Code con el plugin de GitHub instalado y autenticado (vía OAuth en tu navegador), la skill lo detecta y lo usa directo. Sin setup extra.

### Opción 3 — Personal Access Token

Más manual. Generá un token en https://github.com/settings/tokens (con scope `repo`), guardalo en una variable de entorno:

```bash
# Linux/macOS (en ~/.bashrc o ~/.zshrc)
export GITHUB_TOKEN=ghp_tu_token_aca

# Windows (PowerShell, una vez)
[System.Environment]::SetEnvironmentVariable('GITHUB_TOKEN','ghp_tu_token_aca','User')
```

### Sin ninguna de las tres

La skill igual funciona — usa la API pública de GitHub (solo repos públicos, 60 calls/hora) o cae a entrevista manual de 8 preguntas. Vas a perder visibilidad de repos privados pero el perfil queda armado.

## Tip: dónde abrir Claude Code la primera vez

La primera vez que corras `/new-project` después de instalar, la skill ejecuta el **Paso 0** para detectar tu workspace. Para que el scan local funcione, conviene **abrir Claude Code dentro de tu carpeta de proyectos** (`D:\dev\`, `~/code/`, etc.), no en el home pelado.

Si lo abrís en otro lado, no pasa nada: la skill te pregunta dónde está tu workspace y vos le indicás el path.

## Probar sin tocar tu ~/.claude/

Si querés ver cómo se comporta el installer sin alterar tu setup real:

```bash
# Elegí "Otro path" en el primer prompt y poné:
/tmp/test-claude
```

Después borrás `/tmp/test-claude/` cuando termines.

## Estructura que queda instalada

Después de correr el installer con el path default, tenés:

```
~/.claude/
├── profile.md                ← creado desde template (si no existía)
├── activity-log.jsonl        ← creado vacío (si no existía)
└── skills/
    ├── new-project/
    │   ├── SKILL.md
    │   └── references/
    │       ├── stacks-code.md
    │       ├── stacks-creative.md
    │       ├── stacks-web-animation.md
    │       ├── architectures.md
    │       └── templates/  (6 templates)
    └── learning-roadmap/
        ├── SKILL.md
        └── references/
            ├── mentor-questions.md
            ├── official-docs.md
            ├── learning-resources.md
            └── templates/  (4 templates)
```

## Cosas que NO hace el installer (por diseño)

- **No sobrescribe `profile.md`** aunque uses confirmación de sobrescritura — eso siempre es manual, para no perder tu perfil.
- **No sobrescribe `activity-log.jsonl`** — es append-only, perderlo es perder historial.
- **No ejecuta `npm install`** en tu sistema — el installer es zero-dependency a propósito.
- **No conecta a internet** — todo viene adentro del proyecto.

## Troubleshooting

**"node: command not found"**
→ Node no está instalado. Descargalo de https://nodejs.org/ (LTS).

**"cannot read property of undefined"**
→ Versión de Node muy vieja. Necesitás 18+.

**"Permission denied" al ejecutar `install.command`**
→ En macOS/Linux dale permisos: `chmod +x install.command`.

**"This script cannot be loaded because running scripts is disabled" (PowerShell)**
→ El installer Node no usa PowerShell, pero si querés correr `.ps1` antiguos: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

## Próximos pasos sugeridos

- [ ] Probar el installer end-to-end en tu setup real.
- [ ] Después de instalar, abrir Claude Code en un proyecto y tirar `/new-project`.
- [ ] Volver con fricciones encontradas para iterar las skills.
- [ ] Si querés distribuirlo a otros, compilá un `.exe` con `pkg`.

## Licencia

MIT.
