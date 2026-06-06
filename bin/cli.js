#!/usr/bin/env node
/**
 * charly-skills — CLI dispatcher con subcomandos.
 *
 * Uso:
 *   charly-skills install [--symlink]
 *   charly-skills uninstall [--purge]
 *   charly-skills update              # git pull + reinstall
 *   charly-skills status              # info de instalación actual
 *   charly-skills doctor              # diagnóstico del entorno
 *   charly-skills version             # mostrar versión
 *   charly-skills help [subcommand]   # ayuda
 *
 * Sin subcomando → muestra ayuda.
 */

import { fileURLToPath } from 'node:url';
import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// ── Version desde package.json ─────────────────────────────────────────
let PKG = { name: 'charly-skills-dev', version: 'unknown' };
try {
  PKG = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, 'package.json'), 'utf8'));
} catch {}

// ── UI ──────────────────────────────────────────────────────────────────
const supportsColor = process.stdout.isTTY && process.env.TERM !== 'dumb';
const c = supportsColor
  ? { reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
      green: '\x1b[32m', yellow: '\x1b[33m', cyan: '\x1b[36m',
      red: '\x1b[31m', blue: '\x1b[34m', magenta: '\x1b[35m' }
  : Object.fromEntries(['reset','bold','dim','green','yellow','cyan','red','blue','magenta'].map(k => [k, '']));

const ok    = (msg) => console.log(`  ${c.green}✓${c.reset} ${msg}`);
const warn  = (msg) => console.log(`  ${c.yellow}!${c.reset} ${msg}`);
const err   = (msg) => console.error(`  ${c.red}✗${c.reset} ${msg}`);
const info  = (msg) => console.log(`  ${c.dim}${msg}${c.reset}`);

// ── Helpers ────────────────────────────────────────────────────────────
function exists(p) { try { fs.statSync(p); return true; } catch { return false; } }

