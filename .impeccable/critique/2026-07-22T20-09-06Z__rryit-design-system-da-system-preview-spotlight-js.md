---
target: tour onboarding spotlight (6 étapes)
total_score: 27
p0_count: 0
p1_count: 2
timestamp: 2026-07-22T20-09-06Z
slug: rryit-design-system-da-system-preview-spotlight-js
---
⚠️ DEGRADED: single-context (les deux sous-agents se sont signalés disponibles sans jamais transmettre de rapport, y compris après relance)

## Design Health Score

| # | Heuristique | Score | Problème clé |
|---|-------------|-------|--------------|
| 1 | Visibilité de l'état du système | 3 | Segments de progression présents, mais aucun « 4/6 » lisible : le compte n'existe qu'en `aria-label` |
| 2 | Correspondance système / monde réel | 3 | « KPI d'effort » / « KPI de résultat » restent du vocabulaire produit à apprendre ; le reste parle juste |
| 3 | Contrôle et liberté | 3 | Retour + Échap + reprise ; mais « quitter le guide » n'existe qu'à l'étape 1 |
| 4 | Cohérence et standards | 3 | Quatre libellés de sortie (« Plus tard », « Passer », « Pas encore », « Suivant ») pour deux concepts |
| 5 | Prévention des erreurs | 3 | Étapes qui se retirent seules quand leur cible n'existe pas ; pas de garde-fou sur une saisie inventée |
| 6 | Reconnaissance plutôt que rappel | 3 | Les citations rappellent la donnée déjà saisie : très bon. Le halo désigne la vraie cible |
| 7 | Flexibilité et efficacité | 1 | 42 tabulations pour atteindre la bulle, aucun raccourci, pas de flèches |
| 8 | Esthétique et minimalisme | 3 | Hiérarchie propre ; la bulle recouvre parfois la carte voisine |
| 9 | Récupération d'erreur | 2 | Annuler une modale ramène bien au tour, mais sans aucun accusé de réception |
| 10 | Aide et documentation | 3 | Filet à l'hésitation + « Reprendre le guide » : rare et bien vu |
| **Total** | | **27/40** | **Acceptable, haut de fourchette** |

## Anti-Patterns Verdict

**Évaluation LLM** : ça ne sent pas le tour généré. Trois raisons concrètes : les étapes citent la donnée réelle de l'utilisateur (`quote()` lit `activeJalon.critere` puis `resultKpi.label`), le CTA clique le vrai bouton de la page au lieu de simuler une UI de démo, et le filet d'aide n'apparaît qu'après une hésitation mesurée. Un tour généré aurait 4 écrans figés, un « Skip tour » et zéro lien avec l'état.

**Scan déterministe** : `detect.mjs --json dashboard.html` → 1 finding, sévérité *warning*, `single-font` à la ligne 9. **Faux positif** : le détecteur lit le `@font-face` Rifton en tête de fichier et en conclut que Rifton est la seule police. Le système utilise Inter pour toute l'UI et réserve Rifton au wordmark de la navbar — c'est un choix documenté du design system.

**Overlays visuels** : non tentés (aucune injection de script requise, les mesures ont été faites par `getComputedStyle` et `getBoundingClientRect`).

### Mesures relevées (bulle à l'étape 4/6, viewport 1920×1080, fond `rgb(28,28,30)`)

| Élément | Taille police | Ratio de contraste | Verdict |
|---|---|---|---|
| eyebrow | 11px / 700 | 6.05:1 | OK |
| title | 21px / 750 | 16.72:1 | OK |
| quote-label | 13px / 400 | 5.54:1 | OK |
| quote | 15px / 550 | 16.72:1 | OK |
| desc | 14px / 400 | 7.15:1 | OK |
| example | 12.5px / 400 | 4.62:1 | OK, à 0.12 du seuil |
| hint | 12.5px / 400 | 4.62:1 | OK, à 0.12 du seuil |
| skip | 13px / 500 | 5.54:1 | OK |
| **CTA orange** | 14px / 500 | **3.77:1** | **ÉCHEC** (seuil 4.5) |

