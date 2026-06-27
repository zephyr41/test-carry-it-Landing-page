---
target: CarryIT Design System/ui_kits/web_app/index.html
total_score: 17
p0_count: 1
p1_count: 3
timestamp: 2026-06-25T19-02-45Z
slug: carryit-design-system-ui-kits-web-app-index-html
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Progress bars OK. No confirmation after task toggle. "17j sans mesure" low contrast. KPI projection line invisible. |
| 2 | Match System / Real World | 3 | Domain vocab cohérent. KPI delta ×−25 sans unité ni contexte. |
| 3 | User Control and Freedom | 2 | Cancel modals OK. Pas d'undo task. "Valider ce jalon" irréversible sans confirmation. |
| 4 | Consistency and Standards | 2 | Side-stripe border ×3 couleurs différentes. Teal EN COURS = 3ème couleur hors système. |
| 5 | Error Prevention | 1 | Aucune confirmation avant validation jalon. Task vide possible. |
| 6 | Recognition Rather Than Recall | 2 | Tabs OK. Vue Board non découvrable. Unités KPI non inline. |
| 7 | Flexibility and Efficiency | 1 | Zéro keyboard shortcut. Zéro bulk action. |
| 8 | Aesthetic and Minimalist Design | 3 | Propre. Critères A+R SMART card trop denses. |
| 9 | Error Recovery | 1 | Zéro error states. Zéro messages. localStorage crash silencieux. |
| 10 | Help and Documentation | 0 | Aucun tooltip. Aucun onboarding. Rien. |
| **Total** | | **17/40** | **Poor** |

## Anti-Patterns Verdict

No gradient text, no glassmorphism. Side-stripe borders ×3 (VisionView:529, Modals:250 = vrais positifs). layout-transition on width ×2 (JalonsView:231, JalonKPICard:322 = vrais positifs). 4 vrais positifs, 2 faux positifs.

## Priority Issues

[P0] No focus-visible keyboard indicators — aucun composant JSX
[P1] Valider ce jalon sans confirmation — irréversible
[P1] aria-labels=0 dans EspaceExecution + TodoView
[P1] EspaceExecution + TodoView zéro responsive CSS
[P2] KPI delta ×−25 unlabeled
[P2] transition: width sur progress bars
