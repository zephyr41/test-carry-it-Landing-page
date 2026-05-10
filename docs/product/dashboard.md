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


### 2. Espace d'Exécution (Court terme)
L’Espace d’Exécution affiche les jalons sous forme d’onglets.  
Chaque onglet représente un jalon. Lorsqu’un jalon est sélectionné, la section affiche uniquement les actions liées à ce jalon.

Chaque jalon possède un espace d’actions associé. Ces actions peuvent être consultées selon deux modes :
- vue Liste ;
- vue Kanban.

Question utilisateur principale :
“Qu’est-ce que je dois faire maintenant pour faire avancer ce jalon ?”

Contenu :


- **Rôle :** Gérer le **"Comment"** quotidien. C'est l'usine à tâches sur le court termes (RollingWaves). je dois me concentrer sur quoi En ce moment.
- **État :** Dynamique / Opérationnel.



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