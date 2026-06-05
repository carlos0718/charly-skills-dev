@echo off
REM Doble-click para desinstalar las skills en Windows.
REM Requiere Node 18+ instalado.

setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
    echo.
    echo  [X] Node.js no esta instalado o no esta en el PATH.
    echo.
    pause
    exit /b 1
)

node "%~dp0bin\uninstall.js" %*

echo.
pause
endlocal
