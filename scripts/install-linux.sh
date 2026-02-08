#!/bin/bash

echo "========================================"
echo "Instalação TV dos Lima - Linux"
echo "========================================"
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "ERRO: Node.js não encontrado!"
    echo "Por favor, instale o Node.js:"
    echo "  Ubuntu/Debian: sudo apt-get install nodejs npm"
    echo "  CentOS/RHEL: sudo yum install nodejs npm"
    exit 1
fi

echo "[1/4] Instalando dependências..."
npm install
if [ $? -ne 0 ]; then
    echo "ERRO ao instalar dependências!"
    exit 1
fi

echo ""
echo "[2/4] Instalando PM2 globalmente..."
npm install -g pm2
if [ $? -ne 0 ]; then
    echo "AVISO: Não foi possível instalar PM2. Continuando sem PM2..."
fi

echo ""
echo "[3/4] Criando diretório de logs..."
mkdir -p logs

echo ""
echo "[4/4] Configurando PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo ""
echo "========================================"
echo "Instalação concluída!"
echo "========================================"
echo ""
echo "Comandos úteis:"
echo "  pm2 status          - Ver status"
echo "  pm2 logs tv-dos-lima - Ver logs"
echo "  pm2 restart tv-dos-lima - Reiniciar"
echo ""
echo "A aplicação está rodando em: http://localhost:3000"
echo ""
