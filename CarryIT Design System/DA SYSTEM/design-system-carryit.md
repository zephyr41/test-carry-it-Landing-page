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
**Letter-spacing :** défaut `0` (`--letter-spacing-default`). **Deux exceptions ajoutées (passe premium 2026-07-06)** — le tracking par défaut à 0 aplatissait les micro-labels et les grands chiffres :
- `--letter-spacing-label` (`0.06em`) sur les **micro-labels MAJUSCULES** (eyebrows `type-data-label`, en-têtes de colonnes) → espacés = raffinés (sinon "AI-flat").
- `--letter-spacing-tight` (`-0.02em`) sur les **grands chiffres / valeurs** (valeur KPI, display) → resserre la masse (feel data premium).

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
- `--space-label-gap: var(--space-8)` — **un titre/label → le texte qu'il introduit** (paragraphe, description) : collés = une unité de sens. Plus serré que `element-gap`. C'est la brique du **rythme groupé** (titre↔texte tight < texte↔action < section↔section) : ne jamais espacer un titre de son paragraphe avec le même gap que deux blocs distincts.
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

Usage réel observé : `border-subtle` est le défaut sur quasi tous les composants interactifs au repos (Input, Select, Textarea, Checkbox, Radio, Toggle, Card, Badge, Table cellules). `border-strong` a **un seul usage** : la Card au hover/focus-within (`--card-border-active` → `--container-border-active` → `--border-strong`, cf. §4.1 et §6 Card). Il avait été prévu pour l'élévation du Modal, mais celui-ci est finalement passé à `border-subtle` + `shadow-lg` après retour Nils ("bordure trop dure/visible") — d'où son usage réduit à ce seul composant.

### 4.6 Shadows

| Token | Valeur CSS | Usage | Condition |
|---|---|---|---|
| `shadow.none` | `none` | Container / carte de base | pas d'ombre (élévation par bordure) |
| `shadow.sm` | `0 4px 12px -4px rgba(0,0,0,0.45)` | Tooltip **+ carte définie** (`--card-shadow-defined`, combiné à un filet interne haut) | ombre discrète — détache la carte du fond near-black (fonctionnel, pas déco, cf. §6 Card) |
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

### 4.8 Grille & hauteurs (layout dashboard)

Le dashboard long terme pose une **grille à deux axes**. Règle cardinale de hauteur : **fixe où le contenu est fixe, proportionnel (clamp) où le contenu veut de la place.** Ne jamais forcer une `height` en dur sur une carte (ça clippe) — la hauteur vient des tokens ci-dessous.

**Axe horizontal — grille 12 colonnes** (`grid.css`, `.ds-grid`) :

| Token | Valeur | Rôle |
|---|---|---|
| `--grid-columns` / `-tablet` / `-mobile` | 12 / 8 / 4 | pistes fluides (`1fr`), reflow ≤1024 puis ≤600 |
| `--grid-max-width` | **1280px** | largeur max du contenu, centré. Au-delà → figé + marges latérales (pas d'étalement) |
| `--grid-gutter` | 24 (`--space-24`) | gouttière entre colonnes |
| `--grid-page-padding` | 32 (`--space-page-desktop`) | marge écran (16 en mobile) |

Bande KPI = 4 × `.ds-col-3` (=12). Rangée du bas = `.ds-col-8` (chart) + `.ds-col-4` (SMART).

**Axe vertical — deux rangées** (`.dashboard-final__page`, `grid-template-rows: auto minmax(var(--grid-row-content-height), auto)`) :

| Rangée | Hauteur | Pourquoi |
|---|---|---|
| **Bande KPI** (haut) | **FIXE ~150** — `--kpi-card-summary-min-height` (150) ; le contenu tient dedans grâce à la discipline line-height (cf. ci-dessous) | contenu fixe (eyebrow + valeur + delta) : l'agrandir n'ajoute que du vide |
| **Contenu** (chart/SMART, bas) | **PROPORTIONNEL borné** — `--grid-row-content-height: clamp(490px, 34vw, 560px)` | le graphique profite de la place ; **plat sur la plage laptop** (plancher 490), ne grandit qu'au-delà de ~1440 jusqu'à 560 (ultra-large) |

Mesuré (Playwright) : bande KPI = 151 à 1280/1440/1920 (stable) ; rangée contenu = 490 / 490 / 560 (plate 1280→1440, puis proportionnelle jusqu'au cap).

**Discipline line-height (piège hauteur).** Une carte gonfle si un texte garde un `line-height` taillé pour une **autre** taille. Cas réel corrigé : la valeur résumé passe à 28px (`--kpi-card-summary-value-size`) mais héritait du `line-height` du 40px (`--type-display-line`) → +14px par tuile. Fix = `--kpi-card-summary-value-line: var(--type-h1-line)` (le lh **suit** la taille). Règle : tout token `*-size` réduit dans une variante doit avoir son `*-line` apparié sur la même échelle (seule exception documentée : `--smart-letter-line` volontairement calé sur la ligne du texte voisin).

## 5. Design tokens

Le système utilise 3 niveaux, tous dans `tokens.css` :

**Primitifs** — valeurs brutes, jamais utilisées directement dans un composant. Exemples réels : `--color-neutral-900: #161617`, `--space-24: 24px`, `--radius-xl: 12px`, `--motion-duration-fast: 140ms`.

**Sémantiques** — nomment un rôle, pointent vers un primitif. Exemples réels : `--color-surface: var(--color-neutral-900)`, `--color-danger: var(--color-red-400)`, `--border-subtle: var(--border-width-default) solid var(--color-border-subtle)`.

**Composants** — un token par propriété par composant, pointe vers un sémantique (ou directement un primitif pour les cas non génériques, ex `--modal-max-width: 480px`). Exemples réels : `--input-background: var(--color-surface-raised)`, `--button-primary-background: var(--color-accent-primary)`, `--badge-active-text: var(--color-background)`.

Règle observée dans le code : certains tokens composants pointent vers d'autres tokens composants plutôt que vers un sémantique — ex `--card-background: var(--container-background)` (Card hérite de Container), `--checkbox-background: var(--input-background)` (Checkbox hérite d'Input). C'est volontaire : ça évite de dupliquer une décision de valeur à plusieurs endroits.

Le fichier `tokens.css` complet fait ~470 lignes de tokens + les classes utilitaires `.type-*`. Il n'est pas recopié ici in extenso pour éviter la duplication/désync (déjà le problème qu'on vient de rattraper) — se référer directement au fichier, c'est la source de vérité unique.

## 6. Composants de base

18 composants de base construits à ce jour : les 16 du gabarit initial (`00-prompt-design-system.md`) + `Disclosure` et `Input number`, non prévus au départ, ajoutés pour des besoins réels identifiés pendant la construction (déplier/replier des sous-tâches ; saisie numérique avec steppers).

### Button

