---
target: dashboard/template.html
total_score: 18
p0_count: 0
p1_count: 3
timestamp: 2026-06-24T16-38-03Z
slug: dashboard-template-html
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Progress bar 3px thin nearly invisible; no loading states; +Mesure gives zero feedback |
| 2 | Match System / Real World | 3 | French labels, familiar dashboard patterns |
| 3 | User Control and Freedom | 1 | No undo, no cancel on Éditer, no breadcrumb |
| 4 | Consistency and Standards | 2 | 8 font sizes 10-15px with no scale; weight values used inconsistently |
| 5 | Error Prevention | 1 | No validation, no confirmation dialogs |
| 6 | Recognition Rather Than Recall | 3 | Labeled nav, SMART letters labeled |
| 7 | Flexibility and Efficiency | 1 | No keyboard shortcuts, no batch, no alternative paths |
| 8 | Aesthetic and Minimalist Design | 3 | Clean palette but dead space in Tâches card and SMART panel |
| 9 | Error Recovery | 1 | No error states anywhere |
| 10 | Help and Documentation | 1 | No help, no tooltips |
| Total | | 18/40 | Acceptable — significant improvements needed |

## Anti-Patterns Verdict

LLM: Identical stat card template 3× (banned identical card grids). Uppercase tracked label on every header (eyebrow-on-every-section tell).
Detector: 0 findings (detect.mjs returned []). Pattern missed because CSS-based, not HTML-structural.

## Overall Impression

Structure correct, execution thin. Dark palette is brand-right. Typography has no modular scale — 8 px sizes 10-15px make everything same visual weight. KPI card has more dead air than data. --ink-3 (#4e566a) fails WCAG AA at ~2.3:1 on #1c1f2e.

## What's Working

1. Color palette (dark navy + near-white) — coherent and brand-correct
2. Layout structure (sidebar + topbar + 2-row content grid) — correct IA
3. SMART panel affordance — single-letter badges give constant objective visibility

## Priority Issues

[P1] Typography no scale — 8 sizes 10-15px undifferentiated. Fix: 5-step rem scale.
[P1] --ink-3 (#4e566a) contrast ~2.3:1 fails WCAG AA — on stat-sub, chart ticks. Fix: raise to #6e788a or use --ink-2 for text.
[P1] Font sizes in px — ignores user preferences, breaks zoom. Fix: convert all to rem.
[P2] Uppercase-tracked labels reflexive on every header. Fix: reserve for one role, lowercase sub-labels.
[P2] KPI card dead air — 3px progress bar invisible. Fix: 6px bar, prominent % readout.

## Persona Red Flags

Alex (Power User): No keyboard shortcuts. +Mesure leads nowhere (template). No quick-add. Abandons.
Sam (Accessibility): px fonts break zoom. --ink-3 fails contrast. SVG icons no aria-hidden/label. Progress bar no role=progressbar. Sidebar icon no aria-label.
Nils-en-2024 (project-specific): Opens at 23h after rough week. Bar is invisible 3px thread. Chart shows 6 months of empty future. Dashboard feels like a stub, not a proof of effort.

## Minor Observations

- No tabular-nums on numeric values
- sidebar-logo font-weight 800 excessive at 13px
- active nav state barely readable (surface vs surface-2 too similar)
- topbar 50px generous for content
- card-title 12px/600 vs stat-label 11px/500 uppercase — two competing label systems unresolved
