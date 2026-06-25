# Spécifications UI/UX — Dashboard CarryIT
*Document de référence technique issu de l'analyse des besoins produit.*

## 1. Architecture Globale (Type : Tactique)
Le dashboard suit le principe de **Divulgation Progressive** et la **Pyramide Inversée**. L'interface est scindée en 3 vues distinctes (Top-rail navigation) pour forcer le focus et éviter la surcharge cognitive (Data-Ink ratio).

*   **Onglet 1 : Vision** (Niveau Stratégique global)
*   **Onglet 2 : Jalons** (Pont temporel / Architecture)
*   **Onglet 3 : Exécution** (Action quotidienne)

## 2. Design System (Esthétique de la Vérité)
*   **Règle absolue** : Monochrome strict (Noir, Blanc, Gris).
*   **Interdiction** : Pas d'usage sémantique du Vert ou du Rouge pour indiquer le succès ou l'échec. Le chiffre est un fait froid, il n'émet pas de jugement moral.
*   **Minimalisme** : Suppression maximale des bordures, ombres et éléments de décoration (Data-Ink ratio).

## 3. Flux de Données et Interactions
*   **Zero Data (Empty State)** : Pris en charge par l'onboarding. Le dashboard n'est jamais généré vide.
*   **Mise à jour des KPIs** : Aucune mise à jour automatique. Pour garantir l'ownership de l'utilisateur, la mise à jour s'effectue via une **Modale**.
    *   *Champs obligatoires* : Nouvelle valeur.
    *   *Champs optionnels* : Horaires (pour compenser l'absence de time-tracker natif) et Notes.

## 4. Structure Fonctionnelle des Vues

### 1. Où est-ce que j’en suis ?
Cette section affiche la position actuelle de l’utilisateur.
Elle doit permettre de comprendre immédiatement :
* quel est l’objectif long terme ; (SMART)
* quel est le KPI principal de l’objectif ; (Mesurable du smart)
* quelle est la valeur actuelle ; (Ou j’en suis moi)
* quelle est la valeur cible ; (le seuil a atteindre)
* Ou j’en suis dans les jalons (jalons passé, jalon actif, jalon futur)
* quel est le critère de validation du jalon actif ;
* quel est le résultat actuel du jalon actif.

### 2. Est-ce que j’avance réellement ?
Cette section affiche la dynamique de progression.
Elle ne montre pas seulement la valeur actuelle.
Elle montre si cette valeur évolue dans le temps.
Elle doit croiser quatre données :
* le résultat ; (est ce que le résultat augmente)
* l’effort réel ; (ce que je fais)
* le temps réel investi ; (combien de temps j’ai réellement investit)
* le temps calendaire écoulé. (depuis combien de temps je suis sur cette tache en jours)

Le dashboard doit permettre de comparer l’effort, le temps et le résultat.

Exemple 1 :
Le résultat stagne depuis 30 jours.
Le temps réel investi est faible.
Le problème peut venir d’un manque d’exécution réelle.

Exemple 2 :
Le résultat stagne depuis 30 jours.
Le temps réel investi est élevé.
Il faut analyser la méthode, le type d’effort, le KPI ou la difficulté du jalon.
*(L'interface doit permettre de montrer ce diagnostic visuellement, sans avoir à l'écrire noir sur blanc).*

### Règles de conception

Le dashboard doit distinguer deux notions :
* Position = où j’en suis maintenant.
* Dynamique = est-ce que ma position évolue dans le temps.

Le KPI actuel donne une position.
L’évolution du KPI donne une dynamique.

Le critère de validation du jalon actif sert à savoir ce qu’il faut atteindre.
Le résultat actuel du jalon actif sert à savoir où l’utilisateur se situe par rapport à ce critère.
L’évolution du résultat du jalon actif sert à savoir si l’utilisateur avance réellement.

### 3. Exécution
* Prise en charge d'un modèle d'état des tâches (À faire / En cours / Terminé).
* L'utilisateur peut basculer l'affichage entre une simple liste "To-Do" (binaire) et un tableau "Kanban" (flux).
