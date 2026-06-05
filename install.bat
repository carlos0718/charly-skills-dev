@echo off
REM Doble-click este archivo para correr el installer en Windows.
REM Requiere Node 18+ instalado.

setlocal
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
    echo.
    echo  [X] Node.js no esta instalado o no esta en el PATH.
    echo.
    echo  Descargalo de: https://nodejs.org/  ^(version LTS^)
    echo  Despues volve a doble-clickear este archivo.
    echo.
    pause
    exit /b 1
)

node "%~dp0bin\install.js" %*

echo.
pause
endlocal
