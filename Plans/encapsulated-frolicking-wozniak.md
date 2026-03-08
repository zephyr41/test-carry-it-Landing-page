# Plan — Redesign Section Market Gap (Section 5)

## Contexte

La section actuelle utilise un bento grid iOS (cards inégales, SVGs décoratifs) — DA complètement déconnectée du reste de la page.

**Direction validée par Nils :** Statement pur + animations/motion design.

**Correction copy importante :** "Aucun n'est fait pour les années" est faux (Notion est fait pour les années). Le vrai gap : **aucun outil ne te dit si t'avances vraiment vers ton objectif.** Ils organisent. Ils mesurent pas.

---

## Copy finale

```
LE PROBLÈME

Notion te stocke.
ClickUp t'organise.
Duolingo te félicite.

Aucun te dit si t'avances vraiment.

──────────────────────────────────────
vision → objectif → kpi → mesure
Personne n'a connecté ces étapes. Jusqu'ici.
```

Ou version plus courte / plus brutale :
```
Ils t'organisent.
Ils te motivent.
Ils t'informent pas.
```

---

## Motion Design — Idées d'animations

### Option M1 — Apparition séquentielle (stagger)
Chaque ligne apparaît une par une avec un léger slide-up + fade-in (400ms, stagger 150ms entre chaque). Simple, propre, Apple-like.

### Option M2 — Strike-through animé (recommandé)
Les noms d'outils (Notion, ClickUp, Duolingo) apparaissent normaux, puis un trait barré apparaît dessus progressivement au scroll. Comme si on les "rayait" mentalement. Puis la conclusion apparaît.

```
Notion te stocke.       → [barre qui traverse le mot "stocke"]
ClickUp t'organise.     → [barre qui traverse "organise"]
Duolingo te félicite.   → [barre qui traverse "félicite"]

                         ↓

Aucun te dit si t'avances vraiment.   [apparition clean]
```

### Option M3 — Compteur qui monte puis s'arrête
Un seul visuel animé : un counter qui monte (jours, semaines, heures de travail) mais l'objectif reste à 0%. Montre visuellement le gap entre effort et preuve de progression. Plus complexe à coder.

### Option M4 — Texte qui fade progressivement au scroll (scroll-driven)
Les tools (Notion, ClickUp, Duolingo) commencent dim (opacity 0.3), deviennent lisibles, puis se re-estompent quand la conclusion apparaît. Effet de "ces outils s'effacent".

---

## Recommandation Motion

**M2 (strike-through)** — le plus impactant visuellement, le plus "statement". Montre clairement que ces outils "font quelque chose mais pas le bon truc".

Fallback si complexité trop haute : **M1 (stagger)** — animations CSS pures, pas de JS complexe.

---

## Implémentation technique

### HTML (remplacer tout le `.mg-bento`, garder `.mg-pipeline`)

```html
<div class="mg-statement">
    <div class="mg-tools-list">
        <p class="mg-tool-line" data-animate="strike">
            <span class="mg-tool-name">Notion</span> te stocke.
        </p>
        <p class="mg-tool-line" data-animate="strike">
            <span class="mg-tool-name">ClickUp</span> t'organise.
        </p>
        <p class="mg-tool-line" data-animate="strike">
            <span class="mg-tool-name">Duolingo</span> te félicite.
        </p>
    </div>
    <p class="mg-conclusion">Aucun te dit si t'avances vraiment.</p>
</div>
```

### CSS (nouvelles classes, supprimer les `.mg-card*`)

```css
.mg-statement { margin-bottom: 48px; }

.mg-tools-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 40px;
}

.mg-tool-line {
    font-size: clamp(22px, 3vw, 40px);
    font-weight: 600;
    color: rgba(255, 253, 246, 0.45);
    letter-spacing: -0.03em;
    position: relative;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.4s ease, transform 0.4s ease;
}

.mg-tool-line.is-visible {
    opacity: 1;
    transform: translateY(0);
}

.mg-tool-name {
    color: rgba(255, 253, 246, 0.7);
}

/* Strike-through animation */
.mg-tool-line::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 0;
    height: 1px;
    background: rgba(238, 68, 8, 0.6);
    transition: width 0.6s ease 0.3s;
}

.mg-tool-line.is-struck::after {
    width: 100%;
}

.mg-conclusion {
    font-size: clamp(26px, 3.5vw, 52px);
    font-weight: 700;
    color: #FFFDF6;
    letter-spacing: -0.04em;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.5s ease, transform 0.5s ease;
    margin: 0;
}

.mg-conclusion.is-visible {
    opacity: 1;
    transform: translateY(0);
}
```

### JS (IntersectionObserver — scroll-triggered)

```js
// Dans le bloc script existant en bas de page
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('is-visible');
                // Strike après l'apparition
                setTimeout(() => entry.target.classList.add('is-struck'), 600);
            }, i * 150);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.mg-tool-line, .mg-conclusion').forEach(el => observer.observe(el));
```

---

## Fichiers modifiés

- `index.html` — lignes 217–284 (supprimer `.mg-bento`, remplacer par `.mg-statement`)
- `styles.css` — supprimer `.mg-card*`, `.mg-visual*`, `.mg-broken-pipeline`, `.mg-todo-*`; ajouter nouvelles classes
- `index.html` script block — ajouter IntersectionObserver

## Vérification

1. Lancer `python3 -m http.server 9999`
2. Scroller jusqu'à la section — vérifier l'animation séquentielle
3. Vérifier que le strike-through apparaît proprement
4. Vérifier responsive mobile (font-size, layout)
5. Vérifier que le pipeline du bas est intact
