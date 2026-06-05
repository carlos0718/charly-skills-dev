#!/usr/bin/env node
/**
 * Claude Skills Pack — Uninstaller
 *
 * Remueve las skills instaladas (sea como copia o como symlink).
 * Pregunta al usuario si tambien quiere borrar profile.md y activity-log.jsonl,
 * pero por default los preserva (tienen datos suyos).
 *
 * Uso:
 *   node bin/uninstall.js
 *   npm run uninstall:skills
 */

import { stdin, stdout } from 'node:process';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Args ────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const SHOW_HELP = argv.includes('--help') || argv.includes('-h');
const PURGE     = argv.includes('--purge'); // sin preguntar, borra TODO incluso profile

if (SHOW_HELP) {
  console.log(`
Claude Skills Pack — Uninstaller

Uso:
  node bin/uninstall.js [opciones]

Opciones:
  --purge    Borra todo sin preguntar: skills + profile.md + activity-log.jsonl.
             CUIDADO: perdés tu perfil y el log historico.
  --help     Mostrar esta ayuda.

Sin flags = solo borra las skills, te pregunta antes por profile y log.
`);
  process.exit(0);
}

// ── UI ──────────────────────────────────────────────────────────────────
const supportsColor = process.stdout.isTTY && process.env.TERM !== 'dumb';
const c = supportsColor
  ? { reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
      green: '\x1b[32m', yellow: '\x1b[33m', cyan: '\x1b[36m',
      red: '\x1b[31m' }
  : Object.fromEntries(['reset','bold','dim','green','yellow','cyan','red'].map(k => [k, '']));

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

