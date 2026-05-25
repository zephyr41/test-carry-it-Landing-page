# Dashboard — CarryIT

## Vue d'ensemble

Le dashboard est le cœur de CarryIT. Il relie vision long terme, pilotage moyen terme et exécution court terme pour un projet (objectif SMART).

---

## Navigation

### Barre de navigation supérieure

- **Logo** + lien retour accueil
- **Dropdown projet** : affiche le projet actif (initiale + nom). Permet de switcher entre projets, de renommer, de supprimer.
- **Bouton Synchroniser** : export/import JSON (transfert entre appareils, données 100% locales)

### Onglets principaux

3 onglets au bas de la navbar :

| Onglet | `data-view` | Rôle |
|---|---|---|
| Pilotage & Vision | `pilotage` | Vision long terme — KPI global + Objectif SMART |
| To-do list | `execution` | Exécution court terme — tâches liées aux jalons |
| Jalons | `jalons` | Pilotage moyen terme — timeline + KPI de jalon |

**Comportement**
- Onglet actif par défaut : `pilotage`
- Les 3 onglets sont **réordonnables par drag-and-drop**
- L'ordre est persisté dans `localStorage` (clé `carryit-tab-order`)
- L'ordre est restauré automatiquement au rechargement

---

## Onglet 1 — Pilotage & Vision

**Section label :** Vision · Long terme

**Layout desktop :** 2 cartes côte à côte

---

### 1.1 Carte KPI global

Voir `bloc_vision_kpi.md` pour la spec complète du graphique.

**Contenu**
- Label : `KPI global`
- Description extraite du champ M (mesurable) de l'objectif SMART
- Bouton `+ Ajouter une mesure` → ouvre le modal d'ajout
- Zone graphique (line chart, LightweightCharts)

**États**
- Aucune mesure : CTA inline "Aucune mesure enregistrée · Ajouter une mesure"
- Avec mesures : line chart interactif

---

### 1.2 Carte Objectif SMART

Carte de consultation affichant l'objectif SMART complet.

**Contenu**
- Titre : `Objectif SMART`
- Bouton `Modifier` (haut droite) → active le formulaire d'édition inline
- 5 sections verticales séparées par des lignes :
  - `S` — L'Ambition
  - `M` — La Mesure
  - `A` — Atteignable
  - `R` — Réaliste
  - `T` — L'Échéance

**Comportement**
- Mode consultation par défaut
- `Modifier` → bascule vers formulaire inline (5 textareas)
- `Sauvegarder` / `Annuler` dans le formulaire
- Validation : tous les champs requis

---

## Onglet 2 — To-do list

**Section label :** To-do list

Voir `bloc_2.md` — Zone 2 pour la spec complète.

**Vue d'ensemble**
- Onglets horizontaux : un onglet par jalon
- Jalon sélectionné → affiche critère de validation + tâches
- Vue Liste ou Kanban (toggle)

---

## Onglet 3 — Jalons

**Layout :** grille `280px (rail) + 1fr (carte détail)`

Voir `bloc_2.md` — Zone 3 pour la spec complète du KPI de jalon.

---

### 3.1 Rail (Timeline)

Colonne gauche, `position: sticky; top: 84px`.

**Contenu par jalon**
- Année + mois (monospace, colorés selon statut)
- Dot de statut + ligne de connexion verticale
- Label `MOIS X` (monospace, uppercase)
- Titre du jalon
- `Jalon X/Y`

**Statuts visuels**
- `done` — dot bleu foncé `#0A2A53` + checkmark SVG
- `active` — dot orange `#EE4408` + glow
- `upcoming` — dot transparent + bordure

**Interactions**
- Clic sur un jalon → met à jour la carte détail
- Jalon sélectionné : fond léger `rgba(255,253,246,0.04)` sur la ligne de texte
- `+ Ajouter un jalon` → lien en bas du rail

---

### 3.2 Carte Détail (jalon sélectionné)

**En-tête**
- `Jalon X/Y` + chip `MOIS N` (monospace) + chip de statut (Terminé / En cours / À venir)

**Corps**
- Titre du jalon (26px, bold)
- Échéance (`Échéance · [date]`)
- Séparateur horizontal
- Bloc **Critère de validation** — texte descriptif
- Bloc **KPI de jalon** — 2 KPI cards (Effort + Résultat) → voir `bloc_2.md` Zone 3
- Bloc **Avancement des tâches** — affiché seulement si le jalon a des tâches :
  - Compteur `X/Y tâches`
  - Barre de progression + `X% complétées`

**Footer actions**
- `Valider ce jalon` / `Réactiver` (si déjà validé)
- `Modifier` → lien vers édition jalons
- `Ajouter un KPI` (margin-left auto)

---

## État vide (aucun objectif)

Si aucun projet n'existe :
- Icône
- `Aucun objectif`
- `Commencez par définir votre premier objectif SMART.`
- CTA `+ Créer un objectif` → `objectif-intro.html`

---

## Persistance

- Toutes les données stockées en **localStorage**
- Clés principales : `carryItObjectifs`, `carryItMilestones`, `carryit-tab-order`
- Export/Import JSON via modal "Synchroniser"
- Aucune donnée ne quitte l'appareil

---

## Modèle de données (résumé)

### Objectif
```json
{
  "id": "...",
  "titre": "...",
  "specifique": "...",
  "mesurable": "...",
  "atteignable": "...",
  "realiste": "...",
  "temporel": "...",
  "measures": [],
  "jalons": [],
  "tasks": []
}
```

### Jalon
```json
{
  "id": "...",
  "titre": "...",
  "date": "YYYY-MM",
  "statut": "pending | in_progress | completed",
  "critere": "...",
  "mois": 1,
  "kpis": { "leading": {...}, "lagging": {...} }
}
```

### Tâche
```json
{
  "id": 123,
  "text": "...",
  "done": false,
  "status": "todo | doing | done",
  "jalonId": "...",
  "jalonTitle": "...",
  "jalonDate": "...",
  "subtasks": []
}
```
