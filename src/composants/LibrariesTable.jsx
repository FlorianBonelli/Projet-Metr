import React from 'react';
import './LibrariesTable.css';

function LibrariesTable({
  libraries = [],
  selectionMode = false,
  selectedIds = [],
  onToggleSelect = () => { },
  onToggleFavorite = () => { },
  onEditArticle = () => { },
  onDeleteArticle = () => { },
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
          <span className="column-actions" aria-hidden="true"></span>
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
                <div className="actions-cell">
                  <button
                    type="button"
                    className="edit-button"
                    aria-label={`Modifier ${library.designation}`}
                    onClick={() => onEditArticle(library)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="delete-button"
                    aria-label={`Supprimer ${library.designation}`}
                    onClick={() => onDeleteArticle(library)}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m3 6 3 0" />
                      <path d="m19 6-3 0" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <path d="m10 11 0 6" />
                      <path d="m14 11 0 6" />
                      <path d="M5 6l1 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-14" />
                    </svg>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default LibrariesTable;

