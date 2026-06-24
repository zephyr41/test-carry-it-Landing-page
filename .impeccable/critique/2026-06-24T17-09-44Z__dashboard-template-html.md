---
target: dashboard/template.html
total_score: 16
p0_count: 1
p1_count: 4
timestamp: 2026-06-24T17-09-44Z
slug: dashboard-template-html
---
## Design Health Score (Run 2 — Hard)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | System Status | 2 | Aucun indicateur on-track/retard. Page sans titre contextuel. |
| 2 | Real World Match | 3 | Labels domaine OK. "22 juin" sans année ambigu. |
| 3 | User Control | 1 | No undo, no cancel, no breadcrumb, jalon non changeable. |
| 4 | Consistency | 2 | 3 stat cards = 3 structures différentes. 2 styles bouton sans règle. |
| 5 | Error Prevention | 1 | Aucune validation/confirmation/autosave. |
| 6 | Recognition | 2 | Chart sans légende. "44%" sans contexte. Nav active invisible. |
| 7 | Flexibility | 1 | Zéro keyboard shortcuts. Aucun filtre période. Vue unique. |
| 8 | Aesthetic | 2 | Palette propre. Mais 380px vides en bas. Grammaire card incohérente. Chart 45% vide. |
| 9 | Error Recovery | 1 | Aucun état erreur conçu. |
| 10 | Help/Docs | 1 | Settings icon inutile. Pas de tooltip chart. |
| Total | | 16/40 | Poor. |

## Anti-Patterns
Hero-metric ×3. Chart 12 mois toujours affiché (45% vide). Zéro couleur accent. Dead space 380px en bas.
Detector: flat-type-hierarchy — 12/14/16/18/20px coexistant (ratio 1.7:1).

## P0-P2 Issues
[P0] Viewport non utilisé — 380px vides. Dashboard non testé dans browser réel.
[P1] "Suis-je en avance/retard ?" sans réponse. C'est la promesse core de CarryIT.
[P1] 3 stat cards, 3 structures différentes. Grammaire visuelle absente.
[P1] Chart sans légende. 6 mois futur vide sans trajectoire cible.
[P1] Active nav state invisible (surface vs surface-2 = 3 pts luminosité).
[P2] Tâches card — 2 chiffres dans card pleine taille. Incomplet.
[P2] flat-type-hierarchy — 5 tailles entre 11-20px. Couper à 3.

## Personas
Alex: ouvre à 23h, ne sait pas s'il est on track, calcule lui-même, abandonne.
Nils-en-2024: chart monte mais pas de ligne trajectoire = il ne sait pas si la pente suffit.
