---
target: dashboard.html
total_score: 22
p0_count: 0
p1_count: 3
timestamp: 2026-06-10T18-04-02Z
slug: dashboard-html
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | No project-level progress %; jalon "En cours" badge but no completion rate |
| 2 | Match System / Real World | 2 | "Pilotage", "KPI global vs KPI de jalon" requires model-building; "To-do list" in English |
| 3 | User Control and Freedom | 2 | No undo on jalon completion; project delete in dropdown without prominent confirmation |
| 4 | Consistency and Standards | 2 | "Enregistrer" vs "Sauvegarder" across modals; French + English mixed |
| 5 | Error Prevention | 2 | KPI mode (Cumulatif/Instantané) chosen once, barely explained — silent data corruption risk |
| 6 | Recognition Rather Than Recall | 2 | 3-dot "more actions" hides actions; KPI distinction requires memory from SMART form |
| 7 | Flexibility and Efficiency | 2 | Kanban/list toggle good; no keyboard shortcuts; no batch actions |
| 8 | Aesthetic and Minimalist Design | 3 | Clean, dark, coherent — hurt by hardcoded citation and eyebrow labels on every section |
| 9 | Error Recovery | 2 | Modals have cancel; generic error messages |
| 10 | Help and Documentation | 1 | Zero tooltips, zero contextual help in the dashboard |
| **Total** | | **22/40** | **Acceptable — significant improvements needed** |

## Priority Issues

### [P1] Tab labels don't communicate what's inside
"Vision" tab unclear, "To-do list" in English. Fix: "Vue d'ensemble", "Tâches".

### [P1] Two KPI systems, no explanation
"KPI global" vs "KPI de jalon" vs "Critère de validation" — 3 unlabeled KPI concepts. Add one-line description under each.

### [P1] Vision tab: three competing blocks, no reading order
KPI chart + SMART grid + active jalon card all at equal prominence. Active jalon should be primary.

### [P2] Language mixing
"To-do list" → "Tâches", "Board" → "Tableau".

### [P2] Hardcoded citation
Static motivational quote takes space where user-data feedback should live. Remove or make dynamic.

## Minor Observations
- transition:width on line 3055 → layout thrash, use transform instead
- Modal "Valeur" label too generic — should show KPI unit
- aria-modal="false" on task side panel should be true when open
- "Ajouter un jalon" button has hardcoded 86px indent that will break at narrow widths
