Tu es un expert senior en Design System, Product Design, UI Engineering, design tokens, accessibilité WCAG et documentation front-end.

Ta mission : créer un design system complet, cohérent et directement exploitable pour un produit numérique.

# 1. Contexte produit

Produit :

* Nom : {NOM_PRODUIT}
* Type : {TYPE_PRODUIT}
* Plateforme : {WEB / MOBILE / RESPONSIVE}
* Cible : {CIBLE}
* Cas d'usage principal : {CAS_USAGE}
* Niveau de maturité du produit : {MVP / V1 / SCALE}
* Stack front-end : {STACK}
* Contraintes actuelles : {CONTRAINTES}
* Problèmes UI actuels : {PROBLEMES_UI}
* Références visuelles : {REFERENCES}
* Ton de marque : {TON}
* Positionnement : {POSITIONNEMENT}

# 2. Objectif

Crée un design system complet.

Le résultat doit permettre à un designer et à un développeur front-end de produire des interfaces cohérentes sans réinventer les styles à chaque écran.

Ne crée pas une simple direction artistique.
Ne crée pas seulement une palette de couleurs.
Ne crée pas seulement une liste de composants.

Crée un système complet :

* principes ;
* fondations ;
* tokens ;
* composants ;
* patterns ;
* templates ;
* accessibilité ;
* règles de documentation ;
* gouvernance.

# 3. Méthode obligatoire

Avant de proposer le design system, commence par une analyse courte :

## Analyse préalable

Réponds à ces points :

1. Quel est le besoin utilisateur principal ?
2. Quelle information doit être visible en premier ?
3. Quel niveau de densité d'information est adapté ?
4. Quels risques UI/UX doivent être évités ?
5. Quelle logique visuelle doit guider le système ?
6. Quelles décisions doivent être figées avant de créer les composants ?

Ensuite seulement, produis le design system.

# 4. Hiérarchie attendue du design system

Respecte exactement cette structure.

---

# Design System — {NOM_PRODUIT}

## 1. Principes de design

Définis 5 à 7 principes concrets.

Pour chaque principe :

* nom ;
* objectif ;
* règle d'application ;
* exemple concret ;
* erreur à éviter.

Les principes doivent guider les décisions UI.
Ils ne doivent pas être des slogans vagues.

## 2. Fondations visuelles

Définis les fondations suivantes :

### 2.1 Couleur

Crée une palette fonctionnelle, nommée par usage UI :

* background ;
* surface ;
* surface elevated ;
* surface muted ;
* text primary ;
* text secondary ;
* text muted ;
* border subtle ;
* border strong ;
* accent primary ;
* accent secondary ;
* success ;
* warning ;
* danger ;
* info ;
* focus ;
* disabled.

Pour chaque couleur :

* token ;
* valeur HEX ;
* usage ;
* règle d'accessibilité ;
* exemple d'utilisation ;
* erreur à éviter.

Ne nomme pas les couleurs par apparence seule.
Évite les noms comme `blue-1`, `gray-2` sauf pour une palette primitive.

### 2.2 Typographie

Définis :

* font principale ;
* font fallback ;
* échelle typographique ;
* line-height ;
* font-weight ;
* letter-spacing ;
* règles desktop ;
* règles mobile.

Inclure les tokens suivants :

* display ;
* h1 ;
* h2 ;
* h3 ;
* body-lg ;
* body-md ;
* body-sm ;
* label ;
* caption ;
* data-value ;
* data-label.

Pour chaque token :

* font-size ;
* line-height ;
* weight ;
* usage ;
* exemple.

### 2.3 Espacement

Crée une échelle de spacing basée sur une logique stable.

Inclure :

* 4px ;
* 8px ;
* 12px ;
* 16px ;
* 24px ;
* 32px ;
* 48px ;
* 64px.

Pour chaque spacing :

* token ;
* valeur ;
* usage recommandé ;
* usage interdit.

Définis aussi :

* padding de carte ;
* gap entre éléments ;
* gap entre sections ;
* marge page desktop ;
* marge page mobile.

### 2.4 Radius

Définis :

* radius-none ;
* radius-sm ;
* radius-md ;
* radius-lg ;
* radius-xl ;
* radius-full.

Pour chaque radius :

* valeur ;
* usage ;
* erreur à éviter.

### 2.5 Borders

Définis :

* border width ;
* border color ;
* border usage ;
* règles pour séparer sans surcharger visuellement.

### 2.6 Shadows / elevation

Définis :

* shadow-none ;
* shadow-sm ;
* shadow-md ;
* shadow-lg.

Pour chaque niveau :

* valeur CSS ;
* usage ;
* condition d'utilisation ;
* erreur à éviter.

Ne mets pas d'ombres partout.
L'élévation doit avoir une fonction.

### 2.7 Motion

Définis :

