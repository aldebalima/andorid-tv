@echo off
echo ========================================
echo Criando executavel .exe - TV dos Lima
echo ========================================
echo.

REM Verificar se pkg esta instalado
where pkg >nul 2>&1
if %errorlevel% neq 0 (
    echo Instalando pkg...
    call npm install -g pkg
    if %errorlevel% neq 0 (
        echo ERRO ao instalar pkg!
        pause
        exit /b 1
    )
)

echo Criando executavel...
call pkg package.json --targets node18-win-x64 --output tv-dos-lima.exe

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Executavel criado com sucesso!
    echo Arquivo: tv-dos-lima.exe
    echo ========================================
    echo.
    echo Para usar, execute: tv-dos-lima.exe
    echo.
) else (
    echo.
    echo ERRO ao criar executavel!
    echo.
)

pause
