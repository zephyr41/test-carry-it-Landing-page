# Icônes — DA System

Source de vérité pour toutes les icônes SVG utilisées dans le système. Pas de sprite/fichier partagé (SVG inline dans chaque HTML) — ce fichier sert à copier-coller de façon cohérente et éviter les divergences entre fichiers.

Règle : `fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round;` + `stroke-width` piloté par `--icon-stroke-width` (1.5, icônes UI standard) ou `--icon-stroke-width-bold` (2, icônes nav copiées de `dashboard.html`). Jamais de `stroke-width` en dur.

## Check (coche)

- **viewBox** : `0 0 16 16`
- **Path** : `M3.5 8.5L6.5 11.5L12.5 4.5`
- **Stroke** : `--icon-stroke-width` (Checkbox utilise son propre `--checkbox-mark-stroke-width: 2.5`)
- **Usage** : `checkbox.html` (état coché), `toast.html` (variant succès/défaut)

## Close (croix) ✅ TRANCHÉ — CHANGÉ

- **viewBox** : `0 0 24 24`
- **Path** : `M18 6 6 18M6 6l12 12`
- **Stroke** : `2.2` (nouveau — ne correspond à aucun token existant, à ajouter)
- **Décision (2026-07-02)** : variante B (bold, 2.2) retenue parmi 3 candidates + l'ancienne. Remplace l'ancien Close (`viewBox 0 0 16 16`, `M4 4L12 12M12 4L4 12`, stroke 1.5) utilisé dans `modal.html` et `toast.html` — ces deux fichiers à migrer.

## Plus / Ajouter ✅ TRANCHÉ

- **viewBox** : `0 0 24 24`
- **Path** : `M12 4v16m8-8H4`
- **Stroke** : `2.5` (nouveau — pas encore de token, à ajouter)
- **Décision (2026-07-02)** : variante C (bold, 2.5) retenue parmi 3 candidates.

## Corbeille / Supprimer ✅ TRANCHÉ

- **viewBox** : `0 0 24 24`
- **Path** : `M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16`
- **Stroke** : `2`
- **Décision (2026-07-02)** : variante A (pleine) retenue parmi 3 candidates.

## Édition / Crayon ✅ TRANCHÉ

- **viewBox** : `0 0 24 24`
- **Path** : `M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z`
- **Stroke** : `1.8`
- **Décision (2026-07-02)** : variante A (avec cadre, 1.8) retenue parmi 2 candidates.

## Flèche retour / précédent ✅ TRANCHÉ

- **viewBox** : `0 0 14 14`
- **Path** : `M9 2L4 7L9 12`
- **Stroke** : `1.8`
- **Décision (2026-07-02)** : variante A (fine, 1.8) retenue parmi 2 candidates.

## Alert (cercle + point d'exclamation)

- **viewBox** : `0 0 16 16`
- **Path** : `<circle cx="8" cy="8" r="6.5" /><path d="M8 5.2V8.8M8 11.2h.01" />`
- **Stroke** : `--icon-stroke-width`
- **Usage** : `toast.html` (variant erreur)

## Chevron bas ✅ TRANCHÉ

- **viewBox** : `0 0 20 20`
- **Path** : `M5 7.5l5 5 5-5`
- **Stroke** : `1.5`
- **Décision (2026-07-02)** : variante D (arrondi, 1.5) retenue parmi 4 candidates en prod. Remplace le chevron CSS border-trick actuel de `select.css` (`.ds-select-wrapper::after`) — à migrer en SVG.

## Triangle disclosure

- Construit en CSS (border-trick), pas un SVG — voir `disclosure.css` `.ds-disclosure__icon`.

---

## Icônes de navigation (copiées à l'identique depuis `dashboard.html`, lignes 61-90)

Stroke fixe à `--icon-stroke-width-bold` (2) — ne pas harmoniser avec le reste, c'est un choix volontaire pour matcher la prod exactement.

### Vision (bar chart)

- **viewBox** : `0 0 24 24`
- **Path** : `M4 19V5M4 19h16M9 16V9M14 16V7M19 16v-4`
- **Usage** : `tabs.html`

