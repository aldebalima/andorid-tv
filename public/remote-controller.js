let socket = null;
let serverIP = '';

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initializeSocket();
    setupEventListeners();
    detectServerIP();
});

// Inicializar WebSocket
function initializeSocket() {
    // Detectar IP do servidor automaticamente
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    const port = window.location.port || '3000';
    
    socket = io(`${protocol}//${host}:${port}`);
    
    socket.on('connect', () => {
        updateConnectionStatus(true);
        console.log('Conectado ao servidor');
    });
    
    socket.on('disconnect', () => {
        updateConnectionStatus(false);
        console.log('Desconectado do servidor');
    });
    
    socket.on('connect_error', (error) => {
        console.error('Erro de conexão:', error);
        updateConnectionStatus(false);
    });
}

// Atualizar status de conexão
function updateConnectionStatus(connected) {
    const statusEl = document.getElementById('connectionStatus');
    const dot = statusEl.querySelector('.status-dot');
    const text = statusEl.querySelector('span:last-child');
    
    if (connected) {
        dot.classList.add('connected');
        text.textContent = 'Conectado';
    } else {
        dot.classList.remove('connected');
        text.textContent = 'Desconectado';
    }
}

// Detectar IP do servidor
function detectServerIP() {
    const hostname = window.location.hostname;
    const port = window.location.port || '3000';
    
    // Tentar obter IP via API primeiro
    fetch('/api/ip')
        .then(response => response.json())
        .then(data => {
            serverIP = `${data.ip}:${data.port}`;
            document.getElementById('serverIP').textContent = serverIP;
        })
        .catch(() => {
            // Fallback: usar hostname atual
            if (hostname === 'localhost' || hostname === '127.0.0.1') {
                // Tentar obter IP via WebRTC (funciona em alguns navegadores)
                getLocalIP().then(ip => {
                    if (ip) {
                        serverIP = `${ip}:${port}`;
                    } else {
                        serverIP = `${hostname}:${port}`;
                    }
                    document.getElementById('serverIP').textContent = serverIP;
                }).catch(() => {
                    serverIP = `${hostname}:${port}`;
                    document.getElementById('serverIP').textContent = serverIP;
                });
            } else {
                serverIP = `${hostname}:${port}`;
                document.getElementById('serverIP').textContent = serverIP;
            }
        });
}

// Obter IP local via WebRTC
function getLocalIP() {
    return new Promise((resolve, reject) => {
        const RTCPeerConnection = window.RTCPeerConnection || 
                                 window.mozRTCPeerConnection || 
                                 window.webkitRTCPeerConnection;
        
        if (!RTCPeerConnection) {
            reject(new Error('WebRTC não suportado'));
            return;
        }
        
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        
        pc.createDataChannel('');
        
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                const candidate = event.candidate.candidate;
                const match = candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3})/);
                if (match) {
                    const ip = match[1];
                    if (ip.startsWith('192.168.') || 
                        ip.startsWith('10.') || 
                        ip.startsWith('172.')) {
                        pc.close();
                        resolve(ip);
                    }
                }
            }
        };
        
        pc.createOffer()
            .then(offer => pc.setLocalDescription(offer))
            .catch(reject);
        
        setTimeout(() => {
            pc.close();
            reject(new Error('Timeout ao obter IP'));
        }, 3000);
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Botões de aplicativos
    document.querySelectorAll('.app-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const appId = btn.dataset.app;
            sendCommand('open-app', { appId });
            
            // Feedback visual
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        });
    });
    
    // D-Pad
    document.querySelectorAll('.d-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const direction = btn.dataset.direction;
            if (direction === 'select') {
                sendCommand('navigate', { direction: 'select' });
            } else {
                sendCommand('navigate', { direction });
            }
            
            // Feedback visual
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        });
    });
    
    // Botões de ação
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            if (action === 'home') {
                sendCommand('navigate', { direction: 'home' });
            } else if (action === 'back') {
                sendCommand('keypress', { key: 'Escape' });
            }
            
            // Feedback visual
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 150);
        });
    });
    
    // Suporte para gestos touch (swipe)
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        if (!touchStartX || !touchStartY) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        const minSwipeDistance = 50;
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Swipe horizontal
            if (Math.abs(diffX) > minSwipeDistance) {
                if (diffX > 0) {
                    sendCommand('navigate', { direction: 'left' });
                } else {
                    sendCommand('navigate', { direction: 'right' });
                }
            }
        } else {
            // Swipe vertical
            if (Math.abs(diffY) > minSwipeDistance) {
                if (diffY > 0) {
                    sendCommand('navigate', { direction: 'up' });
                } else {
                    sendCommand('navigate', { direction: 'down' });
                }
            }
        }
        
        touchStartX = 0;
        touchStartY = 0;
    });
}

// Enviar comando
function sendCommand(type, data) {
    if (socket && socket.connected) {
        socket.emit(type, data);
        console.log('Comando enviado:', type, data);
    } else {
        console.error('Socket não conectado');
        updateConnectionStatus(false);
    }
}
