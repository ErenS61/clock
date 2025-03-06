// Fonction pour mettre à jour l'horloge numérique
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

// Fonction pour basculer entre le mode sombre et clair
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    // Sauvegarder le mode actuel dans localStorage
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

// Fonction pour déclencher les feux d'artifice
function triggerFireworks() {
    const duration = 10 * 1000; // Durée de l'animation (10 secondes)
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

// Fonction pour dessiner l'horloge analogique
function drawClock(ctx, radius) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();

    // Dessiner le cadran de l'horloge
    ctx.beginPath();
    ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI);
    ctx.strokeStyle = document.body.classList.contains('dark-mode') ? '#ffffff' : '#000000';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Dessiner les chiffres 3, 6, 9, 12
    ctx.font = "30px Montserrat";
    ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#ffffff' : '#000000';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("12", radius, radius - radius * 0.7); // 12 en haut
    ctx.fillText("3", radius + radius * 0.7, radius); // 3 à droite
    ctx.fillText("6", radius, radius + radius * 0.7); // 6 en bas
    ctx.fillText("9", radius - radius * 0.7, radius); // 9 à gauche

    // Dessiner les traits pour les minutes
    for (let i = 0; i < 60; i++) {
        const angle = (i * 6) * (Math.PI / 180); // 6 degrés par minute
        const start = radius * 0.9;
        const end = i % 5 === 0 ? radius * 0.8 : radius * 0.85; // Traits plus longs pour les heures
        ctx.beginPath();
        ctx.moveTo(radius + Math.cos(angle) * start, radius + Math.sin(angle) * start);
        ctx.lineTo(radius + Math.cos(angle) * end, radius + Math.sin(angle) * end);
        ctx.strokeStyle = document.body.classList.contains('dark-mode') ? '#ffffff' : '#000000';
        ctx.lineWidth = i % 5 === 0 ? 3 : 1; // Traits plus épais pour les heures
        ctx.stroke();
    }

    // Calculer les angles avec des décimales pour plus de fluidité
    const secondAngle = seconds * 6 + (milliseconds / 1000) * 6; // 6 degrés par seconde
    const minuteAngle = minutes * 6 + (seconds / 60) * 6; // 6 degrés par minute
    const hourAngle = (hours % 12) * 30 + (minutes / 60) * 30; // 30 degrés par heure

    // Dessiner les aiguilles
    drawHand(ctx, hourAngle, radius * 0.5, 6); // Heure
    drawHand(ctx, minuteAngle, radius * 0.7, 4); // Minute
    drawHand(ctx, secondAngle, radius * 0.8, 2, "#FF4500"); // Seconde en orange foncé
}

// Fonction pour dessiner une aiguille de l'horloge
function drawHand(ctx, angle, length, width, color = document.body.classList.contains('dark-mode') ? '#ffffff' : '#000000') {
    const radius = ctx.canvas.height / 2;
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.moveTo(radius, radius);
    ctx.lineTo(
        radius + Math.cos((angle - 90) * Math.PI / 180) * length,
        radius + Math.sin((angle - 90) * Math.PI / 180) * length
    );
    ctx.strokeStyle = color;
    ctx.stroke();
}

// Fonction pour animer l'horloge analogique de manière fluide
function animateAnalogClock(ctx, radius) {
    drawClock(ctx, radius); // Dessiner l'horloge
    requestAnimationFrame(() => animateAnalogClock(ctx, radius)); // Boucle d'animation
}

// Fonction pour basculer entre l'horloge numérique et analogique
function toggleAnalogClock() {
    const clockContainer = document.getElementById('clock-container');
    const clock = document.getElementById('clock');
    const analogClockWrapper = document.getElementById('analog-clock-wrapper');

    if (clockContainer.classList.contains('analog-mode')) {
        // Retour à l'horloge numérique
        clockContainer.classList.remove('analog-mode');
        clock.style.display = 'block';
        analogClockWrapper.innerHTML = ''; // Supprimer l'horloge analogique
        localStorage.setItem('clockMode', 'digital'); // Sauvegarder le mode numérique
    } else {
        // Afficher l'horloge analogique
        clockContainer.classList.add('analog-mode');
        clock.style.display = 'none';

        // Créer un élément canvas pour l'horloge analogique
        const canvas = document.createElement('canvas');
        canvas.id = 'analog-clock';
        canvas.width = 600; // Taille de l'horloge analogique
        canvas.height = 600;
        analogClockWrapper.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const radius = canvas.height / 2;

        // Démarrer l'animation fluide de l'horloge analogique
        animateAnalogClock(ctx, radius);

        localStorage.setItem('clockMode', 'analog'); // Sauvegarder le mode analogique
    }
}

// Vérifier le mode de thème et l'état de l'horloge lors du chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    const savedMode = localStorage.getItem('darkMode');
    const savedClockMode = localStorage.getItem('clockMode');

    // Appliquer le mode sombre si nécessaire
    if (savedMode === 'enabled') {
        document.body.classList.add('dark-mode');
    }

    // Appliquer le mode horloge (numérique ou analogique) si nécessaire
    if (savedClockMode === 'analog') {
        toggleAnalogClock(); // Basculer en mode analogique
    }
});

// Ajouter un écouteur d'événement au bouton analogique
document.getElementById('analog-clock-toggle').addEventListener('click', toggleAnalogClock);

// Ajouter un écouteur d'événement au bouton de feu d'artifice
document.getElementById('fireworks-button').addEventListener('click', triggerFireworks);

// Ajouter un écouteur d'événement au bouton dark mode
document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);

setInterval(updateClock, 1000); // Met à jour l'horloge et la date toutes les secondes
updateClock(); // Initialise l'horloge immédiatement