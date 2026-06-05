#!/usr/bin/env node
/**
 * choose.js — Arrow-key menu helper para skills de Claude Code
 *
 * Renderiza un menu interactivo en el TTY del usuario y devuelve la opcion
 * elegida via stdout. La UI va a stderr para no contaminar el output util.
 *
 * Las skills lo invocan via bash cuando profile.md tiene
 * prefer_interactive_menus: true.
 *
 * Uso:
 *   node choose.js "Pregunta" "opcion1" "opcion2" [...]
 *
 * Output (stdout):
 *   La opcion elegida tal cual, en una sola linea, sin colores.
 *
 * Exit codes:
 *   0 = usuario eligio una opcion
 *   1 = usuario cancelo (Ctrl+C)
 *   2 = error: no es TTY (falla controlada para que skills caigan a modo texto)
 *   3 = error: args incorrectos
 */

import { stdin, stdout, stderr } from 'node:process';

const args = process.argv.slice(2);

if (args.length < 2 || args.includes('--help') || args.includes('-h')) {
  stderr.write(`
choose.js — menu interactivo con flechas

Uso:
  node choose.js "Pregunta" "opcion1" "opcion2" ...

Output:
  La opcion elegida se imprime a stdout. La UI va a stderr.

Controles:
  Flechas arriba/abajo  Mover seleccion
  k / j                 Alternativas vim
  Enter                 Confirmar
  1-9                   Atajo numerico
  Ctrl+C                Cancelar (exit 1)
`);
  process.exit(args.length < 2 ? 3 : 0);
}

const question = args[0];
const choices = args.slice(1);

// Si no hay TTY, salir con codigo 2 — la skill puede detectar y fallback
if (!stdin.isTTY || !stderr.isTTY) {
  stderr.write('choose.js: no es TTY, no se puede mostrar menu interactivo.\n');
  stderr.write('La skill deberia caer al modo texto.\n');
  process.exit(2);
}

const supportsColor = process.env.TERM !== 'dumb';
const c = supportsColor
  ? { reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
      cyan: '\x1b[36m', green: '\x1b[32m', yellow: '\x1b[33m' }
  : Object.fromEntries(['reset','bold','dim','cyan','green','yellow'].map(k => [k, '']));

// UI a stderr
stderr.write(`${c.bold}${question}${c.reset}\n`);
for (let i = 0; i < choices.length; i++) stderr.write('\n');

let selected = 0;

const render = () => {
  stderr.write(`\x1b[${choices.length}A`); // up N lines
  choices.forEach((choice, i) => {
    stderr.write('\r\x1b[K');
    const arrow = i === selected ? `${c.cyan}❯${c.reset}` : ' ';
    const label = i === selected
      ? `${c.cyan}${c.bold}${choice}${c.reset}`
      : choice;
    stderr.write(`  ${arrow} ${label}\n`);
  });
};

const hint = `${c.dim}(↑/↓ + Enter · 1-${Math.min(9, choices.length)} atajo · Ctrl+C cancela)${c.reset}`;

stderr.write('\x1b[?25l'); // ocultar cursor
render();
stderr.write(hint);

stdin.setRawMode(true);
stdin.resume();
stdin.setEncoding('utf8');

const cleanup = () => {
  try { stdin.setRawMode(false); } catch {}
  stderr.write('\r\x1b[K');     // limpiar linea del hint
  stderr.write('\x1b[?25h');    // mostrar cursor
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
      stderr.write('\nCancelado.\n');
      process.exit(1);
    default:
      if (key.length === 1 && key >= '1' && key <= String(Math.min(9, choices.length))) {
        selected = parseInt(key, 10) - 1;
        confirmed = true;
      }
  }

  if (confirmed) {
    cleanup();
    stderr.write(`\n  ${c.green}✓${c.reset} ${choices[selected]}\n`);
    // STDOUT = la opcion elegida tal cual, para que la skill la lea
    stdout.write(choices[selected] + '\n');
    process.exit(0);
  } else if (changed) {
    stderr.write('\r\x1b[K');
    render();
    stderr.write(hint);
  }
};

stdin.on('data', onKey);

process.on('SIGINT', () => {
  cleanup();
  stderr.write('\n');
  process.exit(1);
});
