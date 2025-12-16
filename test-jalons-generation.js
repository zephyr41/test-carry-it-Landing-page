/**
 * Test Script for Jalons Auto-Generation Logic
 * Validates all 3 cases: CAS 1 (<90j), CAS 2 (90-365j), CAS 3 (>365j)
 */

// --- REPLICATE generateJalons FUNCTION ---
function generateJalons(temporelDate) {
    const today = new Date();
    const endDate = new Date(temporelDate);
    const durationDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    let jalonsConfig = [];

    // CAS 1: < 90 jours
    if (durationDays < 90) {
        jalonsConfig = [
            { titre: 'Jalon Mi-Parcours', progression: 50, dateOffset: Math.floor(durationDays * 0.5) },
            { titre: 'Jalon Final', progression: 100, dateOffset: durationDays }
        ];
    }
    // CAS 2: 90-365 jours
    else if (durationDays >= 90 && durationDays <= 365) {
        jalonsConfig = [
            { titre: 'Jalon Décollage', progression: 15, dateOffset: 30 },
            { titre: 'Jalon Mi-Parcours', progression: 50, dateOffset: Math.floor(durationDays * 0.5) },
            { titre: 'Jalon Final', progression: 100, dateOffset: durationDays }
        ];
    }
    // CAS 3: > 365 jours
    else {
        jalonsConfig = [
            { titre: 'Jalon Décollage', progression: 10, dateOffset: 30 },
            { titre: 'Jalon Trimestriel', progression: 25, dateOffset: 90 },
            { titre: 'Jalon Mi-Parcours', progression: 50, dateOffset: Math.floor(durationDays * 0.5) },
            { titre: 'Jalon Final', progression: 100, dateOffset: durationDays }
        ];
    }

    // Générer les objets jalons
    return jalonsConfig.map((config, index) => {
        const jalonDate = new Date(today);
        jalonDate.setDate(jalonDate.getDate() + config.dateOffset);
        const daysDiff = Math.ceil((jalonDate - today) / (1000 * 60 * 60 * 24));
        const isProche = daysDiff < 90;

        return {
            id: Date.now() + index,
            ordre: index + 1,
            titre: config.titre,
            date: jalonDate.toISOString().split('T')[0],
            type: isProche ? 'proche' : 'lointain',
            progression: config.progression,
            statut: index === 0 ? 'in_progress' : 'pending',
            miniSmart: {
                specifique: '',
                mesurable: '',
                atteignable: isProche ? '' : null,
                realiste: isProche ? '' : null
            },
            taches: isProche ? [] : null
        };
    });
}

// --- HELPERS ---
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

function getDaysBetween(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
}

// --- TEST CASES ---
console.log('\n=== JALONS AUTO-GENERATION TESTS ===\n');

// TEST 1: CAS 1 - Short duration (< 90 days)
console.log('📋 CAS 1: DURATION < 90 DAYS');
console.log('───────────────────────────────');
const today = new Date();
const cas1End = new Date(today);
cas1End.setDate(cas1End.getDate() + 60); // 60 days

const cas1Jalons = generateJalons(cas1End.toISOString().split('T')[0]);
const cas1Duration = getDaysBetween(today, cas1End);

console.log(`Duration: ${cas1Duration} days`);
console.log(`Expected: 2 jalons (Mi-Parcours 50%, Final 100%)\n`);

cas1Jalons.forEach((j, i) => {
    const daysUntil = getDaysBetween(today, j.date);
    console.log(`  Jalon ${i + 1}: "${j.titre}"`);
    console.log(`    Date: ${formatDate(j.date)} (${daysUntil} days from now)`);
    console.log(`    Progression: ${j.progression}%`);
    console.log(`    Type: ${j.type} (${j.type === 'proche' ? '✓ has A+R+taches' : '✗ no A+R+taches'})`);
    console.log(`    Statut: ${j.statut}`);
    console.log('');
});

const cas1Valid = cas1Jalons.length === 2 &&
                  cas1Jalons[0].titre.includes('Mi-Parcours') && cas1Jalons[0].progression === 50 &&
                  cas1Jalons[1].titre.includes('Final') && cas1Jalons[1].progression === 100 &&
                  cas1Jalons.every(j => j.type === 'proche');
console.log(`✅ CAS 1 Valid: ${cas1Valid ? 'PASS' : 'FAIL'}\n`);

