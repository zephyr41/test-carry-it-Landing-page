---
target: index.html hero section
total_score: 32
p0_count: 0
p1_count: 2
timestamp: 2026-06-23T08-59-29Z
slug: index-html-hero-section
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Vidéo chargée silencieusement |
| 2 | Match System / Real World | 4 | Langage direct, cohérent marque |
| 3 | User Control and Freedom | 3 | 2 CTAs clairs |
| 4 | Consistency and Standards | 4 | Typographie + boutons cohérents |
| 5 | Error Prevention | 4 | N/A |
| 6 | Recognition Rather Than Recall | 4 | Tout visible |
| 7 | Flexibility and Efficiency | 2 | Aucun raccourci |
| 8 | Aesthetic and Minimalist Design | 3 | Badge ajoute du bruit |
| 9 | Error Recovery | 3 | N/A |
| 10 | Help and Documentation | 2 | N/A landing |
| **Total** | | **32/40** | **Good** |

## Anti-Patterns Verdict
Pas d'AI-slop. Détecteur : [] clean. Violation ban absolu : hero-badge = uppercase sur deux phrases entières à 11px.

## Overall Impression
Hero fort visuellement. Deux problèmes : description trop grise (borderline WCAG AA), badge quasi-illisible (11px uppercase, opacity 0.52).

## What's Working
1. H1 staircase taille+poids — hiérarchie propre
2. CTAs bien différenciés — orange primary vs outlined secondary
3. Overlay gradient — fonctionne avec la vidéo actuelle

## Priority Issues

**[P1] Description trop grise** — color-text-secondary (#A8A8A8) contre fond dark vidéo = ~3.7:1, sous WCAG AA. Fix: rgba(255,255,255,0.82).

**[P1] Badge all-caps illisible** — 11px, uppercase, rgba(255,255,255,0.52) = ~2.5:1. Deux phrases entières en ALL-CAPS = ban absolu. Fix: supprimer ou convertir en texte normal 13-14px.

**[P2] Overlay fragile** — rgba(238,68,8,.04) à 70% = quasi-transparent. Fonctionne avec la vidéo sombre actuelle. Fix: text-shadow sur .hero-title comme filet.

**[P3] Weight 600 vs 700** — différence imperceptible. Taille déjà fait le travail. Fix optionnel: passer à 500.

## Persona Red Flags
- Jordan: badge 11px ignoré, description perçue comme secondaire
- Casey: badge 0% lisible mobile, description problématique sur écrans dim

## Minor Observations
- hero-blur-outer référencé mais pas de style visible
- Scroll indicator opacity 0.22-0.5 quasi-invisible
