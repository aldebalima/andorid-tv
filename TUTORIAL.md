# Tutorial de Instalação - TV dos Lima

Guia completo para instalar e configurar a TV dos Lima no Windows 10 e Linux.

## Pré-requisitos

- Node.js versão 14 ou superior
- NPM (vem com Node.js)
- Acesso de administrador (para inicialização automática)

## Instalação Rápida

### 1. Instalar Dependências

```bash
npm install
```

## Windows 10

### Opção 1: Usando PM2 (Recomendado)

#### Passo 1: Instalar PM2 Globalmente

```bash
npm install -g pm2
npm install -g pm2-windows-startup
```

#### Passo 2: Iniciar a Aplicação com PM2

```bash
pm2 start server.js --name "tv-dos-lima"
```

#### Passo 3: Salvar Configuração do PM2

```bash
pm2 save
```

#### Passo 4: Configurar Inicialização Automática

```bash
pm2-startup install
```

Isso configurará o PM2 para iniciar automaticamente quando o Windows iniciar.

#### Comandos Úteis do PM2

```bash
# Ver status
pm2 status

# Ver logs
pm2 logs tv-dos-lima

# Reiniciar
pm2 restart tv-dos-lima

# Parar
pm2 stop tv-dos-lima

# Remover da inicialização automática
pm2-startup uninstall
```

### Opção 2: Usando NSSM (Non-Sucking Service Manager)

#### Passo 1: Baixar NSSM

1. Acesse: https://nssm.cc/download
2. Baixe a versão para Windows (64-bit)
3. Extraia em uma pasta (ex: `C:\nssm`)

#### Passo 2: Instalar como Serviço

Abra o PowerShell como Administrador e execute:

```powershell
cd C:\nssm\win64
.\nssm install TVDosLima "C:\Program Files\nodejs\node.exe" "C:\caminho\para\seu\projeto\server.js"
```

Ajuste os caminhos conforme sua instalação.

#### Passo 3: Configurar o Serviço

```powershell
# Definir diretório de trabalho
.\nssm set TVDosLima AppDirectory "C:\caminho\para\seu\projeto"

# Iniciar o serviço
.\nssm start TVDosLima
```

### Opção 3: Usando Task Scheduler (Agendador de Tarefas)

#### Passo 1: Criar Script de Inicialização

Crie um arquivo `start-tv.bat`:

```batch
@echo off
cd /d "C:\caminho\para\seu\projeto"
node server.js
```

#### Passo 2: Configurar no Agendador de Tarefas

1. Abra o "Agendador de Tarefas" (Task Scheduler)
2. Clique em "Criar Tarefa Básica"
3. Nome: "TV dos Lima"
4. Gatilho: "Quando o computador iniciar"
5. Ação: "Iniciar um programa"
6. Programa: `C:\caminho\para\start-tv.bat`
7. Marque "Executar com privilégios mais altos"

### Opção 4: Executável .exe (Opcional)

#### Passo 1: Instalar pkg

```bash
npm install -g pkg
```

#### Passo 2: Criar Executável

```bash
pkg package.json --targets node14-win-x64 --output tv-dos-lima.exe
```

#### Passo 3: Criar Script de Inicialização

Crie `start-tv.bat`:

```batch
@echo off
cd /d "%~dp0"
start "" "tv-dos-lima.exe"
```

Adicione este arquivo .bat à inicialização automática do Windows.

## Linux

### Opção 1: Usando PM2 (Recomendado)

#### Passo 1: Instalar PM2 Globalmente

```bash
npm install -g pm2
```

#### Passo 2: Iniciar a Aplicação com PM2

```bash
pm2 start server.js --name "tv-dos-lima"
```

#### Passo 3: Salvar Configuração do PM2

```bash
pm2 save
```

#### Passo 4: Configurar Inicialização Automática

```bash
pm2 startup
```

Siga as instruções exibidas (geralmente copiar e colar o comando fornecido).

#### Comandos Úteis do PM2

```bash
# Ver status
pm2 status

# Ver logs
pm2 logs tv-dos-lima

# Reiniciar
pm2 restart tv-dos-lima

# Parar
pm2 stop tv-dos-lima

# Remover da inicialização automática
pm2 unstartup
```

### Opção 2: Usando systemd (Serviço do Sistema)

#### Passo 1: Criar Arquivo de Serviço

Crie o arquivo `/etc/systemd/system/tv-dos-lima.service`:

```ini
[Unit]
Description=TV dos Lima - Smart TV Web Application
After=network.target

[Service]
Type=simple
User=seu-usuario
WorkingDirectory=/caminho/para/seu/projeto
ExecStart=/usr/bin/node /caminho/para/seu/projeto/server.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=tv-dos-lima

[Install]
WantedBy=multi-user.target
```

