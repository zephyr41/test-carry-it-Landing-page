# Design System — CarryIT

Construit brique par brique, validé avec Nils avant chaque avancée. Rien n'est figé tant que ce n'est pas confirmé ici.

## 1. Contexte produit

* **Nom** : CarryIT
* **Type** : outil de suivi d'exécution pour objectifs ambitieux long terme (jalons + KPI) — pas un habit tracker, pas un Notion générique.
* **Plateforme** : Web responsive.
* **Cible** : ICP2 LP (`copywriting/icp2_lp.md`) — high achiever solo, bosse dur, sans preuve qu'il avance, refuse le réconfort creux, veut des faits.
* **Cas d'usage principal** : voir si on avance réellement sur son objectif, même quand les résultats sont encore à zéro.
* **Niveau de maturité** : MVP.
* **Stack front-end actuelle** : vanilla HTML/CSS/JS.
* **Stack front-end cible (migration prévue)** : Vue.js 3 (TypeScript) + Capacitor (mobile) + ASP.NET Core/.NET 9 (backend) + PostgreSQL 18. → les tokens doivent rester portables (CSS variables natives), pas de dépendance à un framework CSS.
* **Contraintes actuelles** : solo dev, pas de designer dédié.
* **Ton de marque** : on a la dalle, on se dépasse là où personne ne veut aller, obsédé — radicalité tournée vers SOI-MÊME (auto-exigence, pas comparaison/jugement des autres — posture de fond, jamais affichée en copy).
* **Positionnement** : Les plus grandes ambitions prennent des années. Carry It structure tes ambitions en objectifs clairs et mesurables pour voir ta progression réelle, en reliant tes objectifs long terme, tes étapes majeures, ta progression réelle et l'exécution au même endroit.
* **Problèmes UI actuels** : incohérence de tokens entre écrans (dashboard/jalons/objectif) + densité/lisibilité des cartes KPI à revoir.
* **Références visuelles** : screenshots de la LP existante (hero cinématique photo desaturée bleu froid/orange chaud, overlay noir dégradé, nav minimale wordmark seul, titre gros sans-serif mix regular/bold 2 lignes, CTA plein orange + contour neutre, dashboard jalons = cartes sombres + timeline verticale à points, section manifeste finale fond quasi-noir/brun avec eyebrow orange uppercase). Référence d'esprit visuel uniquement — aucune valeur CSS existante (tokens actuels) reprise, on repart de zéro sur les valeurs.

## 2. Analyse préalable

### Q1 — Besoin utilisateur principal
Voir sa **position réelle** ET si cette position **évolue dans le temps** — pas juste un chiffre figé. Distinction cœur : **Position** (où j'en suis maintenant) vs **Dynamique** (est-ce que ça bouge réellement).

### Q2 — Quelle information visible en premier
La position actuelle : objectif SMART, KPI principal, valeur actuelle vs valeur cible, jalon actif + critère de validation + résultat actuel du jalon. = vue "Où est-ce que j'en suis ?".

### Architecture produit associée (verrouillée par Nils — réutilisée en Patterns/Templates plus tard)

**Structure globale du dashboard** : divulgation progressive + pyramide inversée. 3 vues distinctes (top-rail nav), pour forcer le focus et éviter la surcharge cognitive (data-ink ratio) :
1. **Vision** — niveau long terme
2. **Jalons** — niveau moyen terme
3. **Exécution** — action quotidienne

**Vue 1 — Où est-ce que j'en suis ?** (position)
- objectif long terme (SMART)
- KPI principal de l'objectif (mesurable du SMART)
- valeur actuelle de l'objectif SMART
- valeur cible de l'objectif SMART (seuil à atteindre)
- position dans les jalons (passé / actif / futur)
- critère de validation du jalon actif
- résultat actuel du jalon actif
- résultat de l'effort du jalon actif

**Vue 2 — Est-ce que j'avance réellement ?** (dynamique)
Croise 4 données : résultat (augmente ou pas), effort réel (ce qui est fait), temps réel investi, temps calendaire écoulé.
- Résultat stagne + temps réel investi faible → problème = manque d'exécution réelle.
- Résultat stagne + temps réel investi élevé → problème = méthode/type d'effort/KPI/difficulté du jalon à analyser.
- Le diagnostic doit être visible visuellement, jamais écrit noir sur blanc.

**Règle de conception (Position vs Dynamique) :**
- KPI actuel = position.
- Évolution du KPI = dynamique.
- Critère de validation du jalon actif = ce qu'il faut atteindre.
- Résultat actuel du jalon actif = où l'utilisateur se situe par rapport à ce critère.
- Évolution du résultat du jalon actif = est-ce qu'il avance réellement.

**Vue 3 — Exécution**
- Modèle d'état des tâches : À faire / En cours / Terminé.
- Bascule d'affichage : liste "To-Do" (binaire) ↔ tableau "Kanban" (flux).

### Q3 — Niveau de densité d'information adapté
Chaque vue (Vision / Jalons / Exécution) tient sur **un seul écran, zéro scroll, sur desktop**. La densité totale est répartie entre les 3 onglets plutôt qu'empilée sur un seul écran. Sur mobile, scroll accepté (contrainte d'écran).

### Q4 — Risques UI/UX à éviter
Trop d'info affichée, mauvaise hiérarchie, trop de métriques montrées en même temps. Règle : le plus simple possible, zéro bullshit — si une métrique/élément n'aide pas à lire position/dynamique, il sort.

### Q5 — Logique visuelle du système
Le DA system couvre LP + produit (dashboard/formulaires), fondations partagées (tokens, ton, contraste), mais objectif d'écran différent :
- **LP** : logique déclarative/manifeste — on expose une philosophie/vérité, on ne cherche pas à convaincre. Si ça résonne, tant mieux ; sinon, tant pis aussi. Zéro posture vendeuse/argumentaire.
- **Produit** : logique data-first — chaque écran répond d'abord à "position vs dynamique", zéro bullshit, hiérarchie stricte.

### Q6 — Décisions à figer avant les composants
- Palette (bg/surface/accent), échelle typo, échelle spacing.
- Règle produit "1 écran = 1 vue = zéro scroll desktop".
- **Rien ne doit ressembler à un design généré par IA** (pas de gradients/glassmorphism/icônes génériques par défaut).
- Respect des normes d'accessibilité WCAG (contraste, focus, tailles cliquables).
- **Pas de vert/rouge sémantique sur les métriques** pour dire bien/pas bien — couleur neutre pour l'instant (pas de jugement de valeur visuel sur la donnée).

## 3. Principes de design

### Principe 1 — Preuve avant décoration

**Objectif :** chaque élément à l'écran doit aider à lire la position ou la dynamique réelle de l'utilisateur.

**Règle d'application :** avant d'ajouter un élément visuel, demander "qu'est-ce que ça prouve ou aide à lire ?". Pas de réponse claire → on le retire. Icônes et animations restent autorisées si elles servent la lecture.

**Exemple concret :** sur la vue "Où j'en suis", le jalon actif affiche son critère de validation + résultat actuel — pas de mascotte, pas de séquence de célébration.

