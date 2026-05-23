# Fix: methode-section centrage décalé vers la droite

## Root cause

`.methode-section.is-open { display: block }` — un élément block dans un flex container perd la gestion d'alignement flex. Le `margin: 0 auto` sur `.methode-timeline` ne fonctionne pas fiablement dans ce contexte.

Le main-container (qui fonctionne) utilise `display: flex; flex-direction: column; align-items: center` — ses enfants sont centrés automatiquement. C'est ce pattern qu'on doit reproduire.

## Fix (2 changements CSS)

**Fichier:** `jalons.html`

### 1. `.methode-section` → mirror de `.main-container`

```css
/* AVANT */
.methode-section {
    display: none;
    width: 100%;
    max-width: 640px;
    margin: 52px auto 0;
    text-align: left;
}
.methode-section.is-open { display: block; }

/* APRÈS */
.methode-section {
    display: none;
    width: 100%;
    padding: 0 20px;
    margin-top: 52px;
    text-align: left;
}
.methode-section.is-open {
    display: flex;
    flex-direction: column;
    align-items: center;
}
```

### 2. `.methode-timeline` → mirror de `.timeline-list`

```css
/* AVANT */
.methode-timeline {
    display: flex;
    flex-direction: column;
    position: relative;
    max-width: 580px;
    margin: 0 auto;
}
.methode-timeline::before {
    left: 84px;
    ...
}

/* APRÈS */
.methode-timeline {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    max-width: 580px;
}
.methode-timeline::before {
    left: 85px;  /* label(68) + gap(12) + dot-center(5) */
    ...
}
```

## Vérification

Ouvrir `jalons.html` → cliquer "Comprendre la méthode" → vérifier que la timeline s'aligne avec les jalons en dessous.
