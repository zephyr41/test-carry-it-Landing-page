# Pass 1 — Agentivité
**Source de vérité :** copy_audit_v1.md · 2026-04-09
**Fichier impacté :** index.html (lecture seule — aucune modification directe)
**Règle de travail :** corriger uniquement ce qui fait croire que CarryIt agit à la place de l'utilisateur.

---

## Résumé opérationnel (5 lignes)

- **Garde :** toutes les phrases validées par l'audit + l'intégralité du reste de la LP non citée
- **Modifie :** 5 phrases identifiées par l'audit (hero description, étape 01, sol. sous-titre desktop, étape 05, CTA final)
- **Note technique :** la hero description contient aussi une faute de frappe ("stucturer" → "structurer") — corrigée dans la réécriture
- **Interdit :** refonte de structure, ajout de section, nouveau concept, positionnement long terme, pédagogie du pipeline, ton global
- **Règle de validation :** chaque réécriture respecte la matrice des rôles de l'audit — l'utilisateur décide, l'IA reformule, l'app structure

---

## 1. Phrases à garder telles quelles

Ces phrases respectent la matrice des rôles. Elles ne bougent pas, même pour "améliorer" le style.

| # | Phrase | Localisation |
|---|--------|-------------|
| A | *"CarryIT ne te motive pas. Il te prouve que tu avances."* | Scroll indicator · ligne 1041 |
| B | *"Pas de badges, pas de confettis. Juste la prochaine étape."* | Section 09 · ligne 1111 |
| C | *"Tu construis sans résultat visible"* | Hero sous-titre · ligne 488-489 |
| D | *"Maintenant, tu peux structurer et exécuter."* | CTA section headline · ligne 1328 |
| E | *"15 minutes pour structurer des années."* | CTA overline · ligne 1327 |
| F | *"Grand projet. Petite étape claire. Chaque jour."* | Étape 05 title · ligne 854 |
| G | *"Fixe ton cap."* | Étape 01 title · ligne 766 |
| H | *"Tes ambitions ne sont pas le problème. Elles paraissent irréalistes quand on oublie le temps qu'elles demandent. Un vrai sommet se construit sur des années, pas en quelques semaines."* | Étape 01 desc. (début) · ligne 767 |

---

## 2. Phrases à corriger

| # | Phrase actuelle | Localisation | Problème |
|---|-----------------|-------------|---------|
| P1 | *"stucturer tes ambitions en objectifs clairs et mesurables pour voir ta progression réelle."* | Hero description · ligne 493-494 | Infinitif sans sujet + faute de frappe |
| P2 | *"CarryIt transforme ton ambition en Vision."* | Étape 01 desc. fin · ligne 767 | Sujet actif = CarryIt |
| P3 | *"6 étapes pour transformer une ambition en action mesurable."* | Sol. sous-titre desktop · ligne 755 | Infinitif sans agent, CarryIt implicite |
| P4 | *"Chaque tâche est connectée à ton projet long terme — tu sais quoi faire, et tu avances."* | Étape 05 desc. · ligne 855 | Passif automatique + app qui informe |
| P5 | *"Transforme tes objectifs en actions."* | CTA manifest-sub · ligne 1329 | Flou sur qui transforme |

---

## 3. Analyse et réécriture phrase par phrase

---

### P1 — Hero description
**Phrase actuelle :**
> structurer tes ambitions en objectifs clairs et mesurables pour voir ta progression réelle.

**Pourquoi problème d'agentivité :**
Infinitif sans sujet — le lecteur comprend que c'est CarryIt qui "structure". L'utilisateur est passif, il "voit" sa progression sans l'avoir construite.

**Variantes proposées :**

