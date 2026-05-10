# Architecture du site Carry IT

Ce repo reste un site statique deployable directement depuis la racine.

## Pages publiques

Les fichiers HTML de premier niveau restent a la racine pour conserver les URLs existantes :

- `index.html` : landing page
- `dashboard.html` : dashboard principal
- `objectif.html` : creation d'objectif
- `jalons.html` : planification des jalons
- `jalon.html` : prototype/experience jalon
- `mentions-legales.html` : mentions legales
- `dashboardV2.html` : variante dashboard

## Dossiers

- `assets/css/` : feuilles de style publiques.
- `assets/fonts/rifton/` : police Rifton et licence.
- `assets/images/site/` : images, videos et pictos du site.
- `content/copywriting/` : contenus de copywriting et notes UX.
- `docs/product/` : documentation produit.
- `docs/references/` : references externes, branding et documents source.
- `docs/planning/` : plans de travail locaux ignores par Git.
- `prompts/` : prompts et instructions IA.
- `prototypes/` : pages experimentales non exposees comme routes principales.
- `templates/email/` : templates email.

## Regle de rangement

Garder a la racine uniquement les routes HTML publiques et les fichiers requis par l'hebergement statique (`CNAME`, `.nojekyll`, `.gitignore`). Tout fichier support doit aller dans un dossier metier ou technique explicite.
