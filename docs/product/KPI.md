  # KPI

  ## 1. Définition conceptuelle

  Un KPI est une **mesure chiffrée** que l'on suit pour évaluer la progression d'un objectif.

  ## 2. Règles métier

  - Un KPI doit être rattaché à un **objectif SMART** ou à un **jalon**.
  - Un KPI doit être **pertinent**.
  - Un KPI doit être **utile à la décision**.
  - Un KPI doit refléter une **progression réelle**.
  - Un KPI ne doit pas être une **vanity metric**.
  - Quand un KPI est rattaché à un jalon, il peut être défini à partir de son critère de validation.
  - 2 types de KPI existent :
    - **Leading Indicators** (Indicateurs d'avancée) : un chiffre qui montre si tu es en train de faire ce qu'il faut. Ex : `km/semaine`
    - **Lagging Indicators** (Indicateurs de résultat) : montre si ce que tu fais fonctionne ou non. Ex : `allure moyenne réelle`

  ## 3. Définition produit

  Un KPI CarryIT est une **mesure chiffrée suivie** par l'utilisateur. Elle est rattachée à un **objectif SMART** ou à un **jalon**.

  Il permet à l'utilisateur de :
  - **voir l'avancement** de son objectif SMART (le "M" du SMART)
  - **voir son avancée** sur le jalon en cours

  Un KPI est suivi dans le temps à partir de **valeurs mises à jour régulièrement par l'utilisateur** (hebdomadaire ou mensuel).

  Un KPI peut être de type :
  - **leading** : suivi d'une avancée
  - **lagging** : suivi d'un résultat

  ## 4. Structure d'un KPI

  - un **titre**
  - une **valeur**
  - une **unité**
  - une **fréquence de mise à jour**
  - un **type** : leading ou lagging (non obligatoire)
  - un **mode de mesure**
  - un **rattachement** : objectif SMART ou jalon
  - une **valeur cible** *(optionnelle)*
  - Indicateur de la dernière MAJ

  ### 4.1 Mode de mesure

  Un KPI doit préciser comment une nouvelle mesure met à jour la valeur affichée.

  Deux modes existent en V1 :

  - **Cumulatif** : chaque nouvelle mesure s'ajoute au total courant.
    - Exemples : `+1 utilisateur onboardé`, `+2 heures de dev`, `+5 km cumulés`
  - **Valeur actuelle** : chaque nouvelle mesure remplace l'état courant affiché.
    - Exemples : `5 km sur la dernière sortie`, `6:10 min/km aujourd'hui`, `72 kg actuellement`

  Règle produit :

  - un KPI de jalon ne doit pas imposer un mode unique
  - le mode est choisi par l'utilisateur au moment de définir le KPI
  - le dashboard doit afficher ce KPI selon ce mode
  - l'historique doit conserver chaque mesure saisie

  ## 5. Cardinalité

  - Un objectif SMART contient **1 seul KPI**.
  - Un jalon peut contenir **1 ou 2 KPI**.

  ## 6. Contexte de création

  Un KPI est créé dans un contexte :

  - **Dans l'objectif** : créé pendant l'onboarding SMART
  - **Dans le jalon** : chaque jalon a un critère de validation (ex : "3 documentations techniques réalisées", "V0 testée par 15 utilisateurs"). Le KPI peut être dérivé de ce critère.
    - Possibilité de créer un KPI lagging rattaché au critère de validation du jalon
    - Possibilité de créer un KPI leading associé (levier d'action)

  ## 7. Actions utilisateur

  Un utilisateur peut :

  - Ajouter une mesure de son KPI
  - Modifier le titre de son KPI
  - Modifier la valeur de son KPI
  - Modifier la fréquence de mise à jour
  - Définir une valeur cible

  ## 8. Affichage dashboard

  *À définir.*
