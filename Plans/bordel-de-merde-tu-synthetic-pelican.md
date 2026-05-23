# Plan — Fix date picker jalons.html

## Context

Le date picker sur chaque jalon ne s'ouvre jamais. Trois tentatives de fix ont échoué. Audit complet révèle que les deux derniers "fixes" ont créé de nouveaux bugs en s'empilant : `pointer-events: none` sur le SVG + `stopPropagation` sur l'input → les deux bloquent le flux de clics. Le `openDatePicker()` ne s'exécute jamais.

## Root Cause

Deux bugs introduits en voulant "fixer" :

1. **SVG a `pointer-events: none`** → les clics sur le SVG passent au parent span ✓ en théorie, mais...
2. **Input a `onclick="event.stopPropagation()"`** → quand l'utilisateur clique l'input directement, le click NE remonte jamais au span → `openDatePicker()` jamais appelé

Résultat : aucun chemin de clic ne fonctionne correctement.

## Fix (minimal, ciblé)

**Fichier :** `jalons.html`

### 1. Template HTML dans `render()` (ligne ~1426–1429)

Supprimer `pointer-events:none` du SVG, ajouter `onclick` directement dessus.  
Supprimer `onclick="event.stopPropagation()"` de l'input.  
Supprimer `onclick` du span wrapper.

**Avant :**
```html
<span class="jalon-date-label" onclick="openDatePicker('dp-${m.id}')" style="cursor:pointer;">
    <svg ... style="...pointer-events:none;" >...</svg>
    <input type="date" id="dp-${m.id}" ... onclick="event.stopPropagation()" onchange="...">
</span>
```

**Après :**
```html
<span class="jalon-date-label">
    <svg ... style="flex-shrink:0;opacity:.7;cursor:pointer;" onclick="openDatePicker('dp-${m.id}')">...</svg>
    <input type="date" id="dp-${m.id}" class="jalon-date-input" value="${dateInputValue}" onchange="updateDate('${m.id}', this.value)" title="Modifier la date">
</span>
```

### 2. La fonction `openDatePicker` (ligne ~1267) — ne pas toucher

Elle est correcte : try/catch, showPicker → click → focus en fallback.

### 3. CSS `.jalon-date-input` — ne pas toucher

Le CSS existant est ok. L'input lui-même s'ouvre nativement quand cliqué directement.

## Résultat attendu

- Clic sur SVG → onclick SVG → `openDatePicker()` → `showPicker()` → picker s'ouvre ✓  
- Clic direct sur l'input → comportement natif browser → picker s'ouvre ✓  
- Aucun conflit, aucun stopPropagation, aucun bubbling complexe

## Vérification

1. Ouvrir `jalons.html` dans le browser (server `python3 -m http.server 9999`)
2. Cliquer l'icône calendrier SVG sur un jalon → picker doit s'ouvrir
3. Cliquer directement sur le texte de date → picker doit s'ouvrir
4. Sélectionner une nouvelle date → jalon doit se mettre à jour (année/mois dans le rail)
5. Tester sur tous les jalons