- **Option A** *(de l'audit)* : "Tu formules. CarryIT structure. Tu mesures chaque semaine."
- **Option B** *(de l'audit)* : "Tu poses ton ambition. L'app la rend pilotable — à toi d'exécuter."
- **Option C** *(de l'audit)* : "CarryIT te guide pour rendre ton ambition claire, structurée et mesurable"

> **→ Proposition par défaut :** Option A — trois temps, chaque sujet est nommé, aucun doute sur qui fait quoi. Court. Lisible en scan.
> **Décision appartient à Nils.**

⚠️ **Statut : non modifié pour l'instant.**

---

### P2 — Étape 01 · Ambition (fin de description)
**Phrase actuelle (contexte complet) :**
> Tes ambitions ne sont pas le problème. Elles paraissent irréalistes quand on oublie le temps qu'elles demandent. Un vrai sommet se construit sur des années, pas en quelques semaines. **CarryIt transforme ton ambition en Vision.**

**Pourquoi problème d'agentivité :**
Phrase la plus directe de la page. CarryIt est l'agent actif qui "transforme" l'ambition — l'utilisateur ne décide rien, ne valide rien. Le manifeste dit l'inverse : "un cadre mais que tu choisis."

**Réécriture retenue :**
> Tes ambitions ne sont pas le problème. Elles paraissent irréalistes quand on oublie le temps qu'elles demandent. Un vrai sommet se construit sur des années, pas en quelques semaines. CarryIT te guide pour rendre ton ambition claire, structurée et mesurable.

> **→ Proposition par défaut :** Option B — deux temps clairs, verbe fort pour l'utilisateur ("reste la tienne"), rôle de l'app explicite ("la clarifie"). Moins verbeux que A, moins narratif que C.
> **Décision appartient à Nils.**

---

### P3 — Section Solution · sous-titre (desktop)
**Phrase actuelle :**
> 6 étapes pour transformer une ambition en action mesurable.

*(Version mobile "6 étapes pour passer d'une ambition à l'action." — même structure, même problème de sujet absent, traitement secondaire.)*

**Pourquoi problème d'agentivité :**
Même mécanique que P1 : infinitif sans agent. "Transformer" est attribué implicitement au système. L'utilisateur n'est pas mentionné — il subit les 6 étapes plutôt qu'il ne les parcourt.

**Variantes proposées :**

- **Option A** *(de l'audit)* : "Ce qu'il faut simplement pour structurer une ambition long terme et voir ta progression."

---

### P4 — Étape 05 · To-do list
**Phrase actuelle (contexte complet) :**
> Une to-do list simple et efficace pour t'organiser et exécuter au quotidien. **Chaque tâche est connectée à ton projet long terme — tu sais quoi faire, et tu avances.**

**Pourquoi problème d'agentivité :**
Deux sous-problèmes distincts :
1. "Connectée" (passif) : l'app relie automatiquement — l'utilisateur n'intervient pas dans la connexion.
2. "Tu sais quoi faire" : c'est l'app qui informe l'utilisateur de ce qu'il doit faire. Le manifeste dit le contraire : l'utilisateur crée ses tâches, il décide.

**Variantes proposées :**

- **Option A** *(de l'audit)* : "Tu crées tes tâches. Elles sont visibles à côté de tes jalons. Tu décides quoi faire en premier."
- **Option B** *(de l'audit)* : "Tes tâches vivent dans le même espace que ton objectif long terme. Tu vois le lien toi-même."
- **Option C** *(de l'audit)* : "Une to-do list simple pour passer à l'éxécution chaque jour. Tu définis des tâches concrètes, liées à ton prochain jalon."

> **→ Proposition par défaut :** Option C
> **Décision appartient à Nils.**

---

### P5 — CTA Final · manifest-sub
**Phrase actuelle :**
> Transforme tes objectifs en actions.

**Pourquoi problème d'agentivité :**
L'impératif "Transforme" sans contexte laisse flou : est-ce CarryIt qui transforme ou l'utilisateur ? Dans le contexte du CTA, le lecteur peut lire les deux. C'est le problème le moins grave selon l'audit.

**Note de contexte :** la headline au-dessus ("Maintenant, tu peux structurer et exécuter.") est déjà forte et correcte. Le manifest-sub est donc une ligne d'appui — une clarification du binôme utilisateur/app.

**Variantes proposées :**

- **Option A** *(de l'audit)* : "Tu poses l'objectif. CarryIT t'aide à y voir clair, à l'organiser et à mesurer ta progression."

> **→ Proposition par défaut :** Option B — trois verbes impératifs adressés à l'utilisateur, pas à l'app. Court. Percussion. Cohérent avec le titre de la section.
> **Note :** éviter toute option qui réplique l'overline ("15 minutes pour structurer des années.").
> **Décision appartient à Nils.**

---

## 4. Version consolidée des sections impactées

*Texte brut uniquement. Phrases validées (KEEP) en gras. Rewrites en [crochets — option par défaut retenue].*
*Les sections non impactées ne sont pas reproduites ici.*

---

### Hero — clarity block
**Conservé :**
> Tu construis sans résultat visible

**Réécriture P1 [option A] :**
> Tu formules. CarryIT structure. Tu mesures chaque semaine.

---

### Section Solution — header
**Conservé :**
> La solution · Le pipeline CarryIT

**Réécriture P3 [option A] :**
> 6 étapes. Tu décides à chacune. Le système tient le fil.

*(version mobile [proposition] : 6 étapes. Tu décides à chaque fois.)*

---

### Étape 01 — Ambition · feature-desc
**Conservé (début) :**
> Tes ambitions ne sont pas le problème. Elles paraissent irréalistes quand on oublie le temps qu'elles demandent. Un vrai sommet se construit sur des années, pas en quelques semaines.

**Réécriture P2 [option B] :**
> Ton ambition reste la tienne. CarryIT la clarifie — tu décides si c'est juste.

---

### Étape 05 — To-do list · feature-desc
**Conservé (début) :**
> Une to-do list simple et efficace pour t'organiser et exécuter au quotidien.

**Réécriture P4 [option A] :**
> Tu crées tes tâches. Elles sont visibles à côté de tes jalons. Tu décides quoi faire en premier.

---

### CTA Final — manifest-sub
**Conservé (headline au-dessus) :**
> Maintenant, tu peux structurer et exécuter.

**Réécriture P5 :**
> Les grandes ambitions prennent des années. N'en perds pas une de plus.

---

## 5. Diff éditorial

---

### P1 · Hero description

| | |
|---|---|
| **KEEP** | *Tu construis sans résultat visible* (hero sous-titre — inchangé) |
| **CHANGE** | *stucturer tes ambitions en objectifs clairs et mesurables pour voir ta progression réelle.* |
| **WHY** | Infinitif sans sujet : CarryIt est l'agent implicite. L'utilisateur est passif. + faute de frappe ("stucturer") |
| **REWRITE** | [option choisie par Nils] |

---

### P2 · Étape 01 — fin de description

| | |
|---|---|
| **KEEP** | *Tes ambitions ne sont pas le problème. Elles paraissent irréalistes quand on oublie le temps qu'elles demandent. Un vrai sommet se construit sur des années, pas en quelques semaines.* |
| **CHANGE** | *CarryIt transforme ton ambition en Vision.* |
| **WHY** | CarryIt est le sujet actif qui "transforme". L'utilisateur ne décide pas, ne valide pas. Contradiction directe avec le manifeste ("un cadre mais que tu choisis"). |
| **REWRITE** | [option choisie par Nils] |

---

### P3 · Solution sous-titre (desktop)

| | |
|---|---|
| **KEEP** | *La solution · Le pipeline CarryIT* (titre de section — inchangé) |
| **CHANGE** | *6 étapes pour transformer une ambition en action mesurable.* |
| **WHY** | Infinitif sans agent : "transformer" implicitement attribué au système. L'utilisateur est absent de l'énoncé. |
| **REWRITE** | [option choisie par Nils] |

---

### P4 · Étape 05 — fin de description

| | |
|---|---|
| **KEEP** | *Une to-do list simple et efficace pour t'organiser et exécuter au quotidien.* |
| **CHANGE** | *Chaque tâche est connectée à ton projet long terme — tu sais quoi faire, et tu avances.* |
| **WHY** | (1) "Connectée" = passif automatique, l'app décide du lien. (2) "Tu sais quoi faire" = l'app informe l'utilisateur de ce qu'il doit faire — rôle inversé. |
| **REWRITE** | [option choisie par Nils] |

---

### P5 · CTA manifest-sub

| | |
|---|---|
| **KEEP** | *15 minutes pour structurer des années.* (overline) · *Maintenant, tu peux structurer et exécuter.* (headline) · *Je commence.* (CTA button) |
| **CHANGE** | *Transforme tes objectifs en actions.* |
| **WHY** | Impératif sans sujet nommé — flou sur qui transforme. Moins grave que P1–P4, mais incohérent avec la headline juste au-dessus. |
| **REWRITE** | [option choisie par Nils] |

---

## Notes finales — Pass 1

- **5 phrases modifiées**, toutes identifiées par l'audit. Aucun ajout de concept.
- Les phrases KEEP de l'audit (scroll indicator, badges/confettis) sont intactes.
- Chaque réécriture a une option par défaut mais **toutes les décisions finales appartiennent à Nils**.
- Pass 2 (positionnement long terme) et Pass 3 (pédagogie du pipeline) : non traitées ici.
