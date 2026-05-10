# CarryIT Dashboard — Fonctionnalités

> Documentation de toutes les fonctionnalités du dashboard (`dashboard.html` + `assets/css/dashboard.css`)

---

## 1. Navigation & Multi-projets

### Navbar
- Logo "CARRY IT" (lien vers `index.html`)
- **Dropdown de sélection de projet** (visible uniquement si ≥ 2 projets) : affiche le nom du projet actif, clic pour switcher entre projets
- Bouton **⇄ Sync** (export/import JSON)
- Lien **+ Nouveau projet** → `objectif.html`

### Project Switcher
- Quand plusieurs projets : tabs dans le dropdown + panels séparés par projet
- `switchProject(i)` : change le panel actif, scroll haut, réinitialise le graphique KPI
- **État vide** : si aucun objectif, affiche un écran vide avec CTA "Créer un objectif"

---

## 2. Sync de données (modal)

Accès : bouton "⇄ Sync" dans la navbar.

- **Exporter** : télécharge un fichier `.json` avec toutes les données localStorage
- **Importer** : upload d'un fichier `.json` pour restaurer les données sur un autre appareil
- Mention : "Tes données ne quittent jamais ton appareil" (100% local, zéro serveur)

---

## 3. En-tête du projet (`proj-header`)

Pour chaque projet :
- **Titre** du projet (`proj-title`)
- **Badges** : date d'échéance (T · JJ MMM AAAA), fréquence de mesure, nombre de jalons
- **"Modifier le projet →"** : lien vers `objectif.html` pour re-paramétrer le SMART
- **Bouton suppression** (icône poubelle) : déclenche une modale de confirmation irréversible

---

## 4. Objectif SMART (`smart-panel`)

Panel en haut à droite du projet.

### Vue lecture
5 lignes en lecture seule :
| Lettre | Label | Contenu |
|--------|-------|---------|
| S | L'Ambition | Quoi exactement |
| M | La Mesure | Indicateur + unité cible |
| A | Atteignable | Pourquoi c'est réalisable |
| R | Réaliste | Contraintes / ressources |
| T | L'Échéance | Date cible |

### Vue édition
- Bouton **"Modifier"** → bascule vers un formulaire texte (textarea par champ)
- Validation : tous les champs obligatoires — message d'erreur si manquant
- **Sauvegarder** / **Annuler** : les valeurs sont persistées dans localStorage

---

## 5. Graphique KPI (`kpi-panel`)

Panel en haut à gauche, à côté du SMART.
Librairie : **TradingView Lightweight Charts** (standalone CDN, pas Chart.js).

---

### Ce que le graphique représente

Le KPI affiché est celui défini dans le champ **M (Mesurable)** de l'objectif SMART.  
Ex : "100 clients", "50 000€ de CA", "20 articles publiés".  
C'est l'évolution de ce KPI dans le temps — pas un graphique de productivité, pas un suivi de tâches.

---

### Apparence

- **Type** : ligne (LineSeries) + points visibles à chaque mesure
- **Couleur** : `#EE4408` (orange CarryIT) — ligne et points
- **Fond** : transparent (suit le fond de la carte)
- **Axe Y** : à **gauche** (convention dashboard/analytics, pas trading)
- **Axe X** : dates en format `JJ/MM`
- **Grille** : très subtile (`rgba(255,255,255,0.04)`)
- **Axes border** : `rgba(255,255,255,0.06)`
- **Labels** : `rgba(255,255,255,0.35)`, Inter 11px
- **Scroll/zoom** : désactivé — graphique statique

---

### Valeurs

- **Entiers stricts** : le KPI est toujours affiché comme un entier (pas de `0.20 client`)
- `minMove: 1` sur l'axe Y — pas de ticks décimaux
- Formatter Y : `Math.round(price)`

---

### Données

Structure d'une mesure : `{ id, date: 'DD/MM/YYYY', value: Number, timestamp: ms }`

