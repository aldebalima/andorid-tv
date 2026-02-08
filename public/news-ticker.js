// Banner de notícias rotacionando
let currentNewsIndex = 0;
let newsItems = [];
let newsUpdateInterval = null;

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

// Função para buscar notícias
async function fetchNews() {
    try {
        // Notícias padrão incluindo dica de filme
        const defaultNews = [
            getMovieTipOfDay(), // Adicionar dica de filme do dia
            'Brasil: Últimas notícias de política, economia e tecnologia',
            'Mundo: Acompanhe as principais notícias internacionais',
            'Esportes: Fique por dentro dos principais eventos esportivos',
            'Tecnologia: As últimas novidades do mundo tech',
            'Entretenimento: Notícias sobre cinema, TV e cultura'
        ];
        
        // Tentar buscar notícias reais via servidor
        try {
            const response = await fetch('/api/news');
            if (response.ok) {
                const data = await response.json();
                if (data.articles && data.articles.length > 0) {
                    // Adicionar dica de filme no início
                    newsItems = [getMovieTipOfDay(), ...data.articles.map(article => article.title)];
                } else {
                    newsItems = defaultNews;
                }
            } else {
                newsItems = defaultNews;
            }
        } catch (error) {
            console.log('Usando notícias padrão:', error);
            newsItems = defaultNews;
        }
        
        if (newsItems.length === 0) {
            newsItems = defaultNews;
        }
        
        displayNews();
    } catch (error) {
        console.error('Erro ao buscar notícias:', error);
        newsItems = [
            getMovieTipOfDay(),
            'TV dos Lima - Sua Smart TV pessoal',
            'Use o controle remoto no celular para navegar',
            'Aproveite seus aplicativos favoritos'
        ];
        displayNews();
    }
}

// Exibir notícias rotacionando
function displayNews() {
    const newsContent = document.getElementById('newsContent');
    if (!newsContent || newsItems.length === 0) return;
    
    // Limpar notícias antigas
    newsContent.innerHTML = '';
    
    // Criar elemento para a notícia atual
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item active';
    newsItem.textContent = newsItems[currentNewsIndex];
    newsContent.appendChild(newsItem);
    
    // Rotacionar notícias a cada 5 segundos
    if (newsUpdateInterval) {
        clearInterval(newsUpdateInterval);
    }
    
    newsUpdateInterval = setInterval(() => {
        const currentItem = newsContent.querySelector('.news-item.active');
        
        if (currentItem) {
            // Fade out
            currentItem.classList.remove('active');
            currentItem.classList.add('fade-out');
            
            // Remover após animação
            setTimeout(() => {
                currentItem.remove();
            }, 500);
        }
        
        // Próxima notícia
        currentNewsIndex = (currentNewsIndex + 1) % newsItems.length;
        
        // Criar nova notícia
        const newItem = document.createElement('div');
        newItem.className = 'news-item';
        newItem.textContent = newsItems[currentNewsIndex];
        newsContent.appendChild(newItem);
        
        // Fade in
        setTimeout(() => {
            newItem.classList.add('active');
        }, 50);
    }, 5000);
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchNews);
} else {
    fetchNews();
}

// Atualizar notícias a cada 30 minutos
setInterval(fetchNews, 30 * 60 * 1000);
