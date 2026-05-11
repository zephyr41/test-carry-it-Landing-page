# Dashboard :

Carry it possède un dashboard qui permet de suivre l’ambition d’un individus. l’application relie la vision long termes. avec une execution à court terme. 

Le dashboard contient un objectif SMART, un Graphique avec le KPI du SMART? Un espace d’éxécution quotidienne.  avec les jalons de l’utilisateurs. Chaque jalon possède des taches qui lui son propre ou un kanban. et un indicateur de validation avec un kPI.

 jalons calés sur cet objectif, et une to-do list liée à ces jalons.

### Contenu du dashboard

dans cet odre précis  le dashboard précis: 
### 1. Bloc Vision (Long terme)

**Rôle**  
Présenter la vision long terme du projet et permettre à l’utilisateur de suivre l’avancement de son objectif SMART via son KPI principal.

**Contenu**  
- carte KPI global
- carte Objectif SMART

**État**  
- mode consultation par défaut
- modification possible du KPI global
- modification possible de l’objectif SMART via action dédiée

**Layout desktop**  
- le bloc Vision est composé de 2 cartes côte à côte
- largeur minimale de chaque carte : `380px`

---

### 1.1 Carte KPI global

- voir `bloc_vision_kpi.md`

---

### 1.2 Carte Objectif SMART

Carte de consultation affichant l’objectif SMART complet du projet.

#### Contenu
- titre du bloc : `Objectif SMART`
- action en haut à droite : `Modifier`
- 5 sections verticales :
  - `S` — L’ambition
  - `M` — La mesure
  - `A` — Atteignable
  - `R` — Réaliste
  - `T` — L’échéance

#### Règles d’affichage
- chaque section affiche :
  - un badge avec la lettre correspondante
  - un label de section
  - un contenu texte
- les sections sont séparées par des lignes horizontales
- le bouton `Modifier` ouvre l’édition complète de l’objectif SMART
- la carte est conçue pour la consultation synthétique, pas pour la saisie directe


### 2. Espace d’Exécution (Court terme)
L’Espace d’Exécution affiche les jalons sous forme d’onglets.  
Chaque onglet représente un jalon. Lorsqu’un jalon est sélectionné, la section affiche uniquement les actions liées à ce jalon.

Chaque jalon possède un espace d’actions associé. Ces actions peuvent être consultées selon deux modes :
- vue Liste ;
- vue Kanban.

Question utilisateur principale :
“Qu’est-ce que je dois faire maintenant pour faire avancer ce jalon ?”

Contenu :

- **Rôle :** Gérer le **”Comment”** quotidien. C’est l’usine à tâches sur le court termes (RollingWaves). je dois me concentrer sur quoi En ce moment.
- **État :** Dynamique / Opérationnel.

---

### 2.1 Vue Liste — To-do list

#### Structure d’une tâche

Chaque tâche s’affiche sur une ligne avec les éléments suivants (de gauche à droite) :

| Élément | Rôle |
|---|---|
| `⠿` grip | Poignée de drag & drop pour réordonner la tâche |
| Checkbox | Cocher/décocher la tâche |
| `▶` chevron | Afficher / masquer les sous-tâches — toujours visible au hover, même sans sous-tâches |
| Nom de la tâche | Texte éditable inline |
| Compteur sous-tâches | Ex. `2/5` — visible uniquement si sous-tâches existent |
| Supprimer | Icône de suppression |

#### Sous-tâches

- Une tâche peut contenir des sous-tâches.
- Le chevron `▶` s’affiche au hover sur **toutes** les tâches, qu’elles aient des sous-tâches ou non.
  - **Sans sous-tâches** : chevron très discret (opacity basse). Cliquer ouvre directement la zone d’ajout avec le champ focusé — la première frappe crée la première sous-tâche.
  - **Avec sous-tâches** : chevron normal, ouvre/ferme la liste existante.
- La hiérarchie visuelle repose sur l’**indentation** (margin-left + bordure gauche), pas sur la taille du texte.
- Un compteur `X/X` (sous-tâches complétées / total) s’affiche sur la tâche parente quand des sous-tâches existent.

#### Drag & drop — tâches

- Chaque tâche est déplaçable via sa poignée `⠿` (gauche).
- Pendant le drag, une **barre** fine (`1px rgba(238,68,8,0.55)`) apparaît entre les lignes pour indiquer la position d’insertion exacte (avant ou après selon la position du curseur sur la demi-hauteur de la row).
- Au drop, la tâche est insérée à la position indiquée (réordonnancement dans le tableau, persisté).
- La zone “Ajouter une tâche” ne capture pas les drops pendant un drag.

#### Drag & drop — sous-tâches

- Les sous-tâches sont déplaçables via poignée `⠿`.
- Pendant le drag sur une autre sous-tâche, une **barre blanche** fine (`1px rgba(255,253,246,0.3)`) indique la position d’insertion (avant/après).
- Une sous-tâche peut être réordonnée au sein de sa tâche parente.
- Une sous-tâche peut être déplacée vers une autre tâche parente — elle s’insère à la position exacte indiquée.
- Une sous-tâche du panneau latéral peut être droppée sur une tâche du dashboard (s’ajoute en bas de la sublist).
- Le hover de drag est par ligne (pas par bloc de statut entier).

---



### 2.2 KPI de jalon — Formulaire d'édition

Formulaire accessible depuis la carte KPI d'un jalon. Objectif : friction minimale.

#### Champs

| Champ | Obligatoire | Notes |
|---|---|---|
| Titre du KPI | Oui | Ex. "Km courus cette semaine" |
| Valeur actuelle | Oui | Nombre |
| Valeur cible | Non | Nombre optionnel |

#### Mode de mesure (pill toggle)

Deux modes sélectionnables via un toggle visuel pill :

- **Cumulatif** — chaque nouvelle mesure s'ajoute au total. Ex : `+5 km`
- **Valeur actuelle** — chaque nouvelle mesure remplace l'état courant. Ex : `72 kg`

Le mode est choisi par l'utilisateur, pas imposé. Il est stocké sur le KPI.

#### Bouton "Ajouter une mesure"

Bouton principal du bloc KPI de jalon. Ouvre la saisie d'une nouvelle valeur mesurée.  
Libellé : `+ Ajouter une mesure`

---

### 3. Pilotage de Jalon (Moyen terme)
Cette zone permet à l’utilisateur de piloter son projet sur du moyen terme.
plus précisement elle permet de prendre du recul sur le jalons en cours l'éxécution court terme. 
 ici voir son jalon, ça description. mesurer un / des KPI par rapport au jalons en cours(Leading / Laggin (voir KPI.md pour la définition d'un KPI). 

la difference entre la Long terme (voir dahsboard.md) et cette zone. c'est que cette zone il y vient souvent aussi. elle est la pour montrer les résultats et diriger le court terme. 


- **Contenu :** Timeline des jalons + KPI de jalon + Diagnostic de progression.
- **Rôle :** Ajuster le **"Où"**. C'est ici que l'utilisateur prend de la hauteur pour vérifier s'il est dans les temps ou s'il doit pivoter son exécution.
- **État :** Analytique / Tactique.
- Il voit un jalon carry it
- 

Exemple : 
LE KPI / Dashboard : 


**MOIS 1Jalon 1/5En cours**

**Avr 2026**

**cadrage produit finalisé**

**Description**

cahier des charges + ICP + USP finalisés et exploitables

**Validation**

**3 documentations techniques sont faites (Cahier des charges, ICP, USP)**

KPI : Nombre de document finit