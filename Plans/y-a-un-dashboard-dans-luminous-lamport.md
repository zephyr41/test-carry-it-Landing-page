# Plan — Port VisionView React → dashboard.html

## Context
The design system (`CarryIT Design System/ui_kits/web_app/index.html`) has a polished React VisionView with a 2-card top row (Jalon actif + Résultat/Effort/Calendar) + 2-card bottom row (KPI + SMART). The root `dashboard.html` Vision/Pilotage tab has an older layout: KPI chart (left) + SMART (right) + active jalon block below. Goal: replace the current pilotage view HTML with the exact VisionView layout, ported to vanilla JS.

---

## Target Layout (from VisionView.jsx)

```
┌──────────────────────┬──────────────────────────┐
│  Jalon actif         │  Résultat & Effort        │
│  - position X/Y      │  - Result block (val/tgt) │
│  - title             │  - Effort block (val/tgt) │
│  - validation crit.  │  - 28-day calendar grid   │
│  - mini-timeline     │    (7col × 4row dots)     │
│    (dots per status) │    hover popover          │
└──────────────────────┴──────────────────────────┘
┌──────────────────┬──────────────────────────────┐
│  KPICard         │  SmartCard                   │
│  (global KPI     │  (S M A R T rows             │
│   chart + meas.) │   + edit button)             │
└──────────────────┴──────────────────────────────┘
```

---

## Files to Modify

**Primary: `/Users/nils/Desktop/Carry-IT Entreprise/test-carry-it-Landing-page/dashboard.html`**

Three zones of change:
1. CSS block (inline `<style>`) — add new classes
2. HTML template in `buildProjectCard()` ~line 771–826 — replace pilotage view section
3. JS functions — add calendar + card builders, wire hover events

**Reference (read-only):**
- `CarryIT Design System/ui_kits/web_app/VisionView.jsx` — pixel-exact source

---

## Implementation Steps

### Step 1 — CSS additions

Add to inline `<style>` (or `assets/css/dashboard.css`):

```css
/* Vision top row */
.db-row-vision-top { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }

/* Jalon actif card */
.vision-jalon-actif-card { background: #111; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; }
.vision-jalon-position { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: rgba(255,253,246,0.4); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
.vision-jalon-title { font-size: 16px; font-weight: 700; color: #FFFDF6; margin-bottom: 6px; }
.vision-jalon-validation { font-size: 12.5px; color: rgba(255,253,246,0.55); line-height: 1.5; margin-bottom: 16px; }
/* Mini timeline dots */
.vision-mini-timeline { display: flex; align-items: center; gap: 0; }
.vision-mini-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.vision-mini-dot.done { background: rgba(255,253,246,0.5); }
.vision-mini-dot.active { background: #EE4408; box-shadow: 0 0 0 3px rgba(238,68,8,0.25); }
.vision-mini-dot.upcoming { background: transparent; border: 1.5px solid rgba(255,253,246,0.25); }
.vision-mini-connector { flex: 1; height: 1px; background: rgba(255,253,246,0.12); min-width: 8px; max-width: 24px; }

/* Résultat & Effort card */
.vision-result-effort-card { background: #111; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; }
.vision-stat-block { margin-bottom: 12px; }
.vision-stat-label { font-family: 'JetBrains Mono', monospace; font-size: 10.5px; color: rgba(255,253,246,0.4); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
.vision-stat-value { font-size: 22px; font-weight: 700; color: #FFFDF6; font-family: 'JetBrains Mono', monospace; }
.vision-stat-value span.unit { font-size: 12px; font-weight: 400; color: rgba(255,253,246,0.45); margin-left: 4px; }
.vision-no-measure { font-size: 11px; color: #B87820; margin-top: 2px; }

/* 28-day calendar */
.vision-cal-header { display: grid; grid-template-columns: repeat(7, 22px); gap: 4px; margin-bottom: 4px; }
.vision-cal-day-label { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: rgba(255,253,246,0.3); text-align: center; }
.vision-cal-grid { display: grid; grid-template-columns: repeat(7, 22px); gap: 4px; position: relative; }
.vision-cal-cell { width: 22px; height: 22px; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: default; position: relative; background: rgba(255,253,246,0.04); transition: background 0.15s; }
.vision-cal-cell.has-data { cursor: pointer; }
.vision-cal-cell.effort-day .cal-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,253,246,0.35); }
.vision-cal-cell.result-day .cal-dot { width: 7px; height: 7px; border-radius: 50%; background: #EE4408; box-shadow: 0 0 6px rgba(238,68,8,0.5); }
.vision-cal-cell.today { box-shadow: 0 0 0 1.5px rgba(255,253,246,0.35); }
.vision-cal-cell.elapsed { background: rgba(184,120,32,0.08); border: 1px solid rgba(184,120,32,0.2); }
.cal-dot { width: 6px; height: 6px; border-radius: 50%; }

/* Popover */
.vision-cal-popover { position: absolute; z-index: 100; background: #1a1a1a; border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 12px 14px; width: 220px; pointer-events: none; box-shadow: 0 8px 32px rgba(0,0,0,0.6); font-size: 12px; color: #FFFDF6; }
.vision-cal-popover .pop-type { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; margin-bottom: 6px; }
.vision-cal-popover .pop-type.effort { background: rgba(255,253,246,0.12); }
.vision-cal-popover .pop-type.result { background: rgba(238,68,8,0.2); color: #EE4408; }
.vision-cal-popover .pop-date { color: rgba(255,253,246,0.5); font-size: 11px; margin-bottom: 8px; }
.vision-cal-popover .pop-value { font-size: 18px; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
.vision-cal-popover .pop-note { font-size: 11px; color: rgba(255,253,246,0.45); margin-top: 6px; font-style: italic; }
```

