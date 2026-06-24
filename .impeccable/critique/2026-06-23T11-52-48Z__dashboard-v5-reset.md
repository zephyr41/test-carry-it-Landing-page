---
target: redesign-dashboard/output/dashboard-v5-reset.html + dashboard-v5-reset.css
total_score: 18
p0_count: 2
p1_count: 6
timestamp: 2026-06-23T11-52-48Z
slug: dashboard-v5-reset
---

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | FoodX visual match | 2 | Direction dark/cards/sidebar exists, but density and proportions are still not FoodX-level |
| 2 | Dashboard legitimacy | 3 | It is finally a real page dashboard, not screenshot/app-window |
| 3 | Information hierarchy | 1 | KPI card dominates too much while right cards feel bolted-on and small |
| 4 | Aesthetic minimalism | 2 | Only 4 panels, but visual treatment is still loud: huge chart void + orange glow/value |
| 5 | Layout rhythm | 1 | Left/right column proportions are awkward; the bottom jalon strip looks detached |
| 6 | Typography | 2 | Inter/weight choices feel heavy; headings are too bold and too compressed |
| 7 | Color discipline | 2 | Correct orange, but accent is overused in value/line/button/logo/glow/text |
| 8 | Product fit | 2 | Content is CarryIT, but the graph-first layout may not be the best command center for objective tracking |
| 9 | Responsive readiness | 2 | CSS has breakpoints; not visually validated enough after rewrite |
| 10 | Implementation cleanliness | 1 | Static file only; no preserved dashboard hooks/IDs yet, not integrable as-is |
| **Total** | | **18/40** | Not production-ready — visually closer, but still structurally wrong |

## Brutal Verdict

This is not complete trash anymore, but it is still not the target.

It has the correct macro idea: dark dashboard page, sidebar, large main graph, compact right column, no app-window. But it still feels like a generic dark admin mockup trying to look premium, not a real CarryIT product dashboard inspired by FoodX.

The biggest problem: it copied the FoodX card language superficially, but not the underlying composition discipline. FoodX has layered density, balanced cards, soft hierarchy, and a clear dashboard ecosystem. This version has one huge chart, two small right boxes, and one floating strip. It feels unfinished.

## P0 Issues

### [P0] The layout composition is unbalanced

The KPI panel is massive and visually eats the page. The right column looks like an afterthought. The milestone strip underneath does not belong to the same composition; it looks pasted below because there was space left.

Current visual effect:
- left side = huge empty graph zone
- right side = small utility boxes
- bottom = unrelated strip

FoodX effect:
- multiple panels share the same visual system
- each block has a reason to exist
- no section feels abandoned

Fix:
- Reduce KPI panel height.
- Make right column align to the same height logic.
- Integrate milestone as a proper card in the right stack OR as a compact row inside the KPI panel, not a detached bottom strip.

### [P0] The chart is fake-large and empty

The chart is too big for the amount of information. Four points on a huge area creates dead space. FoodX can afford large charts because they carry richer visual data: multiple lines, axes, tooltip, overlays, segmented controls.

Here, the graph screams “placeholder”.

Fix:
- Either enrich the KPI card with target/progress context, or reduce chart height.
- Add one small target marker or progress rail, not more bullshit widgets.
- Keep chart as the main visual, but make it denser.

## P1 Issues

### [P1] Orange is too present

Orange appears on:
- logo
- active nav stripe
- kicker
- button
- KPI value
- chart line
- chart fill
- SMART letters
- todo badge
- milestone date
- glow

That is too much. FoodX uses purple strongly, but because its whole palette is tuned around it and it has more neutral balancing elements. Here orange becomes loud.

Fix:
- Keep orange for button, active nav, chart line.
- Make KPI value white/off-white, not orange.
- Make SMART letters muted-orange or badge-free.
- Remove or reduce orange radial glow.

### [P1] Typography is too chunky

The title and panel headings are heavy. FoodX feels soft because the text has lower aggression: medium weights, gray labels, controlled numbers.

Fix:
- h1 max 30-32px, weight 750 not 820.
- panel h2 16-18px, not visually inflated.
- button and labels 12-13px ok, but reduce boldness.

### [P1] Sidebar looks too flat compared to FoodX

Sidebar has the right objects, but not enough premium treatment. The active nav is okay, but the goal block and brand feel basic.

Fix:
- Slightly wider sidebar or more inner breathing.
- Make current goal block closer to FoodX profile card: darker, rounder, more inset.
- Use lower text contrast for inactive links.

### [P1] Right column cards are too text-list heavy

SMART is currently five text rows. It is useful, but visually it reads like documentation. FoodX cards avoid paragraph/list fatigue by using compact tabs, cards, chips, and table rhythm.

Fix:
- Make SMART rows more card-like or two-column mini rows.
- Remove visible “S M A R T” dominance; make letters subtle.
- Compress copy further.

### [P1] To-do card is visually disconnected from the product logic

It is just two checkbox rows. Useful, but not integrated with the active milestone or KPI.

Fix:
- Connect to milestone: “Jalon actif · 1/2”.
- Use calmer checkbox rows.
- Avoid bold task text; make tasks feel like execution, not CTA buttons.

### [P1] The milestone strip is the weakest block

It is too wide for its content, and because it is below the huge KPI panel, it looks like a footer.

Fix:
- Move it into the right column, under SMART or above To-do.
- Or make it a small status band inside KPI card header/footer.

## P2 Issues

- The “+ Mesure” button floats too isolated in the top-right.
- `Vision` kicker is useful, but too bright orange.
- The page lacks a subtle top utility row / filter rhythm, but adding one risks bullshit. Do not add unless needed.
- Chart date labels are too low-contrast and tiny; okay aesthetically, weak functionally.
- Static HTML has no real dashboard states: empty KPI, no data, done tasks, overdue milestone.

## What to Change Next

Do not create another new file. Modify this one.

Recommended target composition:

1. Sidebar unchanged but softer.
2. Header smaller.
3. Main grid:
   - left: KPI card, height around 360-390px, richer but not taller.
   - right: vertical stack of 3 cards:
     - Jalon actif
     - To-do
     - SMART compact
4. Remove bottom milestone strip entirely.
5. Reduce orange usage.
6. Make the page feel less like a mockup and more like an operating dashboard.

## Concrete CSS/HTML Fix List

- Move `.milestone-panel` into `.side-panels` in HTML.
- Change `.dashboard-grid` to only two columns, no grid-template-areas with bottom strip.
- Reduce `.kpi-panel min-height` from 450px to ~390px.
- Reduce `.chart-wrap height` from 350px to ~270px.
- Change `.kpi-value` color from orange to off-white.
- Change h1 font-weight from 820 to 760 and max size from 36px to 32px.
- Reduce `--shadow` strength.
- Remove `.kpi-panel::after` or reduce opacity by 70%.
- Make SMART copy smaller and less orange.
- Make milestone a compact right-column card.

## Final Verdict

This needs a structural correction, not another aesthetic pass.

The file is usable as a base only if the next edit changes the composition. If we only tweak colors, it will stay wrong.
