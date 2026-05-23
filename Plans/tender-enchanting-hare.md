# Plan — Clarifier le WHY dans l'intro de jalons.html

## Context
Nils a peur que les users aient la flemme de remplir les jalons parce qu'on n'explique pas pourquoi ils font ça. L'intro actuelle (`jalons.html` ~ligne 1151) dit juste "comment" mais pas "pourquoi".

Fichier : `jalons.html` — bloc `<div class="intro-section">` (~ligne 1149-1158)

## Changement unique

Remplacer le `<p>` actuel :
```
Pars de la fin. Pour les jalons lointains, reste approximatif.
```

Par (3 phrases, no em dashes, ultra simple, factuel) :
```
Les projets découpés en jalons ont 2 fois plus de chances d'aboutir. Pars de la fin. Pour les jalons lointains, reste approximatif.
```

Source : PMI data (64% vs 36% taux de réussite avec/sans jalons définis). Phrase 1 = WHY factuel, phrases 2-3 = HOW.

## Règles copy
- Aucun em dash (—)
- Pas de mots puffery (pivotal, crucial, enhance, underscore...)
- Ultra simple, concret

## Vérification
Ouvrir `jalons.html` dans le navigateur. Intro doit lire : "Planifier l'impossible." + les 3 phrases.
