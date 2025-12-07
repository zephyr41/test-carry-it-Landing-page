// Timeline Management
let currentData = null;
let currentObjectif = null;
let currentZoomLevel = 2; // Start at day view (0=months, 1=weeks, 2=days)

// Utility functions
function getDaysBetween(date1, date2) {
    return Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr, locale = 'fr-FR') {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function dateToString(date) {
    return date.toISOString().split('T')[0];
}

function calculateProgression(jalonDate, startDate, endDate) {
    const totalDays = getDaysBetween(startDate, endDate);
    const daysSinceStart = getDaysBetween(startDate, new Date(jalonDate));
    return Math.round((daysSinceStart / totalDays) * 100);
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

        if (!currentObjectif) {
            window.location.href = 'objectif.html';
            return false;
        }

        // Ensure jalons array exists
        if (!currentObjectif.jalons) {
            currentObjectif.jalons = [];
        }

        return true;
    } catch (error) {
        console.error('Error loading data:', error);
        window.location.href = 'objectif.html';
        return false;
    }
}

// Generate timeline circles based on zoom level
function generateTimelineCircles(startDate, endDate, zoomLevel = 2) {
    const track = document.getElementById('timelineTrack');
    track.innerHTML = '';

    const totalDays = getDaysBetween(startDate, endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (zoomLevel === 2) {
        // Day view
        for (let i = 0; i <= totalDays; i++) {
            const date = new Date(startDate);
            date.setDate(date.getDate() + i);
            date.setHours(0, 0, 0, 0);

            const dateStr = dateToString(date);
            const circle = document.createElement('div');
            circle.className = 'timeline-circle';
            circle.dataset.date = dateStr;
            circle.dataset.index = i;
            circle.dataset.zoomLevel = zoomLevel;

            const dayNum = document.createElement('span');
            dayNum.className = 'day-number';
            dayNum.textContent = `J+${i}`;

            circle.appendChild(dayNum);

            // Mark today
            if (dateStr === dateToString(today)) {
                circle.classList.add('is-today');
            }

            // Mark deadline
            if (dateStr === dateToString(endDate)) {
                circle.classList.add('is-deadline');
            }

            circle.addEventListener('click', () => onCircleClick(circle, dateStr));
            track.appendChild(circle);
        }
    } else if (zoomLevel === 1) {
        // Week view
        const weeks = Math.ceil(totalDays / 7);
        for (let w = 0; w < weeks; w++) {
            const weekStart = new Date(startDate);
            weekStart.setDate(weekStart.getDate() + w * 7);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);

            const dateStr = dateToString(weekStart);
            const circle = document.createElement('div');
            circle.className = 'timeline-circle';
            circle.dataset.date = dateStr;
            circle.dataset.index = w;
            circle.dataset.zoomLevel = zoomLevel;

            const weekNum = document.createElement('span');
            weekNum.className = 'day-number';
            weekNum.textContent = `S${w + 1}`;

            circle.appendChild(weekNum);

            // Mark if today falls in this week
            if (today >= weekStart && today <= weekEnd) {
                circle.classList.add('is-today');
            }

            track.appendChild(circle);
        }
    } else if (zoomLevel === 0) {
        // Month view
        const startMonth = new Date(startDate.getFullYear(), startDate.getMonth());
        const endMonth = new Date(endDate.getFullYear(), endDate.getMonth());

        let currentMonth = new Date(startMonth);
        let monthIndex = 0;

        while (currentMonth <= endMonth) {
            const dateStr = dateToString(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1));
            const circle = document.createElement('div');
            circle.className = 'timeline-circle';
            circle.dataset.date = dateStr;
            circle.dataset.index = monthIndex;
            circle.dataset.zoomLevel = zoomLevel;

            const monthNum = document.createElement('span');
            monthNum.className = 'day-number';
            monthNum.textContent = `M${currentMonth.getMonth() + 1}`;

            circle.appendChild(monthNum);

            // Mark if today falls in this month
            if (today.getFullYear() === currentMonth.getFullYear() &&
                today.getMonth() === currentMonth.getMonth()) {
                circle.classList.add('is-today');
            }

            track.appendChild(circle);

            currentMonth.setMonth(currentMonth.getMonth() + 1);
            monthIndex++;
        }
    }
}