**Erreur à éviter :** gamification bullshit — félicitations exagérées, couleurs criardes/vives en récompense, confettis. Ce n'est pas l'icône ou l'animation le problème, c'est la fausse célébration.

### Principe 2 — Un seul accent, un seul sens

**Objectif :** la couleur d'accent (orange) reste réservée à l'action/l'urgence, jamais à la décoration ni à l'emphase d'un élément important.

**Règle d'application :** un accent orange = CTA ou action requise, point. Pour mettre en valeur un élément principal (ex : le KPI), on passe par taille/poids/contraste — jamais par la couleur, pour ne pas diluer le sens de l'orange.

**Exemple concret :** bouton "Structurer mon ambition" en orange plein ; bouton secondaire "Voir le système" en contour neutre ; le KPI principal se distingue par sa taille (36px/w800), pas par une couleur d'accent.

**Erreur à éviter :** utiliser l'orange pour souligner un titre, une icône déco, ou un fond de carte sans fonction d'action réelle.

### Principe 3 — Contraste fonctionnel, pas cosmétique

**Objectif :** le contraste sert à hiérarchiser l'importance réelle des données (KPI > jalon actif > reste), pas à faire "joli".

**Règle d'application :** un élément plus contrasté = plus important à lire. Vérifier que la hiérarchie visuelle suit la hiérarchie réelle (position > dynamique > détails).

**Exemple concret :** le KPI principal en fort contraste (blanc cassé sur noir, gros/bold) ; une métadonnée (date, label secondaire) en gris discret.

**Erreur à éviter :** un élément secondaire mis en fort contraste juste parce que "ça ressort bien" visuellement.

### Principe 4 — Zéro bullshit visuel

**Objectif :** rien à l'écran ne doit ressembler à du remplissage générique (gradients gratuits, glassmorphism, icônes stock) — chaque forme a une raison d'être.

**Règle d'application :** avant de garder un style visuel, vérifier qu'il vient d'une décision du système (token), pas d'un réflexe "ça fait propre/moderne".

**Exemple concret :** surfaces plates à 1-2 niveaux (fond/carte), pas de dégradé décoratif sur les cartes.

**Erreur à éviter :** un design qui ressemble à un template IA générique — glassmorphism, ombres colorées, icônes 3D.

### Principe 5 — Densité maîtrisée, zéro scroll (produit)

**Objectif :** chaque vue produit (Vision/Jalons/Exécution) tient sur un écran desktop, sans scroll — la densité sert la lecture rapide.

**Règle d'application :** prioriser la compacité verticale sur les vues produit. L'espacement sépare des blocs de sens différents, jamais gratuit.

**Exemple concret :** la vue "Où j'en suis" affiche objectif + KPI + jalon actif + critère de validation sans dépasser la hauteur d'écran desktop standard.

**Erreur à éviter :** aérer une carte par convention visuelle alors que ça pousse une info utile hors écran (mobile excepté).

### Principe 6 — Accessibilité non-négociable

**Objectif :** le système respecte WCAG AA par défaut, pas en correction après coup.

**Règle d'application :** tout token de couleur est vérifié en contraste avant d'être ajouté au système. Focus visible, navigation clavier et tailles cliquables sont posés dès les composants de base, pas ajoutés plus tard.

**Exemple concret :** un token de texte secondaire sur fond noir est validé AA avant d'entrer dans la palette (cf. le fix `#71717a → #878792` déjà fait sur l'ancien système).

**Erreur à éviter :** traiter l'accessibilité comme une passe de QA finale plutôt qu'une contrainte de conception dès le départ.

### Principe 7 — Cohérence système, zéro valeur en dur

**Objectif :** toute valeur visuelle vient d'un token ou d'une classe réutilisable — jamais d'un style inline ou d'une valeur one-off.

**Règle d'application :** style inline interdit. Uniquement des classes réutilisables et cohérentes, définies au niveau du système. Si un besoin n'a pas de classe/token existant, on l'ajoute au système — jamais en local dans un fichier composant/écran.

**Exemple concret :** un `padding` de carte vient de `--space-*`, jamais d'un `style="padding: 18px"` écrit à la volée.

**Erreur à éviter :** style inline, valeur hex/px isolée qui n'existe nulle part ailleurs dans le système — ça casse la portabilité vers Vue.js prévue.

## 4. Fondations visuelles

### 4.1 Couleur

**Contrainte ajoutée (soleil/écrans non-retina) :** le produit doit rester lisible dehors et sur écran bas de gamme. Deux mesures cumulées : (1) écarts de fond plus marqués qu'un dark theme standard, (2) border obligatoire sur toute limite fonctionnelle — jamais de distinction reposant sur le fond seul.

**Couleurs des cartes (verrouillées) :**

| Token | Valeur | Usage |
|---|---|---|
| `color.background` | `#0A0A0B` | fond de page de base |
| `color.surface` | `#161617` | **toute** carte / panneau / modal / dropdown / tooltip — un seul niveau |
| `color.surface.raised` | `#262628` | champs de formulaire (Input/Textarea/Select) — besoin réel identifié en cours de build : les champs se fondaient dans leur carte parente (même fond que `color.surface`), aucune limite visible autre qu'une bordure très faible. Ajouté après ce constat, pas prévu au départ. |

