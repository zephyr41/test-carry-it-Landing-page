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

## 4. Contenu des Vues (Wireframes structurels)

### Onglet 1 : Vision
Lecture de haut en bas (Règle des 5 secondes) :
1.  **Objectif SMART** : Rappel constant de la cible finale.
2.  **État Actuel (KPI Principal)** : La donnée prioritaire absolue de l'écran. Affichage brut de la valeur actuelle vs la valeur cible.
3.  **Tendance (Historique)** : Graphique "Sparkline" minimaliste pour indiquer si la courbe progresse, stagne ou régresse, sans surcharger l'écran de métriques complexes.

### Onglet 2 : Jalons
*   Série de "Cartes" (Work Packages) alignées sur le temps.
*   Chaque jalon expose ses propres métriques (KPI d'effort vs KPI de résultat).

### Onglet 3 : Exécution
*   Prise en charge d'un modèle d'état des tâches (À faire / En cours / Terminé).
*   L'utilisateur peut basculer l'affichage entre une simple liste "To-Do" (binaire) et un tableau "Kanban" (flux).
