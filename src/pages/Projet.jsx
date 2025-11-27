import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Projet.css';
import Sidebar from '../composants/Sidebar';
import CarteProjet from '../composants/CarteProjet';
import ModifProjet from '../composants/ModifProjet';
import { projectService } from '../db/database';
import IconPlus from '../assets/images/plus.svg';
import IconSearch from '../assets/images/search.svg';

function Projet() {
  const navigate = useNavigate();
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterEntreprise, setFilterEntreprise] = useState('all');
  const [filterAnnee, setFilterAnnee] = useState('all');
  const [showArchived, setShowArchived] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const [isModifModalOpen, setIsModifModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Charger les projets depuis la database
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      
      // Récupérer l'ID de l'utilisateur connecté depuis localStorage
      const userInfo = localStorage.getItem('userInfo');
      if (!userInfo) {
        console.error('Aucune information utilisateur trouvée');
        navigate('/connexion');
        return;
      }
      
      const userData = JSON.parse(userInfo);
      const userId = userData.id_utilisateur || userData.id;
      
      if (!userId) {
        console.error('ID utilisateur manquant');
        navigate('/connexion');
        return;
      }
      
      // Récupérer uniquement les projets de l'utilisateur connecté
      const userProjects = await projectService.getProjectsByUser(userId);
      setProjets(userProjects);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return `Créé le ${date.toLocaleDateString('fr-FR')}`;
  };

  // Fonction pour déterminer le type de statut
  const getStatusType = (status) => {
    if (!status) return 'active';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('cours')) return 'active';
    if (statusLower.includes('brouillon')) return 'brouillon';
    if (statusLower.includes('termin')) return 'termine';
    if (statusLower.includes('archiv')) return 'archive';
    return 'active';
  };

  // Filtrer les projets
  const filteredProjects = projets.filter(projet => {
    // Filtre recherche
    const matchSearch = !searchTerm || 
      projet.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      projet.client?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtre statut
    const matchStatus = filterStatus === 'all' || projet.status === filterStatus;

    // Filtre type
    const matchType = filterType === 'all' || projet.typologieProjet === filterType;

    // Filtre entreprise
    const matchEntreprise = filterEntreprise === 'all' || projet.client === filterEntreprise;

    // Filtre année
    let matchAnnee = true;
    if (filterAnnee !== 'all') {
      const projetYear = new Date(projet.dateCreation).getFullYear();
      matchAnnee = projetYear.toString() === filterAnnee;
    }

    // Filtre archivé
    const isArchived = projet.status?.toLowerCase().includes('archiv');
    const matchArchived = showArchived ? isArchived : !isArchived;

    return matchSearch && matchStatus && matchType && matchEntreprise && matchAnnee && matchArchived;
  });

  // Trier les projets
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.dateCreation) - new Date(a.dateCreation);
    }
    return 0;
  });

  // Calculer les statistiques
  const stats = {
    total: projets.length,
    actifs: projets.filter(p => !p.status?.toLowerCase().includes('archiv')).length,
    archives: projets.filter(p => p.status?.toLowerCase().includes('archiv')).length
  };

  // Récupérer les options uniques pour les filtres
  const uniqueTypes = [...new Set(projets.map(p => p.typologieProjet).filter(Boolean))];
  const uniqueEntreprises = [...new Set(projets.map(p => p.client).filter(Boolean))];
  const uniqueAnnees = [...new Set(projets.map(p => new Date(p.dateCreation).getFullYear()).filter(Boolean))];

  const handleCreateProject = () => {
    navigate('/creation-projet');
  };

  const handleEdit = (id) => {
    setSelectedProjectId(id);
    setIsModifModalOpen(true);
  };

  const handleDelete = async (id) => {
    await projectService.deleteProject(id);
    await loadProjects();
  };

  const handleCloseModifModal = () => {
    setIsModifModalOpen(false);
    setSelectedProjectId(null);
  };

  const handleProjectUpdated = (projectId, updatedData) => {
    // Met à jour la liste locale sans recharger toute la DB
    setProjets(prev =>
      prev.map(p => (p.id === projectId ? { ...p, ...updatedData } : p))
    );
  };

  const handleArchive = (projectId, updatedData = { status: 'Archivé' }) => {
    setProjets(prev =>
      prev.map(p => (p.id === projectId ? { ...p, ...updatedData } : p))
    );
  };

  const handleStatusChange = (projectId, newStatus) => {
    handleProjectUpdated(projectId, { status: newStatus });
  };

  return (
    <div className="projet-page">
      <Sidebar />
      <div className="projet-content page-padding">
      {/* Header */}
      <div className="projet-header">
        <h1 className="projet-title">MES PROJETS</h1>
        <button className="btn-create-project" onClick={handleCreateProject}>
          <img src={IconPlus} alt="Plus" className="icon-plus" />
          Créer un projet
        </button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="projet-filters">
        <div className="search-bar">
          <img src={IconSearch} alt="Rechercher" className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un projet ou un client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label>Trier par:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
              <option value="recent">Dernière modification</option>
              <option value="name">Nom</option>
            </select>
          </div>

          <div className="filter-group">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
              <option value="all">Tous les statuts</option>
              <option value="En cours">En cours</option>
              <option value="Brouillon">Brouillon</option>
              <option value="Terminé">Terminé</option>
            </select>
          </div>

          <div className="filter-group">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
              <option value="all">Tous les types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select value={filterEntreprise} onChange={(e) => setFilterEntreprise(e.target.value)} className="filter-select">
              <option value="all">Toutes les entreprises</option>
              {uniqueEntreprises.map(entreprise => (
                <option key={entreprise} value={entreprise}>{entreprise}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select value={filterAnnee} onChange={(e) => setFilterAnnee(e.target.value)} className="filter-select">
              <option value="all">Toutes les années</option>
              {uniqueAnnees.sort((a, b) => b - a).map(annee => (
                <option key={annee} value={annee}>{annee}</option>
              ))}
            </select>
          </div>

          <div className="toggle-archived">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="toggle-checkbox"
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">Afficher les projets archivés</span>
            </label>
          </div>
        </div>
      </div>

      {/* Grille de projets */}
      {loading ? (
        <div className="loading-message">Chargement des projets...</div>
      ) : sortedProjects.length === 0 ? (
        <div className="empty-message">
          <p>Aucun projet trouvé</p>
          <button className="btn-create-first" onClick={handleCreateProject}>
            Créer votre premier projet
          </button>
        </div>
      ) : (
        <div className="projets-grid">
          {sortedProjects.map(projet => (
            <CarteProjet
              key={projet.id}
              id={projet.id}
              title={projet.nom}
              subtitle={projet.client}
              date={formatDate(projet.dateCreation)}
              statusText={projet.status || 'En cours'}
              statusType={getStatusType(projet.status)}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onArchive={handleArchive}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}

      {/* Statistiques */}
      <div className="projet-stats">
        <div className="stat-card">
          <div className="stat-icon stat-icon-total">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11H15M9 15H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Nombre total de projets</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-active">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.actifs}</div>
            <div className="stat-label">Projets actifs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-archived">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 8H19M5 8C3.89543 8 3 8.89543 3 10V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V10C21 8.89543 20.1046 8 19 8M5 8L7 3H17L19 8M10 12H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.archives}</div>
            <div className="stat-label">Projets archivés</div>
          </div>
        </div>
      </div>

      <ModifProjet
        isOpen={isModifModalOpen}
        onClose={handleCloseModifModal}
        projectId={selectedProjectId}
        onProjectUpdated={handleProjectUpdated}
      />
      </div>
    </div>
  );
}

export default Projet;
