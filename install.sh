#!/usr/bin/env bash
# charly-skills-dev — instalador remoto Linux/macOS
#
# Uso:
#   curl -fsSL https://raw.githubusercontent.com/carlos0718/charly-skills-dev/main/install.sh | bash
#
# Argumentos opcionales:
#   --symlink   Instala las skills como symlinks (recomendado para devs)
#   --branch X  Clona la branch X en vez de main

set -euo pipefail

# ── Config ─────────────────────────────────────────────────────────────
REPO_URL="https://github.com/carlos0718/charly-skills-dev.git"
INSTALL_DIR="${CHARLY_SKILLS_HOME:-$HOME/.charly-skills-dev}"
BRANCH="main"
EXTRA_ARGS=""

# ── Args ───────────────────────────────────────────────────────────────
while [ $# -gt 0 ]; do
  case "$1" in
    --symlink|-s)
      EXTRA_ARGS="$EXTRA_ARGS --symlink"
      ;;
    --branch=*)
      BRANCH="${1#*=}"
      ;;
    --help|-h)
      sed -n '2,/^$/p' "$0" | sed 's/^# \?//'
      exit 0
      ;;
    *)
      echo "Opción desconocida: $1" >&2
      exit 1
      ;;
  esac
  shift
done

# ── Colores ────────────────────────────────────────────────────────────
if [ -t 1 ]; then
  GREEN=$'\033[32m'; YELLOW=$'\033[33m'; CYAN=$'\033[36m'; RED=$'\033[31m'; BOLD=$'\033[1m'; RESET=$'\033[0m'
else
  GREEN=''; YELLOW=''; CYAN=''; RED=''; BOLD=''; RESET=''
fi

ok()   { echo "  ${GREEN}✓${RESET} $1"; }
err()  { echo "  ${RED}✗${RESET} $1" >&2; }
info() { echo "  ${CYAN}→${RESET} $1"; }

# ── Header ─────────────────────────────────────────────────────────────
echo ""
echo "${CYAN}${BOLD}charly-skills-dev — Installer${RESET}"
echo "${CYAN}─────────────────────────────────────────${RESET}"
echo ""

# ── Verificar requisitos ───────────────────────────────────────────────
info "Verificando requisitos..."

if ! command -v git >/dev/null 2>&1; then
  err "git no está instalado. Instalá git primero:"
  err "  • macOS: brew install git"
  err "  • Linux: sudo apt install git (o tu package manager)"
  exit 1
fi
ok "git $(git --version | awk '{print $3}')"

if ! command -v node >/dev/null 2>&1; then
  err "Node.js no está instalado. Instalá Node 18+:"
  err "  • https://nodejs.org/  (LTS)"
  err "  • o con nvm: nvm install --lts"
  exit 1
fi

NODE_VER=$(node --version | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VER" -lt 18 ]; then
  err "Node $NODE_VER es muy viejo. Necesito 18+. Actualizá con nvm o desde nodejs.org"
  exit 1
fi
ok "node $(node --version)"
echo ""

# ── Clonar o actualizar ────────────────────────────────────────────────
if [ -d "$INSTALL_DIR/.git" ]; then
  info "Repo existente en $INSTALL_DIR — actualizando..."
  cd "$INSTALL_DIR"
  git fetch origin "$BRANCH" --quiet
  git reset --hard "origin/$BRANCH" --quiet
  ok "Actualizado a la última versión de $BRANCH"
else
  info "Clonando $REPO_URL a $INSTALL_DIR..."
  git clone --branch "$BRANCH" --depth 1 "$REPO_URL" "$INSTALL_DIR" --quiet
  ok "Clonado"
fi
echo ""

# ── Correr el installer interactivo ────────────────────────────────────
info "Iniciando installer..."
echo ""
cd "$INSTALL_DIR"
node bin/install.js $EXTRA_ARGS