// Render jalons on the timeline
function renderJalons(startDate, endDate) {
    // Clear existing jalon markers
    document.querySelectorAll('.jalon-marker').forEach(m => m.remove());

    if (!currentObjectif.jalons || currentObjectif.jalons.length === 0) {
        return;
    }

    currentObjectif.jalons.forEach((jalon, index) => {
        const jalonDate = new Date(jalon.date);
        jalonDate.setHours(0, 0, 0, 0);
        const dateStr = dateToString(jalonDate);

        // Find corresponding circle
        const circle = document.querySelector(`[data-date="${dateStr}"]`);
        if (!circle) return;

        // Calculate progression
        const progression = calculateProgression(jalon.date, startDate, endDate);

        // Create marker
        const marker = document.createElement('div');
        marker.className = 'jalon-marker';

        const badge = document.createElement('div');
        badge.className = 'jalon-badge';

        // Differentiate proche vs lointain
        const daysToJalon = getDaysBetween(new Date(), jalonDate);
        if (daysToJalon > 90 || daysToJalon < 0) {
            badge.classList.add('lointain');
        }

        badge.textContent = `${progression}%`;

        const title = document.createElement('div');
        title.className = 'jalon-title';
        title.textContent = jalon.titre || 'Sans titre';

        marker.appendChild(badge);
        marker.appendChild(title);

        // Insert marker into circle
        circle.classList.add('has-jalon');
        circle.appendChild(marker);

        // Add click handler to jalon
        marker.addEventListener('click', (e) => {
            e.stopPropagation();
            // TODO: Open jalon detail panel
            console.log('Clicked jalon:', jalon);
        });
    });
}

// Handle circle click
function onCircleClick(circle, dateStr) {
    if (circle.classList.contains('has-jalon')) {
        // Jalon already exists, would open detail view
        return;
    }
    // For MVP, just log. Later: pre-fill modal with date
    console.log('Clicked empty circle on:', dateStr);
}

// Scroll to and center today's circle
function scrollToToday() {
    const todayCircle = document.querySelector('.is-today');
    if (todayCircle) {
        const wrapper = document.querySelector('.timeline-scroll-wrapper');
        const scrollLeft = todayCircle.offsetLeft - wrapper.offsetWidth / 2 + todayCircle.offsetWidth / 2;
        wrapper.scrollLeft = scrollLeft;
    }
}

// Play entry animation (roulette effect)
async function playTimelineEntryAnimation() {
    const track = document.getElementById('timelineTrack');
    const todayCircle = document.querySelector('.is-today');

    if (!todayCircle) return;

    // Initial state - far left
    track.style.transform = 'translateX(-100%)';
    track.style.opacity = '0.5';

    await sleep(200);

    // Scroll animation with easing
    track.style.transition = 'transform 1.8s var(--ease-ios), opacity 1.8s var(--ease-ios), filter 1.8s var(--ease-ios)';
    track.style.filter = 'blur(2px)';

    const wrapper = document.querySelector('.timeline-scroll-wrapper');
    const offsetToCenter = todayCircle.offsetLeft - wrapper.offsetWidth / 2 + todayCircle.offsetWidth / 2;
    track.style.transform = `translateX(${-offsetToCenter}px)`;
    track.style.opacity = '1';

    await sleep(1800);

    // Arrival
    track.style.filter = 'none';
    todayCircle.classList.add('pulse');

    await sleep(500);

    // Reveal jalons with stagger
    revealJalonsStaggered();
}

