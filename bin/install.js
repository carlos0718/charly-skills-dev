#!/usr/bin/env node
/**
 * Claude Skills Pack — Installer interactivo
 * Sin dependencias externas: solo módulos built-in de Node 18+.
 *
 * Menús: navegación con flechas (↑/↓ o k/j) + Enter, atajos numericos.
 * En stdin piped (no TTY) cae a modo numerado plano para automatización/tests.
 */

import { stdin, stdout } from 'node:process';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SKILLS_SOURCE = path.join(PROJECT_ROOT, 'skills');

// ── Args ───────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const USE_SYMLINK = argv.includes('--symlink') || argv.includes('-s');
const SHOW_HELP   = argv.includes('--help') || argv.includes('-h');

if (SHOW_HELP) {
  console.log(`
Claude Skills Pack — Installer

Uso:
  node bin/install.js [opciones]

Opciones:
  --symlink, -s   Symlink (junction en Windows) en vez de copia.
                  Cambios en el source se reflejan al instante.
                  Ideal para iterar sobre las skills.
  --help, -h      Mostrar esta ayuda.

Sin flags = instalación normal (copia los archivos).
`);
  process.exit(0);
}

// ── UI helpers ─────────────────────────────────────────────────────────
const supportsColor = process.stdout.isTTY && process.env.TERM !== 'dumb';
const c = supportsColor
  ? { reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
      green: '\x1b[32m', yellow: '\x1b[33m', cyan: '\x1b[36m',
      red: '\x1b[31m', blue: '\x1b[34m' }
  : Object.fromEntries(['reset','bold','dim','green','yellow','cyan','red','blue'].map(k => [k, '']));

const ok    = (msg) => console.log(`  ${c.green}✓${c.reset} ${msg}`);
const skip  = (msg) => console.log(`  ${c.yellow}~${c.reset} ${msg}`);
const err   = (msg) => console.error(`  ${c.red}✗${c.reset} ${msg}`);
const info  = (msg) => console.log(`  ${c.dim}${msg}${c.reset}`);

function header(title) {
  const line = '═'.repeat(48);
  console.log('');
  console.log(`${c.cyan}${line}${c.reset}`);
  console.log(`${c.cyan}  ${title}${c.reset}`);
  console.log(`${c.cyan}${line}${c.reset}`);
  console.log('');
}

function section(title) {
  console.log(`${c.cyan}${c.bold}${title}${c.reset}`);
}

// ── Stdin reader propio para lectura por línea ──────────────────────────
// Necesario porque readline/promises cierra la interfaz con stdin piped.
class StdinReader {
  constructor() {
    this.buffer = '';
    this.queue = [];
    this.pending = [];
    this.ended = false;
    this.attached = false;
    this._onData = null;
    this._onEnd = null;
  }

  attach() {
    if (this.attached) return;
    this.attached = true;
    stdin.setEncoding('utf8');
    this._onData = (chunk) => { this.buffer += chunk; this._drain(); };
    this._onEnd = () => {
      this.ended = true;
      if (this.buffer.length > 0) { this._enqueueLine(this.buffer); this.buffer = ''; }
      while (this.queue.length > 0) {
        const { resolve } = this.queue.shift();
        resolve(null);
      }
    };
    stdin.on('data', this._onData);
    stdin.on('end', this._onEnd);
    stdin.resume();
  }

  detach() {
    if (!this.attached) return;
    this.attached = false;
    if (this._onData) stdin.removeListener('data', this._onData);
    if (this._onEnd) stdin.removeListener('end', this._onEnd);
  }

  _drain() {
    let nl;
    while ((nl = this.buffer.indexOf('\n')) >= 0) {
      const line = this.buffer.slice(0, nl).replace(/\r$/, '');
      this.buffer = this.buffer.slice(nl + 1);
      this._enqueueLine(line);
    }
  }

  _enqueueLine(line) {
    if (this.queue.length > 0) {
      const { resolve } = this.queue.shift();
      resolve(line);
    } else {
      this.pending.push(line);
    }
  }

  readLine() {
    this.attach();
    return new Promise((resolve) => {
      if (this.pending.length > 0) { resolve(this.pending.shift()); return; }
      if (this.ended && this.buffer.length === 0) { resolve(null); return; }
      this.queue.push({ resolve });
    });
  }

  close() {
    this.detach();
    try { stdin.pause(); } catch {}
    try { stdin.unref(); } catch {}
  }
}