`surface.muted` retiré : pas de token sans cas d'usage réel identifié (Principe 7). Élévation d'un modal/tooltip = `shadow`, généralement combiné à `border.subtle` (voir composant Modal — `border.strong` a été essayé en premier car plus proche du principe "limite fonctionnelle = contraste fort", mais jugé visuellement trop dur après test réel ; `border.subtle` + `shadow-lg` suffisent car le `shadow` porte déjà l'élévation).

Preview : `preview/colors-neutrals.html`

**Texte (valeurs réelles, `tokens.css`) :**

| Token | Valeur | Contraste vs surface / background | Usage |
|---|---|---|---|
| `color.text.primary` | `#FFFDF6` | ≈17.75:1 / ≈19.43:1 (AAA) | texte principal |
| `color.text.secondary` | `#A8A8A8` | ≈7.60:1 / ≈8.32:1 (AA, marge confortable) | labels, meta, légendes |
| `color.text.muted` | `rgba(255,253,246,0.54)` | ≈5.86:1 / ≈6.4:1 vs surface | placeholder / texte désactivé |

**Tension design non résolue (à trancher avec Nils) :** `text.muted` est censé être *volontairement* sous le seuil AA (texte non-actif seulement, jamais un texte lisible réel) — mais à 0.54 d'opacité il ressort à ≈5.86:1, **au-dessus** du seuil AA (4.5:1) et même au-dessus de `text.secondary` de l'ancienne valeur documentée. Il se lit presque aussi bien que `text.secondary`, ce qui dilue la hiérarchie voulue (primary > secondary > muted). Pas corrigé ici — nécessite une décision de contraste volontaire, pas juste une mise à jour de doc.

**Border — width 1px partout, standard Apple HIG/hairline :**

| Token | Valeur | Contraste vs surface | Usage réel |
|---|---|---|---|
| `color.border.subtle` | `rgba(255,255,255,0.07)` | — (décoratif, pas de seuil requis) | séparateur discret (Input, Card par défaut, Modal, Badge, Table) — ne marque jamais seul une limite fonctionnelle |
| `color.border.strong` | `#7A7A80` | ≈4.24:1 (satisfait WCAG 1.4.11) | **Card au hover/focus uniquement.** Plus large à l'origine (Modal, dropdown flottant) — retiré de Modal après retour visuel ("bordure trop dure"), jamais réutilisé ailleurs depuis. Token conservé car Card en dépend, mais son usage réel s'est réduit à un seul composant. |

Preview : `preview/colors-neutrals.html`

**Accent (verrouillé) :**

| Token | Valeur | Usage |
|---|---|---|
| `color.accent.primary` | `#EE4408` | fond bouton primary, seul usage = CTA/action requise (Principe 2) |
| `color.accent.hover` | `#D83A06` | hover du bouton primary |
| `color.accent.active` | `#C83205` | active/pressed du bouton primary |
| `color.accent.primary.border` | `rgba(255,253,246,0.16)` | bordure du bouton primary |

**États sémantiques (verrouillé) :**

| Token | Valeur | Usage |
|---|---|---|
| `color.danger` | `#F87171` | erreur input/textarea/select (bordure + texte message), accent Toast erreur |
| `color.success` | `#4ADE80` | accent Toast succès uniquement — pas utilisé sur les métriques (Q6/Principe 1, pas de vert "bonne perf") |
| `color.warning` | `#FBBF24` | token défini, **pas encore utilisé** par un composant construit |

**Focus (verrouillé) :**

| Token | Valeur | Usage |
|---|---|---|
| `color.focus.border` | `rgba(255,253,246,0.72)` | bordure `border-focus` (1px solid) sur tout élément interactif en `:focus-visible` — jamais de glow/box-shadow (testé, retiré : jugé "trop lourd" par Nils, la bordure seule suffit) |

**Disabled (verrouillé) :**

| Token | Valeur | Usage |
|---|---|---|
| `color.disabled.text` | `rgba(255,253,246,0.24)` | texte d'un champ désactivé |
| `color.disabled.background` | `rgba(255,253,246,0.015)` | fond d'un champ désactivé |
| `color.disabled.border` | `rgba(255,253,246,0.04)` | bordure d'un champ désactivé |

Note : les boutons désactivés n'utilisent PAS ces tokens — ils gardent la couleur de leur variante et appliquent `opacity: 0.3` (`--button-disabled-opacity`). Décision prise après retour Nils : écraser la couleur par un gris générique faisait perdre l'info "quel type d'action c'était" sur un bouton désactivé. Les champs de formulaire (input/select/textarea/checkbox/radio/toggle), eux, utilisent bien les tokens `disabled.*` ci-dessus.

### 4.2 Typographie

**Font principale :** Inter (Google Fonts, poids 400/500/600/700/800 chargés).
**Fallback :** `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
**Letter-spacing :** `0` partout (`--letter-spacing-default`) — pas de tracking custom.

| Token | Taille | Line-height | Weight | Usage |
|---|---|---|---|---|
| `type.display` | 40px (2.5rem) | 48px | 700 (bold) | pas encore utilisé par un composant construit |
| `type.h1` | 28px (1.75rem) | 34px | 700 (bold) | titre de page/section (tous les previews) |
| `type.h2` | 22px (1.375rem) | 28px | 700 (bold) | titre secondaire, ex titre du Modal |
| `type.h3` | 18px (1.125rem) | 24px | 600 (semibold) | pas encore utilisé par un composant construit |
| `type.body-lg` | 16px (1rem) | 24px | 400 (regular) | texte des boutons (`--button-font-size`) |
| `type.body-md` | 14px (0.875rem) | 20px | 400 (regular) | texte des inputs/textarea/select, cellules de Table |
| `type.body-sm` | 13px (0.8125rem) | 18px | 400 (regular) | sous-titre Modal, message Toast, sous-tâches Disclosure |
| `type.label` | 12px (0.75rem) | 16px | 600 (semibold) | label de champ (couleur `text.secondary`) |
| `type.caption` | 12px (0.75rem) | 16px | 400 (regular) | légende, message d'erreur, meta |
| `type.data-value` | 36px (2.25rem) | 36px | 800 (heavy) | pas encore utilisé par un composant construit |
| `type.data-label` | 11px (0.6875rem) | 14px | 700 (bold), uppercase | header de colonne Table, texte Badge |

Pas de règles desktop/mobile différenciées sur l'échelle typo elle-même — la responsivité passe par le spacing/layout (`--space-page-mobile` etc.), pas par des tailles de police qui changent selon le viewport. Aucun composant construit n'a de font-size qui varie en media query.

### 4.3 Espacement

Échelle primitive (`--space-*`) :

| Token | Valeur | Usage observé dans le code | Usage interdit |
|---|---|---|---|
| `space.4` | 4px | gap icône/texte serré (Tabs), padding vertical Badge, écart petit label/champ | jamais en padding de carte |
| `space.8` | 8px | gap Checkbox/Radio label, hauteur Progress bar, taille chevron Select | |
| `space.12` | 12px | gap Button/Checkbox/Radio texte, padding inline Badge, gap Modal footer | |
| `space.16` | 16px | padding cellule Table, padding Toast, marge page mobile | |
| `space.24` | 24px | padding carte standard (`--space-card-padding`), hauteur Toggle | |
| `space.32` | 32px | gap section (`--space-section-gap`), marge page desktop, padding inline bouton lg | |
| `space.48` | 48px | hauteur Input/Select/Textarea de base, hauteur bouton sm/mobile | |
| `space.64` | 64px | hauteur bouton lg | |

Sémantiques :
- `--space-card-padding: var(--space-24)` — padding de toute carte/container.
- `--space-element-gap: var(--space-12)` — gap entre éléments proches dans une même carte.
- `--space-section-gap: var(--space-32)` — gap entre sections/blocs, header de page.
- `--space-page-desktop: var(--space-32)` / `--space-page-mobile: var(--space-16)` — marge de page des previews.

### 4.4 Radius

| Token | Valeur | Usage |
|---|---|---|
| `radius.xs` | 4px | Checkbox (carré), triangle Disclosure |
| `radius.sm` | 6px | Badge, bouton close (Modal/Toast/Disclosure) |
| `radius.md` | 8px | Input/Select/Textarea, Toast, pill segmented Tabs |
| `radius.lg` | 8px (= md actuellement, pas encore différencié) | pas utilisé directement par un composant, réservé |
| `radius.xl` | 12px | Card/Container, Modal, bouton primary/ghost |
| `radius.full` | 9999px | bouton inverse (pill), Checkbox rond, Radio, Toggle, Progress bar |

### 4.5 Borders

Rappel (§4.1) : width 1px partout, `border.subtle` = décoratif (pas de seuil de contraste requis), `border.strong` = limite fonctionnelle (satisfait WCAG 1.4.11, ≈4.24:1 vs surface). `border.focus` (`rgba(255,253,246,0.72)`) suit la même logique que `border.strong` mais dédié à l'état focus.

Usage réel observé : `border-subtle` est le défaut sur quasi tous les composants interactifs au repos (Input, Select, Textarea, Checkbox, Radio, Toggle, Card, Badge, Table cellules). `border-strong` **n'est utilisé nulle part** dans les composants construits à ce jour — la décision Modal (qui devait l'utiliser pour l'élévation) est finalement passée à `border-subtle` + `shadow-lg` après retour Nils ("bordure trop dure/visible"). `border-strong` reste défini mais actuellement orphelin — à surveiller (Principe 7 : token sans usage réel).

### 4.6 Shadows

| Token | Valeur CSS | Usage | Condition |
|---|---|---|---|
| `shadow.none` | `none` | Card/Container par défaut | élévation par bordure + fond, pas d'ombre (Principe 4) |
| `shadow.sm` | `0 4px 12px -4px rgba(0,0,0,0.45)` | Tooltip | élément flottant léger, ombre discrète |
| `shadow.lg` | `0 24px 48px -16px rgba(0,0,0,0.55)` | Modal, Toast | élément flottant au-dessus de contenu arbitraire (pas juste une carte), besoin d'une élévation forte pour se détacher |

Règle d'usage : élévation = `shadow` + `border` (jamais un fond différent, sauf Input/Select/Textarea qui utilisent `--color-surface-raised` pour une raison différente : se détacher visuellement de la carte derrière, pas une histoire d'élévation/superposition). Pour Modal spécifiquement, la version initiale utilisait `border-strong` (règle stricte du doc), changée en `border-subtle` après test visuel réel — le doc suivait la théorie, le rendu réel a tranché autrement.

### 4.7 Motion

| Token | Valeur | Usage |
|---|---|---|
| `motion.duration.fast` | 140ms | transitions par défaut (couleur, bordure, fond) sur presque tous les composants interactifs |
| `motion.duration.base` | 220ms | transition panel (Card hover/focus) |
| `motion.duration.slow` | 360ms | transition view, remplissage Progress bar |
| `motion.ease.out` | `cubic-bezier(0.16, 1, 0.3, 1)` | easing par défaut de toutes les transitions |
| `motion.ease.in.out` | `cubic-bezier(0.4, 0, 0.2, 1)` | défini, pas utilisé dans les transitions sémantiques actuelles (elles utilisent toutes `ease-out`) |

Transitions sémantiques : `--motion-transition-default` (border/background/color, fast), `--motion-transition-panel` (border/background/transform/opacity, base), `--motion-transition-view` (transform/opacity, slow).

**Reduced motion : implémenté globalement (2026-07-02).** Une règle `@media (prefers-reduced-motion: reduce)` dans `tokens.css` (à la racine, hors `:root` principal) réduit `--motion-duration-fast/base/slow` à `1ms`. Comme tous les composants animent via ces 3 primitives (jamais de durée en dur dans un composant), le fallback s'applique automatiquement partout — Button, Input, Modal, Toast, Tooltip, etc. — sans avoir à toucher chaque fichier individuellement.

## 5. Design tokens

Le système utilise 3 niveaux, tous dans `tokens.css` :

**Primitifs** — valeurs brutes, jamais utilisées directement dans un composant. Exemples réels : `--color-neutral-900: #161617`, `--space-24: 24px`, `--radius-xl: 12px`, `--motion-duration-fast: 140ms`.

**Sémantiques** — nomment un rôle, pointent vers un primitif. Exemples réels : `--color-surface: var(--color-neutral-900)`, `--color-danger: var(--color-red-400)`, `--border-subtle: var(--border-width-default) solid var(--color-border-subtle)`.

**Composants** — un token par propriété par composant, pointe vers un sémantique (ou directement un primitif pour les cas non génériques, ex `--modal-max-width: 480px`). Exemples réels : `--input-background: var(--color-surface-raised)`, `--button-primary-background: var(--color-accent-primary)`, `--badge-active-text: var(--color-background)`.

Règle observée dans le code : certains tokens composants pointent vers d'autres tokens composants plutôt que vers un sémantique — ex `--card-background: var(--container-background)` (Card hérite de Container), `--checkbox-background: var(--input-background)` (Checkbox hérite d'Input). C'est volontaire : ça évite de dupliquer une décision de valeur à plusieurs endroits.

