# Plan : CTA bouton + Footer + Mentions légales

## Context
Remplacer le form email de la section manifest par un gros bouton CTA "Tester la démo", ajouter un footer avec texture bruit + liens, et créer une page mentions légales / RGPD.

---

## 1. Manifest section — Remplacer le form email par CTA

**Fichier :** `index.html` lignes 832–835

**Changement HTML :**
- Supprimer `<form class="manifest-email-form">` + input email + "Rejoindre la bêta"
- Supprimer `<p class="manifest-contract">`
- Ajouter un gros bouton primaire : `<a href="objectif.html" class="btn btn-primary btn-cta-demo">Tester la démo</a>`

**CSS :** Ajouter `.btn-cta-demo` — padding généreux (18px 56px), font-size 18px, lettre spacing, hover avec glow orange subtil.

---

## 2. Footer

**Fichier :** `index.html` — juste avant `</body>`

**Structure HTML :**
```
<footer class="site-footer">
  <div class="footer-noise"></div>  ← pseudo-element avec scale-gray.png en overlay
  <div class="footer-inner">
    <div class="footer-brand">
      <img src="Images/logo_png.png" class="footer-logo">
      <p class="footer-tagline">Structurer son ambition. Tenir dans le temps.</p>
    </div>
    <div class="footer-nav">
      <a href="#heroSection">Le produit</a>
      <a href="#manifestSection">Manifeste</a>
      <a href="objectif.html">Tester la démo</a>
      <a href="mentions-legales.html">Mentions légales</a>
    </div>
    <div class="footer-contact">
      <a href="mailto:nils@carryit.app">nils@carryit.app</a>  ← placeholder email
      <div class="footer-socials">
        <a href="https://instagram.com/nilsjaudon" target="_blank">Instagram</a>
        <a href="https://linkedin.com/in/nilsjaudon" target="_blank">LinkedIn</a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2025 CarryIT — Tous droits réservés</p>
    <a href="mentions-legales.html">Mentions légales & RGPD</a>
  </div>
</footer>
```

**CSS footer :**
- `site-footer` : position relative, background #040810, padding 80px 24px 40px
- `footer-noise` : pseudo-element `::before`, `background-image: url(Images/scale-gray.png)`, `background-size: 256px`, `opacity: 0.04`, `mix-blend-mode: overlay`, position absolute inset 0, pointer-events none
- Layout : 3 colonnes sur desktop, stack vertical sur mobile
- `footer-bottom` : border-top 1px rgba(255,255,255,0.06), padding-top 24px, flex between, texte xs gris

---

## 3. Page mentions-legales.html

**Nouveau fichier :** `mentions-legales.html`

**Design :** Même charte dark que le reste (background #080C14, Inter, couleurs CarryIT). Navbar simple avec logo + lien retour landing. Footer identique à index.html.

**Contenu :**
- Éditeur du site : Nils Jaudon, auto-entrepreneur (SIREN en cours d'immatriculation)
- Hébergement : placeholder [HÉBERGEUR]
- RGPD : aucune collecte de données personnelles à ce stade (pas de form actif), cookies techniques uniquement
- Contact : [EMAIL À COMPLÉTER]

**Structure sections :**
1. Mentions légales (éditeur, hébergement, propriété intellectuelle)
2. Politique de confidentialité / RGPD
3. Cookies

---

## Fichiers modifiés
- `index.html` — manifest section + ajout footer
- `styles.css` — styles CTA + footer
- `mentions-legales.html` — nouveau fichier

## Vérification
- Ouvrir `index.html` sur serveur local `:9999` → bouton CTA visible, clique → ouvre `objectif.html`
- Footer visible en bas, texture scale-gray.png appliquée en overlay discret
- Lien "Mentions légales" dans footer → ouvre `mentions-legales.html`
- Mobile : footer stack vertical, photo founder OK
