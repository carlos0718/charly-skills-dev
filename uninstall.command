#!/usr/bin/env bash
# Doble-click para desinstalar las skills en macOS.
# Linux: corré con ./uninstall.command

cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo ""
  echo "  [X] Node.js no esta instalado o no esta en el PATH."
  echo ""
  exit 1
fi

node ./bin/uninstall.js "$@"
