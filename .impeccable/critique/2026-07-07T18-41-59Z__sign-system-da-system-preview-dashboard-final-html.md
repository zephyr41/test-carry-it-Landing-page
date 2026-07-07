---
target: vue long terme du dashboard (dashboard-final.html)
total_score: 28
p0_count: 0
p1_count: 1
timestamp: 2026-07-07T18-41-59Z
slug: sign-system-da-system-preview-dashboard-final-html
---
Method: dual-agent (A: design review · B: detector + browser evidence)

# Critique — Vue long terme (dashboard-final.html)

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Freshness + jalon 2/5 bons ; "Synchroniser" sans état/last-sync ; chart sans marqueur valeur courante |
| 2 | Match System / Real World | 3 | Langage SMART/jalon/restants naturel ; mais chart (~45) contredit le hero (128) |
| 3 | User Control & Freedom | 3 | Voir plus réversible, tabs propres ; vue surtout lecture seule |
| 4 | Consistency & Standards | 3 | Token discipline excellente ; mais 2 eyebrows pour le même KPI ("KPI de l'objectif" vs "KPI global") |
| 5 | Error Prevention | 3 | Pas d'action destructive dans cette vue |
| 6 | Recognition Rather Than Recall | 4 | Tout à l'écran : stepper, lettres SMART, fraîcheur, cibles |
| 7 | Flexibility & Efficiency | 2 | Pas de drill-in carte, pas de raccourci ; cartes KPI inertes |
| 8 | Aesthetic & Minimalist | 3 | Très propre ; plombé par la zone morte du chart + nom KPI répété 3× |
| 9 | Error Recovery | 2 | Pas d'état erreur/vide/stale exercé dans cette vue |
| 10 | Help & Documentation | 2 | SMART auto-documenté ; sinon pas de tooltip/hint |
| **Total** | | **28/40** | **Good — ship-worthy avec fixes ciblés** |

## Anti-Patterns Verdict — ça a l'air fait par IA ?

**Non, et c'est mérité.** Monochrome assumé, une font, tokens, hero inversé blanc, "872 restants" brutal honnête, structures domaine (SMART + stepper jalon) qu'un générateur ne produit pas. Échappe au SaaS bleu/violet générique.

**Détecteur (impeccable detect.mjs) : 0 finding. Console : 0 erreur / 0 warning. Aucun overflow.**

Bans absolus : side-stripe NONE · gradient text NONE · glassmorphism NONE · hero-metric PARTIEL (mais tuile fonctionnelle, pas vanité) · cartes identiques PARTIEL (rompu par hero blanc + stepper jalon) · **eyebrows uppercase sur CHAQUE bloc = OUI** (seul vrai tic) · numbered markers NONE.

## Overall
Design premium, discipliné, on-brand. Le vrai problème n'est PAS cosmétique — c'est **le chart** (données incohérentes + demi-vide) et la **redondance** (nom KPI 3×, 6 eyebrows). La critique externe visait des faux problèmes ; les vrais sont ailleurs.

## What's Working
1. **Hiérarchie monochrome + hero inversé** : une carte blanche dans un champ noir fait tout le "regarde ici" sans couleur/gradient/badge. Move le plus fort de la page.
2. **"872 restants" + stamps de fraîcheur** = l'honnêteté de la marque encodée dans la donnée, pas dans le copy. Voix "lucide, exigeante" exprimée structurellement.
3. **Variété structurelle dans une grille rigide** : la carte jalon (stepper) casse le moule KPI → la rangée ne lit jamais comme un composant répété paresseux.

## Priority Issues

