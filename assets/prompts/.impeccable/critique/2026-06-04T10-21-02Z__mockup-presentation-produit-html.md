---
target: mockup-presentation-produit.html
total_score: 25
p0_count: 0
p1_count: 2
timestamp: 2026-06-04T10-21-02Z
slug: mockup-presentation-produit-html
---
# /impeccable critique mockup-presentation-produit.html

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Product sequence is clear, but auto-cycling dashboard tabs lack visible pause/state control. |
| 2 | Match System / Real World | 3 | SMART, jalons, KPI and tasks map well to the product. One KPI claim blurs philosophy and feature. |
| 3 | User Control and Freedom | 2 | Demo tabs auto-cycle after user click; no pause, no reduced-motion handling visible. |
| 4 | Consistency and Standards | 2 | Brand name varies between Carry It, CarryIT and Carry it; inline styles create drift. |
| 5 | Error Prevention | 2 | "CarryIT montre l'ecart entre le temps investi et les resultats attendus" can overpromise. |
| 6 | Recognition Rather Than Recall | 4 | The 5-step product story is easy to understand and concrete. |
| 7 | Flexibility and Efficiency | 2 | This is a linear presentation block with no fast path or CTA logic. |
| 8 | Aesthetic and Minimalist Design | 2 | Repeated cards, side-tab accents, glows and dense labels make the section feel prototype-like. |
| 9 | Error Recovery | 2 | Low error surface, but interactive tabs do not expose state semantics or controls. |
| 10 | Help and Documentation | 3 | Product boundaries are mostly visible, but copy needs sharper precision. |
| **Total** | | **25/40** | **Clear but prototype-heavy** |

## Anti-Patterns Verdict

LLM assessment: The product explanation is useful and concrete, not empty. The weak point is craft: the section still feels like a standalone mockup/prototype rather than a polished LP section. The repeated dark cards, orange side borders, uppercase labels, mini-dashboard chrome and glow patterns are recognizable AI/UI-template tells.

Deterministic scan: 4 warnings in `mockup-presentation-produit.html`: two side-tab accent borders at lines 296 and 332, em-dash overuse, and dark mode with colored glow at line 323. These are valid findings, not false positives.

Browser evidence: no reliable browser overlay was produced because this Codex session does not expose a browser automation/injection tool.

## Overall Impression

This is the clearest product explanation in the project: SMART, jalons, KPI, tasks, dashboard. But it reads as a feature walkthrough pasted into a landing page. It needs more narrative pressure, fewer UI tropes, and tighter copy to match the brand: direct, lucid, demanding.

## What's Working

1. The sequence is strong: ambition -> SMART -> jalons -> KPI -> tasks -> dashboard.
2. The mockups make the product tangible without needing a full app screenshot.
3. The KPI section correctly separates effort and result, which is central to CarryIT's value.

## Priority Issues

### [P1] The section looks like a prototype, not a brand surface

Why it matters: The LP must persuade, not just document the product. Current cards and UI chrome explain the app but do not create a memorable brand moment.

Fix: Keep the 5-step structure, but redesign the composition as a branded narrative section. Use fewer boxes, larger proof moments, stronger rhythm, and one decisive dashboard reveal.

Suggested command: `/impeccable layout mockup-presentation-produit.html`

### [P1] The KPI copy can overpromise a product feature

Why it matters: PRODUCT.md says time distortion belongs to philosophy, not feature. The line about showing the gap between invested time and expected results can imply the app computes something it does not.

Fix: Rewrite around user-defined KPI and observable proof: "CarryIT te fait suivre l'effort que tu engages et le resultat que tu as defini comme preuve."

Suggested command: `/impeccable clarify mockup-presentation-produit.html`

### [P2] AI-pattern visual tells weaken credibility

Why it matters: Side-tab orange borders, orange glow and dark cards are common AI UI markers. CarryIT's audience wants lucidity, not decoration.

Fix: Remove side-tab accents, reduce glow, reserve orange for selected states, thresholds and CTA/proof. Replace emphasis boxes with typography, spacing, or hard separators.

Suggested command: `/impeccable quieter mockup-presentation-produit.html`

### [P2] Interaction and accessibility are incomplete

Why it matters: The demo auto-cycles every 3.8 seconds and restarts after click. This can be annoying and fails reduced-motion expectations unless explicitly handled.

Fix: Add `prefers-reduced-motion` handling, pause auto-cycle after interaction, use real buttons for tabs with ARIA attributes, and ensure focus states.

Suggested command: `/impeccable audit mockup-presentation-produit.html`

### [P3] Naming and polish issues reduce trust

Why it matters: A landing page selling clarity cannot look imprecise.

Fix: Normalize CarryIT/CARRY IT, fix "Voila Carry it" to "Voilà CarryIT", remove unnecessary em dashes, and tune French copy.

Suggested command: `/impeccable polish mockup-presentation-produit.html`

## Persona Red Flags

**Skeptical Notion user**: Understands the system, but may still think "I can build this in Notion" because the section looks like a feature spec, not an argument about reduced setup friction.

**Ambitious user in doubt**: The KPI split is relevant, but the section gets product-mechanical quickly. Needs stronger proof that this helps him stay aligned on the right things, not just manage fields.

**Reduced-motion / keyboard user**: Auto-cycling tabs, span-based tab controls and missing visible pause/focus states create accessibility risk.

## Minor Observations

- "Voici Carry It" and "Voila Carry it" should be normalized.
- "Vos tâches" breaks the otherwise direct "tu" tone.
- SMART section is too abrupt in this standalone file: it jumps from ambition to target without enough context.
- Inline `style` attributes should be removed before integration.
- The mini dashboard starts on Jalons, which is logical for the section but may confuse users expecting the first tab.

## Questions to Consider

- Should this section explain every product concept, or prove one decisive thing: CarryIT connects ambition to action?
- What if the dashboard reveal came earlier and the 5 steps became annotations around it?
- Can orange become proof/selection only, instead of atmosphere?
