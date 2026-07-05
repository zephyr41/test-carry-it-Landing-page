---
target: KPI card
total_score: 28
p0_count: 0
p1_count: 2
timestamp: 2026-07-05T20-20-48Z
slug: ryit-design-system-da-system-preview-kpi-card-html
---
# Critique SÉVÈRE — KPI card (2026-07-05, run 2)
DEGRADED single-context. Détecteur 0. Nielsen 28/40 (baisse 29→28).

## P1
- Barre overshoot se lit SOUS-remplie : effort dépassé 340% paraît moins avancé que résultat 33% (fade lu comme "reste à faire"). Régression du fix précédent. → barre pleine + tick seuil, ou pas de barre en dépassement.
- Deux barres deux échelles sans label (effort 0→valeur, résultat 0→seuil). Non interprétable.

## P2
- Cibles tactiles 24px (bouton Ajouter, crayon) → échec WCAG 2.5.5 (hit 44px requis).
- aria-valuenow=100 faux (réel 340%). Manque aria-valuetext.
- Résultat (la preuve) sans aucun signal de statut alors que l'effort a une pill → l'ADN dit l'inverse.

## P3
- Void carte vide effort (copy 1 ligne + réserve 2 lignes).
- Triple-encodage dépassement (cible + pill + barre).

## Strengths
Monochrome discipliné, hiérarchie valeur, rythme groupé, hauteurs égales, états vides pédagogiques, contraste AA, token-driven.