### Jalons (drapeau)

- **viewBox** : `0 0 24 24`
- **Path** : `M4 21V5m0 0l14 5L4 15`
- **Usage** : `tabs.html`

### Exécution (checklist)

- **viewBox** : `0 0 24 24`
- **Path** : `<path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />`
- **Usage** : `tabs.html`

---

## Icônes de production (dashboard.html et autres écrans, catalogue exhaustif)

Extrait de `dashboard.html`, `index.html`, `jalon.html`, `jalons-edit.html`, `jalons.html`, `objectif-intro.html`, `objectif.html`. **Constat** : forte incohérence de poids/tailles dans la prod actuelle — 4 variantes de chevron, 3 variantes de croix fermer, 3 variantes de plus, 3 variantes de corbeille. Ce catalogue documente l'existant tel quel ; l'harmonisation (choisir UNE variante par intention) est un chantier à part, pas fait ici.

### Calendrier

- **viewBox** : `0 0 24 24`, stroke-width prod : `2`
- **Path** : `<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>`
- **Usage** : `dashboard.html`, `jalons-edit.html`, `jalons.html`, `objectif.html`

### Corbeille / Supprimer (variante A — pleine)

- **viewBox** : `0 0 24 24`, stroke-width prod : `2`
- **Path** : `M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16`
- **Usage** : `dashboard.html`

### Corbeille / Supprimer (variante B — simple)

- **viewBox** : `0 0 24 24`, stroke-width prod : `2`
- **Path** : `M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6`
- **Usage** : `dashboard.html`

### Corbeille / Supprimer (variante C — détaillée)

- **viewBox** : `0 0 24 24`, stroke-width prod : `2`
- **Path** : `M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6` + `M10 11v6M14 11v6M9 6V4h6v2`
- **Usage** : `dashboard.html`

### Rafraîchir / Synchroniser

- **viewBox** : `0 0 24 24`, stroke-width prod : `2`
- **Path** : `M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15`
- **Usage** : `dashboard.html` (bouton "Synchroniser")

### Presse-papier / Clipboard

- **viewBox** : `0 0 24 24`, stroke-width prod : `1.5`
- **Path** : `M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2`
- **Usage** : `dashboard.html`

### Édition / Crayon

- **viewBox** : `0 0 24 24`, stroke-width prod : `1.8`
- **Path** : `M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7` + `M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z`
- **Usage** : `dashboard.html`

### Édition / Lien externe

- **viewBox** : `0 0 24 24`, stroke-width prod : `2`
- **Path** : `M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z`
- **Usage** : `dashboard.html`

### Liste (vue liste, à puces)

- **viewBox** : `0 0 24 24`, stroke-width prod : `2`
- **Path** : `M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01`
- **Usage** : `dashboard.html`

### Kanban (vue colonnes)

- **viewBox** : `0 0 24 24`, stroke-width prod : `2`
- **Path** : `M4 5h6v14H4zM14 5h6v8h-6zM14 17h6v2h-6z`
- **Usage** : `dashboard.html`

### Sous-tâche — coche (paire avec cercle, voir dashboard.html `SUBTASK_ICON`)

- **viewBox** : `0 0 14 14`, stroke-width prod : `1.4`
- **Path** : `M4.5 7l1.8 1.8 3.2-3.2` (dans un `<circle cx="7" cy="7" r="5.5"/>`)
- **Usage** : `dashboard.html`
- **Note** : c'est l'icône source de notre variante ronde du Checkbox (`checkbox.html`) — path différent (plus petit/différentes proportions), à harmoniser si besoin.

### Flèche droite / Suivant

- **viewBox** : `0 0 24 24`, stroke-width prod : `2`
- **Path** : `M5 12h14M12 5l7 7-7 7`
- **Usage** : `dashboard.html`

### Flèche gauche / Précédent

- **viewBox** : `0 0 14 14`, stroke-width prod : `1.8`
- **Path** : `M9 2L4 7L9 12`
- **Usage** : `jalons-edit.html`

