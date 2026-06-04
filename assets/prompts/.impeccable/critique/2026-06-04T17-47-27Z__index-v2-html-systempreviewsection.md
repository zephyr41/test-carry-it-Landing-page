---
target: "index-v2.html#systemPreviewSection"
total_score: 19
p0_count: 0
p1_count: 3
timestamp: 2026-06-04T17-47-27Z
slug: index-v2-html-systempreviewsection
---
# /impeccable critique index-v2.html#systemPreviewSection

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---:|---|
| 1 | Visibility of System Status | 2 | Dashboard tabs exist, but the section doesn't make the active proof immediately legible. |
| 2 | Match System / Real World | 3 | Faits + direction is right, but the mock data is still startup-specific. |
| 3 | User Control and Freedom | 2 | Tabs imply interaction, but the purpose of clicking is unclear in a landing proof block. |
| 4 | Consistency and Standards | 1 | Uses pain-section/pain-inner for product proof, causing layout mismatch. |
| 5 | Error Prevention | 2 | Copy avoids false prediction, but the UI can still imply a full product dashboard too early. |
| 6 | Recognition Rather Than Recall | 2 | SMART/jalons/KPI are recognizable, but scattered across tabs. |
| 7 | Flexibility and Efficiency | 2 | Proof is earlier, but user must parse tabs and tiny UI to understand it. |
| 8 | Aesthetic and Minimalist Design | 1 | Inline styles, cramped text column, dense dashboard, weak spacing. |
| 9 | Error Recovery | 2 | Low relevance, but reduced-motion/tab fallback is only partial. |
| 10 | Help and Documentation | 2 | The section says the idea, but does not guide what to inspect in the dashboard. |
| **Total** | **19/40** | **Right idea, poor execution** |

## Anti-Patterns Verdict

LLM assessment: The section still feels assembled rather than designed. The concept is now right: facts plus direction through the connection between long-term ambition and daily execution. The UI execution is weak because it reuses a pain/story layout for product proof, uses inline styles, and drops a dense tabbed dashboard without a clear focal point.

Deterministic scan: 2 warnings in index-v2.html: overused Inter font at lines 624 and 795. No new deterministic warnings for this section. Browser overlay unavailable in this environment.

## Overall Impression

This is finally answering the P1 strategically, but visually it is still a rough insertion. The proof arrives earlier, but it does not feel like a deliberate product reveal. It feels like a text block beside a mini app pasted into a section that was not built for it.

## What's Working

- The message Faits + direction is the right promise.
- Showing an actual dashboard fragment after the pain is the right answer to the first-time user issue.
- The three bullets simplify the mental model: vision long terme, étapes majeures, exécution quotidienne.

## Priority Issues

### [P1] Wrong layout container
Why it matters: pain-inner is narrow and story-focused. A product proof needs a wide, controlled two-column layout. The current composition makes the dashboard feel squeezed and accidental.
Fix: Create a dedicated product-proof section wrapper with max-width around 1120-1200px, two columns, aligned vertical centers, and responsive stacking.
Suggested command: /impeccable layout index-v2.html#systemPreviewSection

### [P1] No single visual focal point in the dashboard
Why it matters: The user sees tabs, numbers, timeline, cards, labels, but no obvious answer to how CarryIT helps. Product comprehension still requires effort.
Fix: Default to the tab/panel that best proves the promise, likely Vision or Jalons, and visually emphasize one relation: long-term vision -> current step -> daily execution.
Suggested command: /impeccable distill index-v2.html#systemPreviewSection

### [P1] Copy and UI do not map tightly enough
Why it matters: The bullets say vision / stages / execution, but the dashboard labels say Vision / Jalons / To-do list and the visible content may start on Jalons. The mapping ais close but not explicit enough.
Fix: Align bullet labels with dashboard labels or add small callouts next to the dashboard: Vision, Étapes, Exécution. Keep SMART/KPI lower in the page.
Suggested command: /impeccable clarify index-v2.html#systemPreviewSection

### [P2] Inline styling makes the section hard to polish
Why it matters: The section now has critical visual choices in inline style attributes, making spacing and typography drift likely.
Fix: Move systemPreviewSection styles into a scoped CSS block or stylesheet classes.
Suggested command: /impeccable polish index-v2.html#systemPreviewSection

## Persona Red Flags

First-time ambitious user: Understands the phrase Faits + direction, but still has to decode a dense tabbed dashboard to see the product proof.

Skeptical Notion/Excel user: Gets the argument that CarryIT links things, but the current layout still looks like another custom dashboard system rather than a ready-made structure.

Mobile user: The dashboard likely stacks after the copy, but the dense tab UI and tiny labels may become inspection-heavy.

## Minor Observations

- The duplicated comment SECTION 2 is misleading.
- Le système is a weak label; it does not add much above Faits + direction.
- The bullet list is good content but visually plain.
- The tabbed preview may be too interactive for a proof block; a static composed preview may sell faster.

## Questions to Consider

- What if this section had no tabs and just showed one composed CarryIT proof state?
- What is the one dashboard relationship the visitor must understand in 5 seconds?
- Can the bullets become visual anchors connected to the dashboard instead of plain text?
