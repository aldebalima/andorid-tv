// Configuração dos aplicativos
// Nota: A maioria dos serviços bloqueia iframes por segurança (X-Frame-Options, CSP)
// Por isso, todos abrem diretamente em modo kiosk
const apps = [
    {
        id: 'netflix',
        name: 'Netflix',
        url: 'https://www.netflix.com',
        icon: 'N',
        iframeAllowed: false // Bloqueado por X-Frame-Options
    },
    {
        id: 'hbo',
        name: 'HBO Max',
        url: 'https://www.hbomax.com',
        icon: 'H',
        iframeAllowed: false // Bloqueado por X-Frame-Options
    },
    {
        id: 'prime',
        name: 'Prime Video',
        url: 'https://www.primevideo.com',
        icon: 'P',
        iframeAllowed: false // Bloqueado por X-Frame-Options
    },
    {
        id: 'disney',
        name: 'Disney+',
        url: 'https://www.disneyplus.com',
        icon: 'D',
        iframeAllowed: false // Bloqueado por X-Frame-Options
    },
    {
        id: 'youtube',
        name: 'YouTube',
        url: 'https://www.youtube.com/tv',
        icon: 'Y',
        iframeAllowed: false // Bloqueado por X-Frame-Options: sameorigin
    },
    {
        id: 'spotify',
        name: 'Spotify',
        url: 'https://open.spotify.com',
        icon: 'S',
        iframeAllowed: false // Bloqueado por Content-Security-Policy
    }
];

// Estado da aplicação
let currentApp = null;
let selectedAppIndex = 0;
let socket = null;
let iframeLoadTimeout = null;

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initializeSocket();
    renderApps();
    setupKeyboardNavigation();
    showHomeScreen();
    initializeWallpaper();
    generateQRCode();
});

// Inicializar WebSocket
function initializeSocket() {
    socket = io();
    
    socket.on('connect', () => {
        updateConnectionStatus(true);
        console.log('Conectado ao servidor');
    });
    
    socket.on('disconnect', () => {
        updateConnectionStatus(false);
        console.log('Desconectado do servidor');
    });
    
    socket.on('navigate', (data) => {
        handleNavigation(data);
    });
    
    socket.on('keypress', (data) => {
        handleKeyPress(data);
    });
    
    socket.on('open-app', (data) => {
        openApp(data.appId);
    });
}

// Atualizar status de conexão
function updateConnectionStatus(connected) {
    const statusEl = document.getElementById('connectionStatus');
    const dot = statusEl.querySelector('.status-dot');
    const text = statusEl.querySelector('span:last-child');
    
    if (connected) {
        dot.style.background = '#4caf50';
        text.textContent = 'Conectado';
    } else {
        dot.style.background = '#f44336';
        text.textContent = 'Desconectado';
    }
}

// Renderizar aplicativos na tela inicial
function renderApps() {
    const appGrid = document.getElementById('appGrid');
    appGrid.innerHTML = '';
    
    apps.forEach((app, index) => {
        const appCard = document.createElement('div');
        appCard.className = `app-card ${app.id}`;
        appCard.dataset.appId = app.id;
        appCard.dataset.index = index;
        
        appCard.innerHTML = `
            <div class="app-icon">${app.icon}</div>
            <div class="app-name">${app.name}</div>
        `;
        
        appCard.addEventListener('click', () => openApp(app.id));
        appGrid.appendChild(appCard);
    });
}

// Mostrar tela inicial
function showHomeScreen() {
    const homeScreen = document.getElementById('homeScreen');
    const contentFrame = document.getElementById('contentFrame');
    
    homeScreen.style.display = 'block';
    contentFrame.style.display = 'none';
    currentApp = null;
    selectedAppIndex = 0;
    updateAppSelection();
    generateQRCode(); // Regenerar QR Code quando voltar para home
}

