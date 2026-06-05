# charly-skills-dev — instalador remoto para Windows
#
# Uso:
#   iwr -useb https://raw.githubusercontent.com/carlos0718/charly-skills-dev/main/install.ps1 | iex
#
# Argumentos opcionales (pasarlos via env var antes de invocar):
#   $env:CHARLY_SKILLS_SYMLINK = "1"   # instala como symlinks
#   $env:CHARLY_SKILLS_BRANCH  = "dev" # branch alternativa

#Requires -Version 5.0
[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

# ── Config ─────────────────────────────────────────────────────────────
$RepoUrl     = "https://github.com/carlos0718/charly-skills-dev.git"
$InstallDir  = if ($env:CHARLY_SKILLS_HOME) { $env:CHARLY_SKILLS_HOME } else { "$env:USERPROFILE\.charly-skills-dev" }
$Branch      = if ($env:CHARLY_SKILLS_BRANCH) { $env:CHARLY_SKILLS_BRANCH } else { "main" }
$ExtraArgs   = @()
if ($env:CHARLY_SKILLS_SYMLINK -eq "1") { $ExtraArgs += "--symlink" }

# ── UI helpers ─────────────────────────────────────────────────────────
function Write-Step([string]$msg)  { Write-Host "  → $msg" -ForegroundColor Cyan }
function Write-Ok([string]$msg)    { Write-Host "  ✓ $msg" -ForegroundColor Green }
function Write-Err([string]$msg)   { Write-Host "  ✗ $msg" -ForegroundColor Red }

# ── Header ─────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "charly-skills-dev — Installer" -ForegroundColor Cyan
Write-Host "─────────────────────────────────────────" -ForegroundColor Cyan
Write-Host ""

# ── Verificar requisitos ───────────────────────────────────────────────
Write-Step "Verificando requisitos..."

# Git
$gitOk = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitOk) {
    Write-Err "git no está instalado. Instalalo con uno de estos:"
    Write-Err "  • winget install --id Git.Git"
    Write-Err "  • https://git-scm.com/download/win"
    exit 1
}
$gitVer = (git --version) -replace 'git version ',''
Write-Ok "git $gitVer"

# Node
$nodeOk = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeOk) {
    Write-Err "Node.js no está instalado. Instalalo:"
    Write-Err "  • winget install --id OpenJS.NodeJS.LTS"
    Write-Err "  • https://nodejs.org/  (LTS)"
    exit 1
}
$nodeVer = (node --version) -replace 'v',''
$nodeMajor = [int]($nodeVer -split '\.')[0]
if ($nodeMajor -lt 18) {
    Write-Err "Node $nodeVer es muy viejo. Necesito 18+. Actualizá desde nodejs.org"
    exit 1
}
Write-Ok "node v$nodeVer"
Write-Host ""

# ── Clonar o actualizar ────────────────────────────────────────────────
if (Test-Path "$InstallDir\.git") {
    Write-Step "Repo existente en $InstallDir — actualizando..."
    Push-Location $InstallDir
    git fetch origin $Branch --quiet 2>$null
    git reset --hard "origin/$Branch" --quiet 2>$null
    Pop-Location
    Write-Ok "Actualizado a la última versión de $Branch"
} else {
    Write-Step "Clonando $RepoUrl a $InstallDir..."
    git clone --branch $Branch --depth 1 $RepoUrl $InstallDir --quiet 2>$null
    Write-Ok "Clonado"
}
Write-Host ""

# ── Correr el installer interactivo ────────────────────────────────────
Write-Step "Iniciando installer..."
Write-Host ""
Push-Location $InstallDir
if ($ExtraArgs.Count -gt 0) {
    node bin/install.js @ExtraArgs
} else {
    node bin/install.js
}
Pop-Location
