// Atualizar data e hora
function updateDateTime() {
    const now = new Date();
    
    // Formatar data
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dateStr = now.toLocaleDateString('pt-BR', options);
    
    // Formatar hora
    const timeStr = now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    
    // Atualizar elementos
    const dateEl = document.getElementById('date');
    const timeEl = document.getElementById('time');
    
    if (dateEl) {
        dateEl.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    }
    
    if (timeEl) {
        timeEl.textContent = timeStr;
    }
}

// Atualizar a cada segundo
setInterval(updateDateTime, 1000);

// Atualizar imediatamente
updateDateTime();
