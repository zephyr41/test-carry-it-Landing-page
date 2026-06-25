# CarryIT Web App — UI Kit

## Overview
Interactive dashboard prototype for CarryIT — a personal goal-tracking web app (desktop-first, responsive).

## Design context
Built from product specification documents only (no codebase or Figma access). All visual decisions follow the CarryIT color guide and product scope documents.

## Structure

```
ui_kits/web_app/
├── index.html          ← Main interactive dashboard (entry point)
├── Sidebar.jsx         ← Left navigation: logo, nav items, user footer
├── BlocVision.jsx      ← Vision zone: KPI global card + SMART objective card
├── EspaceExecution.jsx ← Execution zone: milestone tabs, task list, kanban
├── PilotageJalon.jsx   ← Milestone zone: timeline + jalon detail + KPI tracking
└── Modals.jsx          ← AddMeasure modal, EditSmart modal, shared Modal/Input/FormGroup
```

## Screens & interactions
- **Dashboard**: Full 3-zone layout with live data
- **KPI card**: Mini line chart, progress bar, add-measure button
- **SMART card**: 5 SMART sections, edit button
- **Execution space**: Jalon tabs → task list (toggle done) or kanban (3 columns)
- **Milestone piloting**: 4-step timeline + active jalon detail with KPI bars
- **Add measure modal**: Date + value fields, validation, Escape/close
- **Edit SMART modal**: 5 editable fields, save/cancel
- **Toast notifications**: Confirmation messages with undo option

## Tech
React 18 + Babel standalone (prototype-grade). Lucide icons via CDN. DM Sans via Google Fonts. Rifton via local font files.

## Caveats
- No backend — all state is in-memory (resets on refresh)
- Kanban is cosmetic — drag-and-drop not implemented
- KPI chart is SVG-only, not a full charting library
