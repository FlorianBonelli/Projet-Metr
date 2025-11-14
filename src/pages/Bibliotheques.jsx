import React, { useState } from 'react';
import Sidebar from '../composants/Sidebar';
import LibrariesTable from '../composants/LibrariesTable';
import './Bibliotheques.css';

const initialLibraries = [
  {
    id: 1,
    designation: 'Béton de fondation',
    tag: 'Nouveau',
    lot: '2 - GROS ŒUVRE - MAÇ',
    subCategory: 'Fondation',
    unit: 'M3',
    price: '120.50 €',
    updatedAt: '27/10/2025',
    favorite: true,
  },
  {
    id: 2,
    designation: 'Fenêtre PVC double vitrage',
    tag: 'Nouveau',
    lot: '10 - MENUISERIES EXTÉ',
    subCategory: 'Fenêtre',
    unit: 'U',
    price: '425.00 €',
    updatedAt: '27/10/2025',
  },
  {
    id: 3,
    designation: 'Porte intérieure',
    tag: 'Nouveau',
    lot: '9 - MENUISERIES INTÉ',
    subCategory: 'Porte',
    unit: 'U',
    price: '235.00 €',
    updatedAt: '27/10/2025',
  },
  {
    id: 4,
    designation: 'Radiateur électrique',
    tag: 'Nouveau',
    lot: '11 - ÉLECTRICITÉ COUR/',
    subCategory: 'Chauffage',
    unit: 'U',
    price: '199.90 €',
    updatedAt: '27/10/2025',
  },
  {
    id: 5,
    designation: 'Peinture mate blanche',
    tag: 'Nouveau',
    lot: '8 - PEINTURES',
    subCategory: 'Peinture',
    unit: 'L',
    price: '28.75 €',
    updatedAt: '27/10/2025',
  },
  {
    id: 6,
    designation: 'Carrelage grès cérame',
    tag: 'Nouveau',
    lot: '6 - CARRELAGES, REVÊT',
    subCategory: 'Carrelage',
    unit: 'M2',
    price: '45.20 €',
    updatedAt: '27/10/2025',
  },
];

function Bibliotheques() {
  const [libraryItems, setLibraryItems] = useState(initialLibraries);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectionModeChange = (checked) => {
    setIsSelectionMode(checked);
    if (!checked) {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id],
    );
  };

  const handleToggleFavorite = (id) => {
    setLibraryItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, favorite: !item.favorite } : item,
      ),
    );
  };

  return (
    <div className="bibliotheques-page">
      <Sidebar />

      <main className="bibliotheques-content">
        <header className="bibliotheques-header">
          <div className="header-title">
            <h1>Mes bibliothèques</h1>
            <p>{libraryItems.length} articles trouvés</p>
          </div>

          <div className="header-actions">
            <button className="action-button ghost">
              Gérer les bibliothèques <span aria-hidden="true">🔍</span>
            </button>
            <button className="action-button ghost">
              Importer une bibliothèque
            </button>
          </div>
        </header>

        <section className="filters-panel">
          <div className="filters-row">
            <div className="filters-selects">
              <div className="select-wrapper wide">
                <label htmlFor="library-select">Bibliothèques</label>
                <select id="library-select" defaultValue="all">
                  <option value="all">
                    Toutes les bibliothèques ({libraryItems.length} articles)
                  </option>
                </select>
              </div>
              <button className="icon-button" type="button" aria-label="Ajouter une bibliothèque">+</button>
            </div>

            <div className="search-wrapper">
              <input type="search" placeholder="Rechercher un article…" aria-label="Rechercher un article" />
            </div>
          </div>

          <div className="filters-row secondary">
            <div className="chip-group">
              <button className="chip" type="button">Lot</button>
              <button className="chip" type="button">Sous-catégorie</button>
              <button className="chip" type="button">Unité</button>
            </div>

            <div className="secondary-actions">
              <label className="checkbox" htmlFor="toggle-selection">
                <input
                  id="toggle-selection"
                  type="checkbox"
                  checked={isSelectionMode}
                  onChange={(e) => handleSelectionModeChange(e.target.checked)}
                />
                <span> Sélectionner</span>
              </label>
              <button className="action-button primary" type="button">
                Ajouter un article
              </button>
            </div>
          </div>
        </section>

        <LibrariesTable
          libraries={libraryItems}
          selectionMode={isSelectionMode}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleFavorite={handleToggleFavorite}
        />
      </main>
    </div>
  );
}

export default Bibliotheques;