function tryRun(cmd) {
  try { return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
  catch { return null; }
}

function runScript(scriptName, args) {
  return new Promise((resolve) => {
    const scriptPath = path.join(__dirname, scriptName);
    const child = spawn('node', [scriptPath, ...args], { stdio: 'inherit' });
    child.on('exit', (code) => resolve(code ?? 0));
  });
}

// ── Subcomandos ────────────────────────────────────────────────────────

async function cmdInstall(args) {
  return runScript('install.js', args);
}

async function cmdUninstall(args) {
  return runScript('uninstall.js', args);
}

async function cmdUpdate(args) {
  console.log('');
  console.log(`${c.cyan}${c.bold}charly-skills update${c.reset}`);
  console.log(`${c.cyan}─────────────────────────────────────${c.reset}`);
  console.log('');

  const isGitRepo = exists(path.join(PROJECT_ROOT, '.git'));

  if (!isGitRepo) {
    err('Este directorio no es un repo git. No puedo actualizar.');
    info(`Para actualizar, reinstalá con: curl ... | bash  (o iwr ... | iex en Windows)`);
    return 1;
  }

  info('Actualizando código del pack...');
  try {
    const branch = tryRun(`git -C "${PROJECT_ROOT}" rev-parse --abbrev-ref HEAD`) || 'main';
    execSync(`git -C "${PROJECT_ROOT}" fetch origin ${branch} --quiet`, { stdio: 'inherit' });
    execSync(`git -C "${PROJECT_ROOT}" reset --hard origin/${branch} --quiet`, { stdio: 'inherit' });
    ok(`Código actualizado a la última versión de ${branch}`);
  } catch (e) {
    err(`Falló git fetch/reset: ${e.message}`);
    return 1;
  }

  console.log('');
  info('Re-instalando skills con la versión nueva...');
  console.log('');
  return runScript('install.js', args);
}

async function cmdStatus() {
  console.log('');
  console.log(`${c.cyan}${c.bold}charly-skills status${c.reset}`);
  console.log(`${c.cyan}─────────────────────────────────────${c.reset}`);
  console.log('');

  // Versión
  console.log(`${c.bold}Pack${c.reset}`);
  console.log(`  Nombre:   ${PKG.name}`);
  console.log(`  Versión:  ${PKG.version}`);
  console.log(`  Root:     ${PROJECT_ROOT}`);
  console.log('');

  // Git info si aplica
  if (exists(path.join(PROJECT_ROOT, '.git'))) {
    const branch = tryRun(`git -C "${PROJECT_ROOT}" rev-parse --abbrev-ref HEAD`);
    const commit = tryRun(`git -C "${PROJECT_ROOT}" rev-parse --short HEAD`);
    const remote = tryRun(`git -C "${PROJECT_ROOT}" remote get-url origin`);
    console.log(`${c.bold}Git${c.reset}`);
    if (branch) console.log(`  Branch:   ${branch}`);
    if (commit) console.log(`  Commit:   ${commit}`);
    if (remote) console.log(`  Remote:   ${remote}`);
    console.log('');
  }

  // Skills instaladas
  const claudeDir = path.join(os.homedir(), '.claude');
  const skillsDir = path.join(claudeDir, 'skills');
  console.log(`${c.bold}Instalación${c.reset}`);
  console.log(`  Claude dir:    ${claudeDir} ${exists(claudeDir) ? c.green + '✓' + c.reset : c.red + '✗' + c.reset}`);
  console.log(`  Skills dir:    ${skillsDir} ${exists(skillsDir) ? c.green + '✓' + c.reset : c.red + '✗' + c.reset}`);

  const expectedSkills = ['new-project', 'learning-roadmap', '_helpers'];
  for (const name of expectedSkills) {
    const p = path.join(skillsDir, name);
    if (exists(p)) {
      const stat = fs.lstatSync(p);
      const kind = stat.isSymbolicLink() ? 'symlink' : 'copia';
      ok(`${name} (${kind})`);
    } else {
      warn(`${name} no instalado`);
    }
  }
  console.log('');

  // Perfil
  const profilePath = path.join(claudeDir, 'profile.md');
  const logPath = path.join(claudeDir, 'activity-log.jsonl');

  console.log(`${c.bold}Datos del usuario${c.reset}`);
  if (exists(profilePath)) {
    const size = fs.statSync(profilePath).size;
    ok(`profile.md   (${size} bytes)`);
  } else {
    warn(`profile.md   no existe`);
  }

  if (exists(logPath)) {
    const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean).length;
    ok(`activity-log.jsonl   (${lines} proyectos registrados)`);

    if (lines > 0) {
      const last = fs.readFileSync(logPath, 'utf8').split('\n').filter(Boolean).slice(-1)[0];
      try {
        const obj = JSON.parse(last);
        console.log(`  ${c.dim}Último: ${obj.skill} → "${obj.name}" (${obj.date})${c.reset}`);
      } catch {}
    }
  } else {
    warn(`activity-log.jsonl   no existe`);
  }
  console.log('');

  return 0;
}

async function cmdDoctor() {
  console.log('');
  console.log(`${c.cyan}${c.bold}charly-skills doctor${c.reset}`);
  console.log(`${c.cyan}─────────────────────────────────────${c.reset}`);
  console.log('');

  let issues = 0;

  // Node
  const nodeVer = process.versions.node;
  const nodeMajor = parseInt(nodeVer.split('.')[0], 10);
  if (nodeMajor >= 18) ok(`Node ${nodeVer}`);
  else { err(`Node ${nodeVer} es muy viejo (necesito 18+)`); issues++; }

  // Git
  const gitVer = tryRun('git --version');
  if (gitVer) ok(`Git: ${gitVer.replace('git version ', '')}`);
  else { err('git no está instalado'); issues++; }

  // gh CLI (opcional)
  const ghVer = tryRun('gh --version');
  if (ghVer) {
    ok(`gh CLI: ${ghVer.split('\n')[0].replace('gh version ', '')}`);
    const ghAuth = tryRun('gh auth status 2>&1');
    if (ghAuth && ghAuth.includes('Logged in')) {
      ok(`gh autenticado`);
    } else {
      warn(`gh instalado pero no autenticado (corré: gh auth login)`);
    }
  } else {
    warn(`gh CLI no instalado (opcional pero recomendado para scan de GitHub)`);
  }

  // Claude config dir
  const claudeDir = path.join(os.homedir(), '.claude');
  if (exists(claudeDir)) ok(`Claude config: ${claudeDir}`);
  else { warn(`Claude config dir no existe en ${claudeDir} (¿Claude Code instalado?)`); }

  // Skills
  const skillsDir = path.join(claudeDir, 'skills');
  if (exists(skillsDir)) {
    const installed = ['new-project', 'learning-roadmap', '_helpers']
      .filter(n => exists(path.join(skillsDir, n)));
    if (installed.length === 3) ok(`Las 3 skills/helpers están instaladas`);
    else { warn(`Solo ${installed.length}/3 skills instaladas: ${installed.join(', ')}`); issues++; }
  } else {
    err(`Skills dir no existe — corré: charly-skills install`);
    issues++;
  }

  // Profile
  const profilePath = path.join(claudeDir, 'profile.md');
  if (exists(profilePath)) {
    const content = fs.readFileSync(profilePath, 'utf8');
    if (content.includes('{{')) warn(`profile.md tiene placeholders sin completar`);
    else ok(`profile.md presente y rellenado`);
  } else {
    warn(`profile.md no existe (se creará en la próxima ejecución de /new-project)`);
  }

  // Resumen
  console.log('');
  if (issues === 0) {
    console.log(`${c.green}${c.bold}✓ Todo en orden.${c.reset} Listo para usar las skills en Claude Code.`);
  } else {
    console.log(`${c.yellow}${c.bold}! Se encontraron ${issues} problema(s).${c.reset} Revisalos arriba.`);
  }
  console.log('');

  return issues === 0 ? 0 : 1;
}

