---
target: mockup-presentation-produit.html
total_score: 30
p0_count: 0
p1_count: 1
timestamp: 2026-06-04T12-08-31Z
slug: mockup-presentation-produit-html
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Demo tab auto-rotation clear; timer stops on click with no visual indicator |
| 2 | Match System / Real World | 3 | SMART/jalons/KPI explained inline; V0/V1/MVP assumes builder literacy |
| 3 | User Control and Freedom | 4 | Single-scroll, no traps |
| 4 | Consistency and Standards | 3 | Accent consistent; closing pattern too uniform across 4 sections |
| 5 | Error Prevention | 3 | N/A static |
| 6 | Recognition Rather Than Recall | 3 | Each section self-explanatory |
| 7 | Flexibility and Efficiency | 3 | N/A static |
| 8 | Aesthetic and Minimalist Design | 2 | Rifton on ALL h2s + identical closing pattern = template feel |
| 9 | Error Recovery | 3 | N/A |
| 10 | Help and Documentation | 3 | Page IS the product docs |
| **Total** | | **30/40** | **Good** |

## Anti-Patterns Verdict

**LLM assessment**: No gradient text, no hero-metric, no glassmorphism. Two tells: (1) Rifton italic on ALL h2s including long descriptive sentences. (2) border-top accent closing line appears identically in 4 consecutive sections.

**Deterministic scan**: detect.mjs on HTML file returns 0 findings. CSS issues (side-tab/gradient-text/bounce-easing) are in styles.css (main landing page), not this mockup's inline CSS.

## Overall Impression

Strong visual foundation killed by typographic uniformity. Rifton at 3rem on "Relier l'exécution à la vision." doesn't land the same way it does on a 2-word hero. Page reads as one template applied five times.

## What's Working

1. KPI black/white card pair — effort vs result visual contrast. Specific numbers make the claim concrete.
2. Ladder timeline — temporal hierarchy without being a generic card grid. Active dot with orange glow.
3. Demo dashboard — tabbed, auto-rotating, real-looking. Earned at the end as proof after promise.

## Priority Issues

**[P1] Rifton on ALL h2s — display font fatigue**
- Why: Wrong register for descriptive section headings. "Voici Carry IT" needs it; "Être occupé ne veut pas dire avancer." doesn't.
- Fix: Keep Rifton on .product-value-header h2. Switch .section-text h2 to Inter, pushed very large.
- Command: /impeccable typeset

**[P2] Section-closing accent line repeats identically 4 times**
- Why: border-top rgba(238,68,8,0.5) + bold text in smart, jalons, kpi, todo. Attention collapses by section 3.
- Fix: Use it once or twice max in highest-stakes sections. Drop elsewhere.
- Command: /impeccable polish

**[P3] Hero header "Voici Carry IT" floats alone**
- Why: Lone h2 with nothing around it. No framing before section 1.
- Fix: 1 sentence under the header. Max 20 words.
- Command: /impeccable clarify

**[P3] Line-height 0.98 on h2s with long French text**
- Why: Clips descenders on wrap. After Inter switch, set lh >= 1.04.
- Fix: Bundled with P1 fix.

## Persona Red Flags

**Jordan**: "Voici Carry IT" with nothing underneath — dead start before section 1.
**Casey**: At 375px, long headings at display size — verify wrapping after Inter switch.
**Lucas (ICP)**: Recognizes "Être occupé ne veut pas dire avancer." KPI section converts. Closing border-top lines feel redundant by section 4.

## Minor Observations

- font-weight: 650/680 — valid on variable fonts only; Inter static rounds to 600.
- Demo auto-rotation stops on click with no visual feedback.
- #ajustement tag-upper "5. Tout Visible Au Même Endroit" — 6 words uppercase tracked, above the eyebrow word limit.

## Questions to Consider

- "Does the closing section earn a different visual treatment than the four product steps?"
- "Do closing accent lines land harder if they appear once instead of four times?"
