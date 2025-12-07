// State
let currentData = null;
let currentObjectif = null;
let jalons = [];
let currentJalonIndex = 0;

// Utility functions
function formatDate(dateStr, locale = 'fr-FR') {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Load data from localStorage
function loadData() {
    const stored = localStorage.getItem('carryItAllObjectifs');
    if (!stored) {
        window.location.href = 'objectif.html';
        return false;
    }

    try {
        currentData = JSON.parse(stored);
        currentObjectif = currentData[currentData.length - 1];

        if (!currentObjectif || !currentObjectif.jalons) {
            window.location.href = 'objectif.html';
            return false;
        }

        // Get jalons and sort them by date (oldest to newest)
        jalons = currentObjectif.jalons.sort((a, b) => new Date(a.date) - new Date(b.date));

        if (jalons.length === 0) {
            window.location.href = 'jalon.html';
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error loading data:', error);
        window.location.href = 'objectif.html';
        return false;
    }
}

// Display current jalon
function displayJalon(index) {
    const jalon = jalons[index];
    if (!jalon) return;

    const display = document.getElementById('jalonDisplay');
    const progressPercent = Math.round((index + 1) / jalons.length * 100);

    display.innerHTML = `
        <div class="jalon-badge">${progressPercent}%</div>
        <div class="jalon-info">
            <div class="jalon-title">${jalon.titre || 'Sans titre'}</div>
            <div class="jalon-date">${formatDate(jalon.date)}</div>
        </div>
        <div class="jalon-counter">${index + 1} / ${jalons.length}</div>
    `;
}

// Update nav buttons state
function updateNavButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Disable prev if at first jalon, disable next if at last
    prevBtn.disabled = currentJalonIndex === 0;
    nextBtn.disabled = currentJalonIndex === jalons.length - 1;
}

// Navigate to next jalon
function goNext() {
    if (currentJalonIndex < jalons.length - 1) {
        currentJalonIndex++;
        displayJalon(currentJalonIndex);
        updateNavButtons();
    }
}

// Navigate to previous jalon
function goPrev() {
    if (currentJalonIndex > 0) {
        currentJalonIndex--;
        displayJalon(currentJalonIndex);
        updateNavButtons();
    }
}

// Validate jalons
function validateJalons() {
    // For MVP, just save and redirect
    localStorage.setItem('carryItAllObjectifs', JSON.stringify(currentData));
    window.location.href = 'dashboard.html';
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('nextBtn').addEventListener('click', goNext);
    document.getElementById('prevBtn').addEventListener('click', goPrev);
    document.getElementById('validateBtn').addEventListener('click', validateJalons);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') goNext();
        if (e.key === 'ArrowLeft') goPrev();
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (!loadData()) return;

    // Start from last jalon (index = jalons.length - 1)
    currentJalonIndex = jalons.length - 1;

    // Display first jalon
    displayJalon(currentJalonIndex);

    // Update button states
    updateNavButtons();

    // Setup listeners
    setupEventListeners();
});