// ── Stdin reader (mismo patrón que install.js) ──────────────────────────
class StdinReader {
  constructor() {
    this.buffer = ''; this.queue = []; this.pending = [];
    this.ended = false; this.attached = false;
    this._onData = null; this._onEnd = null;
  }
  attach() {
    if (this.attached) return;
    this.attached = true;
    stdin.setEncoding('utf8');
    this._onData = (chunk) => { this.buffer += chunk; this._drain(); };
    this._onEnd = () => {
      this.ended = true;
      if (this.buffer.length > 0) { this._enqueueLine(this.buffer); this.buffer = ''; }
      while (this.queue.length > 0) { this.queue.shift().resolve(null); }
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
    if (this.queue.length > 0) this.queue.shift().resolve(line);
    else this.pending.push(line);
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
  if (line === null) throw new Error('Sin mas input disponible.');
  return line.trim();
}

async function askYesNo(question, defaultYes = false) {
  const hint = defaultYes ? '(S/n)' : '(s/N)';
  const answer = (await prompt(`${question} ${c.dim}${hint}${c.reset} `)).toLowerCase();
  if (!answer) return defaultYes;
  return ['s', 'si', 'y', 'yes'].includes(answer);
}

// ── FS helpers ──────────────────────────────────────────────────────────
async function exists(p) {
  try { await fs.lstat(p); return true; } catch { return false; }
}

async function isSymlink(p) {
  try {
    const st = await fs.lstat(p);
    return st.isSymbolicLink();
  } catch { return false; }
}

async function removeAny(p) {
  // Funciona para archivos, directorios y symlinks
  await fs.rm(p, { recursive: true, force: true });
}

// ── Main ────────────────────────────────────────────────────────────────
async function main() {
  header('Claude Skills Pack — Uninstaller');

  const claudeDir = path.join(os.homedir(), '.claude');
  const skillsDir = path.join(claudeDir, 'skills');

  console.log(`Vamos a desinstalar las skills de:  ${c.bold}${claudeDir}${c.reset}`);
  console.log('');

  if (!(await exists(claudeDir))) {
    err(`No existe ${claudeDir}. Nada para desinstalar.`);
    reader.close();
    process.exit(0);
  }

  // Detectar qué hay instalado
  const items = [
    { name: 'new-project',      path: path.join(skillsDir, 'new-project') },
    { name: 'learning-roadmap', path: path.join(skillsDir, 'learning-roadmap') },
    { name: '_helpers',         path: path.join(skillsDir, '_helpers') },
  ];

  const detected = [];
  for (const item of items) {
    if (await exists(item.path)) {
      const link = await isSymlink(item.path);
      detected.push({ ...item, kind: link ? 'symlink' : 'copia' });
    }
  }

  if (detected.length === 0) {
    skip('No se detectaron skills instaladas. Nada que hacer.');
    reader.close();
    process.exit(0);
  }

  console.log(`${c.bold}Skills detectadas:${c.reset}`);
  for (const d of detected) {
    console.log(`  - ${d.name}  ${c.dim}(${d.kind})${c.reset}`);
  }
  console.log('');

  // Confirmar
  if (!PURGE) {
    const proceed = await askYesNo('Desinstalar estas skills?', true);
    if (!proceed) {
      info('Cancelado. Nada se modifico.');
      reader.close();
      process.exit(0);
    }
    console.log('');
  }

  // Borrar skills
  console.log(`${c.cyan}${c.bold}[1/2] Removiendo skills${c.reset}`);
  for (const d of detected) {
    try {
      await removeAny(d.path);
      ok(`${d.name} removida (era ${d.kind})`);
    } catch (e) {
      err(`${d.name}: fallo al remover (${e.message})`);
    }
  }
  console.log('');

  // profile.md y activity-log
  console.log(`${c.cyan}${c.bold}[2/2] Archivos globales (perfil + log)${c.reset}`);
  const profilePath = path.join(claudeDir, 'profile.md');
  const logPath = path.join(claudeDir, 'activity-log.jsonl');

  let removeProfile = PURGE;
  let removeLog = PURGE;

  if (!PURGE) {
    const hasProfile = await exists(profilePath);
    const hasLog = await exists(logPath);

    if (hasProfile || hasLog) {
      console.log('  Estos archivos tienen TUS datos (perfil tecnico, historial de proyectos).');
      console.log('  Por default los preservamos.');
      console.log('');
      if (hasProfile) {
        removeProfile = await askYesNo(`  Borrar profile.md?`, false);
      }
      if (hasLog) {
        removeLog = await askYesNo(`  Borrar activity-log.jsonl?`, false);
      }
    } else {
      skip('No hay profile.md ni activity-log.jsonl para borrar.');
    }
  }

  if (removeProfile && await exists(profilePath)) {
    await removeAny(profilePath);
    ok(`profile.md removido`);
  } else if (await exists(profilePath)) {
    skip(`profile.md preservado`);
  }

  if (removeLog && await exists(logPath)) {
    await removeAny(logPath);
    ok(`activity-log.jsonl removido`);
  } else if (await exists(logPath)) {
    skip(`activity-log.jsonl preservado`);
  }

  console.log('');

  // Si la carpeta skills/ quedo vacia, ofrecer borrarla
  try {
    const remaining = await fs.readdir(skillsDir);
    if (remaining.length === 0 && !PURGE) {
      const removeEmpty = await askYesNo('  La carpeta skills/ quedo vacia. Borrarla?', true);
      if (removeEmpty) {
        await fs.rmdir(skillsDir);
        ok(`${skillsDir} removida`);
      }
    } else if (remaining.length === 0 && PURGE) {
      await fs.rmdir(skillsDir);
      ok(`${skillsDir} removida (vacia)`);
    }
  } catch {}

  // Resumen
  header('Desinstalacion completa');
  console.log('Para reinstalar en el futuro:');
  console.log(`  ${c.cyan}node bin/install.js${c.reset}  (o ${c.cyan}.\\install.bat${c.reset} en Windows)`);
  console.log('');

  reader.close();
}

process.on('SIGINT', () => {
  console.log('');
  console.log(`${c.yellow}~ Cancelado por el usuario.${c.reset}`);
  reader.close();
  process.exit(130);
});

main().catch((e) => {
  console.log('');
  err(`Error: ${e.message}`);
  if (process.env.DEBUG) console.error(e);
  reader.close();
  process.exit(1);
});