const reader = new StdinReader();

async function prompt(text) {
  stdout.write(text);
  const line = await reader.readLine();
  if (line === null) throw new Error('Sin mas input disponible (stdin cerrado).');
  return line.trim();
}

async function ask(question, defaultValue = '') {
  const hint = defaultValue ? ` ${c.dim}[${defaultValue}]${c.reset}` : '';
  const answer = await prompt(`${question}${hint} `);
  return answer || defaultValue;
}

async function askYesNo(question, defaultYes = false) {
  const hint = defaultYes ? '(S/n)' : '(s/N)';
  const answer = (await prompt(`${question} ${c.dim}${hint}${c.reset} `)).toLowerCase();
  if (!answer) return defaultYes;
  return ['s', 'si', 'y', 'yes'].includes(answer);
}

// ── Fallback numerado para stdin piped ─────────────────────────────────
async function askChoiceNumbered(question, choices) {
  console.log(`${c.bold}${question}${c.reset}`);
  choices.forEach((choice, i) => {
    console.log(`  ${c.cyan}${i + 1})${c.reset} ${choice.label}`);
  });
  while (true) {
    const answer = await prompt(`  ${c.dim}>${c.reset} `);
    const idx = parseInt(answer, 10);
    if (idx >= 1 && idx <= choices.length) return choices[idx - 1].value;
    console.log(`  ${c.red}Elegi un numero entre 1 y ${choices.length}.${c.reset}`);
  }
}

// ── askChoice con flechas (raw mode) ────────────────────────────────────
async function askChoice(question, choices) {
  // Si no hay TTY (pipe, redirección), caer al modo numerado.
  if (!stdin.isTTY) return askChoiceNumbered(question, choices);

  // Pausamos el line reader mientras estamos en raw mode.
  reader.detach();

  console.log(`${c.bold}${question}${c.reset}`);
  // Pre-imprimir N líneas en blanco para que el cursor pueda subir
  for (let i = 0; i < choices.length; i++) console.log('');

  let selected = 0;

  const render = () => {
    // Subir N líneas (al inicio del primer item)
    stdout.write(`\x1b[${choices.length}A`);
    choices.forEach((choice, i) => {
      stdout.write('\r\x1b[K'); // limpiar línea
      const arrow = i === selected ? `${c.cyan}❯${c.reset}` : ' ';
      const label = i === selected
        ? `${c.cyan}${c.bold}${choice.label}${c.reset}`
        : choice.label;
      stdout.write(`  ${arrow} ${label}`);
      stdout.write('\n');
    });
  };

  // Hint debajo del menú
  const hint = `${c.dim}(↑/↓ para mover, Enter para confirmar, 1-${choices.length} para atajar)${c.reset}`;

  stdout.write('\x1b[?25l'); // ocultar cursor
  render();
  stdout.write(hint);

  return new Promise((resolve) => {
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    const cleanup = () => {
      stdin.setRawMode(false);
      stdin.removeListener('data', onKey);
      stdin.pause();
      stdout.write('\r\x1b[K'); // limpiar línea del hint
      stdout.write('\x1b[?25h'); // mostrar cursor
    };

    const onKey = (key) => {
      let confirmed = false;
      let changed = false;

      switch (key) {
        case '\x1b[A': // flecha arriba
        case 'k':
          selected = (selected - 1 + choices.length) % choices.length;
          changed = true;
          break;
        case '\x1b[B': // flecha abajo
        case 'j':
          selected = (selected + 1) % choices.length;
          changed = true;
          break;
        case '\r':
        case '\n':
          confirmed = true;
          break;
        case '\x03': // Ctrl+C
          cleanup();
          stdout.write('\n');
          process.kill(process.pid, 'SIGINT');
          return;
        default:
          if (key.length === 1 && key >= '1' && key <= String(Math.min(9, choices.length))) {
            selected = parseInt(key, 10) - 1;
            confirmed = true;
          }
      }

      if (confirmed) {
        cleanup();
        stdout.write(`\n  ${c.green}✓${c.reset} ${choices[selected].label}\n`);
        resolve(choices[selected].value);
      } else if (changed) {
        // Re-render: subir 1 línea para volver al inicio del hint y borrar
        stdout.write('\r\x1b[K');
        render();
        stdout.write(hint);
      }
    };

    stdin.on('data', onKey);
  });
}

