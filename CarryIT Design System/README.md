# CarryIT Design System

## Overview

**CarryIT** is a responsive web app for structuring and piloting long-term personal goals. It bridges long-term ambition with short-term execution: the user creates a SMART objective, breaks it into milestones (jalons), and tracks progress with measurable KPIs. Each milestone has a kanban or task list to connect the big picture to concrete daily work.

**Category:** Productivity / goal tracking / personal execution  
**Platform:** Web app, desktop-first, responsive  
**Target:** Individual users with a long-term ambition to structure and follow

**Sources provided:**
- `uploads/product_scope.md` — Full product scope and positioning
- `uploads/dashboard.md` — Dashboard layout and zone specifications
- `uploads/jalons.md` — Milestone (jalon) definition, rules, and behaviors
- `uploads/KPI.md` — KPI types, structure, and rules
- `uploads/bloc_vision_kpi.md` — KPI graph specification (line chart, interactions)
- `uploads/corpus.md` — UX references (WCAG, Nielsen, no addictive patterns)
- `uploads/Color Guide from Claude.html` — Full color palette with tokens and usage rules
- `uploads/logo_png.png` — Logo mark (two mountain triangles, white outline)
- `uploads/rifton-regular.woff2/.otf` — Brand display typeface
- `uploads/rifton-italic.woff2/.otf` — Brand display typeface (italic)

No Figma links or codebase were provided. Design system was constructed from the documents above.

---

## CONTENT FUNDAMENTALS

### Language
- Primary language: **French** (UI labels, copy, documentation)
- Tone: Clear, direct, pragmatic — never motivational or gamified
- Voice: Neutral, structural, precise. The app does not decide for the user; it structures and makes visible.

### Copy principles
- **No artificial motivation.** No "You got this!", no streaks, no celebration confetti.
- **Factual and concrete.** KPIs are numbers. Jalons are binary: done or not done.
- **Short labels, full sentences for descriptions.** E.g. badge label: `S`, section label: `L'ambition`, then a full description below.
- **Imperative for actions.** `Ajouter une mesure`, `Modifier`, `Valider`, `Enregistrer`, `Annuler`
- **No emoji in UI.** Interface is clean, no decorative unicode.
- **Casing:** Sentence case throughout. `Objectif SMART` (acronym stays uppercase), not `OBJECTIF SMART`.
- **Numbers are formatted cleanly.** Integer-only in V1. No raw floats.

### Example copy
- Empty state: `Entrez une mesure` / CTA: `Ajouter une mesure`
- Undo toast: `Valeur supprimée — cliquer pour annuler`
- Milestone states: `En cours`, `Terminé`, `À venir`
- SMART sections: `S — L'ambition`, `M — La mesure`, `A — Atteignable`, `R — Réaliste`, `T — L'échéance`
- Action buttons: `Modifier`, `Enregistrer`, `Supprimer`, `Fermer`, `Annuler`

### UX philosophy (corpus.md)
- References: WCAG 2.2, Nielsen heuristics, standard web UI patterns
- Priority order: accessibility > usability > UI consistency > behavioral models
- Exclusions: addictive retention loops, manipulative gamification, artificial variable rewards

---

## VISUAL FOUNDATIONS

### Color
Dark-mode only interface. Background is near-black (`#080809`). Warm off-white text (`#FFFDF6`). One strong accent color — orange (`#EE4408`) — used sparingly for primary action only.

| Token | Hex | Role |
|---|---|---|
| `color-bg` | `#080809` | Page background |
| `color-surface` | `#111112` | Card / panel surface |
| `color-surface-raised` | `#1A1A1C` | Sidebar, secondary panels |
| `color-text-primary` | `#FFFDF6` | Body text |
| `color-text-secondary` | `#929292` | Labels, meta, legends |
| `color-accent` | `#EE4408` | CTAs, primary actions — use sparingly |
| `color-accent-text` | `#F34C0A` | Emotional text highlights only |
| `color-confirm` | `#0A2A53` | Validated states only |
| `color-tracker` | `#404025` | Progress bars, KPI tracking |
| `color-alert` | `#A3150D` | Friction / alerts — constructive tension |

**Rules:**
- Orange is a **responsibility color**, not a decoration. Appears rarely; this scarcity gives it weight.
- Blue (`color-confirm`) only confirms completed/validated states. Never used for navigation or decoration.
- Olive (`color-tracker`) only for KPI progress indicators.
- Alert red signals constructive friction (late milestones, blockers) — never anxious decoration.

### Typography
- **Brand display:** Rifton (custom, provided) — used for the logo wordmark and major display headings. Regular and italic weights. Tracks tight (`-0.03em`).
- **UI:** DM Sans — clean, geometric sans-serif. Used for all interface text, labels, numbers. *(Font file pending upload — token `--font-body` points at `DM Sans` and renders its system fallback stack until the file lands.)*
- **Mono:** JetBrains Mono — used for code tokens, KPI values when tabular alignment matters. *(Font file pending upload — token `--font-mono` falls back to system monospace until then.)*

**Scale:** `xs(12)` → `sm(13)` → `base(15)` → `md(17)` → `lg(20)` → `xl(24)` → `2xl(32)` → `3xl(44)` → `4xl(60)`

Labels are uppercase, wide-tracked (`0.04em`), in secondary color. Headlines are tight-tracked, bold.

### Backgrounds & Surfaces
- **No gradients** on surfaces. Backgrounds are flat, matte, dark.
- Cards use `#111112` surface with an 8% white border — subtle, structural.
- No textures, no patterns, no imagery in backgrounds.
- Layering is via slight brightness lifts in surface levels, not color or transparency shifts.

