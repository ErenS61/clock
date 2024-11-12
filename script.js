function updateClock() {
    const now = new Date();

    // Récupérer l'heure
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;

    // Récupérer la date au format "lun. 12 nov. 2024" avec Intl.DateTimeFormat
    const optionsDate = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const currentDate = new Intl.DateTimeFormat('fr-FR', optionsDate).format(now);
    document.getElementById('date').textContent = currentDate;
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    // Sauvegarder le mode actuel dans localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

// Vérifier le mode de thème lors du chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    const savedMode = localStorage.getItem('darkMode');
    
    if (savedMode === 'enabled') {
        document.body.classList.add('dark-mode');
    }
});

document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);

setInterval(updateClock, 1000); // Met à jour l'horloge et la date toutes les secondes
updateClock(); // Initialise l'horloge immédiatement
