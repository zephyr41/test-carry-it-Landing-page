---
target: CarryIT Design System/ui_kits/web_app/VisionView.jsx — vision-calendar-card
total_score: 20
p0_count: 0
p1_count: 2
timestamp: 2026-06-25T18-14-19Z
slug: rryit-design-system-ui-kits-web-app-visionview-jsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Dots + band OK ; zéro feedback sur ajout de mesure |
| 2 | Match System / Real World | 2 | "S-0 / S-1 / S-2 / S-3" illisible ; vert = bon mais signal = mauvais |
| 3 | User Control and Freedom | 2 | Vue read-only, aucun accès rapide à "ajouter mesure" depuis la carte |
| 4 | Consistency and Standards | 3 | Vocabulaire RÉSULTAT/EFFORT cohérent ; popover diverge |
| 5 | Error Prevention | 2 | Bug band count corrigé ; pas de validation visible |
| 6 | Recognition Rather Than Recall | 2 | Pas de légende : dot orange vs dot blanc = mémorisé, pas découvert |
| 7 | Flexibility and Efficiency | 1 | Aucun shortcut. Hover-only = inutilisable sans souris |
| 8 | Aesthetic and Minimalist Design | 3 | Dense mais cohérent ; structure CSS redondante présente |
| 9 | Error Recovery | 1 | Aucun état d'erreur visible. KPI manquant → silencieusement 0 |
| 10 | Help and Documentation | 1 | Aucune aide contextuelle sur les dots |
| **Total** | | **20/40** | **Acceptable** |

## Anti-Patterns Verdict
Pas de slop aesthetic. 2 findings détectés (borderLeft:3px) aux lignes 529 et 813 — faux positifs, affordance calendrier reconnue dans le contexte popover.

## Priority Issues
P1: Band vert sémantique inversée (vert = OK mais "17j sans mesure" = alerte)
P1: Pas de légende calendrier (dot orange vs blanc non expliqué)
P2: Séparateur RÉSULTAT/EFFORT trop subtle (0.06 opacité)
P2: Labels semaine S-0/S-1/S-2/S-3 cryptiques
P3: Structure CSS redondante effort section

## Persona Red Flags
Alex: pas de shortcut mesure, hover-only
Sam: dots sans aria-label, touch target 8px
Nils ICP: bande verte le rassure à tort sur 17j sans mesure
