# Spec — Zone 2 & Zone 3 du Dashboard

## Contexte produit

CarryIT relie vision long terme, pilotage moyen terme et exécution court terme.

- **Zone 2 — To-do list** : onglet d'exécution court terme (tâches liées aux jalons)
- **Zone 3 — KPI de jalon** : bloc de pilotage moyen terme dans l'onglet Jalons

Ces deux zones sont dans des **onglets séparés**. Elles ne fusionnent pas.

---

## Zone 2 — To-do list (onglet "To-do list")

### Rôle

Permettre à l'utilisateur d'exécuter ses tâches au quotidien, organisées par jalon.

Question principale : **"Qu'est-ce que je dois faire maintenant pour avancer sur ce jalon ?"**

---

### Structure

#### Onglets de jalons (milestone tabs)

Ligne d'onglets horizontaux (scroll si nécessaire), un onglet par jalon.

**Ordre d'affichage**
1. Jalon actif (en cours) — en premier
2. Jalons à venir — par ordre chronologique
3. Jalons validés — compactés, libellé `Ancien · [titre]`

**Contenu d'un onglet**
- Dot de statut : orange (`active`) ou bleu avec checkmark (`complete`)
- Titre du jalon
- Compteur tâches `X/Y` (si tâches liées existent) — masqué si 0

---

#### Critère de validation (criterion card)

Affiché sous les onglets quand un jalon est sélectionné.

**Contenu**
```
🎯 VALIDATION · [Titre du jalon] : [Texte du critère]
```
- Bouton `✓ Valider` → valide le jalon (désactivé si déjà validé)
- Si jalon validé : carte en état `completed` (visuellement atténuée)

---

---

### États à gérer

| État | Affichage |
|---|---|
| Aucun jalon | Lien `+ Planifier les jalons` |
| Jalon sans tâche | Critère visible, liste vide avec `+ Ajouter une action...` |
| Toutes les tâches terminées | Message "Toutes les actions sont cochées. Ce jalon est-il prêt à être validé ?" |
| Jalon validé | Criterion card atténuée, bouton Valider désactivé |

---

## Zone 3 — KPI de jalon (dans l'onglet "Jalons")

### Rôle

Permettre à l'utilisateur de mesurer la progression d'un jalon via 2 indicateurs complémentaires.

Question principale : **"Est-ce que mes efforts produisent les résultats attendus sur ce jalon ?"**

---

### Les 2 types de KPI

| Type | Libellé | Couleur accent | Description |
|---|---|---|---|
| `leading` | Effort | `#5BAEC9` (bleu) | Ce que je fais — indicateur d'avancée |
| `lagging` | Résultat | `#EE4408` (orange) | Ce que ça donne — indicateur de résultat |

Chaque jalon peut avoir **0, 1 ou 2 KPI**.

**États de la grille KPI**
- 0 KPI : 2 cartes vides avec CTA "Définir le KPI" pour chaque type
- 1 KPI : carte remplie + espace vide du type complémentaire
- 2 KPI : 2 cartes côte à côte (`repeat(auto-fit, minmax(260px, 1fr))`)

---

### Structure d'une KPI card

**En-tête**
- Titre de catégorie (`Effort` ou `Résultat`)
- Phrasing (`Ce que je fais` ou `Ce que ça donne`)
- Bouton `Modifier le KPI` (édition des métadonnées)

**Corps**
- Titre factuel du KPI (ex : "Km courus cette semaine")
- Valeur courante (grande taille) + unité ou cible
- Barre de progression + % atteint (si cible définie)
- Indicateur de fraîcheur (date relative de la dernière mesure)
- Sparkline SVG (historique visuel — visible si ≥ 2 mesures)

**Footer**
- Bouton `+ Ajouter une mesure`

**État vide (KPI non défini)**
- Description de ce que le KPI doit mesurer
- Exemple concret
- Bouton `+ Définir le KPI`

---

### KPIActionMenu (menu `...`)

Déclenché par le bouton `...` sur une KPI card remplie.

| Action | Comportement |
|---|---|
| Modifier le titre | Édition inline du titre |
| Définir / Modifier la cible | Édition inline de la cible |
| Modifier la fréquence | Toggle Hebdomadaire ↔ Mensuel |
| Mode de mesure | Toggle Cumulatif ↔ Valeur actuelle |
| Voir l'historique | Ouvre KPIHistorySheet |
| Supprimer ce KPI | Supprime le KPI du jalon |

Fermeture : clic extérieur. Position : ancré au bouton, aligné à droite.

---

### KPIHistorySheet (panneau slide-in)

Panneau latéral droit (`440px max-width`) affichant l'historique des mesures.

**Déclencheurs**
- Clic sur la sparkline
- Clic sur la date de dernière mesure (freshness)

**Contenu**
- En-tête : type (couleur accent) + titre du KPI + bouton fermer
- Liste des mesures (antéchronologique) : date · delta vs précédent · valeur + unité · bouton supprimer
- `Aucune mesure` si vide

**Comportement**
- Backdrop semi-transparent avec blur
- Animation slide-in : `translateX(100% → 0)`, 240ms cubic-bezier
- Clic backdrop ou `×` → ferme
- Suppression d'une mesure → recharge le panneau sans fermer

---

### Modal — Ajout de mesure (KPI jalon)

**Champs**
- Date (obligatoire)
- Valeur (obligatoire, ≥ 0)

**Actions**
- `Enregistrer`
- `Annuler`

---

### Mode de mesure

Deux modes sélectionnables par toggle :

- **Cumulatif (Σ)** — chaque mesure s'ajoute au total. Ex : `+5 km`
- **Valeur actuelle (→)** — chaque mesure remplace l'état courant. Ex : `72 kg`

Mode stocké sur le KPI, choisi par l'utilisateur.

---

### Données — KPI jalon

```json
{
  "id": "...",
  "type": "leading | lagging",
  "titre": "...",
  "unite": "...",
  "description": "...",
  "mode": "cumulative | current",
  "target": null,
  "frequence": "weekly | monthly",
  "measures": [
    { "id": "...", "date": "JJ/MM/AAAA", "value": 12 }
  ]
}
```
