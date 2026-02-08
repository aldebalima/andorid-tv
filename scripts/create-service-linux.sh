#!/bin/bash

# Script para criar serviço systemd no Linux
# Requer: Executado como root (sudo)

SERVICE_NAME="tv-dos-lima"
USER=$(whoami)
PROJECT_DIR=$(cd "$(dirname "$0")/.." && pwd)
NODE_PATH=$(which node)

echo "Criando serviço systemd: $SERVICE_NAME"
echo "Usuário: $USER"
echo "Diretório: $PROJECT_DIR"
echo "Node.js: $NODE_PATH"
echo ""

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then 
    echo "ERRO: Este script deve ser executado como root (use sudo)"
    exit 1
fi

# Criar arquivo de serviço
SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"

cat > $SERVICE_FILE <<EOF
[Unit]
Description=TV dos Lima - Smart TV Web Application
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$PROJECT_DIR
ExecStart=$NODE_PATH $PROJECT_DIR/server.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=$SERVICE_NAME
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOF

echo "Arquivo de serviço criado: $SERVICE_FILE"
echo ""

# Recarregar systemd
systemctl daemon-reload

# Habilitar e iniciar serviço
systemctl enable $SERVICE_NAME
systemctl start $SERVICE_NAME

echo ""
echo "Serviço criado e iniciado com sucesso!"
echo ""
echo "Comandos úteis:"
echo "  sudo systemctl status $SERVICE_NAME  - Ver status"
echo "  sudo systemctl restart $SERVICE_NAME - Reiniciar"
echo "  sudo systemctl stop $SERVICE_NAME    - Parar"
echo "  sudo journalctl -u $SERVICE_NAME -f  - Ver logs"
echo ""
