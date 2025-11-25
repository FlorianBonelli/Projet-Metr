import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Sidebar from '../composants/Sidebar';
import LibrariesTable from '../composants/LibrariesTable';
import { libraryService, articleService } from '../db/database';
import './Bibliotheques.css';

const UNIT_OPTIONS = [
  { value: 'CM', label: 'Centimètre (CM)' },
  { value: 'ENS', label: 'Ensemble (ENS)' },
  { value: 'FORF', label: 'Forfait (FORF)' },
  { value: 'GR', label: 'Gramme (GR)' },
  { value: 'HA', label: 'Hectare (HA)' },
  { value: 'H', label: 'Heure (H)' },
  { value: 'J', label: 'Jour (J)' },
  { value: 'KG', label: 'Kilogramme (KG)' },
  { value: 'KM', label: 'Kilomètre (KM)' },
  { value: 'L', label: 'Litre (L)' },
  { value: 'M2', label: 'Mètre Carré (M2)' },
  { value: 'M3', label: 'Mètre Cube (M3)' },
  { value: 'ML', label: 'Mètre Linéaire (ML)' },
  { value: 'MOIS', label: 'Mois (MOIS)' },
  { value: 'PAIRE', label: 'Paire (PAIRE)' },
  { value: 'PCE', label: 'Pièce (PCE)' },
  { value: 'SEM', label: 'Semaine (SEM)' },
  { value: 'T', label: 'Tonne (T)' },
  { value: 'U', label: 'Unité (U)' },
];

const LOT_OPTIONS = [
  { value: '1 - TERRASSEMENTS GÉNÉRAUX', label: '1 - TERRASSEMENTS GÉNÉRAUX' },
  { value: '2 - GROS ŒUVRE - MAÇONNERIE', label: '2 - GROS ŒUVRE - MAÇONNERIE' },
  { value: '3 - MÉTALLERIE, FERRONNERIE', label: '3 - MÉTALLERIE, FERRONNERIE' },
  { value: '4 - PLÂTRERIE', label: '4 - PLÂTRERIE' },
  { value: '5 - ISOLATION', label: '5 - ISOLATION' },
  { value: '6 - CARRELAGES, REVÊTEMENTS', label: '6 - CARRELAGES, REVÊTEMENTS' },
  { value: '7 - SOLS SOUPLES', label: '7 - SOLS SOUPLES' },
  { value: '8 - PEINTURES', label: '8 - PEINTURES' },
  { value: '9 - MENUISERIES INTÉRIEURES', label: '9 - MENUISERIES INTÉRIEURES' },
  { value: '10 - MENUISERIES EXTÉRIEURES', label: '10 - MENUISERIES EXTÉRIEURES' },
  { value: '11 - ÉLECTRICITÉ COURANTS FORTS', label: '11 - ÉLECTRICITÉ COURANTS FORTS' },
  { value: '12 - PLOMBERIES SANITAIRES', label: '12 - PLOMBERIES SANITAIRES' },
  { value: '13 - COUVERTURE, ZINGUERIE', label: '13 - COUVERTURE, ZINGUERIE' },
  { value: '14 - ÉTANCHÉITÉ', label: '14 - ÉTANCHÉITÉ' },
  { value: '15 - STORES ET FERMETURES', label: '15 - STORES ET FERMETURES' },
  { value: '16 - VRD, ESPACES EXTÉRIEURS', label: '16 - VRD, ESPACES EXTÉRIEURS' },
];

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

const buildDefaultArticleForm = (libraryId = '') => ({
  designation: '',
  lot: '',
  subCategory: '',
  unit: '',
  price: '0',
  description: '',
  library: libraryId ? String(libraryId) : '',
});