// Inicializar painel de imagens rotacionando
function initializeWallpaper() {
    const slides = document.querySelectorAll('.wallpaper-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 8000); // Trocar a cada 8 segundos
}

// Variáveis para controlar se os QR Codes já foram gerados
let qrCodePlayStoreGenerated = false;
let qrCodeAppStoreGenerated = false;

// Gerar QR Codes para apps de controle
function generateQRCode() {
    const qrPlayStore = document.getElementById('qrcode-playstore');
    const qrAppStore = document.getElementById('qrcode-appstore');
    
    if (!qrPlayStore || !qrAppStore) return;
    
    // URLs dos apps (substitua pelos IDs reais quando disponíveis)
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.unifiedremote.full';
    const appStoreUrl = 'https://apps.apple.com/app/unified-remote/id825534179';
    
    // Função para gerar QR Code
    function generateQR(container, url, isPlayStore) {
        const isGenerated = isPlayStore ? qrCodePlayStoreGenerated : qrCodeAppStoreGenerated;
        
        // Verificar se já foi gerado
        if (isGenerated && container.querySelector('canvas')) {
            return;
        }
        
        // Limpar container
        container.innerHTML = '';
        
        if (typeof QRCode !== 'undefined') {
            try {
                new QRCode(container, {
                    text: url,
                    width: 180,
                    height: 180,
                    colorDark: '#000000',
                    colorLight: '#ffffff',
                    correctLevel: QRCode.CorrectLevel.H
                });
                
                if (isPlayStore) {
                    qrCodePlayStoreGenerated = true;
                } else {
                    qrCodeAppStoreGenerated = true;
                }
            } catch (error) {
                console.error('Erro ao gerar QR Code:', error);
                showQRFallback(container, url);
            }
        } else {
            // Tentar novamente após um delay
            setTimeout(() => {
                if (typeof QRCode !== 'undefined') {
                    generateQR(container, url, isPlayStore);
                } else {
                    showQRFallback(container, url);
                }
            }, 500);
        }
    }
    
    function showQRFallback(container, url) {
        container.innerHTML = `
            <div style="padding: 15px; color: #fff; text-align: center; background: rgba(0,0,0,0.3); border-radius: 10px; min-width: 180px; min-height: 180px; display: flex; flex-direction: column; justify-content: center;">
                <p style="font-size: 12px; word-break: break-all;">${url}</p>
            </div>
        `;
    }
    
    // Gerar ambos os QR Codes
    generateQR(qrPlayStore, playStoreUrl, true);
    generateQR(qrAppStore, appStoreUrl, false);
}

// Abrir aplicativo
function openApp(appId) {
    const app = apps.find(a => a.id === appId);
    if (!app) return;
    
    currentApp = app;
    const homeScreen = document.getElementById('homeScreen');
    const contentFrame = document.getElementById('contentFrame');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const errorMessage = document.getElementById('errorMessage');
    
    // Esconder mensagem de erro
    errorMessage.style.display = 'none';
    
    // Como a maioria dos serviços bloqueia iframes, vamos tentar iframe primeiro
    // apenas se permitido, caso contrário abrir direto em kiosk
    if (!app.iframeAllowed) {
        // Abrir diretamente em modo kiosk sem tentar iframe
        openInKioskMode(app, false);
        return;
    }
    
    // Tentar carregar no iframe (para apps que podem funcionar)
    homeScreen.style.display = 'none';
    contentFrame.style.display = 'block';
    loadingOverlay.style.display = 'flex';
    loadingOverlay.querySelector('p').textContent = `Carregando ${app.name}...`;
    
    let iframeBlocked = false;
    let loadCheckTimeout = null;
    
    // Detectar bloqueio de iframe rapidamente
    const detectBlock = () => {
        try {
            // Tentar acessar o conteúdo do iframe
            const frame = document.getElementById('contentFrame');
            const frameDoc = frame.contentDocument || frame.contentWindow.document;
            
            // Se chegou aqui sem erro, o iframe carregou
            if (frameDoc && frameDoc.body) {
                clearTimeout(loadCheckTimeout);
                loadingOverlay.style.display = 'none';
                return true;
            }
        } catch (e) {
            // Erro de CORS ou iframe bloqueado
            if (!iframeBlocked) {
                iframeBlocked = true;
                clearTimeout(loadCheckTimeout);
                console.log('Iframe bloqueado detectado:', e.message);
                openInKioskMode(app, true);
                return false;
            }
        }
        return false;
    };
    
    // Verificar bloqueio após um curto delay
    loadCheckTimeout = setTimeout(() => {
        if (!detectBlock()) {
            // Timeout - provavelmente bloqueado
            openInKioskMode(app, true);
        }
    }, 2000);
    
    contentFrame.src = app.url;
    
    contentFrame.onload = () => {
        // Aguardar um pouco para verificar se realmente carregou
        setTimeout(() => {
            if (!detectBlock() && !iframeBlocked) {
                clearTimeout(loadCheckTimeout);
                loadingOverlay.style.display = 'none';
            }
        }, 500);
    };
    
    contentFrame.onerror = () => {
        clearTimeout(loadCheckTimeout);
        loadingOverlay.style.display = 'none';
        openInKioskMode(app, true);
    };
    
    // Listener para mensagens de erro do console (se possível)
    window.addEventListener('message', (event) => {
        // Alguns navegadores enviam mensagens quando iframe é bloqueado
        if (event.data && typeof event.data === 'string' && 
            (event.data.includes('X-Frame-Options') || 
             event.data.includes('frame-ancestors') ||
             event.data.includes('Content-Security-Policy'))) {
            if (!iframeBlocked) {
                iframeBlocked = true;
                clearTimeout(loadCheckTimeout);
                openInKioskMode(app, true);
            }
        }
    });
}

// Abrir aplicativo em nova aba (sempre)
function openInKioskMode(app, showMessage = true) {
    const errorMessage = document.getElementById('errorMessage');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const homeScreen = document.getElementById('homeScreen');
    const contentFrame = document.getElementById('contentFrame');
    
    // Limpar iframe se estava tentando carregar
    if (contentFrame) {
        contentFrame.src = 'about:blank';
        contentFrame.style.display = 'none';
    }
    
    // Mostrar tela inicial novamente
    homeScreen.style.display = 'flex';
    loadingOverlay.style.display = 'none';
    
    if (showMessage) {
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = `<p>Abrindo ${app.name} em nova aba...</p>`;
    }
    
    // Abrir diretamente a URL do app em nova aba (sem redirecionamento para /kiosk)
    const newTab = window.open(app.url, '_blank');
    
    if (!newTab) {
        // Se pop-up foi bloqueado, oferecer alternativas
        errorMessage.style.display = 'block';
        errorMessage.innerHTML = `
            <p>⚠️ Não foi possível abrir em nova aba</p>
            <p style="font-size: 14px; margin-top: 10px;">
                Pop-ups podem estar bloqueados. Use o botão abaixo:
            </p>
            <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <a href="${app.url}" target="_blank" style="display: inline-block; padding: 10px 20px; background: #2196f3; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Abrir ${app.name} Diretamente
                </a>
            </div>
        `;
    } else {
        // Tentar entrar em fullscreen após a aba carregar (se possível)
        // Nota: Fullscreen em nova aba requer interação do usuário na maioria dos navegadores
        if (showMessage) {
            setTimeout(() => {
                errorMessage.style.display = 'none';
            }, 1500);
        }
        
        // Tentar fullscreen (pode não funcionar devido a políticas de segurança)
        setTimeout(() => {
            try {
                if (newTab && !newTab.closed) {
                    // Enviar mensagem para tentar fullscreen (requer código na nova aba)
                    try {
                        newTab.postMessage('requestFullscreen', '*');
                    } catch (e) {
                        console.log('Não foi possível solicitar fullscreen:', e);
                    }
                }
            } catch (e) {
                console.log('Erro ao tentar fullscreen:', e);
            }
        }, 1000);
    }
}

// Navegação por teclado
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('homeScreen').style.display === 'flex') {
            handleHomeNavigation(e);
        }
    });
}

