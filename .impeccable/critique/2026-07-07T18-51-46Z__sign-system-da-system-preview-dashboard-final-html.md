---
target: vue long terme du dashboard (dashboard-final.html) — 2e passe post-fix chart
total_score: 29
p0_count: 0
p1_count: 1
timestamp: 2026-07-07T18-51-46Z
slug: sign-system-da-system-preview-dashboard-final-html
---
Method: dual-agent (A: design review · B: detector + browser evidence)

# Critique #2 — Vue long terme (dashboard-final.html)

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Fraîcheur + tab actif + stepper 2/5 forts ; "Synchroniser" sans last-sync |
| 2 | Match System / Real World | 3 ↑ | Chart désormais cohérent avec hero (128) + échelle sur jalon 300 (fix, +1) ; ligne cible 300 non labellisée + step "1000" casse le registre |
| 3 | User Control & Freedom | 3 | Tabs, sélecteur projet, affordances edit ; vue lecture seule, peu à annuler |
| 4 | Consistency & Standards | 3 | Tokens + un style bouton + monochrome cohérents ; carte jalon sans la bordure visible des cartes 3/4 → flotte |
| 5 | Error Prevention | 3 | Surface d'input minimale (lecture) |
| 6 | Recognition Rather Than Recall | 3 | Tout labellisé sauf la ligne cible pointillée (à mémoriser) |
| 7 | Flexibility & Efficiency | 2 | Pas de raccourci clavier, pas de contrôle de plage chart, pas de drill-in point. Axe le plus faible |
| 8 | Aesthetic & Minimalist | 4 | Retenue premium ; le fix chart a retiré le "demi-vide" |
| 9 | Error Recovery | 2 | Pas d'état erreur/stale/vide exercé dans cette vue |
| 10 | Help & Documentation | 2 | Pas de légende/tooltip pour la ligne cible ni le dégradé |
| **Total** | | **29/40** | **Good — hausse portée par le fix chart** |

## Anti-Patterns Verdict
**Pas de slop, discipliné.** Détecteur **0 finding**, console **0 erreur/0 warning**, aucun overflow. Bans : side-stripe NONE, gradient text NONE, glassmorphism NONE, hero-metric justifié (ancre de hiérarchie), cartes identiques rompues par le stepper jalon, eyebrows au plafond (watch-item, pas violation), numbered markers NONE.

## Overall
Le fix data a fait exactement ce qu'il devait : **Match #2 +1** et **Aesthetic maintenu à 4** (plus de demi-vide). Le reste du plafond est sur des axes que le chart ne touche pas (Flexibility, Recovery, Help). Passe 28 → 29.

## What's Working
1. **Le fix chart est bon, pas juste rafistolé.** Ancrer l'axe/cible sur le prochain jalon (300) au lieu du 1000 final transforme le vide en "distance au prochain palier" — sert la thèse temps-long au lieu de la contredire.
2. **Preuve honnête multi-angle.** L'écran répond "est-ce que j'avance ?" de 3 façons (KPI objectif / process jalon / sous-KPI atteint) sans un seul cliché motivationnel. C'est "les bonnes cases à cocher vs streak vide" rendu en UI.
3. **Discipline monochrome chirurgicale.** Une carte inversée porte toute la hiérarchie ; le reste plat, gris tokenisés (AA vérifié). Premium, non-gamifié.

## Priority Issues

**[P1] Ligne cible du chart non labellisée + concurrence le 1000 du hero.**
- Ligne pointillée à 300 sans titre/label ; le hero ancre sur /1000. Deux cibles, un écran, aucune hiérarchie entre elles.
- Fix : labelliser la ligne — ex "Prochain jalon · 300" aligné à droite. Un `title`/label → convertit l'ambiguïté en le message honnête voulu. Aussi visible pour l'AT.

**[P2] Registre du stepper incohérent.**
- Étapes : cadrage / POC / MVP / Lancement / **1000**. Quatre noms de phase puis un nombre brut → lit comme une erreur de données.
- Fix : nommer la dernière étape (ex "Scale"/"Objectif"), laisser le nombre sur le hero.

**[P3] La carte jalon (2) flotte.**
- Manque la bordure/fill visible des cartes 3/4 → paraît non ancrée dans une grille qui lit sinon comme un système.
- Fix : appliquer le même token de bordure carte.

**[P3] "Synchroniser" sans état.**
- Pas de last-sync ni statut. Fix : "Synchronisé il y a Xm" ou un point d'état.

## Persona Red Flags
**Alex (power user) :** pas de raccourcis, pas de switch de plage chart, pas de drill-in point persistant. Seule action chart = "Ajouter une mesure". Vue compréhension seule.
**Sam (a11y) :** mieux qu'attendu — tokens passent AA (secondaire ≈ 7.9:1, muted ≈ 5.8:1) ; boutons icônes ont aria-label. Gaps : (a) chart = un seul aria-label, **pas de table/alternative texte** → lecteur d'écran n'a aucun chiffre ; (b) ligne cible invisible à l'AT ; (c) vérifier focus visible sur tabs/stepper.
**Builder long-terme :** bien servi (stepper jalon = charge émotionnelle). Red flag : "872 restants" mène par le déficit, zéro contexte de rythme/temps. La marque dit "ton mois 7 à zéro est normal" — le dashboard énonce l'écart mais ne le recadre jamais contre un rythme attendu. Signal "X mois · dans les temps" manquant.

## Minor
- Chart ~60% blanc au premier regard (défendable ; le label P1 le fait basculer de "sparse" à "distance honnête").
- Densité eyebrow au plafond — OK maintenant, mais un bloc de plus = slop.
- Boutons subtle cohérents (Ajouter mesure / Modifier / Synchroniser).

## Questions
1. Deux cibles sur un écran — hero /1000 et chart /300. Lequel l'utilisateur doit-il *ressentir* ? Sans hiérarchie explicite, la clarté "LE objectif" du hero se dilue-t-elle dès que l'œil touche le chart ?
2. Cette vue = preuve neutre : elle montre les écarts mais ne dit jamais "tu es en retard" ni "tu es dans les temps". Pour une marque dont l'edge est la *vérité dure*, le neutre-par-omission est-il une forme douce de consolation ?
3. "872 restants" — preuve de *progrès* ou preuve de *distance restante* ? Mener par le déficit est honnête, mais est-ce l'honnêteté qui garde un homme au mois 7 dans le game, ou celle qui le pousse dehors ?