function Bibliotheques() {
  const [libraryItems, setLibraryItems] = useState(initialLibraries);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [isManageLibrariesOpen, setIsManageLibrariesOpen] = useState(false);
  const [selectedLibrariesIds, setSelectedLibrariesIds] = useState([]);
  const [isDeleteLibrariesConfirmOpen, setIsDeleteLibrariesConfirmOpen] = useState(false);
  const [librariesArticleCount, setLibrariesArticleCount] = useState({});
  const [articleForm, setArticleForm] = useState(buildDefaultArticleForm());
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
  const [isUnitDropdownOpen, setIsUnitDropdownOpen] = useState(false);
  const [isLotDropdownOpen, setIsLotDropdownOpen] = useState(false);
  const [isLibraryDropdownOpen, setIsLibraryDropdownOpen] = useState(false);
  const [isLibrarySelectOpen, setIsLibrarySelectOpen] = useState(false);
  const [isLotFilterOpen, setIsLotFilterOpen] = useState(false);
  const [isSubCategoryFilterOpen, setIsSubCategoryFilterOpen] = useState(false);
  const [isUnitFilterOpen, setIsUnitFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ lot: '', subCategory: '', unit: '' });
  const unitDropdownRef = useRef(null);
  const lotDropdownRef = useRef(null);
  const libraryDropdownRef = useRef(null);
  const librarySelectRef = useRef(null);
  const lotFilterRef = useRef(null);
  const subCategoryFilterRef = useRef(null);
  const unitFilterRef = useRef(null);

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

  useEffect(() => {
    const anyDropdownOpen =
      isUnitDropdownOpen ||
      isLotDropdownOpen ||
      isLibraryDropdownOpen ||
      isLibrarySelectOpen ||
      isLotFilterOpen ||
      isSubCategoryFilterOpen ||
      isUnitFilterOpen;
    if (!anyDropdownOpen) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (unitDropdownRef.current && !unitDropdownRef.current.contains(event.target)) {
        setIsUnitDropdownOpen(false);
      }
      if (lotDropdownRef.current && !lotDropdownRef.current.contains(event.target)) {
        setIsLotDropdownOpen(false);
      }
      if (libraryDropdownRef.current && !libraryDropdownRef.current.contains(event.target)) {
        setIsLibraryDropdownOpen(false);
      }
      if (librarySelectRef.current && !librarySelectRef.current.contains(event.target)) {
        setIsLibrarySelectOpen(false);
      }
      if (lotFilterRef.current && !lotFilterRef.current.contains(event.target)) {
        setIsLotFilterOpen(false);
      }
      if (subCategoryFilterRef.current && !subCategoryFilterRef.current.contains(event.target)) {
        setIsSubCategoryFilterOpen(false);
      }
      if (unitFilterRef.current && !unitFilterRef.current.contains(event.target)) {
        setIsUnitFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [
    isUnitDropdownOpen,
    isLotDropdownOpen,
    isLibraryDropdownOpen,
    isLibrarySelectOpen,
    isLotFilterOpen,
    isSubCategoryFilterOpen,
    isUnitFilterOpen
  ]);

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

  const handleSelectLot = (lotValue) => {
    setArticleForm((prev) => ({ ...prev, lot: lotValue }));
    setIsLotDropdownOpen(false);
  };

  const handleSelectLibrary = (libraryId) => {
    setArticleForm((prev) => ({ ...prev, library: String(libraryId) }));
    setIsLibraryDropdownOpen(false);
  };

  const handleSelectUnit = (unitValue) => {
    setArticleForm((prev) => ({ ...prev, unit: unitValue }));
    setIsUnitDropdownOpen(false);
  };

  const handleFilterSelect = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
    setIsLotFilterOpen(false);
    setIsSubCategoryFilterOpen(false);
    setIsUnitFilterOpen(false);
  };

  // Obtenir les valeurs uniques pour les filtres
  const getUniqueValues = (field) => {
    const values = libraryItems.map(item => item[field]).filter(Boolean);
    return [...new Set(values)].sort();
  };

  // Filtrer les articles selon les filtres actifs
  const filteredItems = useMemo(() => {
    return libraryItems.filter(item => {
      const lotMatch = !filters.lot || item.lot === filters.lot;
      const subCategoryMatch = !filters.subCategory || item.subCategory === filters.subCategory;
      const unitMatch = !filters.unit || item.unit === filters.unit;
      return lotMatch && subCategoryMatch && unitMatch;
    });
  }, [libraryItems, filters]);

  const handleOpenAddArticle = () => {
    const initialLibraryId = selectedLibraryId !== 'all'
      ? String(selectedLibraryId)
      : (libraries[0]?.id ? String(libraries[0].id) : '');
    setArticleForm(buildDefaultArticleForm(initialLibraryId));
    setIsAddModalOpen(true);
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setArticleForm({
      designation: article.designation,
      lot: article.lot,
      subCategory: article.subCategory,
      unit: article.unit,
      price: article.price.replace(' €', ''),
      description: '',
      library: String(article.library_id || selectedLibraryId)
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteArticle = (article) => {
    setArticleToDelete(article);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    
    try {
      await articleService.deleteArticle(articleToDelete.id);
      await loadArticles(selectedLibraryId);
      setIsDeleteConfirmOpen(false);
      setArticleToDelete(null);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article :', error);
      alert('Impossible de supprimer l\'article. Veuillez réessayer.');
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setArticleToDelete(null);
  };

  const handleOpenManageLibraries = async () => {
    setIsManageLibrariesOpen(true);
    setSelectedLibrariesIds([]);
    
    // Charger le nombre d'articles pour chaque bibliothèque
    try {
      const counts = {};
      for (const library of libraries) {
        const articles = await articleService.getArticlesByLibrary(library.id);
        counts[library.id] = articles.length;
      }
      setLibrariesArticleCount(counts);
    } catch (error) {
      console.error('Erreur lors du chargement du nombre d\'articles :', error);
    }
  };

  const handleCloseManageLibraries = () => {
    setIsManageLibrariesOpen(false);
    setSelectedLibrariesIds([]);
    setLibrariesArticleCount({});
  };

  const handleToggleLibrarySelect = (libraryId) => {
    setSelectedLibrariesIds(prev => 
      prev.includes(libraryId)
        ? prev.filter(id => id !== libraryId)
        : [...prev, libraryId]
    );
  };

  const handleDeleteSelectedLibraries = () => {
    if (selectedLibrariesIds.length === 0) return;
    setIsDeleteLibrariesConfirmOpen(true);
  };

  const handleConfirmDeleteLibraries = async () => {
    try {
      for (const libraryId of selectedLibrariesIds) {
        await libraryService.deleteLibrary(libraryId);
      }
      await loadLibraries();
      await loadArticles(selectedLibraryId);
      setIsDeleteLibrariesConfirmOpen(false);
      setSelectedLibrariesIds([]);
      setLibrariesArticleCount({});
    } catch (error) {
      console.error('Erreur lors de la suppression des bibliothèques :', error);
      alert('Impossible de supprimer les bibliothèques. Veuillez réessayer.');
    }
  };

  const handleCancelDeleteLibraries = () => {
    setIsDeleteLibrariesConfirmOpen(false);
  };

  const handleCloseAddArticle = () => {
    setIsAddModalOpen(false);
    setArticleForm(buildDefaultArticleForm());
    setFormError('');
  };

  const handleCloseEditArticle = () => {
    setIsEditModalOpen(false);
    setEditingArticle(null);
    setArticleForm(buildDefaultArticleForm());
    setFormError('');
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setArticleForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitArticle = async (event) => {
    event.preventDefault();
    const { designation, lot, subCategory, unit, price } = articleForm;

    const targetLibraryId = articleForm.library || (selectedLibraryId !== 'all' ? String(selectedLibraryId) : '');
    if (!targetLibraryId) {
      setFormError('Veuillez sélectionner une bibliothèque spécifique.');
      return;
    }

    if (![designation, lot, subCategory, unit, price].every((field) => field && `${field}`.trim() !== '')) {
      setFormError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      const payload = {
        library_id: Number(targetLibraryId),
        designation,
        lot,
        sous_categorie: subCategory,
        unite: unit,
        prix_unitaire: parseFloat(price || '0'),
        description: articleForm.description,
      };

      if (editingArticle) {
        // Mode édition
        await articleService.updateArticle(editingArticle.id, payload);
        await loadArticles(selectedLibraryId);
        handleCloseEditArticle();
      } else {
        // Mode création
        await articleService.createArticle(payload);
        await loadArticles(selectedLibraryId);
        handleCloseAddArticle();
      }
    } catch (error) {
      console.error(editingArticle ? "Erreur lors de la modification de l'article :" : "Erreur lors de l'ajout de l'article :", error);
      setFormError(editingArticle ? "Impossible de modifier l'article. Veuillez réessayer." : "Impossible d'ajouter l'article. Veuillez réessayer.");
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
            <p>{filteredItems.length} articles trouvés</p>
          </div>

          <div className="header-actions">
            <button className="action-button ghost" onClick={handleOpenManageLibraries}>
              Gérer les bibliothèques <span aria-hidden="true">🔍</span>
            </button>
            <button className="action-button ghost" type="button" onClick={handleOpenImportLibrary}>
              Importer une bibliothèque
            </button>
          </div>
        </header>

        <section className="filters-panel">
          <div className="filters-row">
            <div className="filters-selects">
              <div className="select-wrapper wide" ref={librarySelectRef}>
                <label htmlFor="library-select">Bibliothèques</label>
                <div className={`dropdown ${isLibrarySelectOpen ? 'open' : ''}`}>
                  <button
                    id="library-select"
                    type="button"
                    className="dropdown-trigger"
                    onClick={() => setIsLibrarySelectOpen((prev) => !prev)}
                    aria-haspopup="listbox"
                    aria-expanded={isLibrarySelectOpen}
                  >
                    {selectedLibraryId === 'all'
                      ? `Toutes les bibliothèques (${libraryItems.length} articles)`
                      : libraries.find((library) => String(library.id) === String(selectedLibraryId))?.nom || 'Sélectionner une bibliothèque'}
                    <span aria-hidden="true" className="dropdown-caret">⌄</span>
                  </button>
                  {isLibrarySelectOpen && (
                    <ul className="dropdown-menu" role="listbox">
                      <li>
                        <button
                          type="button"
                          className={`dropdown-option ${selectedLibraryId === 'all' ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedLibraryId('all');
                            setIsLibrarySelectOpen(false);
                          }}
                        >
                          Toutes les bibliothèques ({libraryItems.length} articles)
                        </button>
                      </li>
                      {libraries.map((library) => (
                        <li key={library.id}>
                          <button
                            type="button"
                            className={`dropdown-option ${String(selectedLibraryId) === String(library.id) ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedLibraryId(String(library.id));
                              setIsLibrarySelectOpen(false);
                            }}
                          >
                            {library.nom}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
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
              <div className="filter-chip" ref={lotFilterRef}>
                <button 
                  className={`chip ${isLotFilterOpen ? 'active' : ''}`} 
                  type="button"
                  onClick={() => setIsLotFilterOpen(!isLotFilterOpen)}
                >
                  Lot {filters.lot && `(${filters.lot.split(' - ')[0]})`}
                  <span className="chip-caret">⌄</span>
                </button>
                {isLotFilterOpen && (
                  <div className="chip-dropdown">
                    <button 
                      className="chip-option" 
                      onClick={() => handleFilterSelect('lot', '')}
                    >
                      Tous les lots
                    </button>
                    {getUniqueValues('lot').map((lot) => (
                      <button 
                        key={lot}
                        className={`chip-option ${filters.lot === lot ? 'selected' : ''}`}
                        onClick={() => handleFilterSelect('lot', lot)}
                      >
                        {lot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="filter-chip" ref={subCategoryFilterRef}>
                <button 
                  className={`chip ${isSubCategoryFilterOpen ? 'active' : ''}`} 
                  type="button"
                  onClick={() => setIsSubCategoryFilterOpen(!isSubCategoryFilterOpen)}
                >
                  Sous-catégorie {filters.subCategory && `(${filters.subCategory})`}
                  <span className="chip-caret">⌄</span>
                </button>
                {isSubCategoryFilterOpen && (
                  <div className="chip-dropdown">
                    <button 
                      className="chip-option" 
                      onClick={() => handleFilterSelect('subCategory', '')}
                    >
                      Toutes les sous-catégories
                    </button>
                    {getUniqueValues('subCategory').map((subCategory) => (
                      <button 
                        key={subCategory}
                        className={`chip-option ${filters.subCategory === subCategory ? 'selected' : ''}`}
                        onClick={() => handleFilterSelect('subCategory', subCategory)}
                      >
                        {subCategory}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="filter-chip" ref={unitFilterRef}>
                <button 
                  className={`chip ${isUnitFilterOpen ? 'active' : ''}`} 
                  type="button"
                  onClick={() => setIsUnitFilterOpen(!isUnitFilterOpen)}
                >
                  Unité {filters.unit && `(${filters.unit})`}
                  <span className="chip-caret">⌄</span>
                </button>
                {isUnitFilterOpen && (
                  <div className="chip-dropdown">
                    <button 
                      className="chip-option" 
                      onClick={() => handleFilterSelect('unit', '')}
                    >
                      Toutes les unités
                    </button>
                    {getUniqueValues('unit').map((unit) => (
                      <button 
                        key={unit}
                        className={`chip-option ${filters.unit === unit ? 'selected' : ''}`}
                        onClick={() => handleFilterSelect('unit', unit)}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
              <button className="action-button primary" type="button" onClick={handleOpenAddArticle}>
                Ajouter un article
              </button>
            </div>
          </div>
        </section>

        <LibrariesTable
          libraries={filteredItems}
          selectionMode={isSelectionMode}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleFavorite={handleToggleFavorite}
          onEditArticle={handleEditArticle}
          onDeleteArticle={handleDeleteArticle}
        />
        {isArticlesLoading && <p className="loading-state">Chargement des articles…</p>}
        {(isAddModalOpen || isEditModalOpen) && (
          <div
            className="add-article-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-article-title"
            onClick={editingArticle ? handleCloseEditArticle : handleCloseAddArticle}
          >
            <div className="add-article-modal" onClick={(event) => event.stopPropagation()}>
              <header className="modal-header">
                <div>
                  <p className="modal-eyebrow">{editingArticle ? 'Modifier un article' : 'Ajouter un article'}</p>
                  <h2 id="add-article-title">{editingArticle ? 'Modifiez les informations' : 'Renseignez les informations'}</h2>
                  <p className="modal-subtitle">
                    {editingArticle ? 'Modifiez les champs ci-dessous pour mettre à jour l\'article.' : 'Remplissez les champs ci-dessous pour enrichir votre bibliothèque.'}
                  </p>
                </div>
                <button type="button" className="modal-close" aria-label="Fermer" onClick={editingArticle ? handleCloseEditArticle : handleCloseAddArticle}>
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

                  <div className="form-field dropdown-field" ref={lotDropdownRef}>
                    <span>Lot*</span>
                    <div className={`dropdown ${isLotDropdownOpen ? 'open' : ''}`}>
                      <button
                        type="button"
                        className="dropdown-trigger"
                        onClick={() => setIsLotDropdownOpen((prev) => !prev)}
                        aria-haspopup="listbox"
                        aria-expanded={isLotDropdownOpen}
                      >
                        {articleForm.lot || 'Sélectionner un lot'}
                        <span aria-hidden="true" className="dropdown-caret">⌄</span>
                      </button>
                      {isLotDropdownOpen && (
                        <ul className="dropdown-menu" role="listbox">
                          {LOT_OPTIONS.map((option) => (
                            <li key={option.value}>
                              <button
                                type="button"
                                onClick={() => handleSelectLot(option.value)}
                                className={`dropdown-option ${articleForm.lot === option.value ? 'active' : ''}`}
                              >
                                {option.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="form-field dropdown-field" ref={libraryDropdownRef}>
                    <span>Bibliothèque*</span>
                    <div className={`dropdown ${isLibraryDropdownOpen ? 'open' : ''}`}>
                      <button
                        type="button"
                        className="dropdown-trigger"
                        onClick={() => libraries.length && setIsLibraryDropdownOpen((prev) => !prev)}
                        aria-haspopup="listbox"
                        aria-expanded={isLibraryDropdownOpen}
                        disabled={libraries.length === 0}
                      >
                        {articleForm.library
                          ? libraries.find((library) => String(library.id) === String(articleForm.library))?.nom
                          : libraries.length === 0
                            ? 'Aucune bibliothèque disponible'
                            : 'Sélectionner une bibliothèque'}
                        <span aria-hidden="true" className="dropdown-caret">⌄</span>
                      </button>
                      {isLibraryDropdownOpen && libraries.length > 0 && (
                        <ul className="dropdown-menu" role="listbox">
                          {libraries.map((library) => (
                            <li key={library.id}>
                              <button
                                type="button"
                                onClick={() => handleSelectLibrary(library.id)}
                                className={`dropdown-option ${String(articleForm.library) === String(library.id) ? 'active' : ''}`}
                              >
                                {library.nom}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

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

                  <div className="form-field dropdown-field" ref={unitDropdownRef}>
                    <span>Unité*</span>
                    <div className={`dropdown ${isUnitDropdownOpen ? 'open' : ''}`}>
                      <button
                        type="button"
                        className="dropdown-trigger"
                        onClick={() => setIsUnitDropdownOpen((prev) => !prev)}
                        aria-haspopup="listbox"
                        aria-expanded={isUnitDropdownOpen}
                      >
                        {articleForm.unit
                          ? UNIT_OPTIONS.find((option) => option.value === articleForm.unit)?.label
                          : 'Sélectionner une unité'}
                        <span aria-hidden="true" className="dropdown-caret">⌄</span>
                      </button>
                      {isUnitDropdownOpen && (
                        <ul className="dropdown-menu" role="listbox">
                          {UNIT_OPTIONS.map((option) => (
                            <li key={option.value}>
                              <button
                                type="button"
                                onClick={() => handleSelectUnit(option.value)}
                                className={`dropdown-option ${articleForm.unit === option.value ? 'active' : ''}`}
                              >
                                {option.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

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
                    {editingArticle ? 'Modifier' : 'Confirmer'}
                  </button>
                  <button type="button" className="action-button ghost" onClick={editingArticle ? handleCloseEditArticle : handleCloseAddArticle}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {isManageLibrariesOpen && (
          <div
            className="add-article-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="manage-libraries-title"
            onClick={handleCloseManageLibraries}
          >
            <div className="manage-libraries-modal" onClick={(event) => event.stopPropagation()}>
              <header className="modal-header">
                <div>
                  <h2 id="manage-libraries-title">Gérer les bibliothèques</h2>
                  <p className="modal-subtitle">
                    Vous pouvez supprimer les bibliothèques dont vous n'avez plus besoin.
                  </p>
                </div>
                <button type="button" className="modal-close" aria-label="Fermer" onClick={handleCloseManageLibraries}>
                  ×
                </button>
              </header>
              
              <div className="libraries-table-container">
                <div className="libraries-table-header">
                  <span>Nom</span>
                  <span>Date de création</span>
                  <span>Articles</span>
                  <span></span>
                </div>
                
                <div className="libraries-table-body">
                  {libraries.map((library) => {
                    const articleCount = librariesArticleCount[library.id] || 0;
                    const isSelected = selectedLibrariesIds.includes(library.id);
                    
                    return (
                      <div key={library.id} className={`library-row ${isSelected ? 'selected' : ''}`}>
                        <span className="library-name">{library.nom}</span>
                        <span className="library-date">
                          {new Date(library.created_at).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="library-articles">{articleCount}</span>
                        <div className="library-checkbox">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleLibrarySelect(library.id)}
                            aria-label={`Sélectionner ${library.nom}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="manage-libraries-actions">
                {selectedLibrariesIds.length > 0 && (
                  <button
                    type="button"
                    className="action-button delete"
                    onClick={handleDeleteSelectedLibraries}
                  >
                    Supprimer ({selectedLibrariesIds.length})
                  </button>
                )}
                <button
                  type="button"
                  className="action-button ghost"
                  onClick={handleCloseManageLibraries}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
        {isDeleteConfirmOpen && articleToDelete && (
          <div
            className="add-article-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
            onClick={handleCancelDelete}
          >
            <div className="delete-confirm-modal" onClick={(event) => event.stopPropagation()}>
              <div className="delete-confirm-icon">
                <svg
                  width="48"
                  height="48"
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
              </div>
              <h2 id="delete-confirm-title">Supprimer cet article ?</h2>
              <p className="delete-confirm-description">
                Vous êtes sur le point de supprimer l'article <strong>"{articleToDelete.designation}"</strong>.
              </p>
              <p className="delete-confirm-warning">
                Cette action est irréversible et l'article sera définitivement supprimé de votre bibliothèque.
              </p>
              <div className="delete-confirm-actions">
                <button
                  type="button"
                  className="action-button ghost"
                  onClick={handleCancelDelete}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="action-button delete"
                  onClick={handleConfirmDelete}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}
        {isDeleteLibrariesConfirmOpen && (
          <div
            className="add-article-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-libraries-confirm-title"
            onClick={handleCancelDeleteLibraries}
          >
            <div className="delete-confirm-modal" onClick={(event) => event.stopPropagation()}>
              <div className="delete-confirm-icon">
                <svg
                  width="48"
                  height="48"
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
              </div>
              <h2 id="delete-libraries-confirm-title">Supprimer ces bibliothèques ?</h2>
              <p className="delete-confirm-description">
                Vous êtes sur le point de supprimer <strong>{selectedLibrariesIds.length} bibliothèque{selectedLibrariesIds.length > 1 ? 's' : ''}</strong>.
              </p>
              <p className="delete-confirm-warning">
                Cette action est irréversible et toutes les bibliothèques sélectionnées ainsi que leurs articles seront définitivement supprimés.
              </p>
              <div className="delete-confirm-actions">
                <button
                  type="button"
                  className="action-button ghost"
                  onClick={handleCancelDeleteLibraries}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="action-button delete"
                  onClick={handleConfirmDeleteLibraries}
                >
                  Supprimer
                </button>
              </div>
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

