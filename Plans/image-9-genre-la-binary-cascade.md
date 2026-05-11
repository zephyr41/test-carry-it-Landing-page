# Plan — Jalons Block : 4 fixes

## Context

4 problems visible in screenshots 9-12:
1. **Jalon 2 stays gray** — auto-transition code only runs on new validations. Existing localStorage data (Jalon 1 = completed, Jalon 2 = pending) was never migrated.
2. **Mystery divider line** — `msb-divider` between timeline and detail is a standalone hairline. Serves no purpose once the inner card provides natural separation.
3. **Detail section has no card** — `msb-detail` is flat (no bg/border). Target design (Image 12) wraps the jalon detail in a proper card nested inside the outer panel, matching the design system `.card` spec.
4. **Outer panel wrong bg** — a previous edit changed `db-card-pilot` from `#1c2133` → `#111112`, making outer + inner look identical. Needs revert so depth hierarchy is preserved: outer panel (`#1c2133` blue-dark) → inner card (`#111112` pure dark).

---

## Files to modify

- `dashboard.html`
- `assets/css/dashboard.css`

---

## Fix 1 — Migration: Jalon 2 → `in_progress`

**Where:** `dashboard.html` — inside the `allObjectifs.forEach(obj => {` migration block, after line 390 (after the KPI migration loop closes).

**Logic:** if no jalon in the project has `statut: 'in_progress'`, find the last completed jalon in chronological order, set the immediately following `pending` jalon to `in_progress`, set `changed = true`.

```js
// Migration: auto-transition — set first pending after last completed to in_progress
const jalonList = obj.jalons || [];
const hasActive = jalonList.some(j => (j.statut || 'pending') === 'in_progress');
if (!hasActive) {
    const sorted = [...jalonList].sort((a, b) =>
        new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
    );
    const lastDoneIdx = sorted.reduce((acc, j, idx) =>
        j.statut === 'completed' ? idx : acc, -1
    );
    if (lastDoneIdx >= 0 && lastDoneIdx < sorted.length - 1) {
        const next = sorted[lastDoneIdx + 1];
        if (next && (next.statut || 'pending') === 'pending') {
            const ref = jalonList.find(j => j.id === next.id);
            if (ref) { ref.statut = 'in_progress'; changed = true; }
        }
    }
}
```

---

## Fix 2 — Remove the divider line

**Where:** `dashboard.html` — `buildJalonMilestoneBlock` return template.

Remove this line:
```html
<div class="msb-divider" aria-hidden="true"></div>
```

The inner card's top border + `margin-top` provides natural separation.

---

## Fix 3 — Inner card for detail section

**Where:** `assets/css/dashboard.css` — `.msb-detail` block (currently around line 3113).

Replace current flat style:
```css
/* CURRENT */
.msb-detail {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
```

With design-system card style:
```css
/* NEW */
.msb-detail {
    background: #111112;
    border: 1px solid rgba(255,253,246,0.08);
    border-radius: 8px;
    padding: 20px 22px;
    margin-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
```

Tokens match `components.css` `.card` exactly.

---

## Fix 4 — Revert outer panel bg

**Where:** `assets/css/dashboard.css` — `.db-card-pilot` (line 367).

```css
/* REVERT */
.db-card-pilot {
    background: #1c2133;          /* was incorrectly changed to #111112 */
    border-color: rgba(255,253,246,0.08);
    border-radius: 8px;
}
```

This restores the visual depth: outer panel (blue-dark `#1c2133`) → inner card (pure dark `#111112`) → KPI sub-cards (`#111112` with own border).

---

## Bump CSS version

`dashboard.css?v=61` in `dashboard.html` `<link>` tag.

---

## Verification

1. Hard-reload `localhost:9999/dashboard.html`
2. **Image 9 fix**: Timeline Jalon 2 dot shows orange (active state `msb-dot--active`) — no manual action needed
3. **Image 10 fix**: No hairline between timeline and detail
4. **Image 11→12 fix**: Detail section has visible card border + `#111112` bg inside the blue-dark outer panel
5. **Depth hierarchy**: Outer panel distinctly lighter (#1c2133) vs inner card (#111112) vs KPI cards (#111112 same but clearly within inner card)
