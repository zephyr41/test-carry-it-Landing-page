# Spec — KPI Global (CarryIT)

Graphique de suivi du KPI principal d'un objectif SMART. Affiché dans l'onglet **Pilotage & Vision**.

---

## 1. Objectif

Permettre à l'utilisateur de suivre l'évolution du KPI principal associé à son objectif SMART.

---

## 2. Modèle de données

### 2.1 Structure d'une mesure

```json
{ "id": "...", "date": "JJ/MM/AAAA", "value": 42 }
```

### 2.2 Règles

- Plusieurs mesures possibles à la même date
- Tri automatique par date croissante
- Aucune valeur négative autorisée
- **Même date** : les mesures sont **moyennées** pour le graphique (une seule valeur par date)
- Valeurs entières uniquement en V1

### 2.3 Source de vérité

- Stockage dans **localStorage** (clé sur l'objet `allObjectifs[i].measures`)
- Mise à jour immédiate de l'interface après chaque action
- Données conservées après refresh

---

## 3. Graphique

### 3.1 Librairie

**LightweightCharts** (standalone) — `LightweightCharts.createChart()`

### 3.2 Type

Line chart (`LightweightCharts.LineSeries`) avec markers visibles.

### 3.3 Couleur de la courbe

`#EE4408` (orange CarryIT)

### 3.4 Dimensions

- Largeur : `container.offsetWidth` (responsive)
- Hauteur minimale : **380px** sur desktop (`container.offsetHeight - 28`)
- `handleScroll: false`, `handleScale: false`

---

## 4. Axe Y

- Linéaire, **toujours ≥ 0** (`minValue: 0`)
- Maximum dynamique : `Math.ceil(maxVal * 1.15)` (fallback : `10` si aucune valeur)
- Affiché à **gauche** (`leftPriceScale: visible: true`)
- Axe droit masqué
- Format : entiers uniquement (`Math.round(price)`)
- Marges : `top: 0.12, bottom: 0.08`

---

## 5. Axe X

- Axe temps continu (dates ISO `YYYY-MM-DD`)
- Espacement proportionnel au temps réel
- Format des labels : `JJ/MM` (ex : `14/03`)
- Labels auto-adaptatifs à la largeur disponible (LightweightCharts gère la densité)
- `rightOffset: 5` pour ne pas coller au bord droit
- `fitContent()` appelé après injection des données

### 5.1 Même date — comportement

Quand plusieurs mesures existent à la même date :
- Valeurs **moyennées** → un seul point affiché sur le graphique
- Clic sur le point → ouvre le modal d'édition pour la **première** mesure de cette date

---

## 6. Interactions

### 6.1 Crosshair

- Ligne verticale et horizontale : `rgba(255,255,255,0.12)`, width 1px
- Crosshair marker : rayon 5, couleur `#EE4408` (fond + bordure)

### 6.2 Clic sur point

- Déclenché via `chart.subscribeClick(param => {...})`
- Condition : `param.seriesData.get(lineSeries)` doit exister
- Ouvre le **modal d'édition** de la première mesure de cette date

### 6.3 Clic hors point

- Rien ne se passe

### 6.4 Hover

- Tooltip natif LightweightCharts (crosshair)
- Affiche : date + valeur

---

## 7. Ajout d'une mesure

### 7.1 Déclencheur

Bouton `+ Ajouter une mesure` dans l'en-tête de la carte KPI global.

### 7.2 Modal

**Champs**
- Date (obligatoire, `type="date"`)
- Valeur (obligatoire, `type="number"`, `min="0"`)

**Actions**
- `Enregistrer`
- `Annuler`

**Validation**
- Bouton actif en permanence
- Erreurs affichées en temps réel + au submit
- Messages :
  - `Valeur requise`
  - `La valeur doit être positive`

---

## 8. Édition d'une mesure

### 8.1 Déclencheur

Clic sur un point du graphique → ouvre le modal d'édition.

### 8.2 Modal

**Champs**
- Date (pré-remplie)
- Valeur (pré-remplie)

**Actions**
- `Sauvegarder`
- `Supprimer`
- Fermer via `×`

### 8.3 Fermeture du modal

- Bouton `×` : ferme
- Clic overlay : ne ferme pas
- Touche `Esc` : ferme

### 8.4 Modifications non sauvegardées

Fermeture → changements sauvegardés automatiquement.

---

## 9. Suppression

- Suppression immédiate
- Toast temporaire (5–10s) : `Valeur supprimée — cliquer pour annuler`
- Dernière mesure supprimée → retour vers état vide

---

## 10. États d'interface

### 10.1 Empty state

Affiché dans la zone graphique.

```
[icône +]  Aucune mesure enregistrée · Ajouter une mesure
```
CTA inline cliquable (ouvre le modal d'ajout).

### 10.2 Cas particulier — toutes valeurs à 0

- Message : `Aucune progression enregistrée`

### 10.3 États supportés

- 0 point (empty state)
- 1 point
- Plusieurs points
- Ajout en cours
- Édition en cours
- Suppression (avec undo)

---

## 11. Style visuel

- Background chart : `transparent`
- Couleur texte axes : `rgba(255,255,255,0.35)`
- Grille : `rgba(255,255,255,0.04)` (horizontale + verticale)
- Bordure axes : `rgba(255,255,255,0.06)`
- Watermark : masqué
- Attribution logo : masqué

---

## 12. Contraintes techniques

- Pas de float brut affiché sur l'axe Y
- Axe Y toujours ≥ 0
- Données triées chronologiquement avant injection
- Même date → valeurs moyennées (pas d'affichage de points multiples par date)
- Performance stable avec plusieurs dizaines à centaines de points
- Pas de scroll ni de zoom (désactivés)

---

## 13. Décisions produit

- Pas de ligne de cible SMART dans le graphique
- Graphique orienté lisibilité, pas analyse
- Interaction principale : édition via les points
- Axe X : proportionnel au temps réel
- Axe Y : borné à 0, max dynamique + 15%
- Librairie : LightweightCharts (non SVG custom)

---

## 14. Points ouverts (V2)

- Formatage des valeurs décimales, monétaires, pourcentages
- Stratégie d'affichage quand densité de points forte
- Variantes de rendu (step, scatter)
- Mode logarithmique
- Affichage de plusieurs mesures distinctes par date (sans averaging)