**Règles de gestion :**
- Mesures triées par date croissante automatiquement
- Aucune valeur négative (`min = 0`)
- **Plusieurs mesures le même jour** → **moyenne arrondie à l'entier** (`Math.round`)
- Max Y = `Math.ceil(maxVal * 1.15)` — marge visuelle +15%

---

### États

| État | Affichage |
|------|-----------|
| Aucune mesure | Zone cliquable avec bordure dashed orange, texte "Aucune mesure enregistrée · Ajouter une mesure" |
| 1+ mesures | Graphique ligne complet |

---

### Interactions

| Action | Comportement |
|--------|-------------|
| Hover point | Tooltip natif TradingView : date + valeur |
| Clic sur point | Ouvre modal d'édition de la première mesure sur cette date |
| Bouton "+ Ajouter une mesure" | Ouvre modal d'ajout |

---

### Modal — Ajouter une mesure

Champs :
- **Date** : obligatoire, format date picker (YYYY-MM-DD converti en DD/MM/YYYY au stockage)
- **Valeur** : obligatoire, numérique, ≥ 0

Messages d'erreur :
- `"La date est requise"`
- `"Valeur numérique requise"`
- `"Valeur négative interdite"`

---

### Modal — Modifier / Supprimer une mesure

Champs : Date + Valeur (pré-remplis)

Actions :
- **Sauvegarder** : met à jour la mesure, rafraîchit le graphique
- **Supprimer** : retire la mesure, rafraîchit le graphique
- **Annuler** (ou ×) : ferme sans modifier

---

### Responsive

`ResizeObserver` sur le container → `chart.resize(w, h)` automatique quand la carte change de taille.

---

### Implémentation technique

```
Lib     : unpkg.com/lightweight-charts (standalone, latest)
Série   : LightweightCharts.LineSeries
Y scale : leftPriceScale (rightPriceScale hidden)
Instance: kpiCharts[i] — une instance par projet, détruite avant recréation
Refresh : initKPIChart(i, obj) appelé après tout ajout/édition/suppression de mesure
```

---

## 6. Jalons — Timeline horizontale (`jalons-panel`)

Section "Étapes Clés" en bas du projet.

### Affichage
- Timeline en 3 lignes parallèles :
  - **Haut** : tag + date de chaque jalon
  - **Milieu** : points colorés reliés par des segments (statut visuel)
  - **Bas** : titre + KPI de validation + % de progression
- Points cliquables : clic → popup de détail du jalon

### Statuts des points
| Statut | Couleur | Label |
|--------|---------|-------|
| `completed` | vert | Validé |
| `in_progress` | orange | En cours |
| `pending` | gris | À venir |

### Popup de détail jalon
Apparaît sous la timeline au clic sur un point :
- Numéro jalon (ex: Jalon 2/5)
- Tag, date, statut
- Titre
- Description (si renseignée)
- Critère de validation KPI (si renseigné)
- Lien "ajouter une description" si vide

### Lien "Gérer →"
Ouvre `jalons.html` pour créer/modifier/réordonner les jalons.

---

## 7. Bloc Jalon actif + Tâches (`jt-section`)

Bloc central du projet, zone de travail quotidien.

### Tabs jalons (navigation)
- Une tab par jalon, ordre chronologique gauche → droite
- Tab active = jalon en cours de visualisation
- Tab complétée = style barré/vert
- Clic sur une tab → `switchJalonView()` → filtre les tâches pour ce jalon

### Carte Jalon actif (`jt-jalon-card`)
- Label "JALON ACTIF · X/Y" ou "JALON X/Y"
- Titre + date du jalon visualisé
- Bouton **"✓ Valider"** → marque le jalon `completed` (irréversible depuis le dashboard)
- Badge "✓ Validé" si déjà complété
- Lien "Gérer →" vers `jalons.html`

### Toolbar tâches
Toggle **Liste / Kanban** pour basculer la vue des tâches

---

## 8. Tâches — Vue Liste