| Cible | Taille | Verdict tactile (44×44) |
|---|---|---|
| `[data-spotlight-back]` | 32×32 | ÉCHEC |
| `[data-spotlight-skip]` | 77×32 | ÉCHEC en hauteur |
| `[data-spotlight-cta]` | 144×40 | ÉCHEC en hauteur |

Console : aucune erreur, aucune requête en échec sur tout le parcours.

## Overall Impression

Le tour est bien au-dessus de la moyenne des onboardings produits : il agit sur la vraie interface, il enchaîne sur la donnée de l'utilisateur, et il connaît ses propres angles morts (étapes qui se retirent, filet à l'hésitation, reprise après abandon). Le problème n'est pas la conception, c'est **l'accès** : au clavier le tour est quasi inatteignable, et sur mobile aucune de ses trois actions n'atteint la taille de cible minimale. Un guide qui apprend à se servir du produit est précisément ce qu'un utilisateur en difficulté va essayer d'atteindre autrement qu'à la souris.

## What's Working

1. **La citation de la donnée réelle.** L'étape effort affiche « Ton KPI de résultat : « Km de ma plus longue sortie » » — le libellé que la personne vient d'écrire. C'est ce qui transforme une suite d'écrans en chaîne de raisonnement.
2. **Le CTA agit sur la vraie page.** `ctaTarget` clique le bouton réel, le tour s'efface le temps de la modale et reprend à la fermeture. Aucune logique dupliquée, donc aucune divergence possible entre le tour et le produit.
3. **Le filet mérité.** La ligne « Pas encore clair ? Passe… » n'apparaît qu'après une modale annulée ou 25 s d'immobilité. C'est de l'aide contextuelle au sens strict, et ça respecte l'interdit de marque sur le réconfort gratuit.

## Priority Issues

**[P1] Le tour est inatteignable au clavier**
- *Pourquoi* : il faut **42 tabulations** pour arriver au premier bouton de la bulle ; le focus n'est jamais posé dessus à l'ouverture (`document.activeElement` = `BODY`), et rien n'empêche le focus de repartir dans les 52 éléments de la page derrière le voile. Un utilisateur clavier ou lecteur d'écran voit un voile sombre et un halo, sans pouvoir agir.
- *Correctif* : poser le focus sur le CTA à chaque `enter()`, piéger le focus dans la bulle tant que le tour est actif (`aria-modal="true"` + boucle Tab), et rendre le reste de la page `inert`.
- *Commande* : `/impeccable audit`

**[P1] Aucune action n'atteint 44×44 px**
- *Pourquoi* : retour 32×32, « Passer » 77×32, CTA 144×40. Sur un écran tactile, le retour et le skip sont côte à côte sous la taille minimale : erreurs de frappe garanties, et c'est le seul moment où quelqu'un découvre le produit.
- *Correctif* : passer les trois à 44 px de hauteur (ou zone de hit étendue en `::after`, le pattern existe déjà dans `kpi-card.css` pour `.ds-kpi-card__action`).
- *Commande* : `/impeccable adapt`

**[P2] Le CTA orange est sous le seuil de contraste**
- *Pourquoi* : 3.77:1 mesuré, il faut 4.5:1 à 14px/500. C'est le bouton le plus important de chaque étape.
- *Correctif* : soit assombrir l'orange, soit passer le libellé en 600 et ≥18px pour tomber sous la règle du gros texte (3:1).
- *Commande* : `/impeccable colorize`

**[P2] Quatre libellés de sortie pour deux concepts**
- *Pourquoi* : « Plus tard » (quitte), « Passer » (avance), « Pas encore » (avance), « Suivant » (avance). Trois mots différents font la même chose, et deux d'entre eux ressemblent à un abandon. L'utilisateur ne peut pas apprendre la règle.
- *Correctif* : un mot pour avancer (« Passer »), un mot pour quitter (« Plus tard »), et « Suivant » devient le CTA principal quand l'étape ne demande pas d'action.
- *Commande* : `/impeccable clarify`

