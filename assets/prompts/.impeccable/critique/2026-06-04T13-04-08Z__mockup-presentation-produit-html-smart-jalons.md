---
target: "mockup-presentation-produit.html#smart-jalons"
total_score: 30
p0_count: 0
p1_count: 0
timestamp: 2026-06-04T13-04-08Z
slug: mockup-presentation-produit-html-smart-jalons
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | SMART output orange signal ✓; active dot orange ✓ |
| 2 | Match System / Real World | 3 | S/M/A/R/T questions clear. "Avant d'avancer" too generic |
| 4 | Consistency and Standards | 2 | Ladder order inverted. h2 SMART doesn't name what section does |
| 8 | Aesthetic and Minimalist Design | 3 | SMART clean. "Elle devient une cible." breaks reading rhythm |
| **Total** | | **30/40** | **Good** |

## Anti-Patterns

No slop. border-left: 2px on ladder connector — functional, not decorative, not flagged.

## Priority Issues

**[P2] Jalons timeline: counter-intuitive order**
Final (top) → 6 mois → Maintenant (bottom). Reader sees destination before current position. Confusion before understanding.
Fix: invert order (Maintenant top → 6 mois → Final bottom) or relabel clearly with directional cue.

**[P2] h2 "Avant d'avancer" doesn't say what SMART does**
Strong visually, semantically empty. "Before advancing" is a condition, not a benefit. Section shows ambition → structured target. h2 should say that.
Fix: Nils writes the h2. Direction: floue → précis, ambition → cible. Max 4 words.

**[P3] "Elle devient une cible." — unjustified display treatment**
Inter 700 italic at 2.35rem after smart-pivot at 650/lead. Two strong moments back-to-back kill each other. Remove the display treatment or absorb into smart-pivot.

**[P3] Label "Projet" in smart-input-preview**
Too generic. "Point de départ" or "Ambition brute" signals raw input before transformation.

## Minor Observations

- border-left: 2px on ladder-right-content: keep, functional
- "Final" card has inline background: var(--white) = #141416, slightly different from others
- smart-questions float without visual connector to input above
