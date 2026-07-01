---
target: CarryIT Design System/preview/buttons.html
total_score: 25
p0_count: 0
p1_count: 1
p2_count: 3
timestamp: 2026-07-01T07-34-09Z
slug: carryit-design-system-preview-buttons-html
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Loading + spinner présents. Error state absent. Pas de success state. |
| 2 | Match System / Real World | 3 | Labels concrets ("Supprimer l'objectif"). "Ghost" / "Subtle" sont du jargon système. |
| 3 | User Control and Freedom | 3 | États bien documentés. N/A pour page statique. |
| 4 | Consistency and Standards | 3 | BEM naming cohérent. Secondary affiché en `btn--lg` dans states grid mais md dans size grid. |
| 5 | Error Prevention | 2 | Delete visuellement muted (bien). Mais : zero référence pour l'état bouton après échec API. |
| 6 | Recognition Rather Than Recall | 3 | Labels d'état visibles. Tokens dans size grid. Pas de "quand utiliser ghost vs subtle". |
| 7 | Flexibility and Efficiency | 2 | Icon-only documenté sans états. Pas de full-width variant. Pas de prefers-reduced-motion sur spinner. |
| 8 | Aesthetic and Minimalist Design | 3 | Layout 2-col propre. `variant-desc` (#3a3a3c) en dessous du ratio WCAG. |
| 9 | Error Recovery | 1 | Error state entièrement absent. Développeur sans référence → implémentations incohérentes. |
| 10 | Help and Documentation | 2 | Cas d'usage listés. Pas de hiérarchie décisionnelle (P1>P2>P3) ni "quand NE PAS utiliser". |
| **Total** | | **25/40** | **Acceptable — améliorations significatives avant handoff dev** |

## Anti-Patterns Verdict

**LLM assessment** : Partiellement AI-scaffold. Les choix structurels sont non-génériques : fond #080809, orange #EE4408 comme primary, double-ring focus, delete #C53030 transparent (pas le Tailwind red-400 template). Le framework de preview (Courier New pour labels, monospace pour metadata) lit intentionnel. Là où ça bascule : Secondary (#F2F1EC blanc/crème) lit "bouton neutre par défaut" plutôt qu'une décision CarryIT — c'est le move scaffold safe. Ghost et Subtle sont visuellement indiscernables à premier regard : une failure de composition qu'un design director humain trancherait immédiatement.

**Deterministic scan** : Exit code 2, 3 warnings.
- `overused-font` (Inter, ligne 5) → **faux positif**. Choix délibéré du DS, pas une sélection par défaut IA.
- `flat-type-hierarchy` (8/9/10px labels, ratio 1.3:1) → **faux positif partiel**. Ce sont des meta-labels de preview (`.lbl`, `.live-hint`), pas des niveaux typographiques hiérarchiques.
- `em-dash-overuse` (7 tirets cadratin `—`) → **valide**. Présents dans `.variant-desc` et `.lbl`. Doivent être remplacés par des points médians `·` ou tirets courts.

Aucun gradient-text, glassmorphism, hero-metric, eyebrow numéroté, ni side-stripe border détecté.

**Pas d'overlay browser** — target est un fichier local, scan CLI suffisant.

## Overall Impression

La discipline structurelle est en place : imports CSS corrects, zéro redéfinition inline, tokens alignés. C'est le bon fond. Mais le contenu du DS lui-même a des lacunes critiques : l'error state manque complètement, Ghost et Subtle sont trop proches pour être utiles comme variants distincts, et les labels de contraste échouent WCAG. Un développeur qui lirait ce fichier aujourd'hui pour implémenter les boutons produirait des interfaces incohérentes sur les états d'erreur.

## What's Working

1. **Alignement tokens correct.** Import depuis `components.css`, zéro inline style. La structure discipline est là — chaque bouton reflète réellement le système.
2. **Focus ring double-anneau.** `2px solid bg + 4px rgba accent` est la bonne décision pour surfaces sombres. Lisible contre fond et contre la couleur du bouton. Plus nuancé que le single-ring par défaut.
3. **Delete variant.** `#C53030` transparent + border subtile lit comme une décision considérée, pas un "danger template". Brand-approprié pour un produit direct sans drama.

## Priority Issues

**[P1] Error state entièrement absent**
- Why it matters: Développeurs implémentant des actions async (save, delete, calls API) n'ont aucune référence. Ils inventeront chacun leur version. Incohérence garantie en prod.
- Fix: Ajouter `error` state pour Primary et Secondary minimum. Error = base color + `box-shadow: 0 0 0 2px rgba(197,48,48,0.7)` outer ring. Pour Delete, documenter que son default state IS déjà l'état visuel d'alerte.
- Suggested command: `/impeccable harden`

**[P2] Ghost vs Subtle visuellement indiscernables en default**
- Ghost default: transparent + border rgba(0.15) → quasi-invisible
- Subtle default: fill rgba(0.07) → quasi-invisible aussi
- Why it matters: Si un développeur ne peut pas les différencier au premier regard, ils les utilisent de manière interchangeable. Collapse de l'intention en production.
- Fix: Monter Ghost à border rgba(0.22) minimum. Ou supprimer Subtle et l'absorber dans Ghost. Décision à prendre.
- Suggested command: `/impeccable distill`

**[P2] `variant-desc` text (#3a3a3c sur #080809) : ratio ≈ 2.0:1 — WCAG fail**
- Why it matters: Les règles d'usage (le contenu le plus important du DS) sont illisibles sur moniteur calibré en conditions lumineuses. Confirmé par détecteur.
- Fix: Passer à `#6b6b6b` minimum (11px body ≈ 3.8:1) ou `#808080` (≈ 4.1:1 en bold 9px). Mieux : monter à 11px + #5e5e5e.
- Suggested command: `/impeccable audit`

**[P2] Secondary affiché en `btn--lg` dans states grid, `btn` (md) dans size grid**
- La usage desc dit "taille lg" mais la size grid montre Secondary en sm/md/lg. Contradiction que chaque développeur résoudra différemment.
- Fix: Soit retirer Secondary du sm dans la size grid, soit réviser la règle en "lg recommandé, md acceptable".
- Suggested command: `/impeccable clarify`

**[P3] Icon-only sans états documentés**
- Only loading visible via snap class. Hover/focus/active/disabled non montrés pour icon-only.
- Why it matters: Icon-only est utilisé constamment en dashboard (+ add, ⋯ menu, ✕ close). Sans référence → implémentations divergentes.
- Fix: Ajouter une strip états horizontale pour icon-only (default / hover / focus / disabled), 3 tailles.
- Suggested command: `/impeccable harden`

## Persona Red Flags

**Riley (Stress Tester)** — cherche ce qui casse :
- Cherche l'error state → introuvable. Filerait un bug "missing from design system"
- Clique "Live" button rapidement → aucun état loading live (seulement dans la grid statique). Pattern double-submit sans démo
- Regarde icon-only sm (32px) → sous Apple 44pt touch target, aucune documentation disant "desktop uniquement"

**Sam (Accessibility)** — tab through :
- Tab dans les snap-state buttons (pointer-events none) → pas de `tabindex="-1"` ni `aria-disabled` → screen reader annonce "Sauvegarder, button", utilisateur tente de cliquer, rien. Confusing.
- `.variant-desc` à #3a3a3c : ratio 2.0:1 → illisible pour low vision
- `.lbl` à #545454 sur #080809 ≈ 3.2:1, sous le seuil 4.5:1 pour texte non-gras

**Alex (Power User)** qui implémente :
- Pas de "ghost vs subtle" decision tree → les utilisera de manière interchangeable ou demandera à l'équipe
- Pas de full-width button pattern → inventera sa propre version pour les flows onboarding
- Error state absent → implémentera sa propre version

## Minor Observations

- `class="div"` sur les dividers : collision de nommage. Utiliser `ds-divider` (déjà dans `components.css`)
- "← hover · focus · click" en anglais sur une page en français
- Icon-only utilise des caractères unicode (✓ ✕ ⚙ ⋯) pas des SVGs. Doivent noter dans le DS que l'implémentation utilise une icon library
- Spinner sans `@media (prefers-reduced-motion)` : tourne indéfiniment même pour les utilisateurs qui l'ont désactivé
- Em-dashes `—` (7 occurrences) → remplacer par `·` (points médians) conformément aux règles impeccable

## Questions to Consider

1. "Ghost et Subtle coexistent dans le DS — mais dans CarryIT, y a-t-il vraiment un troisième niveau d'action tertiaire distinct du secondaire ? Ou peut-on en supprimer un ?"
2. "Le Secondary blanc/crème sur fond très sombre — est-ce qu'un utilisateur qui cherche une preuve de progression va associer ce bouton à une action importante ? Ou ça lit comme un bouton presque-désactivé ?"
3. "L'error state est P1 — mais est-ce qu'on dit que Delete est l'état visuel d'alerte et qu'un bouton en soi n'a pas d'état d'erreur propre ?"