**Importante:** Substitua:
- `seu-usuario` pelo seu usuário Linux
- `/caminho/para/seu/projeto` pelo caminho completo do projeto
- `/usr/bin/node` pelo caminho do Node.js (use `which node` para encontrar)

#### Passo 2: Recarregar systemd

```bash
sudo systemctl daemon-reload
```

#### Passo 3: Habilitar e Iniciar o Serviço

```bash
sudo systemctl enable tv-dos-lima
sudo systemctl start tv-dos-lima
```

#### Comandos Úteis do systemd

```bash
# Ver status
sudo systemctl status tv-dos-lima

# Ver logs
sudo journalctl -u tv-dos-lima -f

# Reiniciar
sudo systemctl restart tv-dos-lima

# Parar
sudo systemctl stop tv-dos-lima

# Desabilitar inicialização automática
sudo systemctl disable tv-dos-lima
```

### Opção 3: Usando Supervisor

#### Passo 1: Instalar Supervisor

```bash
# Ubuntu/Debian
sudo apt-get install supervisor

# CentOS/RHEL
sudo yum install supervisor
```

#### Passo 2: Criar Configuração

Crie o arquivo `/etc/supervisor/conf.d/tv-dos-lima.conf`:

```ini
[program:tv-dos-lima]
command=/usr/bin/node /caminho/para/seu/projeto/server.js
directory=/caminho/para/seu/projeto
user=seu-usuario
autostart=true
autorestart=true
stderr_logfile=/var/log/tv-dos-lima.err.log
stdout_logfile=/var/log/tv-dos-lima.out.log
```

#### Passo 3: Recarregar e Iniciar

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start tv-dos-lima
```

## Configuração Adicional

### Variáveis de Ambiente

Você pode configurar a porta usando variáveis de ambiente:

**Windows:**
```batch
set PORT=3000
node server.js
```

**Linux:**
```bash
export PORT=3000
node server.js
```

Ou crie um arquivo `.env` na raiz do projeto:

```
PORT=3000
```

### Firewall

#### Windows 10

1. Abra "Firewall do Windows Defender"
2. Clique em "Permitir um aplicativo pelo Firewall"
3. Adicione Node.js ou permita a porta 3000

#### Linux (UFW)

```bash
sudo ufw allow 3000/tcp
```

#### Linux (firewalld)

```bash
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload
```

## Solução de Problemas

### PM2 não inicia automaticamente

**Windows:**
```bash
pm2-startup uninstall
pm2-startup install
pm2 save
```

**Linux:**
```bash
pm2 unstartup
pm2 startup
pm2 save
```

### Porta já em uso

Altere a porta no arquivo `.env` ou variável de ambiente:

```bash
PORT=8080 node server.js
```

### Serviço não inicia

Verifique os logs:

**PM2:**
```bash
pm2 logs tv-dos-lima
```

**systemd:**
```bash
sudo journalctl -u tv-dos-lima -n 50
```

**Supervisor:**
```bash
sudo supervisorctl tail -f tv-dos-lima
```

### Permissões

Certifique-se de que o usuário tem permissões adequadas:

**Linux:**
```bash
sudo chown -R seu-usuario:seu-usuario /caminho/para/seu/projeto
```

## Acessar a Aplicação

Após iniciar o servidor:

- **Notebook/TV:** http://localhost:3000
- **Celular (controle remoto):** http://SEU_IP_LOCAL:3000/remote

Para descobrir seu IP local:

**Windows:**
```cmd
ipconfig
```

**Linux:**
```bash
hostname -I
# ou
ip addr show
```

## Atualização

Para atualizar a aplicação:

1. Pare o serviço
2. Atualize os arquivos
3. Execute `npm install` se houver novas dependências
4. Reinicie o serviço

**PM2:**
```bash
pm2 restart tv-dos-lima
```

**systemd:**
```bash
sudo systemctl restart tv-dos-lima
```

## Notas Importantes

- O PM2 reinicia automaticamente a aplicação em caso de falha
- Os logs são mantidos automaticamente pelo PM2
- Para produção, considere usar um proxy reverso (nginx) na frente
- Mantenha o Node.js atualizado para segurança

## Suporte

Em caso de problemas, verifique:
1. Logs do serviço
2. Porta disponível
3. Firewall configurado
4. Permissões de arquivo
5. Node.js instalado corretamente

---

**Desenvolvido para transformar notebooks antigos em Smart TVs funcionais!**