// TEST 2: CAS 2 - Medium duration (90-365 days)
console.log('📋 CAS 2: DURATION 90-365 DAYS');
console.log('───────────────────────────────');
const cas2End = new Date(today);
cas2End.setDate(cas2End.getDate() + 180); // 180 days

const cas2Jalons = generateJalons(cas2End.toISOString().split('T')[0]);
const cas2Duration = getDaysBetween(today, cas2End);

console.log(`Duration: ${cas2Duration} days`);
console.log(`Expected: 3 jalons (Décollage 15%, Mi-Parcours 50%, Final 100%)\n`);

cas2Jalons.forEach((j, i) => {
    const daysUntil = getDaysBetween(today, j.date);
    console.log(`  Jalon ${i + 1}: "${j.titre}"`);
    console.log(`    Date: ${formatDate(j.date)} (${daysUntil} days from now)`);
    console.log(`    Progression: ${j.progression}%`);
    console.log(`    Type: ${j.type} (${j.type === 'proche' ? '✓ has A+R+taches' : '✗ no A+R+taches'})`);
    console.log(`    Statut: ${j.statut}`);
    console.log('');
});

const cas2Valid = cas2Jalons.length === 3 &&
                  cas2Jalons[0].titre.includes('Décollage') && cas2Jalons[0].progression === 15 && cas2Jalons[0].type === 'proche' &&
                  cas2Jalons[1].titre.includes('Mi-Parcours') && cas2Jalons[1].progression === 50 && cas2Jalons[1].type === 'proche' &&
                  cas2Jalons[2].titre.includes('Final') && cas2Jalons[2].progression === 100 && cas2Jalons[2].type === 'lointain';
console.log(`✅ CAS 2 Valid: ${cas2Valid ? 'PASS' : 'FAIL'}\n`);

// TEST 3: CAS 3 - Long duration (> 365 days)
console.log('📋 CAS 3: DURATION > 365 DAYS');
console.log('───────────────────────────────');
const cas3End = new Date(today);
cas3End.setFullYear(cas3End.getFullYear() + 2); // 2 years ≈ 730 days

const cas3Jalons = generateJalons(cas3End.toISOString().split('T')[0]);
const cas3Duration = getDaysBetween(today, cas3End);

console.log(`Duration: ${cas3Duration} days`);
console.log(`Expected: 4 jalons (Décollage 10%, Trimestriel 25%, Mi-Parcours 50%, Final 100%)\n`);

cas3Jalons.forEach((j, i) => {
    const daysUntil = getDaysBetween(today, j.date);
    console.log(`  Jalon ${i + 1}: "${j.titre}"`);
    console.log(`    Date: ${formatDate(j.date)} (${daysUntil} days from now)`);
    console.log(`    Progression: ${j.progression}%`);
    console.log(`    Type: ${j.type} (${j.type === 'proche' ? '✓ has A+R+taches' : '✗ no A+R+taches'})`);
    console.log(`    Statut: ${j.statut}`);
    console.log('');
});

const cas3Valid = cas3Jalons.length === 4 &&
                  cas3Jalons[0].titre.includes('Décollage') && cas3Jalons[0].progression === 10 && cas3Jalons[0].type === 'proche' &&
                  cas3Jalons[1].titre.includes('Trimestriel') && cas3Jalons[1].progression === 25 && cas3Jalons[1].type === 'proche' &&
                  cas3Jalons[2].titre.includes('Mi-Parcours') && cas3Jalons[2].progression === 50 && cas3Jalons[2].type === 'lointain' &&
                  cas3Jalons[3].titre.includes('Final') && cas3Jalons[3].progression === 100 && cas3Jalons[3].type === 'lointain';
console.log(`✅ CAS 3 Valid: ${cas3Valid ? 'PASS' : 'FAIL'}\n`);

// --- SUMMARY ---
console.log('═════════════════════════════════');
console.log('📊 TEST SUMMARY');
console.log('═════════════════════════════════');
console.log(`CAS 1 (<90j):     ${cas1Valid ? '✅ PASS' : '❌ FAIL'}`);
console.log(`CAS 2 (90-365j):  ${cas2Valid ? '✅ PASS' : '❌ FAIL'}`);
console.log(`CAS 3 (>365j):    ${cas3Valid ? '✅ PASS' : '❌ FAIL'}`);
console.log(`\nOverall: ${cas1Valid && cas2Valid && cas3Valid ? '✅ ALL TESTS PASS' : '❌ SOME TESTS FAIL'}\n`);
