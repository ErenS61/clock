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

// Fonction pour déclencher les feux d'artifice
function triggerFireworks() {
    const duration = 10 * 1000; // Durée de l'animation (5 secondes)
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 20, spread: 360, ticks: 60, zIndex: -9999 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 100 * (timeLeft / duration);
        // Feux d'artifice depuis le bas de l'écran
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
        });
        // Feux d'artifice depuis le haut de l'écran
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
        });
    }, 250);
}

// Ajouter un écouteur d'événement au bouton de feu d'artifice
document.getElementById('fireworks-button').addEventListener('click', triggerFireworks);

// Vérifier le mode de thème lors du chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    const savedMode = localStorage.getItem('darkMode');
    
    if (savedMode === 'enabled') {
        document.body.classList.add('dark-mode');
    }
});

// Ajouter un écouteur d'événement au bouton dark mode
document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);

setInterval(updateClock, 1000); // Met à jour l'horloge et la date toutes les secondes
updateClock(); // Initialise l'horloge immédiatement