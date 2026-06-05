#!/usr/bin/env bash
# Doble-click este archivo en macOS para correr el installer.
# Linux: ejecutalo con ./install.command
# Requiere Node 18+ instalado.

cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo ""
  echo "  [X] Node.js no esta instalado o no esta en el PATH."
  echo ""
  echo "  Instalalo con:"
  echo "    macOS:  brew install node"
  echo "    Linux:  sudo apt install nodejs  (o tu package manager)"
  echo "    O bajalo de: https://nodejs.org/  (version LTS)"
  echo ""
  echo "  Despues volve a correr este script."
  echo ""
  exit 1
fi

node ./bin/install.js "$@"
