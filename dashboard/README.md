# 📊 L'Ultime Guide de Conception de Dashboard : Principes UI/UX & Meilleures Pratiques

Ce document synthétise les meilleures pratiques de conception de tableaux de bord, issues de références mondiales (DataCamp, Yellowfin BI, Studio Pinto, Dashboard Design Patterns, Excited Agency et experts de l'industrie).

Un bon dashboard se situe entre une question et une décision. Il transforme des données brutes en listes, tendances et statuts clairs pour répondre immédiatement à la question : *"Que s'est-il passé et que faisons-nous maintenant ?"*

---

## 🏗️ 1. Structure et Hiérarchie (Le Modèle de la Pyramide Inversée)
L'information doit être structurée par degré d'urgence et de détail :
* **Haut (Top) :** *Status & Targets ("Est-ce qu'on est bons ?").* Les KPIs principaux, les alertes. Mouvement visuel naturel (en F ou en Z), donc le coin supérieur gauche est la zone la plus "chaude".
* **Milieu (Middle) :** *Tendances et comparaisons.* Les graphiques qui expliquent le mouvement des KPIs (ex: "Pourquoi avons-nous baissé de 10% ?").
* **Bas (Bottom) :** *Détails et Actions.* Tableaux granulaires, listes d'attente, liens pour creuser ou assigner des tâches.

## 📐 2. Layouts (Dispositions) Communs
* **Top-rail layout (Filtres & KPIs en haut) :** Idéal quand la question principale est "Sommes-nous sur la bonne voie ?". Bon pour les écrans larges.
* **Left-rail layout (Barre latérale) :** Idéal quand les utilisateurs changent fréquemment de vue ou utilisent beaucoup de filtres complexes.

## 🎯 3. Les 5 Types de Dashboards (À qui s'adresse-t-on ?)
Avant de concevoir, il faut définir le type exact :
1. **Opérationnel :** Suivi en temps réel (ex: support client, serveurs). Latence faible, statuts très visuels (rouge/vert), alertes immédiates.
2. **Tactique :** Pont entre stratégie et exécution (ex: suivi de campagne marketing). Usage quotidien/hebdomadaire. Met en évidence l'avancement vs les objectifs.
3. **Analytique :** Recherche de causes (ex: analyse des ventes). Hautement interactif (filtres, drill-downs). Pour les analystes.
4. **Stratégique :** Pilotage à long terme (ex: résumé mensuel pour cadres/C-levels). Comparaisons basiques (Aujourd'hui vs Plan/Année dernière), moins interactif.
5. **Explicatif :** Raconter une histoire à une audience large (ex: bilan annuel). Annotations claires, peu de contrôles.

## 📉 4. Ratio "Data-Ink" (Réduire le bruit)
* **Supprimer le superflu :** Retirer les lignes de grille inutiles, la 3D, les ombres excessives, les bordures lourdes.
* **Le bon graphique :** 
  * *Évolution dans le temps* = Courbes (Line) ou Sparklines.
  * *Classement* = Barres horizontales.
  * *Progression vs Objectif* = Bullet Chart ou Jauges.
  * *Composition* = Barres empilées (éviter les camemberts/pies avec trop de tranches).
* **Contexte :** Un chiffre seul ne veut rien dire. Ajouter toujours le contexte : la période (ex: YoY), l'unité (€, %, hrs), et l'heure de dernière mise à jour.

## 🎨 5. Consistance et Esthétique
* **Grille stricte :** Utiliser des marges (gutters) égales. Des cartes alignées inspirent confiance.
* **Couleurs sémantiques :** Restreindre la palette. Une couleur de marque, une couleur d'alerte (rouge), une couleur de succès (vert). Ne pas utiliser un arc-en-ciel.
* **Typographie :** Utiliser des tailles pour créer la hiérarchie plutôt que des couleurs flashy.

## ♿ 6. Accessibilité (UX inclusive)
* **Contraste :** Ratio minimum de 4.5:1 pour le texte.
* **Double signalisation :** Ne jamais se fier uniquement à la couleur (ex: rouge/vert) ; ajouter une icône (flèche) ou un label textuel.
* **Navigation clavier & Lecteurs d'écran :** Ordre logique de tabulation, balises ARIA, et focus visible.

---

> **Règle d'or : Approche Narrative**
> Le dashboard doit se lire comme une histoire courte : *1. Qu'est-ce qui a changé ? -> 2. Pourquoi ? -> 3. Que devons-nous faire maintenant ?* Si l'utilisateur ne peut pas répondre aux deux premières questions en 10 secondes, l'interface est trop complexe.
