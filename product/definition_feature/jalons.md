# Jalon Carry it

## 1. Définition conceptuelle

Un jalon est une étape de résultat significative vers l'objectif final, suffisamment concrète, tangible et précise pour pouvoir être validée explicitement. Il marque un changement de niveau dans la progression.

Les jalons sont générés automatiquement par l'application selon la durée et la structure de l'objectif.

Ils sont ensuite validés et précisés progressivement par l'utilisateur, avec l'aide de l'IA.

## 2. Règles métier

- Un jalon est binaire : il est soit accompli, soit non accompli.
- Un jalon peut contenir un ou plusieurs KPI.
- Un jalon peut contenir des tâches.
- Par défaut, un jalon suit un rythme de 3 mois.
- Un jalon contient un titre.
- Un jalon contient une date cible.
- Le jalon le plus proche doit être formulé précisément.
- Les jalons plus lointains peuvent rester plus larges.
- Le jalon actif doit être précis et validable.
- Lorsqu'un jalon futur devient actif, il doit être clarifié précisément avant d'être poursuivi.

## 3. Définition produit

Un jalon CarryIt est une étape de résultat rattachée à un objectif.

Il est défini par :

- un **rang (position dans une timeline 1/4)**
- Statut du jalon (En cours, Terminé, A venir)
- un **titre**
- un libellé qui indique la progression du parcours
- une **date cible**
- un **critère de validation** : ce qui doit être atteint et ce qui prouve que le jalon est atteint
- optionnellement un / plusieurs **KPI**
- description 

## Fonction

Un jalon sert à matérialiser les grands paliers de progression du projet.

Si l'on retire toutes les tâches, les jalons doivent encore permettre de lire la trajectoire globale du projet.

## Un jalon n'est pas

- une tâche
- un simple point dans le temps
- une intention vague
- une impression de progression
- un feedback
- une phase abstraite

## Exemples mauvais

- "mieux structurer CarryIt"

## Exemples bons

- "landing page publiée en production"
- "3 handstand push-ups validés avec forme correcte"
- "MVP testable avec onboarding terminé pour 10 utilisateurs"

## Suivi du jalon

- Le jalon en cours fait l'objet d'un point hebdomadaire.
- Le jalon en cours fait l'objet d'une revue mensuelle.

### Planification par vagues successives (Rolling Wave Planning)

- Le trimestre (90 jours) est l'unité de référence pour aligner les jalons avec le plan global.
- Un rapport mensuel permet de savoir où on en est.

### Fréquence de contrôle : le mensuel

- Concentrer l'utilisateur sur son jalon le plus proche.
- Mettre à jour et affiner en permanence.
- Faire comprendre à l'utilisateur qu'il n'est pas forcément en retard — il est normal que ça prenne du temps. Cependant cela permet de savoir s'il est efficace et s'il avance dans la bonne direction.

### Jalons comme points de décision Go/No-Go

- **Go** : on passe au jalon suivant
- **Réajustement nécessaire** : on modifie avant de continuer
- **Pivot nécessaire** : on revoit la trajectoire ou le plan

## Dashboard

### Ce que l'utilisateur voit

- Son jalon actif
- Les tâches contenues dans ce jalon
- Le titre du jalon
- La date cible du jalon
- Une mini roadmap (position dans la timeline — dans un bloc séparé ou en dessous)
- Navigation entre les différents jalons

### Actions utilisateur — Dashboard

- Un utilisateur peut **valider un jalon en retard**.
- Un utilisateur peut **réordonner les jalons**.
- Un **jalon validé peut encore être modifié**.

## Actions utilisateur — Onboarding

### 1. Champs éditables pendant l'onboarding

- **titre**
- **date cible**
- **critère de validation**
- **KPI optionnel** sur le jalon actuel

### 2. Actions possibles pendant l'onboarding

- **ajouter un jalon**
- **supprimer un jalon généré par l'app**
- **modifier le titre**
- **modifier la date cible**
- **modifier le critère de validation**
- **ajouter un jalon entre deux jalons existants**

### 3. Règles de précision pendant l'onboarding

- Le **jalon actif** doit être clarifié précisément.
- Les **jalons futurs** peuvent rester plus larges et moins définis tant qu'ils ne sont pas encore actifs.

### 4. Ordre des jalons pendant l'onboarding

- L'utilisateur **ne peut pas modifier l'ordre principal** des jalons générés par l'app.
- Il peut **ajouter un jalon intermédiaire** entre deux jalons existants.

### 5. Fin d'onboarding

- Le **premier jalon** doit être **clair, concret et validable sans ambiguïté**.
- L'utilisateur doit savoir clairement **ce qu'il doit atteindre**.
- L'utilisateur doit savoir clairement **quand son jalon le plus proche sera considéré comme atteint**.

# statut :
Un jalon à troit état possible : 
- A faire
- En Cours
- À Venir


Nombre de jalons : 