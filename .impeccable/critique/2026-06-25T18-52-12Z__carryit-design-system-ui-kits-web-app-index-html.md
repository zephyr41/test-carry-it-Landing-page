---
target: CarryIT Design System dashboard React
total_score: 20
p0_count: 1
p1_count: 2
timestamp: 2026-06-25T18-52-12Z
slug: carryit-design-system-ui-kits-web-app-index-html
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Toasts solid, status chips good — but the 3px progress bar is near-invisible on dark bg, and "Xj sans mesure" amber text has no visual weight |
| 2 | Match System / Real World | 3 | French vocab accurate, leading/lagging well explained inline — minor: "TodoView" tab label doesn't match the "Espace d'exécution" mental model |
| 3 | User Control and Freedom | 2 | Esc on modals works; no undo on "Valider ce jalon" (irreversible); immediate delete on KPI measures without undo; inconsistent confirm dialogs |
| 4 | Consistency and Standards | 2 | Task state split across two sources (App.jalons vs EspaceExecution local state); date formats diverge (ISO vs DD/MM/YYYY); orange drifts (#EE4408 vs #F34C0A in TodoView); Rifton declared but never applied |
| 5 | Error Prevention | 2 | EspaceExecution useEffect resets local tasks on any jalons state change — in-session task additions wiped silently; ISO vs DD/MM/YYYY sort bug corrupts KPI chart order |
| 6 | Recognition Rather Than Recall | 2 | "Ajouter une mesure" in VisionView KPICard and in JalonsView JalonKPICard use identical affordances but write to different datasets — no contextual cue distinguishes them |
| 7 | Flexibility and Efficiency | 2 | Tweaks panel is a good power-user feature; no keyboard nav for timeline rail, no jump-to-active-jalon from VisionView; no bulk actions |
| 8 | Aesthetic and Minimalist Design | 2 | Dark theme is appropriate and tasteful; VisionView loads 12+ distinct information blocks simultaneously; SMART A/R fields are full paragraphs in a side-by-side card |
| 9 | Error Recovery | 1 | No error boundaries anywhere — a single JSX parse error crashes silently; empty catch blocks on localStorage; form validation doesn't highlight which field failed on re-submit |
| 10 | Help and Documentation | 1 | No onboarding; KPIEmptyState copy is technically correct but doesn't deliver the CarryIT brand message ("ta seule preuve que tu avances"); SMART fields blank with no scaffolding for new users |
| **Total** | | **20/40** | **Acceptable — significant improvements needed** |

---

## Anti-Patterns Verdict

**LLM assessment**: Not AI slop. The leading/lagging KPI framework, the 28-day effort calendar with hover popovers, and the drag-to-set time block in AddMeasureModal are specific product decisions made for a specific user. The codebase reads like someone who has actually tried to track multi-year projects and knows where the pain is. The inconsistencies (task state fork, date format drift) look like normal iteration speed, not template output.

**Deterministic scan — 11 findings across 5 files:**

*Active UI files (index.html + JSX components):*
- **4× side-tab** (`borderLeft: 3px|5px solid …`) — EspaceExecution.jsx:18 (false positive: CSS triangle arrow, not a tab border), Modals.jsx:250 (effort block in timeline — contextually meaningful), VisionView.jsx:529 & 813 (calendar popover blocks — contextually meaningful). The EspaceExecution hit is a false positive; the others are borderline since they're semantic indicators inside a drag UI, not decorative card accents.
- **2× layout-transition** — JalonKPICard.jsx:322 (KPI progress bar `transition: width`) and JalonsView.jsx:231 (task bar fill `transition: width`). Both animate `width` percent and will cause layout reflow on every frame. Replace with `transform: scaleX()` + `transform-origin: left`.
- **2× overused-font** — Inter in index.html lines 8 & 29. **Not a false positive** — Inter is used exclusively, and Rifton (the brand display font declared in `@font-face`) is never applied anywhere in the component files.

*Prototype file (design-canvas.jsx — not loaded in live app):*
- 2× broken `<img>` (no src), 40 em-dashes, numbered section markers (01/02/05…). Excluded from scoring — not live UI.

**Browser visualization**: Assessment B fork was running browser screenshots at time of synthesis; findings are corroborated by code review and will be reflected in any subsequent run.

---

## Overall Impression

The dashboard has real craft where it matters: the JalonKPICard sparkline, the timeline rail dot states, the KPIHistorySheet slide-in with delta tracking. These are the interactions that deliver the product promise — "proof you're advancing." But there's a P0 data loss bug (task state), a P1 date format bug that corrupts chart order, and the brand identity is half-present: Rifton is declared but never applied, leaving "CARRY IT" in the nav rendered in Inter like every other dashboard on the internet. The VisionView information architecture needs one clear hierarchy — right now it's 12 competing blocks.

---

## What's Working

**1. JalonDetail master-detail pattern** — the timeline rail with 3-state dots (done/active/upcoming), sticky on scroll, paired with a full detail panel. Immediately communicates where you are in the plan without any instructions. The dashed connector becomes solid for completed jalons — subtle and correct.

**2. KPIHistorySheet slide-in** — the right-edge drawer with delta vs previous is exactly the right affordance for audit mode. "Am I moving?" answered at a glance: date, value, delta. The delete-per-row lets you fix bad measurements. This is the product promise made tactile.

**3. AddMeasureModal drag-to-set timeline** — a 17-hour scrollable timeline with click-drag to set start and duration is a genuinely considered microinteraction. It costs two lines of code to ignore; someone chose to build it. Signals real product thinking.

---

## Priority Issues

### [P0] Task state lives in two disconnected places

**What**: `EspaceExecution.jsx` maintains its own local `tasks` state, initialized once from `jalons` props. But `App.jsx`'s `handleAddMeasureToKPI` and similar state changes cause re-renders that re-fire `useEffect([jalons])` — resetting EspaceExecution's local tasks. Any task the user adds in the TodoView is silently wiped on the next state change in the parent.

**Why it matters**: This is a data loss bug. A user adds "Envoyer mail de relance" to their task list, clicks "Ajouter une mesure" on a KPI (unrelated action), and their new task disappears. No error. No warning. For a product selling itself on being a trustworthy record of work, losing user input is fatal.

**Fix**: Remove `EspaceExecution`'s local task state. Pipe tasks from `jalons` prop directly (already available), and lift `toggleTask`/`addTask` callbacks up to `App.jsx` as `onToggleTask`/`onAddTask` — same pattern as `onValidate`. The `EspaceExecution` component then becomes stateless for task data.

**Suggested command**: `/impeccable harden`

---

### [P1] Date format split corrupts KPI chart order

**What**: `SimpleMeasureModal` (used in VisionView's "Ajouter une mesure" button) saves dates as ISO strings (`YYYY-MM-DD`). `AddMeasureModal` (used in JalonKPICard) saves as `DD/MM/YYYY`. The sort in `handleSaveKpiMeasure` only normalizes dates containing `/` — ISO strings pass through unsorted and land in wrong chronological position.

**Why it matters**: The KPI sparkline and chart are the primary evidence surface. If measures sort in wrong order, the "visual proof" feature shows a fabricated trajectory.

**Fix**: Normalize all date inputs to ISO format at save time. One helper: `const toISO = (s) => s.includes('/') ? s.split('/').reverse().join('-') : s`. Apply at both save sites.

**Suggested command**: `/impeccable harden`

---

### [P1] Rifton declared but never applied

**What**: `@font-face { font-family: "Rifton" }` is declared in `index.html`. The `TopNav.jsx` brand name explicitly overrides to Inter (`fontFamily: "'Inter', system-ui, -apple-system, sans-serif"`). No component uses Rifton.

**Why it matters**: The brand display font is CarryIT's strongest visual differentiator vs every Inter-based SaaS. "CARRY IT" in the nav rendered in Inter (flagged by detector) reads like an unnamed tool, not a brand.

**Fix**: Apply `fontFamily: '"Rifton", "Inter", system-ui, sans-serif'` to the `.brandName` span in TopNav.jsx. Optionally apply to the main screen labels (`data-screen-label` headings) in each view. No other changes needed.

**Suggested command**: `/impeccable typeset`

---

### [P2] VisionView: 12+ competing information blocks on first load

**What**: VisionView renders simultaneously: Active Jalon card (with 5-node timeline), Résultat/Effort/Calendar card (3 sub-sections + 28-cell calendar), KPI global chart (with projection), and SmartCard (5 SMART fields, two of which are 100+ word paragraphs). Total independent reading zones on first render: ~12.

**Why it matters**: The product's hook is "voir les chiffres, pas de la motivation." But a user who opens the dashboard and can't find the signal in the noise won't feel clarity — they'll feel complexity.

**Fix**: Establish a clear primary focus. Option A: Collapse SMART A and R to first 2 lines with "Voir plus" affordance. Option B: Give the Résultat/Calendar card its own row (full width) above the KPI chart + SMART grid. The calendar + effort/result block is the "ce qui se passe maintenant" and should be primary, not squeezed into a half-card.

**Suggested command**: `/impeccable layout`

---

### [P2] Calendar dots: 8px visual target on dark background

**What**: Each calendar day in the VisionView effort grid renders an 8px dot as the primary visual element. The hit target is `height: calendarCellSize + 10 = 32px` — fine for touch. But the visual affordance for "this cell has data" vs "this cell is empty" is an 8px circle vs an 8px darker circle. On a `#0A0A0A` background, the difference between `rgba(255,253,246,0.08)` (empty) and `rgba(255,253,246,0.58)` (active) is subtle.

**Why it matters**: The calendar is the "was I present last week" check. If the user can't read it without squinting, it loses its emotional impact.

**Fix**: Increase active dot to 10-12px. On hover, show a faint background on the cell (already present in `calendarCellPeriod` but only for period cells). Consider a colored ring rather than a filled dot for result days, to distinguish from effort dots without relying on size alone.

**Suggested command**: `/impeccable polish`

---

## Persona Red Flags

**Alex (Power User — expert-level daily driver, model: Nils)**

Alex opens the dashboard every morning to log an effort measure. Flow:
1. Clicks Vision tab → sees the VisionView. Wants to add to the active JalonKPI, not the global KPI.
2. The "Ajouter une mesure" white button at top-right of KPICard is the most visually dominant CTA on screen. Clicks it.
3. Gets `SimpleMeasureModal` (date + value, ISO format) — but this writes to `kpi.measures` (global KPI), not to the jalon's leading KPI.
4. To add to the right dataset, Alex must: navigate to Jalons tab → find the active jalon → find the JalonKPICard → click "Mesure" there → get `AddMeasureModal` (timeline modal, DD/MM/YYYY format).

**Red flag**: Two visually identical CTAs write to two different datasets. The more prominent one (top-right, white button) writes to the wrong place for the daily use case. Alex will have wrong data for months before noticing the mismatch.

---

**Riley (Stress Tester — pushes edge cases)**

Riley adds 3 tasks in TodoView, then clicks "+" to add a KPI measure to a jalon. Tasks disappear (P0 bug). Riley tries again, same result. No error, no explanation. Riley opens JalonsView — tasks still show there (from `jalons` state). Goes back to TodoView — list resets. Cannot reproduce consistently because the reset only happens on re-render triggered by specific actions.

**Red flag**: The data loss is non-deterministic. Tasks added immediately before a state-triggering action are lost; tasks added at rest survive. Riley will file this as an intermittent bug, which is worse than a consistent one — it erodes trust in the data.

---

**Jordan (First-Timer — uses CarryIT after landing page signup)**

Jordan has defined a SMART goal. Opens dashboard for first time. VisionView: 12 information zones. Doesn't know where to look. KPI chart shows a flat line at 0 (Jordan hasn't logged any measures yet). SmartCard shows their objective. No onboarding prompt saying "start here" or "log your first measure."

Jordan clicks "Jalons" — sees a sidebar with milestone entries. Clicks one. Reads "Critère de validation." Reads "KPI de jalon" — sees "Aucune mesure pour ce KPI." Finds "Première mesure" button. Clicks. Gets a modal with a drag-to-set timeline and a time block. Doesn't understand what "effort" means in this context — is it time I spent? A count? The label "Effort" in the modal's time block gives no hint.

**Red flag**: First measure in the most important screen is gated behind an unexplained drag interaction. Jordan will click around the timeline without understanding what they're setting (start time of their work session), enter a value, save — and not know if they did it right.

---

## Minor Observations

- **Duplicate `boxShadow` key** in `Toast` inline styles (index.html lines 253 + 256) — second declaration silently wins. No user impact, but silent JS behavior to clean up.
- **`#F34C0A` in TodoView sectionLabel** — slightly different orange from the canonical `#EE4408` everywhere else. Not perceptible as intentional; looks like an accidental drift.
- **`kpi.titre` vs `kpi.label` naming split** — JalonKPIs use `titre` (from initial data), but `EditKPIModal` saves to `form.label`. Display code reads `kpi.titre || kpi.label` as a fallback, masking the bug. After one edit round-trip, the KPI's `titre` field goes stale; `label` is authoritative. Confusing in any future data migration.
- **`confirm()` in EditJalonModal** but not in EditKPIModal delete — inconsistent guard for destructive actions.
- **EspaceExecution `sectionStyles.wrap`** is an empty object `{}` with only a CSS comment. Dead style declaration.
- **`design-canvas.jsx`** is in the directory but not loaded in the live app — 40 em-dashes, broken img tags, numbered section markers. If this file is ever wired up or reviewed as a template, its anti-pattern density is high.

---

## Questions to Consider

1. **The KPI chart shows 9 months of zeros. Is that the signal, or is the signal that someone kept showing up for 9 months to enter a zero?** The data is honest. But the UI makes no distinction between "I have 0 clients because I haven't started yet" and "I have 0 clients after 9 months of trying." A small annotation or milestone marker at each jalon transition would let the chart tell the survival story, not just the absence story.

2. **VisionView has two KPI displays: the global KPI chart and the active jalon's KPI in the quick cards. Why are they separate?** The jalon's KPI is what's being actively worked; the global KPI is the north star. Are users expected to track both simultaneously, or does the split create the confusion found in Alex's persona test (writing measures to the wrong dataset)?

3. **If a user's tasks disappear every time they log a measure (P0 bug), they've already lost trust in the data layer. How much of the CarryIT brand promise is "your data is always there, untouched"? And does the current architecture — browser-only localStorage, no sync, no backend — make that promise credibly?**