function cmdVersion() {
  console.log(`${PKG.name} v${PKG.version}`);
  return 0;
}

function cmdHelp(args) {
  const sub = args[0];

  if (sub === 'install') {
    console.log(`
${c.bold}charly-skills install${c.reset} — instala las skills en ~/.claude/skills/

Opciones:
  --symlink, -s   Instala como symlinks (modo dev, cambios al instante)
  --help, -h      Mostrar ayuda
`);
    return 0;
  }

  if (sub === 'uninstall') {
    console.log(`
${c.bold}charly-skills uninstall${c.reset} — desinstala las skills

Opciones:
  --purge   Borra TODO incluyendo profile.md y activity-log.jsonl (cuidado)
  --help    Mostrar ayuda
`);
    return 0;
  }

  // Help general
  console.log(`
${c.bold}charly-skills${c.reset} v${PKG.version}

${c.dim}Skills personalizadas para Claude Code — scaffolding de proyectos + roadmaps de aprendizaje.${c.reset}

${c.bold}Uso:${c.reset}
  charly-skills <subcomando> [opciones]

${c.bold}Subcomandos:${c.reset}
  ${c.cyan}install${c.reset}     Instala las skills en ~/.claude/skills/
  ${c.cyan}uninstall${c.reset}   Desinstala las skills
  ${c.cyan}update${c.reset}      Actualiza el pack (git pull + reinstall)
  ${c.cyan}status${c.reset}      Muestra info de la instalación actual
  ${c.cyan}doctor${c.reset}      Diagnóstico del entorno (Node, git, gh, Claude Code)
  ${c.cyan}version${c.reset}     Muestra la versión
  ${c.cyan}help${c.reset}        Muestra esta ayuda (o de un subcomando específico)

${c.bold}Ejemplos:${c.reset}
  charly-skills install
  charly-skills install --symlink
  charly-skills update
  charly-skills doctor
  charly-skills help install

${c.bold}Más info:${c.reset} https://github.com/carlos0718/charly-skills-dev
`);
  return 0;
}

// ── Dispatcher ─────────────────────────────────────────────────────────
async function main() {
  const argv = process.argv.slice(2);
  const cmd = argv[0];
  const rest = argv.slice(1);

  // Flags globales tipo --version, --help
  if (cmd === '--version' || cmd === '-v') return cmdVersion();
  if (cmd === '--help' || cmd === '-h' || !cmd) return cmdHelp(rest);

  switch (cmd) {
    case 'install':   return cmdInstall(rest);
    case 'uninstall': return cmdUninstall(rest);
    case 'update':    return cmdUpdate(rest);
    case 'status':    return cmdStatus();
    case 'doctor':    return cmdDoctor();
    case 'version':   return cmdVersion();
    case 'help':      return cmdHelp(rest);
    default:
      err(`Subcomando desconocido: ${cmd}`);
      console.log('');
      cmdHelp([]);
      return 1;
  }
}

main()
  .then((code) => process.exit(code))
  .catch((e) => { err(`Error: ${e.message}`); process.exit(1); });
