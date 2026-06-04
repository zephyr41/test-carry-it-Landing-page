# Architecture du site Carry IT

Ce repo reste un site statique deployable directement depuis la racine.

## Vue simple

Il faut lire le repo en 4 zones :

1. **Actif** : les pages que tu ouvres et modifies souvent.
2. **Copy / regles** : les textes d'aide, le discours produit, les fichiers de cadrage.
3. **References** : les sources, guides, documents externes.
4. **Archive / prototypes** : tout ce qui sert a tester, comparer, ou conserver un historique.

## Actif

Ces fichiers doivent rester visibles en premier :

- `index.html` : landing page
- `dashboard.html` : dashboard principal
- `objectif.html` : creation d'objectif
- `jalons.html` : planification des jalons
- `jalon.html` : prototype/experience jalon
- `mentions-legales.html` : mentions legales

Variante de travail, a traiter comme secondaire :

- `archive/dashboardV2.html`
- `archive/mockup-presentation-produit.html`
- `archive/presentation-product.html`

## Copy / regles

Le copywriting utile au quotidien est ici :

- `content/copywriting/icp2_lp.md`
- `content/copywriting/ux_ia_disclosure.md`
- `content/copywriting/verite_produit.md`
- `content/copywriting/rules/`
- `content/copywriting/copy_v1.md`
- `content/copywriting/copy_v2.md`

## Produit

La documentation produit a garder sous la main :

- `PRODUCT.md`
- `docs/product/smart.md`
- `docs/product/jalons.md`
- `docs/product/KPI.md`
- `docs/product/valeur_ajoutee.md`
- `docs/product/dashboard.md`
- `docs/product/product_scope.md`
- `docs/product/bloc_2.md`
- `docs/product/bloc_vision_kpi.md`

## References

Les documents source et inspirations :

- `docs/references/Carry-itICP.html`
- `docs/references/CarryIt Branding Document.docx`
- `docs/references/Carry IT Concurrents.pdf`
- `docs/references/Carry It Manifest (1).pdf`
- `docs/references/Color Guide from Claude.html`

## Archive / prototypes

Ces fichiers ne doivent pas polluer la lecture quotidienne :

- `prototypes/`
- `Plans/`
- `templates/email/`
- `docs/planning/`
- les anciennes variantes et essais dans `archive/`

## Regle de rangement

Garder a la racine uniquement les routes HTML publiques et les fichiers requis par l'hebergement statique (`CNAME`, `.nojekyll`, `.gitignore`). Tout fichier support doit aller dans un dossier metier ou technique explicite. Les essais, variantes et references doivent rester hors du champ de travail quotidien.
