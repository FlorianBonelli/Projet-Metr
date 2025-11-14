import React from 'react';
import './LibrariesTable.css';

function LibrariesTable({
  libraries = [],
  selectionMode = false,
  selectedIds = [],
  onToggleSelect = () => {},
  onToggleFavorite = () => {},
}) {
  return (
    <section className="libraries-table" aria-label="Liste des bibliothèques">
      <div className={`table-container ${selectionMode ? 'selection-mode' : ''}`}>
        <div className="table-header">
          <span className="column-select" aria-hidden="true"></span>
          <span>Désignation</span>
          <span>Lot</span>
          <span>Sous-catégorie</span>
          <span>Unité</span>
          <span>Prix unitaire</span>
          <span>Dernière mise à jour</span>
        </div>

        <ul className="table-body">
          {libraries.map((library) => {
            const isSelected = selectedIds.includes(library.id);

            return (
              <li
                key={library.id}
                className={`table-row ${isSelected ? 'selected' : ''}`.trim()}
              >
                <div className="select-cell">
                  <input
                    type="checkbox"
                    aria-label={`Sélectionner ${library.designation}`}
                    checked={isSelected}
                    onChange={() => onToggleSelect(library.id)}
                  />
                </div>

                <div className="designation-cell">
                  <button
                    type="button"
                    className={`star-button ${library.favorite ? 'active' : ''}`.trim()}
                    aria-label={`Basculer ${library.designation} en favori`}
                    aria-pressed={library.favorite}
                    onClick={() => onToggleFavorite(library.id)}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={library.favorite ? '#f6b900' : 'none'}
                      stroke={library.favorite ? '#f6b900' : '#9aa3c5'}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="star-icon"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                  <div className="designation-info">
                    <span className="label">{library.designation}</span>
                    {library.tag && <span className="tag">{library.tag}</span>}
                  </div>
                </div>
                <span className="lot-cell" data-label="Lot">{library.lot}</span>
                <span data-label="Sous-catégorie">{library.subCategory}</span>
                <span data-label="Unité">{library.unit}</span>
                <span data-label="Prix unitaire">{library.price}</span>
                <span data-label="Dernière mise à jour">{library.updatedAt}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default LibrariesTable;

