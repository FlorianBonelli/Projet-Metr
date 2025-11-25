import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Sidebar from '../composants/Sidebar';
import LibrariesTable from '../composants/LibrariesTable';
import { libraryService, articleService } from '../db/database';
import './Bibliotheques.css';

const initialLibraries = [
  {
    id: 1,
    designation: 'Béton de fondation',
    tag: 'Nouveau',
    lot: '2 - GROS ŒUVRE - MAÇONNERIE',
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
    lot: '10 - MENUISERIES EXTÉRIEURES',
    subCategory: 'Fenêtre',
    unit: 'U',
    price: '425.00 €',
    updatedAt: '27/10/2025',
  },
  {
    id: 3,
    designation: 'Porte intérieure',
    tag: 'Nouveau',
    lot: '9 - MENUISERIES INTÉRIEURES',
    subCategory: 'Porte',
    unit: 'U',
    price: '235.00 €',
    updatedAt: '27/10/2025',
  },
  {
    id: 4,
    designation: 'Radiateur électrique',
    tag: 'Nouveau',
    lot: '11 - ÉLECTRICITÉ COURANTS FORTS',
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
    lot: '6 - CARRELAGES, REVÊTEMENTS',
    subCategory: 'Carrelage',
    unit: 'M2',
    price: '45.20 €',
    updatedAt: '27/10/2025',
  },
  {
    id: 7,
    designation: 'Terrassement général',
    tag: 'Nouveau',
    lot: '1 - TERRASSEMENTS GÉNÉRAUX',
    subCategory: 'Excavation',
    unit: 'M3',
    price: '35.00 €',
    updatedAt: '27/10/2025',
  },
  {
    id: 8,
    designation: 'Isolation thermique',
    tag: 'Nouveau',
    lot: '5 - ISOLATION',
    subCategory: 'Isolation',
    unit: 'M2',
    price: '25.80 €',
    updatedAt: '27/10/2025',
  },
];

const defaultArticleForm = {
  designation: '',
  lot: '',
  subCategory: '',
  unit: '',
  price: '0',
  description: '',
};

