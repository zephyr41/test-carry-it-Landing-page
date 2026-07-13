---
target: dashboard-final vue moyen terme
total_score: 18
p0_count: 0
p1_count: 2
timestamp: 2026-07-11T12-38-45Z
slug: dashboard-final-vue-moyen-terme
---
# Critique — Vue Moyen terme (dashboard-final)
Method: dual-agent (A: design review navigateur · B: détecteur déterministe)

## Design Health Score — 18/40 · needs work

| # | Heuristique | Note | Issue |
|---|---|---|---|
| 1 | Visibilité statut | 2 | Fraîcheur tronquée ; pas d'état saving/loading ; Mois 2 fabriqué |
| 2 | Match réel | 2 | Mois N trompeur ; scheduler horloge sur KPI d'intervalle |
| 3 | Contrôle & liberté | 2 | Modal effort sans × ; pas d'undo Supprimer |
| 4 | Cohérence | 2 | surface-raised détournée ; 2 inverse adjacents en vide |
| 5 | Prévention erreur | 1 | Valider actif sur jalon à venir sans critère ; Supprimer collé |
| 6 | Reconnaissance | 2 | Rail ne surligne pas le jalon affiché |
| 7 | Flexibilité | 2 | Widget horloge inadapté au geste fréquent |
| 8 | Esthétique | 2 | 34% viewport vide ; tuiles creuses ; 6 eyebrows |
| 9 | Récupération | 1 | Aucun état error ; copy vide générique |
| 10 | Aide/doc | 2 | État vide rate l'occasion pédagogique (copy §891 ignorée) |

## AI slop — moyen-fort
Détecteur B: vert 4/4 mais markup-only → n'a pas pu voir nesting CSS/contraste/vide/tracking. Règle nested-cards n'a pas tilté alors que les cartes SONT imbriquées (via CSS surface-raised). A a rattrapé.
Tells A: (1) cartes KPI définies imbriquées dans carte détail, fond surface-raised = viole §4.1 un-seul-niveau ; (2) MOIS N fabriqué (dashboard-views.js:129) ; (3) copy vide dupliquée.

## Forces
1. Honnêteté data non-flatteuse (10 restants, +46 au-delà) = Principe 1.
2. Rail = trajectoire entière lisible.
3. Modals disciplinés.

## Priority issues
[P1] Cartes imbriquées + surface-raised détournée (dashboard-final.css:138) → un seul niveau de carte.
[P1] Valider ce jalon sans accent ni garde-fou (dashboard-views.js:158) → CTA orange + confirm §941.
[P2] État vide: copy §891 par type ignorée + dupliquée + 2 inverse adjacents.
[P2] Vide layout 34% + tuiles creuses (divider 48px vue jalon vs 8 summary).
[P3] Mois N fabriqué + fraîcheur tronquée.

## Persona red flags
ICP high-achiever: écran tiers-noir + voids identiques + récompense (valider) plate → sous-sert la cible.
Onboarding: état vide n'explique pas Effort vs Résultat ; scheduler horloge inadapté.
Laptop non-retina/dehors: text-muted 0.54 pour vraie donnée + fraîcheur tronquée.

## Minor
Jalon terminé barré (lit annulé) · rail sans highlight du jalon détaillé · modal effort sans × · Supprimer collé à Enregistrer.

## Questions
Delta neutre ne sait pas interpréter +46 sur un KPI d'intervalle. Valider pèse moins qu'un Enregistrer. Mois 2 jamais vrai. Zéro-scroll au prix d'un tiers de viewport noir.