// Navegação na tela inicial
function handleHomeNavigation(e) {
    const appCards = document.querySelectorAll('.app-card');
    
    switch(e.key) {
        case 'ArrowRight':
            selectedAppIndex = Math.min(selectedAppIndex + 1, appCards.length - 1);
            updateAppSelection();
            break;
        case 'ArrowLeft':
            selectedAppIndex = Math.max(selectedAppIndex - 1, 0);
            updateAppSelection();
            break;
        case 'ArrowUp':
            selectedAppIndex = Math.max(selectedAppIndex - 3, 0);
            updateAppSelection();
            break;
        case 'ArrowDown':
            selectedAppIndex = Math.min(selectedAppIndex + 3, appCards.length - 1);
            updateAppSelection();
            break;
        case 'Enter':
        case ' ':
            if (appCards[selectedAppIndex]) {
                openApp(appCards[selectedAppIndex].dataset.appId);
            }
            break;
        case 'Escape':
        case 'Backspace':
            showHomeScreen();
            break;
    }
}

// Atualizar seleção visual
function updateAppSelection() {
    const appCards = document.querySelectorAll('.app-card');
    appCards.forEach((card, index) => {
        if (index === selectedAppIndex) {
            card.classList.add('focused');
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            card.classList.remove('focused');
        }
    });
}

// Handlers de comandos remotos
function handleNavigation(data) {
    if (document.getElementById('homeScreen').style.display === 'flex') {
        const appCards = document.querySelectorAll('.app-card');
        
        switch(data.direction) {
            case 'right':
                selectedAppIndex = Math.min(selectedAppIndex + 1, appCards.length - 1);
                updateAppSelection();
                break;
            case 'left':
                selectedAppIndex = Math.max(selectedAppIndex - 1, 0);
                updateAppSelection();
                break;
            case 'up':
                selectedAppIndex = Math.max(selectedAppIndex - 3, 0);
                updateAppSelection();
                break;
            case 'down':
                selectedAppIndex = Math.min(selectedAppIndex + 3, appCards.length - 1);
                updateAppSelection();
                break;
            case 'select':
                if (appCards[selectedAppIndex]) {
                    openApp(appCards[selectedAppIndex].dataset.appId);
                }
                break;
            case 'home':
                showHomeScreen();
                break;
        }
    }
}

function handleKeyPress(data) {
    const event = new KeyboardEvent('keydown', { key: data.key });
    document.dispatchEvent(event);
}

// Expor função para abrir app globalmente
window.openApp = openApp;
window.showHomeScreen = showHomeScreen;
