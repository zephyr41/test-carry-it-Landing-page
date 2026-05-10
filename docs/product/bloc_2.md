Tu es UX/UI designer senior spécialisé en SaaS de productivité, dashboards structurés et interfaces d’exécution.

Je développe CarryIT, une web app responsive desktop-first de structuration et pilotage d’objectifs long terme.

CONTEXTE PRODUIT — CARRYIT

CarryIT permet à un utilisateur individuel de structurer et suivre une ambition long terme.

L’utilisateur crée :
- un objectif SMART ;
- des jalons ;
- des KPI ;
- des tâches liées aux jalons.

Principe central :
CarryIT relie le long terme au court terme :
- le long terme donne la direction ;
- le moyen terme permet le pilotage à moyen terme et de valider la direction ; 
- le court terme permet l’exécution concrète quotidienne.

CarryIT n’est pas :
- une simple to-do list ;
- une app de motivation ;
- un task manager générique ;
- une page blanche ;
- un outil qui décide à la place de l’utilisateur.

Rôle de l’utilisateur :
- décider ;
- valider ;
- exécuter ;
- ajuster.

Rôle de l’application :
- structurer ;
- rendre visible ;
- relier objectif, jalons, KPI et tâches ;
- permettre le suivi ;
- aider l’utilisateur à comprendre où il en est.

Je veux repenser deux zones précises du dashboard.

--------------------------------------------------
ZONE 2 — ESPACE D’EXÉCUTION
--------------------------------------------------

Nom :
Exécution

Temporalité :
Court terme

État :
Dynamique / opérationnel

Rôle :
L’Espace d’Exécution affiche les jalons sous forme d’onglets horizontaux.  
Chaque onglet représente un jalon. Lorsqu’un jalon est sélectionné, la section affiche uniquement les actions liées à ce jalon.

Logique UX / UI 

Cette zone est un espace d'execution court terem
Elle doit permettre à l’utilisateur de faire du rolling wave inconsciememnt.
Le court terme (le jalon en cours) doit être exécuté en prioirité. mais si il veut. il peut aussi ajouter des taches àd 'autre j'alons en secondarie.

Contenu attendu :