Le fichier `tokens.css` complet fait ~350 lignes de tokens + les classes utilitaires `.type-*`. Il n'est pas recopié ici in extenso pour éviter la duplication/désync (déjà le problème qu'on vient de rattraper) — se référer directement au fichier, c'est la source de vérité unique.

## 6. Composants de base

16 composants construits à ce jour. `Disclosure` n'était pas prévu dans le gabarit initial (`00-prompt-design-system.md`) — ajouté pour un besoin réel identifié pendant la construction (déplier/replier des sous-tâches).

### Button

1. **Rôle** : déclencher une action (CTA marketing ou action produit). Seul élément autorisé à porter la couleur d'accent orange (Principe 2).
2. **Anatomie** : élément `<button>` unique, pas de sous-structure (pas d'icône dans la version actuelle sauf composition manuelle).
3. **Variantes** : `.ds-button--primary` (orange plein), `.ds-button--ghost` (contour neutre), `.ds-button--inverse` (blanc plein, pill), `.ds-button--sm` (taille compacte, se combine avec les 3 variantes de couleur).
4. **États** : default, hover (`:hover:not(:disabled)`, translateY -1px sur primary), active, focus-visible (bordure), disabled (`opacity: 0.3`, `pointer-events: none`, couleur de variante conservée). Pas de loading, pas d'error.
5. **Tokens** : `--button-height-lg/sm/mobile`, `--button-padding-inline-lg/sm/mobile`, `--button-radius-default/pill`, `--button-font-size/line-height/weight`, `--button-{primary,ghost,inverse}-{background,text,border}` (+ variantes hover/active), `--button-disabled-opacity`.
6. **Règles d'usage** : orange (`primary`) réservé à UNE seule action par écran/contexte, celle qui est vraiment le CTA. `ghost`/`inverse` pour tout le reste.
7. **Erreurs à éviter** : ne pas mettre deux boutons `primary` côte à côte (dilue le sens de l'orange). Ne pas réécraser la couleur en disabled (testé, rejeté par Nils).
8. **Exemple** :
```html
<button class="ds-button ds-button--primary" type="button">Structurer mon ambition.</button>
<button class="ds-button ds-button--ghost ds-button--sm" type="button">Annuler</button>
```

### Input

1. **Rôle** : saisie de texte court sur une ligne (objectif SMART, titre de tâche, etc.).
2. **Anatomie** : `<input>` natif seul, généralement accompagné d'un `<label class="type-label">` dans un `.input-group` (pas partie du composant lui-même).
3. **Variantes** : aucune variante de forme — `.ds-input--error` est un modifier d'état, pas une variante visuelle distincte.
4. **États** : default, filled (valeur remplie, même style que default), focus-visible, disabled, error (bordure rouge + message externe en `.input-error-msg`). Pas de hover distinct, pas de loading.
5. **Tokens** : `--input-height/padding-inline/radius/font-size/line-height`, `--input-background` (`--color-surface-raised`, se détache de la carte derrière), `--input-text/placeholder/border/border-focus`, `--input-error-border/text`, `--input-disabled-text/background/border`.
6. **Règles d'usage** : le fond `surface-raised` est ce qui distingue un champ interactif d'une carte statique — ne jamais repasser un input en `--color-surface` (testé, illisible/plat, retour Nils).
7. **Erreurs à éviter** : ne pas utiliser `border-strong` par défaut (réservé focus/erreur), ne pas mettre de placeholder qui ressemble à une vraie valeur.
8. **Exemple** :
```html
<label class="type-label" for="x">Objectif SMART</label>
<input id="x" class="ds-input" type="text" placeholder="Atteindre 10k€ MRR d'ici 12 mois">
```

### Textarea

1. **Rôle** : saisie de texte long multi-ligne (critère de validation d'un jalon).
2. **Anatomie** : `<textarea>` natif seul, hérite de la structure `.input-group` d'Input.
3. **Variantes** : `.ds-textarea--error` (modifier d'état, comme Input).
4. **États** : default, filled, focus-visible, disabled (+ `resize: none`), error. Redimensionnable verticalement (`resize: vertical`) sauf en disabled.
5. **Tokens** : hérite intégralement des tokens `--input-*` (background, border, text, etc.) + deux tokens propres : `--textarea-min-height` (`calc(var(--input-height) * 2)`), `--textarea-padding-block`.
6. **Règles d'usage** : toujours redimensionnable verticalement seulement (jamais horizontal, casserait la grille).
7. **Erreurs à éviter** : ne pas fixer une hauteur trop courte pour un critère de jalon (texte souvent long).
8. **Exemple** :
```html
<textarea class="ds-textarea" placeholder="Décris ce qui doit être vrai pour considérer ce jalon atteint."></textarea>
```

### Select

1. **Rôle** : choisir une valeur unique dans une liste fermée (statut de tâche).
2. **Anatomie** : `<select>` natif dans un `.ds-select-wrapper` (le wrapper porte le chevron en `::after`, CSS pur, pas de SVG).
3. **Variantes** : `.ds-select--error` (modifier d'état).
4. **États** : default (placeholder via `<option disabled selected>`), filled, focus-visible, disabled (chevron aussi assombri via `:has()`), error.
5. **Tokens** : hérite des tokens `--input-*` intégralement, pas de token `--select-*` propre à part le chevron qui utilise `--space-8` et `--color-text-secondary` directement.
6. **Règles d'usage** : `color-scheme: dark` + `option { background/color }` obligatoire pour que le popup natif du navigateur ne soit pas blanc/clair (bug identifié et corrigé pendant la construction).
7. **Erreurs à éviter** : ne pas oublier `color-scheme: dark`, le popup casse visuellement sans ça.
8. **Exemple** :
```html
<div class="ds-select-wrapper">
  <select class="ds-select">
    <option value="" disabled selected>Choisir un statut</option>
    <option>À faire</option>
  </select>
</div>
```

### Checkbox

1. **Rôle** : cocher une tâche (To-Do) ou une sous-tâche.
2. **Anatomie** : `<input type="checkbox">` (appearance none) + `<svg>` coche superposée (opacity togglée par `:checked +`), le tout dans un `.ds-checkbox__box` wrapper.
3. **Variantes** : forme carrée par défaut (tâche), `.ds-checkbox__box--round` + `.ds-checkbox__input--round` (sous-tâche, plus petit — 14px vs 16px, taille reprise du composant réel `SUBTASK_ICON` de `dashboard.html`).
4. **États** : default, checked (fond blanc plein, coche visible), focus-visible, disabled, disabled+checked. Pas de hover distinct, pas d'error.
5. **Tokens** : `--checkbox-size/size-round`, `--checkbox-radius/radius-round`, `--checkbox-background/border` (hérite d'Input), `--checkbox-checked-background/border`, `--checkbox-mark-color/mark-stroke-width`.
6. **Règles d'usage** : coche = SVG dessiné (pas de caractère Unicode/emoji), stroke épais (`2.5`) sur demande explicite ("plus brut"). Le rond = juste une variante de forme, PAS une sémantique radio (comportement toujours indépendant/multi-select).
7. **Erreurs à éviter** : ne pas confondre la variante ronde avec un vrai Radio (utiliser le composant Radio pour un vrai choix unique).
8. **Exemple** :
```html
<label class="ds-checkbox" for="c1">
  <span class="ds-checkbox__box">
    <input type="checkbox" id="c1" class="ds-checkbox__input">
    <svg class="ds-checkbox__mark" viewBox="0 0 16 16"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" /></svg>
  </span>
  <span class="type-body-md">Envoyer le premier message de prospection</span>
</label>
```

### Radio

1. **Rôle** : choix unique parmi plusieurs options (vraie sémantique HTML `type="radio"` + attribut `name` partagé).
2. **Anatomie** : `<input type="radio">` (appearance none, cercle) + `<span class="ds-radio__dot">` séparé (rempli en `:checked +`).
3. **Variantes** : aucune (une seule forme).
4. **États** : default, checked (bordure claire + dot rempli), focus-visible, disabled.
5. **Tokens** : `--radio-size`, `--radio-background/border` (hérite d'Input), `--radio-checked-border`, `--radio-dot-color`.
6. **Règles d'usage** : toujours grouper avec un `name` commun pour garantir l'exclusivité native.
7. **Erreurs à éviter** : ne pas utiliser Radio pour une sélection indépendante (utiliser Checkbox rond à la place).
8. **Exemple** :
```html
<label class="ds-radio" for="r1">
  <span class="ds-radio__box">
    <input type="radio" name="frequency" id="r1" class="ds-radio__input" checked>
    <span class="ds-radio__dot"></span>
  </span>
  <span class="type-body-md">Quotidien</span>
</label>
```

### Toggle

1. **Rôle** : activer/désactiver un réglage on/off (ex : rappel quotidien). **Pas** la bascule liste↔Kanban (confusion initiale corrigée pendant la construction — cette bascule est un Tabs segmented, pas un Toggle).
2. **Anatomie** : `<input type="checkbox">` (appearance none, piste) + `<span class="ds-toggle__thumb">` (curseur, translaté en `:checked +`).
3. **Variantes** : aucune.
4. **États** : off, on (piste + curseur inversés en couleur), focus-visible, disabled.
5. **Tokens** : `--toggle-width/height/padding/thumb-size`, `--toggle-track-{off,on}-background/border`, `--toggle-thumb-{off,on}-background`.
6. **Règles d'usage** : le label associé doit décrire l'état "on" (ex "Rappel quotidien", pas "Activer le rappel").
7. **Erreurs à éviter** : ne pas utiliser pour un choix de vue/navigation (c'est un Tabs segmented dans ce cas).
8. **Exemple** :
```html
<label class="ds-toggle" for="t1">
  <span class="ds-toggle__track">
    <input type="checkbox" id="t1" class="ds-toggle__input" checked>
    <span class="ds-toggle__thumb"></span>
  </span>
  <span class="type-body-md">Rappel quotidien (activé)</span>
</label>
```

### Badge

1. **Rôle** : afficher un statut court en lecture seule (statut de jalon, statut de tâche) — jamais interactif.
2. **Anatomie** : `<span>` unique avec texte, pas de sous-structure.
3. **Variantes** : `.ds-badge` (neutre, défaut), `.ds-badge--active` (fond plein clair, contraste max), `.ds-badge--muted` (texte atténué).
4. **États** : aucun état interactif (pas de hover/focus/disabled — c'est un élément statique, pas un contrôle).
5. **Tokens** : `--badge-padding-inline/block/radius/font-size/line-height/font-weight`, `--badge-background/border/text`, `--badge-active-background/border/text`, `--badge-muted-text`.
6. **Règles d'usage** : **zéro vert/rouge sémantique** — la hiérarchie se fait par contraste (`--active` = fond plein, `--muted` = texte discret), jamais par couleur. Règle testée et confirmée deux fois avec Nils (statut jalon ET statut tâche) malgré la tentation d'utiliser vert/rouge.
7. **Erreurs à éviter** : ne pas colorer "Terminé" en vert ou "En retard" en rouge — utiliser `--muted`/`--active`/neutre.
8. **Exemple** :
```html
<span class="ds-badge ds-badge--muted">Passé</span>
<span class="ds-badge ds-badge--active">Actif</span>
<span class="ds-badge">Futur</span>
```

### Tooltip

1. **Rôle** : afficher une info contextuelle courte au survol/focus d'un élément.
2. **Anatomie** : `.ds-tooltip-wrapper` (position relative) contenant le déclencheur + `<span class="ds-tooltip" role="tooltip">` (position absolute, flèche en `::after`).
3. **Variantes** : `.ds-tooltip-wrapper--demo` (force l'affichage, usage démo uniquement — pas un vrai modifier de production). `.ds-tooltip-trigger` : déclencheur générique en icône "?" (bouton rond, pas de fond au repos) — pour définir un terme métier partout dans le produit (ex: "KPI" dans Empty state), au lieu d'attacher le tooltip à un élément déjà interactif.
4. **États** : caché (défaut, `opacity: 0`), visible (`:hover`/`:focus-within` sur le wrapper).
5. **Tokens** : `--tooltip-background` (`--color-surface-raised`, gris — testé en noir `--color-background` + `border-strong`, jugé "trop dur/différent des boutons", reverti), `--tooltip-border/radius/padding-inline/padding-block/font-size/line-height/shadow/max-width/arrow-size/gap`, `--tooltip-trigger-size/color/color-hover`.
6. **Règles d'usage** : `width: max-content` + `max-width` obligatoire ensemble — un bug réel a été trouvé où `white-space: nowrap` seul cassait le wrap du texte long (texte débordait de la boîte). `white-space: normal` + `width: max-content` est la combinaison qui marche. Le déclencheur icône utilise l'icône "Aide / Question" cataloguée dans `icons.md`.
7. **Erreurs à éviter** : ne pas utiliser `white-space: nowrap` avec un `max-width` sur ce composant (bug déjà rencontré). Ne pas coller la définition d'un terme métier en texte brut à côté du terme — passer par le déclencheur icône pour ne pas alourdir la lecture (retour Nils sur Empty state).
8. **Exemple** :
```html
<span class="ds-tooltip-wrapper">
  <button class="ds-button ds-button--ghost ds-button--sm">Survole-moi</button>
  <span class="ds-tooltip" role="tooltip">Apparaît au survol ou au focus clavier</span>
</span>

<span class="ds-tooltip-wrapper">
  <button class="ds-tooltip-trigger" aria-label="Aide">
    <svg class="ds-tooltip-trigger-icon" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.5" /><path d="M6.2 6.3a1.8 1.8 0 0 1 3.5.6c0 1.2-1.8 1.8-1.8 1.8" /><path d="M8 11h.01" /></svg>
  </button>
  <span class="ds-tooltip" role="tooltip">Un KPI est un indicateur mesurable suivi pour évaluer la progression vers un objectif.</span>
</span>
```

### Modal

1. **Rôle** : capter l'attention pour une action ponctuelle (création/édition), bloque l'interaction avec le reste de la page.
2. **Anatomie** : `.ds-modal-backdrop` (position fixed, assombrit toute la page) > `.ds-modal` (dialog) > `.ds-modal__header` (titre + bouton fermer + sous-titre) + `.ds-modal__body` (contenu, ex formulaire) + `.ds-modal__footer` (actions).
3. **Variantes** : aucune — un seul modal, contenu variable.
4. **États** : ouvert uniquement (pas de gestion JS de fermeture dans ce DA System, juste le markup/style — l'ouverture/fermeture est un comportement produit, pas documenté ici).
5. **Tokens** : `--modal-backdrop`, `--modal-background/border/radius`, `--modal-padding-inline/block`, `--modal-header-gap`, `--modal-shadow`, `--modal-max-width` (480px), `--modal-close-size`.
6. **Règles d'usage** : un seul bouton d'action en footer si le bouton "×" suffit déjà à annuler (redondance "×" + "Annuler" identifiée et retirée par Nils). Largeur 480px délibérément compacte pour un formulaire court (720px jugé "trop large", 560px testé aussi, 480px retenu).
7. **Erreurs à éviter** : ne pas dupliquer l'action d'annulation (× ET bouton "Annuler" ensemble). Ne pas utiliser `border-strong` pour le contour (testé, "trop dur", → `border-subtle` + `shadow-lg`).
8. **Exemple** :
```html
<div class="ds-modal-backdrop">
  <div class="ds-modal" role="dialog" aria-modal="true">
    <header class="ds-modal__header">
      <div class="ds-modal__header-row">
        <h2 class="type-h2">Nouvelle tâche</h2>
        <button class="ds-modal__close" aria-label="Fermer">...</button>
      </div>
      <p class="ds-modal__subtitle type-body-sm">Ajoute une action liée à ton jalon actif.</p>
    </header>
    <div class="ds-modal__body">...</div>
    <footer class="ds-modal__footer">
      <button class="ds-button ds-button--primary ds-button--sm">Créer</button>
    </footer>
  </div>
</div>
```

### Tabs

1. **Rôle** : deux usages distincts sous le même nom de composant. (A) navigation principale entre les 3 vues produit (Vision/Jalons/Exécution). (B) bascule d'affichage liste↔Kanban à l'intérieur de la vue Exécution.
2. **Anatomie** : (A) `<nav class="ds-tabs" role="tablist">` > `<button class="ds-tabs__tab">` (icône SVG + label) répétés. (B) `<div class="ds-tabs-segmented" role="tablist">` > `<button class="ds-tabs-segmented__tab">` (texte seul) répétés.
3. **Variantes** : `.ds-tabs` (icône+label, nu — pas de fond de carte, pensé pour être posé directement dans la navbar produit) vs `.ds-tabs-segmented` (pill avec fond, contenu texte seul).
4. **États** : `.is-active` (icône+texte pleins, gras) vs inactif (gris), hover, focus-visible (`outline`, pas de bordure comme le reste du système — cas particulier car pas de box de fond au repos).
5. **Tokens** : `--tabs-gap/padding-block/text/text-active/icon-size`, `--tabs-segmented-*` (padding/gap/background/radius/tab-radius/tab-padding/active-background/active-text).
6. **Règles d'usage** : les icônes de `.ds-tabs` sont copiées à l'identique depuis `dashboard.html` (stroke-width 2, `--icon-stroke-width-bold`) — ne pas les redessiner. `.ds-tabs` ne doit jamais avoir de fond/bordure de carte (contrairement à la plupart des composants) car il vit nu dans la top navbar du produit.
7. **Erreurs à éviter** : ne pas mettre `.ds-tabs` dans un container avec fond (cassé visuellement, corrigé après retour Nils montrant la vraie navbar produit). Ne pas confondre avec un Toggle pour la bascule liste/Kanban.
8. **Exemple** :
```html
<nav class="ds-tabs" role="tablist">
  <button class="ds-tabs__tab is-active" role="tab" aria-selected="true">
    <svg class="ds-tabs__icon" viewBox="0 0 24 24"><path d="M4 19V5M4 19h16M9 16V9M14 16V7M19 16v-4" /></svg>
    <span>Vision</span>
  </button>
</nav>
```

### Card

1. **Rôle** : conteneur générique pour regrouper du contenu (base de tous les `-stage` de preview, et future base des cartes produit KPI/jalon).
2. **Anatomie** : `<article class="ds-card">`ou `<div>`, contenu libre.
3. **Variantes** : aucune — un seul niveau de surface (Principe 7 : `surface.elevated`/`surface.muted` retirés faute de besoin réel).
4. **États** : default, hover/focus-within (`border-strong` — seul usage restant de ce token dans tout le système).
5. **Tokens** : `--card-background/border/border-active/radius/padding/shadow/transition` — tous hérités 1:1 de `--container-*`.
6. **Règles d'usage** : Card = alias direct de Container, pas de token propre distinct. Si un futur besoin (ex carte cliquable vs carte statique) apparaît, ajouter les tokens à ce moment (Principe 7).
7. **Erreurs à éviter** : ne pas dupliquer les valeurs de Container dans Card — toujours référencer `var(--container-*)`.
8. **Exemple** :
```html
<article class="ds-card">
  <div class="type-h3">Titre</div>
  <p class="type-body-md">Contenu.</p>
</article>
```

### Table

1. **Rôle** : afficher une liste de données structurées en colonnes (ex liste de tâches). Colonnes de l'exemple (Tâche/Statut/Échéance) = illustratives, pas figées — le vrai choix de colonnes est une décision produit à faire par écran.
2. **Anatomie** : `<table class="ds-table">` natif, `<thead>`/`<tbody>` standards, compose avec Badge dans les cellules de statut.
3. **Variantes** : aucune.
4. **États** : default, hover de ligne (`tbody tr:hover td`, fond `surface-raised`). Pas de focus/disabled/error au niveau du composant (ce sont ses cellules qui peuvent contenir des éléments avec leurs propres états).
5. **Tokens** : `--table-header-text/font-size/font-weight`, `--table-cell-padding-block/padding-inline`, `--table-row-border/hover-background`, `--table-cell-text`.
6. **Règles d'usage** : header en `type-data-label` (uppercase, petit, gras) pour le distinguer nettement du contenu. Padding uniforme sur toutes les colonnes y compris première/dernière (testé sans padding sur les bords, jugé "collé/bizarre" par Nils — corrigé).
7. **Erreurs à éviter** : ne pas retirer le padding horizontal des première/dernière colonnes (déjà fait puis annulé — cassait l'alignement avec le header et rendait le hover de ligne moche).
8. **Exemple** :
```html
<table class="ds-table">
  <thead><tr><th>Tâche</th><th>Statut</th></tr></thead>
  <tbody>
    <tr><td>Envoyer le message</td><td><span class="ds-badge">À faire</span></td></tr>
  </tbody>
</table>
```

### Toast

1. **Rôle** : notifier temporairement d'un résultat d'action (confirmation, erreur).
2. **Anatomie** : conteneur `.ds-toast` (icône + message + bouton fermer), tous alignés centre.
3. **Variantes** : `.ds-toast--error` (accent rouge à gauche + icône alerte), `.ds-toast--success` (accent vert à gauche, icône check).
4. **États** : affiché uniquement dans ce DA System (pas d'animation d'apparition/disparition ni de auto-dismiss documentés — comportement JS hors scope).
5. **Tokens** : `--toast-background/border/radius/padding/gap/shadow/max-width/icon-size/close-size`, `--toast-error-accent/icon-color`, `--toast-success-accent/icon-color`.
6. **Règles d'usage** : accent couleur autorisé ici (rouge/vert) contrairement à Badge — différence assumée : Toast est un signal d'événement ponctuel (erreur/succès réels), pas un jugement de valeur permanent sur une donnée/métrique (Principe 1/Q6 visent les métriques, pas les notifications système).
7. **Erreurs à éviter** : ne pas ajouter de `margin-top`/décalage manuel sur l'icône pour "l'aligner" — utiliser `align-items: center` sur le conteneur (bug réel rencontré : un `margin-top: 2px` en dur avait été ajouté puis retiré).
8. **Exemple** :
```html
<div class="ds-toast ds-toast--error" role="alert">
  <svg class="ds-toast__icon" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.5" /><path d="M8 5.2V8.8M8 11.2h.01" /></svg>
  <p class="ds-toast__message type-body-sm">Impossible d'enregistrer la tâche. Réessaie.</p>
  <button class="ds-toast__close" aria-label="Fermer">...</button>
</div>
```

### Progress bar

1. **Rôle** : visualiser l'avancement d'un jalon/critère (ex "1/6 prospects trouvés").
2. **Anatomie** : `<div class="ds-progress" role="progressbar">` (piste) > `<div class="ds-progress__fill">` (remplissage), généralement précédé d'un `.progress-group__label` (label + fraction texte).
3. **Variantes** : aucune variante de forme — seulement des classes de largeur démo (`--17`, `--100`) pour illustrer différents pourcentages, pas de vraie "variante" produit (en prod la largeur serait posée dynamiquement, pas en classe CSS figée).
4. **États** : aucun état interactif (élément non interactif, purement informatif).
5. **Tokens** : `--progress-height/radius/track-background/fill-background/transition`.
6. **Règles d'usage** : **zéro couleur sémantique sur le remplissage** — toujours `--color-text-primary` (blanc), jamais vert "bonne progression"/rouge "en retard" (même règle que Badge, Principe 1/Q6). Le remplissage anime via `transform: scaleX()` (`transform-origin: left`), jamais `width` — trouvé et corrigé en audit (`impeccable` a flaggé `width` comme animation de layout, coûteuse ; `scaleX` est la technique correcte, déjà utilisée dans la fondation Motion).
7. **Erreurs à éviter** : ne pas colorer la barre selon le pourcentage (ex vert si >80%). Ne pas animer `width` — utiliser `transform: scaleX()`.
8. **Exemple** :
```html
<div class="ds-progress" role="progressbar" aria-valuenow="17" aria-valuemin="0" aria-valuemax="100">
  <div class="ds-progress__fill ds-progress__fill--17"></div>
</div>
```
```css
.ds-progress__fill { transform: scaleX(0); transform-origin: left center; }
.ds-progress__fill--17 { transform: scaleX(0.17); }
```
*(note : le preview utilise des classes `--17`/`--100` figées pour rester cohérent avec la règle "zéro style inline" ; en prod, `scaleX()` serait posé dynamiquement via une variable CSS ou un binding, pas via `style=""`.)*

### Disclosure

1. **Rôle** : déplier/replier une liste de sous-tâches sous une tâche parente. Composant ajouté en cours de route (pas dans le gabarit initial) suite à un besoin réel identifié par Nils.
2. **Anatomie** : `<button class="ds-disclosure" aria-expanded="...">` contenant un `<span class="ds-disclosure__icon">` (triangle CSS pur, pas de SVG).
3. **Variantes** : aucune.
4. **États** : replié (`aria-expanded="false"`, triangle pointant à droite via `rotate(-90deg)`), déplié (`aria-expanded="true"`, triangle pointant vers le bas).
5. **Tokens** : `--disclosure-size`, `--disclosure-icon-color`, `--disclosure-triangle-width/height`.
6. **Règles d'usage** : le triangle change d'orientation par rotation CSS (`transform`), pas par changement de path SVG.
7. **Erreurs à éviter** : ne pas ajouter de fond/hover visible sur le bouton (a été retiré sur demande explicite — "faut pas de hoover gris").
8. **Exemple** :
```html
<button class="ds-disclosure" aria-expanded="true">
  <span class="ds-disclosure__icon"></span>
</button>
```

### Empty state

1. **Rôle** : signaler l'absence de données, en apprenant à l'utilisateur ce qu'il doit faire — jamais un simple "rien ici". Dernier des 16 composants de base du gabarit initial.
2. **Anatomie** : deux formes distinctes selon le contexte, pas une seule anatomie figée.
   - **Bloc centré** (`.ds-empty-state`) : icône + titre (+ déclencheur Tooltip optionnel sur un terme du titre) + description + bouton d'action optionnel. Pour un contexte "carte isolée" (KPI vide, graphique vide).
   - **Ligne inline** (`.ds-empty-inline`) : icône "+" + texte "Ajouter…", sans carte ni icône décorative. Pour une liste déjà existante mais vide (ex: to-do list) — reproduit exactement le pattern `+ Ajouter une action…` de `dashboard.html` (`.add-task-ghost-btn`).
3. **Variantes** : bloc centré avec ou sans bouton d'action (ex: "Aucune donnée dans le graphique" n'a pas de CTA — rien à cliquer, c'est une conséquence d'un autre état vide, pas une action propre).
4. **États** : aucun état interactif propre au bloc centré (juste affiché) ; la ligne inline a hover/focus-visible comme un bouton normal.
5. **Tokens** : `--empty-state-icon-size/color/gap/padding-block/max-width`, `--empty-inline-height/gap/text-color/text-color-hover`.
6. **Règles d'usage** : ne jamais illustrer avec une mascotte ou une séquence de célébration (Principe 1). Icône neutre et dimmée (`--color-text-muted`), jamais decorative/colorée. Un terme technique (ex "KPI") s'explique via le déclencheur Tooltip, pas via une phrase supplémentaire collée dans la description (alourdit la lecture).
7. **Erreurs à éviter** : ne pas réutiliser le bloc centré pour une liste qui a juste besoin d'un point d'entrée discret (ex to-do list) — dans ce cas la ligne inline est la bonne forme, pas une grosse carte avec icône. Ne pas dupliquer l'explication d'un terme en dur dans le texte si un Tooltip existe déjà pour ça.
8. **Exemple** :
```html
<!-- Bloc centré -->
<div class="ds-empty-state">
  <svg class="ds-empty-state__icon" viewBox="0 0 24 24">...</svg>
  <h3 class="type-h3 ds-empty-state__title">
    <span>Aucun KPI enregistré</span>
    <span class="ds-tooltip-wrapper">
      <button class="ds-tooltip-trigger" aria-label="Qu'est-ce qu'un KPI ?">...</button>
      <span class="ds-tooltip" role="tooltip">Un KPI est un indicateur mesurable suivi pour évaluer la progression vers un objectif.</span>
    </span>
  </h3>
  <p class="ds-empty-state__description type-body-md">Ajoute une première mesure pour suivre ta progression.</p>
  <button class="ds-button ds-button--inverse ds-button--sm">Ajouter une mesure</button>
</div>

<!-- Ligne inline -->
<button class="ds-empty-inline">
  <span class="ds-empty-inline__icon">+</span>
  <span>Ajouter une action...</span>
</button>
```

## À venir

Sections non commencées (décisions produit pas encore prises, nécessitent une session dédiée) :
- **5. Composants métier** — Task row complet (checkbox + texte + statut + actions), Jalon card, KPI card. Distinct des composants de base ci-dessus (voir clarification donnée à Nils en session : composant de base = brique atomique réutilisable partout, composant métier = assemblage propre à un écran CarryIT).
- **6. Patterns** — création/modification/suppression/confirmation/filtre/recherche/tableau vide/chargement/erreur/onboarding/dashboard/détail.
- **7. Templates d'écran** — Dashboard principal, page de détail, formulaire de création/édition. Dépend de la grille/largeurs de page réelles du produit, pas encore définies (cf. §4.3, largeurs de shell actuelles sont des valeurs de preview, pas des tokens produit — à faire au moment de construire les Templates, pas avant).
- **8. Data visualisation** — graphique/chart (backlog #1), calendrier/timeline (backlog #2), delta, tendance, historique, absence de donnée.
- **9. Accessibilité (règles globales consolidées)** — chaque composant a ses règles listées ci-dessus, mais pas de section transverse dédiée (tailles cliquables minimales, navigation clavier globale, aria patterns communs).
- **10. Documentation** — modèle de doc réutilisable pour les futurs composants.
- **11. Gouvernance** — convention de nommage, quand créer vs réutiliser, gestion des exceptions, versionning.

**Les 16 composants de base officiels du gabarit §4 sont tous construits (Empty state fait le 2026-07-02).**

Backlog restant (voir tasks du projet) : Chart/Graphique KPI, Calendrier/Timeline horaire, Timeline rail+dots (séquence de jalons), Table lignes imbriquées (sous-tâches). Harmonisation des icônes de production : terminée (cf. `icons.md`, toutes les intentions avec variantes concurrentes tranchées : Chevron/Fermer/Plus/Corbeille/Édition/Retour, + les intentions à variante unique validées : Calendrier/Rafraîchir/Presse-papier/Kanban/Liste/Utilisateur).