1. **Rôle** : déclencher une action (CTA marketing ou action produit). Seul élément autorisé à porter la couleur d'accent orange (Principe 2).
2. **Anatomie** : élément `<button>` unique (`display: inline-flex; align-items: center; gap: --button-gap`), icône SVG optionnelle en composition manuelle (pas de sous-structure imposée).
3. **Variantes** : `.ds-button--primary` (orange plein), `.ds-button--ghost` (contour neutre), `.ds-button--inverse` (blanc plein, pill), `.ds-button--secondary` (**rempli `surface-raised` + bordure subtle** — action secondaire à côté d'un CTA orange, ex. « Importer » vs « Exporter » dans le modal Synchroniser ; ajouté 2026-07-08, comble le manque d'un bouton secondaire *rempli* distinct de ghost/inverse), `.ds-button--subtle` (texte muted, zéro bordure/fond — trigger tertiaire discret dans un contexte dense, ex header de Chart). Modifier `.ds-button--block` = pleine largeur (boutons empilés dans un modal/colonne). Tailles — **échelle taille + emphase couplées** (une taille plus petite = action plus secondaire, pas juste plus courte) : `.ds-button` défaut/lg (64px, 16px **bold** — CTA), `.ds-button--sm` (**40px, 14px, medium** — action secondaire : présente mais ne crie pas ; refonte 2026-07-08, avant 48/16/bold jugé « énorme » à côté du texte), `.ds-button--xs` (24px, 12px medium `type-label` — pour `subtle` (trigger inline) **et `ghost`** (action secondaire compacte dans un contexte dense, ex. sections d'un modal ; ajouté 2026-07-08), jamais sur `primary`/`inverse` qui sont des CTA et ne doivent pas être minuscules). Toutes les tailles se combinent avec les variantes de couleur.
4. **États** : default, hover (`:hover:not(:disabled)`, translateY -1px sur primary, éclaircissement texte sur subtle), active, focus-visible (bordure), disabled (`opacity: 0.3`, `pointer-events: none`, couleur de variante conservée). Pas de loading, pas d'error.
5. **Tokens** : `--button-height-lg/sm/xs/mobile` (sm = `calc(space-32 + space-8)` = 40), `--button-padding-inline-lg/sm/xs/mobile`, `--button-radius-default/pill`, `--button-font-size/line-height/weight` (+ `-sm`/`-xs`), `--button-gap/-xs`, `--button-icon-size-xs`, `--button-{primary,ghost,inverse,secondary,subtle}-{background,text,border}` (+ variantes hover/active), `--button-disabled-opacity`. `.ds-button--block` = `width:100%` (pas de token, un modifier).
6. **Règles d'usage** : orange (`primary`) réservé à UNE seule action par écran/contexte, celle qui est vraiment le CTA. `ghost`/`inverse` pour les actions secondaires avec affordance visible (form/modal). `subtle` uniquement pour un trigger tertiaire inline qui ne doit pas rivaliser visuellement avec le contenu (ex "+ Ajouter une mesure" dans un header de graphique) — jamais pour une action qui a besoin d'être vue comme un bouton.
7. **Erreurs à éviter** : ne pas mettre deux boutons `primary` côte à côte (dilue le sens de l'orange). Ne pas réécraser la couleur en disabled (testé, rejeté par Nils). Ne pas utiliser `subtle` pour une action qui a besoin d'affordance claire — dans ce cas `ghost`.
8. **Exemple** :
```html
<button class="ds-button ds-button--primary" type="button">Structurer mon ambition.</button>
<button class="ds-button ds-button--ghost ds-button--sm" type="button">Annuler</button>
<button class="ds-button ds-button--subtle ds-button--xs" type="button">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
  Ajouter une mesure
</button>
```

### Input

1. **Rôle** : saisie de texte court sur une ligne (objectif SMART, titre de tâche, etc.).
2. **Anatomie** : `<input>` natif seul, généralement accompagné d'un `<label class="type-label">` dans un `.input-group` (pas partie du composant lui-même).
3. **Variantes** : aucune variante de forme — `.ds-input--error` est un modifier d'état, pas une variante visuelle distincte. **`.ds-file-field`** = variante pour `<input type="file">` : le natif est **restylé** (pas de trigger custom masqué → sémantique + clavier natifs conservés), son `::file-selector-button` reprend le chrome d'un **bouton ghost sm** (height-sm, border ghost, radius-xl, token-pur) et le nom de fichier passe en `text-secondary`. Le libellé du bouton (« Choisir un fichier ») suit la locale du navigateur (non pilotable en CSS). Utilisé dans le modal Synchroniser.
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
5. **Tokens** : `--modal-backdrop`, `--modal-background/border/radius`, `--modal-padding-inline/block`, `--modal-header-gap`, `--modal-shadow`, `--modal-max-width` (480px), `--modal-close-size`. **Layering** : le backdrop porte `z-index: var(--z-overlay)` (1000) — sans ça, un contenu de page positionné avec un `z-index` (ex : les dots `z-index:1` du stepper) transperce le backdrop. `--z-overlay` est le token de calque partagé pour tout overlay flottant (Modal, Toast, Tooltip).
6. **Règles d'usage** : un seul bouton d'action en footer si le bouton "×" suffit déjà à annuler (redondance "×" + "Annuler" identifiée et retirée par Nils). Largeur 480px délibérément compacte pour un formulaire court (720px jugé "trop large", 560px testé aussi, 480px retenu). **Croix** : reste **en flux** dans le `header-row` (donc **alignée verticalement au titre** via `align-items:center`) et tirée vers le coin par une **marge négative** `calc(-1 * (padding-inline − modal-close-inset))` — inset visuel 24, < padding de contenu 40. (Testé en `position:absolute` : ça la remontait au-dessus du titre, cassait l'alignement vertical — reverti.) **Padding vertical** du modal (`--modal-padding-block` = `space-48`) > l'inline → plus d'air haut/bas. **Titre → sous-titre** = `--space-label-gap` (pas 4px collés). **Séparateur entre sections de corps** : `.ds-modal__section + .ds-modal__section` porte `border-top: border-subtle` + `padding-top: space-24` (même filet que le header — le vide seul ne coupait pas assez). **Actions toujours à droite** (`.ds-modal__footer`, `justify-end`), backdrop en `z-index: var(--z-overlay)`. **Corps à sections** (`.ds-modal__section`, pattern générique disponible pour tout modal à plusieurs blocs titre+description+action) : **rythme groupé + contraste, jamais uniforme** — titre = eyebrow `type-data-label` tracké (`--letter-spacing-label`) **en blanc (`text-primary`) = ancre**, description reste `text-secondary` (contraste par **couleur**, pas juste uppercase — sinon titre gris + plus petit que son paragraphe = hiérarchie inversée), titre→description = `--space-label-gap` (8), description→action = `--space-element-gap` (12), section→section = `--space-24` (scopé via `:has(.ds-modal__section)`). **Actions à droite** (`.ds-modal__footer`, `justify-end`), backdrop en `z-index: var(--z-overlay)`. **Choix du variant d'action** : un submit de **formulaire dense** = `inverse` (pas d'orange gratuit, cf. effort-modal) ; mais un modal dont le but EST une action claire peut faire de son action principale un **CTA `primary` orange** (Principe 2 : un accent = l'action principale). `danger` = confirmation destructive uniquement. Le token `--modal-max-height`/scroll n'existe pas encore (ajouté quand un modal long apparaîtra, pas spéculatif).

**Instance « Synchroniser » (`.ds-sync-modal`, action-first — refonte 2026-07-08).** Modal simple, pas de sections : titre + sous-titre, puis **2 actions empilées pleine largeur** (`.ds-button--block`) — **Exporter** = `primary` orange (action safe/principale), **Importer** = `secondary` (rempli, destructif → volontairement moins criard que l'export) qui ouvre le sélecteur de fichier et passe en `danger` « Remplacer mes données » si des données existent (confirmation en 2 temps). Ligne de **réassurance** centrée + bouton **Fermer** (`ghost --block`, dismiss). **Pas de croix** ici : le bouton Fermer explicite la remplace. Styles d'assemblage dans `sync.css` (comme `effort-modal.css`).
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
5. **Tokens** : `--card-background/border/border-active/radius/padding/shadow/transition` (hérités 1:1 de `--container-*`) **+ carte définie (2026-07-06)** : `--card-border-defined` (arête blanc 10% via `color-mix`, un cran au-dessus du 7% décoratif) et `--card-shadow-defined` (`shadow-sm` + filet lumineux interne haut 5%). Dérivés de l'encre (`color-mix` sur `--color-text-primary`), zéro hex ajouté.
6. **Carte DÉFINIE (passe premium 2026-07-06)** : le défaut `--card-border` (7%) + `shadow:none` rendait les cartes **plates** — elles ne se détachaient pas du fond near-black (`#0A0A0B`), diagnostic mesuré = "pas premium". Fix = **arête 10% + filet + ombre douce** (`--card-border-defined` / `--card-shadow-defined`). La définition est **fonctionnelle** (lisibilité/détachement, même logique que l'obligation de border §4.1), **pas décorative** — reste dans Principe 4 (ombre discrète, pas de glow coloré). Appliqué en token **système partagé** sur : kpi-card, chart, timeline, jalon-card. Hover = `border-active` (`border-strong`) inchangé.
7. **Règles d'usage** : Card = alias de Container pour les valeurs de base. La carte de contenu premium utilise `--card-border-defined` + `--card-shadow-defined` (partagés, jamais redéfinis par composant). Si un futur besoin (ex carte cliquable vs statique) apparaît, ajouter les tokens à ce moment (Principe 7).
8. **Erreurs à éviter** : ne pas dupliquer les valeurs de Container dans Card — toujours référencer `var(--container-*)` / `var(--card-*)`. Ne pas recréer un `border`/`shadow` de carte en dur dans un composant : passer par `--card-border-defined` / `--card-shadow-defined`.
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

### Task list imbriquée

1. **Rôle** : afficher une tâche parente et ses sous-tâches décalées.
2. **Nature** : pattern métier/composite, pas composant Table de base. Il s'appuie sur `.ds-table` pour le rythme de lignes et les séparateurs, mais ses règles vivent dans `task-list.css`.
3. **Anatomie** : compose `.ds-table ds-table--nested`, `.ds-badge`, `.ds-disclosure`, `.ds-checkbox` et `.ds-empty-inline`. Le header utilise un label de statut existant (`À faire`), pas un libellé générique `Tâche`. Les sous-tâches utilisent la variante ronde existante du Checkbox. Les lignes tâche/sous-tâche exposent au hover/focus une poignée de déplacement, une action options (`⋯`) et une action supprimer (`×`). La ligne d'action inline utilise `.ds-table__row--inline-action` pour ne pas afficher de séparateur bas.
4. **Séparation CSS** : `table.css` reste strictement générique. Tout ce qui est `.nested-group__*`, `.ds-row-*`, `.ds-table--nested`, `.task-list-stage` appartient à `task-list.css`.
5. **Tokens** : aucun token dédié. Utilise uniquement les tokens existants de Table, Checkbox, Disclosure, Empty inline, spacing et texte.
6. **Règles d'état** : tâche repliée = ligne normale avec `border-bottom`. Tâche dépliée = ligne parent + zone sous-tâches. La dernière sous-ligne/action ferme le groupe. Ne jamais créer de double trait entre deux tâches : le `border-bottom` d'une tâche repliée sert aussi de séparation avec la tâche suivante.
7. **Preview** : `preview/task-list.html`

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
3. **Variantes** : bloc centré avec ou sans bouton d'action. Les deux cas sont câblés dans le produit (2026-07-06) : **Chart vide** = *sans* CTA (l'action « Ajouter une mesure » vit déjà dans le header de la carte — le graphique vide est une conséquence, pas une action propre) ; **KPI history vide** = *avec* CTA « Ajouter une mesure » (le head de l'historique ne porte pas de bouton, donc le CTA est ici le seul point d'entrée). Règle : le CTA n'apparaît que si aucune autre affordance d'ajout n'est déjà visible dans le même conteneur.
4. **États** : aucun état interactif propre au bloc centré (juste affiché) ; la ligne inline a hover/focus-visible comme un bouton normal.
5. **Tokens** : `--empty-state-icon-size/color/gap/padding-block/max-width`, `--empty-inline-height/gap/text-color/text-color-hover`. `--empty-inline-height` reste dense (`--space-24`) : c'est une action inline de liste, pas un bouton.
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

### Input number

1. **Rôle** : saisie d'une valeur numérique (quantité d'un effort/résultat KPI) avec incrément/décrément rapide via steppers. Ajouté hors gabarit initial, pour le besoin réel du modal "Ajouter un effort".
2. **Anatomie** : `.ds-input-number` (conteneur bordé, porte la bordure) > `<input type="number">` (`.ds-input-number__field`, spinners natifs masqués) + `.ds-input-number__steppers` (deux `<button>` ↑/↓ empilés, chevrons SVG).
3. **Variantes** : aucune.
4. **États** : default, focus-within (bordure focus portée par le **conteneur**, pas l'input — le champ est `border:none` pour éviter la double bordure), hover/focus-visible sur un stepper. Error non câblé dans le preview (réutiliserait `--input-error-*` comme Input).
5. **Tokens** : hérite `--input-background/border/border-focus/radius/text/placeholder/height/padding-inline` + propres `--input-number-value-size/line/weight` (valeur affichée en `type-h3`, plus grosse qu'un input texte) et `--input-number-stepper-width/color/color-hover/background-hover/border`.
6. **Règles d'usage** : spinners natifs masqués (`appearance:none` + `::-webkit-*-spin-button`) et remplacés par les steppers custom pour un rendu cohérent cross-navigateur. Le clamp bas (jamais < 0) est posé en JS, pas via l'attribut `min` seul. La bordure focus vit sur `.ds-input-number:focus-within`, jamais sur l'`<input>` interne.
7. **Erreurs à éviter** : ne pas laisser les spinners natifs (rendu incohérent Chrome/Firefox). Ne pas mettre de bordure sur l'input interne (conteneur seulement, sinon double trait).
8. **Exemple** :
```html
<div class="ds-input-number">
  <input class="ds-input-number__field" type="number" min="0" step="any" placeholder="0">
  <div class="ds-input-number__steppers">
    <button type="button" class="ds-input-number__step" data-step="1" aria-label="Augmenter">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M4 10l4-4 4 4"/></svg>
    </button>
    <button type="button" class="ds-input-number__step" data-step="-1" aria-label="Diminuer">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor"><path d="M4 6l4 4 4-4"/></svg>
    </button>
  </div>
</div>
```

## 8. Data visualisation

Distinct des 18 composants de base (§6) : ces composants affichent des séries de données réelles plutôt qu'un état statique. Premier élément construit : Chart (2026-07-02).

### Chart

1. **Rôle** : visualiser l'évolution d'un KPI dans le temps (ex "Nombre de clients payants" mois par mois). Répond à "dynamique", pas juste "position" (cf. Principe 5/§3, hiérarchie position > dynamique > détails).
2. **Anatomie** : `.ds-chart-card` (**carte définie**, `--card-border-defined`) > `.ds-chart-header` (`.ds-chart-heading` = eyebrow `type-data-label` **tracké** `--letter-spacing-label` [était `type-label` sans tracking — aligné aux autres eyebrows 2026-07-06] + titre `type-h2`, + bouton `.ds-button--subtle.ds-button--xs` "Ajouter une mesure") > `.ds-chart-shell` contenant le canvas de rendu (`lightweight-charts`, chargé en CDN — seul composant du DA System à dépendre d'une lib JS externe, tous les autres sont CSS/HTML statiques).
3. **Variantes** : aucune à ce jour — une seule forme (area chart avec ligne cible en pointillés).
4. **États** : hover affiche le crosshair + la valeur au point survolé. **`lastValueVisible: false` (2026-07-06)** — le badge de dernière valeur **chevauchait les labels d'axe** (collision visuelle), retiré ; la valeur courante se lit au point d'extrémité + au survol. **État vide câblé (2026-07-06)** : quand aucune mesure n'existe, le shell (`.ds-chart-shell--empty`, `place-items:center`) affiche le bloc `.ds-empty-state` (icône graphe + « Aucune donnée enregistrée » + « Le graphique s'affichera dès la première mesure enregistrée. »), **sans CTA** — l'action « Ajouter une mesure » reste le bouton du header (cf. §6 Empty state point 3). Le preview `chart.html` montre les deux états (avec données · vide).
5. **Tokens** : `--chart-header-gap/heading-gap/shell-min-height/axis-font-size`, `--chart-grid-line/axis-text/line-color/area-top/area-bottom/target-line/crosshair-line/crosshair-width/last-value-bg/last-value-text`, `--chart-line-width/target-line-width/point-radius/marker-radius/scale-margin`. Toutes les couleurs sont composées via `color-mix()` à partir des tokens neutres existants (`--color-text-primary` etc.) — zéro hex ajouté.
6. **Règles d'usage** : titre de carte = `type-h2` (même niveau que le titre de Modal, cf. §4.2 — pas `type-h3`, qui n'est assigné à aucun composant construit). Le bouton d'action du header est toujours `subtle`/`xs`, jamais `ghost` — il ne doit pas rivaliser visuellement avec les données (cf. §6 Button règle 6). Ligne cible toujours en pointillés discrets (`color-mix` 42% de `--color-text-primary`), jamais en couleur sémantique (même règle que Progress bar/Badge, zéro vert/rouge). Watermark de la lib désactivé (`attributionLogo: false`). **Axe (2026-07-06)** : borné `min: 0` — un count n'est jamais négatif (l'ancien `-20` était un artefact de scaling) — et `max = cible + ~10%` (`autoscaleInfoProvider`), pour montrer le chemin vers la cible sans le désert du haut.
7. **Erreurs à éviter** : ne pas coder de valeurs numériques en dur dans le JS (fontSize, lineWidth, radius, scaleMargins) — tout doit être lu depuis `tokens.css` via `getComputedStyle` au runtime (seul moyen de garder une lib JS externe alignée sur le système de tokens CSS). Ne pas laisser `fitContent()` seul pour le cadrage temporel — utiliser `setVisibleRange` sur les timestamps exacts des données.
8. **Exemple** :
```html
<article class="ds-chart-card">
  <div class="ds-chart-header">
    <div class="ds-chart-heading">
      <span class="type-data-label ds-chart-eyebrow">KPI global</span>
      <span class="type-h2 ds-chart-title">Nombre de client payant</span>
    </div>
    <button type="button" class="ds-button ds-button--subtle ds-button--xs ds-chart-add-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
      Ajouter une mesure
    </button>
  </div>
  <div class="ds-chart-shell">
    <div id="dsChartCanvas" class="ds-chart-canvas" aria-label="Évolution du KPI"></div>
  </div>
</article>
```
*(rendu via `chart.js` : lecture des tokens CSS au runtime, `LightweightCharts.createChart` avec `AreaSeries` + `createPriceLine` pour la cible.)*

### Calendar

1. **Rôle** : sélectionner une date (ex date d'une mesure KPI, date d'un jalon). Composant piloté par lib externe, contrairement à la logique "tout construit main" des composants de base.
2. **Anatomie** : `.ds-calendar-wrap` (carte, mêmes tokens que Card) > `<div id="...">` monté par `@calendarjs/ce` (composant `Calendar`, type `inline`). Le HTML interne (grille, nav, jours) est généré par la lib, pas par nous.
3. **Variantes** : aucune à ce jour. La lib supporte `range`/`time`/`picker` mais seul `inline` (mois statique) est câblé.
4. **États** : jour survolé (hover), jour sélectionné (fond orange plein), navigation mois précédent/suivant via **‹ ›** — la lib rend ces flèches en icônes Material verticales ↑/↓ (`expand_less`/`expand_more`), remplacées en CSS par `‹` (précédent) / `›` (suivant) via `::before` (ligature masquée par `font-size:0`), cohérent avec la date-nav du modal effort et l'attente utilisateur (changer de mois = horizontal, pas vertical). Le `<link>` Google Material Icons a été retiré de `calendar.html`, devenu inutile. Le titre "Mois" et "Année" (`button[data-view="months"]`/`[data-view="years"]`) ouvre un sélecteur mois/année, mais la lib ne donnait aucune affordance : ils reçoivent un **chip `surface-raised`** au repos (comme les champs interactifs du système : surface-raised = surface tappable) + hover, pour signaler qu'ils sont cliquables. Pas de chevron : il suggérerait à tort une liste déroulante alors que le clic ouvre un sélecteur en grille (mois/année). Pas de désactivation/plage invalide câblée.
5. **Tokens** : `--calendar-background/border/radius/shadow/padding/max-width`, `--calendar-dow-color/day-color/day-hover-background/day-selected-background/day-selected-text`. Ces tokens alimentent les `--lm-*` custom properties exposées par la lib (`--lm-main-color`, `--lm-font-color`, etc.) — la lib ne connaît pas nos tokens directement, `calendar.css` fait le pont.
6. **Règles d'usage** : locale FR posée via `calendarjs.setDictionary()` (pas de prop `locale` native dans la lib), semaine commence lundi (`startingDay: 1`), footer "Update" désactivé (`footer: false`) — un jour cliqué doit suffire, pas de confirmation supplémentaire qui alourdit le geste. **Aucun jour surligné au chargement** : la lib auto-sélectionne toujours "aujourd'hui" et n'expose aucune option pour le désactiver (`value:null` sélectionne quand même today) — `calendar.js` strip donc la sélection par défaut au montage ET après chaque nav de mois (via `MutationObserver`), jusqu'au premier clic réel de l'utilisateur (flag `userPicked` → observer déconnecté, sélection normale ensuite).
7. **Erreurs à éviter** : `--calendar-max-width` doit être ≥ à la largeur intrinsèque de la grille lib (7 colonnes fixes de 38px = 266px + padding lib 8px×2 + notre padding 16px×2 + bordure ≈ 316px). Sous ce seuil (280px au départ), les colonnes de droite débordaient hors de la carte — bug de marge trouvé en mesurant les cellules au navigateur, pas visible à l'œil au premier abord. Fixé à 320px. La lib style le jour sélectionné via `.lm-calendar-content>div[data-selected=true]` (spécificité CSS `0,2,1`) avec une couleur figée (`#eee`), **pas** couverte par ses propres `--lm-*` custom properties — un override `.ds-calendar-wrap [data-selected="true"]` seul ne suffit pas (spécificité `0,2,0`, perd la bataille). Il faut égaler/dépasser leur sélecteur exact. Vérifié en confirmant le rendu réel dans un navigateur, pas en supposant que les custom properties couvrent tout.
8. **Exemple** :
```html
<div class="ds-calendar-wrap">
  <div id="dsCalendar"></div>
</div>
```
*(rendu via `calendar.js` : `Calendar(el, { type: 'inline', startingDay: 1, footer: false })`, CDN `@calendarjs/ce` + `lemonadejs`.)*

### Calendar heatmap

1. **Rôle** : visualiser en un coup d'œil la cadence effort/résultat sur 4 semaines (28 jours), avec détail horaire au survol d'un jour renseigné. Composant métier au sens strict (couplé aux données KPI leading/lagging), mais classé ici car c'est un pattern de data visualisation réutilisable — porté depuis `dashboard/template.html` (`.vision-cal-grid` + `.vision-cal-popover`, déjà en prod et fonctionnel, contrairement au Calendar mois qui lui était cassé).
2. **Anatomie** : `.ds-heatmap-card` (carte) > `.ds-heatmap-stats` (résumé résultat/effort en tokens `type-label`/valeur) + `.ds-heatmap-panel` (`.ds-heatmap-grid` = 7 jours × 4 semaines de `.ds-heatmap-cell`/`.ds-heatmap-dot`, + `.ds-heatmap-popover` positionné en absolu, affiché au hover).
3. **Variantes de dot** : vide (`--heatmap-dot-color`, quasi invisible), actif générique (`--heatmap-dot-color-active`), résultat (`--heatmap-dot-color-result` = accent orange, taille plus grande + halo), aujourd'hui (anneau `--heatmap-dot-ring-today`). Un jour peut cumuler actif + aujourd'hui.
4. **États** : hover sur une cellule avec données → popover (badge type + date + bande horaire + bloc positionné selon l'heure réelle + badge delta vs mesure précédente + note optionnelle). Hover sur cellule vide → popover minimal "Aucun enregistrement". `mouseleave` de la grille entière ferme le popover.
5. **Tokens** : `--heatmap-day-label-color/cell-size/cell-radius`, `--heatmap-dot-*` (color/color-active/color-result/size/size-result/ring-result/ring-today), `--heatmap-band-*` (voir point 6), `--heatmap-popover-*` (width/background/border/radius/shadow/padding), `--heatmap-badge-*` et `--heatmap-delta-*` (result/effort), `--heatmap-schedule-block-*`, `--heatmap-hour-track-line`. Nouveau primitif ajouté : `--font-mono` (`"JetBrains Mono"`) — nécessaire pour les heures/deltas façon "données chiffrées", absent du système avant ce composant.
6. **Décision de design** : la prod utilise une bande "période écoulée" en ambre (`#B87820`), une 2e couleur de marque. **Neutralisée** dans le DA System (`--heatmap-band-border: var(--color-border-strong)`, pas de couleur) pour respecter le Principe 2 (un seul accent, un seul sens) — décision explicite de Nils, pas un oubli.
7. **Erreurs à éviter** : ne pas repositionner le popover en JS avec des coordonnées calculées en dur — il reste ancré (`right:-8px; top:calc(100% + gap)`) en CSS pur, la lib de tokens gère l'espacement. Ne jamais colorer un dot "effort" en rouge/vert selon performance (même règle que Progress bar/Badge/Chart) — seul le dot "résultat" porte l'accent orange, et uniquement parce que c'est LE type de mesure, pas un jugement de valeur.
8. **Exemple** :
```html
<div class="ds-heatmap-panel">
  <div class="ds-heatmap-grid" id="dsHeatmapGrid"></div>
  <div class="ds-heatmap-popover" id="dsHeatmapPopover"></div>
</div>
```
*(rendu via `calendar-heatmap.js` : génère 28 cellules statiques depuis un objet de données démo indexé par date ISO, construit le HTML du popover au `mouseenter` de chaque cellule `.ds-heatmap-cell--has-data`.)*

### Timeline

1. **Rôle** : panneau vertical listant les jalons d'un objectif dans l'ordre chronologique (rail année/mois · cercle · titre), avec l'état de chacun lisible d'un coup d'œil. Rendu **dynamiquement en JS depuis `localStorage`** (`carryit_v1_jalons`, `timeline.js`) : les états sont dérivés du statut (`completed` = validé ; premier `pending` = courant ; suivants = à venir). Chaque jalon est un `<button>` cliquable qui émet `carryit:jalon-open` — l'app branche l'ouverture de la vue du jalon.
2. **Anatomie** : `.ds-timeline` (carte panneau, **carte définie** partagée) > `.ds-timeline__head` (label « Jalons » + `.ds-timeline__count`) + `.ds-timeline__list` (`<ol>`, hauteur fixe `--timeline-list-height` → carte de dimensions constantes, scroll au-delà). Chaque `.ds-timeline__item` = grille 3 colonnes `date | dot | contenu` : `.ds-timeline__rail` (`.ds-timeline__year` affichée seulement quand l'année change + `.ds-timeline__month`), `.ds-timeline__marker` (`.ds-timeline__dot` + connecteur vertical en `::after` vers le dot suivant), `.ds-timeline__content` (**`<button>`** : `.ds-timeline__title` 2 lignes max + `.ds-timeline__jalon` « Jalon x/n »).
3. **États** (sur `.ds-timeline__item`, dérivés du statut) :
   - `.is-done` (validé) : dot = disque blanc plein + coche creusée (`::after`), année blanche, titre **barré + muted** (fait = ça recule), segment de connecteur au-dessus éclairci (`--timeline-line-done-color`).
   - `.is-current` (« tu es ici ») : double-dot blanc (centre plein + anneau concentrique), centre un peu plus petit que le dot de base (`--timeline-dot-size-current` 0.875rem — distinction par l'anneau, pas la taille) ; `aria-current="step"`.
   - `.is-selected` (cliqué) : rangée inversée (fond blanc, texte surface) ; posé après done/current avec spécificité relevée pour gagner sur le blanc forcé du courant.
   - Défaut (à venir) : dot gris creux, fond opaque qui masque le connecteur.
   - Le contenu est un bouton : hover/`focus-visible` = surbrillance `--button-ghost-background-hover` qui **déborde le texte sans décaler la mise en page** (padding = marge négative égale ; débord gauche réduit via `--timeline-row-lead-bleed` pour rester détaché du dot).
4. **Carte « Jalon actif »** (`.ds-jalon-active`, composant frère sous la timeline) : reprend le jalon en cours en **stepper horizontal J1→Jn** (`.ds-jalon-active__steps` > `.ds-jalon-active__step` avec `.is-done`/`.is-current`, mêmes dots/coche que la timeline). Eyebrow « Jalon actif · x/n » + titre du jalon. Le label sous chaque dot = **1er mot du titre** du jalon (`titre.trim().split(/\s+/)[0]`, ellipsis si long). `hidden` quand tout est validé (aucun jalon actif). Utilise aussi la **carte définie** partagée. **Fenêtre de 5 (le stepper horizontal n'a pas de scroll, contrairement à la liste verticale)** : ≤ 5 jalons → tous affichés, aucun décalage ; > 5 → fenêtre glissante qui tient le **courant en slot 2** (1 validé visible à gauche, 3 à venir à droite), décalée d'**1 cran par validation** (le plus vieux validé sort à gauche, le suivant entre à droite). En fin de liste (plus de place à droite), le courant dérive vers slot 3/4/5 pour montrer le dernier jalon. Formule : `start = clamp(curIdx − 1, 0, total − 5)` (si `total ≤ 5`, `total − 5 ≤ 0` ⇒ `start = 0` ⇒ tout affiché, auto-géré).
5. **Tokens** : `--timeline-padding/head-gap/row-gap/list-height/date-width/col-gap/content-gap` ; rail/cercles `--timeline-line-color` (+ `-done-color`)/`line-width`/`dot-size`/`dot-ring-width`/`dot-ring-color`/`dot-fill`/`dot-done-background` ; courant `--timeline-dot-size-current`/`dot-current-ring-gap`/`dot-current-ring-spread` ; coche `--timeline-check-width/height/stroke/inset-top` ; textes `--timeline-year-color` (+ `-done`)/`month-color`/`jalon-color` ; scroll/interaction `--timeline-shell-max-width`/`fade-size`/`mask-visible`/`scrollbar-width`/`scrollbar-thumb`/`transition`/`row-padding`/`row-lead-bleed`. Carte active : `--jalon-active-margin-top`/`padding`/`eyebrow-gap`/`title-gap`/`step-gap`. `.ds-timeline` et `.ds-jalon-active` utilisent la **carte définie** partagée (`--card-border-defined` / `--card-shadow-defined`).
6. **Règles d'usage** : ordre chronologique haut→bas (le plus tôt en haut) — **le tri est fait au rendu par `date` croissante** (`timeline.js`, `jalons.slice().sort` par date), jamais dépendant de l'ordre de stockage localStorage ; s'applique à la liste verticale ET au stepper « Jalon actif » (le plus tôt à gauche, le plus tard à droite). Le segment de connecteur *au-dessus* d'un jalon validé est éclairci → lecture « je suis arrivé jusqu'ici ». Un seul jalon `.is-current` (premier `pending`). L'année n'est affichée que lorsqu'elle change (groupée, pas de « 2026 » répété). Le fondu haut/bas (`.is-scrollable`) n'apparaît **que si** la liste déborde réellement (mesuré en JS via `scrollHeight`). Pas d'accent orange : l'état se lit par le texte/blanc/coche, pas par la couleur.
7. **Erreurs à éviter** : ne pas coder les dimensions du dot/rangée en dur — tout part des tokens (le centrage du dot sur la 1ère ligne du titre est calculé en `calc` depuis `--type-body-lg-line`). Ne jamais afficher l'année à chaque ligne. Le clic passe par le `<button>` (`.ds-timeline__content`), pas par la rangée entière → hover/sélection centrés sur le texte. Sur mobile, le padding du panneau bascule sur `--space-page-mobile`.
8. **Exemple** (markup généré par `timeline.js` — structure d'un item validé) :
```html
<article class="ds-timeline">
  <header class="ds-timeline__head">
    <span class="type-data-label">Jalons</span>
    <span class="ds-timeline__count type-data-label" data-timeline-count>5</span>
  </header>
  <ol class="ds-timeline__list" data-timeline-list>
    <li class="ds-timeline__item is-done">
      <div class="ds-timeline__rail">
        <span class="ds-timeline__year">2026</span>
        <span class="ds-timeline__month">Avr</span>
      </div>
      <div class="ds-timeline__marker" aria-hidden="true"><span class="ds-timeline__dot"></span></div>
      <button class="ds-timeline__content" type="button" data-jalon-id="j1">
        <span class="ds-timeline__title type-body-lg">Cadrage produit finalisé</span>
        <span class="ds-timeline__jalon type-body-sm">Jalon 1/5</span>
      </button>
    </li>
  </ol>
</article>
```

### Scheduler (QUAND)

1. **Rôle** : positionner un créneau horaire (effort ou résultat) sur une journée en le glissant/redimensionnant sur un rail vertical d'heures. Répond au "QUAND" d'une mesure KPI. Porté depuis `dashboard.html` (`#jalonKpiTimeline`), déjà en prod et fonctionnel.
2. **Anatomie** : `.ds-scheduler` > `.ds-scheduler__head` (label `type-data-label` "Quand" + `.ds-scheduler__summary` mono) + `.ds-scheduler__viewport` (fenêtre scrollable) > `.ds-scheduler__track` (`.ds-scheduler__hours` = N lignes heure, + `.ds-scheduler__block` positionné en absolu = créneau, avec `.ds-scheduler__resize` en poignée basse).
3. **Variantes** : le bloc porte un libellé de type ("Effort" / "Résultat" selon le contexte métier) — une seule forme visuelle.
4. **États** : bloc au repos (`grab`), en drag (`grabbing`), resize par la poignée basse, focus-visible (bloc = `role="slider"`). Auto-scroll du viewport quand le pointeur atteint un bord pendant le drag. Souris, tactile **et clavier** : le bloc est un `role="slider"` focusable (`aria-valuemin/max/now/valuetext`), ↑↓ déplacent de 15 min, Maj+↑↓ ajustent la durée, Home/End cadrent sur les bornes ; le créneau est annoncé via `aria-valuetext` + un summary `aria-live="polite"`. La poignée resize garde un grip visuel de 12px mais une **zone tactile de 24px** (`::before` transparent, WCAG 2.5.8 AA), token `--scheduler-resize-hit-extend`.
5. **Tokens** : `--scheduler-hour-height` (`calc(--space-48 + --space-8)` = 56px, composé de tokens car hors échelle 4/8 pure), `--scheduler-viewport-height` (`= hour-height × 4`, ~4h visibles sans scroll — arbitré entre lisibilité et hauteur totale du modal), `--scheduler-hour-label-width/color/font`, `--scheduler-hour-line`, `--scheduler-summary-color/font`, `--scheduler-block-inset-left/right/background/border/radius/padding/eyebrow-color/value-color`, `--scheduler-resize-handle-height/color`, `--scheduler-scrollbar-size/thumb/thumb-hover` (scrollbar du viewport stylé thin + tokenisé, sinon la scrollbar native blanche cassait le thème sombre), `--scheduler-edge-fade` (`--space-48` : le viewport porte un `mask-image` linear-gradient haut/bas de cette hauteur, dégradé long et doux pour éviter l'effet "barre" — les labels d'heure s'estompent progressivement au bord du scroll au lieu d'être coupés net ; le `#000` du masque est l'alpha structurel du mask, pas une couleur de design), `--scheduler-nav-color/color-hover` (partagés avec la nav date du modal).
6. **Règles d'usage** : `--scheduler-hour-height` est **lu au runtime depuis le DOM** en JS (`offsetHeight` d'une ligne d'heure) — jamais de `56` codé en dur dans le JS (même principe que Chart qui lit ses tokens via `getComputedStyle`). Snap au quart d'heure (0.25). La plage horaire (6→23) est une **config comportementale JS** (donnée), pas un token de style. `top`/`height` du bloc sont posés dynamiquement en px calculés (comme Progress bar pose son `scaleX` en prod).
7. **Erreurs à éviter** : ne pas coder la hauteur d'heure en dur dans le JS (désync avec le token CSS). Ne jamais colorer le bloc effort en vert/rouge selon "performance" (même règle que Chart/Progress/Badge) — le bloc porte l'accent neutre `text-primary`.
8. **Preview** : `preview/effort-modal.html` (intégré dans le modal "Ajouter un effort", cf. Composants métier ci-dessous).

## Composants métier

Premier assemblage propre à un écran CarryIT (distinct des composants de base/data viz réutilisables). Construit 2026-07-04.

### Effort modal ("Ajouter un effort")

1. **Rôle** : saisir une mesure de KPI (effort ou résultat) — quand, combien, note. Porté depuis le modal `jalonKpiMeasureModal` de `dashboard.html`.
2. **Composition** : Modal (`.ds-modal` shell + header + footer) + navigation date (`.ds-date-nav`, ‹ jour ›, destinée à ouvrir un Calendar) + Scheduler QUAND + Input number (Quantité) + Textarea (Note) + Buttons (Annuler `ghost` / Enregistrer `inverse`).
3. **Nature** : pattern métier, pas composant de base. Ses seules classes propres (`.ds-effort-modal*`, `.ds-date-nav*`) vivent dans `effort-modal.css` ; tout le reste réutilise tokens/composants existants.
4. **Tokens** : aucun token de couleur/taille nouveau au niveau modal — réutilise Modal / Input number / Scheduler / Textarea / Button. `.ds-date-nav` réutilise `--scheduler-nav-*`.
5. **Règles d'usage** : footer = 2 boutons (Annuler + Enregistrer) car c'est un formulaire (pas de `×`, donc "Annuler" n'est pas redondant, cf. règle Modal §6). Le bouton d'action est `inverse` (blanc), **pas** `primary` (orange) — l'orange reste réservé au CTA marketing/action unique, pas à un submit de formulaire dense (Principe 2).
6. **Accessibilité** : `role="dialog"` + `aria-modal` + `aria-labelledby`. Focus-trap JS (Tab reste dans le dialog, Maj+Tab wrap, Échap retire le focus) dans `effort-modal.js`. Scheduler opérable au clavier (cf. §Scheduler). Contraste des labels muted vérifié à 5.88:1 (> AA). Ouverture/fermeture réelle = câblage produit (non couvert ici).
7. **Preview** : `preview/effort-modal.html` (+ `.css` + `.js`).

### KPI card ("Effort / Résultat d'un jalon")

Construit 2026-07-05. Porté depuis `renderJalonKpiCardV2` de `dashboard.html`. **Refonte premium 2026-07-06** (réf = mockup stat-cards de Nils). Ce qui suit décrit la version COURANTE — source unique, pas d'empilement.

1. **Rôle** : afficher une mesure de jalon — soit l'**effort** (l'action mesurable qu'on répète), soit le **résultat** (la preuve mesurable que le jalon est atteint). Deux KPI max par jalon.
2. **Squelette premium unique, deux contextes.** Le premium vient de la **retenue + taille fixe + filet + delta pinné** — pas de plus de contenu (le diagnostic « pas premium » = **trop d'info**, la carte s'est allégée) :
   - **Structure** `.ds-kpi-card` — `flex column`, **taille FIXE** (`--kpi-card-width` 360 jalon / `--kpi-card-summary-width` 260 résumé) + `min-height` réservée → toutes les cartes identiques = grille régulière. De haut en bas :
     - **`.ds-kpi-card__head`** (`align-items:flex-start`) = **`.ds-kpi-card__labels`** à gauche [eyebrow `type-data-label` (type EFFORT/RÉSULTAT) + **nom** `.ds-kpi-card__name` `type-body-sm`, **UNE ligne, ellipsis** → alignement quelle que soit la longueur] + **`.ds-kpi-card__head-actions`** à droite (vue jalon) : crayon d'édition `.ds-row-action` puis **« Ajouter » = bouton défini `ds-button--ghost --xs`** (geste quotidien : ajouter une mesure). Le bouton est **flush au bord droit** = même marge que le texte à gauche (gutter symétrique, aligné au filet). Composant du système tel quel, aucun override (pas de carré bricolé, pas de reveal au survol).
     - **`.ds-kpi-card__metric`** = **valeur héros** `.ds-kpi-card__value` (40px `--type-display-size`, bold, `tabular-nums`, tracking `--letter-spacing-tight`, blanc — seule emphase, Principe 2) + **cible** `.ds-kpi-card__target` (`/ 15 h`, `type-body-md` muted).
     - **`<hr class="ds-kpi-card__divider">`** = filet `--border-subtle` qui coupe le héros du pied. **Air SYMÉTRIQUE** au-dessus/en-dessous (`--kpi-card-divider-gap` 24) — **le nombre ne doit jamais toucher le filet** (diagnostiqué au Playwright : gap au-dessus = 0 ⇒ « pas premium » ; fix = 24/24 symétrique). Contenu uniforme ⇒ cartes de même hauteur sans forçage.
     - **`.ds-kpi-card__footer`** (`space-between`) = **delta** `.ds-delta` (chip, gauche, **place FIXE**) · **fraîcheur** `.ds-kpi-card__meta` (droite).
   - **Retiré (trop d'info)** : la **barre de progression**, le **titre 2-lignes**, l'ancienne **pill flottante**. Le delta chip + la cible portent l'avancement.
   - **Deux variantes = même squelette** : **jalon** (360, header-actions) / **résumé `.ds-kpi-card--summary`** (260, lecture seule, **sans** header-actions, valeur réduite 28 `--type-h1-size`, **nom en blanc** pour trancher sur les gris de la tuile dense). Le résumé porte **aussi** delta + filet + footer (Nils veut le delta placé au même endroit en long terme).
   - **Une source par élément (pas de double couche)** : la classe `type-*` pilote la typo ; le CSS composant ne fait que **couleur / chrome / ellipsis / marges**, il ne re-déclare **jamais** un `font-size` déjà donné par la classe (piège corrigé 2026-07-06 : le titre portait `type-body-lg` ET re-fixait sa taille → l'étiquette mentait, un changement de l'échelle ne l'aurait pas suivi).
   - **Delta dynamique** : `.ds-delta` est une valeur calculée (longueur variable). Le chip **ne rétrécit jamais** (`flex-shrink:0`, info prioritaire) ; c'est la **fraîcheur qui tronque** (`text-overflow:ellipsis`) si la place manque.
   - **Fraîcheur monochrome** : « Mis à jour il y a Xj · {frequency} » en gris muted, **identique** effort/résultat (l'ambre `--color-warning` testé puis retiré — Nils veut les deux identiques). Carte strictement monochrome (orange = action only).

**Modèle de données KPI (source : backup produit, `carryit_v1_jalons[].kpis[]`)** — l'affichage ne fabrique rien, tout vient de l'objet KPI :
- `type` : `leading` → Effort / `lagging` → Résultat
- `titre` (= `label`) : nom du KPI (l'action à répéter / la preuve) → **titre** démoté
- `value` (= `valeur`) : valeur courante, calculée depuis `measures[]` selon `mode` (Cumulatif = somme/`total`, Instantané = dernière mesure) → **valeur** hero
- `target` (= `cible`) : cible → **`/ target`**
- `unit` (= `unite`) : unité LONGUE user-définie (ex. « H/entre chaque test ») — ne jamais inventer ni découper
- `unitShort` : unité **courte**. Affichage = **valeur (blanc) + cible en gris `/ cible unitShort`** : `51` + `/ 15 h`, `5` + `/ 15 testeurs`. La valeur seule est le héros ; `/ cible unitShort` est démoté (`.ds-kpi-card__target`, `type-body-lg` 16/400 muted — plus petit ET plus léger que le titre `type-h3`). `unitShort` : défaut **dérivé** `unit.split(/[\s\/]/)[0]` ; **override** si dérivation moche (« Beta testeur » → override « testeurs »). Sens complet dans le **titre**.
- `frequency` (= `frequence`) : période (« Hebdomadaire »…) → affichée + sert au calcul « en retard »
- `measures[]` (`{date, value, delta, total}`) : la plus récente `date` → « Mis à jour il y a Xj · {frequency} », toujours en gris muted (pas d'ambre)
- **Delta = `.ds-delta` (chip partagé, cf. section Delta)** : écart-à-cible, symétrique effort/résultat (le résultat, vraie preuve, ne doit pas être plus silencieux que l'effort). **Effort au-dessus du seuil** → `+36 h au-delà` (`valeur − cible`) ; **résultat sous le seuil** → `10 restants` (`cible − valeur`). Monochrome, pas de flèche, valeur **dynamique**. *Anti-vanity* : on met en avant le franchissement du seuil / le restant vers la preuve, pas l'activité brute.
3. **Nature** : composant métier. Classes `.ds-kpi-card*` dans `kpi-card.css` ; réutilise **Delta (chip) / Button / row-action / tokens type**. `badge.css` **PAS lié** (le delta n'est plus une pill de statut).
4. **Tokens** : `--kpi-card-*` — `--kpi-card-width` 360 / `--kpi-card-min-height` / `--kpi-card-footer-gap` (filet→pied) ; padding vue jalon = `--card-padding` (24) ; grid-gap (24) ; `--kpi-card-metric-gap` (head→valeur) ; résumé `--kpi-card-summary-width` 260 / `--kpi-card-summary-min-height` / **padding `--kpi-card-summary-padding` (16)** — la variante compacte (bande long terme) descend **sous** le standard 24 (règle « variante compacte = padding sous standard ») ; dans cette bande, la carte Jalon actif reprend ce même 16 pour un inset homogène / valeur `--type-h1-size` (28) ; couleurs eyebrow/name/meta/target/value/define. Le chip delta réutilise `--delta-*` (chrome = `--badge-*`). Aucun accent couleur.
5. **Règles d'usage (Principe 2)** : la **valeur** est l'emphase (héros 40/bold blanc), la **cible démotée en gris**. Le **delta chip** accroche l'œil en second (fond surélevé monochrome) sans voler la vedette au nombre. Strictement monochrome (orange = **action** only). Distinction effort/résultat par **eyebrow + delta**, jamais par couleur ni icône de type (teal prod `#5BAEC9` écarté). Bouton d'action = **`ds-button--ghost`** (monochrome, contour) flush au bord droit — pas d'orange sur la carte, l'orange reste au CTA de conversion.
6. **Accessibilité** : boutons édition/action avec `aria-label` ; icônes `aria-hidden`, `stroke-width` par token ; filet = `<hr>` décoratif.
7. **Preview** : `preview/kpi-card.html` (+ `.css`). Vue jalon (effort · résultat · **effort à définir** · **résultat à définir**) + Vue long terme (résumé lecture seule). Toutes cartes = **taille fixe**, delta **pinné au pied**.
8. **État vide (pédagogique)** : quand un KPI n'est pas défini, la carte affiche une copy qui **explique le type** + bouton pointillé « Définir… ». **Effort** = « Ce que tu fais pour faire augmenter ton résultat. » **Résultat** = « Définit un indicateur pour savoir ton avancée par rapport à ton objectif à moyen terme. » (Copy figée par Nils.)

### Jalon card ("Jalon actif / statut")

Construit 2026-07-05. Porté depuis `db-active-jalon-card` + `buildJalonDetailCard` de `dashboard.html`.

1. **Rôle** : représenter un jalon dans son état (en cours / terminé / à venir) avec son avancement de tâches et l'accès au détail.
2. **Composition** : head (méta `Jalon n/N · Mois n` + statut pill `.ds-jalon-status`) / titre + date / avancement des tâches (label + count + Progress bar) / CTA "Voir le jalon →".
3. **Nature** : composant métier. Classes propres `.ds-jalon-card*` / `.ds-jalon-status*` dans `jalon-card.css` ; réutilise Progress bar / tokens. **Passe premium (2026-07-06)** : **carte définie** (`--card-border-defined` / `--card-shadow-defined`), meta/eyebrow tracké via `--letter-spacing-label`. Statut (label + dot, orange réservé à l'actif) inchangé.
4. **Tokens** : `--jalon-card-*` et `--jalon-status-*` (dot + texte par statut). Seul le statut **actif** utilise l'orange (`--color-accent-primary`) sur son dot — c'est le jalon-action du moment, usage conforme Principe 2. Terminé/à venir = contraste neutre (muted / border-strong).
5. **Règles d'usage** : le statut se lit au **contraste + label + couleur du dot**, jamais à un fond de carte coloré. Card entière cliquable (`cursor:pointer`, `tabindex="0"`, `aria-label` décrivant statut + titre).
6. **Accessibilité** : Progress bar `role="progressbar"` + aria-value. `aria-label` sur l'article (statut lisible sans la couleur seule). Focus visible via `border-active`.
7. **Preview** : `preview/jalon-card.html` (+ `.css`). 3 états : actif, terminé, à venir.

### KPI history ("Historique des mesures d'un KPI")

Construit 2026-07-05. Extrait le « delta/tendance/historique » de §8 en composant autonome (auparavant seulement dans le popover du Calendar heatmap).

1. **Rôle** : lecture **discrète** de l'historique d'un KPI — chaque mesure saisie (`measures[]`) = une ligne. Complémentaire du **Chart** (courbe continue de l'évolution) : le Chart montre la tendance visuelle, l'history donne les valeurs exactes et le pas-à-pas. Répond à l'action produit « Avoir accès à son historique de KPI » (KPI.md §7).
> **⚠️ REFONTE PREMIUM (2026-07-06).** Passé de la lecture "date│valeur│delta caret ▲▼" à un **relevé éditable** (longue itération avec Nils, réf visuelle = table "ACTIVITY"). Les points 2–7 décrivent la version COURANTE.

2. **Anatomie** : `.ds-kpi-history` (**carte définie**, `--card-border-defined`) > `.ds-kpi-history__head` (eyebrow `type-data-label` « Historique · {fréquence} » + titre `type-h3`) > **en-têtes** `.ds-kpi-history__cols` (`DATE` · `VALEUR`, séparés par **`border-strong`** qui pose le tableau) > `.ds-kpi-history__list` (`<ol>`, récent en haut) > `.ds-kpi-history__row` (relevé : `.ds-kpi-history__main` [date · valeur droite · actions] + `.ds-kpi-history__note` pleine largeur dessous).
3. **Ligne = relevé** : `date` (leading, gauche, blanc medium, colonne fixe `--kpi-history-date-width` 7rem) ··· `valeur` **poussée à droite** (`type-body-md` bold, `tabular-nums` = colonne vertébrale scannable) + unité muted. Bornée aux deux bords → **plus de désert horizontal**. **Note** en dessous, **pleine largeur alignée au bord gauche** (annotation de la mesure, même texte que le popover heatmap), visible si présente — jamais dans une sous-colonne (elle flotterait au milieu). **Plus de delta** (le Chart porte la tendance).
4. **Actions au survol** (gouttière droite, révélées au hover/focus de la ligne) : ✎ **éditer** · 🗑 **supprimer**. **Édition inline = effort modal RÉUTILISÉ, pré-rempli** (date · bloc de travail/scheduler · valeur · note), footer **Annuler / Enregistrer** — le supprimer vit sur la ligne (🗑), pas dans le modal (pas de redondance). **Une seule porte d'édition = la même que la création** (l'édition reflète la création).
5. **Nature** : composant métier. Classes `.ds-kpi-history*` dans `kpi-history.css` + `kpi-history.js` (toggle édition, format date FR). Réutilise **carte définie + effort modal** + `type-*`. Tokens `--kpi-history-*` (padding = `--card-padding`, head-gap, cols-gap, row-padding-block, col-gap, `date-width` 7rem, `date-color` **primary**, note-color/note-gap, unit-color, value-input-width, row-border). Monochrome, token-pur.
6. **Accessibilité** : `<ol>` (ordre chronologique), actions `aria-label`, modal d'édition `role="dialog"`. Contraste muted vérifié > AA.
7. **Preview** : `preview/kpi-history.html` (+ `.css` + `.js`). 5 mesures, une ligne en édition + le modal. Diagnostic **mesuré au Playwright** (crop HD + positions) : c'est en comparant `value_right_edge` vs `card_right_edge` qu'on a identifié le désert de 369px qui tuait le premium.
8. **État vide câblé (2026-07-06)** : aucun relevé → le head reste, puis `.ds-empty-state.ds-kpi-history__empty` (icône + « Aucune mesure enregistrée » + « Ajoute une première mesure pour démarrer le suivi de ce KPI. » + **CTA « Ajouter une mesure »**). Le CTA est présent ici car le head ne porte pas de bouton d'ajout (cf. §6 Empty state point 3). Le preview montre les deux états (avec relevés · vide).

### SMART card ("Objectif SMART")

Construit 2026-07-07. Présente l'objectif de l'utilisateur, décomposé en cinq dimensions **S / M / A / R / T**.

1. **Rôle** : afficher l'objectif SMART (le sommet, au-dessus des jalons) en un panneau compact et scannable — chaque dimension sur sa ligne : Spécifique, Mesurable, Atteignable, Réaliste, Temporel.
2. **Anatomie** : `.ds-smart` (**carte définie**, colonne étroite ~320px) > `.ds-smart__head` (label `SMART` + bouton **Modifier** `ds-button--subtle` + crayon, séparés par un filet) > `.ds-smart__list` (`<ol>`) > 5 × `.ds-smart__row` = grille `lettre | body`. `.ds-smart__letter` (S/M/A/R/T, colonne étroite, muted). `.ds-smart__body` = `.ds-smart__dimension` (le mot de la dimension en `type-data-label` **blanc** → ancrage structurel) + `.ds-smart__text` (la valeur).
3. **Hiérarchie du contenu** (Principe 3 — taille + graisse + couleur combinées, la couleur seule ne se voit pas en dark) : **S** = `--lead` (blanc, semibold) = l'objectif headline ; **M / T** = `--fact` (blanc) = faits durs (KPI, échéance) ; **A / R** = `--muted` (démoté) = justification. Les labels de dimension sont blancs pour poser la structure.
4. **Overflow — expand inline (accordéon)** : A/R sont réduits à 2 lignes (`--clamp`, `-webkit-line-clamp`) → carte **compacte par défaut** (le dashboard tient à l'écran au repos, Principe 5). Un **« Voir plus ⌄ »** (injecté par JS **seulement** si le texte déborde, mesuré) déplie le texte **inline** (`.is-expanded`), chevron pivoté + « Voir moins ⌃ ». La carte grandit et la page peut scroller — **accepté** : un scroll vertical déclenché par une action user est standard/premium ; la règle « zéro scroll » ne vaut que pour le dashboard **au repos**, pas après un clic de dépliage. Vérifié : carte 529px collapsée → 619px dépliée. Le Modal, le popover flottant et le scroll interne par champ ont été **essayés puis écartés** (trop lourd / moche / affordance illisible) au profit de l'accordéon.
5. **Nature** : composant métier. Classes `.ds-smart*` dans `smart.css` + `smart.js` (mesure du débord → injection du bouton, toggle `.is-expanded`). Réutilise **carte définie + Button subtle**. Tokens `--smart-*` (padding = `--card-padding`, head-gap, row-padding, col-gap, letter-width/size/line/weight/color, text-color + variantes lead/fact/muted, dimension-gap, clamp-lines, more-gap/icon-gap/icon-size/color/color-hover). Monochrome, token-pur.
6. **Accessibilité** : `<ol>` (les 5 dimensions), bouton `aria-expanded` synchronisé avec l'état déplié. Contraste muted vérifié > AA.
7. **Preview** : `preview/smart.html` (+ `.css` + `.js`). Contenu de démo = l'objectif « 1000 clients mensuels ». Le déplié se déclenche depuis « Voir plus » d'Atteignable/Réaliste.

## Patterns

Comportements récurrents qui assemblent des composants pour une intention qui revient (distinct d'un composant = brique, et d'un template = écran). Le pattern fixe *quels composants, dans quel ordre, avec quelles règles* → même comportement partout dans l'app.

### Confirmation ("Supprimer / Valider")

Construit 2026-07-07.

1. **Rôle** : avant une action **importante ou irréversible** (supprimer un jalon/tâche/KPI/mesure ; valider un jalon), demander de confirmer. Garantit que *chaque* action sensible de l'app se comporte pareil (même dialogue, même wording, même couleur, même clavier).
2. **Recette** : Modal (`role="alertdialog"` + `aria-labelledby` + `aria-describedby`) > `.ds-modal__header` (question courte, ex « Supprimer ce jalon ? ») + `.ds-modal__body` (`.ds-confirm__desc` = la conséquence, ex « Cette action est définitive… ») + `.ds-modal__footer` (**[Annuler]** `ghost` + **[action]**).
3. **Variantes d'action** : **destructif** → bouton **`ds-button--danger`** (rouge, status color — **pas** l'accent orange) ; **validation/positif** → bouton **`ds-button--inverse`** (blanc). Un seul dialogue (`.ds-confirm`), configuré par le déclencheur (`data-title` / `data-desc` / `data-action-label` / `data-action-variant`).
4. **Règles** : **focus par défaut sur Annuler** (choix sûr), Échap annule, clic backdrop annule, focus renvoyé sur le déclencheur à la fermeture. Le dialogue est plus **étroit** qu'un form modal (`--confirm-max-width` 420px). L'action réelle (supprimer/valider) = câblage produit.
5. **Nouveau composant** : bouton **`ds-button--danger`** ajouté (tokens `--button-danger-*`) — bordé/restreint (rouge texte + bordure, fond au hover), pas de fill plein, cohérent avec la retenue du système. Réutilisable pour toute action destructive.
6. **Preview** : `preview/confirm.html` (+ `.css` + `.js`). Deux déclencheurs : « Supprimer un jalon » (destructif rouge) · « Valider un jalon » (positif blanc).

### Skeleton ("Chargement")

Construit 2026-07-07.

1. **Rôle** : pendant le fetch de la donnée, afficher des **placeholders qui miment la forme du contenu réel** (pas un spinner générique) → l'utilisateur perçoit la structure qui arrive, le chargement paraît plus court. À afficher tant que la donnée n'est pas là, remplacé par le vrai contenu au chargement.
2. **Primitive** : `.ds-skeleton` (bloc gris `--skeleton-base` + un **reflet** `--skeleton-sheen` qui balaie via `background-position`, `@keyframes ds-skeleton-sheen`). Variantes `--text` (ligne, arrondi plein, hauteur `--skeleton-text-height`), `--circle` (avatar/dot), + largeurs utilitaires `--w-full/-3-4/-1-2/-1-3/-1-4` (évite tout `style=""` inline dans les placeholders).
3. **Assemblage = une forme par vue CarryIT** (le squelette copie la vraie mise en page pour éviter le saut visuel) : **long terme** (`.sk-longterme` : SMART + timeline côte à côte + 2 KPI résumé), **moyen terme** (`.sk-jalon` : meta + titre + critère + 2 KPI), **to-do list** (`.sk-todo` : tâches + sous-tâches indentées). Sous-blocs mutualisés `.sk-card`/`.sk-stack`/`.sk-row`/`.sk-between`, formes `.ds-skeleton--title/--value/--dot/--check/--avatar`.
4. **Accessibilité** : `@media (prefers-reduced-motion: reduce)` → balayage coupé, bloc statique. Les conteneurs placeholder portent `aria-hidden="true"` (rien à annoncer tant que vide).
5. **Nature** : pattern pur CSS (zéro JS). Tokens `--skeleton-*`. Monochrome, token-pur.
6. **Preview** : `preview/skeleton.html` (+ `.css`). Primitives · 2 cartes KPI en chargement · liste en chargement.

## À venir

Sections non commencées (décisions produit pas encore prises, nécessitent une session dédiée) :
- **5. Composants métier** — Effort modal (2026-07-04), KPI card (2026-07-05), Jalon card (2026-07-05), **SMART card (2026-07-07)** faits, cf. section "Composants métier". **Reste : le shell « Jalon détail »** (vue d'un jalon : header meta + titre + échéance + critère de validation + Valider ce jalon + ⋯ ; les KPI cards et la task list s'y branchent, déjà faites). Task row : déjà couvert par `task-list.html`/`task-list.css` (§6 "Task list imbriquée" — checkbox + grip + disclosure + titre + count + actions ⋯/supprimer, tâche ET sous-tâche). Reste éventuel : une carte de tâche « standalone » hors tableau si un écran le demande, pas nécessaire tant que la task list couvre le besoin. Distinct des composants de base ci-dessus (composant de base = brique atomique réutilisable partout, composant métier = assemblage propre à un écran CarryIT).
- **6. Patterns** — **Confirmation + Skeleton (2026-07-07) faits** (cf. section "Patterns"). Création/édition via form modal = instance faite (`effort-modal`), à formaliser. État vide = fait (`empty-state`). Feedback = fait (`toast`). **Reste : erreur de page** (dépend du backend, plus tard). **Filtre/recherche = écarté** (pas nécessaire pour CarryIT). Onboarding = plus tard.
- **7. Templates d'écran** — Dashboard principal, page de détail, formulaire de création/édition. Dépend de la grille/largeurs de page réelles du produit, pas encore définies (cf. §4.3, largeurs de shell actuelles sont des valeurs de preview, pas des tokens produit — à faire au moment de construire les Templates, pas avant).
- **8. Data visualisation** — Chart fait (2026-07-02), Calendar fait (2026-07-02), Calendar heatmap fait (2026-07-02), **KPI history fait (2026-07-05)** — historique/delta des `measures[]` en composant autonome (cf. section « KPI history »). **États vides Chart/history câblés (2026-07-06)** — réutilisent `.ds-empty-state`. Reste : un badge tendance/delta réutilisable hors contexte carte si un écran le demande.
- **9. Accessibilité (règles globales consolidées)** — chaque composant a ses règles listées ci-dessus, mais pas de section transverse dédiée (tailles cliquables minimales, navigation clavier globale, aria patterns communs).
- **10. Documentation** — modèle de doc réutilisable pour les futurs composants.
- **11. Gouvernance** — convention de nommage, quand créer vs réutiliser, gestion des exceptions, versionning.

**Les 16 composants de base officiels du gabarit §4 sont tous construits (Empty state fait le 2026-07-02).**

Backlog restant (voir tasks du projet) : Chart/Graphique KPI fait (2026-07-02). Table lignes imbriquées (sous-tâches) fait — construit directement dans `task-list.css/html` (§6 "Task list imbriquée") plutôt que dans des fichiers `nested-table.*` séparés (ceux-ci sont restés vides puis ont été abandonnés). Calendrier fait (2026-07-02, deux formes : `calendar.html` sélection de date via `@calendarjs/ce`, `calendar-heatmap.html` tracker effort/résultat porté depuis `dashboard/template.html`). Timeline rail+dots fait (2026-07-02, `timeline.html`, porté depuis `jalons.html`). Scheduler horaire (`QUAND`, bloc draggable/resize, souris+tactile) fait (2026-07-04, porté depuis `dashboard.html#jalonKpiTimeline`, intégré dans `effort-modal.html`). Harmonisation des icônes de production : terminée (cf. `icons.md`, toutes les intentions avec variantes concurrentes tranchées : Chevron/Fermer/Plus/Corbeille/Édition/Retour, + les intentions à variante unique validées : Calendrier/Rafraîchir/Presse-papier/Kanban/Liste/Utilisateur).
