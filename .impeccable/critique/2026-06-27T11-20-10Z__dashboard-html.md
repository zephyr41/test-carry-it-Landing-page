---
target: dashboard.html vision long terme
total_score: 22
p0_count: 0
p1_count: 2
timestamp: 2026-06-27T11-20-10Z
slug: dashboard-html
---
**Design Health Score**

| # | Heuristic | Score | Key Issue |
|---|---:|---:|---|
| 1 | Visibility of System Status | 3 | Active jalon, KPI, effort/result and days without measure are present, but no dominant diagnosis. |
| 2 | Match System / Real World | 3 | Effort/result fits CarryIT well; KPI global and SMART feel administrative. |
| 3 | User Control and Freedom | 2 | Edit/add actions exist, but the view does not clarify what is safe or important to change now. |
| 4 | Consistency and Standards | 2 | Inline styles and copied JSX fragments create fragmented component vocabulary. |
| 5 | Error Prevention | 2 | Empty and zero KPI states can imply progress data where there is only missing instrumentation. |
| 6 | Recognition Rather Than Recall | 3 | Labels are visible; calendar symbols and elapsed bands require interpretation. |
| 7 | Flexibility and Efficiency | 2 | Add measure is available; review and diagnosis workflows remain slow. |
| 8 | Aesthetic and Minimalist Design | 2 | Serious visual base, but too many equal-weight cards, labels, dots, chips and separators. |
| 9 | Error Recovery | 2 | Form recovery exists elsewhere; this view gives little local recovery guidance. |
| 10 | Help and Documentation | 1 | Dot meanings and state meanings are mostly hover/guess based. |
| **Total** | | **22/40** | **Functional, not yet premium product confidence.** |

**Anti-Patterns Verdict**

**LLM assessment**: medium-high product slop risk. The view does not look like glossy AI marketing slop, but it does read like a dashboard assembled from component blocks rather than one senior product surface. It has the right raw material: dark restrained UI, long-term metric model, active jalon, result/effort split, SMART context. The missing layer is judgment. The screen shows many facts, but does not tell the user what the system sees.

**Deterministic scan**: `detect.mjs --json dashboard.html` found 4 warnings:
- `overused-font` at `dashboard.html:10` and `dashboard.html:5196`, Inter is flagged as common.
- `layout-transition` at `dashboard.html:293` and `dashboard.html:3975`, width/height animations can cause layout jank.

The font warning is partly acceptable for product UI because system familiarity matters here, but CarryIT already has Rifton for brand moments. The transition warnings are real polish debt.

**Visual evidence**: Browser screenshot was captured from the local page at `/tmp/carryit-dashboard-vision-empty.png`. Reliable live data injection was not available because the project does not expose the Playwright Node module, so the populated-state critique is based on source rendering paths and existing component code. Empty state inspection confirms a separate issue: the full-width orange `+ Créer un objectif` button is heavy and less premium than the rest of the restrained nav.

**Overall Impression**

The concept is strong, but the current screen feels like a report, not a cockpit. For CarryIT, the user should understand in 3 seconds whether his long-term ambition is alive, stale, under-instrumented, or converting effort into proof. Right now he has to synthesize that manually from separate panels.

**What's Working**

- The `Résultat` versus `Effort` split is strategically right. It names the exact long-term tension CarryIT should own.
- The restrained dark surface, orange accent and compact density are closer to pro tool than generic pastel SaaS.
- The active jalon + SMART + KPI model is coherent with the product promise.

**Priority Issues**

**[P1] No executive diagnosis**

Why it matters: The dashboard shows evidence but does not conclude anything. A tired user has to decode jalon position, KPI chips, effort/result, calendar dots and SMART rows before knowing what matters.

Fix: Replace the decorative section label with a sober status header: active jalon, current health state, next proof expected, and last proof age.

Suggested command: `/impeccable shape dashboard.html vision long terme`

**[P1] The quote breaks the brand contract**

Why it matters: `C'est quand t'as envie d'abandonner que tout commence.` reads like motivational software. CarryIT should not pep-talk; it should tell the truth of the system.

Fix: Remove the quote. Replace it with diagnostic copy such as `Derniere preuve enregistree il y a X jours. Prochaine preuve attendue: Y.`

Suggested command: `/impeccable clarify dashboard.html vision long terme`

**[P2] Equal-card hierarchy makes everything same-weight**

Why it matters: Jalon actif, result/calendar, KPI global and SMART all share similar black cards, small uppercase labels and borders. The result is competent but not premium.

Fix: Make one primary long-term status area, then subordinate SMART and history as reference panels. Reduce card sameness and use grouping instead of four competing boxes.

Suggested command: `/impeccable layout dashboard.html vision long terme`

**[P2] Calendar encoding is cryptic**

Why it matters: Dots, orange result dots, pale effort dots, today ring, elapsed band and hover popovers require learning. This slows repeated use.

Fix: Add a minimal legend or transform it into an evidence strip: efforts, results, silence since last proof.

Suggested command: `/impeccable clarify dashboard.html vision calendar`

**[P2] Empty state CTA is too heavy**

Why it matters: The empty view is visually clean, but the full-width orange button dominates the page and feels less premium than the rest of the restrained app shell.

Fix: Constrain the CTA width, anchor it to a compact empty-state panel, and make the copy more precise: `Definir le premier objectif`.

Suggested command: `/impeccable polish dashboard.html empty state`

**Persona Red Flags**

**Focused builder, 24, working after job**: too many small panels and encoded dots require energy he may not have. Risk: the dashboard feels like admin instead of clarity.

**Skeptical high-agency user**: the quote and acronym-heavy SMART presentation can feel like coaching software. Risk: trust drops.

**Power user managing multiple projects**: hover-only calendar details and inline component drift slow repeated scanning. Risk: he wants faster scan states, not more microstructure.

**Minor Observations**

- 9px milestone first-word labels are fragile with real French titles.
- Several labels at 0.30 to 0.40 alpha may be tiring in a dense dashboard.
- `KPI global` is accurate but generic. `Mesure principale`, `Trajectoire`, or `Preuve long terme` would feel more CarryIT.
- Heavy inline styles make future polish harder and increase visual drift risk.
- Layout transitions flagged by the detector should be changed to transform/opacity where possible.

**Questions to Consider**

- What should this screen tell the user before he reads any chart?
- If CarryIT refuses artificial motivation, why does the view end with a quote instead of a system diagnosis?
- Is SMART a living control surface here, or archived context?
- What should the dashboard say when effort is high but result has not moved?
