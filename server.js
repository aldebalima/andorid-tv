const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
const os = require('os');
const https = require('https');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;

// Função para obter IP local
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Ignora endereços internos e não IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const LOCAL_IP = getLocalIP();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rotas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/remote', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'remote.html'));
});

app.get('/kiosk', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'kiosk.html'));
});

// API para obter IP do servidor
app.get('/api/ip', (req, res) => {
  res.json({ 
    ip: LOCAL_IP, 
    port: PORT,
    url: `http://${LOCAL_IP}:${PORT}`,
    remoteUrl: `http://${LOCAL_IP}:${PORT}/remote`
  });
});

// Dicas de filme do dia (rotaciona diariamente)
const movieTips = [
  '🎬 Filme do Dia: O Poderoso Chefão - Um clássico do cinema que você precisa assistir!',
  '🎬 Dica: Matrix - Uma experiência cinematográfica única e revolucionária',
  '🎬 Recomendação: Interestelar - Uma jornada épica pelo espaço e tempo',
  '🎬 Filme do Dia: A Origem - Um thriller psicológico que vai te surpreender',
  '🎬 Dica: O Lobo de Wall Street - Uma história fascinante sobre ambição',
  '🎬 Recomendação: Parasita - Um filme que vai te prender do início ao fim',
  '🎬 Filme do Dia: Pulp Fiction - Um clássico cult que nunca sai de moda',
  '🎬 Dica: Clube da Luta - Um filme que vai te fazer pensar',
  '🎬 Recomendação: O Iluminado - Um dos melhores filmes de terror já feitos',
  '🎬 Filme do Dia: Forrest Gump - Uma história emocionante e inspiradora'
];

// Obter dica do dia baseada na data
function getMovieTipOfDay() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  const tipIndex = dayOfYear % movieTips.length;
  return movieTips[tipIndex];
}

// API para buscar notícias
app.get('/api/news', async (req, res) => {
  try {
    // Usar RSS feed do G1 (público e gratuito)
    const rssUrl = 'https://g1.globo.com/rss/g1/';
    
    https.get(rssUrl, (rssRes) => {
      let data = '';
      
      rssRes.on('data', (chunk) => {
        data += chunk;
      });
      
      rssRes.on('end', () => {
        try {
          // Parse XML simples (sem biblioteca externa para manter simples)
          const items = [];
          const itemMatches = data.match(/<item>[\s\S]*?<\/item>/g);
          
          if (itemMatches) {
            itemMatches.slice(0, 10).forEach(item => {
              const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/);
              if (titleMatch) {
                const title = titleMatch[1] || titleMatch[2];
                if (title && !title.includes('G1')) {
                  items.push({ title: title.trim() });
                }
              }
            });
          }
          
          if (items.length > 0) {
            // Adicionar dica de filme no início
            res.json({ articles: [{ title: getMovieTipOfDay() }, ...items] });
          } else {
            // Fallback para notícias padrão com dica de filme
            res.json({ 
              articles: [
                { title: getMovieTipOfDay() },
                { title: 'Brasil: Acompanhe as principais notícias do país' },
                { title: 'Mundo: Últimas notícias internacionais' },
                { title: 'Tecnologia: Novidades do mundo tech' },
                { title: 'Esportes: Principais eventos esportivos' },
                { title: 'Entretenimento: Cinema, TV e cultura' }
              ] 
            });
          }
        } catch (error) {
          console.error('Erro ao processar RSS:', error);
          res.json({ 
            articles: [
              { title: getMovieTipOfDay() },
              { title: 'TV dos Lima - Sua Smart TV pessoal' },
              { title: 'Use o controle remoto no celular para navegar' }
            ] 
          });
        }
      });
    }).on('error', (error) => {
      console.error('Erro ao buscar notícias:', error);
      res.json({ 
        articles: [
          { title: getMovieTipOfDay() },
          { title: 'TV dos Lima - Sua Smart TV pessoal' },
          { title: 'Use o controle remoto no celular para navegar' },
          { title: 'Aproveite seus aplicativos favoritos' }
        ] 
      });
    });
  } catch (error) {
    console.error('Erro na API de notícias:', error);
    res.json({ 
      articles: [
        { title: getMovieTipOfDay() },
        { title: 'TV dos Lima - Sua Smart TV pessoal' },
        { title: 'Use o controle remoto no celular para navegar' }
      ] 
    });
  }
});

// WebSocket para controle remoto
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  socket.on('navigate', (data) => {
    // Envia comando de navegação para todos os clientes TV
    io.emit('navigate', data);
  });

  socket.on('keypress', (data) => {
    // Envia comando de tecla para todos os clientes TV
    io.emit('keypress', data);
  });

  socket.on('open-app', (data) => {
    // Envia comando para abrir aplicativo
    io.emit('open-app', data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n========================================`);
  console.log(`Smart TV Web - Servidor Iniciado!`);
  console.log(`========================================`);
  console.log(`Notebook: http://localhost:${PORT}`);
  console.log(`Celular:  http://${LOCAL_IP}:${PORT}/remote`);
  console.log(`IP Local: ${LOCAL_IP}`);
  console.log(`========================================\n`);
});
