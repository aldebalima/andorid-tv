# Smart TV Web - Transforme seu Notebook em Smart TV

Aplicação web que transforma um notebook antigo em uma Smart TV básica, com controle remoto via celular através da mesma rede Wi-Fi.

## Funcionalidades

- Interface de Smart TV moderna e intuitiva
- Controle remoto via celular usando WebSocket
- Suporte para Netflix, HBO Max, Prime Video, Disney+, YouTube e Spotify
- Modo Kiosk automático quando iframe não funciona
- Navegação por teclado e controle remoto
- Fullscreen automático para modo kiosk
- Detecção automática de IP para conexão

## Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM ou Yarn
- Chrome ou navegador compatível
- Notebook e celular na mesma rede Wi-Fi

## Instalação

### Instalação Rápida

1. Clone ou baixe este repositório

2. Instale as dependências:
```bash
npm install
```

### Instalação Completa com Inicialização Automática

Para instalação completa com PM2 e inicialização automática, consulte o **[TUTORIAL.md](TUTORIAL.md)** que contém instruções detalhadas para:

- Windows 10 (PM2, NSSM, Task Scheduler, .exe)
- Linux (PM2, systemd, Supervisor)
- Configuração de firewall
- Solução de problemas
- Inicialização automática ao ligar o computador

**Instalação rápida com scripts:**

**Windows:**
```bash
scripts\install-windows.bat
```

**Linux:**
```bash
chmod +x scripts/install-linux.sh
sudo ./scripts/install-linux.sh
```

## Como Usar

### 1. Iniciar o Servidor

No notebook, execute:
```bash
npm start
```

O servidor iniciará na porta 3000 (ou na porta especificada pela variável de ambiente PORT).

### 2. Abrir no Notebook (Modo TV)

Abra o Chrome no notebook e acesse:
```
http://localhost:3000
```

**Para modo Kiosk (tela cheia automática):**

No Windows, crie um atalho do Chrome com os seguintes argumentos:
```
chrome.exe --kiosk --app=http://localhost:3000
```

Ou execute via linha de comando:
```bash
chrome.exe --kiosk --app=http://localhost:3000
```

### 3. Conectar o Celular (Controle Remoto)

1. Descubra o IP local do notebook:
   - Windows: Abra o CMD e digite `ipconfig`
   - Procure por "IPv4 Address" na seção de sua conexão Wi-Fi

2. No celular, abra o navegador e acesse:
```
http://SEU_IP_LOCAL:3000/remote
```
(Substitua SEU_IP_LOCAL pelo IP encontrado no passo anterior)

Exemplo: `http://192.168.1.100:3000/remote`

### 4. Usar o Controle Remoto

- **Botões de Apps**: Toque para abrir diretamente o aplicativo
- **D-Pad**: Use para navegar na interface
- **Botão OK**: Seleciona o item atual
- **Botão Home**: Volta para a tela inicial
- **Botão Voltar**: Volta para a tela anterior
- **Swipe**: Deslize na tela para navegar (cima, baixo, esquerda, direita)

## Navegação por Teclado (Notebook)

- **Setas**: Navegar entre aplicativos
- **Enter ou Espaço**: Abrir aplicativo selecionado
- **ESC ou Backspace**: Voltar para a tela inicial

## Aplicativos Suportados

- **Netflix**: Abre em modo kiosk (iframe bloqueado)
- **HBO Max**: Abre em modo kiosk (iframe bloqueado)
- **Prime Video**: Abre em modo kiosk (iframe bloqueado)
- **Disney+**: Abre em modo kiosk (iframe bloqueado)
- **YouTube**: Tenta iframe primeiro, fallback para kiosk
- **Spotify**: Tenta iframe primeiro, fallback para kiosk

## Configuração Avançada

### Alterar Porta do Servidor

Defina a variável de ambiente PORT:
```bash
PORT=8080 npm start
```

### Modo Desenvolvimento

Para desenvolvimento com auto-reload:
```bash
npm run dev
```
(Requer nodemon instalado globalmente ou como dev dependency)

### Firewall

Se o celular não conseguir conectar, verifique o firewall do Windows:

1. Abra "Firewall do Windows Defender"
2. Clique em "Permitir um aplicativo pelo Firewall"
3. Adicione Node.js ou permita a porta 3000

## Solução de Problemas

### Celular não conecta ao servidor

1. Verifique se notebook e celular estão na mesma rede Wi-Fi
2. Verifique o IP do notebook (pode mudar ao reconectar)
3. Verifique se o firewall está bloqueando a porta
4. Tente desabilitar temporariamente o firewall para testar

### Aplicativos não abrem

- Alguns serviços (Netflix, HBO, etc.) bloqueiam iframes por segurança
- A aplicação automaticamente abre em modo kiosk quando detecta bloqueio
- Certifique-se de permitir pop-ups no navegador

### Modo Kiosk não funciona

- Certifique-se de usar Chrome ou Chromium
- Verifique se os argumentos de linha de comando estão corretos
- Alguns sistemas podem requerer permissões administrativas

## Estrutura do Projeto

```
Android-TV/
├── server.js              # Servidor Node.js com Express e Socket.IO
├── package.json           # Dependências do projeto
├── public/
│   ├── index.html        # Página principal (Smart TV)
│   ├── remote.html       # Página de controle remoto (celular)
│   ├── kiosk.html        # Página de modo kiosk
│   ├── styles.css        # Estilos da Smart TV
│   ├── remote.css        # Estilos do controle remoto
│   ├── tv-controller.js  # Lógica da Smart TV
│   └── remote-controller.js # Lógica do controle remoto
└── README.md             # Este arquivo
```

## Segurança

**Atenção**: Esta aplicação é para uso em rede local apenas. Não exponha na internet sem proteção adequada.

## Licença

MIT License - Sinta-se livre para usar e modificar conforme necessário.

## Contribuições

Sugestões e melhorias são bem-vindas! Sinta-se livre para abrir issues ou pull requests.

---

**Desenvolvido para transformar notebooks antigos em Smart TVs funcionais!**
