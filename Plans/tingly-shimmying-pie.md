# Plan — Dashboard : Lisibilité, Taille, Cohérence Titres

## Context
4 problèmes identifiés sur le dashboard cinématique :
1. Quote MRR incompréhensible pour le grand public ("MRR" = jargon)
2. Dashboard trop grand — manque de respiration
3. Aucune cohérence des titres entre les cartes (SMART sans titre, graphique sans titre)
4. "Indicateur Clé (KPI)" + description KPI dans la carte gauche = redondant et confus

---

## Fichiers à modifier
- `index.html` — quote MRR, HTML carte gauche label, HTML carte droite label, JS updateDashboard
- `styles.css` — taille dashboard

---

## 1. Quote MRR — JS examples

**Avant :** `quote: '"Je veux 2 000 € MRR avec mon projet."'`
**Après :** `quote: '"Je veux vivre de mon projet."'`

Simple, universel, compris par tout le monde.

---

## 2. Dashboard plus petit — styles.css

```css
/* Avant */
.cin-dashboard {
    width: min(860px, 90vw);
    min-height: min(520px, 65vh) !important;
    padding: 40px !important;
}

/* Après */
.cin-dashboard {
    width: min(780px, 88vw);
    min-height: min(460px, 58vh) !important;
    padding: 28px !important;
}
```

---

## 3. Cohérence titres — 3 sections, même traitement

Chaque section a un label `.cin-section-label` au-dessus de son contenu. Actuellement :
- Carte gauche : "Indicateur Clé (KPI)" (confus — c'est le plan SMART, pas le KPI)
- Carte droite : aucun titre
- Bas : "PROCHAINE ACTION" (correct)

**Fix :**

### 3a. Carte gauche — index.html (statique)
Changer le label "Indicateur Clé (KPI)" → **"PLAN SMART"**
Supprimer le `<div class="cin-kpi-main" id="cinKpiMain"></div>` — description KPI redondante avec la carte droite.

```html
<!-- Avant -->
<div>
    <div class="cin-section-label">Indicateur Clé (KPI)</div>
    <div class="cin-kpi-main" id="cinKpiMain"></div>
</div>

<!-- Après -->
<div class="cin-section-label">Plan Smart</div>
```

### 3b. Carte droite — JS updateDashboard
Ajouter un label "PROGRESSION" au-dessus du bloc stats dans `cinKpiStats` :

```js
document.getElementById('cinKpiStats').innerHTML =
    `<div class="cin-stats-block">
        <div class="cin-section-label" style="margin-bottom:8px;">Progression</div>
        <div class="cin-stats-label">${data.kpiLabel}</div>
        <div class="cin-db-kpi-unit">${data.kpiCurrent}</div>
        <div class="cin-progress-bar-wrap">
            <div class="cin-progress-bar" style="width:${data.kpiProgressPct}%"></div>
        </div>
        <div class="cin-progress-legend">${data.kpiCurrent} / ${data.kpiGoal}</div>
    </div>`;
```

### 3c. Supprimer `cinKpiMain` du JS updateDashboard
Retirer la ligne `document.getElementById('cinKpiMain').textContent = data.kpiMain;` — l'élément n'existe plus.

---

## 4. Résultat attendu (cohérence)

| Carte | Titre | Contenu |
|-------|-------|---------|
| Gauche | PLAN SMART | S / M / A / R / T rows |
| Droite | PROGRESSION | KPI actuel + barre + graphique |
| Bas | PROCHAINE ACTION | Checklist tâches |

---

## Vérification
1. Serveur tourne sur `http://localhost:9999`
2. Cycler les 3 exemples — vérifier :
   - Quote UTMB/Livre inchangées, quote MRR = "Je veux vivre de mon projet."
   - Dashboard plus compact
   - Carte gauche : titre "PLAN SMART" visible, pas de description KPI
   - Carte droite : titre "PROGRESSION" visible au-dessus de la valeur
   - "PROCHAINE ACTION" identique
   - Cohérence visuelle des 3 titres
