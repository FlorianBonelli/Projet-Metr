import React, { useState, useEffect } from 'react';
import './Dashbord.css';
import Sidebar from '../composants/Sidebar';
import CarteProjet from '../composants/CarteProjet';
import ModifProjet from '../composants/ModifProjet';
import { Link, useNavigate } from 'react-router-dom';
import Taches from '../composants/Taches';
import Stat from '../composants/Stat';
import { projectService } from '../db/database';
import { useOnboardingActions } from '../hooks/useOnboardingActions';
import LogoMetr from '../assets/images/Logo_Metr.png';

function Dashbord() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModifModalOpen, setIsModifModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const navigate = useNavigate();

  // Activer le hook d'onboarding
  useOnboardingActions();

  // Charger les projets depuis la base de données
  useEffect(() => {
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
        
        // Récupérer uniquement les projets récents de l'utilisateur connecté
        const projectsData = await projectService.getRecentProjects(5, userId); // Limiter à 4 projets pour le dashboard
        const activeProjects = projectsData.filter(p => !p.status?.toLowerCase().includes('archiv'));
        setProjects(activeProjects);
      } catch (err) {
        console.error('Erreur lors du chargement des projets:', err);
        setError('Erreur lors du chargement des projets');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [navigate]);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return `Créé le ${date.toLocaleDateString('fr-FR')}`;
  };

  // Fonction pour déterminer le type de statut pour le CSS
  const getStatusType = (status) => {
    switch (status?.toLowerCase()) {
      case 'en cours':
        return 'active';
      case 'terminé':
      case 'termine':
        return 'termine';
      case 'brouillon':
        return 'brouillon';
      default:
        return 'active';
    }
  };

  // Fonction pour gérer la suppression d'un projet
  const handleDeleteProject = (projectId) => {
    setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
  };

  // Fonction pour gérer l'archivage d'un projet
  const handleArchiveProject = (projectId) => {
    setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
  };

  // Fonction pour gérer la modification d'un projet
  const handleEditProject = (projectId) => {
    setSelectedProjectId(projectId);
    setIsModifModalOpen(true);
  };

  // Fonction pour fermer la modal de modification
  const handleCloseModifModal = () => {
    setIsModifModalOpen(false);
    setSelectedProjectId(null);
  };

  // Fonction appelée quand un projet est mis à jour
  const handleProjectUpdated = (projectId, updatedData) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === projectId 
          ? { ...project, ...updatedData }
          : project
      )
    );
  };

  // Mise à jour spécifique de l'état depuis la carte projet
  const handleStatusChange = (projectId, newStatus) => {
    handleProjectUpdated(projectId, { status: newStatus });
  };

  return (
    <div className="dashbord">
      <Sidebar />
      <div className="main-content page-padding">
      <div className="dashbord-content">
          {/* Header avec titre, logo et bouton alignés */}
          <div className="dashboard-header">
            <h2 className="page-title">MES PROJETS RÉCENTS</h2>
            <div className="header-right">
              <img src={LogoMetr} alt="Metr Logo" className="dashboard-logo" />
              <Link to="/creation-projet" className="create-project-btn">
                <span>+</span>
                Créer un projet
              </Link>
            </div>
          </div>
          
          <div className="cards-grid">
            {loading ? (
              <div className="loading-message">Chargement des projets...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : projects.length > 0 ? (
              <>
                {projects.map((project) => (
                  <CarteProjet
                    key={project.id}
                    id={project.id}
                    title={project.nom}
                    subtitle={project.client}
                    date={formatDate(project.dateCreation)}
                    statusText={project.status}
                    statusType={getStatusType(project.status)}
                    onDelete={project.isShared ? null : handleDeleteProject}
                    onEdit={project.userRole === 'lecture' ? null : handleEditProject}
                    onArchive={project.userRole === 'lecture' ? null : handleArchiveProject}
                    onStatusChange={project.userRole === 'lecture' ? null : handleStatusChange}
                    isShared={project.isShared}
                    userRole={project.userRole}
                  />
                ))}
                {/* Bouton "Voir plus" placé après les cartes */}
                <div className="cards-grid-more">
                  <Link to="/projet" className="projects-voir-more-grid">+ Voir plus</Link>
                </div>
              </>
            ) : (
              <div className="no-projects-message">
                <p>Aucun projet créé pour le moment.</p>
                <Link to="/creation-projet" className="create-first-project-btn">
                  Créer votre premier projet
                </Link>
              </div>
            )}
          </div>

          <div className="section-title-row">
            <h2 className="page-title">TÂCHES PRIORITAIRES</h2>
          </div>

          <Taches variant="dashboard" />

          <div className="section-title-row section-title-row-stats">
            <h2 className="page-title">MES STATISTIQUES</h2>
          </div>

          <Stat />
        </div>
      </div>
      
      {/* Modal de modification */}
      <ModifProjet
        isOpen={isModifModalOpen}
        onClose={handleCloseModifModal}
        projectId={selectedProjectId}
        onProjectUpdated={handleProjectUpdated}
      />
    </div>
  );
}

export default Dashbord;