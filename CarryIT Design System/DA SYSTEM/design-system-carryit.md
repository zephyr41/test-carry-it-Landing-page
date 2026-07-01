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

`surface.elevated` et `surface.muted` retirés : pas de token sans cas d'usage réel identifié (Principe 7). Élévation d'un modal/dropdown/tooltip = `shadow` + `border.strong`, pas une couleur de fond différente. Si un vrai besoin de zone désaccentuée apparaît plus tard (ex: état désactivé dans le Kanban), on l'ajoutera à ce moment-là.

Preview : `preview/colors-neutrals.html`

**Texte (verrouillé) :**

| Token | Valeur | Contraste vs background | Usage |
|---|---|---|---|
| `color.text.primary` | `#F2F1EC` | ≈16:1 vs surface / ≈17.5:1 vs background (AAA) | texte principal |
| `color.text.secondary` | `#909095` | ≈5.69:1 vs surface / ≈6.2:1 vs background (AA, marge réelle) | labels, meta, légendes |
| `color.text.muted` | `#5C5C60` | ≈2.72:1 vs surface (volontairement < AA) | placeholder / texte désactivé uniquement — jamais du texte lisible actif |

**Border (verrouillé) — width 1px partout, standard Apple HIG/hairline :**

| Token | Valeur | Contraste vs surface | Usage |
|---|---|---|---|
| `color.border.subtle` | `rgba(255,255,255,0.08)` | — (décoratif, pas de seuil requis) | séparateur discret, ne marque jamais seul une limite fonctionnelle |
| `color.border.strong` | `#7A7A80` | ≈4.24:1 | limite fonctionnelle (carte active, input, dropdown flottant) — satisfait WCAG 1.4.11 (non-text contrast) |

Preview : `preview/colors-neutrals.html`

Reste à définir : accent primary/secondary, success/warning/danger/info, focus, disabled.