### Ajout
- Champ texte en haut du bloc : "Ajouter une action"
- Validation : `Enter` ou `blur` → crée la tâche
- La tâche est automatiquement associée au jalon visualisé

### Statuts (cycle à 3 états)
```
todo → doing → done → todo (cycle au clic sur le bouton)
```
| Statut | Icône | Section |
|--------|-------|---------|
| `todo` | cercle vide | "À faire" |
| `doing` | cercle semi | "En cours" |
| `done` | cercle plein | "Terminées (N)" |

### Affichage groupé
- Section "En cours" en premier
- Section "À faire" ensuite
- Section "Terminées (N)" collapsible (toggle)

### Actions par tâche
- **Clic sur le check** : cycle todo → doing → done
- **⋯** : ouvre le side panel de détail
- **×** : suppression directe
- **▼** : toggle checklist inline (sous-tâches)
- **Clic sur le texte** (desktop) : édition inline (contentEditable)

### Sous-tâches (checklist inline)
- Se déplie sous chaque tâche via le bouton ▼
- Chaque sous-tâche : toggle done/undone + édition inline + suppression
- Champ d'ajout : "Ajouter une sous-tâche..." (blur ou Enter)
- Compteur "X/Y" affiché dans la meta de la tâche parente

---

## 9. Tâches — Vue Kanban

3 colonnes drag & drop :
- **À faire** / **En cours** / **Terminé**

### Carte Kanban
- Titre de la tâche
- Compteur sous-tâches "X/Y" si présent
- **⋯** : ouvre le side panel
- **×** : suppression
- Drag & drop natif (`draggable`, ondragstart/drop) entre colonnes
- **Touch support** : swipe pour déplacer sur mobile

### Drop
- `dropKanbanTask()` → change le statut de la tâche selon la colonne cible
- Indicateur visuel `drag-over` sur la colonne survolée

---

## 10. Side Panel — Détail d'une tâche

S'ouvre en glissant depuis la droite (overlay).

### Contenu
- **Badge statut** cliquable (cycle todo → doing → done)
- **Titre** éditable inline (clic → contentEditable)
- **Jalon associé** + date (lecture seule)
- **Zone Notes** : textarea libre persistée en temps réel
- **Checklist** : sous-tâches avec toggle, édition inline, suppression, ajout

### Comportement mobile
- Sur mobile (touch/pointer:coarse) : overlay plein écran, scroll body gelé
- Sur desktop : panel latéral, body scroll maintenu
- Fermeture : clic sur overlay, bouton "×" ou bouton "← Retour"

---

## 11. Persistance des données

Toutes les données sont stockées dans **`localStorage`** (zéro backend).

| Clé | Contenu |
|-----|---------|
| `carryItAllObjectifs` | Array de tous les projets + tâches + jalons + mesures |
| `carryItMilestones` | Jalons partagés (optionnel) |

### Rétrocompatibilité
- Migration automatique depuis l'ancien format `carryItObjectifSMART`
- `ensureTaskTarget()` : ré-associe les tâches orphelines au prochain jalon actif
- Champ `kpiType` initialisé à `'cumulatif'` si absent

---

## 12. Modales

| Modal | Déclencheur | Actions |
|-------|-------------|---------|
| **Sync** | Bouton navbar | Export JSON / Import JSON |
| **Ajouter mesure** | "+ Ajouter une mesure" | Saisir date + valeur KPI |
| **Modifier mesure** | Clic point graphique | Modifier valeur, date, ou supprimer |
| **Supprimer projet** | Icône poubelle projet | Confirmer suppression irréversible |

---

## 13. Citation

En bas de chaque projet :

> *"C'est quand t'as envie d'abandonner que tout commence."*

---

## Résumé des pages liées

| Page | Rôle |
|------|------|
| `dashboard.html` | Vue principale — suivi en cours |
| `objectif.html` | Création / modification SMART d'un projet |
| `jalons.html` | Gestion des étapes clés (création, réordonnancement, suppression) |
| `index.html` | Landing page |