### Flèche gauche / Retour (large)

- **viewBox** : `0 0 24 24`, stroke-width prod : `2.5`
- **Path** : `M19 12H5M12 19l-7-7 7-7`
- **Usage** : `objectif-intro.html`, `objectif.html`

### Plus / Ajouter (variante fine)

- **viewBox** : `0 0 24 24`, stroke-width prod : `2`
- **Path** : `M12 5v14M5 12h14`
- **Usage** : `dashboard.html`

### Plus / Ajouter (variante medium)

- **viewBox** : `0 0 24 24`, stroke-width prod : `2`
- **Path** : `M12 4v16M4 12h16`
- **Usage** : `jalons-edit.html`

### Plus / Ajouter (variante bold)

- **viewBox** : `0 0 24 24`, stroke-width prod : `2.5`
- **Path** : `M12 4v16m8-8H4`
- **Usage** : `dashboard.html`

### Check / Validation (large, bold)

- **viewBox** : `0 0 24 24`, stroke-width prod : `3`
- **Path** : `M5 13l4 4L19 7`
- **Usage** : `dashboard.html`

### Fermer / Croix (variante standard)

- **viewBox** : `0 0 24 24`, stroke-width prod : `2`
- **Path** : `M6 18L18 6M6 6l12 12`
- **Usage** : `dashboard.html`

### Fermer / Croix (variante bold)

- **viewBox** : `0 0 24 24`, stroke-width prod : `2.2`
- **Path** : `M18 6 6 18M6 6l12 12`
- **Usage** : `dashboard.html`

### Chevron bas (dropdown, petit)

- **viewBox** : `0 0 14 14`, stroke-width prod : `1.8`
- **Path** : `M4 5.5L7 8.5L10 5.5`
- **Usage** : `dashboard.html`

### Chevron haut (petit)

- **viewBox** : `0 0 12 12`, stroke-width prod : `1.8`
- **Path** : `M2 9L6 3.5L10 9`
- **Usage** : `dashboard.html`

### Chevron bas (petit, variante)

- **viewBox** : `0 0 12 12`, stroke-width prod : `1.8`
- **Path** : `M2 3.5L6 8.5L10 3.5`
- **Usage** : `dashboard.html`

### Chevron bas (dropdown, large)

- **viewBox** : `0 0 24 14`, stroke-width prod : `2`
- **Path** : `M2 2L12 12L22 2`
- **Usage** : `index.html`

### Chevron bas (dropdown, moyen)

- **viewBox** : `0 0 18 12`, stroke-width prod : `1.8`
- **Path** : `M2 2L9 9L16 2`
- **Usage** : `index.html`

### Chevron bas (dropdown, arrondi)

- **viewBox** : `0 0 20 20`, stroke-width prod : `1.5`
- **Path** : `M5 7.5l5 5 5-5`
- **Usage** : `jalons.html`

### Édition / Édit (crayon simple, forme fermée)

- **viewBox** : `0 0 12 12`, stroke-width prod : `1.8`
- **Path** : `M8 1.5L10.5 4L4 10.5H1.5V8L8 1.5Z`
- **Usage** : `dashboard.html`

### Utilisateur / Personne

- **viewBox** : `0 0 24 24`, stroke-width prod : `1.5`
- **Path** : `M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z`
- **Usage** : `index.html`

### Non cataloguables (générés dynamiquement, pas des icônes fixes)

- **Graphique KPI** (`dashboard.html`) — SVG construit en JS avec des variables (`${sW}`, `${area}`, `${path}`) : c'est le composant Chart/Graphique du backlog (#1), pas une icône statique.
- **Sparkline décorative** (`dashboard.html`, viewBox `280 140`) et **courbe de jalons** (`jalons.html`, viewBox `1000 400`) — tracés de graphique dynamiques, même famille que le Chart/Graphique du backlog.
- **Icône data-driven** (`dashboard.html`, `d="${it.icon}"`) — path injecté depuis une variable JS, dépend du contexte d'appel, pas figé.
