// State
let currentData = null;
let currentObjectif = null;
let jalons = [];
let currentJalonIndex = 0;
let monthMarkers = [];

// Utility functions
function formatDate(dateStr, locale = 'fr-FR') {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function getMonthLabel(date) {
    return date.toLocaleDateString('fr-FR', {
        month: 'short',
        year: '2-digit'
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

// Generate months timeline
function generateMonthsTimeline(startDate, endDate) {
    const timelineContainer = document.getElementById('timelineMonths');
    timelineContainer.innerHTML = '';
    monthMarkers = [];

    const start = new Date(startDate);
    start.setDate(1); // First day of start month
    const end = new Date(endDate);

    let currentMonth = new Date(start);
    let monthIndex = 0;

    while (currentMonth <= end) {
        const monthDate = new Date(currentMonth);
        const marker = document.createElement('div');
        marker.className = 'month-marker';
        marker.dataset.monthIndex = monthIndex;

        const monthNum = document.createElement('div');
        monthNum.className = 'month-number';
        monthNum.textContent = `M${monthIndex + 1}`;

        const monthLabel = document.createElement('div');
        monthLabel.className = 'month-label';
        monthLabel.textContent = getMonthLabel(monthDate);

        marker.appendChild(monthNum);
        marker.appendChild(monthLabel);
        timelineContainer.appendChild(marker);

        monthMarkers.push({
            element: marker,
            date: new Date(monthDate),
            index: monthIndex
        });

        currentMonth.setMonth(currentMonth.getMonth() + 1);
        monthIndex++;
    }
}

// Update active month indicator
function updateActiveMonth() {
    const currentJalon = jalons[currentJalonIndex];
    if (!currentJalon) return;

    const jalonDate = new Date(currentJalon.date);
    const jalonMonth = jalonDate.getMonth();
    const jalonYear = jalonDate.getFullYear();

    // Remove all active classes
    monthMarkers.forEach(m => m.element.classList.remove('active'));

    // Add active class to matching month
    monthMarkers.forEach(m => {
        if (m.date.getMonth() === jalonMonth && m.date.getFullYear() === jalonYear) {
            m.element.classList.add('active');
            // Scroll into view
            m.element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    });
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

    // Update month indicator
    updateActiveMonth();
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

    const startDate = new Date(currentObjectif.dateCreation || Date.now());
    const endDate = new Date(currentObjectif.temporel);

    // Display project title
    const titleDiv = document.getElementById('projectTitle');
    const projectTitle = currentObjectif.titre || 'Mon Objectif';

    if (titleDiv) {
        titleDiv.innerHTML = `<h2>${projectTitle}</h2>`;
    }

    // Generate months timeline
    generateMonthsTimeline(startDate, endDate);

    // Start from last jalon (index = jalons.length - 1)
    currentJalonIndex = jalons.length - 1;

    // Display first jalon
    displayJalon(currentJalonIndex);

    // Update button states
    updateNavButtons();

    // Setup listeners
    setupEventListeners();
});
