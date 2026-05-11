# Plan : Intégration nouveau design Moyen Terme (Pilotage Jalons)

## Context
Nils a redesigné la section Pilotage·Jalons dans `prototypes/jalons-test.html`. L'objectif est d'intégrer ce nouveau design dans `dashboard.html` en gardant tout le JS existant (data model, modaux, state management).

## Fichiers modifiés
- `dashboard.html` — HTML + JS de `buildJalonsPanel()` + `renderJalonKpiCard()`
- `assets/css/dashboard.css` — Ajout des nouveaux styles, suppression des anciens

---

## Ce qui change visuellement

### 1. Timeline (`.pil-timeline`)
**Avant**: dots pleins, ligne de connexion simple  
**Après**: design prototype — dot actif avec fill horizontal = % du KPI lagging  
- Fill calc: `Math.round((kpi_lagging.valeur / kpi_lagging.cible) * 100)` → `linear-gradient(to right, var(--c-orange) X%, #1A1A1C X%)`
- Si aucun KPI lagging défini → fill 0% (cercle bordure orange vide)

### 2. Card header (`.pilotage-block`)
**Avant**: `.pil-header-info` + status chip séparé  
**Après**: `.steering-header` — layout prototype:
- Row 1: `[MOIS X · JALON Y SUR Z]` + titre (32px, 800) + deadline / **[chip] [btn Valider]**
- Row 2: 2-col grid — **Direction** (desc) | **Le Contrat** (critere avec bordure orange gauche)

### 3. Section KPI (`.block-pilotage-stats`)
**Avant**: cards `.kpi-station` avec background  
**Après**: fond noir pur, grid 3 colonnes (`1fr 1px 1fr`), séparateur vertical `.v-sep`  
- Label section: `INDICATEURS DE PILOTAGE` (uppercase, 11px)
- Chaque KPI unit: titre (15px 800) + phrasing italic + valeur 42px + unité 20px + description + progress bar + btn "+ Ajouter une mesure"

### 4. Bouton Valider
Déplacé dans `.header-actions` (top right du header) — même comportement `completeJalon()`

---

## Implémentation

### Étape 1 — Nouveaux CSS dans `dashboard.css`
Ajouter à la fin du fichier les classes du prototype:
- `.steering-card`, `.steering-header`, `.header-top-row`, `.header-actions`
- `.btn--validate`, `.info-grid`, `.critere-highlight`
- `.steering-pilotage-wrap`, `.kpi-grid`, `.v-sep`
- `.kpi-unit`, `.kpi-unit__header`, `.kpi-title`, `.kpi-phrasing`
- `.value` (42px strong), `.progress-label`, `.add-btn`
- Update `.milestone--active .m-dot` pour le fill horizontal gradient

### Étape 2 — Réécrire le HTML généré par `buildJalonsPanel()` (dashboard.html ~l.1951-2074)
Garder toute la logique JS, changer seulement le template HTML retourné.

Structure du nouveau template:
```
<div class="steering-card">
  <header class="steering-header">
    <div class="header-top-row">
      <div> [meta] [titre] [deadline] </div>
      <div class="header-actions"> [chip] [btn-valider] </div>
    </div>
    <div class="info-grid">
      <div> Direction: [desc] </div>
      <div> Le Contrat: [critere avec bordure] </div>
    </div>
  </header>
  <main class="steering-pilotage-wrap">
    [renderJalonKpiCards()]
  </main>
</div>
```

### Étape 3 — Réécrire `renderJalonKpiCard()` (~l.2181-2230)
Nouveau template par KPI:
```
<article class="kpi-unit">
  <div class="kpi-unit__header">
    <div>
      <h3 class="kpi-title">[Indicateur d'effort | Indicateur de résultat]</h3>
      <p class="kpi-phrasing">[Ce que je fais | Ce que ça donne]</p>
    </div>
    <button class="edit-btn" onclick="openJalonKpiModal(...)">Modifier</button>
  </div>
  <div class="value"><strong>[valeur]</strong><span>[unite]</span></div>
  <p class="description-text">[titre kpi]</p>
  <div> [progress bar] </div>
  <button class="add-btn" onclick="openJalonKpiMeasureModal(...)">+ Ajouter une mesure</button>
</article>
```

### Étape 4 — Dot fill dans `buildJalonsPanel()` (~l.1985-1997)
Pour le jalon actif: calculer `lagPct` depuis le KPI lagging, injecter en style inline sur `.m-dot`.

### Étape 5 — État vide KPI
Si KPI pas défini → afficher btn "Définir le KPI" (même comportement qu'avant, style `.add-btn`)

---

## Ce qui NE change PAS
- Data model (`jalon.kpis[]`, `jalon.statut`, etc.)
- Toutes les fonctions JS (modaux, `selectJalon`, `completeJalon`, etc.)
- `jalonPopupState`, `activeJalonView`, `getSortedProjectJalons()`
- Drag-and-drop tasks vers jalons

---

## Vérification
1. Ouvrir `dashboard.html` en local (`python3 -m http.server 9999`)
2. Créer/sélectionner un projet avec jalons
3. Aller dans vue Pilotage
4. Vérifier: timeline dot fill, header layout, KPI display, btn Valider, modaux KPI
