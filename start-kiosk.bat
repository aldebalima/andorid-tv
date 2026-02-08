@echo off
echo Iniciando Smart TV em modo Kiosk...
echo.

REM Iniciar servidor Node.js em background
start /B node server.js

REM Aguardar servidor iniciar
timeout /t 3 /nobreak >nul

REM Encontrar caminho do Chrome
set CHROME_PATH=
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set CHROME_PATH=C:\Program Files\Google\Chrome\Application\chrome.exe
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set CHROME_PATH=C:\Program Files (x86)\Google\Chrome\Application\chrome.exe
) else (
    echo Chrome nao encontrado! Por favor, instale o Google Chrome.
    pause
    exit /b 1
)

REM Abrir Chrome em modo Kiosk
echo Abrindo Chrome em modo Kiosk...
"%CHROME_PATH%" --kiosk --app=http://localhost:3000

echo.
echo Pressione qualquer tecla para encerrar o servidor...
pause >nul

REM Encerrar processos Node.js
taskkill /F /IM node.exe >nul 2>&1
