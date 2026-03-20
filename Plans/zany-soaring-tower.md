# Dashboard — Layout 60/40 + Police Inter unifiée

## Context

Suite aux itérations de layout (50/50 → 70/30), Gemini recommande un ratio 60/40 comme "golden ratio" pour ce dashboard d'exécution : la colonne todo à 40% donne assez d'espace pour des tâches détaillées sans couper le graphique KPI à gauche. Parallèlement, la police actuelle mélange DM Mono (51 éléments), Rifton (3 éléments display) et Inter — on unifie tout en Inter pour la lisibilité et la cohérence.

---

## Fichiers à modifier

1. **`dashboard.css`** — 3 changements
2. **`dashboard.html`** — 1 changement (Google Fonts link)

---

## Fix 1 — Layout : 70/30 → 60/40 (dashboard.css ~179)

**Problème :** 70/30 trop étroit pour la colonne todo sur écrans standard.

```css
/* Avant */
.db-layout {
    grid-template-columns: 70fr 30fr;
}

/* Après */
.db-layout {
    grid-template-columns: 3fr 2fr;  /* 60/40 exact */
}
```

---

## Fix 2 — Variable font : --mono → Inter (dashboard.css ~1-4)

**Problème :** `var(--mono)` = DM Mono (monospace). 51 éléments l'utilisent. On change la variable à la racine — tous les éléments basculent en un seul changement.

```css
/* Avant */
:root {
    --mono: 'DM Mono', 'Courier New', monospace;
}

/* Après */
:root {
    --mono: 'Inter', -apple-system, sans-serif;
}
```

---

## Fix 3 — Rifton → Inter Bold (dashboard.css)

**Problème :** 3 éléments utilisent `font-family: 'Rifton', serif` hardcodé (titles, KPI big value, empty state). Rifton est une police locale qui peut ne pas charger. → Inter 800 pour les titres display.

Éléments concernés :
- `.proj-title` (~ligne 77) : `font-family: 'Rifton', serif` → `font-family: 'Inter', sans-serif; font-weight: 800;`
- `.kpi-big-val` (~ligne 468) : même remplacement
- `.db-empty-title` (~ligne 1207) : même remplacement

---

## Fix 4 — Google Fonts link : retirer DM Mono (dashboard.html ~9)

**Problème :** DM Mono n'est plus utilisé, inutile de le charger.

```html
<!-- Avant -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&display=swap" rel="stylesheet">

<!-- Après -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
```

Ajout des poids 800 et 900 pour les titres display qui étaient en Rifton.

---

## Contraste — État actuel (pas de nouveaux fix nécessaires)

Les corrections de la session précédente couvrent déjà les problèmes critiques :
- `.todo-text` → 0.75 (~9.2:1) ✅
- `.todo-del / .todo-edit` → 0.35 (~3.8:1, icônes hover-only) ✅
- `.subtask-del` → 0.35 ✅
- `.subtask-input::placeholder` → 0.28 (hint, non-critique) ✅
- `.db-citation` → 0.35 ✅

Avec Inter (police sans-serif à x-height élevé), les ratios effectifs seront légèrement meilleurs que DM Mono à même opacité — pas de régressions attendues.

---

## Ordre d'implémentation

1. `dashboard.css` ligne ~1-4 : Fix 2 (variable --mono)
2. `dashboard.css` ligne ~77 : Fix 3a (proj-title)
3. `dashboard.css` ligne ~468 : Fix 3b (kpi-big-val)
4. `dashboard.css` ligne ~1207 : Fix 3c (db-empty-title)
5. `dashboard.css` ligne ~179 : Fix 1 (grid 60/40)
6. `dashboard.html` ligne ~9 : Fix 4 (Google Fonts)

---

## Vérification

1. `http://localhost:9999/dashboard.html`
2. **Police** : tous les textes (labels, inputs, badges, todo) en Inter — aucun DM Mono visible
3. **Titres** : `.proj-title` et KPI big value en Inter bold (pas Rifton)
4. **Layout** : colonne droite (todo) visiblement plus large que 30%, champ de saisie confortable
5. **Contraste** : labels SMART, todo-text, badges lisibles sans hover