**[P1] Le chart contredit son propre KPI et paraît demi-vide.**
- Hero = 128 courant ; le chart du même KPI finit ~45 sur un axe 0–120 (60% du haut mort). Chiffres irréconciliables + graphe qui paraît triste/vide.
- Pourquoi : la promesse produit = preuve honnête et *fiable*. Une contradiction de donnée visible tue la confiance pour ce persona ; le haut vide lit "tu bouges à peine".
- Fix : réconcilier la série sur la valeur courante (finir à 128, ou hero = dernier point du chart). Échelle Y sur la donnée/jalon, pas un 120 arbitraire. Ligne de référence cible → l'espace vide devient "distance à 1000" au lieu de blanc.

**[P2] Le KPI objectif est nommé 3×.**
- "Nombre de clients payants" sur hero + titre chart + SMART Mesurable ; + 2 eyebrows différents pour le même métrique.
- Fix : le hero possède le nom ; titre chart → verbe/période ("Progression — 6 derniers mois"). Unifier le vocabulaire eyebrow.

**[P2] Cartes KPI inertes ; pas de drill-in.**
- Cartes 1/3/4 = data riche mais aucune affordance d'action (ouvrir, éditer, historique). Seuls chart + SMART ont des boutons.
- Fix : cartes cliquables avec hover clair (le DS flippe déjà la bordure au :hover), ou row-action subtile cohérente avec ds-button--subtle.

**[P3] Eyebrow uppercase sur littéralement chaque bloc.** Garde-les où ils désambiguïsent (EFFORT/RÉSULTAT), retire-les où le contenu s'auto-identifie (titre chart, SMART). Moins d'eyebrows = les restants portent plus.

**[P3] "Synchroniser" sans état.** Pas de last-sync, pas de loading/synced. Ajouter "Synchronisé il y a Xmin" + état spinner/check.

## Persona Red Flags

**Alex (power user) :** cartes KPI = culs-de-sac lecture seule, pas de drill-in/edit/clavier ; pas de last-sync visible (numéros peut-être stale ?) ; seule interaction du bas = l'accordéon SMART.

**Sam (accessibilité) :** **Chart non accessible** — un seul aria-label, pas de table de données → lecteur d'écran n'a que le titre. Plus gros gap a11y. Contraste : muted gris = `rgba(255,253,246,0.54)` ≈ **5.4–6.0:1** → passe AA (normal + petit), mais c'est le plancher, utilisé sur petits labels. Monochrome = bon pour daltoniens (jamais couleur seule). Vérifier les focus rings sur `role="tab"` + actions carte.

**Le builder long-terme (persona projet) :** **bien servi par le cadre** (872 restants, fraîcheur, deadline dure, zéro gamification). **Trahi par le chart** (demi-vide + 128 vs 45 = le moment exact où il pense "data foireuse" ou "j'ai à peine bougé"). Manque : un signal que ses mois lents sont *normaux* (thèse produit "ton mois 7 à zéro est normal") — le dashboard montre les chiffres mais ne contextualise jamais le rythme contre la timeline.

## Minor
- Grosse bande noire vide sous la rangée du bas au desktop (layout single-fold).
- Baselines valeurs : "128" (hero) légèrement plus bas que "5"/"3" — micro-désalignement optique.
- Justifications SMART A/R = seuls blocs de prose sur une page data-terse, "s'affaissent" visuellement.
- Stepper jalon : dernier nœud "1000" mêle noms de phase + un nombre (labeling incohérent).

## Questions
1. Si la thèse produit = "les mois lents sont normaux", pourquoi le chart fait paraître la lenteur comme un échec (haut vide, ligne molle) ? Le job du chart devrait-il être de *recadrer* le rythme contre la timeline 22 mois plutôt que tracer des counts bruts ?
2. 6 eyebrows uppercase + 1 carte blanche font la hiérarchie. Si tu supprimais TOUS les eyebrows, quelqu'un serait-il perdu — ou la page deviendrait plus calme et *plus* premium ?
3. Design tasteful et calme. Voix marque = "directe, lucide, exigeante". Où sur cet écran le produit *exige*-t-il quelque chose de l'utilisateur, au lieu de lui rapporter poliment ?