---

### Step 2 — HTML template replacement

In `buildProjectCard(obj, i)` ~line 771, replace the entire pilotage `<div class="db-view db-view-pilotage ...">` block with:

```html
<div class="db-view db-view-pilotage ${...}" data-view="pilotage" ${...}>
  <div class="db-section">

    <!-- TOP ROW: Jalon actif + Résultat/Effort/Calendar -->
    <div class="db-row-vision-top">
      ${buildVisionJalonActifCard(obj, i)}
      ${buildVisionResultEffortCard(obj, i)}
    </div>

    <!-- BOTTOM ROW: KPI chart + SMART (keep existing) -->
    <div class="db-row-kpi-smart">
      <!-- existing kpi-panel + smart-panel unchanged -->
    </div>

  </div>
  <p class="db-citation" style="margin-top:16px">"C'est quand t'as envie d'abandonner que tout commence."</p>
</div>
```

Remove the `${buildActiveJalonBlock(obj, i)}` call — replaced by top-left card.

---

### Step 3 — New JS functions

**`buildVisionJalonActifCard(obj, i)`**
- Find active jalon: first with `statut !== 'completed'`, fallback to last
- Render position "Jalon X/Y", title, validation criteria (critere)
- Render mini-timeline: loop `obj.jalons`, output dot + connector per status

**`buildVisionResultEffortCard(obj, i)`**
- From active jalon: extract leading KPI (effort) + lagging KPI (result)
- Compute current value via existing `getKpiCurrentValue(kpi)`
- Compute days since last lagging measure
- Generate 28 calendar cells via `generateVisionCalCells(activeJalon)`
- Return HTML with result block + effort block + calendar grid

**`generateVisionCalCells(jalon)`**
- Anchor: next Sunday from today
- Walk back 28 days, mark each cell:
  - `effort-day` if date matches any leading KPI measure
  - `result-day` if date matches any lagging KPI measure
  - `today` if date === today
  - `elapsed` if date falls between last lagging measure and today
- Return array of cell descriptor objects `{ dateStr, type, measure, isToday, isElapsed }`

**`initVisionCalendar(projectIndex)`**
- Called from `switchDashboardView('pilotage')` after render
- Queries all `.vision-cal-cell.has-data` within the project card
- Adds `mouseenter`/`mouseleave` listeners
- On hover: position + show `.vision-cal-popover` with measure data

**Wire-up:**
- In `switchDashboardView()` ~line 677: add `if (viewName === 'pilotage') initVisionCalendar(currentProjectIndex)`

---

## Data Mapping (dashboard.html → VisionView)

| VisionView concept | dashboard.html source |
|---|---|
| `activeJalon` | `obj.jalons.find(j => j.statut !== 'completed')` |
| `effortKpi` (leading) | `getJalonKpiByType(activeJalon, 'leading')` |
| `resultKpi` (lagging) | `getJalonKpiByType(activeJalon, 'lagging')` |
| `measures[].date` | `kpi.measures[].date` (ISO format in dashboard) |
| `measures[].value` | `kpi.measures[].value` or `.valeur` |
| `measures[].note` | `kpi.measures[].note` |
| jalon position | `obj.jalons.indexOf(activeJalon) + 1` / `obj.jalons.length` |

Existing helpers to reuse: `getJalonKpis()`, `getJalonKpiByType()`, `getKpiCurrentValue()`, `getKpiTargetValue()`, `getLatestKpiMeasure()`.

---

## Verification

1. Start server: `python3 -m http.server 9999` from project dir
2. Open `localhost:9999/dashboard.html`
3. Switch to Vision tab
4. Check: 2-card top row visible with correct data from real jalons
5. Mini-timeline dots match jalon statuses
6. Calendar shows 28 cells; cells with measures are highlighted
7. Hover dot → popover shows date + value + note
8. Bottom KPI chart + SMART card still functional
9. Switch tabs (Jalons, Todo) and back → no breakage
