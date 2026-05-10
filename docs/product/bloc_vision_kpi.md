# Spécification — KPI Graph (CarryIt)

## 1. Objectif

Permettre à l’utilisateur de suivre l’évolution d’un KPI associé à un objectif SMART.

---

## 2. Modèle de données

### 2.1 Structure d’un KPI

* `labelKPI` : libellé du KPI
* `unitLabel` : unité métier affichée (ex : clients, €, %, kg)
* `valueType` : type de valeur (`integer`, `decimal`, `currency`, `percent`)

### 2.2 Structure d’une mesure

* `id`
* `date` : obligatoire
* `value` : obligatoire

### 2.3 Règles

* plusieurs mesures possibles à la même date
* tri automatique par date croissante
* aucune valeur négative autorisée

### 2.4 Format de valeur — V1

* V1 : valeurs entières uniquement
* aucune valeur décimale saisissable en V1

---

## 3. Type de graphique

### 3.1 Type principal

* line chart
* points visibles (markers)

### 3.2 Variantes futures

* step chart pour KPI cumulatifs
* scatter chart pour données irrégulières

---

## 4. Axe Y

### 4.1 Type

* axe linéaire

### 4.2 Règles de calcul

* `minY = 0`
* maximum de **7 labels** affichés sur l’axe Y
* `maxYBrut = valeur maximale visible + 20 %`
* `stepY` calculé automatiquement selon les données visibles
* `stepY` doit rester lisible (ex : 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000)
* `maxYFinal` = arrondi au multiple supérieur de `stepY`

### 4.3 Règles d’affichage

* aucune valeur négative affichée
* aucun float brut affiché
* labels Y formatés selon le type de valeur et l’unité

### 4.4 Cas particuliers

* si toutes les valeurs sont à `0` : conserver un axe Y `0 → 5`
* si aucune mesure n’existe : ne pas afficher de courbe, afficher l’état vide

---

## 5. Axe X

### 5.1 Type

* axe temps continu

### 5.2 Structure de date

* une mesure stocke **la date uniquement** (`JJ/MM/AAAA`)
* pas d’heure en V1

### 5.3 Positionnement

* espacement **proportionnel au temps réel écoulé**
* tri chronologique automatique

### 5.4 Labels X

* format d’affichage : `JJ/MM`
* les labels s’adaptent à la largeur disponible
* si la densité est trop forte, certains labels sont masqués automatiquement
* objectif : éviter tout chevauchement

### 5.5 Timezone

* les dates affichées utilisent la timezone locale de l’utilisateur

---

## 6. Points / markers

### 6.1 Règles générales

* chaque mesure correspond à un point visible
* chaque point est cliquable

### 6.2 Même date

* plusieurs mesures peuvent exister à la même date
* décalage visuel **horizontal** pour éviter la superposition
* hypothèse V1 : **2 à 3 mesures max** sur une même date

### 6.3 Hover / clic

* hover/clic sur le point exact uniquement
* pas de sélection automatique du point le plus proche

---

## 7. Interactions

### 7.1 Hover

* le tooltip apparaît immédiatement au survol

### 7.2 Tooltip

Contenu :

* date
* valeur formatée

Règles :

* aucune action dans le tooltip
* le tooltip est informatif uniquement

### 7.3 Clic hors point

* si l’utilisateur clique sur la ligne mais pas sur un point, rien ne se passe

### 7.4 Clic sur point

* ouvre le modal d’édition

---

## 8. Ajout d’une mesure

### 8.1 Modal

Champs :

* date (obligatoire)
* valeur (obligatoire)

### 8.2 Actions

* Enregistrer
* Annuler

---

## 9. Édition d’une mesure

### 9.1 Modal

Champs :

* date
* valeur

### 9.2 Actions

* Sauvegarder
* Supprimer
* Fermer via croix

### 9.3 Fermeture du modal

* clic sur croix : oui
* clic sur overlay : non
* touche `Esc` : oui

### 9.4 Modifications non sauvegardées

* si l’utilisateur ferme après modification, les changements sont sauvegardés automatiquement

---

## 10. Validation formulaire

### 10.1 Bouton sauvegarde

* bouton actif en permanence
* validation au moment de la saisie et au submit

### 10.2 Affichage des erreurs

* erreurs affichées en temps réel pendant la saisie
* revalidation au submit

### 10.3 Champ valeur

* saisie clavier uniquement

### 10.4 Règles de validation

#### Date

* obligatoire
* format valide

#### Valeur

* obligatoire
* numérique
* ≥ 0
* entière uniquement en V1

### 10.5 Messages d’erreur

* `Valeur requise`
* `La valeur doit être positive`

### 10.6 Valeur vide

* erreur immédiate

---

## 11. Suppression

### 11.1 Comportement

* suppression immédiate
* affichage d’un message temporaire de confirmation avec possibilité d’annulation

### 11.2 Undo

* message temporaire du type : `Valeur supprimée — cliquer pour annuler`
* durée d’affichage : **5 à 10 secondes**

### 11.3 Dernière mesure supprimée

* retour vers l’état vide

---

## 12. États d’interface

### 12.1 Empty state

* texte : `Entrez une mesure`
* CTA : `Ajouter une mesure`

### 12.2 Cas particulier

* si toutes les valeurs existantes sont à `0` : afficher `Aucune progression enregistrée`

### 12.3 États supportés

* 1 point
* plusieurs points
* ajout
* édition
* suppression

---

## 13. Persistance locale

### 13.1 Source de vérité

* stockage dans le **local storage**

### 13.2 Après action

* mise à jour immédiate de l’interface
* persistance immédiate en local
* pas de loader en V1

### 13.3 Rechargement de page

* les données sont conservées après refresh

---

## 14. Volumétrie / responsive

### 14.1 Nombre de points attendu en V1

* cible principale : entre **< 20** et **20–100** points par KPI

### 14.2 Mobile

* même graph en version simplifiée

### 14.3 Markers si densité élevée

* à préciser

### 14.4 Taille minimale du graph

* hauteur minimale : **380 px** sur dekstop

---

## 15. Contraintes techniques

* pas de float brut affiché
* axe Y toujours ≥ 0
* données triées chronologiquement
* performance stable avec plusieurs dizaines à centaines de points

---

## 16. Décisions produit

* pas de ligne de cible SMART dans le graph
* graph orienté lisibilité
* interaction principale : édition via les points
* comportement X proportionnel au temps réel
* comportement Y borné à 0 avec max dynamique

---

## 17. Points encore ouverts

* formatage V2 des valeurs décimales, monétaires et pourcentages
* stratégie d’affichage des markers quand la densité devient forte
* variantes de rendu futures (`step`, `scatter`)
* mode logarithmique V2