// ── Filesystem helpers ─────────────────────────────────────────────────
function expandHome(p) {
  if (!p) return p;
  if (p === '~') return os.homedir();
  if (p.startsWith('~/') || p.startsWith('~\\')) return path.join(os.homedir(), p.slice(2));
  return p;
}

async function exists(p) {
  try { await fs.stat(p); return true; } catch { return false; }
}

async function copyRecursive(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyRecursive(srcPath, destPath);
    else if (entry.isFile()) await fs.copyFile(srcPath, destPath);
  }
}

async function linkSkill(src, dest) {
  // Symlink absoluto. En Windows usamos 'junction' que NO requiere admin/dev mode.
  const absSrc = path.resolve(src);
  if (process.platform === 'win32') {
    await fs.symlink(absSrc, dest, 'junction');
  } else {
    await fs.symlink(absSrc, dest, 'dir');
  }
}

async function countFiles(p) {
  let count = 0;
  const entries = await fs.readdir(p, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) count += await countFiles(path.join(p, entry.name));
    else if (entry.isFile()) count += 1;
  }
  return count;
}

// ── Main ───────────────────────────────────────────────────────────────
async function main() {
  header('Claude Skills Pack — Installer v1.1');

  console.log(`Vamos a instalar 2 skills personalizadas para Claude Code:`);
  console.log(`  • ${c.bold}/new-project${c.reset}       — armar proyectos de codigo / creativo / hibrido`);
  console.log(`  • ${c.bold}/learning-roadmap${c.reset}  — armar roadmaps de aprendizaje guiados`);
  console.log('');

  if (!(await exists(SKILLS_SOURCE))) {
    err(`No se encontro la carpeta de skills en ${SKILLS_SOURCE}`);
    err(`Asegurate de correr este installer desde la raiz del proyecto.`);
    reader.close();
    process.exit(1);
  }

  const fileCount = await countFiles(SKILLS_SOURCE);
  info(`Origen: ${SKILLS_SOURCE} (${fileCount} archivos a instalar)`);
  if (USE_SYMLINK) {
    info(`Modo: SYMLINK (dev). Cambios en el source se reflejan al instante.`);
  } else {
    info(`Modo: COPIA. Para iteracion rapida usar --symlink.`);
  }
  console.log('');

  const defaultClaudeDir = path.join(os.homedir(), '.claude');
  const defaultSkillsDir = path.join(defaultClaudeDir, 'skills');

  const dest = await askChoice('Donde queres instalar las skills?', [
    { label: `${defaultSkillsDir}  (default de Claude Code - recomendado)`, value: 'default' },
    { label: `Otro path  (lo escribis en el proximo paso)`, value: 'custom' },
  ]);
  console.log('');

  let skillsDir, claudeDir;

  if (dest === 'default') {
    skillsDir = defaultSkillsDir;
    claudeDir = defaultClaudeDir;
  } else {
    const customSkills = await ask(`  Path de skills (acepta ~ como home):`, defaultSkillsDir);
    skillsDir = path.resolve(expandHome(customSkills));
    console.log('');
    const customClaude = await ask(
      `  Carpeta para profile.md y activity-log.jsonl:`,
      path.dirname(skillsDir)
    );
    claudeDir = path.resolve(expandHome(customClaude));
  }

  console.log('');
  console.log(`Skills se instalaran en:    ${c.bold}${skillsDir}${c.reset}`);
  console.log(`Profile y log se ponen en:  ${c.bold}${claudeDir}${c.reset}`);
  console.log('');

  const proceed = await askYesNo('Continuar?', true);
  if (!proceed) {
    console.log('');
    info('Cancelado por el usuario. Nada se modifico.');
    reader.close();
    process.exit(0);
  }
  console.log('');

  section('[1/4] Preparando carpetas destino');
  for (const dir of [claudeDir, skillsDir]) {
    if (await exists(dir)) skip(`${dir} ya existe`);
    else { await fs.mkdir(dir, { recursive: true }); ok(`Creada ${dir}`); }
  }
  console.log('');

  section(USE_SYMLINK ? '[2/4] Linkeando skills (symlink)' : '[2/4] Copiando skills');

  const installSkill = async (src, dst, name) => {
    if (USE_SYMLINK) {
      try {
        await linkSkill(src, dst);
        ok(`${name} linkeada -> ${path.resolve(src)}`);
      } catch (e) {
        if (e.code === 'EPERM') {
          err(`${name}: permiso denegado para symlink. En Windows, activa Developer Mode o corre como admin.`);
          err(`Fallback: la skill no quedo instalada. Reintentar sin --symlink (instala como copia).`);
          throw e;
        }
        throw e;
      }
    } else {
      await copyRecursive(src, dst);
      ok(`${name} instalada (${await countFiles(dst)} archivos)`);
    }
  };

  // Skills + helpers — _helpers contiene scripts compartidos (ej. choose.js)
  const itemsToInstall = ['new-project', 'learning-roadmap', '_helpers'];
  for (const itemName of itemsToInstall) {
    const src = path.join(SKILLS_SOURCE, itemName);
    const dst = path.join(skillsDir, itemName);

    if (!(await exists(src))) {
      skip(`${itemName} no existe en el source (se omite)`);
      continue;
    }

    if (await exists(dst)) {
      const overwrite = await askYesNo(`  ${itemName} ya existe en destino - sobrescribir?`, false);
      if (overwrite) {
        await fs.rm(dst, { recursive: true, force: true });
        await installSkill(src, dst, itemName);
      } else {
        skip(`${itemName} (se mantuvo la version existente)`);
      }
    } else {
      await installSkill(src, dst, itemName);
    }
  }
  console.log('');

  section('[3/4] Inicializando perfil global');
  const profilePath = path.join(claudeDir, 'profile.md');
  const profileTemplate = path.join(SKILLS_SOURCE, 'shared', 'profile.md.template');

  if (await exists(profilePath)) {
    skip(`profile.md ya existe - se preserva (nunca se sobrescribe automaticamente)`);
  } else if (await exists(profileTemplate)) {
    await fs.copyFile(profileTemplate, profilePath);
    ok(`Creado ${profilePath}`);
    info(`(la skill /new-project te va a guiar para llenarlo en la primera ejecucion)`);
  } else {
    err('Template profile.md.template no encontrado en skills/shared/');
  }
  console.log('');

  section('[4/4] Inicializando activity log');
  const logPath = path.join(claudeDir, 'activity-log.jsonl');

  if (await exists(logPath)) {
    skip(`activity-log.jsonl ya existe - se preserva`);
  } else {
    await fs.writeFile(logPath, '');
    ok(`Creado ${logPath} (vacio)`);
  }
  console.log('');

  header('Instalacion completa');

  console.log(`${c.bold}Skills instaladas:${c.reset}`);
  console.log(`  → ${path.join(skillsDir, 'new-project')}${path.sep}`);
  console.log(`  → ${path.join(skillsDir, 'learning-roadmap')}${path.sep}`);
  console.log('');

  console.log(`${c.bold}Archivos globales:${c.reset}`);
  console.log(`  → ${profilePath}`);
  console.log(`  → ${logPath}`);
  console.log('');

  console.log(`${c.bold}Tip para la primera ejecucion:${c.reset}`);
  console.log(`  Abri Claude Code DENTRO de tu carpeta de proyectos (ej. D:\\dev\\)`);
  console.log(`  asi la skill puede scanear tu background tecnico automaticamente.`);
  console.log('');
  console.log(`  Si queres scaneo de GitHub (publicos + privados), instala 'gh' CLI`);
  console.log(`  y corre 'gh auth login' una vez. Mas detalles en el README.`);
  console.log('');

  console.log(`${c.bold}Proximos pasos:${c.reset}`);
  console.log(`  1. Abri Claude Code en tu carpeta de proyectos.`);
  console.log(`  2. Proba:  ${c.cyan}/new-project quiero armar una landing con animacion 3D${c.reset}`);
  console.log(`  3. O:      ${c.cyan}/learning-roadmap quiero aprender Three.js${c.reset}`);
  console.log('');

  reader.close();
}

process.on('SIGINT', () => {
  try { stdin.setRawMode(false); } catch {}
  stdout.write('\x1b[?25h'); // restaurar cursor
  console.log('');
  console.log(`${c.yellow}~ Cancelado por el usuario.${c.reset}`);
  reader.close();
  process.exit(130);
});

main().catch((e) => {
  try { stdin.setRawMode(false); } catch {}
  stdout.write('\x1b[?25h');
  console.log('');
  err(`Error inesperado: ${e.message}`);
  if (process.env.DEBUG) console.error(e);
  reader.close();
  process.exit(1);
});
