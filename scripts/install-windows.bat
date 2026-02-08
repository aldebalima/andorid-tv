@echo off
echo ========================================
echo Instalacao TV dos Lima - Windows
echo ========================================
echo.

REM Verificar se Node.js esta instalado
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js de https://nodejs.org
    pause
    exit /b 1
)

echo [1/4] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERRO ao instalar dependencias!
    pause
    exit /b 1
)

echo.
echo [2/4] Instalando PM2 globalmente...
call npm install -g pm2
call npm install -g pm2-windows-startup
if %errorlevel% neq 0 (
    echo AVISO: Nao foi possivel instalar PM2. Continuando sem PM2...
)

echo.
echo [3/4] Criando diretorio de logs...
if not exist "logs" mkdir logs

echo.
echo [4/4] Configurando PM2...
call pm2 start ecosystem.config.js
call pm2 save
call pm2-startup install

echo.
echo ========================================
echo Instalacao concluida!
echo ========================================
echo.
echo Comandos uteis:
echo   pm2 status          - Ver status
echo   pm2 logs tv-dos-lima - Ver logs
echo   pm2 restart tv-dos-lima - Reiniciar
echo.
echo A aplicacao esta rodando em: http://localhost:3000
echo.
pause
