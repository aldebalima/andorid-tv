# Script para criar serviço Windows usando NSSM
# Requer: NSSM instalado e executado como Administrador

$serviceName = "TVDosLima"
$nodePath = (Get-Command node).Source
$scriptPath = Join-Path $PSScriptRoot "..\server.js"
$workingDir = Split-Path $scriptPath

Write-Host "Criando serviço Windows: $serviceName" -ForegroundColor Green
Write-Host "Node.js: $nodePath" -ForegroundColor Yellow
Write-Host "Script: $scriptPath" -ForegroundColor Yellow
Write-Host "Diretório: $workingDir" -ForegroundColor Yellow
Write-Host ""

# Verificar se NSSM está disponível
$nssmPath = "C:\nssm\win64\nssm.exe"
if (-not (Test-Path $nssmPath)) {
    Write-Host "ERRO: NSSM não encontrado em $nssmPath" -ForegroundColor Red
    Write-Host "Por favor, baixe NSSM de https://nssm.cc/download" -ForegroundColor Yellow
    Write-Host "E extraia em C:\nssm\" -ForegroundColor Yellow
    exit 1
}

# Instalar serviço
& $nssmPath install $serviceName $nodePath $scriptPath
& $nssmPath set $serviceName AppDirectory $workingDir
& $nssmPath set $serviceName DisplayName "TV dos Lima"
& $nssmPath set $serviceName Description "Smart TV Web Application - TV dos Lima"
& $nssmPath set $serviceName Start SERVICE_AUTO_START
& $nssmPath set $serviceName AppStdout "$workingDir\logs\service-out.log"
& $nssmPath set $serviceName AppStderr "$workingDir\logs\service-err.log"

Write-Host ""
Write-Host "Serviço criado com sucesso!" -ForegroundColor Green
Write-Host "Para iniciar: Start-Service $serviceName" -ForegroundColor Yellow
Write-Host "Para parar: Stop-Service $serviceName" -ForegroundColor Yellow