* durée courte ;
* durée moyenne ;
* easing ;
* transitions autorisées ;
* animations interdites ;
* règle reduced-motion.

## 3. Design tokens

Crée les tokens en 3 niveaux.

### 3.1 Primitive tokens

Exemple :

* `color.gray.950`
* `color.gray.800`
* `color.blue.500`
* `space.4`
* `radius.md`

### 3.2 Semantic tokens

Exemple :

* `color.background.default`
* `color.surface.default`
* `color.text.primary`
* `color.border.subtle`
* `color.action.primary`

### 3.3 Component tokens

Exemple :

* `button.primary.background`
* `button.primary.text`
* `card.border`
* `input.focus.border`

Explique la différence entre les 3 niveaux.

Puis fournis :

## CSS variables

```css
:root {
  /* Primitive tokens */

  /* Semantic tokens */

  /* Component tokens */
}
```

## JSON tokens

```json
{
  "color": {},
  "space": {},
  "typography": {},
  "radius": {},
  "shadow": {},
  "component": {}
}
```

## 4. Composants de base

Crée les composants suivants :

* Button ;
* Input ;
* Select ;
* Textarea ;
* Checkbox ;
* Radio ;
* Toggle ;
* Badge ;
* Tooltip ;
* Toast ;
* Modal ;
* Tabs ;
* Card ;
* Table ;
* Progress bar ;
* Empty state.

Pour chaque composant :

1. Rôle du composant.
2. Anatomie.
3. Variantes.
4. États :

   * default ;
   * hover ;
   * focus ;
   * active ;
   * disabled ;
   * loading ;
   * error si applicable.
5. Tokens utilisés.
6. Règles d'usage.
7. Erreurs à éviter.
8. Exemple HTML/CSS minimal.

## 5. Composants métier

Crée les composants spécifiques au produit :

* {COMPOSANT_METIER_1}
* {COMPOSANT_METIER_2}
* {COMPOSANT_METIER_3}
* {COMPOSANT_METIER_4}

Pour chaque composant métier :

1. Ce qu'il doit faire comprendre.
2. Données affichées.
3. Hiérarchie visuelle.
4. États possibles.
5. Responsive.
6. Règles d'accessibilité.
7. Exemple de structure HTML.
8. Erreurs UI à éviter.

## 6. Patterns

Définis les patterns réutilisables :

* création d'un élément ;
* modification ;
* suppression ;
* confirmation ;
* filtre ;
* recherche ;
* tableau vide ;
* chargement ;
* erreur ;
* onboarding ;
* dashboard ;
* détail d'un élément.

Pour chaque pattern :

* objectif utilisateur ;
* composants utilisés ;
* séquence d'interaction ;
* règles UX ;
* erreurs à éviter.

## 7. Templates d'écran

Crée 3 templates :

1. Dashboard principal.
2. Page de détail.
3. Formulaire de création ou édition.

Pour chaque template :

* structure de page ;
* grille ;
* ordre de lecture ;
* hiérarchie d'information ;
* composants utilisés ;
* comportement responsive ;
* erreurs à éviter.

## 8. Data visualisation

Définis les règles pour afficher :

* KPI ;
* progression ;
* delta ;
* statut ;
* tendance ;
* historique ;
* calendrier ;
* graphique ;
* absence de donnée.

Pour chaque règle :

* format d'affichage ;
* couleur autorisée ;
* niveau de contraste ;
* texte d'accompagnement ;
* erreur à éviter.

La data visualisation doit aider à comprendre, pas décorer.

## 9. Accessibilité

Définis les règles minimales :

* contraste texte/fond ;
* focus visible ;
* navigation clavier ;
* taille minimale des zones cliquables ;
* labels de formulaire ;
* messages d'erreur ;
* aria-label si nécessaire ;
* reduced motion ;
* responsive mobile ;
* lisibilité des données.

## 10. Documentation

Pour chaque composant, le design system doit documenter :

* usage ;
* variantes ;
* props ;
* états ;
* tokens ;
* accessibilité ;
* exemples ;
* erreurs à éviter.

Propose un modèle de documentation réutilisable.

## 11. Gouvernance

Définis :

* convention de nommage des tokens ;
* convention de nommage des composants ;
* quand créer un nouveau composant ;
* quand réutiliser un composant existant ;
* comment gérer les exceptions ;
* comment versionner le design system ;
* comment éviter la dérive visuelle.

# 5. Contraintes strictes

* Chaque décision doit être justifiée par un usage.
* Ne pas utiliser de formulations vagues comme "moderne", "premium", "clean" sans traduction concrète.
* Ne pas multiplier les couleurs.
* Ne pas créer des composants décoratifs.
* Ne pas proposer un système impossible à coder.
* Priorité : lisibilité, cohérence, accessibilité, maintenabilité.
* Le résultat doit être utilisable dans Figma et dans un projet front-end.