### Spacing
Base-4 system: `4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px, 80px, 96px`

### Border Radius
- Badges, chips: `4px` (sm)
- Cards: `8px` (md) — slightly rounded, not soft
- Modals: `12px` (lg)
- Pills/tags: `9999px` (full)

### Shadows / Elevation
Dark interface uses opacity-based shadows. Cards get `shadow-md`. Modals get `shadow-xl`. Accent glow (`shadow-accent`) used only on primary CTA in isolated contexts.

### Animation
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (fast out, ease settle) — not bouncy, feels precise
- Durations: `120ms` (micro), `220ms` (standard), `380ms` (slow/enter)
- Tooltips: appear immediately on hover (no delay per spec)
- No decorative animations. Motion is functional: confirm an action, reveal content, transitions between states.

### Hover & Press States
- Buttons: background darkens (`#C03806` on orange, `rgba(255,253,246,0.08)` on ghost)
- Interactive text: slight opacity decrease (`0.7`)
- Cards: no scale, no shadow lift — border brightens slightly
- No scale-up on hover (no playfulness signal)

### Borders
- All borders use rgba white at low opacity (`8%` standard, `14%` medium)
- No colored borders except for state indicators (alert red, confirm blue)
- Separator lines: `rgba(255,253,246,0.08)` 1px

### Cards
- Background: `#111112`
- Border: `1px solid rgba(255,253,246,0.08)`
- Radius: `8px`
- Padding: typically `24px`
- No external shadow on cards (they sit on dark bg, shadow is invisible anyway)
- Sections within cards separated by 1px horizontal rules

### Imagery
No photography or illustration in V1 product. The only visual motif is the **logo mark** — two mountain triangles (one tilted/smaller, one larger) in white outline. This geometric minimalism should be respected; do not add decorative illustrations.

### Iconography
Icon system: **Lucide Icons** (CDN-linked). Stroke-based, 1.5px stroke weight, consistent with the clean sans-serif typography. No filled icons. No emoji. See ICONOGRAPHY section.

### Use of Transparency / Blur
- Backdrop blur only for modals (`backdrop-filter: blur(8px)`) on the dark overlay
- No frosted-glass surfaces in the main UI
- Transparency used for borders and disabled states only

### Corner Radius Philosophy
Functional, not decorative. `8px` for most UI containers to signal "interactive object" without being playful. Badges use `4px` (more technical feel). Never `24px+` on card surfaces.

---

## ICONOGRAPHY

**System:** Lucide Icons — `https://unpkg.com/lucide@latest` or CDN link  
**Style:** Stroke, 1.5px weight, no fill. Matches the clean, linear aesthetic of the brand.  
**Size:** 16px (inline), 20px (standard UI), 24px (section icons)  
**Color:** `var(--color-text-secondary)` (#929292) by default; `var(--color-text-primary)` (#FFFDF6) when active or on dark surface; `var(--color-accent)` (#EE4408) only for primary action icons.

**Logo mark:** `assets/logo.png` — Two mountain triangles (rounded corners), white outline on transparent. Used on dark backgrounds only.

**No custom SVG illustrations.** The brand uses geometric minimalism; avoid decorative SVG assets.

**Emoji:** Never used in the interface.

**Unicode chars:** Not used as icons.

---

## FILE INDEX

```
/
├── README.md                     ← This file — brand context & design rules
├── colors_and_type.css           ← CSS variables: colors, type scale, spacing, radii, shadows
├── components.css                 ← Component-level classes built on the tokens
├── styles.css                    ← Global stylesheet (compiler entry — @imports the token sheets)
├── SKILL.md                      ← Skill manifest for Claude Code
├── "Présentation Produit.html"    ← Scrollytelling product page (5 sections + demo dashboard)
├── fonts/
│   ├── rifton-regular.woff2 / .otf    ← Brand display font (regular)
│   └── rifton-italic.woff2 / .otf     ← Brand display font (italic)
│                                  (DM Sans & JetBrains Mono load from Google Fonts / pending upload)
├── assets/
│   └── logo.png                  ← Logo mark (mountain triangles, white, transparent bg)
├── preview/                      ← Design-system reference cards (colors, type, spacing, components)
│   ├── colors-base / colors-semantic
│   ├── type-brand / type-scale / type-labels
│   ├── spacing / radii-shadows
│   └── buttons / badges-chips / cards / inputs / kpi-block / milestone-block / logo
└── ui_kits/
    └── web_app/
        ├── index.html                 ← Full interactive dashboard prototype (Vision / Jalons / To-do)
        ├── *.jsx                      ← View + component sources (TopNav, BlocVision, JalonsView, …)
        ├── TopNav.d.ts                ← Component type — makes TopNav a DS component
        ├── "KPI Block - Apple directions.html"  ← @dsCard: KPI block, 3 directions
        ├── onboarding-*.html          ← Onboarding flow mockups
        └── README.md                  ← UI kit notes
```

---

## UI Kits

### Web App (`ui_kits/web_app/index.html`)
Full interactive prototype of the CarryIT dashboard. Three top-rail views (no sidebar):
- **Vision · Long terme** — KPI global card (line chart + `Ajouter une mesure`) and SMART objective card
- **Jalons** — milestone timeline rail + per-jalon KPI tracking and tasks
- **To-do list** — task list / kanban toggle scoped to the active jalon
- Modals for adding/editing KPI measures, KPIs, jalons, and the SMART objective
- Tweaks: default view, density (comfort/compact), timeline side

### KPI Block — Apple directions (`ui_kits/web_app/KPI Block - Apple directions.html`)
`@dsCard` exploring the right-hand KPI block in three treatments — current, Activity-rings, and a line/bar register — all on CarryIT tokens.