**[P2] Le tour démarre sans consentement et ne se quitte proprement qu'à l'étape 1**
- *Pourquoi* : 300 ms après le chargement, le voile tombe. Passé l'étape 1, « quitter » n'existe plus que via Échap, qui n'est annoncé nulle part. Quelqu'un qui veut juste regarder son dashboard doit traverser six étapes ou deviner un raccourci.
- *Correctif* : ajouter une croix de fermeture persistante dans l'en-tête de la bulle (elle réapparaîtra via « Reprendre le guide », le filet de sécurité existe déjà).
- *Commande* : `/impeccable onboard`

## Persona Red Flags

**Jordan (premier contact)** : lit tout, hésite. Le halo lui désigne la bonne cible et les citations le rassurent — il s'en sort. Mais à l'étape 1, la bulle se pose **au-dessus** de la carte graphique et recouvre les cartes KPI de la rangée du haut : il lit « Ce graphique mesure ton objectif long terme » sans voir le graphique dont on parle. Deuxième accroc : « Mesurable du SMART » suppose qu'il a fait l'onboarding SMART et qu'il s'en souvient.

**Casey (mobile, interrompu)** : bloqué sur les cibles (32-40 px), et les actions sont en haut d'une bulle qui peut se poser n'importe où — jamais dans la zone du pouce. Point positif : l'état est persistant (`localStorage`), donc une interruption ne perd rien et « Reprendre le guide » le rattrape.

**« Le sportif de 25 ans en gratification différée » (PRODUCT.md)** : il travaille déjà dur, il déteste qu'on le materne. Le tour tient bien la ligne — pas de félicitations, pas de badge, le filet n'apparaît qu'après un vrai blocage. Un seul point de friction : l'étape 4 lui demande de saisir un effort **maintenant**, alors qu'il vient peut-être de créer son objectif sans avoir encore rien fait. Le skip s'appelle « Pas encore », ce qui est juste, mais le CTA orange pousse dans l'autre sens.

## Minor Observations

- Le compte d'étapes n'existe qu'en `aria-label` (« Étape 4 sur 6 ») : visuellement, six segments de 14 px se ressemblent tous. À six étapes, un « 4/6 » textuel devient utile.
- `role="dialog"` avec `aria-modal="false"` est cohérent avec l'absence de piège de focus, mais c'est la mauvaise moitié du compromis : ici on veut le piège.
- `example` et `hint` sont à 4.62:1, soit 0.12 au-dessus du seuil. Toute baisse d'opacité future les fait passer sous la barre.
- La transition de vue est en deux temps codés en dur (500 ms puis 450 ms). Sur une machine lente, le halo peut arriver avant la carte ; le retry de `place()` couvre le cas, mais l'enchaînement n'est pas garanti fluide.
- Le tour ne s'annonce pas aux lecteurs d'écran au changement d'étape : seul le `hint` porte `aria-live`.

## Questions to Consider

1. Le tour se déclenche seul au premier chargement. Et s'il attendait d'être **appelé** — un « Guide moi » discret dans la navbar, plutôt qu'un voile imposé à quelqu'un qui vient peut-être juste vérifier un chiffre ?
2. Six étapes, dont deux qui expliquent le même geste sur deux cartes voisines. Est-ce que le produit ne serait pas mieux servi par un tour de trois étapes plus une carte qui explique la boucle **au moment où le premier effort est saisi** ?
3. La dernière étape dit « Maintenant, commence » et bascule sur la to-do. Mais rien dans le tour ne relie une tâche à un KPI. Est-ce que l'utilisateur comprend que cocher une tâche ne fait bouger aucun chiffre ?
