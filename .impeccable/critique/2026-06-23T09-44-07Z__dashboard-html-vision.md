---
target: dashboard.html Vision long terme
total_score: 21
p0_count: 0
p1_count: 2
timestamp: 2026-06-23T09-44-07Z
slug: dashboard-html-vision
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | No global progress toward objective — KPI empty state void |
| 2 | Match System / Real World | 3 | SMART/KPI/jalons legible for ICP; ATTEIGNABLE vs RÉALISTE distinction unclear |
| 3 | User Control and Freedom | 2 | SMART edit has cancel; no KPI undo/delete visible |
| 4 | Consistency and Standards | 2 | Active jalon card inline styles vs CSS class system |
| 5 | Error Prevention | 2 | SMART validation ok; KPI no guardrails visible |
| 6 | Recognition Rather Than Recall | 3 | SMART visible; orange badges clarify S/M/A/R/T |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts; no inline KPI update |
| 8 | Aesthetic and Minimalist Design | 3 | Clean dark theme; main noise is empty chart void |
| 9 | Error Recovery | 1 | No visible error recovery for KPI/SMART saves |
| 10 | Help and Documentation | 1 | No contextual help on KPI or SMART |
| **Total** | | **21/40** | Acceptable — significant gaps |

## Anti-Patterns Verdict
Inter flagged (2x overused-font). Layout transition width at line 3055. No gradient text, hero-metric, numbered eyebrow, or side-stripe detected. No P0 structural anti-patterns in Vision section.

## Priority Issues
- [P1] KPI empty state is a void — no value signal, no chart preview, weak CTA
- [P1] KPI card height inflates layout — SMART panel has dead space below T row
- [P2] "VISION · LONG TERME" eyebrow redundant — user already on Vision tab
- [P2] Active jalon card uses inline styles — outside CSS token system
- [P3] Citation orphaned — no visual anchor, no brand ceremony

## Persona Red Flags
- Alex (Power User): no keyboard shortcut to add KPI, no inline edit of description
- Sam (Accessibility): letter badge ~2.8:1 contrast (fails AA), jalon meta text #929292 on near-black
- Nils/ICP: Vision tab feels like setup screen when KPI empty, not a command center