function revealJalonsStaggered() {
    const markers = document.querySelectorAll('.jalon-marker');
    markers.forEach((marker, index) => {
        marker.style.opacity = '0';
        marker.style.transform = 'scale(0.8)';
        marker.style.transition = 'none';

        setTimeout(() => {
            marker.style.transition = 'all 0.4s var(--ease-ios)';
            marker.style.opacity = '1';
            marker.style.transform = 'scale(1)';
        }, index * 100);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Modal button
    document.getElementById('addJalonBtn').addEventListener('click', () => {
        document.getElementById('modalJalon').hidden = false;
        const today = new Date();
        document.getElementById('jalonDate').valueAsDate = today;
    });

    // Form submission
    document.getElementById('jalonForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addCustomJalon();
    });

    // Validate button
    document.getElementById('validateBtn').addEventListener('click', validateJalons);

    // Zoom controls
    document.getElementById('zoomInBtn').addEventListener('click', () => zoomTimeline(1));
    document.getElementById('zoomOutBtn').addEventListener('click', () => zoomTimeline(-1));

    // Close modal on background click
    document.getElementById('modalJalon').addEventListener('click', (e) => {
        if (e.target.id === 'modalJalon') {
            e.target.hidden = true;
        }
    });
}

// Add custom jalon
function addCustomJalon() {
    const titre = document.getElementById('jalonTitle').value;
    const date = document.getElementById('jalonDate').value;
    const kpi = document.getElementById('jalonKpi').value;

    if (!titre || !date) {
        alert('Veuillez remplir les champs obligatoires');
        return;
    }

    const newJalon = {
        id: Date.now(),
        titre,
        date,
        kpi: kpi || null,
        type: new Date(date) > new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) ? 'lointain' : 'proche',
        progression: calculateProgression(date, currentObjectif.dateCreation || new Date(), new Date(currentObjectif.temporel)),
        statut: 'pending',
        miniSmart: { specifique: '', mesurable: '', atteignable: null, realiste: null },
        taches: null,
        custom: true
    };

    currentObjectif.jalons.push(newJalon);
    localStorage.setItem('carryItAllObjectifs', JSON.stringify(currentData));

    // Close modal and refresh
    document.getElementById('modalJalon').hidden = true;
    document.getElementById('jalonForm').reset();

    // Re-render jalons
    const startDate = new Date(currentObjectif.dateCreation || Date.now());
    const endDate = new Date(currentObjectif.temporel);
    renderJalons(startDate, endDate);

    // Scroll to new jalon
    const wrapper = document.querySelector('.timeline-scroll-wrapper');
    const circle = document.querySelector(`[data-date="${newJalon.date}"]`);
    if (circle) {
        const scrollLeft = circle.offsetLeft - wrapper.offsetWidth / 2 + circle.offsetWidth / 2;
        wrapper.scrollLeft = scrollLeft;
    }
}

// Zoom timeline
function zoomTimeline(direction) {
    const newZoom = currentZoomLevel + direction;

    if (newZoom < 0 || newZoom > 2) return;

    currentZoomLevel = newZoom;

    const startDate = new Date(currentObjectif.dateCreation || Date.now());
    const endDate = new Date(currentObjectif.temporel);

    generateTimelineCircles(startDate, endDate, currentZoomLevel);
    renderJalons(startDate, endDate);

    // Adjust gaps based on zoom level
    const track = document.getElementById('timelineTrack');
    const gaps = [80, 60, 44];
    track.style.gap = gaps[currentZoomLevel] + 'px';

    // Scroll to today
    setTimeout(() => scrollToToday(), 50);
}

// Validate jalons
function validateJalons() {
    // For MVP, just save and redirect
    localStorage.setItem('carryItAllObjectifs', JSON.stringify(currentData));
    window.location.href = 'dashboard.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    if (!loadData()) return;

    const startDate = new Date(currentObjectif.dateCreation || Date.now());
    const endDate = new Date(currentObjectif.temporel);

    // Generate timeline at day view (zoom level 2)
    generateTimelineCircles(startDate, endDate, currentZoomLevel);

    // Render auto-generated jalons
    renderJalons(startDate, endDate);

    // Setup event listeners
    setupEventListeners();

    // Play entry animation after a short delay
    await sleep(100);
    await playTimelineEntryAnimation();

    // Auto-scroll to today
    await sleep(3000);
    scrollToToday();
});