2 partie : 
la partie haute qui parle du jalon : 
- Titre du jalon (titre de l'onglet)
- Rang du jalon (1/5 par exemple)
- critère de validation du jalon

La partie To do LIST / KANBAN
- kanban ou liste ;
- tâches liées au jalon sélectionné ;
- actions concrètes ;
- tâches en cours ;
- tâches à faire ;
- tâches terminées ;
- ajout de tâche ;
- changement de statut ;
- organisation des tâches.

Question principale à laquelle cette zone doit répondre :
“Qu’est-ce que je dois faire maintenant pour avancer sur le jalon sélectionné ?”

Cette zone ne doit pas faire :
- analyse stratégique lourde ;
- diagnostic de progression détaillé ;
- timeline complète des jalons ;
- affichage dominant des KPI ;
- résumé long de l’objectif SMART.

Elle doit rester orientée action.

Problèmes UX actuels :
- ce n’est pas intuitif ;
- trop chargé visuellement ;
- hiérarchie peu claire ; (on a 2 fois le titre par exemple du jalon. on a aps assez la séparation de la partie jalon et to do list ce n'est pas séparé. trop chargé visuellement. )
- on ne comprend pas assez vite quoi faire maintenant ;
- risque de ressembler à une simple to-do list.
- on ne peut pas valider un jalon quand on recharge la page. il ne reste pas validé
- un jalon validé doit être enlever de la zone moyen terme. mais dans la zone court terme on a la possibilié de le reactivé pour le revoir

Objectif UX de cette zone :
Permettre à l’utilisateur de voir rapidement :
1. le jalon concerné ;
2. les tâches liées ;
3. la tâche ou le groupe de tâches prioritaire ;
4. l’état d’avancement opérationnel ;
5. l’action suivante possible.

--------------------------------------------------
ZONE 3 — PILOTAGE DE JALON
--------------------------------------------------

Nom :
Pilotage de Jalon

Cette zone permet à l’utilisateur de piloter son projet sur du moyen terme.
plus précisement elle permet de prendre du recul sur le jalons en cours l'éxécution court terme. 
 ici voir son jalon, ça description. mesurer un / des KPI par rapport au jalons en cours(Leading / Laggin (voir KPI.md pour la définition d'un KPI). 

la difference entre la Long terme (voir dahsboard.md) et cette zone. c'est que cette zone il y vient souvent aussi. elle est la pour montrer les résultats et diriger le court terme. 

Rôle :
Ajuster le “où j'en suis dans mon jalon ? comment je sais qu'il est validé ; et quels sont les résultats de mes actions court terme sur mon jalon  qui ducoup sont visible ici via les KPI. 

Contenu attendu :

cette secction est divisé en 2 bloc : la timeline : 
- timeline des jalons (avec la progression visible ) ;
- Nom du jalon
- Date du jalon (en mm-yyyy : ex Sep 2026)
-  le nom de l'étape de validation du jalon


La partie carte de chaque jalon (quand on clique sur chaque jalons. en dessous + d'information s'affiche sur le jalon)

voir 3. définitiion produit  jalons.md pour voir le contenue de la carte

Question principale à laquelle cette zone doit répondre :
“Est-ce que ce jalon avance correctement, Que donne le résultat de mes efforts ?  dois-je ajuster mon exécution ?”

Cette zone ne doit pas faire :
- afficher un kanban complet ;
- devenir une liste de tâches ;
- gérer l’exécution quotidienne ;
- multiplier les actions opérationnelles ;
- surcharger l’utilisateur avec trop de données.

Elle doit rester orientée pilotage.

Problèmes UX actuels :
- ce n’est pas intuitif ;
- Il n'y a aucun KPI. on ne peut définir aucun KPI
- Moche.
- hiérarchie peu claire ; entre la timeline et la cate qui présente le jalon
- l’utilisateur  ne  comprend pas ce qu’il doit analyser en priorité.

Objectif UX de cette zone :
Permettre à l’utilisateur de comprendre rapidement :
1. Ou en est t'il dans la timeline: 
Le principe et de se rappeler : 
La desc du jalons, son critère de validation . et ses KPI par rapport au critère du validation.

--------------------------------------------------
MISSION
--------------------------------------------------

Je veux que tu proposes une refonte UX/UI complète de ces deux zones.

Contraintes importantes :
- ne pas fusionner les deux zones ;
- garder une séparation claire entre exécution et pilotage ;
- réduire la charge visuelle ;
- clarifier la hiérarchie d’information ;
- éviter les blocs de même poids visuel ;
- éviter les widgets décoratifs ;
- éviter les formulations motivationnelles ;
- conserver une interface SaaS sobre, lisible, structurée ;
- desktop-first ;
- responsive ensuite ;
- peu de couleurs ;
- couleurs uniquement pour statut, risque, progression ou priorité ;
- microcopy neutre et opérationnelle.

--------------------------------------------------
SORTIE ATTENDUE
--------------------------------------------------

Pour chaque zone, fournis :

1. Diagnostic UX
Explique pourquoi la zone peut manquer d’intuitivité aujourd’hui.

2. Objectif UX précis
Formule l’objectif principal de la zone en une phrase.

3. Hiérarchie d’information
Classe les éléments en :
- P0 : visible immédiatement ;
- P1 : visible dans la carte ;
- P2 : secondaire ou accessible après interaction.

4. Structure UI recommandée
Décris :
- le layout ;
- les blocs ;
- les composants ;
- l’ordre de lecture ;
- le poids visuel ;
- les CTA principaux ;
- les CTA secondaires.

5. Fonctionnalités attendues
Liste les fonctionnalités nécessaires.

Pour l’Espace d’Exécution, couvre au minimum :
- vue liste ;
- vue kanban si pertinent ;
- tâches du jalon sélectionné ;
- tâche prioritaire ou focus actuel ;
- ajout de tâche ;
- changement de statut ;
- filtre par statut ;
- état vide ;
- état sans tâche ;
- état toutes les tâches terminées.

Pour le Pilotage de Jalon, couvre au minimum :
- timeline des jalons ;
- jalon sélectionné ;
- KPI du jalon ;
- valeur actuelle ;
- valeur cible ;
- progression ;
- échéance ;
- statut ;
- diagnostic ;
- action “mettre à jour le KPI” ;
- action “ajuster le jalon” ;
- état KPI non renseigné ;
- état jalon en retard ;
- état jalon terminé.

6. Wireframe textuel
Fais un wireframe séparé pour :
- Zone 2 — Espace d’Exécution ;
- Zone 3 — Pilotage de Jalon.

Ne fais pas un wireframe commun.

7. Microcopy
Propose les libellés :
- titres ;
- sous-titres ;
- boutons ;
- statuts ;
- badges ;
- messages vides ;
- messages de diagnostic ;
- labels KPI ;
- labels de tâches.

La microcopy doit être neutre, claire et opérationnelle.

8. États UX à prévoir
Décris les états pour chaque zone.

Pour l’Espace d’Exécution :
- aucune tâche ;
- tâche en cours ;
- toutes les tâches terminées ;
- jalon sélectionné sans tâche ;
- aucun jalon sélectionné ;
- chargement ;
- erreur.

Pour le Pilotage de Jalon :
- aucun jalon sélectionné ;
- jalon actif ;
- jalon en avance ;
- jalon en retard ;
- KPI non renseigné ;
- KPI à jour ;
- jalon terminé ;
- donnée manquante.

9. Recommandations UI concrètes
Donne des recommandations sur :
- espacement ;
- typographie ;
- densité ;
- badges ;
- progress bars ;
- couleurs ;
- icônes ;
- séparateurs ;
- cartes ;
- boutons ;
- éléments à supprimer.

10. Erreurs à éviter
Liste ce qu’il ne faut pas faire pour :
- ne pas transformer l’Espace d’Exécution en simple to-do list ;
- ne pas transformer le Pilotage de Jalon en dashboard analytique trop lourd ;
- ne pas mélanger court terme et moyen terme.

11. Proposition finale recommandée
Donne une version finale claire et exploitable des deux zones, en expliquant pourquoi elle correspond au positionnement CarryIT.

Format de réponse :
- structuré ;
- concret ;
- orienté produit ;
- directement exploitable pour concevoir l’écran ;
- sans généralités vagues.