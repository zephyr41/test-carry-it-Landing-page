---
target: Timeline component (DA System)
total_score: 25
p0_count: 0
p1_count: 1
timestamp: 2026-07-06T20-25-49Z
slug: ryit-design-system-da-system-preview-timeline-html
---
Method: single-context (DEGRADED — sub-agents non lancés per user global no-spawn rule). Detector detect.mjs = 0 finding. Playwright browser inspection.

# Design Health Score: 25/40 (Acceptable)

Heuristics: Visibility 2 (header "10" vs 7 rendered, 3 hidden; spine shows no progress), Match 3, Control 2 (no way to reach hidden jalons), Consistency 3, ErrorPrevention 3, Recognition 3, Flexibility 2 (no states/shortcuts), Aesthetic 2 (triple ordinal redundancy + "2026" x7 + title "TIMELINE"), ErrorRecovery 3, Help 2.

# Anti-Patterns Verdict
Not AI-slop. Detector 0 findings. Filet removed, no gradient text, no glass, no hero-metric. Clean but not premium: informational laziness — 3 elements encode jalon position, panel names itself.

# Priority Issues
[P1] Header says "10" but 7 jalons rendered, 3 hidden silently. Breaks trust + contradicts brand principle "montrer la verite dure du temps long". Fix: render all 10 or explicit "+3 / Voir tout" ghost row. Cmd: clarify.
[P2] Triple ordinal redundancy: "MOIS 1" + "Jalon 1/10" + header "10". Drop "Jalon N/10". Cmd: distill.
[P2] "2026" repeated 7x. Show year only when it changes (grouped). Cmd: layout.
[P2] Card title is literally "TIMELINE" = placeholder. Title by real object. Cmd: clarify.
[P2] Spine uniform grey, tells no progress. Done segment brighter than future segment. Cmd: layout.

# Persona Red Flags
Alex: no hover/focus/shortcut, can't reach 3 hidden jalons.
Sam: current state only visual (ring), no aria-current/text. Contrast muted 5.9:1 ok.
Nils-like ICP: last visible jalon "1000 clients" while 3 hidden -> app hides the "road remaining" which is the product's emotional core.

# Minor
Current dot bulge vs done dots. Vertical rhythm airy (fixed 88px rows). Eyebrow 11px = readable floor.

# Questions
Are jalons clickable? Should remaining road be visually stronger than done? Is "Mois N" the right axis for a multi-year ambition?
