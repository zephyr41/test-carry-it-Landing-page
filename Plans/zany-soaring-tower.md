# Dashboard — Refonte UX/UI complète

## Context

Le dashboard actuel fonctionne bien côté logique (toutes les features sont là) mais l'UX/UI est générique, dense et manque de hiérarchie visuelle. L'objectif est une refonte purement cosmétique : **zéro changement JS**, uniquement CSS + structure HTML dans les fonctions `build*()`. Le nouveau design suit les inspirations modernes fournies (FundedNext dark, Virdee, ClickUp) tout en restant cohérent avec la charte Carry It (fond #080809, accent #EE4408, typo Rifton/Inter).

---

## Fichier unique à modifier

**`/Users/nils/Desktop/Carry-IT Entreprise/test-carry-it-Landing-page/dashboard.html`**

Trois zones dans ce fichier :
1. **`<style>` block** (lignes ~13–1275) — rewrite complet du CSS
2. **Fonctions `build*()`** (lignes ~1425–2103) — rewrite des templates HTML
3. **HTML des modals + side panel** (lignes ~1299–1365) — rewrite du markup

---

## Nouvelle architecture de layout

```
┌─────────────────────────────────────────────────────────────┐
│ [Navbar existante — inchangée]                              │
├─────────────────────────────────────────────────────────────┤
│  padding: 24px 32px 64px                                    │
│                                                             │
│  [Project Switcher — pill tabs]                             │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ PROJECT HEADER CARD                                   │  │
│  │  ● Orange accent bar (top-left border ou dot)        │  │
│  │  Titre (Rifton italic, 36-44px)    [Modifier →] [🗑] │  │
│  │  [T·deadline] [freq] [N jalons]                      │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────┐  ┌───────────────────────────────┐ │
│  │ SMART PANEL (38%)   │  │ KPI CHART PANEL (62%)         │ │
│  │                     │  │  Title + unit label           │ │
│  │  S · L'Ambition     │  │  [+ Ajouter une mesure btn]   │ │
│  │  M · La Mesure      │  │                               │ │
│  │  A · Atteignable    │  │  [line chart / empty state]   │ │
│  │  R · Réaliste       │  │                               │ │
│  │  T · L'Échéance     │  │  ─────────────────────────    │ │
│  │                     │  │  Current val · Progression %  │ │
│  │  [✎ Modifier]       │  │                               │ │
│  └─────────────────────┘  └───────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ TODO — "Exécution quotidienne"                        │  │
│  │  [Input field + send btn]                             │  │
│  │  ● Task 1   [▾] [✎] [×]                              │  │
│  │  ● Task 2                                             │  │
│  │  ── Terminées (3) ── [Afficher]                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ JALONS — "Étapes Clés"                [Gérer →]       │  │
│  │  ──●──────●──────●──────●──                          │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  "C'est quand t'as envie d'abandonner que tout commence."   │
└─────────────────────────────────────────────────────────────┘
```

---

## Design System (nouveau CSS)

### Couleurs (identiques aux CSS vars existantes)
- Fond page : `#080809`
- Card principale : `#0e0e10` (légèrement plus clair)
- Inner panels : `rgba(255,255,255,0.028)` + border `rgba(255,255,255,0.07)`
- Accent : `#EE4408`
- Texte primary : `#FFFDF6`
- Texte muted : `rgba(255,255,255,0.45)`
- Texte dim : `rgba(255,255,255,0.25)`

### Typographie
- Titre projet : `Rifton` italic, `clamp(28px, 3.5vw, 42px)`, `letter-spacing: -0.02em`
- Labels uppercase : 10-11px, `letter-spacing: 0.1em`, weight 700
- Valeurs SMART : 13px, `rgba(255,255,255,0.72)`
- Stats KPI : 18-20px bold pour current value

### Cards & Panels
- `.proj-card` : `border-radius: 20px`, `border: 1px solid rgba(255,255,255,0.08)`, `background: #0e0e10`
- Inner panels (`.smart-panel`, `.kpi-panel`, `.todo-panel`, `.jalons-panel`) : `border-radius: 14px`, subtler border, plus de padding
- Séparateur header/body : gradient border au lieu de solid

### Boutons
- `.proj-edit-link` : style pill, `border-radius: 8px`, texte 12px, hover → orange
- `.kpi-add-btn` : style compact, orange outline
- `.smart-edit-btn` : icon + text, hover orange
- `.todo-plus-btn` : icône "+" propre, 36×36px
- Checkboxes todo : `border-radius: 4px` (carré pour tâches), `border-radius: 50%` (rond pour subtasks)

### Project Switcher
- `.db-tab` : pills arrondis, `border-radius: 10px`, fond transparent → active = fond orange subtle
- Caché si 1 seul projet (déjà le cas)

### Modals
- `.m-box` : fond `#111113`, `border-radius: 20px`, `padding: 32px`, shadow `0 32px 80px rgba(0,0,0,0.85)`
- Inputs : height 44px, `border-radius: 10px`
- Bouton OK : `#EE4408`, pleine largeur flexible

### Side Panel
- `.side-panel` : fond `#0e0e10`, `width: 480px`, `border-left: 1px solid rgba(255,255,255,0.07)`, `padding: 28px`
- `.side-panel-title` : Rifton italic ou Inter bold, 20px
- Textarea notes : fond `rgba(255,255,255,0.03)`, border subtil

---

## Changements CSS précis (style block)

### Suppressions / remplacements
- `.db-2col` : ratio passe de `1fr 1.3fr` à `1fr 1.65fr` (SMART plus étroit, KPI plus large)
- `.proj-body` gap : `16px` → `20px`
- `.smart-panel` / `.kpi-panel` / `.todo-panel` / `.jalons-panel` : padding `18px` → `20px 22px`
- `.proj-title` font-size : déjà `clamp(26px, 3.5vw, 44px)` — ok
- `.kpi-big-val` : `54px` → `48px`, meilleure proportion
- `.todo-input` height : `36px` → `40px` (plus confortable)
- `.todo-item` hover : `rgba(255,255,255,0.04)` → `rgba(255,255,255,0.03)` (plus subtil)
- `.smart-row` border-bottom color : plus visible `rgba(255,255,255,0.07)` → `rgba(255,255,255,0.05)`
- `.jt-dot` size : `14px` → `16px` (plus lisible)
- `.jt-title` : `12px` → `13px`
- `.kpi-panel-top` : ajouter `padding-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.05);`
- `.proj-header` : ajouter `border-left: 3px solid #EE4408` sur `.proj-card` header indicator
- `.todo-cb` : changer le checkmark en SVG tick plus propre (border-bottom+border-left trick existant est ok)

### Ajouts
- `.proj-card` : `transition: none` (pas d'animation au render)
- `.db-header-accent` : barre verticale orange à gauche du header (pseudo-élément ou div)
- `.kpi-stat-row` : flex row avec gap pour afficher current val + badge côte à côte
- `.smart-letter` : changer de simple texte orange → petit badge carré/pill avec fond `rgba(238,68,8,0.12)`, taille `16×16`, centré

---

## Changements HTML dans les build functions

### `buildProjectCard()` — modifications layout
- Supprimer la `.db-citation` de la fin (déplacer dans le footer hors carte)
- Wrapper le header dans un div avec classe `proj-card-header-inner` pour la barre d'accent
- Réorganiser `.proj-body` : garder l'ordre (2col SMART+KPI, todo, jalons)

### `buildSmartRow()` — lettre en badge
```html
<!-- Avant -->
<span class="smart-letter">S</span>

<!-- Après -->
<span class="smart-letter"><span class="smart-letter-badge">S</span></span>
```
Avec CSS `.smart-letter-badge` : `background: rgba(238,68,8,0.1); border: 1px solid rgba(238,68,8,0.2); border-radius: 6px; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: #EE4408;`

### `buildTodoPanel()` — input amélioré
- Changer le `+` textuel du bouton en SVG icon propre
- Ajouter placeholder plus inspirant : `"Quelle action aujourd'hui ?"`
- Ajouter une transition légère sur le todo-item

### `buildJalonsPanel()` — dots plus grands
- `.jt-dot` → 16px (mis à jour CSS)
- Ajouter un tooltip au hover sur les dots avec titre+date (via `title` attribute HTML)

### KPI empty state
- Icône SVG plus grande et centrée
- Texte plus encourageant : "Premier pas : enregistrez votre point de départ"

### KPI single state
- Big number plus aéré
- Ajouter sous-texte motivant

---

## Modals — retouches HTML

Les modals (`#measureModalOverlay`, `#editMeasureModalOverlay`, `#deleteConfirmModal`) :
- `.m-box` : ajouter `backdrop-filter: blur(4px)` sur l'overlay
- `.m-btns` : ajouter `flex-direction: column-reverse` sur mobile
- Bouton supprimer dans edit modal : changer couleur → rouge subtle `rgba(255,59,48,0.1)` border `rgba(255,59,48,0.3)` texte `#FF3B30`

---

## Side Panel — retouches

- Titre en Inter bold 20px (garder `side-panel-title` class)
- Labels en uppercase 10px, tracking 0.1em
- Textarea notes : min-height 100px, meilleur focus ring
- Séparateur entre sections : `border-top: 1px solid rgba(255,255,255,0.05)` + `margin: 16px 0`

---

## Stratégie d'implémentation

**Ordre des modifications dans dashboard.html :**

1. **CSS block** : Rewrite ligne par ligne chaque classe dans `<style>` — garder TOUS les noms de classes, modifier uniquement les valeurs CSS + ajouter nouvelles classes helper
2. **HTML statique** (lignes 1278-1365) : Navbar inchangée, retoucher les 3 modals + side panel
3. **`buildProjectCard()`** : Ajuster layout, ajouter barre accent header
4. **`buildSmartRow()` + `buildSmartEditRow()`** : Badge lettres, meilleur espacement
5. **`buildTodoPanel()` + `renderTaskItem()`** : Input amélioré, SVG icon
6. **`buildJalonsPanel()`** : Dots avec tooltip title attribute
7. **`initKPIChart()`** : Retoucher les empty states + single state HTML
8. **Zero changement** à tout le reste du JS

---

## Vérification

1. Ouvrir `http://localhost:9999/dashboard.html` (python3 -m http.server 9999)
2. Vérifier layout desktop avec > 1 projet : SMART + KPI côte à côte
3. Tester inline edit SMART → save → annuler
4. Tester ajout mesure → chart s'affiche
5. Tester todo : add/check/edit/delete/subtasks
6. Tester side panel (clic sur texte tâche)
7. Tester modal supprimer projet
8. Vérifier responsive 768px (mobile) : colonnes empilées
9. Vérifier switcher multi-projets si plusieurs objectifs