function Bibliotheques() {
  const [libraryItems, setLibraryItems] = useState(initialLibraries);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [articleForm, setArticleForm] = useState(defaultArticleForm);
  const [formError, setFormError] = useState('');
  const [libraries, setLibraries] = useState([]);
  const [selectedLibraryId, setSelectedLibraryId] = useState('all');
  const [isArticlesLoading, setIsArticlesLoading] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImportSubmitting, setIsImportSubmitting] = useState(false);
  const [importError, setImportError] = useState('');
  const [importForm, setImportForm] = useState({
    excelName: '',
    manualName: '',
    excelFile: null,
    fileName: '',
  });

  const loadLibraries = useCallback(async () => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const data = await libraryService.getAllLibraries();
      setLibraries(data);
    } catch (error) {
      console.error('Erreur lors du chargement des bibliothèques :', error);
    }
  }, []);

  const loadArticles = useCallback(async (libraryId) => {
    setIsArticlesLoading(true);
    try {
      let allArticles = [];
      
      if (libraryId === 'all') {
        // Récupérer tous les articles de toutes les bibliothèques en une seule requête
        allArticles = await articleService.getAllArticles();
      } else {
        // Récupérer les articles d'une bibliothèque spécifique
        allArticles = await articleService.getArticlesByLibrary(Number(libraryId));
      }

      const mapped = allArticles.map((article) => ({
        id: article.id,
        designation: article.designation,
        tag: article.statut,
        lot: article.lot,
        subCategory: article.sous_categorie,
        unit: article.unite,
        price: `${parseFloat(article.prix_unitaire).toFixed(2)} €`,
        updatedAt: new Date(article.updated_at || article.created_at).toLocaleDateString('fr-FR'),
        favorite: article.is_favorite,
      }));
      
      setLibraryItems(mapped);
    } catch (error) {
      console.error('Erreur lors du chargement des articles :', error);
      // En cas d'erreur, afficher les données par défaut seulement si c'est "all"
      if (libraryId === 'all') {
        setLibraryItems(initialLibraries);
      }
    } finally {
      setIsArticlesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLibraries();
  }, [loadLibraries]);

  useEffect(() => {
    loadArticles(selectedLibraryId);
  }, [loadArticles, selectedLibraryId]);

  const selectedLibrary = useMemo(() => {
    if (selectedLibraryId === 'all') return null;
    return libraries.find((lib) => String(lib.id) === String(selectedLibraryId)) || null;
  }, [libraries, selectedLibraryId]);

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

  const handleOpenAddArticle = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddArticle = () => {
    setIsAddModalOpen(false);
    setArticleForm(defaultArticleForm);
    setFormError('');
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setArticleForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitArticle = async (event) => {
    event.preventDefault();
    const { designation, lot, subCategory, unit, price } = articleForm;

    if (selectedLibraryId === 'all') {
      setFormError('Veuillez sélectionner une bibliothèque spécifique.');
      return;
    }

    if (![designation, lot, subCategory, unit, price].every((field) => field && `${field}`.trim() !== '')) {
      setFormError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      const payload = {
        library_id: Number(selectedLibraryId),
        designation,
        lot,
        sous_categorie: subCategory,
        unite: unit,
        prix_unitaire: parseFloat(price || '0'),
        description: articleForm.description,
      };

      await articleService.createArticle(payload);
      await loadArticles(selectedLibraryId);
      handleCloseAddArticle();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'article :", error);
      setFormError("Impossible d'ajouter l'article. Veuillez réessayer.");
    }
  };

  const handleOpenImportLibrary = () => {
    setIsImportModalOpen(true);
  };

  const handleCloseImportLibrary = () => {
    setIsImportModalOpen(false);
    setImportForm({ excelName: '', manualName: '', excelFile: null, fileName: '' });
    setImportError('');
    setIsImportSubmitting(false);
  };

  const handleImportInputChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'excelFile') {
      const file = files && files[0] ? files[0] : null;
      setImportForm((prev) => ({
        ...prev,
        excelFile: file,
        fileName: file?.name ?? '',
      }));
      return;
    }

    setImportForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImportSubmit = async (event) => {
    event.preventDefault();
    setImportError('');
    const libraryName = (importForm.excelName || importForm.manualName).trim();

    if (!libraryName) {
      setImportError('Veuillez renseigner un nom pour la bibliothèque.');
      return;
    }

    setIsImportSubmitting(true);
    try {
      await libraryService.createLibrary({ nom: libraryName });
      await loadLibraries();
      handleCloseImportLibrary();
    } catch (error) {
      console.error('Erreur lors de l\'import de la bibliothèque :', error);
      setImportError("Impossible d'importer la bibliothèque. Veuillez réessayer.");
    } finally {
      setIsImportSubmitting(false);
    }
  };

  return (
    <div className="bibliotheques-page">
      <Sidebar />

      <main className="bibliotheques-content page-padding">
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
                <select
                  id="library-select"
                  value={selectedLibraryId}
                  onChange={(event) => setSelectedLibraryId(event.target.value)}
                >
                  <option value="all">
                    Toutes les bibliothèques ({libraryItems.length} articles)
                  </option>
                  {libraries.map((library) => (
                    <option key={library.id} value={library.id}>
                      {library.nom}
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label="Ajouter une bibliothèque"
                onClick={handleOpenImportLibrary}
              >
                +
              </button>
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
              <button className="action-button ghost" type="button" onClick={handleOpenImportLibrary}>
                Importer une bibliothèque
              </button>
              <button className="action-button primary" type="button" onClick={handleOpenAddArticle}>
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
        {isArticlesLoading && <p className="loading-state">Chargement des articles…</p>}
        {isAddModalOpen && (
          <div
            className="add-article-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-article-title"
            onClick={handleCloseAddArticle}
          >
            <div className="add-article-modal" onClick={(event) => event.stopPropagation()}>
              <header className="modal-header">
                <div>
                  <p className="modal-eyebrow">Ajouter un article</p>
                  <h2 id="add-article-title">Renseignez les informations</h2>
                  <p className="modal-subtitle">
                    Remplissez les champs ci-dessous pour enrichir votre bibliothèque.
                  </p>
                </div>
                <button type="button" className="modal-close" aria-label="Fermer" onClick={handleCloseAddArticle}>
                  ×
                </button>
              </header>

              <form className="modal-form" onSubmit={handleSubmitArticle}>
                <div className="form-grid">
                  <label className="form-field" htmlFor="designation">
                    <span>Désignation*</span>
                    <input
                      id="designation"
                      name="designation"
                      type="text"
                      placeholder="Ex. Béton de fondation"
                      value={articleForm.designation}
                      onChange={handleFormChange}
                      required
                    />
                  </label>

                  <label className="form-field" htmlFor="lot">
                    <span>Lot*</span>
                    <select id="lot" name="lot" value={articleForm.lot} onChange={handleFormChange} required>
                      <option value="" disabled>
                        Sélectionner un lot
                      </option>
                      <option value="1 - TERRASSEMENTS GÉNÉRAUX">1 - TERRASSEMENTS GÉNÉRAUX</option>
                      <option value="2 - GROS ŒUVRE - MAÇONNERIE">2 - GROS ŒUVRE - MAÇONNERIE</option>
                      <option value="3 - MÉTALLERIE, FERRONNERIE">3 - MÉTALLERIE, FERRONNERIE</option>
                      <option value="4 - PLÂTRERIE">4 - PLÂTRERIE</option>
                      <option value="5 - ISOLATION">5 - ISOLATION</option>
                      <option value="6 - CARRELAGES, REVÊTEMENTS">6 - CARRELAGES, REVÊTEMENTS</option>
                      <option value="7 - SOLS SOUPLES">7 - SOLS SOUPLES</option>
                      <option value="8 - PEINTURES">8 - PEINTURES</option>
                      <option value="9 - MENUISERIES INTÉRIEURES">9 - MENUISERIES INTÉRIEURES</option>
                      <option value="10 - MENUISERIES EXTÉRIEURES">10 - MENUISERIES EXTÉRIEURES</option>
                      <option value="11 - ÉLECTRICITÉ COURANTS FORTS">11 - ÉLECTRICITÉ COURANTS FORTS</option>
                      <option value="12 - PLOMBERIES SANITAIRES">12 - PLOMBERIES SANITAIRES</option>
                      <option value="13 - COUVERTURE, ZINGUERIE">13 - COUVERTURE, ZINGUERIE</option>
                      <option value="14 - ÉTANCHÉITÉ">14 - ÉTANCHÉITÉ</option>
                      <option value="15 - STORES ET FERMETURES">15 - STORES ET FERMETURES</option>
                      <option value="16 - VRD, ESPACES EXTÉRIEURS">16 - VRD, ESPACES EXTÉRIEURS</option>
                    </select>
                  </label>

                  <label className="form-field" htmlFor="library">
                    <span>Bibliothèque*</span>
                    <select id="library" name="library" value={articleForm.library} onChange={handleFormChange} required>
                      <option value="default">Bibliothèque par défaut</option>
                      <option value="favoris">Bibliothèque Favoris</option>
                      <option value="fournisseurs">Fournisseurs externes</option>
                    </select>
                  </label>

                  <label className="form-field" htmlFor="subCategory">
                    <span>Sous-catégorie*</span>
                    <input
                      id="subCategory"
                      name="subCategory"
                      type="text"
                      placeholder="Sélectionner ou créer"
                      value={articleForm.subCategory}
                      onChange={handleFormChange}
                      required
                    />
                  </label>

                  <label className="form-field" htmlFor="unit">
                    <span>Unité*</span>
                    <select id="unit" name="unit" value={articleForm.unit} onChange={handleFormChange} required>
                      <option value="" disabled>
                        Sélectionner une unité
                      </option>
                      <option value="M3">M3</option>
                      <option value="M2">M2</option>
                      <option value="U">Unité</option>
                      <option value="L">Litre</option>
                    </select>
                  </label>

                  <label className="form-field" htmlFor="price">
                    <span>Prix unitaire HT*</span>
                    <div className="price-input">
                      <input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={articleForm.price}
                        onChange={handleFormChange}
                        required
                      />
                      <span className="price-suffix">€</span>
                    </div>
                  </label>
                </div>

                <label className="form-field" htmlFor="description">
                  <span>Description technique</span>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    placeholder="Ajoutez des détails techniques, des références fournisseur, etc."
                    value={articleForm.description}
                    onChange={handleFormChange}
                  />
                </label>

                {formError && <p className="form-error" role="alert">{formError}</p>}

                <div className="modal-actions">
                  <button type="submit" className="action-button primary">
                    Confirmer
                  </button>
                  <button type="button" className="action-button ghost" onClick={handleCloseAddArticle}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {isImportModalOpen && (
          <div
            className="add-article-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="import-library-title"
            onClick={handleCloseImportLibrary}
          >
            <div className="import-library-modal" onClick={(event) => event.stopPropagation()}>
              <header className="modal-header">
                <div>
                  <p className="modal-eyebrow">Importer une bibliothèque</p>
                  <h2 id="import-library-title">Sélectionnez un format d'import</h2>
                  <p className="modal-subtitle">
                    Ajoutez une nouvelle bibliothèque via un fichier Excel/CSV ou créez une structure vide.
                  </p>
                </div>
                <button type="button" className="modal-close" aria-label="Fermer" onClick={handleCloseImportLibrary}>
                  ×
                </button>
              </header>

              <form className="modal-form" onSubmit={handleImportSubmit}>
                <section className="modal-section">
                  <h3>Fichier Excel</h3>
                  <p className="modal-info">Supports : .xlsx, .xls, .csv</p>
                  <label className="form-field" htmlFor="excel-name">
                    <span>Nom de la bibliothèque</span>
                    <input
                      id="excel-name"
                      name="excelName"
                      type="text"
                      placeholder="Ex. Bibliothèque Marché 2025"
                      value={importForm.excelName}
                      onChange={handleImportInputChange}
                    />
                  </label>

                  <label className="dropzone" htmlFor="excel-file">
                    <input
                      id="excel-file"
                      name="excelFile"
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleImportInputChange}
                    />
                    <span className="dropzone-icon" aria-hidden="true">⬆</span>
                    <p>{importForm.fileName || 'Glissez-déposez votre fichier ou cliquez pour sélectionner'}</p>
                    <small>Le fichier doit contenir : designation, lot, sousCategorie, unite, prix_unitaire.</small>
                  </label>
                </section>

                <section className="modal-section">
                  <h3>Autre format</h3>
                  <p className="modal-info">Crée une bibliothèque vide à remplir manuellement.</p>
                  <label className="form-field" htmlFor="manual-name">
                    <span>Nom de la bibliothèque</span>
                    <input
                      id="manual-name"
                      name="manualName"
                      type="text"
                      placeholder="Ex. Fournisseurs internes"
                      value={importForm.manualName}
                      onChange={handleImportInputChange}
                    />
                  </label>
                </section>

                {importError && <p className="form-error" role="alert">{importError}</p>}

                <div className="modal-actions">
                  <button type="submit" className="action-button primary" disabled={isImportSubmitting}>
                    {isImportSubmitting ? 'Import en cours…' : 'Confirmer'}
                  </button>
                  <button type="button" className="action-button ghost" onClick={handleCloseImportLibrary}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Bibliotheques;

