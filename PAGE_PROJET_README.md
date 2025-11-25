# Page Projet - Documentation

## Fonctionnalités implémentées

### 1. Affichage des projets
- ✅ Récupération automatique de tous les projets depuis la database IndexedDB
- ✅ Affichage en grille responsive avec le composant `CarteProjet`
- ✅ Tri par date de création (plus récent en premier)

### 2. Recherche et filtres
- ✅ Barre de recherche pour filtrer par nom de projet ou client
- ✅ Filtre par statut (Tous, En cours, Brouillon, Terminé)
- ✅ Filtre par type de projet (dynamique selon les projets existants)
- ✅ Filtre par entreprise/client (dynamique)
- ✅ Filtre par année (dynamique)
- ✅ Toggle pour afficher/masquer les projets archivés

### 3. Actions sur les projets
- ✅ Bouton "Créer un projet" dans le header
- ✅ Menu contextuel sur chaque carte (modifier/supprimer)
- ✅ Navigation vers la page de modification
- ✅ Navigation vers la page d'informations du projet
- ✅ Suppression avec confirmation

### 4. Statistiques
- ✅ Nombre total de projets
- ✅ Nombre de projets actifs
- ✅ Nombre de projets archivés
- ✅ Cartes statistiques avec icônes et animations

### 5. Design moderne
- ✅ Interface inspirée de l'image fournie
- ✅ Couleurs cohérentes avec la charte graphique
- ✅ Animations et transitions fluides
- ✅ Design responsive (mobile, tablette, desktop)
- ✅ Effets hover sur les cartes et boutons

## Fichiers créés/modifiés

### Créés
- `src/pages/Projet.jsx` - Composant principal de la page
- `src/pages/Projet.css` - Styles de la page
- `src/pages/ModifierProjet.jsx` - Page wrapper pour la modification
- `src/assets/images/plus.svg` - Icône pour le bouton "Créer"
- `src/assets/images/search.svg` - Icône pour la recherche

### Modifiés
- `src/composants/CarteProjet.css` - Ajustements pour la grille + style archivé
- `src/App.jsx` - Ajout de la route `/modifier-projet/:projectId`

## Structure de la page

```
Page Projet
├── Header
│   ├── Titre "MES PROJETS"
│   └── Bouton "Créer un projet"
├── Section Filtres
│   ├── Barre de recherche
│   └── Filtres (statut, type, entreprise, année, archivés)
├── Grille de projets
│   └── CarteProjet (pour chaque projet)
└── Statistiques
    ├── Nombre total
    ├── Projets actifs
    └── Projets archivés
```

## Utilisation

### Accéder à la page
Naviguer vers `/projet` dans l'application

### Créer un projet
Cliquer sur le bouton orange "Créer un projet" en haut à droite

### Rechercher un projet
Taper dans la barre de recherche pour filtrer par nom ou client

### Filtrer les projets
Utiliser les dropdowns pour filtrer par statut, type, entreprise ou année

### Modifier un projet
1. Cliquer sur l'icône "..." en haut à droite d'une carte
2. Sélectionner "Modifier"
3. Modifier les informations
4. Sauvegarder

### Supprimer un projet
1. Cliquer sur l'icône "..." en haut à droite d'une carte
2. Sélectionner "Supprimer"
3. Confirmer la suppression

### Voir les projets archivés
Activer le toggle "Afficher aussi les projets archivés"

## Statuts disponibles
- **En cours** - Badge vert
- **Brouillon** - Badge orange
- **Terminé** - Badge bleu
- **Archivé** - Badge gris

## Responsive Design
- **Desktop** (>1200px) - Grille 3-4 colonnes
- **Tablette** (768px-1200px) - Grille 2-3 colonnes
- **Mobile** (<768px) - Grille 1 colonne

## Projets de test

Au premier lancement, 6 projets de test sont automatiquement créés pour démontrer les fonctionnalités :
- 3 projets "En cours"
- 1 projet "Brouillon"
- 1 projet "Terminé"
- 1 projet "Archivé"

Ces projets couvrent différents types (Résidentiel, Commercial, Villa, Bureaux) et différentes entreprises.

### Réinitialiser les projets de test

Pour réinitialiser les projets de test, ouvrez la console du navigateur et exécutez :

```javascript
import { resetTestProjects } from './db/initTestProjects';
resetTestProjects();
```

## Notes techniques
- Utilise IndexedDB via Dexie.js pour la persistance
- React Hooks (useState, useEffect) pour la gestion d'état
- React Router pour la navigation
- CSS Grid pour la mise en page responsive
- Initialisation automatique des données de test au premier lancement
